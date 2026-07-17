import { NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { crearClienteMercadoPago } from "@/lib/mercadopago/client";
import { crearClienteSupabaseAdmin } from "@/lib/supabase/admin";
import { urlDeVueltaMercadoPago } from "@/lib/mercadopago/backUrl";
import { AUTO_RECURRING_SUSCRIPCION, RAZON_SUSCRIPCION } from "@/lib/mercadopago/plan";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No hay sesión activa." }, { status: 401 });
  }

  const cliente = crearClienteMercadoPago();
  const preApproval = new PreApproval(cliente);

  let respuesta;
  try {
    respuesta = await preApproval.create({
      body: {
        reason: RAZON_SUSCRIPCION,
        auto_recurring: AUTO_RECURRING_SUSCRIPCION,
        payer_email: user.email!,
        // Clave: esto es lo unico que le permite al webhook, mas adelante,
        // saber a que usuario de Supabase corresponde la notificacion.
        external_reference: user.id,
        back_url: urlDeVueltaMercadoPago("/suscripcion/confirmacion"),
        status: "pending",
      },
    });
  } catch (error) {
    console.error(
      "Error crudo de Mercado Pago al crear la PreApproval:",
      JSON.stringify(error, null, 2),
    );
    throw error;
  }

  if (!respuesta.init_point) {
    return NextResponse.json(
      { error: "Mercado Pago no devolvió un link de checkout." },
      { status: 502 },
    );
  }

  // Registramos la suscripcion como "pending" con su id de Mercado Pago apenas
  // se crea la PreApproval, para que el estado exista desde el minuto cero.
  // Se escribe con service_role porque la RLS de subscriptions no habilita al
  // propio usuario a escribir esta tabla (solo el servidor decide este dato).
  //
  // Guardarrail anti-clobber: NUNCA degradar a alguien que ya esta "active"
  // (por ejemplo si reintenta el boton "Suscribirme"); cualquier otro estado
  // previo -o ninguno- si puede pasar a "pending".
  //
  // Un fallo de persistencia aca NO debe romper el checkout: se loguea y se
  // devuelve el init_point igual.
  try {
    const admin = crearClienteSupabaseAdmin();
    const { data: filaActual } = await admin
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (filaActual?.status !== "active") {
      const { error: errorPersistencia } = await admin.from("subscriptions").upsert(
        {
          user_id: user.id,
          mercadopago_subscription_id: respuesta.id,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (errorPersistencia) {
        console.error(
          "No se pudo persistir la suscripción pending (se continúa igual):",
          errorPersistencia,
        );
      }
    }
  } catch (error) {
    console.error(
      "Error inesperado persistiendo la suscripción pending (se continúa igual):",
      error,
    );
  }

  return NextResponse.json({ init_point: respuesta.init_point });
}

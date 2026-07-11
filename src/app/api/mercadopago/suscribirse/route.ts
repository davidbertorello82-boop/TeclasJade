import { NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { crearClienteMercadoPago } from "@/lib/mercadopago/client";
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

  return NextResponse.json({ init_point: respuesta.init_point });
}

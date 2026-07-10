import { NextResponse, type NextRequest } from "next/server";
import {
  PreApproval,
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";
import { crearClienteMercadoPago } from "@/lib/mercadopago/client";
import { crearClienteSupabaseAdmin } from "@/lib/supabase/admin";
import {
  mapearEstadoMercadoPago,
  EstadoMercadoPagoDesconocido,
} from "@/lib/mercadopago/estados";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dataId = searchParams.get("data.id");

  // 1) Verificar que la notificacion realmente viene de Mercado Pago, antes
  // de tocar cualquier otra cosa.
  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET!,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      console.error("Webhook de Mercado Pago con firma inválida:", error.reason);
      return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
    }
    throw error;
  }

  const tipoNotificacion = searchParams.get("type");
  if (tipoNotificacion !== "subscription_preapproval" || !dataId) {
    // Otros tipos de notificacion (pagos sueltos, etc.) no nos interesan en
    // esta fase - se responde 200 igual, para que Mercado Pago no reintente
    // algo que no vamos a procesar.
    return NextResponse.json({ recibido: true });
  }

  // 2) No confiar en el cuerpo del webhook: volver a preguntarle a la propia
  // API de Mercado Pago cual es el estado real de esta suscripcion.
  const cliente = crearClienteMercadoPago();
  const preApproval = new PreApproval(cliente);
  const suscripcion = await preApproval.get({ id: dataId });

  const userId = suscripcion.external_reference;
  if (!userId) {
    console.error(
      "PreApproval sin external_reference, no se puede asociar a un usuario:",
      dataId,
    );
    return NextResponse.json(
      { error: "Suscripción sin external_reference." },
      { status: 422 },
    );
  }

  let estado;
  try {
    estado = mapearEstadoMercadoPago(suscripcion.status);
  } catch (error) {
    if (error instanceof EstadoMercadoPagoDesconocido) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }

  // 3) Recien aca se escribe en Supabase, con la clave que salta RLS a
  // propósito porque es el servidor (no el usuario) quien decide este dato.
  const admin = crearClienteSupabaseAdmin();

  const { error: errorSubscriptions } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        mercadopago_subscription_id: suscripcion.id,
        status: estado,
        next_billing_date: suscripcion.next_payment_date ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  if (errorSubscriptions) {
    console.error("Error escribiendo en subscriptions:", errorSubscriptions);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }

  const { error: errorUsers } = await admin
    .from("users")
    .update({ subscription_status: estado })
    .eq("id", userId);

  if (errorUsers) {
    console.error("Error espejando users.subscription_status:", errorUsers);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }

  return NextResponse.json({ recibido: true });
}

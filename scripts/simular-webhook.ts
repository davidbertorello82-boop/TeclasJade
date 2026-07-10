// Prueba de punta a punta la LOGICA del webhook de Mercado Pago sin
// necesitar una URL publica (Mercado Pago no puede llamar a localhost).
//
// Que hace:
//   1. Crea una PreApproval real (via API, sin pasar por el checkout del
//      navegador) con external_reference = un user_id real de tu tabla
//      public.users, para tener un id real de Mercado Pago para consultar.
//   2. Arma una notificacion como la que mandaria Mercado Pago, y la firma
//      con el MISMO algoritmo que usa WebhookSignatureValidator (HMAC-SHA256
//      sobre "id:...;request-id:...;ts:...;"), usando el valor que tengas
//      en MERCADOPAGO_WEBHOOK_SECRET (podes poner cualquier string ahi por
//      ahora - se reemplaza por el secreto real cuando configuremos el
//      webhook de verdad en el panel de Mercado Pago, en la Fase 8).
//   3. La manda por POST a tu servidor local y muestra la respuesta.
//   4. Repite el envio con una firma incorrecta a proposito, para confirmar
//      que el webhook la rechaza.
//   5. Lee de nuevo la fila de subscriptions en Supabase para confirmar que
//      quedo escrita.
//
// Correlo con el servidor de desarrollo levantado (npm run dev) en otra
// terminal:
//   npx tsx scripts/simular-webhook.ts
process.loadEnvFile(".env.local");

import crypto from "node:crypto";
import { PreApproval } from "mercadopago";
import { crearClienteMercadoPago } from "../src/lib/mercadopago/client";
import { urlDeVueltaMercadoPago } from "../src/lib/mercadopago/backUrl";
import { AUTO_RECURRING_SUSCRIPCION, RAZON_SUSCRIPCION } from "../src/lib/mercadopago/plan";
import { crearClienteSupabaseAdmin } from "../src/lib/supabase/admin";

const URL_LOCAL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`;

function firmar(dataId: string, requestId: string, secreto: string) {
  const ts = Date.now().toString();
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = crypto.createHmac("sha256", secreto).update(manifest).digest("hex");
  return `ts=${ts},v1=${hash}`;
}

async function enviarNotificacion(
  dataId: string,
  opciones: { firmaValida: boolean },
) {
  const requestId = crypto.randomUUID();
  const secreto = opciones.firmaValida
    ? process.env.MERCADOPAGO_WEBHOOK_SECRET!
    : "un-secreto-incorrecto-a-proposito";
  const xSignature = firmar(dataId, requestId, secreto);

  const url = `${URL_LOCAL}?type=subscription_preapproval&data.id=${dataId}`;
  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "x-signature": xSignature,
      "x-request-id": requestId,
      "content-type": "application/json",
    },
    body: JSON.stringify({ action: "updated", data: { id: dataId } }),
  });

  console.log(
    `  → POST ${opciones.firmaValida ? "(firma válida)" : "(firma INVÁLIDA a propósito)"}: ${respuesta.status}`,
    await respuesta.json().catch(() => ({})),
  );
  return respuesta.status;
}

async function main() {
  if (!process.env.MERCADOPAGO_WEBHOOK_SECRET) {
    throw new Error(
      "MERCADOPAGO_WEBHOOK_SECRET está vacío en .env.local. Poné cualquier " +
        "valor temporal ahí (se reemplaza por el real en la Fase 8) y volvé a correr este script.",
    );
  }

  const admin = crearClienteSupabaseAdmin();
  const { data: usuario, error: errorUsuario } = await admin
    .from("users")
    .select("id, email")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorUsuario || !usuario) {
    throw new Error(
      "No encontré ningún usuario en public.users. Registrate una vez en " +
        "/registro antes de correr esta simulación.",
    );
  }
  console.log(`1) Usando usuario de prueba (Supabase): ${usuario.email} (${usuario.id})`);

  // Mercado Pago rechaza "Payer and collector cannot be the same user": el
  // payer_email no puede ser la cuenta dueña del MERCADOPAGO_ACCESS_TOKEN
  // (que es la cuenta real del vendedor, no un test user). Usamos otro email
  // real como comprador para que MP los trate como personas distintas.
  const emailComprador = "esponja.lisergica@gmail.com";
  console.log(`   Comprador (email real distinto del vendedor): ${emailComprador}`);

  console.log("2) Creando una PreApproval real en Mercado Pago...");
  const cliente = crearClienteMercadoPago();
  const preApproval = new PreApproval(cliente);
  const suscripcion = await preApproval.create({
    body: {
      reason: RAZON_SUSCRIPCION,
      auto_recurring: AUTO_RECURRING_SUSCRIPCION,
      payer_email: emailComprador,
      external_reference: usuario.id,
      back_url: urlDeVueltaMercadoPago("/suscripcion/confirmacion"),
      status: "pending",
    },
  });
  console.log(`   id real de Mercado Pago: ${suscripcion.id} (status: ${suscripcion.status})`);

  console.log("3) Mandando notificación con firma VÁLIDA...");
  const statusValida = await enviarNotificacion(suscripcion.id!, { firmaValida: true });

  console.log("4) Mandando notificación con firma INVÁLIDA (debe rechazarse)...");
  const statusInvalida = await enviarNotificacion(suscripcion.id!, { firmaValida: false });

  console.log("5) Releyendo subscriptions en Supabase...");
  const { data: fila } = await admin
    .from("subscriptions")
    .select("status, mercadopago_subscription_id, next_billing_date")
    .eq("user_id", usuario.id)
    .maybeSingle();
  console.log("   Fila actual:", fila);

  console.log("\nResumen:");
  console.log(`   Firma válida → esperado 200, obtuve ${statusValida}`);
  console.log(`   Firma inválida → esperado 401, obtuve ${statusInvalida}`);
  console.log(
    `   subscriptions.status quedó en "${fila?.status}" (la PreApproval de prueba` +
      ` queda en "pending" porque no pasó por un checkout real con tarjeta).`,
  );
}

main().catch((error) => {
  console.error("Error en la simulación:", error);
  process.exit(1);
});

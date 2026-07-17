import "server-only";
import { PreApproval } from "mercadopago";
import { crearClienteMercadoPago } from "@/lib/mercadopago/client";
import { crearClienteSupabaseAdmin } from "@/lib/supabase/admin";
import { resolverReconciliacion } from "@/lib/mercadopago/reconciliar-core";
import type { EstadoSuscripcion } from "@/lib/mercadopago/estados";

// Reconciliación lazy de una suscripción: si el estado local es "pending",
// consulta el estado real en Mercado Pago (GET /preapproval/{id}, solo lectura)
// y actualiza subscriptions si corresponde. Reglas:
//  - Solo consulta a Mercado Pago cuando el estado local es "pending" (sin
//    throttle: consulta cada vez).
//  - No escribe si no cambia el estado ni la next_billing_date.
//  - Ante cualquier error de Mercado Pago, conserva "pending" y no rompe la
//    página que la llama.
//  - Solo servidor (service_role para escribir subscriptions). NUNCA modifica
//    users.subscription_status.
// Devuelve el estado resultante (o el local si no hubo cambios / hubo error).
export async function reconciliarSuscripcion(
  userId: string,
): Promise<EstadoSuscripcion> {
  const admin = crearClienteSupabaseAdmin();

  const { data: fila } = await admin
    .from("subscriptions")
    .select("status, mercadopago_subscription_id, next_billing_date")
    .eq("user_id", userId)
    .maybeSingle();

  const estadoLocal = (fila?.status ?? "inactive") as EstadoSuscripcion;

  // Sin fila pending o sin id de Mercado Pago no hay nada que consultar.
  if (estadoLocal !== "pending" || !fila?.mercadopago_subscription_id) {
    return estadoLocal;
  }

  try {
    const cliente = crearClienteMercadoPago();
    const preApproval = new PreApproval(cliente);
    const suscripcion = await preApproval.get({
      id: fila.mercadopago_subscription_id,
    });

    const resultado = resolverReconciliacion({
      estadoLocal,
      estadoMPCrudo: suscripcion.status,
      nextBillingDateLocal: fila.next_billing_date ?? null,
      nextBillingDateMP: suscripcion.next_payment_date ?? null,
    });

    if (resultado.accion === "skip") {
      return estadoLocal;
    }

    const { error } = await admin
      .from("subscriptions")
      .update({
        status: resultado.nuevoEstado,
        next_billing_date: resultado.nextBillingDate,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error(
        "No se pudo actualizar la suscripción reconciliada (se conserva local):",
        error,
      );
      return estadoLocal;
    }

    return resultado.nuevoEstado;
  } catch (error) {
    console.error(
      "No se pudo reconciliar la suscripción con Mercado Pago (se conserva pending):",
      userId,
      error,
    );
    return estadoLocal; // "pending"
  }
}

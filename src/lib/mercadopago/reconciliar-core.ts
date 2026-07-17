// Núcleo puro de la reconciliación lazy de suscripciones. SOLO lógica pura:
// ningún import de server-only, Next, Supabase ni del SDK de Mercado Pago.
// Reutiliza el mapa de estados (módulo puro, sin SDK) para no duplicarlo.
import {
  mapearEstadoMercadoPago,
  EstadoMercadoPagoDesconocido,
  type EstadoSuscripcion,
} from "./estados";

export type EntradaReconciliacion = {
  estadoLocal: EstadoSuscripcion;
  estadoMPCrudo: string | undefined;
  nextBillingDateLocal: string | null;
  nextBillingDateMP: string | null;
};

export type ResultadoReconciliacion =
  | { accion: "skip"; motivo: "no_pending" | "estado_desconocido" | "sin_cambios" }
  | {
      accion: "actualizar";
      nuevoEstado: EstadoSuscripcion;
      nextBillingDate: string | null;
    };

// Decide si reconciliar una fila "pending" contra el estado real de Mercado
// Pago, evitando escrituras innecesarias: si sigue "pending" y no hay datos
// nuevos (misma next_billing_date), no se escribe.
export function resolverReconciliacion(
  entrada: EntradaReconciliacion,
): ResultadoReconciliacion {
  // Solo reconciliamos suscripciones locales en "pending".
  if (entrada.estadoLocal !== "pending") {
    return { accion: "skip", motivo: "no_pending" };
  }

  let nuevoEstado: EstadoSuscripcion;
  try {
    nuevoEstado = mapearEstadoMercadoPago(entrada.estadoMPCrudo);
  } catch (error) {
    // Estado nuevo/desconocido de Mercado Pago: no corromper el estado local.
    if (error instanceof EstadoMercadoPagoDesconocido) {
      return { accion: "skip", motivo: "estado_desconocido" };
    }
    throw error;
  }

  const sinCambioEstado = nuevoEstado === entrada.estadoLocal;
  const sinCambioFecha =
    (entrada.nextBillingDateMP ?? null) === (entrada.nextBillingDateLocal ?? null);
  if (sinCambioEstado && sinCambioFecha) {
    return { accion: "skip", motivo: "sin_cambios" };
  }

  return {
    accion: "actualizar",
    nuevoEstado,
    nextBillingDate: entrada.nextBillingDateMP ?? null,
  };
}

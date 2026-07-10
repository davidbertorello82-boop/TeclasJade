// Los CHECK constraints de subscriptions.status y users.subscription_status
// (migracion de la Fase 1) solo aceptan 'inactive' | 'active' | 'cancelled' |
// 'pending'. Mercado Pago devuelve otro vocabulario ('authorized', 'paused',
// etc.) para PreApproval.status - hay que traducirlo antes de escribir en
// Supabase, o el INSERT/UPDATE lo rechaza.
export type EstadoSuscripcion = "inactive" | "active" | "cancelled" | "pending";

const MAPA_ESTADOS_MP: Record<string, EstadoSuscripcion> = {
  authorized: "active",
  paused: "inactive",
  cancelled: "cancelled",
  pending: "pending",
};

export class EstadoMercadoPagoDesconocido extends Error {
  constructor(public readonly estadoOriginal: string) {
    super(
      `Estado de Mercado Pago sin mapeo conocido: "${estadoOriginal}". ` +
        "No se escribe nada en Supabase para evitar guardar un estado incorrecto.",
    );
    this.name = "EstadoMercadoPagoDesconocido";
  }
}

export function mapearEstadoMercadoPago(
  estadoMp: string | undefined,
): EstadoSuscripcion {
  if (!estadoMp || !(estadoMp in MAPA_ESTADOS_MP)) {
    throw new EstadoMercadoPagoDesconocido(estadoMp ?? "undefined");
  }
  return MAPA_ESTADOS_MP[estadoMp];
}

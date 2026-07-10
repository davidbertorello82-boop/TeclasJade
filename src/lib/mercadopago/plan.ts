// Mercado Pago no permite redirigir a un checkout de PreApproval asociada a
// un Plan (preapproval_plan_id) sin ya tener un card_token_id (tarjeta
// tokenizada de antemano) y status "authorized" - ver
// https://www.mercadopago.com.co/developers/en/docs/subscriptions/integration-configuration/subscription-associated-plan
// Como nosotros queremos redirigir al usuario al checkout de Mercado Pago
// para que cargue la tarjeta ahi (sin Bricks en el frontend), usamos el
// flujo de suscripcion SIN plan asociado: se manda auto_recurring completo
// en cada PreApproval y Mercado Pago devuelve un init_point real.
export const RAZON_SUSCRIPCION = "Teclas Jade — Suscripción mensual";

export const AUTO_RECURRING_SUSCRIPCION = {
  frequency: 1,
  frequency_type: "months" as const,
  transaction_amount: 14900,
  currency_id: "ARS" as const,
  billing_day_proportional: false,
};

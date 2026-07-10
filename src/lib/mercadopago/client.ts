import { MercadoPagoConfig } from "mercadopago";

export function crearClienteMercadoPago() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}

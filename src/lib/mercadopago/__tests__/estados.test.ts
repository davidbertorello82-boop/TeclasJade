import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapearEstadoMercadoPago,
  EstadoMercadoPagoDesconocido,
} from "../estados";

// Prueba pura, sin red ni Supabase ni Mercado Pago: valida el traductor de
// estados que usa el webhook. El caso "desconocido" es la base de la politica
// 422 + log del webhook (un estado sin mapeo lanza el error tipado y el route
// responde 422 sin escribir nada).

test("mapea los 4 estados conocidos de Mercado Pago", () => {
  assert.equal(mapearEstadoMercadoPago("authorized"), "active");
  assert.equal(mapearEstadoMercadoPago("paused"), "inactive");
  assert.equal(mapearEstadoMercadoPago("cancelled"), "cancelled");
  assert.equal(mapearEstadoMercadoPago("pending"), "pending");
});

test("lanza EstadoMercadoPagoDesconocido ante un estado sin mapeo", () => {
  assert.throws(
    () => mapearEstadoMercadoPago("un_estado_nuevo_de_mp"),
    EstadoMercadoPagoDesconocido,
  );
});

test("lanza EstadoMercadoPagoDesconocido ante undefined", () => {
  assert.throws(
    () => mapearEstadoMercadoPago(undefined),
    EstadoMercadoPagoDesconocido,
  );
});

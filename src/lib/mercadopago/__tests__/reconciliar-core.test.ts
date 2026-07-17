import { test } from "node:test";
import assert from "node:assert/strict";
import { resolverReconciliacion } from "../reconciliar-core";

// Pruebas del núcleo puro, sin red, sin PreApprovals y sin pagos. El envoltorio
// de I/O (reconciliar.ts) no se testea acá: importa server-only/Supabase/SDK y
// no corre bajo tsx fuera del runtime de Next.

test("estado local no-pending => skip (no consulta Mercado Pago)", () => {
  assert.deepEqual(
    resolverReconciliacion({
      estadoLocal: "active",
      estadoMPCrudo: "authorized",
      nextBillingDateLocal: null,
      nextBillingDateMP: null,
    }),
    { accion: "skip", motivo: "no_pending" },
  );
});

test("pending + authorized => actualizar a active", () => {
  assert.deepEqual(
    resolverReconciliacion({
      estadoLocal: "pending",
      estadoMPCrudo: "authorized",
      nextBillingDateLocal: null,
      nextBillingDateMP: "2026-08-01T00:00:00Z",
    }),
    {
      accion: "actualizar",
      nuevoEstado: "active",
      nextBillingDate: "2026-08-01T00:00:00Z",
    },
  );
});

test("pending + pending sin datos nuevos => skip sin_cambios (evita escritura)", () => {
  assert.deepEqual(
    resolverReconciliacion({
      estadoLocal: "pending",
      estadoMPCrudo: "pending",
      nextBillingDateLocal: null,
      nextBillingDateMP: null,
    }),
    { accion: "skip", motivo: "sin_cambios" },
  );
});

test("pending + pending con nueva next_billing_date => actualizar (dato nuevo)", () => {
  assert.deepEqual(
    resolverReconciliacion({
      estadoLocal: "pending",
      estadoMPCrudo: "pending",
      nextBillingDateLocal: null,
      nextBillingDateMP: "2026-08-01T00:00:00Z",
    }),
    {
      accion: "actualizar",
      nuevoEstado: "pending",
      nextBillingDate: "2026-08-01T00:00:00Z",
    },
  );
});

test("pending + estado desconocido => skip estado_desconocido", () => {
  assert.deepEqual(
    resolverReconciliacion({
      estadoLocal: "pending",
      estadoMPCrudo: "un_estado_nuevo_de_mp",
      nextBillingDateLocal: null,
      nextBillingDateMP: null,
    }),
    { accion: "skip", motivo: "estado_desconocido" },
  );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";

// Prueba de la validacion HMAC del webhook, SIN red y SIN crear PreApprovals:
// firmamos un data.id sintetico con el mismo algoritmo que espera el SDK
// (HMAC-SHA256 sobre "id:<data.id>;request-id:<x-request-id>;ts:<ts>;") y
// confirmamos que WebhookSignatureValidator acepta la firma valida y rechaza
// una manipulada. Es el mismo contrato que ya usa scripts/simular-webhook.ts.

const SECRETO_DE_PRUEBA = "secreto-solo-para-test-no-es-real";

function firmar(dataId: string, requestId: string, secreto: string) {
  const ts = Date.now().toString();
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = crypto.createHmac("sha256", secreto).update(manifest).digest("hex");
  return `ts=${ts},v1=${hash}`;
}

test("acepta una firma HMAC válida", () => {
  const dataId = "preapproval-sintetico-123";
  const requestId = crypto.randomUUID();
  const xSignature = firmar(dataId, requestId, SECRETO_DE_PRUEBA);

  assert.doesNotThrow(() => {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId: requestId,
      dataId,
      secret: SECRETO_DE_PRUEBA,
    });
  });
});

test("rechaza una firma HMAC manipulada (secreto incorrecto)", () => {
  const dataId = "preapproval-sintetico-123";
  const requestId = crypto.randomUUID();
  const xSignatureInvalida = firmar(dataId, requestId, "otro-secreto-incorrecto");

  assert.throws(
    () => {
      WebhookSignatureValidator.validate({
        xSignature: xSignatureInvalida,
        xRequestId: requestId,
        dataId,
        secret: SECRETO_DE_PRUEBA,
      });
    },
    InvalidWebhookSignatureError,
  );
});

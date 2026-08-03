// Pruebas de la compuerta de build del ADN embarcado (ADN-UI-1). Usa raíces
// SINTÉTICAS en el directorio temporal del sistema — jamás renombra, borra ni
// modifica la copia real embarcada. En raíces sintéticas el pin SHA se activa
// solo cuando el caso lo pide (segundo parámetro) y el chequeo de registro del
// aula se omite (aplica al conjunto real), quedando cubierto por el caso de la
// raíz real. Uso: tsx scripts/verificar-adn-embarcado.test.ts

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { AdnDoc } from "../adn-musical/tipos/adn-tipos";
import { verificarAdnEmbarcado } from "./verificar-adn-embarcado";

const RUTA_REAL = path.join(__dirname, "..", "src", "lib", "aulas", "piano", "adn", "piano-b1-e1-mapa-ciego.json");
const base = JSON.parse(fs.readFileSync(RUTA_REAL, "utf8")) as AdnDoc;
const mut = (): AdnDoc => structuredClone(base);

let total = 0;
let fallos = 0;
function caso(nombre: string, condicion: boolean, detalle = "") {
  total++;
  if (condicion) {
    console.log(`PASA   ${nombre}`);
  } else {
    fallos++;
    console.log(`FALLA  ${nombre}${detalle ? ` — ${detalle}` : ""}`);
  }
}

const temporales: string[] = [];
function raizCon(aula: string, archivo: string, contenido: string): string {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "adn-gate-"));
  temporales.push(raiz);
  fs.mkdirSync(path.join(raiz, aula, "adn"), { recursive: true });
  fs.writeFileSync(path.join(raiz, aula, "adn", archivo), contenido);
  return raiz;
}
function limpiar() {
  for (const t of temporales) fs.rmSync(t, { recursive: true, force: true });
}

try {
  {
    const r = verificarAdnEmbarcado();
    caso("G1: la raíz real pasa (incluye pin SHA y registro del aula)", r.ok && r.revisados >= 1, r.errores.join(" | "));
  }
  {
    // Reformateo semánticamente idéntico → solo el SHA difiere.
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(base));
    const r = verificarAdnEmbarcado(raiz, true);
    caso("G2: SHA distinto del canónico aprobado → falla por SHA", !r.ok && r.errores.some((e) => e.includes("SHA")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.musical_semantics.voices[0].events[0].duration = "1/2";
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G3: ADN que no pasa la Compuerta B → build bloqueado", !r.ok && r.errores.some((e) => e.includes("Compuerta B")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.musical_semantics.key = { tonic: "G", mode: "major" };
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G4: ADN que excede la cobertura A2 → build bloqueado", !r.ok && r.errores.some((e) => e.includes("Compuerta A2")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.presentation_and_rendering.views = ["keyboard", "tablature"];
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G5: pasa B+A2 pero excede el renderer → build bloqueado", !r.ok && r.errores.some((e) => e.includes("excede el renderer")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.evidence_governance.aprobado_por_david = false;
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G6: aprobado_por_david false → build bloqueado", !r.ok && r.errores.some((e) => e.includes("aprobado_por_david")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.evidence_governance.listo_para_desarrollo = false;
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G7: listo_para_desarrollo false → build bloqueado", !r.ok && r.errores.some((e) => e.includes("listo_para_desarrollo")), r.errores.join(" | "));
  }
  {
    const d = mut();
    d.evidence_governance.unknown_notation = [{ locator: "c1", description: "signo" }];
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G8: incidencias no vacías → build bloqueado", !r.ok && r.errores.some((e) => e.includes("unknown_notation")), r.errores.join(" | "));
  }
  {
    const raiz = raizCon("piano", "otro-nombre.json", JSON.stringify(base, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G9: nombre de archivo ≠ exercise.id → build bloqueado", !r.ok && r.errores.some((e) => e.includes("nombre de archivo")), r.errores.join(" | "));
  }
  {
    const raiz = raizCon("guitarra", "piano-b1-e1-mapa-ciego.json", JSON.stringify(base, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G10: carpeta de aula ≠ instrumento del ADN → build bloqueado", !r.ok && r.errores.some((e) => e.includes("carpeta")), r.errores.join(" | "));
  }
  {
    const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "adn-gate-"));
    temporales.push(raiz);
    fs.mkdirSync(path.join(raiz, "piano"), { recursive: true }); // sin carpeta adn
    const r = verificarAdnEmbarcado(raiz);
    caso("G11: raíz sin JSON embarcados → pasa informándolo", r.ok && r.revisados === 0, r.errores.join(" | "));
  }
  // --- RT-3: la compuerta de build exige demonstration_role SIEMPRE, sin
  // importar la schema_version. Cierra el hueco que deja el gate por versión
  // de la Compuerta B (David, 03/08/2026).
  {
    const d = mut();
    delete d.demonstration_role;
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G12: ADN embarcado sin demonstration_role → build bloqueado", !r.ok && r.errores.some((e) => e.includes("demonstration_role")), r.errores.join(" | "));
  }
  {
    const d = mut();
    (d as { demonstration_role?: unknown }).demonstration_role = "decorativo";
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G13: demonstration_role inválido → build bloqueado", !r.ok && r.errores.some((e) => e.includes("demonstration_role")), r.errores.join(" | "));
  }
  {
    // Un ADN que declare la versión VIEJA tampoco se cuela: si trae el campo
    // válido pasa, y si no lo trae lo frena G12 — la exigencia no depende de
    // la versión declarada.
    const d = mut();
    d.schema_version = "0.2.2-draft";
    d.demonstration_role = "reference_demonstration";
    const raiz = raizCon("piano", "piano-b1-e1-mapa-ciego.json", JSON.stringify(d, null, 2));
    const r = verificarAdnEmbarcado(raiz);
    caso("G14: 0.2.2-draft con demonstration_role válido pasa (exigencia independiente de la versión)", r.ok, r.errores.join(" | "));
  }
} finally {
  limpiar();
}

console.log("");
console.log(`Casos: ${total} — fallos: ${fallos}`);
process.exit(fallos === 0 ? 0 : 1);

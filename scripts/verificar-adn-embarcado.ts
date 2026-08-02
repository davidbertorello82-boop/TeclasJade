// Compuerta de build del contenido ADN embarcado (ADN-UI-1). Corre en
// `prebuild` (npm la ejecuta automáticamente antes de `build`, también en
// Vercel/Linux). Descubre src/lib/aulas/<aula>/adn/*.json con fs puro (sin
// globs de shell) y falla el build con ruta y diagnóstico exactos si algún
// ADN embarcado: no es byte-idéntico a su SHA canónico aprobado · no pasa
// B+A2 · no está aprobado y listo (gobernanza) · tiene incidencias · su
// nombre no coincide con exercise.id · su instrumento no coincide con la
// carpeta · excede la cobertura del renderer · no figura en el registro del
// aula. No escribe nada.
// Uso: tsx scripts/verificar-adn-embarcado.ts [raizAlternativa]
// (con raíz alternativa —solo pruebas— se omiten el pin SHA y el chequeo de
// registro del aula, que aplican al conjunto real embarcado; puede forzarse el
// pin con el segundo parámetro de la función.)

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { coberturaData } from "../adn-musical/validador/cobertura-v01";
import { validarData } from "../adn-musical/validador/validar-adn";
import type { AdnDoc } from "../adn-musical/tipos/adn-tipos";
import { adaptarAdnPiano, AdnNoSoportadoError } from "../src/lib/adn/adaptarAdnPiano";
import { buscarEjercicio } from "../src/lib/aulas/piano/contenido";

// SHA-256 aprobados de las copias canónicas embarcadas (pin contra el vault).
const SHAS_CANON: Record<string, string> = {
  "piano-b1-e1-mapa-ciego.json": "3998DBFAA0E4A2A91B8C94316A79115C412D64C8BDC202089895FC54FC9CCDD5",
};

export interface ResultadoCompuerta {
  ok: boolean;
  errores: string[];
  revisados: number;
}

export function verificarAdnEmbarcado(raiz?: string, exigirPins?: boolean): ResultadoCompuerta {
  const esRaizReal = raiz === undefined;
  const pins = exigirPins ?? esRaizReal;
  const base = raiz ?? path.join(__dirname, "..", "src", "lib", "aulas");
  const errores: string[] = [];
  let revisados = 0;
  if (!fs.existsSync(base)) return { ok: false, errores: [`raíz inexistente: ${base}`], revisados };

  for (const aula of fs.readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const dirAdn = path.join(base, aula.name, "adn");
    if (!fs.existsSync(dirAdn)) continue;
    for (const f of fs.readdirSync(dirAdn).filter((x) => x.endsWith(".json")).sort()) {
      revisados++;
      const ruta = path.join(dirAdn, f);
      const rel = `${aula.name}/adn/${f}`;
      const bytes = fs.readFileSync(ruta);
      if (pins) {
        const pin = SHAS_CANON[f];
        const sha = crypto.createHash("sha256").update(bytes).digest("hex").toUpperCase();
        if (!pin) {
          errores.push(`${rel}: sin SHA canónico registrado en la compuerta`);
          continue;
        }
        if (sha !== pin) {
          errores.push(`${rel}: SHA ${sha} ≠ canónico aprobado ${pin}`);
          continue;
        }
      }
      let data: unknown;
      try {
        data = JSON.parse(bytes.toString("utf8"));
      } catch (e) {
        errores.push(`${rel}: JSON inválido — ${e instanceof Error ? e.message : String(e)}`);
        continue;
      }
      const errsB = validarData(data);
      if (errsB.length > 0) {
        errores.push(`${rel}: Compuerta B — ${errsB.join(" | ")}`);
        continue;
      }
      const errsA2 = coberturaData(data);
      if (errsA2.length > 0) {
        errores.push(`${rel}: Compuerta A2 — ${errsA2.join(" | ")}`);
        continue;
      }
      const adn = data as AdnDoc; // la Compuerta B acaba de garantizar la forma
      const gob = adn.evidence_governance;
      if (gob.aprobado_por_david !== true) errores.push(`${rel}: aprobado_por_david debe ser true`);
      if (gob.listo_para_desarrollo !== true) errores.push(`${rel}: listo_para_desarrollo debe ser true`);
      if (gob.unknown_notation.length > 0 || gob.unsupported_features.length > 0) {
        errores.push(`${rel}: incidencias no vacías (unknown_notation/unsupported_features)`);
      }
      if (path.basename(f, ".json") !== adn.exercise.id) {
        errores.push(`${rel}: nombre de archivo ≠ exercise.id "${adn.exercise.id}"`);
      }
      if (adn.instrument_realization.kind !== aula.name) {
        errores.push(`${rel}: carpeta "${aula.name}" con instrumento "${adn.instrument_realization.kind}"`);
      }
      if (adn.instrument_realization.kind === "piano") {
        try {
          adaptarAdnPiano(adn);
        } catch (e) {
          if (e instanceof AdnNoSoportadoError) {
            errores.push(`${rel}: excede el renderer — ${e.incidencias.join(" | ")}`);
          } else {
            throw e;
          }
        }
      }
      if (esRaizReal && !buscarEjercicio(adn.exercise.id)) {
        errores.push(`${rel}: el slug "${adn.exercise.id}" no existe en el registro del aula (contenido.ts)`);
      }
    }
  }
  if (revisados === 0) console.log("Compuerta ADN: sin JSON embarcados (nada que verificar).");
  return { ok: errores.length === 0, errores, revisados };
}

function main() {
  const r = verificarAdnEmbarcado(process.argv[2]);
  if (r.ok) {
    console.log(`✓ Compuerta ADN embarcado: ${r.revisados} archivo(s) verificados.`);
    process.exit(0);
  }
  console.error("✗ Compuerta ADN embarcado — el build queda bloqueado:");
  for (const e of r.errores) console.error(`   - ${e}`);
  process.exit(1);
}

const esEjecucionDirecta =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) main();

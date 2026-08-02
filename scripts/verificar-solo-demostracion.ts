// Guarda de SOLO DEMOSTRACIÓN (decisión canónica 20 / doc 10 §8). Descubre
// DINÁMICAMENTE todos los .ts/.tsx productivos bajo src/ (sin lista fija;
// excluye *.test.ts[x]) y falla el build si alguno contiene APIs de captura o
// entrada, o identificadores de scoring/comparación de la ejecución del
// alumno. DECLARACIÓN HONESTA: es una guarda estática por tokens — la
// garantía real es esta guarda + la arquitectura sin interfaces de entrada +
// la revisión del diff de cada lote + el criterio canónico de rechazo de
// ampliaciones. No escribe nada.
// Uso: tsx scripts/verificar-solo-demostracion.ts [raizAlternativa]

import * as fs from "node:fs";
import * as path from "node:path";

const TOKENS_PROHIBIDOS = [
  "getUserMedia",
  "MediaRecorder",
  "requestMIDIAccess",
  "SpeechRecognition",
  "getDisplayMedia",
  "ImageCapture",
  "createMediaStreamSource",
  "createMediaStreamDestination",
  "createScriptProcessor",
] as const;
const RE_SCORING = /\b(scoring|pitchTracking|pitch_tracking)\b/;

export interface ResultadoGuarda {
  ok: boolean;
  errores: string[];
  modulos: number;
}

export function verificarSoloDemostracion(raiz?: string): ResultadoGuarda {
  const base = raiz ?? path.join(__dirname, "..", "src");
  const errores: string[] = [];
  let modulos = 0;
  const visitar = (dir: string) => {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      const ruta = path.join(dir, d.name);
      if (d.isDirectory()) {
        visitar(ruta);
      } else if (/\.(ts|tsx)$/.test(d.name) && !/\.test\.(ts|tsx)$/.test(d.name)) {
        modulos++;
        const lineas = fs.readFileSync(ruta, "utf8").split(/\r?\n/);
        lineas.forEach((linea, i) => {
          for (const t of TOKENS_PROHIBIDOS) {
            if (linea.includes(t)) errores.push(`${path.relative(base, ruta)}:${i + 1}: token prohibido "${t}"`);
          }
          if (RE_SCORING.test(linea)) errores.push(`${path.relative(base, ruta)}:${i + 1}: identificador de scoring/comparación`);
        });
      }
    }
  };
  if (!fs.existsSync(base)) return { ok: false, errores: [`raíz inexistente: ${base}`], modulos };
  visitar(base);
  if (modulos === 0) errores.push("descubrimiento vacío: ningún módulo productivo hallado");
  return { ok: errores.length === 0, errores, modulos };
}

function main() {
  const r = verificarSoloDemostracion(process.argv[2]);
  if (r.ok) {
    console.log(`✓ Guarda de solo demostración: ${r.modulos} módulos productivos limpios.`);
    process.exit(0);
  }
  console.error("✗ Guarda de solo demostración — el build queda bloqueado:");
  for (const e of r.errores) console.error(`   - ${e}`);
  process.exit(1);
}

const esEjecucionDirecta =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) main();

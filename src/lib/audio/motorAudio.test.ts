// Pruebas del motor de audio real (lote SONIDO-1). Verifican la config
// canónica (kit FIJADO a FluidR3_GM: MusyngKite tiene veto comercial de su
// autor original), el self-hosting de los samples en public/audio, la
// dependencia pineada exacta y el helper de precarga. Total impreso al final;
// exit 0 solo si todo pasa.
// Uso: npm run test:audio o tsx src/lib/audio/motorAudio.test.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { LAYERS } from "smplr";
import {
  INSTRUMENTO_GUITARRA,
  KIT_SOUNDFONT,
  notasParaCarga,
  RUTA_GUITARRA,
  RUTA_PIANO,
  VELOCIDAD_DEMO,
} from "./motorAudio";

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

const RAIZ = path.join(__dirname, "..", "..", "..");

// --- Licencias y whitelist (criterio crítico del lote) ---
caso("kit del Soundfont fijado a FluidR3_GM (jamás el default MusyngKite)", KIT_SOUNDFONT === "FluidR3_GM");
caso("instrumento de guitarra whitelisteado: acoustic_guitar_nylon", INSTRUMENTO_GUITARRA === "acoustic_guitar_nylon");
caso(
  "la URL de la guitarra incorpora el kit fijado (imposible apuntar a otro banco)",
  RUTA_GUITARRA === `/audio/soundfonts/FluidR3_GM/acoustic_guitar_nylon-mp3.js`,
);

// --- Self-hosting: rutas relativas al hosting propio, jamás CDN de terceros ---
caso("piano self-hosteado (ruta relativa /audio/)", RUTA_PIANO.startsWith("/audio/"));
caso("guitarra self-hosteada (ruta relativa /audio/)", RUTA_GUITARRA.startsWith("/audio/"));

// El call-site tiene que usar las constantes canónicas: si alguien borra una
// de estas líneas, smplr cae a sus defaults (GitHub Pages y el kit MusyngKite
// con veto comercial) con las constantes intactas — hallazgo de la revisión
// adversarial del lote.
const fuenteMotor = fs.readFileSync(path.join(__dirname, "motorAudio.ts"), "utf8");
caso("el módulo del motor no referencia GitHub Pages ni CDNs de samples", !/github\.io|jsdelivr|unpkg/.test(fuenteMotor));
caso("call-site del piano anclado a baseUrl: RUTA_PIANO", /baseUrl:\s*RUTA_PIANO/.test(fuenteMotor));
caso("call-site de la guitarra anclado a instrumentUrl: RUTA_GUITARRA", /instrumentUrl:\s*RUTA_GUITARRA/.test(fuenteMotor));
caso("call-site de la guitarra fija kit: KIT_SOUNDFONT", /kit:\s*KIT_SOUNDFONT/.test(fuenteMotor));
caso("MusyngKite no aparece como VALOR en el código del motor", !/["'`]MusyngKite["'`]/.test(fuenteMotor));

// --- Assets presentes en public/ (integridad del self-hosting) ---
const dirPiano = path.join(RAIZ, "public", "audio", "piano");
const archivosPiano = fs.existsSync(dirPiano) ? fs.readdirSync(dirPiano) : [];
caso("public/audio/piano existe con el set completo (>= 400 archivos)", archivosPiano.length >= 400, `hay ${archivosPiano.length}`);
caso("el set de piano incluye formato ogg", archivosPiano.some((a) => a.endsWith(".ogg")));
caso("el set de piano incluye formato m4a (Safari)", archivosPiano.some((a) => a.endsWith(".m4a")));
// Cobertura EXHAUSTIVA contra el manifiesto real: smplr solo puede pedir los
// nombres declarados en su LAYERS embebido (sensibles a mayúsculas en hosting
// Linux: hay prefijos "Mp " y "Mf " además de PP/MF/FF). Cada nombre debe
// existir en ambos formatos.
const nombresManifiesto = new Set<string>();
for (const capa of LAYERS) {
  for (const [, nombre] of capa.samples) nombresManifiesto.add(String(nombre));
}
const archivosSet = new Set(archivosPiano);
const faltantes: string[] = [];
for (const nombre of nombresManifiesto) {
  for (const ext of ["ogg", "m4a"]) {
    if (!archivosSet.has(`${nombre}.${ext}`)) faltantes.push(`${nombre}.${ext}`);
  }
}
caso(
  `el set en public/ cubre TODO el manifiesto LAYERS de smplr (${nombresManifiesto.size} nombres × ogg+m4a)`,
  nombresManifiesto.size > 100 && faltantes.length === 0,
  faltantes.slice(0, 5).join(", "),
);
// La ruta pública de la guitarra debe corresponderse con un archivo real.
const archivoGuitarra = path.join(RAIZ, "public", ...RUTA_GUITARRA.replace(/^\//, "").split("/"));
caso("el archivo de guitarra existe en public/ (misma ruta que sirve la app)", fs.existsSync(archivoGuitarra));
caso(
  "el archivo de guitarra tiene el tamaño esperado (> 1,5 MB)",
  fs.existsSync(archivoGuitarra) && fs.statSync(archivoGuitarra).size > 1_500_000,
);

// --- Dependencia pineada exacta (evidencia de licencia) ---
const pkgApp = JSON.parse(fs.readFileSync(path.join(RAIZ, "package.json"), "utf8"));
caso("smplr pineada exacta 1.0.0 en package.json (sin ^ ni ~)", pkgApp.dependencies?.smplr === "1.0.0");
const pkgSmplrRuta = path.join(RAIZ, "node_modules", "smplr", "package.json");
const pkgSmplr = fs.existsSync(pkgSmplrRuta) ? JSON.parse(fs.readFileSync(pkgSmplrRuta, "utf8")) : null;
caso("smplr instalada declara licencia MIT", pkgSmplr?.license === "MIT");
caso("smplr instalada es exactamente la 1.0.0", pkgSmplr?.version === "1.0.0");

// --- Velocidad de demostración dentro de la capa MF del piano (85-100) ---
caso("VELOCIDAD_DEMO cae en la capa MF (85-100)", VELOCIDAD_DEMO >= 85 && VELOCIDAD_DEMO <= 100);

// --- Helper de precarga: margen, clamp y continuidad cromática ---
const rangoNormal = notasParaCarga(48, 71);
caso("precarga expande el rango con margen de 6 (48-71 → 42-77)", rangoNormal[0] === 42 && rangoNormal[rangoNormal.length - 1] === 77);
caso(
  "precarga cromática sin huecos",
  rangoNormal.every((m, i) => i === 0 || m === rangoNormal[i - 1] + 1),
);
const rangoExtremo = notasParaCarga(15, 200);
caso("precarga acotada al piano real (21-108)", rangoExtremo[0] === 21 && rangoExtremo[rangoExtremo.length - 1] === 108);
const rangoInvertido = notasParaCarga(71, 48);
caso("precarga tolera rango invertido", rangoInvertido[0] === 42 && rangoInvertido[rangoInvertido.length - 1] === 77);

console.log(`\n${total - fallos}/${total} casos en verde`);
process.exit(fallos === 0 ? 0 : 1);

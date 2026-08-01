// Compuerta A2 — Comprobación determinista de cobertura v0.1 del ADN Musical.
// NO reemplaza a validar-adn.ts (Compuerta B): B valida estructura y semántica
// contra el esquema general; esta compuerta comprueba que el ADN use SOLO el
// subconjunto soportado por la Skill v0.1-experimental.
// Toda incidencia incluye una ruta JSON concreta. Trabaja sobre `unknown` con
// navegación defensiva: jamás asume la forma del documento de entrada.
// Uso: npm run cobertura-adn [-- archivo1.json ...]
// Sin argumentos: valida fixtures/*.json + conformance/*.json (informando la lista).

import * as fs from "node:fs";
import * as path from "node:path";

const VIEWS_PERMITIDAS = new Set([
  "rhythm_grid", "staff_treble", "solfeo_fixed", "lyrics_aligned",
  "piano_support", "tablature", "keyboard",
]);
const CONTROLS_PERMITIDOS = new Set(["play", "pause", "restart", "bpm_slider", "loop"]);
const GAPS_PERMITIDOS = new Set(["none", "one_measure"]);

function esObjeto(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

// Navegación defensiva: array real o vacío, sin asumir nada.
function arr(x: unknown): unknown[] {
  return Array.isArray(x) ? (x as unknown[]) : [];
}

interface NotaLocalizada {
  nota: Record<string, unknown>;
  ruta: string; // ruta JSON de la nota dentro del documento
}

export function coberturaData(adn: unknown): string[] {
  const inc: string[] = [];
  const raiz = esObjeto(adn) ? adn : undefined;
  const sem = raiz && esObjeto(raiz.musical_semantics) ? raiz.musical_semantics : undefined;
  if (!sem || !Array.isArray(sem.voices)) {
    inc.push("/musical_semantics: ausente o sin voces — no evaluable");
    return inc;
  }
  const voces = arr(sem.voices);

  // 1. Exactamente una voz
  if (voces.length !== 1) {
    inc.push(`/musical_semantics/voices: se admite exactamente 1 voz (hay ${voces.length})`);
  }

  const voz = esObjeto(voces[0]) ? voces[0] : undefined;
  if (voz) {
    const eventos = arr(voz.events);
    if (voz.kind === "percussive") {
      // 2. percusiva: eventos sin notes; documento sin key
      eventos.forEach((evU, i) => {
        const ev = esObjeto(evU) ? evU : undefined;
        if (ev && ev.notes !== undefined) {
          inc.push(`/musical_semantics/voices/0/events/${i}: voz percusiva con 'notes' (${ev.id})`);
        }
      });
      if (sem.key !== undefined) {
        inc.push("/musical_semantics/key: la percusión no admite 'key'");
      }
    } else if (voz.kind === "melodic") {
      // 3. melódica: exactamente una nota por evento; key obligatoria C major | A minor
      eventos.forEach((evU, i) => {
        const ev = esObjeto(evU) ? evU : undefined;
        const n = ev && Array.isArray(ev.notes) ? ev.notes.length : 0;
        if (n !== 1) {
          inc.push(`/musical_semantics/voices/0/events/${i}/notes: se admite exactamente 1 nota por evento (hay ${n}) (${ev ? ev.id : "?"})`);
        }
      });
      const k = esObjeto(sem.key) ? sem.key : undefined;
      const kOk = k && ((k.tonic === "C" && k.mode === "major") || (k.tonic === "A" && k.mode === "minor"));
      if (!kOk) {
        inc.push(`/musical_semantics/key: obligatoria y solo C major o A minor (hay ${k ? `${k.tonic} ${k.mode}` : "ausente"})`);
      }
    }
  }

  // 4. métrica única constante 4/4, sin anacrusa
  const t: Record<string, unknown> = esObjeto(sem.time) ? sem.time : {};
  if (t.signature !== "4/4") inc.push(`/musical_semantics/time/signature: solo "4/4" (hay ${JSON.stringify(t.signature)})`);
  if (t.beats_per_measure !== 4) inc.push(`/musical_semantics/time/beats_per_measure: solo 4 (hay ${JSON.stringify(t.beats_per_measure)})`);
  if (t.beat_unit !== "1/4") inc.push(`/musical_semantics/time/beat_unit: solo "1/4" (hay ${JSON.stringify(t.beat_unit)})`);
  if (sem.anacrusis !== undefined && sem.anacrusis !== null) inc.push("/musical_semantics/anacrusis: no soportada en v0.1");

  // mapa de notas melódicas CON su ruta de origen (para reglas 6 y 10)
  const notas = new Map<string, NotaLocalizada>();
  voces.forEach((vU, vi) => {
    const v = esObjeto(vU) ? vU : undefined;
    arr(v?.events).forEach((evU, ei) => {
      const ev = esObjeto(evU) ? evU : undefined;
      arr(ev?.notes).forEach((nU, ni) => {
        const nn = esObjeto(nU) ? nU : undefined;
        const id = nn?.id;
        if (nn && typeof id === "string") {
          notas.set(id, {
            nota: nn,
            ruta: `/musical_semantics/voices/${vi}/events/${ei}/notes/${ni}`,
          });
        }
      });
    });
  });

  // 10. alter en [-2, 2] (redundante con el esquema; explícito como regla de cobertura)
  for (const [id, loc] of notas) {
    const wp = esObjeto(loc.nota.written_pitch) ? loc.nota.written_pitch : undefined;
    const a = wp?.alter;
    if (typeof a === "number" && (a < -2 || a > 2)) {
      inc.push(`${loc.ruta}/written_pitch/alter: fuera de [-2, 2] (hay ${a}) (nota ${id})`);
    }
  }

  const real = raiz && esObjeto(raiz.instrument_realization) ? raiz.instrument_realization : undefined;
  const pres = raiz && esObjeto(raiz.presentation_and_rendering) ? raiz.presentation_and_rendering : undefined;
  const gob = raiz && esObjeto(raiz.evidence_governance) ? raiz.evidence_governance : undefined;

  // 5. guitarra
  if (real?.kind === "guitar") {
    if (real.tuning !== "EADGBE") inc.push(`/instrument_realization/tuning: solo "EADGBE" (hay ${JSON.stringify(real.tuning)})`);
    if (real.sounding_transposition_octaves !== -1) {
      inc.push(`/instrument_realization/sounding_transposition_octaves: solo -1 (hay ${JSON.stringify(real.sounding_transposition_octaves)})`);
    }
  }
  // 6. piano
  if (real?.kind === "piano") {
    const asignadas = new Set<string>();
    arr(real.realizations).forEach((rU, i) => {
      const r = esObjeto(rU) ? rU : undefined;
      const nid = r?.note_id;
      if (typeof nid !== "string" || !notas.has(nid)) {
        inc.push(`/instrument_realization/realizations/${i}: note_id inexistente ${String(nid)}`);
      }
      if (typeof nid === "string") asignadas.add(nid);
      const hand = r?.hand;
      if (hand !== "right" && hand !== "left") inc.push(`/instrument_realization/realizations/${i}/hand: debe ser right|left`);
      const f = r?.finger;
      if (typeof f !== "number" || !Number.isInteger(f) || f < 1 || f > 5) {
        inc.push(`/instrument_realization/realizations/${i}/finger: debe ser entero 1-5`);
      }
    });
    for (const [id, loc] of notas) {
      if (!asignadas.has(id)) {
        inc.push(`/instrument_realization/realizations: falta realización para note_id ${id} localizado en ${loc.ruta}`);
      }
    }
    const hc = pres?.hand_colors;
    const hcOk = esObjeto(hc) && Object.keys(hc).length === 2 && hc.right === "naranja" && hc.left === "azul";
    if (!hcOk) inc.push(`/presentation_and_rendering/hand_colors: debe ser exactamente {"right":"naranja","left":"azul"}`);
  }

  // 7. variantes: allowlist exacto + transposition_allowed
  const variantes = arr(raiz?.variants);
  variantes.forEach((vU, i) => {
    const v = esObjeto(vU) ? vU : undefined;
    const transform = v && esObjeto(v.transform) ? v.transform : undefined;
    const claves = Object.keys(transform ?? {});
    const ok = claves.length === 1 && claves[0] === "transpose_octaves" && transform?.transpose_octaves === -1;
    if (!ok) inc.push(`/variants/${i}/transform: solo {"transpose_octaves": -1} está en el allowlist`);
  });
  if (variantes.length > 0 && gob?.transposition_allowed !== true) {
    inc.push("/evidence_governance/transposition_allowed: debe ser true cuando existen variantes");
  }

  // 8. allowlists de presentación
  arr(pres?.views).forEach((v, i) => {
    if (typeof v !== "string" || !VIEWS_PERMITIDAS.has(v)) inc.push(`/presentation_and_rendering/views/${i}: vista no permitida "${String(v)}"`);
  });
  arr(pres?.controls).forEach((c, i) => {
    if (typeof c !== "string" || !CONTROLS_PERMITIDOS.has(c)) inc.push(`/presentation_and_rendering/controls/${i}: control no permitido "${String(c)}"`);
  });

  // 9. structure.gap
  arr(sem.structure).forEach((sU, i) => {
    const s = esObjeto(sU) ? sU : undefined;
    const gap = s?.gap;
    if (gap !== undefined && (typeof gap !== "string" || !GAPS_PERMITIDOS.has(gap))) {
      inc.push(`/musical_semantics/structure/${i}/gap: valor no permitido "${String(gap)}"`);
    }
  });

  // 11. incidencias de gobernanza: deben estar vacías dentro de la cobertura v0.1
  const uf = gob?.unsupported_features;
  if (Array.isArray(uf) && uf.length > 0) {
    inc.push(`/evidence_governance/unsupported_features: debe estar vacío en v0.1 (hay ${uf.length})`);
  }
  const un = gob?.unknown_notation;
  if (Array.isArray(un) && un.length > 0) {
    inc.push(`/evidence_governance/unknown_notation: debe estar vacío en v0.1 (hay ${un.length})`);
  }

  return inc;
}

export function coberturaArchivo(ruta: string): { ok: boolean; incidencias: string[] } {
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e) {
    return { ok: false, incidencias: [`JSON inválido: ${e instanceof Error ? e.message : String(e)}`] };
  }
  const incidencias = coberturaData(data);
  return { ok: incidencias.length === 0, incidencias };
}

function main() {
  const args = process.argv.slice(2);
  let archivos: string[];
  if (args.length > 0) {
    archivos = args;
  } else {
    const base = path.join(__dirname, "..");
    archivos = [];
    for (const dir of ["fixtures", "conformance"]) {
      const d = path.join(base, dir);
      if (fs.existsSync(d)) {
        for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json")).sort()) {
          archivos.push(path.join(d, f));
        }
      }
    }
    console.log(`Archivos descubiertos (${archivos.length}):`);
    for (const a of archivos) console.log(`  - ${path.relative(process.cwd(), a)}`);
  }
  let todosOk = true;
  for (const a of archivos) {
    const { ok, incidencias } = coberturaArchivo(a);
    if (ok) {
      console.log(`✓ COBERTURA v0.1  ${path.basename(a)}`);
    } else {
      todosOk = false;
      console.log(`✗ ${path.basename(a)}`);
      for (const i of incidencias) console.log(`   - ${i}`);
    }
  }
  process.exit(todosOk ? 0 : 1);
}

const esEjecucionDirecta =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) main();

// Compuerta A2 — Comprobación determinista de cobertura v0.1 del ADN Musical.
// NO reemplaza a validar-adn.ts (Compuerta B): B valida estructura y semántica
// contra el esquema general; esta compuerta comprueba que el ADN use SOLO el
// subconjunto soportado por la Skill v0.1-experimental.
// Toda incidencia incluye una ruta JSON concreta.
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

interface NotaLocalizada {
  nota: any;
  ruta: string; // ruta JSON de la nota dentro del documento
}

export function coberturaData(adn: any): string[] {
  const inc: string[] = [];
  const sem = adn?.musical_semantics;
  if (!sem || !Array.isArray(sem.voices)) {
    inc.push("/musical_semantics: ausente o sin voces — no evaluable");
    return inc;
  }

  // 1. Exactamente una voz
  if (sem.voices.length !== 1) {
    inc.push(`/musical_semantics/voices: se admite exactamente 1 voz (hay ${sem.voices.length})`);
  }

  const voz = sem.voices[0];
  if (voz) {
    if (voz.kind === "percussive") {
      // 2. percusiva: eventos sin notes; documento sin key
      (voz.events ?? []).forEach((ev: any, i: number) => {
        if (ev.notes !== undefined) {
          inc.push(`/musical_semantics/voices/0/events/${i}: voz percusiva con 'notes' (${ev.id})`);
        }
      });
      if (sem.key !== undefined) {
        inc.push("/musical_semantics/key: la percusión no admite 'key'");
      }
    } else if (voz.kind === "melodic") {
      // 3. melódica: exactamente una nota por evento; key obligatoria C major | A minor
      (voz.events ?? []).forEach((ev: any, i: number) => {
        const n = Array.isArray(ev.notes) ? ev.notes.length : 0;
        if (n !== 1) {
          inc.push(`/musical_semantics/voices/0/events/${i}/notes: se admite exactamente 1 nota por evento (hay ${n}) (${ev.id})`);
        }
      });
      const k = sem.key;
      const kOk = k && ((k.tonic === "C" && k.mode === "major") || (k.tonic === "A" && k.mode === "minor"));
      if (!kOk) {
        inc.push(`/musical_semantics/key: obligatoria y solo C major o A minor (hay ${k ? `${k.tonic} ${k.mode}` : "ausente"})`);
      }
    }
  }

  // 4. métrica única constante 4/4, sin anacrusa
  const t = sem.time ?? {};
  if (t.signature !== "4/4") inc.push(`/musical_semantics/time/signature: solo "4/4" (hay ${JSON.stringify(t.signature)})`);
  if (t.beats_per_measure !== 4) inc.push(`/musical_semantics/time/beats_per_measure: solo 4 (hay ${JSON.stringify(t.beats_per_measure)})`);
  if (t.beat_unit !== "1/4") inc.push(`/musical_semantics/time/beat_unit: solo "1/4" (hay ${JSON.stringify(t.beat_unit)})`);
  if (sem.anacrusis !== undefined && sem.anacrusis !== null) inc.push("/musical_semantics/anacrusis: no soportada en v0.1");

  // mapa de notas melódicas CON su ruta de origen (para reglas 6 y 10)
  const notas = new Map<string, NotaLocalizada>();
  sem.voices.forEach((v: any, vi: number) => {
    (v.events ?? []).forEach((ev: any, ei: number) => {
      (ev.notes ?? []).forEach((n: any, ni: number) => {
        notas.set(n.id, {
          nota: n,
          ruta: `/musical_semantics/voices/${vi}/events/${ei}/notes/${ni}`,
        });
      });
    });
  });

  // 10. alter en [-2, 2] (redundante con el esquema; explícito como regla de cobertura)
  for (const [id, loc] of notas) {
    const a = loc.nota?.written_pitch?.alter;
    if (typeof a === "number" && (a < -2 || a > 2)) {
      inc.push(`${loc.ruta}/written_pitch/alter: fuera de [-2, 2] (hay ${a}) (nota ${id})`);
    }
  }

  const real = adn?.instrument_realization;
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
    (real.realizations ?? []).forEach((r: any, i: number) => {
      if (!notas.has(r.note_id)) inc.push(`/instrument_realization/realizations/${i}: note_id inexistente ${r.note_id}`);
      asignadas.add(r.note_id);
      if (r.hand !== "right" && r.hand !== "left") inc.push(`/instrument_realization/realizations/${i}/hand: debe ser right|left`);
      if (!Number.isInteger(r.finger) || r.finger < 1 || r.finger > 5) {
        inc.push(`/instrument_realization/realizations/${i}/finger: debe ser entero 1-5`);
      }
    });
    for (const [id, loc] of notas) {
      if (!asignadas.has(id)) {
        inc.push(`/instrument_realization/realizations: falta realización para note_id ${id} localizado en ${loc.ruta}`);
      }
    }
    const hc = adn?.presentation_and_rendering?.hand_colors;
    const hcOk = hc && typeof hc === "object" && Object.keys(hc).length === 2 && hc.right === "naranja" && hc.left === "azul";
    if (!hcOk) inc.push(`/presentation_and_rendering/hand_colors: debe ser exactamente {"right":"naranja","left":"azul"}`);
  }

  // 7. variantes: allowlist exacto + transposition_allowed
  const variantes = adn?.variants ?? [];
  variantes.forEach((v: any, i: number) => {
    const claves = Object.keys(v.transform ?? {});
    const ok = claves.length === 1 && claves[0] === "transpose_octaves" && v.transform.transpose_octaves === -1;
    if (!ok) inc.push(`/variants/${i}/transform: solo {"transpose_octaves": -1} está en el allowlist`);
  });
  if (variantes.length > 0 && adn?.evidence_governance?.transposition_allowed !== true) {
    inc.push("/evidence_governance/transposition_allowed: debe ser true cuando existen variantes");
  }

  // 8. allowlists de presentación
  const pres = adn?.presentation_and_rendering ?? {};
  (pres.views ?? []).forEach((v: string, i: number) => {
    if (!VIEWS_PERMITIDAS.has(v)) inc.push(`/presentation_and_rendering/views/${i}: vista no permitida "${v}"`);
  });
  (pres.controls ?? []).forEach((c: string, i: number) => {
    if (!CONTROLS_PERMITIDOS.has(c)) inc.push(`/presentation_and_rendering/controls/${i}: control no permitido "${c}"`);
  });

  // 9. structure.gap
  (sem.structure ?? []).forEach((s: any, i: number) => {
    if (s.gap !== undefined && !GAPS_PERMITIDOS.has(s.gap)) {
      inc.push(`/musical_semantics/structure/${i}/gap: valor no permitido "${s.gap}"`);
    }
  });

  return inc;
}

export function coberturaArchivo(ruta: string): { ok: boolean; incidencias: string[] } {
  let data: any;
  try {
    data = JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e: any) {
    return { ok: false, incidencias: [`JSON inválido: ${e.message}`] };
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

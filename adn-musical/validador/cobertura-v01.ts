// Compuerta A2 — Comprobación determinista de cobertura del ADN Musical.
// NO reemplaza a validar-adn.ts (Compuerta B): B valida estructura y semántica
// contra el esquema general; esta compuerta comprueba que el ADN use SOLO el
// subconjunto soportado por el perfil declarado.
//
// DOS PERFILES VIVOS A LA VEZ, de forma permanente:
//   v0.1 — intacto. Es la garantía bajo la que nacieron los ADN históricos:
//          una voz · una nota por evento · key solo C major o A minor · 4/4.
//   v0.2 — varias voces · acordes intra-mano · cualquier tónica con modos
//          major/minor/pentatonic_major · métricas 4/4, 3/4 y 2/4 · eventos
//          `rest` · `tied_from_previous`. Sigue rechazando anacrusa, tresillos
//          e irregulares, swing, cambios de métrica y compás final incompleto.
// El archivo conserva el nombre `cobertura-v01.ts` a propósito: renombrarlo
// tocaría package.json, la compuerta de build y las pruebas sin ganancia real.
//
// Resolución del perfil, en este orden: parámetro explícito → campo
// `coverage_profile` del documento → "v0.1" por defecto. El comando SIEMPRE
// informa cuál usó y de dónde lo tomó.
// Uso: npm run cobertura-adn [-- [--perfil=v0.2] archivo1.json ...]
// Sin archivos: valida fixtures/*.json + conformance/*.json (informando la lista).

import * as fs from "node:fs";
import * as path from "node:path";
import type { PerfilCobertura } from "../tipos/adn-tipos";

const VIEWS_PERMITIDAS = new Set([
  "rhythm_grid", "staff_treble", "solfeo_fixed", "lyrics_aligned",
  "piano_support", "tablature", "keyboard",
]);
const CONTROLS_PERMITIDOS = new Set(["play", "pause", "restart", "bpm_slider", "loop"]);
const GAPS_PERMITIDOS = new Set(["none", "one_measure"]);

export const PERFILES = ["v0.1", "v0.2"] as const;
export const PERFIL_POR_DEFECTO: PerfilCobertura = "v0.1";

// Métricas admitidas por perfil, como (signature, beats_per_measure, beat_unit).
const METRICAS_V02: ReadonlyArray<readonly [string, number, string]> = [
  ["4/4", 4, "1/4"],
  ["3/4", 3, "1/4"],
  ["2/4", 2, "1/4"],
];

export function esPerfil(x: unknown): x is PerfilCobertura {
  return typeof x === "string" && (PERFILES as readonly string[]).includes(x);
}

// Perfil efectivo y su procedencia. El parámetro gana sobre el campo del
// documento; el campo gana sobre el default. Un `coverage_profile` presente
// pero inválido NO se ignora en silencio: se reporta como incidencia.
export function resolverPerfil(
  adn: unknown,
  perfil?: PerfilCobertura,
): { perfil: PerfilCobertura; origen: string; incidencia?: string } {
  if (perfil !== undefined) return { perfil, origen: "parámetro" };
  const campo = esObjeto(adn) ? adn.coverage_profile : undefined;
  if (campo === undefined) return { perfil: PERFIL_POR_DEFECTO, origen: "default" };
  if (!esPerfil(campo)) {
    return {
      perfil: PERFIL_POR_DEFECTO,
      origen: "default",
      incidencia: `/coverage_profile: perfil no reconocido ${JSON.stringify(campo)} (admitidos: ${PERFILES.join(", ")})`,
    };
  }
  return { perfil: campo, origen: "campo del documento" };
}

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

export function coberturaData(adn: unknown, perfil?: PerfilCobertura): string[] {
  const inc: string[] = [];
  const res = resolverPerfil(adn, perfil);
  if (res.incidencia) inc.push(res.incidencia);
  const v01 = res.perfil === "v0.1";
  const raiz = esObjeto(adn) ? adn : undefined;
  const sem = raiz && esObjeto(raiz.musical_semantics) ? raiz.musical_semantics : undefined;
  if (!sem || !Array.isArray(sem.voices)) {
    inc.push("/musical_semantics: ausente o sin voces — no evaluable");
    return inc;
  }
  const voces = arr(sem.voices);

  if (v01) {
    // ----- perfil v0.1 (intacto: la garantía bajo la que nacieron los ADN históricos) -----

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
  } else {
    // ----- perfil v0.2 -----

    // 1'. varias voces admitidas; cada una se evalúa por separado.
    voces.forEach((vU, vi) => {
      const v = esObjeto(vU) ? vU : undefined;
      if (!v) return;
      const eventos = arr(v.events);
      if (v.kind === "percussive") {
        eventos.forEach((evU, i) => {
          const ev = esObjeto(evU) ? evU : undefined;
          if (ev && ev.notes !== undefined) {
            inc.push(`/musical_semantics/voices/${vi}/events/${i}: voz percusiva con 'notes' (${ev.id})`);
          }
        });
      } else if (v.kind === "melodic") {
        // 3'. acordes intra-mano admitidos: 1..n notas. Un evento de silencio
        // no lleva notas; la Compuerta B ya exige notes XOR rest.
        eventos.forEach((evU, i) => {
          const ev = esObjeto(evU) ? evU : undefined;
          const n = ev && Array.isArray(ev.notes) ? ev.notes.length : 0;
          if (n === 0 && ev?.rest !== true) {
            inc.push(`/musical_semantics/voices/${vi}/events/${i}/notes: evento melódico sin notas ni rest (${ev ? ev.id : "?"})`);
          }
        });
      }
    });
    const hayMelodica = voces.some((vU) => esObjeto(vU) && vU.kind === "melodic");
    if (hayMelodica) {
      // 3''. cualquier tónica, con modos major | minor | pentatonic_major.
      const k = esObjeto(sem.key) ? sem.key : undefined;
      const modosOk = new Set(["major", "minor", "pentatonic_major"]);
      const kOk = k && typeof k.tonic === "string" && /^[A-G](#|b)?$/.test(k.tonic) && typeof k.mode === "string" && modosOk.has(k.mode);
      if (!kOk) {
        inc.push(`/musical_semantics/key: obligatoria, con tónica A-G y modo major|minor|pentatonic_major (hay ${k ? `${String(k.tonic)} ${String(k.mode)}` : "ausente"})`);
      }
    } else if (sem.key !== undefined) {
      inc.push("/musical_semantics/key: la percusión no admite 'key'");
    }
  }

  // 4. métrica: v0.1 solo 4/4; v0.2 admite además 3/4 y 2/4. Sin anacrusa en
  //    ninguno de los dos perfiles.
  const t: Record<string, unknown> = esObjeto(sem.time) ? sem.time : {};
  if (v01) {
    if (t.signature !== "4/4") inc.push(`/musical_semantics/time/signature: solo "4/4" (hay ${JSON.stringify(t.signature)})`);
    if (t.beats_per_measure !== 4) inc.push(`/musical_semantics/time/beats_per_measure: solo 4 (hay ${JSON.stringify(t.beats_per_measure)})`);
    if (t.beat_unit !== "1/4") inc.push(`/musical_semantics/time/beat_unit: solo "1/4" (hay ${JSON.stringify(t.beat_unit)})`);
  } else {
    const metricaOk = METRICAS_V02.some(
      ([sig, bpm, bu]) => t.signature === sig && t.beats_per_measure === bpm && t.beat_unit === bu,
    );
    if (!metricaOk) {
      inc.push(`/musical_semantics/time: métrica no soportada en v0.2 (hay ${JSON.stringify(t.signature)} ${JSON.stringify(t.beats_per_measure)} ${JSON.stringify(t.beat_unit)}; admitidas: 4/4, 3/4, 2/4)`);
    }
  }
  if (sem.anacrusis !== undefined && sem.anacrusis !== null) {
    inc.push(`/musical_semantics/anacrusis: no soportada en ${res.perfil}`);
  }

  // 4-bis. Los flags de 0.3.0-draft no existen en v0.1: si aparecen bajo ese
  //        perfil, se rechazan explícitamente (nunca se ignoran en silencio).
  if (v01) {
    voces.forEach((vU, vi) => {
      const v = esObjeto(vU) ? vU : undefined;
      arr(v?.events).forEach((evU, i) => {
        const ev = esObjeto(evU) ? evU : undefined;
        if (ev?.rest !== undefined) {
          inc.push(`/musical_semantics/voices/${vi}/events/${i}/rest: los silencios explícitos requieren el perfil v0.2`);
        }
        if (ev?.tied_from_previous !== undefined) {
          inc.push(`/musical_semantics/voices/${vi}/events/${i}/tied_from_previous: la ligadura de prolongación requiere el perfil v0.2`);
        }
      });
    });
  }

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

  // 11. incidencias de gobernanza: deben estar vacías en cualquier perfil
  const uf = gob?.unsupported_features;
  if (Array.isArray(uf) && uf.length > 0) {
    inc.push(`/evidence_governance/unsupported_features: debe estar vacío en ${res.perfil} (hay ${uf.length})`);
  }
  const un = gob?.unknown_notation;
  if (Array.isArray(un) && un.length > 0) {
    inc.push(`/evidence_governance/unknown_notation: debe estar vacío en ${res.perfil} (hay ${un.length})`);
  }

  return inc;
}

export function coberturaArchivo(
  ruta: string,
  perfil?: PerfilCobertura,
): { ok: boolean; incidencias: string[]; perfil: PerfilCobertura; origen: string } {
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e) {
    return {
      ok: false,
      incidencias: [`JSON inválido: ${e instanceof Error ? e.message : String(e)}`],
      perfil: perfil ?? PERFIL_POR_DEFECTO,
      origen: perfil ? "parámetro" : "default",
    };
  }
  const res = resolverPerfil(data, perfil);
  const incidencias = coberturaData(data, perfil);
  return { ok: incidencias.length === 0, incidencias, perfil: res.perfil, origen: res.origen };
}

function main() {
  const todos = process.argv.slice(2);
  const banderas = todos.filter((a) => a.startsWith("--perfil="));
  const args = todos.filter((a) => !a.startsWith("--perfil="));
  let perfilCli: PerfilCobertura | undefined;
  if (banderas.length > 0) {
    const valor = banderas[banderas.length - 1].slice("--perfil=".length);
    if (!esPerfil(valor)) {
      console.error(`✗ perfil no reconocido: ${JSON.stringify(valor)} (admitidos: ${PERFILES.join(", ")})`);
      process.exit(1);
    }
    perfilCli = valor;
  }
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
    const { ok, incidencias, perfil, origen } = coberturaArchivo(a, perfilCli);
    // El perfil usado y su procedencia se informan SIEMPRE, pase o falle.
    if (ok) {
      console.log(`✓ COBERTURA ${perfil}  ${path.basename(a)}  [perfil: ${origen}]`);
    } else {
      todosOk = false;
      console.log(`✗ ${path.basename(a)}  [perfil: ${perfil}, ${origen}]`);
      for (const i of incidencias) console.log(`   - ${i}`);
    }
  }
  process.exit(todosOk ? 0 : 1);
}

const esEjecucionDirecta =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) main();

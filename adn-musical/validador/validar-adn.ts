// Validador del ADN Musical de Teclas Jade (v0.2.0-draft).
// Estructural: ajv (JSON Schema draft 2020-12). Semántico: invariantes con
// aritmética de fracciones exactas (enteros); prohibido el punto flotante
// para duraciones y posiciones.
// Uso: npm run validar-adn [-- archivo1.json ...]
// Sin argumentos valida todos los .json de adn-musical/fixtures/.

import Ajv2020 from "ajv/dist/2020";
import * as fs from "node:fs";
import * as path from "node:path";

// ---------- fracciones exactas ----------

interface Frac {
  num: number;
  den: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function frac(num: number, den: number): Frac {
  if (den === 0) throw new Error("denominador 0");
  const g = gcd(num, den) || 1;
  const s = den < 0 ? -1 : 1;
  return { num: (num / g) * s, den: (den / g) * s };
}

function parseFrac(texto: string): Frac {
  const m = /^([0-9]+)\/([0-9]+)$/.exec(texto);
  if (!m) throw new Error(`fracción inválida: ${texto}`);
  return frac(Number(m[1]), Number(m[2]));
}

const add = (a: Frac, b: Frac): Frac => frac(a.num * b.den + b.num * a.den, a.den * b.den);
const sub = (a: Frac, b: Frac): Frac => frac(a.num * b.den - b.num * a.den, a.den * b.den);
const mul = (a: Frac, b: Frac): Frac => frac(a.num * b.num, a.den * b.den);
const cmp = (a: Frac, b: Frac): number => a.num * b.den - b.num * a.den;
const fstr = (a: Frac): string => `${a.num}/${a.den}`;

// ---------- alturas ----------

const STEP_SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function midiOf(p: { step: string; alter: number; octave: number }): number {
  return (p.octave + 1) * 12 + STEP_SEMITONE[p.step] + p.alter;
}

// Alturas ESCRITAS de las cuerdas al aire en EADGBE (la guitarra se escribe
// una octava arriba de lo que suena): 6ª=E3(52) 5ª=A3(57) 4ª=D4(62)
// 3ª=G4(67) 2ª=B4(71) 1ª=E5(76).
const OPEN_STRING_WRITTEN_MIDI: Record<number, number> = {
  6: 52, 5: 57, 4: 62, 3: 67, 2: 71, 1: 76,
};

// ---------- validación semántica ----------

export function validarSemantica(adn: any): string[] {
  const errores: string[] = [];
  const sem = adn.musical_semantics;
  const bu = parseFrac(sem.time.beat_unit);
  const durCompas = mul(frac(sem.time.beats_per_measure, 1), bu);

  const notasPorId = new Map<string, any>();
  for (const voz of sem.voices) {
    for (const ev of voz.events) {
      for (const n of ev.notes ?? []) notasPorId.set(n.id, n);
    }
  }

  for (const voz of sem.voices) {
    const porCompas = new Map<number, any[]>();
    for (const ev of voz.events) {
      if (ev.measure > sem.measures) {
        errores.push(`voz ${voz.id}: evento ${ev.id} en compás ${ev.measure} > measures=${sem.measures}`);
      }
      let lista = porCompas.get(ev.measure);
      if (!lista) {
        lista = [];
        porCompas.set(ev.measure, lista);
      }
      lista.push(ev);
    }
    for (const [m, evs] of [...porCompas.entries()].sort((x, y) => x[0] - y[0])) {
      // (a) suma de duraciones por compás y voz
      let suma = frac(0, 1);
      for (const ev of evs) suma = add(suma, parseFrac(ev.duration));
      if (cmp(suma, durCompas) !== 0) {
        errores.push(`voz ${voz.id}, compás ${m}: la suma de duraciones es ${fstr(suma)} y el compás dura ${fstr(durCompas)}`);
      }
      // (b) continuidad temporal (pulso 1 = inicio del compás)
      const orden = [...evs].sort((x, y) => cmp(parseFrac(x.beat), parseFrac(y.beat)));
      let cursor = frac(0, 1);
      for (const ev of orden) {
        const inicio = mul(sub(parseFrac(ev.beat), frac(1, 1)), bu);
        const c = cmp(inicio, cursor);
        if (c > 0) {
          errores.push(`voz ${voz.id}, compás ${m}: hueco antes de ${ev.id} (esperaba ${fstr(cursor)}, arranca en ${fstr(inicio)})`);
        } else if (c < 0) {
          errores.push(`voz ${voz.id}, compás ${m}: solapamiento en ${ev.id} (arranca en ${fstr(inicio)}, lo anterior terminó en ${fstr(cursor)})`);
        }
        cursor = add(inicio, parseFrac(ev.duration));
      }
      if (cmp(cursor, durCompas) !== 0) {
        errores.push(`voz ${voz.id}, compás ${m}: el último evento termina en ${fstr(cursor)}, no en ${fstr(durCompas)}`);
      }
    }
  }

  // (c) + (d) realización instrumental
  const real = adn.instrument_realization;
  if (real && real.kind === "guitar") {
    const asignadas = new Set<string>();
    for (const r of real.realizations) {
      if (!notasPorId.has(r.note_id)) {
        errores.push(`guitarra: realización de note_id inexistente ${r.note_id}`);
      }
      asignadas.add(r.note_id);
      const objetivo = notasPorId.get(r.note_id);
      if (objetivo) {
        const posiciones = [
          { string: r.string, fret: r.fret, rot: "principal" },
          ...(r.alternatives ?? []).map((a: any, i: number) => ({ string: a.string, fret: a.fret, rot: `alternativa ${i + 1}` })),
        ];
        for (const p of posiciones) {
          const esperado = midiOf(objetivo.written_pitch);
          const calculado = OPEN_STRING_WRITTEN_MIDI[p.string] + (real.capo ?? 0) + p.fret;
          if (calculado !== esperado) {
            errores.push(`guitarra: ${r.note_id} ${p.rot} (cuerda ${p.string}, traste ${p.fret}) da MIDI escrito ${calculado}, la nota pide ${esperado}`);
          }
        }
      }
    }
    for (const [id] of notasPorId) {
      if (!asignadas.has(id)) errores.push(`guitarra: nota melódica ${id} sin realización`);
    }
  }
  // (e) rango vocal
  if (real && real.kind === "voice") {
    const lo = midiOf(real.exercise_range.low);
    const hi = midiOf(real.exercise_range.high);
    for (const [id, n] of notasPorId) {
      const v = midiOf(n.written_pitch);
      if (v < lo || v > hi) {
        errores.push(`voz: nota ${id} (MIDI ${v}) fuera de exercise_range [${lo}, ${hi}]`);
      }
    }
  }

  // (f) alineación texto-voz
  const ali = adn.text_and_vocal_alignment;
  if (ali) {
    const silabas = new Set<string>();
    for (const w of ali.orthographic.words) {
      for (const s of w.syllables) silabas.add(s.id);
    }
    const usoSilaba = new Map<string, number>();
    const usoNota = new Map<string, number>();
    for (const u of ali.sung_units) {
      for (const sid of u.syllable_ids) {
        if (!silabas.has(sid)) errores.push(`alineación: unidad ${u.id} usa sílaba inexistente ${sid}`);
        usoSilaba.set(sid, (usoSilaba.get(sid) ?? 0) + 1);
      }
      for (const nid of u.note_ids) {
        if (!notasPorId.has(nid)) errores.push(`alineación: unidad ${u.id} usa nota inexistente ${nid}`);
        usoNota.set(nid, (usoNota.get(nid) ?? 0) + 1);
      }
      if (u.note_ids.length > 1 && u.melisma !== true) {
        errores.push(`alineación: unidad ${u.id} abarca ${u.note_ids.length} notas sin melisma: true`);
      }
      if ((u.junction === "sinalefa" || u.junction === "sineresis") && u.syllable_ids.length < 2) {
        errores.push(`alineación: unidad ${u.id} declara ${u.junction} con menos de 2 sílabas`);
      }
    }
    for (const [sid, c] of usoSilaba) if (c > 1) errores.push(`alineación: sílaba ${sid} usada ${c} veces`);
    for (const [nid, c] of usoNota) if (c > 1) errores.push(`alineación: nota ${nid} asignada a ${c} unidades`);
    for (const [nid] of notasPorId) {
      if (!usoNota.has(nid)) errores.push(`alineación: nota melódica ${nid} sin sílaba asignada`);
    }
  }

  // (g) gobernanza: transposición
  for (const v of adn.variants ?? []) {
    const claves = Object.keys(v.transform ?? {});
    if (claves.some((k) => k.includes("transpose")) && adn.evidence_governance.transposition_allowed !== true) {
      errores.push(`gobernanza: la variante ${v.id} transpone pero transposition_allowed es false`);
    }
  }

  return errores;
}

// ---------- validación estructural + total ----------

let validadorEstructural: (((data: unknown) => boolean) & { errors?: any }) | null = null;

function compilarSchema() {
  if (validadorEstructural) return validadorEstructural;
  const rutaSchema = path.join(__dirname, "..", "schema", "adn-musical.schema.json");
  const schema = JSON.parse(fs.readFileSync(rutaSchema, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  validadorEstructural = ajv.compile(schema) as any;
  return validadorEstructural!;
}

export function validarData(data: any): string[] {
  const errores: string[] = [];
  const validar = compilarSchema();
  if (!validar(data)) {
    for (const err of (validar as any).errors ?? []) {
      errores.push(`estructural ${err.instancePath || "/"}: ${err.message}`);
    }
    return errores; // sin estructura válida no se corre la semántica
  }
  errores.push(...validarSemantica(data));
  return errores;
}

export function validarArchivo(ruta: string): { ok: boolean; errores: string[] } {
  let data: any;
  try {
    data = JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e: any) {
    return { ok: false, errores: [`JSON inválido: ${e.message}`] };
  }
  const errores = validarData(data);
  return { ok: errores.length === 0, errores };
}

// ---------- CLI ----------

function main() {
  const args = process.argv.slice(2);
  const archivos =
    args.length > 0
      ? args
      : fs
          .readdirSync(path.join(__dirname, "..", "fixtures"))
          .filter((f) => f.endsWith(".json"))
          .sort()
          .map((f) => path.join(__dirname, "..", "fixtures", f));
  let todosOk = true;
  for (const a of archivos) {
    const { ok, errores } = validarArchivo(a);
    if (ok) {
      console.log(`✓ VÁLIDO  ${path.basename(a)}`);
    } else {
      todosOk = false;
      console.log(`✗ ${path.basename(a)}`);
      for (const e of errores) console.log(`   - ${e}`);
    }
  }
  process.exit(todosOk ? 0 : 1);
}

const esEjecucionDirecta =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) main();

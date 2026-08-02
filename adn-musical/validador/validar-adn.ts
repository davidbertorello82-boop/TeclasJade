// Validador del ADN Musical de Teclas Jade (v0.2.2-draft).
// Compuerta B: validación estructural (ajv, JSON Schema draft 2020-12) +
// semántica (invariantes B-1..B-8 con aritmética de fracciones exactas;
// prohibido el punto flotante para duraciones y posiciones).
// El vocabulario de identificadores `basis` vive en
// ../schema/evidence-basis.v2.json (v2, con contexto instrumental
// `instrument_kind`; copia ejecutable derivada del registro canónico del
// vault — v1 se conserva byte-intacto como antecedente histórico, sin uso en
// ejecución). Se carga y valida ÍNTEGRO antes de validar cualquier documento;
// ante cualquier defecto la compuerta falla cerrada con una única incidencia
// operational_error/registro_basis y NO ejecuta ni la fase estructural ni la
// semántica (jamás un mapa parcial).
// Uso: npm run validar-adn [-- archivo1.json ...]
// Sin argumentos valida todos los .json de adn-musical/fixtures/.

import Ajv2020, { type AnySchema, type ErrorObject, type ValidateFunction } from "ajv/dist/2020";
import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AdnDoc,
  EntradaBasis,
  EtiquetaEvidencia,
  EventoAdn,
  InstrumentKind,
  NotaAdn,
  OpcionesCarga,
  RegistroBasis,
  ResultadoCarga,
  WrittenPitch,
} from "../tipos/adn-tipos";
export type {
  AdnDoc,
  AlineacionTexto,
  AlternativaGuitarra,
  EntradaBasis,
  EntradaEvidenciaCampo,
  EtiquetaEvidencia,
  EventoAdn,
  GobernanzaAdn,
  InstrumentKind,
  NotaAdn,
  OpcionesCarga,
  PalabraAdn,
  RangoEscrito,
  RealizacionAdn,
  RealizacionInstrumento,
  RegistroBasis,
  ResultadoCarga,
  SeccionAdn,
  SemanticaMusical,
  SilabaAdn,
  UnidadCantada,
  VarianteAdn,
  VozAdn,
  WrittenPitch,
} from "../tipos/adn-tipos";

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

function midiOf(p: WrittenPitch): number {
  return (p.octave + 1) * 12 + STEP_SEMITONE[p.step] + p.alter;
}

// Alturas ESCRITAS de las cuerdas al aire en EADGBE (la guitarra se escribe
// una octava arriba de lo que suena): 6ª=E3(52) 5ª=A3(57) 4ª=D4(62)
// 3ª=G4(67) 2ª=B4(71) 1ª=E5(76).
const OPEN_STRING_WRITTEN_MIDI: Record<number, number> = {
  6: 52, 5: 57, 4: 62, 3: 67, 2: 71, 1: 76,
};

// ---------- registro de identificadores basis (mapa cerrado, v2) ----------

export const VERSION_ESQUEMA = "0.2.2-draft";
export const VERSION_REGISTRO = "v2";

export const ETIQUETAS_EVIDENCIA: readonly EtiquetaEvidencia[] = [
  "[verificado]",
  "[documentado]",
  "[confirmado por David]",
  "[calculado]",
  "[ilegible]",
  "[desconocido]",
];

const IDS_BASIS_APROBADOS = [
  "calc.exercise.written-range.v1",
  "calc.timeline.measure-beat.v1",
  "doc.render.canto-views.v1",
  "doc.render.initial-bpm.v1",
  "doc.render.minimum-controls.v1",
  "doc.render.piano-hand-colors.v1",
  "doc.render.piano-views.v1",
  "doc.render.reproducible-type.v1",
  "verify.text.language.v1",
] as const;

const RUTA_REGISTRO = path.join(__dirname, "..", "schema", "evidence-basis.v2.json");
const METADATOS_REGISTRO = [
  "registry",
  "version",
  "applies_to_schema_version",
  "canonical_source",
  "pointer_pattern_syntax",
  "entry_order",
  "instrument_kind_semantics",
] as const;
// En orden alfabético, para comparar contra Object.keys(entrada).sort().
const CAMPOS_ENTRADA = ["evidence", "id", "instrument_kind", "meaning", "pointer_pattern"] as const;
const RE_SEGMENTO_PATRON = /^[A-Za-z0-9_.-]+$/;

const KINDS_INSTRUMENTO = ["none", "voice", "guitar", "piano"] as const;

function esObjetoPlano(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function esEtiqueta(x: unknown): x is EtiquetaEvidencia {
  return typeof x === "string" && (ETIQUETAS_EVIDENCIA as readonly string[]).includes(x);
}

function esInstrumentKind(x: unknown): x is InstrumentKind {
  return x === null || (typeof x === "string" && (KINDS_INSTRUMENTO as readonly string[]).includes(x));
}

// Gramática aprobada de los patrones del registro: ("/" token)+ con
// token = "*" (exactamente un índice de array válido) o segmento [A-Za-z0-9_.-]+.
// Sin "~" en ninguna forma, sin "//", sin "/" final.
function patronValido(p: string): boolean {
  if (!p.startsWith("/")) return false;
  return p.slice(1).split("/").every((t) => t === "*" || RE_SEGMENTO_PATRON.test(t));
}

// Inyección controlada EXCLUSIVAMENTE para pruebas (ver OpcionesCarga en
// ../tipos/adn-tipos). Conducta determinista: `contenido !== undefined` usa
// ese texto sin tocar el disco; si no, `ruta`; si no, la ruta predeterminada
// resuelta respecto de ESTE módulo (nunca respecto del cwd). Prohibido para
// las pruebas: renombrar, borrar, sobrescribir o sustituir el registro real.
export function cargarRegistroBasis(op?: OpcionesCarga): ResultadoCarga {
  const falla = (detalle: string): ResultadoCarga => ({ ok: false, detalle });
  let texto: string;
  if (op?.contenido !== undefined) {
    texto = op.contenido;
  } else {
    const ruta = op?.ruta ?? RUTA_REGISTRO;
    if (!fs.existsSync(ruta)) return falla(`registro ausente en ${ruta}`);
    try {
      texto = fs.readFileSync(ruta, "utf8");
    } catch (e) {
      return falla(`registro ilegible: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch (e) {
    return falla(`JSON inválido: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!esObjetoPlano(crudo)) return falla("la raíz no es un objeto");
  for (const clave of METADATOS_REGISTRO) {
    if (typeof crudo[clave] !== "string" || crudo[clave] === "") {
      return falla(`metadato ausente o no textual: ${clave}`);
    }
  }
  if (crudo.registry !== "evidence-basis") {
    return falla(`registro no reconocido: registry=${JSON.stringify(crudo.registry)}`);
  }
  if (crudo.version !== VERSION_REGISTRO) {
    return falla(`versión de registro incompatible: ${JSON.stringify(crudo.version)} (se exige ${JSON.stringify(VERSION_REGISTRO)})`);
  }
  const aplica = crudo.applies_to_schema_version;
  if (aplica !== VERSION_ESQUEMA) {
    return falla(`versión de esquema incompatible: ${JSON.stringify(aplica)} (se exige ${VERSION_ESQUEMA})`);
  }
  const entriesCrudo = crudo.entries;
  if (!Array.isArray(entriesCrudo)) return falla("entries no es un array");
  const entradas: EntradaBasis[] = [];
  for (let i = 0; i < entriesCrudo.length; i++) {
    const e: unknown = entriesCrudo[i];
    if (!esObjetoPlano(e)) return falla(`entrada ${i}: no es un objeto`);
    const claves = Object.keys(e).sort();
    if (claves.length !== CAMPOS_ENTRADA.length || claves.some((c, j) => c !== CAMPOS_ENTRADA[j])) {
      return falla(`entrada ${i}: claves inválidas (${claves.join(", ")})`);
    }
    const id = e.id;
    if (typeof id !== "string" || id === "") return falla(`entrada ${i}: id vacío o no textual`);
    const meaning = e.meaning;
    if (typeof meaning !== "string" || meaning === "") return falla(`entrada ${i}: meaning vacío o no textual`);
    if (!esEtiqueta(e.evidence)) return falla(`entrada ${i}: etiqueta no permitida ${JSON.stringify(e.evidence)}`);
    if (!esInstrumentKind(e.instrument_kind)) {
      return falla(`entrada ${i}: instrument_kind no permitido ${JSON.stringify(e.instrument_kind)}`);
    }
    const patron = e.pointer_pattern;
    if (typeof patron !== "string" || !patronValido(patron)) {
      return falla(`entrada ${i}: patrón inválido ${JSON.stringify(patron)}`);
    }
    entradas.push({ id, evidence: e.evidence, instrument_kind: e.instrument_kind, pointer_pattern: patron, meaning });
  }
  const vistos = new Set<string>();
  for (const en of entradas) {
    if (vistos.has(en.id)) return falla(`identificador duplicado: ${en.id}`);
    vistos.add(en.id);
  }
  const aprobados = new Set<string>(IDS_BASIS_APROBADOS);
  const faltan = IDS_BASIS_APROBADOS.filter((x) => !vistos.has(x));
  const sobran = entradas.map((x) => x.id).filter((x) => !aprobados.has(x));
  if (faltan.length > 0 || sobran.length > 0) {
    return falla(`conjunto de identificadores inesperado — faltan: [${faltan.join(", ")}]; sobran: [${sobran.join(", ")}]`);
  }
  if (op?.exigirOrdenAlfabetico ?? true) {
    for (let i = 1; i < entradas.length; i++) {
      if (entradas[i - 1].id > entradas[i].id) {
        return falla(`orden no alfabético en la posición ${i} (${entradas[i].id})`);
      }
    }
  }
  return { ok: true, registro: { appliesToSchemaVersion: aplica, entradas } };
}

// ---------- punteros JSON (RFC 6901) ----------

export function decodificarPuntero(puntero: string): { ok: true; tokens: string[] } | { ok: false; motivo: string } {
  if (puntero === "") return { ok: false, motivo: "puntero vacío (la raíz queda fuera del contrato)" };
  if (!puntero.startsWith("/")) return { ok: false, motivo: "no comienza con '/'" };
  const tokens: string[] = [];
  for (const bruto of puntero.slice(1).split("/")) {
    let dec = "";
    for (let i = 0; i < bruto.length; i++) {
      const ch = bruto[i];
      if (ch === "~") {
        const sig = bruto[i + 1];
        if (sig === "0") {
          dec += "~";
          i++;
        } else if (sig === "1") {
          dec += "/";
          i++;
        } else {
          return { ok: false, motivo: `secuencia de escape inválida '~${sig ?? ""}'` };
        }
      } else {
        dec += ch;
      }
    }
    tokens.push(dec);
  }
  return { ok: true, tokens };
}

const RE_INDICE_ARRAY = /^(0|[1-9][0-9]*)$/;

// Resuelve tokens YA decodificados contra el documento, descendiendo SOLO por
// propiedades propias (hasOwnProperty); jamás por la cadena de prototipos.
export function resolverTokens(doc: unknown, tokens: readonly string[]): { ok: true } | { ok: false; motivo: string } {
  let actual: unknown = doc;
  for (const t of tokens) {
    if (Array.isArray(actual)) {
      if (!RE_INDICE_ARRAY.test(t)) return { ok: false, motivo: `índice de array inválido '${t}'` };
      const i = Number(t);
      if (i >= actual.length) return { ok: false, motivo: `índice ${t} fuera de rango` };
      actual = actual[i];
    } else if (esObjetoPlano(actual)) {
      if (!Object.prototype.hasOwnProperty.call(actual, t)) return { ok: false, motivo: `clave inexistente '${t}'` };
      actual = actual[t];
    } else {
      return { ok: false, motivo: `no se puede descender por '${t}': el valor no es contenedor` };
    }
  }
  return { ok: true };
}

export function resolverPuntero(doc: unknown, puntero: string): { ok: true; tokens: string[] } | { ok: false; motivo: string } {
  const dec = decodificarPuntero(puntero);
  if (!dec.ok) return dec;
  const res = resolverTokens(doc, dec.tokens);
  if (!res.ok) return res;
  return { ok: true, tokens: dec.tokens };
}

// Solapamiento sobre ARRAYS DE TOKENS decodificados (nunca por prefijo
// textual). "a_mas_especifico" = a desciende de b.
export type Solapamiento = "ninguno" | "iguales" | "a_mas_especifico" | "b_mas_especifico";

export function compararSolapamiento(a: readonly string[], b: readonly string[]): Solapamiento {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return "ninguno";
  }
  if (a.length === b.length) return "iguales";
  return a.length > b.length ? "a_mas_especifico" : "b_mas_especifico";
}

// Escapa una clave para usarla como token de instancePath (mismo formato que
// emite ajv): primero ~ → ~0, después / → ~1.
function escaparTokenPuntero(clave: string): string {
  return clave.replace(/~/g, "~0").replace(/\//g, "~1");
}

function coincidePatron(tokens: readonly string[], patron: string): boolean {
  const pt = patron.slice(1).split("/");
  if (pt.length !== tokens.length) return false;
  return pt.every((p, i) => (p === "*" ? RE_INDICE_ARRAY.test(tokens[i]) : p === tokens[i]));
}

// ---------- validación semántica ----------

export function validarSemantica(adn: AdnDoc, registro: RegistroBasis): string[] {
  const errores: string[] = [];
  const sem = adn.musical_semantics;
  const bu = parseFrac(sem.time.beat_unit);
  const durCompas = mul(frac(sem.time.beats_per_measure, 1), bu);

  // B-1: unicidad de identificadores musicales (event.id y note.id GLOBALES)
  const notasPorId = new Map<string, NotaAdn>();
  const idsVoz = new Set<string>();
  const idsEvento = new Set<string>();
  sem.voices.forEach((voz, vi) => {
    if (idsVoz.has(voz.id)) errores.push(`/musical_semantics/voices/${vi}/id: duplicado ${voz.id}`);
    idsVoz.add(voz.id);
    voz.events.forEach((ev, ei) => {
      if (idsEvento.has(ev.id)) errores.push(`/musical_semantics/voices/${vi}/events/${ei}/id: duplicado ${ev.id}`);
      idsEvento.add(ev.id);
      (ev.notes ?? []).forEach((n, ni) => {
        if (notasPorId.has(n.id)) {
          errores.push(`/musical_semantics/voices/${vi}/events/${ei}/notes/${ni}/id: duplicado ${n.id}`);
        }
        notasPorId.set(n.id, n);
      });
    });
  });
  const idsVariante = new Set<string>();
  (adn.variants ?? []).forEach((v, i) => {
    if (idsVariante.has(v.id)) errores.push(`/variants/${i}/id: duplicado ${v.id}`);
    idsVariante.add(v.id);
  });

  // Ritmo: suma por compás y continuidad temporal (sin cambios)
  for (const voz of sem.voices) {
    const porCompas = new Map<number, EventoAdn[]>();
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

  // B-1/B-3/B-5: estructura — roles únicos, measures en rango y sin repetidos,
  // repeats resoluble, sin autorreferencia y sin ciclos
  const estructura = sem.structure ?? [];
  const rolesVistos = new Set<string>();
  estructura.forEach((s, i) => {
    if (rolesVistos.has(s.role)) errores.push(`/musical_semantics/structure/${i}/role: duplicado ${s.role}`);
    rolesVistos.add(s.role);
    const compasesVistos = new Set<number>();
    for (const m of s.measures) {
      if (m < 1 || m > sem.measures) {
        errores.push(`/musical_semantics/structure/${i}/measures: fuera de rango ${m} (measures=${sem.measures})`);
      }
      if (compasesVistos.has(m)) errores.push(`/musical_semantics/structure/${i}/measures: compás repetido ${m}`);
      compasesVistos.add(m);
    }
  });
  const indicePorRole = new Map<string, number>();
  estructura.forEach((s, i) => {
    if (!indicePorRole.has(s.role)) indicePorRole.set(s.role, i);
  });
  const enCicloReportado = new Set<number>();
  estructura.forEach((s, i) => {
    if (s.repeats === undefined) return;
    if (!indicePorRole.has(s.repeats)) {
      errores.push(`/musical_semantics/structure/${i}/repeats: role inexistente ${s.repeats}`);
      enCicloReportado.add(i);
      return;
    }
    if (s.repeats === s.role) {
      errores.push(`/musical_semantics/structure/${i}/repeats: autorreferencia ${s.role}`);
      enCicloReportado.add(i);
    }
  });
  estructura.forEach((s, i) => {
    if (s.repeats === undefined || enCicloReportado.has(i)) return;
    const cadena = new Set<number>();
    let j: number | undefined = i;
    while (j !== undefined) {
      if (cadena.has(j)) {
        errores.push(`/musical_semantics/structure/${i}/repeats: ciclo detectado (${s.repeats})`);
        for (const k of cadena) enCicloReportado.add(k);
        return;
      }
      if (j !== i && enCicloReportado.has(j)) return; // desemboca en algo ya reportado
      cadena.add(j);
      const rep: string | undefined = estructura[j].repeats;
      if (rep === undefined || rep === estructura[j].role) return;
      j = indicePorRole.get(rep);
    }
  });

  // B-4: realizaciones de guitarra Y piano — note_id existente, cobertura
  // total y EXACTAMENTE una realización por note_id
  const real = adn.instrument_realization;
  if ((real.kind === "guitar" || real.kind === "piano") && real.realizations) {
    const conteo = new Map<string, number>();
    real.realizations.forEach((r, i) => {
      if (!notasPorId.has(r.note_id)) {
        errores.push(`/instrument_realization/realizations/${i}: note_id inexistente ${r.note_id}`);
      }
      const c = (conteo.get(r.note_id) ?? 0) + 1;
      conteo.set(r.note_id, c);
      if (c > 1) errores.push(`/instrument_realization/realizations/${i}: note_id repetido ${r.note_id}`);
    });
    for (const [id] of notasPorId) {
      if (!conteo.has(id)) errores.push(`/instrument_realization/realizations: falta realización para note_id ${id}`);
    }
  }
  // (c)+(d) guitarra: correspondencia altura ↔ cuerda/traste (sin cambios)
  if (real.kind === "guitar" && real.realizations) {
    for (const r of real.realizations) {
      const objetivo = notasPorId.get(r.note_id);
      if (objetivo && typeof r.string === "number" && typeof r.fret === "number") {
        const posiciones = [
          { string: r.string, fret: r.fret, rot: "principal" },
          ...(r.alternatives ?? []).map((a, i) => ({ string: a.string, fret: a.fret, rot: `alternativa ${i + 1}` })),
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
  }
  // B-8: exercise_range (voz y piano) es un cálculo automático — toda nota
  // dentro del rango y AMBAS cotas alcanzadas por alguna nota
  if ((real.kind === "voice" || real.kind === "piano") && real.exercise_range) {
    const lo = midiOf(real.exercise_range.low);
    const hi = midiOf(real.exercise_range.high);
    let hayLo = false;
    let hayHi = false;
    for (const [id, n] of notasPorId) {
      const v = midiOf(n.written_pitch);
      if (v < lo || v > hi) {
        errores.push(`/instrument_realization/exercise_range: nota ${id} (MIDI ${v}) fuera de [${lo}, ${hi}]`);
      }
      if (v === lo) hayLo = true;
      if (v === hi) hayHi = true;
    }
    if (notasPorId.size > 0 && !hayLo) {
      errores.push(`/instrument_realization/exercise_range/low: cota no alcanzada por ninguna nota (MIDI ${lo})`);
    }
    if (notasPorId.size > 0 && !hayHi) {
      errores.push(`/instrument_realization/exercise_range/high: cota no alcanzada por ninguna nota (MIDI ${hi})`);
    }
  }

  // (f) alineación texto-voz + B-2 unicidad de ids de texto + B-6 sílabas
  const ali = adn.text_and_vocal_alignment;
  if (ali) {
    const idsPalabra = new Set<string>();
    const idsSilabaDecl = new Set<string>();
    ali.orthographic.words.forEach((w, wi) => {
      if (idsPalabra.has(w.id)) errores.push(`/text_and_vocal_alignment/orthographic/words/${wi}/id: duplicado ${w.id}`);
      idsPalabra.add(w.id);
      w.syllables.forEach((sil, si) => {
        if (idsSilabaDecl.has(sil.id)) {
          errores.push(`/text_and_vocal_alignment/orthographic/words/${wi}/syllables/${si}/id: duplicado ${sil.id}`);
        }
        idsSilabaDecl.add(sil.id);
      });
    });
    const idsUnidad = new Set<string>();
    const usoSilaba = new Map<string, number>();
    const usoNota = new Map<string, number>();
    ali.sung_units.forEach((u, ui) => {
      if (idsUnidad.has(u.id)) errores.push(`/text_and_vocal_alignment/sung_units/${ui}/id: duplicado ${u.id}`);
      idsUnidad.add(u.id);
      for (const sid of u.syllable_ids) {
        if (!idsSilabaDecl.has(sid)) {
          errores.push(`/text_and_vocal_alignment/sung_units/${ui}/syllable_ids: sílaba inexistente ${sid}`);
        }
        usoSilaba.set(sid, (usoSilaba.get(sid) ?? 0) + 1);
      }
      for (const nid of u.note_ids) {
        if (!notasPorId.has(nid)) {
          errores.push(`/text_and_vocal_alignment/sung_units/${ui}/note_ids: nota inexistente ${nid}`);
        }
        usoNota.set(nid, (usoNota.get(nid) ?? 0) + 1);
      }
      if (u.note_ids.length > 1 && u.melisma !== true) {
        errores.push(`alineación: unidad ${u.id} abarca ${u.note_ids.length} notas sin melisma: true`);
      }
      if ((u.junction === "sinalefa" || u.junction === "sineresis") && u.syllable_ids.length < 2) {
        errores.push(`alineación: unidad ${u.id} declara ${u.junction} con menos de 2 sílabas`);
      }
    });
    for (const [sid, c] of usoSilaba) {
      if (c > 1) errores.push(`/text_and_vocal_alignment/sung_units: sílaba ${sid} usada ${c} veces`);
    }
    for (const sid of idsSilabaDecl) {
      if (!usoSilaba.has(sid)) errores.push(`/text_and_vocal_alignment/orthographic: sílaba ${sid} declarada y nunca usada`);
    }
    for (const [nid, c] of usoNota) {
      if (c > 1) errores.push(`alineación: nota ${nid} asignada a ${c} unidades`);
    }
    for (const [nid] of notasPorId) {
      if (!usoNota.has(nid)) errores.push(`alineación: nota melódica ${nid} sin sílaba asignada`);
    }
  }

  // (g) gobernanza: transposición (sin cambios)
  for (const v of adn.variants ?? []) {
    const claves = Object.keys(v.transform ?? {});
    if (claves.some((k) => k.includes("transpose")) && adn.evidence_governance.transposition_allowed !== true) {
      errores.push(`gobernanza: la variante ${v.id} transpone pero transposition_allowed es false`);
    }
  }

  // B-7: procedencia por dato (field_evidence) contra el mapa cerrado.
  // Por entrada se reporta SOLO la primera falla (una incidencia por ruta).
  const fe = adn.evidence_governance.field_evidence;
  if (fe !== undefined && fe !== null) {
    const porBasis = new Map<string, EntradaBasis>();
    for (const en of registro.entradas) porBasis.set(en.id, en);
    const claves = Object.keys(fe);
    const rutaDe = (clave: string): string => `/evidence_governance/field_evidence/${escaparTokenPuntero(clave)}`;
    const decodificadas = new Map<string, string[]>();
    const excluidas = new Set<string>();
    for (const clave of claves) {
      const dec = decodificarPuntero(clave);
      if (dec.ok) {
        decodificadas.set(clave, dec.tokens);
      } else {
        errores.push(`${rutaDe(clave)}: puntero inválido — ${dec.motivo}`);
        excluidas.add(clave);
      }
    }
    // Solapamiento padre/hijo entre punteros decodificados: se reporta
    // determinísticamente el MÁS ESPECÍFICO y queda excluido del resto.
    const clavesDec = claves.filter((c) => decodificadas.has(c));
    for (let i = 0; i < clavesDec.length; i++) {
      for (let j = i + 1; j < clavesDec.length; j++) {
        const a = clavesDec[i];
        const bb = clavesDec[j];
        if (excluidas.has(a) || excluidas.has(bb)) continue;
        const rel = compararSolapamiento(decodificadas.get(a) ?? [], decodificadas.get(bb) ?? []);
        if (rel === "a_mas_especifico") {
          errores.push(`${rutaDe(a)}: solapa con ${bb} (se prohíbe el solapamiento padre/hijo)`);
          excluidas.add(a);
        } else if (rel === "b_mas_especifico") {
          errores.push(`${rutaDe(bb)}: solapa con ${a} (se prohíbe el solapamiento padre/hijo)`);
          excluidas.add(bb);
        }
      }
    }
    for (const clave of claves) {
      if (excluidas.has(clave)) continue;
      const tokens = decodificadas.get(clave);
      if (!tokens) continue;
      const ruta = rutaDe(clave);
      if (tokens.length >= 2 && tokens[0] === "evidence_governance" && tokens[1] === "field_evidence") {
        errores.push(`${ruta}: el puntero apunta a field_evidence o a un descendiente suyo`);
        continue;
      }
      const res = resolverTokens(adn, tokens);
      if (!res.ok) {
        errores.push(`${ruta}: el puntero no resuelve — ${res.motivo}`);
        continue;
      }
      const entrada = fe[clave];
      const reg = porBasis.get(entrada.basis);
      if (!reg) {
        // El enum del esquema lo impide; defensa explícita ante desincronía.
        errores.push(`${ruta}: basis no registrado ${entrada.basis}`);
        continue;
      }
      if (reg.instrument_kind !== null && reg.instrument_kind !== real.kind) {
        errores.push(`${ruta}: el basis ${reg.id} es de contexto instrumental "${reg.instrument_kind}" y la realización del documento es "${real.kind}"`);
        continue;
      }
      if (entrada.evidence !== reg.evidence) {
        errores.push(`${ruta}: la etiqueta ${entrada.evidence} no corresponde — ${reg.id} exige ${reg.evidence}`);
        continue;
      }
      if (!coincidePatron(tokens, reg.pointer_pattern)) {
        errores.push(`${ruta}: el puntero no encaja en el patrón ${reg.pointer_pattern} de ${reg.id}`);
      }
    }
  }

  return errores;
}

// ---------- validación estructural + total ----------

let validadorEstructural: ValidateFunction | null = null;

function compilarSchema(): ValidateFunction {
  if (validadorEstructural) return validadorEstructural;
  const rutaSchema = path.join(__dirname, "..", "schema", "adn-musical.schema.json");
  // Única aserción de esquema del módulo: el archivo es el contrato del repo.
  const schema = JSON.parse(fs.readFileSync(rutaSchema, "utf8")) as AnySchema;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  validadorEstructural = ajv.compile(schema);
  return validadorEstructural;
}

// Compuerta B completa. `opcionesCarga` existe EXCLUSIVAMENTE para las
// pruebas del cargador del registro (inyección de ruta o de contenido); la
// ejecución normal y la CLI llaman validarData(data) sin segundo argumento y
// resuelven el registro por la ruta predeterminada relativa a este módulo.
// Si el registro no supera su validación íntegra, la compuerta falla cerrada:
// devuelve UNA única incidencia operational_error/registro_basis y no ejecuta
// ni la fase estructural ni la semántica.
export function validarData(data: unknown, opcionesCarga?: OpcionesCarga): string[] {
  const carga = cargarRegistroBasis(opcionesCarga);
  if (!carga.ok) return [`operational_error/registro_basis: ${carga.detalle}`];
  const errores: string[] = [];
  const validar = compilarSchema();
  if (!validar(data)) {
    const errsAjv: ErrorObject[] = validar.errors ?? [];
    for (const err of errsAjv) {
      errores.push(`estructural ${err.instancePath || "/"}: ${err.message}`);
    }
    return errores; // sin estructura válida no se corre la semántica
  }
  // Única aserción de tipo sobre datos: ajv acaba de garantizar la forma.
  const adn = data as AdnDoc;
  errores.push(...validarSemantica(adn, carga.registro));
  return errores;
}

export function validarArchivo(ruta: string): { ok: boolean; errores: string[] } {
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e) {
    return { ok: false, errores: [`JSON inválido: ${e instanceof Error ? e.message : String(e)}`] };
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

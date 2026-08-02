// Pruebas reproducibles de las dos compuertas del ADN Musical:
// B = validar-adn (estructural + semántica) · A2 = cobertura-v01 (cobertura v0.1).
// Construye casos EN MEMORIA (deep-copy de los archivos de disco + mutaciones)
// o por INYECCIÓN de contenido/ruta en el cargador del registro; está
// PROHIBIDO renombrar, borrar, sobrescribir o sustituir el registro real.
// Cada negativo verifica la RUTA/PREFIJO específico de la regla probada.
// Grupos: A históricos (34) · B positivos (3) · C gobernanza A2 (2) ·
// D unicidad (9) · E referencias (5) · F realizaciones (6) · G estructura (2) ·
// H texto (2) · I defensivos (4) · J field_evidence forma (7) · K mapa
// cerrado con contexto instrumental (33) · L cargador del registro v2 (22) ·
// R resolvedor RFC 6901 (14) · S solapamiento (3) · V versión única (5) ·
// W sincronización (7) · X migración (5) · Y exercise_range (4). Total: 167.
// Uso: npm run test:cobertura-adn — exit 0 solo si TODOS los casos pasan.

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  cargarRegistroBasis,
  compararSolapamiento,
  resolverPuntero,
  validarData,
  type AdnDoc,
} from "./validar-adn";
import { coberturaData } from "./cobertura-v01";

const BASE = path.join(__dirname, "..");
const rutas = {
  p1: path.join(BASE, "fixtures", "piloto-1-eco-ritmico.json"),
  p2: path.join(BASE, "fixtures", "piloto-2-mi-voz-sube.json"),
  p3: path.join(BASE, "fixtures", "piloto-3-subida-y-regreso.json"),
  ca: path.join(BASE, "conformance", "conformance-alteraciones.json"),
  cp: path.join(BASE, "conformance", "conformance-piano.json"),
};
const rutaEsperado = path.join(BASE, "pruebas", "inedito-01", "esperado.json");
const rutaRegistro = path.join(BASE, "schema", "evidence-basis.v2.json");
const rutaSchema = path.join(BASE, "schema", "adn-musical.schema.json");
const rutaSkill = path.join(BASE, "skill", "adn-musical-compilador", "SKILL.md");

const cargar = (r: string): AdnDoc => JSON.parse(fs.readFileSync(r, "utf8")) as AdnDoc;
const copia = (o: AdnDoc): AdnDoc => structuredClone(o);
// Acceso seguro a campos opcionales sin aserciones no nulas.
function req<T>(x: T | undefined | null, que: string): T {
  if (x === undefined || x === null) throw new Error(`caso mal construido: falta ${que}`);
  return x;
}

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
const b = (d: unknown) => validarData(d);
const a2 = (d: unknown) => coberturaData(d);
const detalles = (d: unknown) => [...b(d), ...a2(d)].join(" | ");
const pasaAmbas = (d: unknown) => b(d).length === 0 && a2(d).length === 0;
// La incidencia esperada debe estar presente identificada por su ruta/prefijo.
const tiene = (errs: string[], fragmento: string) => errs.some((e) => e.includes(fragmento));
// Nuevos helpers: EXACTAMENTE una incidencia anclada a la ruta dada.
const rutaExacta = (errs: string[], ruta: string) => errs.filter((e) => e.startsWith(`${ruta}: `)).length === 1;
const rutaEstructural = (errs: string[], ruta: string) => errs.filter((e) => e.startsWith(`estructural ${ruta}: `)).length === 1;
// Escape de instancePath (idéntico al de ajv): primero ~ → ~0, después / → ~1.
const escapar = (s: string) => s.replace(/~/g, "~0").replace(/\//g, "~1");
const rutaFe = (clave: string) => `/evidence_governance/field_evidence/${escapar(clave)}`;

// ---------- A. positivos históricos ----------

for (const r of Object.values(rutas)) {
  const d = cargar(r);
  caso(`positivo: ${path.basename(r)} pasa B`, b(d).length === 0, b(d).join(" | "));
  caso(`positivo: ${path.basename(r)} pasa A2`, a2(d).length === 0, a2(d).join(" | "));
}

{
  // guitarra alter +2: Fa##4 = MIDI escrito 67 = 4ª cuerda, traste 5
  const d = copia(cargar(rutas.ca));
  req(d.musical_semantics.voices[0].events[0].notes, "notes")[0].written_pitch = { step: "F", alter: 2, octave: 4 };
  req(d.instrument_realization.realizations, "realizations")[0] = { note_id: "n01", string: 4, fret: 5, finger: 4, alternatives: [] };
  caso("positivo: guitarra con alter +2", pasaAmbas(d), detalles(d));
}
{
  // guitarra alter -2: Sibb3 = MIDI escrito 57 = 5ª cuerda al aire
  const d = copia(cargar(rutas.ca));
  req(d.musical_semantics.voices[0].events[1].notes, "notes")[0].written_pitch = { step: "B", alter: -2, octave: 3 };
  req(d.instrument_realization.realizations, "realizations")[1] = { note_id: "n02", string: 5, fret: 0, finger: 0, alternatives: [] };
  caso("positivo: guitarra con alter -2", pasaAmbas(d), detalles(d));
}
{
  // piano con mano izquierda y digitación válida (hand_colors reglamentarios intactos)
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.realizations = req(d.instrument_realization.realizations, "realizations").map(
    (r, i) => ({ ...r, hand: "left", finger: 5 - i }),
  );
  caso("positivo: piano mano izquierda", pasaAmbas(d), detalles(d));
}
{
  // gap "one_measure" en estructura líder/eco
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[1].gap = "one_measure";
  caso("positivo: gap one_measure", pasaAmbas(d), detalles(d));
}

// ---------- A. negativos históricos ----------

{
  const d = copia(cargar(rutas.ca));
  req(d.musical_semantics.voices[0].events[0].notes, "notes")[0].written_pitch.alter = 3;
  caso("negativo: alter 3 rechazado por B (esquema)", b(d).length > 0);
  caso(
    "negativo: alter 3 rechazado por A2 en /written_pitch/alter (regla 10)",
    tiene(a2(d), "/written_pitch/alter"),
    a2(d).join(" | "),
  );
}
{
  // acorde: 2 notas en un evento, con realización coherente para aislar A2
  const d = copia(cargar(rutas.p3));
  req(d.musical_semantics.voices[0].events[0].notes, "notes").push({ id: "n90", written_pitch: { step: "B", alter: 0, octave: 4 } });
  req(d.instrument_realization.realizations, "realizations").push({ note_id: "n90", string: 2, fret: 0, finger: 0, alternatives: [] });
  caso(
    "negativo: acorde (2 notas por evento) rechazado por A2",
    tiene(a2(d), "/musical_semantics/voices/0/events/0/notes: se admite exactamente 1 nota"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices.push({
    id: "v2",
    kind: "percussive",
    events: d.musical_semantics.voices[0].events.map((e, i) => ({ ...structuredClone(e), id: `x${i + 1}` })),
  });
  caso(
    "negativo: segunda voz rechazada por A2",
    tiene(a2(d), "/musical_semantics/voices: se admite exactamente 1 voz"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p2));
  d.musical_semantics.key = { tonic: "G", mode: "major" };
  caso(
    "negativo: key Sol mayor rechazada por A2",
    tiene(a2(d), "/musical_semantics/key: obligatoria y solo C major o A minor"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p3));
  delete d.musical_semantics.key;
  caso(
    "negativo: melodía sin key rechazada por A2",
    tiene(a2(d), "/musical_semantics/key: obligatoria y solo C major o A minor"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.key = { tonic: "C", mode: "major" };
  caso(
    "negativo: percusión con key rechazada por A2",
    tiene(a2(d), "/musical_semantics/key: la percusión no admite"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices[0].events[0].notes = [{ id: "n91", written_pitch: { step: "C", alter: 0, octave: 4 } }];
  caso(
    "negativo: percusión con notes rechazada por A2",
    tiene(a2(d), "/musical_semantics/voices/0/events/0: voz percusiva con 'notes'"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.time.signature = "3/4";
  caso(
    "negativo: signature 3/4 rechazada por A2",
    tiene(a2(d), "/musical_semantics/time/signature"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.anacrusis = {};
  caso(
    "negativo: anacrusis presente rechazada por A2",
    tiene(a2(d), "/musical_semantics/anacrusis"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p3));
  d.instrument_realization.tuning = "DADGBE";
  caso(
    "negativo: tuning DADGBE rechazado por A2",
    tiene(a2(d), "/instrument_realization/tuning"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p3));
  d.instrument_realization.sounding_transposition_octaves = -2;
  caso(
    "negativo: sounding -2 rechazado por A2",
    tiene(a2(d), "/instrument_realization/sounding_transposition_octaves"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p2));
  req(d.variants, "variants")[0].transform = { fragmentar: true };
  caso(
    "negativo: variante fragmentar rechazada por A2",
    tiene(a2(d), "/variants/0/transform"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p2));
  d.evidence_governance.transposition_allowed = false;
  caso(
    "negativo: variante transpose sin transposition_allowed rechazada por A2",
    tiene(a2(d), "/evidence_governance/transposition_allowed"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.p1));
  d.presentation_and_rendering.controls.push("step_forward");
  caso(
    "negativo: control step_forward rechazado por A2",
    tiene(a2(d), "/presentation_and_rendering/controls"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.cp));
  d.presentation_and_rendering.hand_colors = { right: "azul", left: "naranja" };
  caso(
    "negativo: hand_colors invertidos rechazados por A2",
    tiene(a2(d), "/presentation_and_rendering/hand_colors"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.cp));
  req(d.instrument_realization.realizations, "realizations")[0].note_id = "n99";
  caso(
    "negativo: piano con note_id huérfano rechazado por A2",
    tiene(a2(d), "/instrument_realization/realizations/0: note_id inexistente n99"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.cp));
  req(d.instrument_realization.realizations, "realizations").pop();
  caso(
    "negativo: piano con nota sin realización rechazado por A2",
    tiene(a2(d), "/instrument_realization/realizations: falta realización para note_id n04"),
    a2(d).join(" | "),
  );
}

// ---------- A. Corrección 1: pasa B pero viola A2 (ambos resultados explícitos) ----------

{
  const d = copia(cargar(rutas.p2));
  d.musical_semantics.key = { tonic: "G", mode: "major" };
  caso("corrección 1: ADN en Sol mayor estructuralmente impecable pasa B", b(d).length === 0, b(d).join(" | "));
  caso(
    "corrección 1: el mismo ADN NO pasa A2 (cobertura, /musical_semantics/key)",
    tiene(a2(d), "/musical_semantics/key: obligatoria y solo C major o A minor"),
    a2(d).join(" | "),
  );
}

// ---------- B. positivos nuevos ----------

{
  const e = cargar(rutaEsperado);
  caso("B1: esperado.json (15 entradas de field_evidence) pasa B", b(e).length === 0, b(e).join(" | "));
  caso("B2: esperado.json pasa A2", a2(e).length === 0, a2(e).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices.push({
    id: "v2",
    kind: "percussive",
    events: d.musical_semantics.voices[0].events.map((e, i) => ({ ...structuredClone(e), id: `y${i + 1}` })),
  });
  caso("B3: multivoz con event.id únicos pasa B (la restricción de 1 voz es de A2)", b(d).length === 0, b(d).join(" | "));
}

// ---------- C. negativos A2: incidencias de gobernanza ----------

{
  const d = copia(cargar(rutas.p1));
  d.evidence_governance.unsupported_features = [{ locator: "compás 1", description: "tresillo" }];
  caso("C1: unsupported_features no vacío rechazado por A2", rutaExacta(a2(d), "/evidence_governance/unsupported_features"), a2(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  d.evidence_governance.unknown_notation = [{ locator: "compás 1", description: "signo vé" }];
  caso("C2: unknown_notation no vacío rechazado por A2", rutaExacta(a2(d), "/evidence_governance/unknown_notation"), a2(d).join(" | "));
}

// ---------- D. unicidad de identificadores (Compuerta B) ----------

{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices.push({
    id: "v1",
    kind: "percussive",
    events: d.musical_semantics.voices[0].events.map((e, i) => ({ ...structuredClone(e), id: `z${i + 1}` })),
  });
  caso("D1: voice.id duplicado", rutaExacta(b(d), "/musical_semantics/voices/1/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices[0].events[1].id = d.musical_semantics.voices[0].events[0].id;
  caso("D2: event.id duplicado en la misma voz", rutaExacta(b(d), "/musical_semantics/voices/0/events/1/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.voices.push({
    id: "v2",
    kind: "percussive",
    events: d.musical_semantics.voices[0].events.map((e) => structuredClone(e)),
  });
  caso("D3: event.id duplicado entre voces", rutaExacta(b(d), "/musical_semantics/voices/1/events/0/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p3));
  req(d.musical_semantics.voices[0].events[1].notes, "notes")[0].id = "n01";
  caso("D4: note.id duplicado", rutaExacta(b(d), "/musical_semantics/voices/0/events/1/notes/0/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").orthographic.words[1].id = "w1";
  caso("D5: word.id duplicado", rutaExacta(b(d), "/text_and_vocal_alignment/orthographic/words/1/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").orthographic.words[1].syllables[0].id = "s1";
  caso("D6: syllable.id duplicado", rutaExacta(b(d), "/text_and_vocal_alignment/orthographic/words/1/syllables/0/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").sung_units[1].id = "u1";
  caso("D7: sung_unit.id duplicado", rutaExacta(b(d), "/text_and_vocal_alignment/sung_units/1/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  const vars = req(d.variants, "variants");
  vars.push(structuredClone(vars[0]));
  caso("D8: variant.id duplicado", rutaExacta(b(d), "/variants/1/id"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  const est = req(d.musical_semantics.structure, "structure");
  est[1].role = est[0].role;
  caso("D9: structure.role duplicado", rutaExacta(b(d), "/musical_semantics/structure/1/role"), b(d).join(" | "));
}

// ---------- E. resolución inequívoca de referencias (Compuerta B) ----------

{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").sung_units[0].syllable_ids = ["s99"];
  caso("E1: sílaba inexistente", rutaExacta(b(d), "/text_and_vocal_alignment/sung_units/0/syllable_ids"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").sung_units[0].note_ids = ["n99"];
  caso("E2: nota inexistente", rutaExacta(b(d), "/text_and_vocal_alignment/sung_units/0/note_ids"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[1].repeats = "zzz";
  caso("E3: repeats hacia role inexistente", rutaExacta(b(d), "/musical_semantics/structure/1/repeats"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[1].repeats = "eco";
  caso("E4: repeats autorreferente", rutaExacta(b(d), "/musical_semantics/structure/1/repeats"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[0].repeats = "eco"; // eco ya repite a lider → ciclo
  caso("E5: repeats cíclico", rutaExacta(b(d), "/musical_semantics/structure/0/repeats"), b(d).join(" | "));
}

// ---------- F. realizaciones: guitarra y piano (Compuerta B) ----------

{
  const d = copia(cargar(rutas.p3));
  const reals = req(d.instrument_realization.realizations, "realizations");
  reals.push(structuredClone(reals[0]));
  caso("F1: guitarra con dos realizaciones para la misma nota", rutaExacta(b(d), "/instrument_realization/realizations/7"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p3));
  req(d.instrument_realization.realizations, "realizations")[0].note_id = "n99";
  caso("F2: guitarra con note_id inexistente (B)", rutaExacta(b(d), "/instrument_realization/realizations/0"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p3));
  req(d.instrument_realization.realizations, "realizations").pop();
  caso("F3: guitarra con nota sin realización (B)", rutaExacta(b(d), "/instrument_realization/realizations"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.cp));
  const reals = req(d.instrument_realization.realizations, "realizations");
  reals.push(structuredClone(reals[0]));
  caso("F4: piano con dos realizaciones para la misma nota", rutaExacta(b(d), "/instrument_realization/realizations/4"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.cp));
  req(d.instrument_realization.realizations, "realizations")[0].note_id = "n99";
  caso("F5: piano con note_id inexistente (B)", rutaExacta(b(d), "/instrument_realization/realizations/0"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.cp));
  req(d.instrument_realization.realizations, "realizations").pop();
  caso("F6: piano con nota sin realización (B)", rutaExacta(b(d), "/instrument_realization/realizations"), b(d).join(" | "));
}

// ---------- G. estructura: measures (Compuerta B) ----------

{
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[0].measures = [1, 99];
  caso("G1: structure.measures fuera de rango", rutaExacta(b(d), "/musical_semantics/structure/0/measures"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p1));
  req(d.musical_semantics.structure, "structure")[0].measures = [1, 1];
  caso("G2: structure.measures con compás repetido", rutaExacta(b(d), "/musical_semantics/structure/0/measures"), b(d).join(" | "));
}

// ---------- H. texto: cada sílaba exactamente una vez (Compuerta B) ----------

{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").orthographic.words[0].syllables.push({ id: "s90", text: "za" });
  caso("H1: sílaba declarada y nunca usada", rutaExacta(b(d), "/text_and_vocal_alignment/orthographic"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.p2));
  req(d.text_and_vocal_alignment, "alineación").sung_units[1].syllable_ids = ["s1"];
  caso("H2: sílaba usada dos veces", rutaExacta(b(d), "/text_and_vocal_alignment/sung_units"), b(d).join(" | "));
}

// ---------- I. defensivos: entradas unknown sin lanzar ----------

{
  const casosI: Array<[string, unknown]> = [
    ["null", null],
    ["42", 42],
    ["objeto vacío", {}],
    ["malformado (voices no-array)", { musical_semantics: { voices: "x" } }],
  ];
  for (const [nombre, doc] of casosI) {
    caso(`I: ${nombre} rechazado por ambas compuertas sin excepción`, b(doc).length > 0 && a2(doc).length > 0, detalles(doc));
  }
}

// ---------- J. field_evidence: compatibilidad y forma (esquema) ----------

const esperadoBase = cargar(rutaEsperado);
function conFe(fe: unknown): AdnDoc {
  const d = copia(esperadoBase);
  (d.evidence_governance as unknown as Record<string, unknown>).field_evidence = fe;
  return d;
}
const CLAVE_TYPE = "/presentation_and_rendering/type";
const ENTRADA_TYPE_OK = { evidence: "[documentado]", basis: "doc.render.reproducible-type.v1" };

{
  const d = conFe(null);
  caso("J1: field_evidence null es válido", b(d).length === 0, b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: "texto" });
  caso("J2: entrada string rechazada (estructural)", rutaEstructural(b(d), rutaFe(CLAVE_TYPE)), b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: { basis: ENTRADA_TYPE_OK.basis } });
  caso("J3: entrada sin evidence rechazada (estructural)", rutaEstructural(b(d), rutaFe(CLAVE_TYPE)), b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: { evidence: ENTRADA_TYPE_OK.evidence } });
  caso("J4: entrada sin basis rechazada (estructural)", rutaEstructural(b(d), rutaFe(CLAVE_TYPE)), b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: { ...ENTRADA_TYPE_OK, nota: "x" } });
  caso("J5: propiedad adicional rechazada (estructural)", rutaEstructural(b(d), rutaFe(CLAVE_TYPE)), b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: { evidence: "[aproximado]", basis: ENTRADA_TYPE_OK.basis } });
  caso("J6: etiqueta fuera del vocabulario rechazada (estructural)", rutaEstructural(b(d), `${rutaFe(CLAVE_TYPE)}/evidence`), b(d).join(" | "));
}
{
  const d = conFe({ [CLAVE_TYPE]: { evidence: ENTRADA_TYPE_OK.evidence, basis: "doc.render.inventado.v1" } });
  caso("J7: basis no registrado rechazado (estructural, enum)", rutaEstructural(b(d), `${rutaFe(CLAVE_TYPE)}/basis`), b(d).join(" | "));
}

// ---------- K. mapa cerrado basis → evidence + patrón (end-to-end) ----------

const ACEPTACIONES: ReadonlyArray<readonly [string, string, string]> = [
  ["/instrument_realization/exercise_range", "[calculado]", "calc.exercise.written-range.v1"],
  ["/musical_semantics/voices/0/events/0/beat", "[calculado]", "calc.timeline.measure-beat.v1"],
  ["/presentation_and_rendering/views", "[documentado]", "doc.render.canto-views.v1"],
  ["/presentation_and_rendering/bpm_initial", "[documentado]", "doc.render.initial-bpm.v1"],
  ["/presentation_and_rendering/controls", "[documentado]", "doc.render.minimum-controls.v1"],
  ["/presentation_and_rendering/type", "[documentado]", "doc.render.reproducible-type.v1"],
  ["/text_and_vocal_alignment/language", "[verificado]", "verify.text.language.v1"],
];
for (const [puntero, etiqueta, basis] of ACEPTACIONES) {
  const d = conFe({ [puntero]: { evidence: etiqueta, basis } });
  caso(`K aceptación: ${basis} sobre ${puntero}`, b(d).length === 0, b(d).join(" | "));
}
const ETIQUETA_INCORRECTA: Record<string, string> = {
  "[calculado]": "[verificado]",
  "[documentado]": "[calculado]",
  "[verificado]": "[documentado]",
};
for (const [puntero, etiqueta, basis] of ACEPTACIONES) {
  const mala = ETIQUETA_INCORRECTA[etiqueta];
  const d = conFe({ [puntero]: { evidence: mala, basis } });
  caso(`K etiqueta incorrecta: ${mala} para ${basis}`, rutaExacta(b(d), rutaFe(puntero)), b(d).join(" | "));
}
const PUNTERO_INCOMPATIBLE: Record<string, string> = {
  "calc.exercise.written-range.v1": "/musical_semantics/time",
  "calc.timeline.measure-beat.v1": "/musical_semantics/voices/0/events/0/duration",
  "doc.render.canto-views.v1": "/presentation_and_rendering/type",
  "doc.render.initial-bpm.v1": "/presentation_and_rendering/views",
  "doc.render.minimum-controls.v1": "/presentation_and_rendering/bpm_initial",
  "doc.render.reproducible-type.v1": "/presentation_and_rendering/controls",
  "verify.text.language.v1": "/text_and_vocal_alignment/sung_units",
};
for (const [, etiqueta, basis] of ACEPTACIONES) {
  const puntero = PUNTERO_INCOMPATIBLE[basis];
  const d = conFe({ [puntero]: { evidence: etiqueta, basis } });
  caso(`K puntero incompatible para ${basis}`, rutaExacta(b(d), rutaFe(puntero)), b(d).join(" | "));
}
{
  const clave = "/musical_semantics/voices/0/events/9/beat";
  const d = conFe({ [clave]: { evidence: "[calculado]", basis: "calc.timeline.measure-beat.v1" } });
  caso("K puntero que no resuelve", rutaExacta(b(d), rutaFe(clave)), b(d).join(" | "));
}
{
  const clave = "/evidence_governance/field_evidence";
  const d = conFe({ [clave]: { evidence: "[verificado]", basis: "verify.text.language.v1" } });
  caso("K puntero a field_evidence", rutaExacta(b(d), rutaFe(clave)), b(d).join(" | "));
}
{
  const clave = "/evidence_governance/field_evidence/x";
  const d = conFe({ [clave]: { evidence: "[verificado]", basis: "verify.text.language.v1" } });
  caso("K puntero a descendiente de field_evidence", rutaExacta(b(d), rutaFe(clave)), b(d).join(" | "));
}
{
  const d = conFe({
    "/presentation_and_rendering/views": { evidence: "[documentado]", basis: "doc.render.canto-views.v1" },
    "/presentation_and_rendering/views/0": { evidence: "[documentado]", basis: "doc.render.canto-views.v1" },
  });
  const errs = b(d);
  caso(
    "K solapamiento padre/hijo: se señala el puntero más específico",
    errs.length === 1 && rutaExacta(errs, rutaFe("/presentation_and_rendering/views/0")),
    errs.join(" | "),
  );
}

// ---------- K. basis de piano y contexto instrumental (registro v2) ----------

const cpBase = cargar(rutas.cp);
function cpConFe(fe: unknown): AdnDoc {
  const d = copia(cpBase);
  (d.evidence_governance as unknown as Record<string, unknown>).field_evidence = fe;
  return d;
}
{
  const d = cpConFe({ "/presentation_and_rendering/views": { evidence: "[documentado]", basis: "doc.render.piano-views.v1" } });
  caso("K aceptación: doc.render.piano-views.v1 sobre ADN de piano", b(d).length === 0, b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/hand_colors": { evidence: "[documentado]", basis: "doc.render.piano-hand-colors.v1" } });
  caso("K aceptación: doc.render.piano-hand-colors.v1 sobre ADN de piano", b(d).length === 0, b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/views": { evidence: "[calculado]", basis: "doc.render.piano-views.v1" } });
  caso("K etiqueta incorrecta: [calculado] para doc.render.piano-views.v1", rutaExacta(b(d), rutaFe("/presentation_and_rendering/views")), b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/hand_colors": { evidence: "[calculado]", basis: "doc.render.piano-hand-colors.v1" } });
  caso("K etiqueta incorrecta: [calculado] para doc.render.piano-hand-colors.v1", rutaExacta(b(d), rutaFe("/presentation_and_rendering/hand_colors")), b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/type": { evidence: "[documentado]", basis: "doc.render.piano-views.v1" } });
  caso("K puntero incompatible para doc.render.piano-views.v1", rutaExacta(b(d), rutaFe("/presentation_and_rendering/type")), b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/controls": { evidence: "[documentado]", basis: "doc.render.piano-hand-colors.v1" } });
  caso("K puntero incompatible para doc.render.piano-hand-colors.v1", rutaExacta(b(d), rutaFe("/presentation_and_rendering/controls")), b(d).join(" | "));
}
{
  const d = cpConFe({ "/presentation_and_rendering/views": { evidence: "[documentado]", basis: "doc.render.canto-views.v1" } });
  caso(
    "K contexto: canto-views citado en ADN de piano → rechazado",
    rutaExacta(b(d), rutaFe("/presentation_and_rendering/views")) && tiene(b(d), "contexto instrumental"),
    b(d).join(" | "),
  );
}
{
  const d = conFe({ "/presentation_and_rendering/views": { evidence: "[documentado]", basis: "doc.render.piano-views.v1" } });
  caso(
    "K contexto: piano-views citado en ADN de canto → rechazado",
    rutaExacta(b(d), rutaFe("/presentation_and_rendering/views")) && tiene(b(d), "contexto instrumental"),
    b(d).join(" | "),
  );
}

// ---------- L. cargador del registro (fallo cerrado, 19 casos) ----------

const textoRegistroReal = fs.readFileSync(rutaRegistro, "utf8");
const nuevoRegistro = (): Record<string, unknown> => JSON.parse(textoRegistroReal) as Record<string, unknown>;
const entradasDe = (r: Record<string, unknown>): Array<Record<string, unknown>> => r.entries as Array<Record<string, unknown>>;
const conContenido = (r: Record<string, unknown>) => cargarRegistroBasis({ contenido: JSON.stringify(r) });
const detalleDe = (c: ReturnType<typeof cargarRegistroBasis>): string => (c.ok ? "(cargó)" : c.detalle);

{
  const rutaFantasma = path.join(BASE, "schema", "no-existe-registro.json");
  const carga = cargarRegistroBasis({ ruta: rutaFantasma });
  const errs = validarData(cargar(rutas.p1), { ruta: rutaFantasma });
  caso(
    "L1: registro ausente — cargador y validarData fallan cerrado (una sola incidencia)",
    !carga.ok && carga.detalle.includes("registro ausente") &&
      errs.length === 1 && errs[0].startsWith("operational_error/registro_basis:") && errs[0].includes("registro ausente"),
    `${detalleDe(carga)} | ${errs.join(" | ")}`,
  );
}
{
  const dirTmp = fs.mkdtempSync(path.join(os.tmpdir(), "adn-basis-"));
  try {
    const carga = cargarRegistroBasis({ ruta: dirTmp });
    caso("L2: registro ilegible (ruta a directorio)", !carga.ok && carga.detalle.includes("registro ilegible"), detalleDe(carga));
  } finally {
    fs.rmdirSync(dirTmp);
  }
}
{
  const carga = cargarRegistroBasis({ contenido: '{"registry":' });
  caso("L3: JSON sintácticamente inválido", !carga.ok && carga.detalle.includes("JSON inválido"), detalleDe(carga));
}
{
  const carga = cargarRegistroBasis({ contenido: "[]" });
  caso("L4: raíz array rechazada", !carga.ok && carga.detalle.includes("la raíz no es un objeto"), detalleDe(carga));
}
{
  const carga = cargarRegistroBasis({ contenido: "null" });
  caso("L5: raíz null rechazada", !carga.ok && carga.detalle.includes("la raíz no es un objeto"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  delete r.canonical_source;
  const carga = conContenido(r);
  caso("L6: metadato obligatorio ausente", !carga.ok && carga.detalle.includes("metadato ausente o no textual: canonical_source"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  r.registry = "otro";
  const carga = conContenido(r);
  caso("L7: registro no reconocido", !carga.ok && carga.detalle.includes("registro no reconocido"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  r.applies_to_schema_version = "0.2.0-draft";
  const carga = conContenido(r);
  const errs = validarData(cargar(rutas.p1), { contenido: JSON.stringify(r) });
  caso(
    "L8: versión de esquema incompatible — validarData falla cerrado (una sola incidencia)",
    !carga.ok && carga.detalle.includes("versión de esquema incompatible") &&
      errs.length === 1 && errs[0].startsWith("operational_error/registro_basis:") && errs[0].includes("incompatible"),
    `${detalleDe(carga)} | ${errs.join(" | ")}`,
  );
}
{
  const r = nuevoRegistro();
  r.entries = {};
  const carga = conContenido(r);
  caso("L9: entries no-array rechazado", !carga.ok && carga.detalle.includes("entries no es un array"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  delete entradasDe(r)[0].meaning;
  const carga = conContenido(r);
  caso("L10: entrada con campo faltante", !carga.ok && carga.detalle.includes("claves inválidas"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].nota = "extra";
  const carga = conContenido(r);
  caso("L11: entrada con campo adicional", !carga.ok && carga.detalle.includes("claves inválidas"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].id = "";
  const carga = conContenido(r);
  caso("L12: id vacío", !carga.ok && carga.detalle.includes("id vacío o no textual"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].evidence = "[aproximado]";
  const carga = conContenido(r);
  caso("L13: etiqueta de evidencia inválida", !carga.ok && carga.detalle.includes("etiqueta no permitida"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].pointer_pattern = "musical_semantics/x";
  const carga = conContenido(r);
  caso("L14: patrón sin '/' inicial", !carga.ok && carga.detalle.includes("patrón inválido"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].pointer_pattern = "/a/~b";
  const carga = conContenido(r);
  caso("L15: patrón con '~' (fuera de la gramática)", !carga.ok && carga.detalle.includes("patrón inválido"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  entradasDe(r)[1].id = entradasDe(r)[0].id;
  const carga = conContenido(r);
  const errs = validarData(cargar(rutas.p1), { contenido: JSON.stringify(r) });
  caso(
    "L16: identificador duplicado — validarData falla cerrado (una sola incidencia)",
    !carga.ok && carga.detalle.includes("identificador duplicado") &&
      errs.length === 1 && errs[0].startsWith("operational_error/registro_basis:") && errs[0].includes("identificador duplicado"),
    `${detalleDe(carga)} | ${errs.join(" | ")}`,
  );
}
{
  const r = nuevoRegistro();
  entradasDe(r).splice(0, 1);
  const carga = conContenido(r);
  caso(
    "L17: falta un identificador aprobado",
    !carga.ok && carga.detalle.includes("faltan: [calc.exercise.written-range.v1]"),
    detalleDe(carga),
  );
}
{
  const r = nuevoRegistro();
  entradasDe(r).push({ id: "doc.render.zz-extra.v1", evidence: "[documentado]", instrument_kind: null, pointer_pattern: "/x", meaning: "extra" });
  const carga = conContenido(r);
  caso(
    "L18: identificador ajeno al conjunto aprobado",
    !carga.ok && carga.detalle.includes("sobran: [doc.render.zz-extra.v1]"),
    detalleDe(carga),
  );
}
{
  const r = nuevoRegistro();
  r.version = "v1";
  const carga = conContenido(r);
  caso("L19: registro version v1 rechazado (se exige v2)", !carga.ok && carga.detalle.includes("versión de registro incompatible"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  delete r.instrument_kind_semantics;
  const carga = conContenido(r);
  caso(
    "L20: instrument_kind_semantics ausente rechazado",
    !carga.ok && carga.detalle.includes("metadato ausente o no textual: instrument_kind_semantics"),
    detalleDe(carga),
  );
}
{
  const r = nuevoRegistro();
  entradasDe(r)[0].instrument_kind = "drums";
  const carga = conContenido(r);
  caso("L21: instrument_kind inválido rechazado", !carga.ok && carga.detalle.includes("instrument_kind no permitido"), detalleDe(carga));
}
{
  const r = nuevoRegistro();
  const es = entradasDe(r);
  const tmp = es[0];
  es[0] = es[1];
  es[1] = tmp;
  const carga = conContenido(r);
  caso("L22: orden no alfabético rechazado", !carga.ok && carga.detalle.includes("orden no alfabético"), detalleDe(carga));
}

// ---------- R. unitarias del resolvedor RFC 6901 ----------

caso("R1: resuelve clave de objeto", resolverPuntero({ a: { b: 1 } }, "/a/b").ok);
caso("R2: resuelve elemento de array", resolverPuntero({ a: [10, 20] }, "/a/1").ok);
caso("R3: resuelve campo con valor null", resolverPuntero({ a: null }, "/a").ok);
caso("R4: resuelve '~1' como '/'", resolverPuntero({ "a/b": 1 }, "/a~1b").ok);
caso("R5: resuelve '~0' como '~'", resolverPuntero({ "a~b": 1 }, "/a~0b").ok);
caso("R6: rechaza escape '~2'", !resolverPuntero({ a: 1 }, "/a~2b").ok);
caso("R7: rechaza '~' terminal", !resolverPuntero({ a: 1 }, "/a~").ok);
caso("R8: rechaza puntero vacío", !resolverPuntero({ a: 1 }, "").ok);
caso("R9: rechaza puntero sin '/' inicial", !resolverPuntero({ a: 1 }, "a").ok);
caso("R10: rechaza índice fuera de rango", !resolverPuntero({ a: [1] }, "/a/1").ok);
caso("R11: rechaza índice '00'", !resolverPuntero({ a: [1] }, "/a/00").ok);
caso("R12: rechaza token '-' de array", !resolverPuntero({ a: [1] }, "/a/-").ok);
caso("R13: no desciende por el prototipo ('/toString')", !resolverPuntero({}, "/toString").ok);
caso("R14: rechaza clave inexistente", !resolverPuntero({ a: 1 }, "/b").ok);

// ---------- S. unitarias del comparador de solapamiento (tokens) ----------

caso("S1: ['a','b'] y ['a','bc'] no solapan", compararSolapamiento(["a", "b"], ["a", "bc"]) === "ninguno");
caso("S2: índices '1' y '10' no solapan", compararSolapamiento(["a", "1"], ["a", "10"]) === "ninguno");
caso("S3: ['a','b'] y ['a','b','c'] solapan y el más específico es el segundo", compararSolapamiento(["a", "b"], ["a", "b", "c"]) === "b_mas_especifico");

// ---------- V. versión única del esquema ----------

{
  const d = copia(cargar(rutas.p1));
  caso("V1: 0.2.2-draft es la versión aceptada", d.schema_version === "0.2.2-draft" && b(d).length === 0, `${d.schema_version} | ${b(d).join(" | ")}`);
}
for (const mala of ["0.2.1-draft", "0.2.0-draft", "0.2.2", "0.3.0-draft"]) {
  const d = copia(cargar(rutas.p1));
  d.schema_version = mala;
  caso(`V: schema_version ${mala} rechazada`, rutaEstructural(b(d), "/schema_version"), b(d).join(" | "));
}

// ---------- W. sincronización registro ↔ esquema ↔ SKILL ----------

{
  const schemaJson = JSON.parse(fs.readFileSync(rutaSchema, "utf8")) as Record<string, unknown>;
  const defs = schemaJson.$defs as Record<string, unknown>;
  const enumIds = ((defs.evidenceBasisId as Record<string, unknown>).enum as string[]).slice().sort();
  const carga = cargarRegistroBasis();
  const entradasReg = carga.ok ? carga.registro.entradas : [];
  const idsRegistro = entradasReg.map((e) => e.id).slice().sort();
  caso(
    "W1: enum evidenceBasisId del esquema == identificadores del registro",
    carga.ok && JSON.stringify(enumIds) === JSON.stringify(idsRegistro),
    `enum=[${enumIds.join(",")}] registro=[${idsRegistro.join(",")}]`,
  );

  const skillTexto = fs.readFileSync(rutaSkill, "utf8");
  const filas = [...skillTexto.matchAll(/^\|\s*`([a-z0-9.\-]+)`\s*\|\s*`(\[[^\]]+\])`\s*\|\s*`([^`]+)`\s*\|\s*`(none|voice|guitar|piano|null)`\s*\|\s*$/gm)]
    .map((m) => ({ id: m[1], evidence: m[2], patron: m[3], contexto: m[4] }));
  const porIdSkill = new Map(filas.map((f) => [f.id, f]));
  caso(
    "W2: identificadores de la tabla ejecutable del SKILL == registro",
    carga.ok && filas.length === 9 && idsRegistro.every((id) => porIdSkill.has(id)),
    `filas=${filas.length} [${filas.map((f) => f.id).join(",")}]`,
  );
  caso(
    "W3: etiquetas de la tabla ejecutable del SKILL == registro",
    carga.ok && entradasReg.every((e) => porIdSkill.get(e.id)?.evidence === e.evidence),
    entradasReg.map((e) => `${e.id}:${porIdSkill.get(e.id)?.evidence ?? "?"}`).join(" "),
  );
  caso(
    "W4: patrones de la tabla ejecutable del SKILL == registro",
    carga.ok && entradasReg.every((e) => porIdSkill.get(e.id)?.patron === e.pointer_pattern),
    entradasReg.map((e) => `${e.id}:${porIdSkill.get(e.id)?.patron ?? "?"}`).join(" "),
  );
  caso(
    "W5: registro real con 9 entradas, orden alfabético y 5 campos exactos",
    carga.ok && entradasReg.length === 9,
    detalleDe(carga),
  );
  const constVersion = ((schemaJson.properties as Record<string, unknown>).schema_version as Record<string, unknown>).const;
  caso(
    "W6: applies_to_schema_version del registro == const de schema_version del esquema",
    carga.ok && carga.registro.appliesToSchemaVersion === constVersion,
    `registro=${carga.ok ? carga.registro.appliesToSchemaVersion : "?"} esquema=${String(constVersion)}`,
  );
  caso(
    "W7: contextos instrumentales de la tabla ejecutable del SKILL == registro",
    carga.ok && entradasReg.every((e) => (porIdSkill.get(e.id)?.contexto ?? "?") === (e.instrument_kind === null ? "null" : e.instrument_kind)),
    entradasReg.map((e) => `${e.id}:${porIdSkill.get(e.id)?.contexto ?? "?"}`).join(" "),
  );
}

// ---------- X. migración declarada a 0.2.1-draft ----------

for (const rutaDoc of Object.values(rutas)) {
  const d = cargar(rutaDoc);
  caso(`X: ${path.basename(rutaDoc)} declara 0.2.2-draft`, d.schema_version === "0.2.2-draft", d.schema_version);
}

// ---------- Y. exercise_range: cálculo automático con cotas alcanzadas ----------

{
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.exercise_range = {
    low: { step: "C", alter: 0, octave: 4 },
    high: { step: "F", alter: 0, octave: 4 },
  };
  caso("Y1: piano con exercise_range exacto pasa B", b(d).length === 0, b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.exercise_range = {
    low: { step: "C", alter: 0, octave: 4 },
    high: { step: "E", alter: 0, octave: 4 },
  };
  caso("Y2: piano con nota fuera del rango rechazado", rutaExacta(b(d), "/instrument_realization/exercise_range"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.exercise_range = {
    low: { step: "B", alter: 0, octave: 3 },
    high: { step: "F", alter: 0, octave: 4 },
  };
  caso("Y3: cota inferior no alcanzada rechazada (piano)", rutaExacta(b(d), "/instrument_realization/exercise_range/low"), b(d).join(" | "));
}
{
  const d = copia(cargar(rutaEsperado));
  req(d.instrument_realization.exercise_range, "exercise_range").high = { step: "F", alter: 0, octave: 4 };
  caso("Y4: cota superior no alcanzada rechazada (voz)", rutaExacta(b(d), "/instrument_realization/exercise_range/high"), b(d).join(" | "));
}

console.log("");
console.log(`Casos: ${total} — fallos: ${fallos}`);
process.exit(fallos === 0 ? 0 : 1);

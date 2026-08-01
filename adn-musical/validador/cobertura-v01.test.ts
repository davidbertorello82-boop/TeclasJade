// Pruebas reproducibles de las dos compuertas del ADN Musical:
// B = validar-adn (estructural + semántica) · A2 = cobertura-v01 (cobertura v0.1).
// Construye casos EN MEMORIA (deep-copy de los archivos de disco + mutaciones).
// Cada negativo de A2 verifica la RUTA/PREFIJO específico de la regla probada,
// para evitar falsos positivos causados por otro error accidental.
// Uso: npm run test:cobertura-adn — exit 0 solo si TODOS los casos pasan.

import * as fs from "node:fs";
import * as path from "node:path";
import { validarData } from "./validar-adn";
import { coberturaData } from "./cobertura-v01";

const BASE = path.join(__dirname, "..");
const rutas = {
  p1: path.join(BASE, "fixtures", "piloto-1-eco-ritmico.json"),
  p2: path.join(BASE, "fixtures", "piloto-2-mi-voz-sube.json"),
  p3: path.join(BASE, "fixtures", "piloto-3-subida-y-regreso.json"),
  ca: path.join(BASE, "conformance", "conformance-alteraciones.json"),
  cp: path.join(BASE, "conformance", "conformance-piano.json"),
};
const cargar = (r: string) => JSON.parse(fs.readFileSync(r, "utf8"));
const copia = (o: any) => structuredClone(o);

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
const b = (d: any) => validarData(d);
const a2 = (d: any) => coberturaData(d);
const detalles = (d: any) => [...b(d), ...a2(d)].join(" | ");
const pasaAmbas = (d: any) => b(d).length === 0 && a2(d).length === 0;
// La incidencia esperada debe estar presente identificada por su ruta/prefijo.
const tiene = (errs: string[], fragmento: string) => errs.some((e) => e.includes(fragmento));

// ---------- positivos ----------

for (const r of Object.values(rutas)) {
  const d = cargar(r);
  caso(`positivo: ${path.basename(r)} pasa B`, b(d).length === 0, b(d).join(" | "));
  caso(`positivo: ${path.basename(r)} pasa A2`, a2(d).length === 0, a2(d).join(" | "));
}

{
  // guitarra alter +2: Fa##4 = MIDI escrito 67 = 4ª cuerda, traste 5
  const d = copia(cargar(rutas.ca));
  d.musical_semantics.voices[0].events[0].notes[0].written_pitch = { step: "F", alter: 2, octave: 4 };
  d.instrument_realization.realizations[0] = { note_id: "n01", string: 4, fret: 5, finger: 4, alternatives: [] };
  caso("positivo: guitarra con alter +2", pasaAmbas(d), detalles(d));
}
{
  // guitarra alter -2: Sibb3 = MIDI escrito 57 = 5ª cuerda al aire
  const d = copia(cargar(rutas.ca));
  d.musical_semantics.voices[0].events[1].notes[0].written_pitch = { step: "B", alter: -2, octave: 3 };
  d.instrument_realization.realizations[1] = { note_id: "n02", string: 5, fret: 0, finger: 0, alternatives: [] };
  caso("positivo: guitarra con alter -2", pasaAmbas(d), detalles(d));
}
{
  // piano con mano izquierda y digitación válida (hand_colors reglamentarios intactos)
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.realizations = d.instrument_realization.realizations.map(
    (r: any, i: number) => ({ ...r, hand: "left", finger: 5 - i }),
  );
  caso("positivo: piano mano izquierda", pasaAmbas(d), detalles(d));
}
{
  // gap "one_measure" en estructura líder/eco
  const d = copia(cargar(rutas.p1));
  d.musical_semantics.structure[1].gap = "one_measure";
  caso("positivo: gap one_measure", pasaAmbas(d), detalles(d));
}

// ---------- negativos ----------

{
  const d = copia(cargar(rutas.ca));
  d.musical_semantics.voices[0].events[0].notes[0].written_pitch.alter = 3;
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
  d.musical_semantics.voices[0].events[0].notes.push({ id: "n90", written_pitch: { step: "B", alter: 0, octave: 4 } });
  d.instrument_realization.realizations.push({ note_id: "n90", string: 2, fret: 0, finger: 0, alternatives: [] });
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
    events: d.musical_semantics.voices[0].events.map((e: any, i: number) => ({ ...structuredClone(e), id: `x${i + 1}` })),
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
  d.variants[0].transform = { fragmentar: true };
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
  d.instrument_realization.realizations[0].note_id = "n99";
  caso(
    "negativo: piano con note_id huérfano rechazado por A2",
    tiene(a2(d), "/instrument_realization/realizations/0: note_id inexistente n99"),
    a2(d).join(" | "),
  );
}
{
  const d = copia(cargar(rutas.cp));
  d.instrument_realization.realizations.pop();
  caso(
    "negativo: piano con nota sin realización rechazado por A2",
    tiene(a2(d), "/instrument_realization/realizations: falta realización para note_id n04"),
    a2(d).join(" | "),
  );
}

// ---------- Corrección 1: pasa B pero viola A2 (ambos resultados explícitos) ----------

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

console.log("");
console.log(`Casos: ${total} — fallos: ${fallos}`);
process.exit(fallos === 0 ? 0 : 1);

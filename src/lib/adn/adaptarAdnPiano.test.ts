// Pruebas del adaptador puro ADN → demostración de piano (ADN-UI-1).
// Trabaja sobre la copia real embarcada + mutaciones EN MEMORIA. Verifica
// alturas, fracciones exactas, tiempo/orden, BPM, mano/dedo, rango dinámico,
// rechazos de cobertura del renderer, equivalencia con lo aprobado, colores,
// pureza y vistas. Total impreso al final; exit 0 solo si todo pasa.
// Uso: npm run test:adn-ui (primer tramo) o tsx src/lib/adn/adaptarAdnPiano.test.ts

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import type { AdnDoc } from "../../../adn-musical/tipos/adn-tipos";
import type { NotaEvento } from "../aulas/tipos";
import { AULA_PIANO } from "../aulas/piano/contenido";
import { adaptarAdnPiano, AdnNoSoportadoError } from "./adaptarAdnPiano";

const RUTA_ADN = path.join(__dirname, "..", "aulas", "piano", "adn", "piano-b1-e1-mapa-ciego.json");
const base = JSON.parse(fs.readFileSync(RUTA_ADN, "utf8")) as AdnDoc;
const mut = (): AdnDoc => structuredClone(base);
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
const igual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function rechaza(d: AdnDoc, fragmento: string): boolean {
  try {
    adaptarAdnPiano(d);
    return false;
  } catch (e) {
    return e instanceof AdnNoSoportadoError && e.incidencias.some((i) => i.includes(fragmento));
  }
}

// La secuencia aprobada del Mapa Ciego (patrón canónico de David).
const SECUENCIA_APROBADA: NotaEvento[] = [
  { pitchMidi: 60, mano: "MD", dedo: 1, inicioBeat: 0, duracionBeat: 1 },
  { pitchMidi: 62, mano: "MD", dedo: 2, inicioBeat: 1, duracionBeat: 1 },
  { pitchMidi: 64, mano: "MD", dedo: 3, inicioBeat: 2, duracionBeat: 1 },
  { pitchMidi: 65, mano: "MD", dedo: 4, inicioBeat: 3, duracionBeat: 1 },
  { pitchMidi: 67, mano: "MD", dedo: 5, inicioBeat: 4, duracionBeat: 4 },
];
// Huellas congeladas de las TRES secuencias antiguas que NO se migran.
const HASH_LEGADO: Record<string, string> = {
  // Corregida en el Lote I (03/08/2026): movimiento contrario con digitacion
  // espejada —ambas manos con el mismo dedo—. El valor anterior era
  // B0C90CAA74618AAE84A4627B14502EE7000572A51789453FCB05D92B417ACF40, con la
  // mano izquierda invertida por aplicar 6 - dedo a un movimiento contrario.
  "piano-b1-e3-espejo-agua": "DD98217A82CFFB34C9F07E3ADBA558CFD338B43A7B2C927E1C6AF87F81972A8B",
  "piano-b1-e4-dialogo-compartido": "5DBCF6DF0A4AE9B25BFD209541E98F575128E5EBC9768530796993CC39A5C37A",
  "piano-b1-lab-teclas-negras": "B85B51796C84EBC016B79C124DB43E720C7EF9E3D1B44501ED8D014C8AF44311",
};

const demo = adaptarAdnPiano(base);

// ---------- AD1. alturas ----------
caso("AD1: Do4 → MIDI 60", demo.secuencia[0].pitchMidi === 60);
caso("AD1: Sol4 → MIDI 67", demo.secuencia[4].pitchMidi === 67);
{
  const d = mut();
  req(d.musical_semantics.voices[0].events[0].notes, "notes")[0].written_pitch = { step: "G", alter: 1, octave: 3 };
  caso("AD1: alteración Sol#3 → MIDI 56", adaptarAdnPiano(d).secuencia[0].pitchMidi === 56);
}

// ---------- AD2. fracciones exactas ----------
caso("AD2: redonda \"1/1\" → 4 pulsos exactos", demo.secuencia[4].duracionBeat === 4);
{
  const d = mut();
  d.musical_semantics.voices[0].events[0].duration = "1/8";
  caso("AD2: corchea \"1/8\" → 0.5 pulsos exactos", adaptarAdnPiano(d).secuencia[0].duracionBeat === 0.5);
}
caso("AD2: negra \"1/4\" → exactamente 1 (sin deriva flotante)", demo.secuencia[0].duracionBeat === 1);

// ---------- AD3. tiempo y orden ----------
caso("AD3: inicios absolutos [0,1,2,3,4]", igual(demo.secuencia.map((n) => n.inicioBeat), [0, 1, 2, 3, 4]));
caso("AD3: e05 cruza al compás 2 en el pulso absoluto 4", demo.secuencia[4].inicioBeat === 4);
{
  const d = mut();
  d.musical_semantics.voices[0].events.reverse();
  caso("AD3: entrada desordenada → salida ordenada por compás/pulso", igual(adaptarAdnPiano(d).secuencia, demo.secuencia));
}
{
  const d = mut();
  d.musical_semantics.voices[0].events[1].beat = "7/2";
  const s = adaptarAdnPiano(d).secuencia;
  const nota = s.find((n) => n.pitchMidi === 62);
  caso("AD3: beat \"7/2\" sintético → inicio 2.5 exacto", nota !== undefined && nota.inicioBeat === 2.5, JSON.stringify(nota));
}

// ---------- AD4. BPM ----------
caso("AD4: bpmSugerido = bpm_initial = 60", demo.bpmSugerido === 60);
{
  const d = mut();
  d.presentation_and_rendering.bpm_initial = 90;
  caso("AD4: bpm_initial ≠ time.bpm → rechazo", rechaza(d, "bpm_initial"));
}

// ---------- AD5. mano y digitación ----------
caso("AD5: MD con dedos 1-5", demo.secuencia.every((n, i) => n.mano === "MD" && n.dedo === i + 1));
{
  const d = mut();
  req(d.instrument_realization.realizations, "realizations")[0].hand = "left";
  caso("AD5: realización left → MI", adaptarAdnPiano(d).secuencia[0].mano === "MI");
}

// ---------- AD6. rango dinámico ----------
caso("AD6: rango del Mapa Ciego = C3-B4 {48,71}", igual(demo.rangoTeclado, { minMidi: 48, maxMidi: 71 }));
caso("AD6: mínimo pedagógico de 2 octavas exactas", demo.rangoTeclado.maxMidi - demo.rangoTeclado.minMidi + 1 === 24);
{
  const d = mut();
  req(d.musical_semantics.voices[0].events[0].notes, "notes")[0].written_pitch = { step: "A", alter: 0, octave: 3 };
  caso("AD6: normalización Do-Si (La3 → piso C3, sin expansión extra)", igual(adaptarAdnPiano(d).rangoTeclado, { minMidi: 48, maxMidi: 71 }));
}
{
  const d = mut();
  req(d.musical_semantics.voices[0].events[4].notes, "notes")[0].written_pitch = { step: "G", alter: 0, octave: 6 };
  caso("AD6: más de dos octavas → C4-B6 {60,95}", igual(adaptarAdnPiano(d).rangoTeclado, { minMidi: 60, maxMidi: 95 }));
}
{
  const d = mut();
  req(d.musical_semantics.voices[0].events[0].notes, "notes")[0].written_pitch = { step: "G", alter: 0, octave: 12 };
  caso("AD6: MIDI fuera de 0-127 → rechazo", rechaza(d, "fuera de 0-127"));
}

// ---------- AD7. rechazos de cobertura del renderer ----------
{
  const d = mut();
  d.instrument_realization.kind = "guitar";
  caso("AD7: kind guitar → rechazo", rechaza(d, "solo ejecuta piano"));
}
{
  const d = mut();
  d.instrument_realization.kind = "none";
  caso("AD7: kind none → rechazo", rechaza(d, "solo ejecuta piano"));
}
{
  const d = mut();
  d.musical_semantics.voices.push(structuredClone(d.musical_semantics.voices[0]));
  caso("AD7: dos voces → rechazo", rechaza(d, "voces"));
}
{
  const d = mut();
  const notas = req(d.musical_semantics.voices[0].events[0].notes, "notes");
  notas.push({ id: "n90", written_pitch: { step: "E", alter: 0, octave: 4 } });
  caso("AD7: dos notas simultáneas en un evento → rechazo", rechaza(d, "simultáneas"));
}
{
  const d = mut();
  d.variants = [{ id: "v", transform: { transpose_octaves: -1 } }];
  caso("AD7: variantes presentes → rechazo", rechaza(d, "variants"));
}
{
  const d = mut();
  d.musical_semantics.structure = [{ role: "a", measures: [1] }, { role: "b", measures: [2], repeats: "a" }];
  caso("AD7: structure con repeats → rechazo", rechaza(d, "repeats"));
}
{
  const d = mut();
  d.musical_semantics.structure = [{ role: "a", measures: [1, 2], gap: "one_measure" }];
  caso("AD7: gap one_measure → rechazo", rechaza(d, "gap"));
}
{
  const d = mut();
  d.presentation_and_rendering.views = ["keyboard", "tablature"];
  caso("AD7: vista no declarable (tablature) → rechazo", rechaza(d, "no declarable"));
}
{
  const d = mut();
  d.presentation_and_rendering.views = ["staff_treble"];
  caso("AD7: views sin keyboard → rechazo", rechaza(d, "keyboard"));
}
{
  const d = mut();
  d.presentation_and_rendering.controls = ["play", "pause", "restart", "bpm_slider"];
  caso("AD7: controles incompletos → rechazo", rechaza(d, "controls"));
}

// ---------- AD8. equivalencia con lo aprobado ----------
{
  const e1 = AULA_PIANO.bloques[0].ejercicios.find((e) => e.slug === "piano-b1-e1-mapa-ciego");
  caso("AD8: la secuencia del Mapa Ciego en contenido.ts == la aprobada", igual(e1?.secuencia, SECUENCIA_APROBADA), JSON.stringify(e1?.secuencia));
}
{
  let ok = true;
  let detalle = "";
  for (const [slug, esperado] of Object.entries(HASH_LEGADO)) {
    const e = AULA_PIANO.bloques[0].ejercicios.find((x) => x.slug === slug);
    const h = crypto.createHash("sha256").update(JSON.stringify(e?.secuencia)).digest("hex").toUpperCase();
    if (h !== esperado) {
      ok = false;
      detalle += `${slug}:${h} `;
    }
  }
  caso("AD8: las 3 secuencias antiguas siguen byte-idénticas (sin migrar)", ok, detalle);
}

// ---------- AD9. colores ----------
caso("AD9: coloresMano = palabras canónicas del ADN", igual(demo.coloresMano, { derecha: "naranja", izquierda: "azul" }));
{
  const d = mut();
  d.presentation_and_rendering.hand_colors = { right: "azul", left: "naranja" };
  caso("AD9: hand_colors invertidos → rechazo", rechaza(d, "hand_colors"));
}

// ---------- AD10. pureza ----------
{
  const antes = JSON.stringify(base);
  const a = adaptarAdnPiano(base);
  const b = adaptarAdnPiano(base);
  caso("AD10: determinista y sin mutar la entrada", igual(a, b) && JSON.stringify(base) === antes);
}

// ---------- AD11. vistas ----------
caso("AD11: staff_treble reportada como declarada no renderizada", igual(demo.vistasNoRenderizadas, ["staff_treble"]));
{
  const d = mut();
  d.presentation_and_rendering.views = ["keyboard"];
  caso("AD11: solo keyboard → sin vistas pendientes", igual(adaptarAdnPiano(d).vistasNoRenderizadas, []));
}

console.log("");
console.log(`Casos: ${total} — fallos: ${fallos}`);
process.exit(fallos === 0 ? 0 : 1);

// Adaptador PURO ADN → demostración de piano (Circuito de Demostración ADN).
// Sin efectos: no lee disco, no muta la entrada, mismo ADN → misma salida.
// Rechaza con AdnNoSoportadoError toda característica musical que el renderer
// no ejecuta. Las VISTAS declaradas no renderizables soportadas (staff_treble)
// NO bloquean ni se omiten: se reportan en `vistasNoRenderizadas` (ajuste
// canónico registrado en ADN-DOC-P2). Regla de solo demostración (doc 10 §8):
// este módulo solo produce datos de SALIDA (animación/sonido); jamás lee ni
// evalúa la ejecución del alumno.

import type { AdnDoc, EventoAdn } from "../../../adn-musical/tipos/adn-tipos";
import type { Dedo, Mano, NotaEvento } from "../aulas/tipos";

export interface DemoPiano {
  slug: string;
  titulo: string;
  secuencia: NotaEvento[];
  bpmSugerido: number;
  // Normalizado a octavas completas Do–Si, mínimo 2 octavas (doc 10 §10),
  // expandiendo hacia la grave (la octava grave es de la mano izquierda).
  rangoTeclado: { minMidi: number; maxMidi: number };
  // Palabras del ADN (hand_colors); la paleta hex documentada vive en TecladoAuto.
  coloresMano: { derecha: string; izquierda: string };
  vistasRenderizadas: string[];
  vistasNoRenderizadas: string[];
}

export class AdnNoSoportadoError extends Error {
  readonly incidencias: readonly string[];
  constructor(incidencias: string[]) {
    super(`ADN no soportado por el renderer de piano:\n- ${incidencias.join("\n- ")}`);
    this.name = "AdnNoSoportadoError";
    this.incidencias = incidencias;
  }
}

const VISTAS_DECLARABLES = new Set(["keyboard", "staff_treble"]);
const CONTROLES_EXACTOS = ["bpm_slider", "loop", "pause", "play", "restart"]; // orden alfabético
const STEP_SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

interface Frac {
  num: number;
  den: number;
}

function parseFrac(texto: string, inc: string[], donde: string): Frac {
  const m = /^([0-9]+)\/([0-9]+)$/.exec(texto);
  if (!m || Number(m[2]) === 0) {
    inc.push(`${donde}: fracción inválida "${texto}"`);
    return { num: 0, den: 1 };
  }
  return { num: Number(m[1]), den: Number(m[2]) };
}
const cmpFrac = (a: Frac, b: Frac): number => a.num * b.den - b.num * a.den;
// División exacta de racionales; el paso a number queda en el borde final
// (para las duraciones y posiciones reales del proyecto el valor es diádico y
// exacto en IEEE-754).
const divANumero = (a: Frac, b: Frac): number => (a.num * b.den) / (a.den * b.num);

export function adaptarAdnPiano(adn: AdnDoc): DemoPiano {
  const inc: string[] = [];
  const real = adn.instrument_realization;
  const pres = adn.presentation_and_rendering;
  const sem = adn.musical_semantics;

  if (real.kind !== "piano") inc.push(`instrument_realization.kind "${real.kind}": este adaptador solo ejecuta piano`);
  if (sem.voices.length !== 1) inc.push(`${sem.voices.length} voces: el renderer ejecuta exactamente 1`);
  const voz = sem.voices[0];
  if (voz && voz.kind !== "melodic") inc.push(`voz "${voz.kind}": el renderer de piano ejecuta solo voz melódica`);
  if ((adn.variants ?? []).length > 0) inc.push("variants presentes: el renderer no ejecuta variantes");
  for (const s of sem.structure ?? []) {
    if (s.repeats !== undefined) inc.push(`structure.role "${s.role}" con repeats: el renderer no ejecuta repeticiones`);
    if (s.gap !== undefined && s.gap !== "none") inc.push(`structure.role "${s.role}" con gap "${s.gap}": no soportado`);
  }
  if (!pres.views.includes("keyboard")) {
    inc.push(`views ${JSON.stringify(pres.views)}: falta "keyboard", la única vista renderizable`);
  }
  for (const v of pres.views) {
    if (!VISTAS_DECLARABLES.has(v)) inc.push(`vista "${v}": no declarable para piano en este renderer`);
  }
  const controles = [...pres.controls].sort();
  if (controles.length !== CONTROLES_EXACTOS.length || controles.some((c, i) => c !== CONTROLES_EXACTOS[i])) {
    inc.push(`controls ${JSON.stringify(pres.controls)}: el renderer implementa exactamente {play, pause, restart, bpm_slider, loop}`);
  }
  if (pres.bpm_initial === undefined) {
    inc.push("bpm_initial ausente");
  } else if (pres.bpm_initial !== sem.time.bpm) {
    inc.push(`bpm_initial ${pres.bpm_initial} ≠ time.bpm ${sem.time.bpm}: regla canónica inicial = sugerido`);
  }
  const hc = pres.hand_colors;
  const hcOk = hc && Object.keys(hc).length === 2 && hc.right === "naranja" && hc.left === "azul";
  if (!hcOk) inc.push(`hand_colors ${JSON.stringify(hc ?? null)}: se exige exactamente {"right":"naranja","left":"azul"}`);

  const porNota = new Map<string, { hand: "right" | "left"; finger: number }>();
  for (const r of real.realizations ?? []) {
    if ((r.hand === "right" || r.hand === "left") && typeof r.finger === "number" && Number.isInteger(r.finger) && r.finger >= 1 && r.finger <= 5) {
      porNota.set(r.note_id, { hand: r.hand, finger: r.finger });
    } else {
      inc.push(`realización de ${r.note_id}: mano/dedo inválidos para el renderer (${JSON.stringify(r.hand)}, ${JSON.stringify(r.finger)})`);
    }
  }

  const bu = parseFrac(sem.time.beat_unit, inc, "time.beat_unit");
  interface EventoOrdenable {
    ev: EventoAdn;
    beatFrac: Frac;
  }
  const ordenables: EventoOrdenable[] = (voz?.events ?? []).map((ev) => ({
    ev,
    beatFrac: parseFrac(ev.beat, inc, `evento ${ev.id}.beat`),
  }));
  ordenables.sort((a, b) => a.ev.measure - b.ev.measure || cmpFrac(a.beatFrac, b.beatFrac));

  const secuencia: NotaEvento[] = [];
  for (const { ev, beatFrac } of ordenables) {
    const notas = ev.notes ?? [];
    if (notas.length !== 1) {
      inc.push(`evento ${ev.id}: ${notas.length} notas simultáneas — el renderer ejecuta exactamente 1 por evento`);
      continue;
    }
    const n = notas[0];
    const wp = n.written_pitch;
    const midi = (wp.octave + 1) * 12 + (STEP_SEMITONE[wp.step] ?? 0) + wp.alter;
    if (!(midi >= 0 && midi <= 127)) inc.push(`nota ${n.id}: MIDI ${midi} fuera de 0-127`);
    const r = porNota.get(n.id);
    if (!r) {
      inc.push(`nota ${n.id}: sin realización de piano`);
      continue;
    }
    const durFrac = parseFrac(ev.duration, inc, `evento ${ev.id}.duration`);
    secuencia.push({
      pitchMidi: midi,
      mano: (r.hand === "right" ? "MD" : "MI") as Mano,
      dedo: r.finger as Dedo,
      inicioBeat: (ev.measure - 1) * sem.time.beats_per_measure + (divANumero(beatFrac, { num: 1, den: 1 }) - 1),
      duracionBeat: divANumero(durFrac, bu),
    });
  }
  if (secuencia.length === 0) inc.push("secuencia vacía: nada que demostrar");
  if (inc.length > 0) throw new AdnNoSoportadoError(inc);

  let min = 127;
  let max = 0;
  for (const n of secuencia) {
    if (n.pitchMidi < min) min = n.pitchMidi;
    if (n.pitchMidi > max) max = n.pitchMidi;
  }
  let minMidi = min - (min % 12);
  const maxMidi = max + (11 - (max % 12));
  while ((maxMidi - minMidi + 1) / 12 < 2) minMidi -= 12;

  return {
    slug: adn.exercise.id,
    titulo: adn.exercise.title,
    secuencia,
    bpmSugerido: sem.time.bpm,
    rangoTeclado: { minMidi, maxMidi },
    coloresMano: { derecha: "naranja", izquierda: "azul" },
    vistasRenderizadas: ["keyboard"],
    vistasNoRenderizadas: pres.views.filter((v) => v !== "keyboard"),
  };
}

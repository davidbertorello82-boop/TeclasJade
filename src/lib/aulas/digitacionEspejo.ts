// Digitacion de ejercicios a dos manos (doc 10, seccion 9, DECIDIDO 10/07,
// CORREGIDO 03/08/2026).
//
// La derivacion del dedo de la mano izquierda depende del TIPO DE MOVIMIENTO,
// no de la etiqueta "espejo" a secas:
//
//   paralelo  — las dos manos tocan las mismas notas en la misma direccion.
//               Los dedos se espejan: dedo opuesto = 6 - dedo original, de modo
//               que el pulgar (1) de una mano corresponde al menique (5) de la
//               otra (6-1=5), el 2 con el 4, y el 3 consigo mismo.
//
//   contrario — las manos se separan y vuelven (tipo "El Espejo de Agua").
//               Las dos usan EL MISMO DEDO al mismo tiempo: ambos pulgares
//               arrancan juntos y ambos meniques llegan juntos a los extremos.
//               Aplicar 6 - dedo a un movimiento contrario dejaria la mano
//               izquierda invertida —menique en la nota mas aguda y pulgar en
//               la mas grave—, que es anatomicamente incorrecto.
//
// El modo NO tiene valor por defecto: quien llama DECLARA el tipo de
// movimiento, y el compilador frena a quien lo omita.

import type { Dedo, NotaEvento } from "./tipos";

export type ModoEspejo = "paralelo" | "contrario";

export function dedoEspejo(dedo: Dedo, modo: ModoEspejo): Dedo {
  return modo === "paralelo" ? ((6 - dedo) as Dedo) : dedo;
}

// Un paso de un ejercicio a dos manos: se carga SOLO la mano derecha (pitch +
// dedo) y el pitch que le toca a la izquierda; el dedo de la izquierda lo
// deriva el modo. Esto reduce a la mitad la carga de digitacion.
export interface PasoEspejo {
  inicioBeat: number;
  duracionBeat: number;
  pitchDerecha: number;
  dedoDerecha: Dedo;
  pitchIzquierda: number;
}

// Expande los pasos en la secuencia completa de NotaEvento (una nota para cada
// mano), derivando el dedo de la izquierda segun el modo declarado.
export function expandirEspejo(pasos: PasoEspejo[], modo: ModoEspejo): NotaEvento[] {
  return pasos.flatMap((paso) => [
    {
      pitchMidi: paso.pitchDerecha,
      mano: "MD" as const,
      dedo: paso.dedoDerecha,
      inicioBeat: paso.inicioBeat,
      duracionBeat: paso.duracionBeat,
    },
    {
      pitchMidi: paso.pitchIzquierda,
      mano: "MI" as const,
      dedo: dedoEspejo(paso.dedoDerecha, modo),
      inicioBeat: paso.inicioBeat,
      duracionBeat: paso.duracionBeat,
    },
  ]);
}

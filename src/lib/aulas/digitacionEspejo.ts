// Formula de digitacion espejo (doc 10, seccion 9, DECIDIDO 10/07).
//
// Para todo ejercicio a dos manos marcado como "espejo" (movimiento simetrico,
// tipo Hanon), la digitacion de la mano izquierda se CALCULA a partir de la
// derecha, no se carga a mano por duplicado:
//
//     dedo de la mano opuesta = 6 - dedo original
//
// Asi el pulgar (1) de una mano se refleja con el menique (5) de la otra
// (6-1=5), el 2 con el 4 (6-2=4), y el 3 consigo mismo (6-3=3).

import type { Dedo, NotaEvento } from "./tipos";

export function dedoEspejo(dedo: Dedo): Dedo {
  return (6 - dedo) as Dedo;
}

// Un paso de un ejercicio espejo: se carga SOLO la mano derecha (pitch + dedo)
// y el pitch que le toca a la izquierda; el dedo de la izquierda lo deriva la
// formula. Esto reduce a la mitad la carga de digitacion para estos ejercicios.
export interface PasoEspejo {
  inicioBeat: number;
  duracionBeat: number;
  pitchDerecha: number;
  dedoDerecha: Dedo;
  pitchIzquierda: number;
}

// Expande los pasos espejo en la secuencia completa de NotaEvento (una nota
// para cada mano), aplicando 6 - dedo para la mano izquierda.
export function expandirEspejo(pasos: PasoEspejo[]): NotaEvento[] {
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
      dedo: dedoEspejo(paso.dedoDerecha),
      inicioBeat: paso.inicioBeat,
      duracionBeat: paso.duracionBeat,
    },
  ]);
}

// Modelo de contenido de las aulas (el "molde").
// Los ejercicios NO viven en la base (no hay tabla `ejercicios` a proposito):
// viven en modulos de contenido versionados como este. La tabla user_progress
// solo guarda una lista de `slug`s completados por alumno y pilar.
//
// Este archivo define los tipos compartidos por las 4 aulas. El aula de Piano
// (src/lib/aulas/piano/contenido.ts) es la primera implementacion y el molde
// que las otras tres copian.

export type EtiquetaEjercicio =
  | "DIGITAL-INTERACTIVO"
  | "HIBRIDO"
  | "INSTRUCCIONAL-FISICO";

// M.D. = mano derecha, M.I. = mano izquierda. En el teclado de dos octavas la
// octava aguda es la mano derecha y la grave la izquierda (doc 10, seccion 8).
export type Mano = "MD" | "MI";

export type Dedo = 1 | 2 | 3 | 4 | 5;

// Una nota de la demostracion: que tecla suena, en que mano, con que dedo,
// desde que tiempo (en pulsos) y por cuanto. El tiempo se mide en pulsos
// (beats) para poder reproducir a cualquier BPM que elija el alumno.
export interface NotaEvento {
  pitchMidi: number;
  mano: Mano;
  dedo: Dedo;
  inicioBeat: number;
  duracionBeat: number;
}

export interface Ejercicio {
  slug: string; // ID estable que se guarda en user_progress.ejercicios_completados
  titulo: string;
  etiqueta: EtiquetaEjercicio;
  concepto: string;
  // consigna y autoevaluacion se cargan completas para los bloques ya
  // construidos. Los bloques todavia bloqueados se listan como metadata
  // (titulo + etiqueta + concepto) para el Mapa, sin duplicar todo el texto:
  // nunca se renderizan hasta que su bloque se desbloquea.
  consigna?: string; // metodologia / consigna del curriculum
  autoevaluacion?: string;
  esLaboratorio?: boolean; // el ejercicio de cierre del bloque

  // Solo para [DIGITAL-INTERACTIVO] y la parte interactiva de [HIBRIDO]:
  bpmSugerido?: number;
  secuencia?: NotaEvento[];

  // Solo para [HIBRIDO]: la guia de texto que acompana a la parte interactiva.
  guiaTexto?: string;

  // Solo para [INSTRUCCIONAL-FISICO]: el video demostrativo (placeholder por
  // ahora; los videos reales los carga el profesor despues).
  videoUrl?: string;
}

export interface Bloque {
  posicion: number; // 1..5, en orden pedagogico
  nombre: string;
  tagline?: string;
  ejercicios: Ejercicio[];
}

export interface Aula {
  slug: string; // 'piano' | 'guitarra' | 'canto' | 'teoria-musical'
  nombre: string;
  tutor: string; // 'Maestro Allegro', etc.
  bloques: Bloque[];
}

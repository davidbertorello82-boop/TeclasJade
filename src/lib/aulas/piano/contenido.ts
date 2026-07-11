// Contenido del Aula de Piano (el molde de las 4 aulas).
// Fuente: project-docs/piano/curriculum.md (fiel a nombres, consignas y
// autoevaluaciones) + project-docs/10-modelo-de-contenido-y-progresion.md.
//
// Bloque 1 ("Fase Semilla"): completo, con las secuencias interactivas del
// teclado que se toca solo (doc 10, seccion 8). Bloques 2-5: metadata (titulo
// + etiqueta + concepto) para que el Mapa del Aula los muestre bloqueados;
// su contenido interactivo se construye en fases posteriores.
//
// Teclado de DOS octavas: rango C3 (MIDI 48) a B4 (MIDI 71). El Do central
// (C4 = 60) es la frontera: octava grave = mano izquierda, aguda = derecha.

import type { Aula, NotaEvento } from "../tipos";
import { expandirEspejo } from "../digitacionEspejo";

// --- Notas MIDI usadas (C4 = 60 = Do central) ---
const C3 = 48, E3 = 52, F3 = 53, G3 = 55, A3 = 57, B3 = 59;
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67;
// Teclas negras (para el laboratorio de teclas negras):
const Fs3 = 54, Gs3 = 56, As3 = 58; // grupo grave de 3 negras: Fa#-Sol#-La#
const Cs4 = 61, Ds4 = 63, Fs4 = 66, Gs4 = 68, As4 = 70; // negras agudas

// Ejercicio 1 — Mapa Ciego del Teclado.
// Demostracion: posicion de 5 dedos de la mano derecha anclada en el Do
// central, para fijar donde esta el Do.
const SEC_MAPA_CIEGO: NotaEvento[] = [
  { pitchMidi: C4, mano: "MD", dedo: 1, inicioBeat: 0, duracionBeat: 1 },
  { pitchMidi: D4, mano: "MD", dedo: 2, inicioBeat: 1, duracionBeat: 1 },
  { pitchMidi: E4, mano: "MD", dedo: 3, inicioBeat: 2, duracionBeat: 1 },
  { pitchMidi: F4, mano: "MD", dedo: 4, inicioBeat: 3, duracionBeat: 1 },
  { pitchMidi: G4, mano: "MD", dedo: 5, inicioBeat: 4, duracionBeat: 2 },
];

// Ejercicio 3 — El Espejo de Agua (movimiento contrario). Ejercicio "espejo":
// se carga SOLO la digitacion de la mano derecha; la izquierda la deriva la
// formula 6 - dedo (doc 10, seccion 9). Movimiento simetrico hacia afuera y
// vuelta, ambas manos partiendo del centro.
const SEC_ESPEJO_AGUA: NotaEvento[] = expandirEspejo([
  // salida hacia afuera
  { inicioBeat: 0, duracionBeat: 1, pitchDerecha: C4, dedoDerecha: 1, pitchIzquierda: B3 },
  { inicioBeat: 1, duracionBeat: 1, pitchDerecha: D4, dedoDerecha: 2, pitchIzquierda: A3 },
  { inicioBeat: 2, duracionBeat: 1, pitchDerecha: E4, dedoDerecha: 3, pitchIzquierda: G3 },
  { inicioBeat: 3, duracionBeat: 1, pitchDerecha: F4, dedoDerecha: 4, pitchIzquierda: F3 },
  { inicioBeat: 4, duracionBeat: 1, pitchDerecha: G4, dedoDerecha: 5, pitchIzquierda: E3 },
  // vuelta al centro
  { inicioBeat: 5, duracionBeat: 1, pitchDerecha: F4, dedoDerecha: 4, pitchIzquierda: F3 },
  { inicioBeat: 6, duracionBeat: 1, pitchDerecha: E4, dedoDerecha: 3, pitchIzquierda: G3 },
  { inicioBeat: 7, duracionBeat: 1, pitchDerecha: D4, dedoDerecha: 2, pitchIzquierda: A3 },
  { inicioBeat: 8, duracionBeat: 2, pitchDerecha: C4, dedoDerecha: 1, pitchIzquierda: B3 },
]);

// Ejercicio 4 — El Dialogo Compartido (ensamble a 4 manos). La mano derecha
// lleva una melodia simple; la izquierda sostiene el pulso con un bajo estable
// (simula el acompanamiento sobre el que el alumno entra a tiempo).
const SEC_DIALOGO: NotaEvento[] = [
  // melodia (M.D.)
  { pitchMidi: E4, mano: "MD", dedo: 3, inicioBeat: 0, duracionBeat: 1 },
  { pitchMidi: D4, mano: "MD", dedo: 2, inicioBeat: 1, duracionBeat: 1 },
  { pitchMidi: C4, mano: "MD", dedo: 1, inicioBeat: 2, duracionBeat: 1 },
  { pitchMidi: D4, mano: "MD", dedo: 2, inicioBeat: 3, duracionBeat: 1 },
  { pitchMidi: E4, mano: "MD", dedo: 3, inicioBeat: 4, duracionBeat: 1 },
  { pitchMidi: E4, mano: "MD", dedo: 3, inicioBeat: 5, duracionBeat: 1 },
  { pitchMidi: E4, mano: "MD", dedo: 3, inicioBeat: 6, duracionBeat: 2 },
  // bajo de acompanamiento (M.I.), blancas
  { pitchMidi: C3, mano: "MI", dedo: 5, inicioBeat: 0, duracionBeat: 2 },
  { pitchMidi: G3, mano: "MI", dedo: 1, inicioBeat: 2, duracionBeat: 2 },
  { pitchMidi: C3, mano: "MI", dedo: 5, inicioBeat: 4, duracionBeat: 2 },
  { pitchMidi: G3, mano: "MI", dedo: 1, inicioBeat: 6, duracionBeat: 2 },
];

// Laboratorio — Improvisacion en Teclas Negras. La mano izquierda sostiene un
// acorde con las 3 teclas negras graves; la derecha improvisa libremente entre
// las teclas negras agudas (escala pentatonica, sin error posible).
const SEC_TECLAS_NEGRAS: NotaEvento[] = [
  // acorde sostenido de teclas negras graves (M.I.), toda la demostracion
  { pitchMidi: Fs3, mano: "MI", dedo: 5, inicioBeat: 0, duracionBeat: 8 },
  { pitchMidi: Gs3, mano: "MI", dedo: 3, inicioBeat: 0, duracionBeat: 8 },
  { pitchMidi: As3, mano: "MI", dedo: 1, inicioBeat: 0, duracionBeat: 8 },
  // improvisacion pentatonica en negras agudas (M.D.)
  { pitchMidi: Cs4, mano: "MD", dedo: 1, inicioBeat: 0, duracionBeat: 1 },
  { pitchMidi: Ds4, mano: "MD", dedo: 2, inicioBeat: 1, duracionBeat: 1 },
  { pitchMidi: Fs4, mano: "MD", dedo: 3, inicioBeat: 2, duracionBeat: 1 },
  { pitchMidi: Gs4, mano: "MD", dedo: 4, inicioBeat: 3, duracionBeat: 1 },
  { pitchMidi: As4, mano: "MD", dedo: 5, inicioBeat: 4, duracionBeat: 1 },
  { pitchMidi: Gs4, mano: "MD", dedo: 4, inicioBeat: 5, duracionBeat: 1 },
  { pitchMidi: Fs4, mano: "MD", dedo: 3, inicioBeat: 6, duracionBeat: 1 },
  { pitchMidi: Ds4, mano: "MD", dedo: 2, inicioBeat: 7, duracionBeat: 1 },
];

export const AULA_PIANO: Aula = {
  slug: "piano",
  nombre: "Piano",
  tutor: "Maestro Allegro",
  bloques: [
    {
      posicion: 1,
      nombre: "Fase Semilla",
      tagline: "La Gravedad y el Tacto: el instrumento como extensión del cuerpo.",
      ejercicios: [
        {
          slug: "piano-b1-e1-mapa-ciego",
          titulo: "Mapa Ciego del Teclado",
          etiqueta: "DIGITAL-INTERACTIVO",
          concepto:
            "El teclado es un mapa táctil, no visual. Los grupos de teclas negras (2 y 3) funcionan como faros para ubicar cualquier nota sin mirar las manos.",
          consigna:
            "Sentate con la espalda recta y los ojos cerrados. Deslizá la mano por el teclado sin presionar, sintiendo los grupos de teclas negras. Ubicá el Do como la tecla blanca inmediata a la izquierda de un grupo de 2 negras.",
          autoevaluacion:
            "Tocá a ciegas la nota que creés que es Do; después abrí los ojos y verificá la posición del dedo.",
          bpmSugerido: 60,
          secuencia: SEC_MAPA_CIEGO,
        },
        {
          slug: "piano-b1-e2-molde-arcilla",
          titulo: "El Molde de Arcilla (Posición de 5 dedos)",
          etiqueta: "INSTRUCCIONAL-FISICO",
          concepto:
            "La mano tiene una forma natural de descanso curva; ese molde, sin tensión, es la posición correcta sobre las teclas. Se logra dejando caer el peso del brazo, no empujando.",
          consigna:
            "Colocá los dedos 1-5 sobre Do-Re-Mi-Fa-Sol. Levantá el brazo unos 5 cm desde el codo y dejalo caer con peso relajado.",
          autoevaluacion:
            "Test de la falange: si la primera articulación del dedo se dobla hacia adentro (cóncava) al caer el peso, hay tensión; debe mantenerse arqueada (convexa).",
          videoUrl: undefined, // placeholder: el profesor carga el video real despues
        },
        {
          slug: "piano-b1-e3-espejo-agua",
          titulo: "El Espejo de Agua (Movimiento contrario)",
          etiqueta: "DIGITAL-INTERACTIVO",
          concepto:
            "El cerebro procesa más rápido el movimiento simétrico que el paralelo; el movimiento contrario programa la coordinación bilateral.",
          consigna:
            "Ambos pulgares sobre el Do central. Tocá simétricamente hacia afuera y volvé, con ambas manos a la vez. La digitación de la mano izquierda es el espejo de la derecha (6 − dedo).",
          autoevaluacion:
            "Clic de coincidencia: el impacto de ambas manos debe sonar como un único golpe; si se oyen dos sonidos separados, no están coordinadas.",
          bpmSugerido: 60,
          secuencia: SEC_ESPEJO_AGUA,
        },
        {
          slug: "piano-b1-e4-dialogo-compartido",
          titulo: "El Diálogo Compartido (Ensamble a 4 manos)",
          etiqueta: "DIGITAL-INTERACTIVO",
          concepto:
            "Tocar en conjunto obliga a sostener el pulso real, delegando el ritmo a un factor externo (profesor o pista) en vez de auto-regularlo.",
          consigna:
            "Tocá una melodía simple sobre la pista de acompañamiento. Entrá exactamente en el primer tiempo del compás y no te detengas ante errores.",
          autoevaluacion:
            "El éxito es no detenerse: si corregís un error deteniendo el flujo, se pierde el ejercicio; reincorporate en el siguiente pulso fuerte.",
          bpmSugerido: 72,
          secuencia: SEC_DIALOGO,
        },
        {
          slug: "piano-b1-lab-teclas-negras",
          titulo: "Laboratorio: Improvisación en Teclas Negras",
          etiqueta: "DIGITAL-INTERACTIVO",
          esLaboratorio: true,
          concepto:
            "Usando solo la escala pentatónica de teclas negras (sin semitonos disonantes), cualquier combinación suena armónica — ideal para la primera experiencia de improvisación libre.",
          consigna:
            "La mano izquierda sostiene un acorde con las 3 teclas negras graves. La mano derecha improvisa libremente entre las teclas negras agudas.",
          autoevaluacion:
            "No hay error posible dentro de la escala; el criterio es exploratorio (experimentar distancias y ritmos).",
          bpmSugerido: 66,
          secuencia: SEC_TECLAS_NEGRAS,
        },
      ],
    },
    {
      posicion: 2,
      nombre: "Fase Conectiva / Core",
      tagline: "La Bifurcación Consciente: de la simetría clásica al síncope popular.",
      ejercicios: [
        { slug: "piano-b2-e1-notas-guia", titulo: "Notas Guía (3ras y 7mas)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "En jazz/popular, la esencia armónica de un acorde vive en su 3ra y 7ma; aislarlas permite un voice leading mínimo entre acordes." },
        { slug: "piano-b2-e2-acorde-invertido", titulo: "Acorde Invertido en Bloque", etiqueta: "DIGITAL-INTERACTIVO", concepto: "Invertir un acorde es reordenar sus pisos para tocarlo cerca, sin saltos largos en el teclado." },
        { slug: "piano-b2-e3-gravedad-resolucion", titulo: "La Gravedad de la Resolución (V7 → Imaj7 con tritono)", etiqueta: "HIBRIDO", concepto: "El acorde dominante genera tensión máxima (tritono) que gravita hacia la resolución en la tónica." },
        { slug: "piano-b2-e4-ritmo-disociado", titulo: "Ritmo Disociado (Mente Dividida)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "Tocar jazz/popular exige disociar el cerebro: mano izquierda estable como metrónomo humano, derecha libre e improvisada." },
        { slug: "piano-b2-lab-walking-bass", titulo: "Laboratorio: Walking Bass y Rootless Voicings", etiqueta: "DIGITAL-INTERACTIVO", esLaboratorio: true, concepto: "Introduce la física del comping moderno: acordes sin tónica (la cubre el bajo) y anticipación rítmica para generar groove." },
      ],
    },
    {
      posicion: 3,
      nombre: "Fase de Especialización Exigente",
      tagline: "La Arquitectura Invisible: el control absoluto del detalle frente al virtuosismo estructural.",
      ejercicios: [
        { slug: "piano-b3-e1-alteracion-cromatica", titulo: "Alteración Cromática de Tensión (9na menor)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "La 9na menor agrega un color oscuro y sofisticado al acorde dominante antes de resolver." },
        { slug: "piano-b3-e2-bloque-flotante", titulo: "Bloque Flotante (Rootless Voicings Formas A/B)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "Sin la tónica (la cubre el bajista), el pianista reorganiza las notas internas para un sonido moderno y liviano." },
        { slug: "piano-b3-e3-matriz-modulatoria", titulo: "Matriz Modulatoria de las 12 Tonalidades", etiqueta: "DIGITAL-INTERACTIVO", concepto: "Entrenar el mismo patrón armónico en las 12 tonalidades para eliminar tonalidades enemigas." },
        { slug: "piano-b3-e4-linea-polifonica", titulo: "Línea Polifónica Sincronizada (Rootless + Bebop)", etiqueta: "HIBRIDO", concepto: "Fusiona el rigor armónico clásico con la fluidez del bebop: mano izquierda estricta, derecha improvisando líneas complejas." },
        { slug: "piano-b3-lab-improvisacion-bebop", titulo: "Laboratorio: Improvisación Bebop", etiqueta: "DIGITAL-INTERACTIVO", esLaboratorio: true, concepto: "Construir líneas de improvisación fluidas con la Escala Bebop Dominante para que las notas del acorde caigan en tiempos fuertes." },
      ],
    },
    {
      posicion: 4,
      nombre: "Fase de Consolidación y Práctica Profesional Avanzada",
      tagline: "La Simbiosis Escénica: el piano como catalizador colectivo y puente profesional.",
      ejercicios: [
        { slug: "piano-b4-e1-respiracion-lirica", titulo: "Respiración Lírica y Rubato Acompañante", etiqueta: "INSTRUCCIONAL-FISICO", concepto: "Acompañar a un cantante o instrumentista de viento exige respirar con las manos, flexibilizando el tiempo antes de momentos clave." },
        { slug: "piano-b4-e2-acorde-orquestal", titulo: "Acorde Bloque Orquestal (Block Chords y Stride)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "El piano solista se convierte en una big band: melodía duplicada en los extremos, relleno armónico denso, bajo tipo stride en la izquierda." },
        { slug: "piano-b4-e3-reduccion-partituras", titulo: "Reducción de Partituras en Tiempo Real", etiqueta: "DIGITAL-INTERACTIVO", concepto: "Ante una partitura orquestal completa, extraer la columna vertebral (bajo + melodía) a primera vista sin detener el pulso." },
        { slug: "piano-b4-e4-ensamble-camara", titulo: "Ensamble de Cámara Dinámico", etiqueta: "INSTRUCCIONAL-FISICO", concepto: "El pianista calibra su fuerza física según el instrumento acompañante, para no aplastar sonidos acústicos más débiles." },
      ],
    },
    {
      posicion: 5,
      nombre: "Fase de Trascendencia y Virtuosismo Absoluto",
      tagline: "El Límite Físico Desmaterializado: la disolución de la técnica en pura intención artística.",
      ejercicios: [
        { slug: "piano-b5-e1-tension-alterada", titulo: "Tensión Alterada Simétrica (escala alterada extrema)", etiqueta: "HIBRIDO", concepto: "Control del color armónico exótico de acordes dominantes con todas las tensiones alteradas (b9, #9, #11, b13), rozando la atonalidad." },
        { slug: "piano-b5-e2-upper-structures", titulo: "Polifonía de Estructuras Superiores (Upper Structures)", etiqueta: "DIGITAL-INTERACTIVO", concepto: "La mano derecha toca una tríada simple mientras la izquierda sostiene un acorde distinto; la combinación genera armonía extendida sofisticada." },
        { slug: "piano-b5-e3-modulacion-metrica", titulo: "Modulación Métrica y Amalgama Asimétrica (7/8, polirritmia)", etiqueta: "HIBRIDO", concepto: "Internalizar compases asimétricos (7/8, 11/8) como algo tan natural como caminar, incluso bajo polirritmias complejas." },
        { slug: "piano-b5-e4-direccion-ensambles", titulo: "Dirección de Ensambles desde el Teclado", etiqueta: "INSTRUCCIONAL-FISICO", concepto: "Autosuficiencia escénica máxima: liderar un ensamble con gestos corporales mientras se ejecutan pasajes virtuosos." },
        { slug: "piano-b5-lab-rearmonizacion", titulo: "Laboratorio: Rearmonización Cinematográfica y Rubato Libre", etiqueta: "DIGITAL-INTERACTIVO", esLaboratorio: true, concepto: "Tomar una melodía infantil simple e inyectarle voicings flotantes con tensiones alteradas más un rubato extremo, transformándola en pieza de nivel concertista." },
      ],
    },
  ],
};

// --- Helpers de acceso al contenido (usados por rutas y progreso) ---

export function buscarEjercicio(slug: string):
  | { ejercicio: import("../tipos").Ejercicio; bloque: import("../tipos").Bloque }
  | null {
  for (const bloque of AULA_PIANO.bloques) {
    const ejercicio = bloque.ejercicios.find((e) => e.slug === slug);
    if (ejercicio) return { ejercicio, bloque };
  }
  return null;
}

// Ejercicios del Bloque 1 que cuentan para el gating (todos menos el
// Laboratorio de cierre, que se exige aparte).
export function ejerciciosContablesBloque1(): string[] {
  const bloque1 = AULA_PIANO.bloques.find((b) => b.posicion === 1)!;
  return bloque1.ejercicios.filter((e) => !e.esLaboratorio).map((e) => e.slug);
}

export function laboratorioBloque1(): string {
  const bloque1 = AULA_PIANO.bloques.find((b) => b.posicion === 1)!;
  return bloque1.ejercicios.find((e) => e.esLaboratorio)!.slug;
}

// Motor de audio real del reproductor (lote SONIDO-1). Reemplaza el oscilador
// triangular placeholder por samples reales vía smplr 1.0.0 (MIT, pineada
// exacta): piano = SplendidGrandPiano (samples AKAI de dominio público, 5
// capas de velocidad); guitarra = Soundfont acoustic_guitar_nylon con kit
// FIJADO a FluidR3_GM (CC-BY 3.0; atribución en la página del ejercicio).
// El kit default de smplr (MusyngKite) queda PROHIBIDO en este proyecto: su
// autor original veta el uso comercial. Los samples se sirven SELF-HOSTEADOS
// desde /public/audio (jamás GitHub Pages en producción).
// Salida solamente: cero APIs de entrada (regla de solo demostración, doc 10
// sección 8 / decisión canónica 20; la guarda de build vigila los tokens).

import { Soundfont, SplendidGrandPiano } from "smplr";

export type InstrumentoAula = "piano" | "guitarra";

// Config canónica del lote (exportada para motorAudio.test.ts).
export const RUTA_PIANO = "/audio/piano";
export const KIT_SOUNDFONT = "FluidR3_GM";
export const INSTRUMENTO_GUITARRA = "acoustic_guitar_nylon";
export const RUTA_GUITARRA = `/audio/soundfonts/${KIT_SOUNDFONT}/${INSTRUMENTO_GUITARRA}-mp3.js`;

// Velocidad fija de demostración: cae en la capa MF del piano (85-100), tono
// claro sin golpe. Cuando el ADN declare acentos pasará a ser por nota.
export const VELOCIDAD_DEMO = 96;

// Release del piano tras el note-off (segundos). El default de smplr (0.5 s)
// empastaba el staccato — observación auditiva de David en el lote SONIDO-1:
// 0.2 s simula un apagador realista y respeta la duración notada.
export const RELEASE_PIANO_SEG = 0.2;

// Límites del piano real (A0..C8) y margen cromático de precarga: los samples
// del piano están espaciados (no hay archivo por semitono) y el sample que
// cubre una tecla del borde puede estar grabado unos semitonos más afuera.
const MIDI_MIN = 21;
const MIDI_MAX = 108;
const MARGEN_CARGA = 6;

// Notas a precargar para un teclado [minMidi..maxMidi]: rango cromático
// completo, expandido por el margen y acotado al piano real.
export function notasParaCarga(minMidi: number, maxMidi: number): number[] {
  const desde = Math.max(MIDI_MIN, Math.min(minMidi, maxMidi) - MARGEN_CARGA);
  const hasta = Math.min(MIDI_MAX, Math.max(minMidi, maxMidi) + MARGEN_CARGA);
  const notas: number[] = [];
  for (let m = desde; m <= hasta; m++) notas.push(m);
  return notas;
}

// Interfaz que consume TecladoAuto. Todo tiempo es ABSOLUTO del AudioContext.
// El BPM vive en el scheduler de beats del componente y jamás altera la
// altura (cada nota es un sample a pitch fijo). Las notas NO llevan duración
// al dispararse: el note-off lo despacha el scheduler del componente vía
// detenerNota cuando vence. Motivo (revisión adversarial del lote): en smplr
// 1.0.0 una voz creada con duration nace en estado "stopping" y stop()/
// stopAll() posteriores son no-op — Reiniciar dejaría notas sonando.
export interface MotorAudio {
  listo: Promise<void>;
  tocarNota(idNota: number | string, midi: number, tiempoAbs: number): void;
  detenerNota(idNota: number | string, tiempoAbs: number): void;
  detenerTodo(): void;
  disponer(): void;
}

// Storage propio sobre la Cache API en lugar del CacheStorage de smplr, por
// dos hallazgos de la revisión adversarial:
// 1. El de smplr cachea TAMBIÉN las respuestas 404/500: una falla transitoria
//    del hosting dejaría notas mudas para siempre en ese navegador. Acá solo
//    se cachean respuestas ok que no sean HTML (un rewrite SPA sirve 200 con
//    index.html y el decode falla en silencio).
// 2. ready de smplr resuelve aunque CERO samples hayan cargado (los errores
//    HTTP se tragan con console.warn). Este storage cuenta las respuestas
//    válidas para que crearMotorAudio pueda detectar la carga vacía y caer al
//    respaldo sintetizado.
function crearAlmacenamientoVerificado(nombre: string) {
  const cachePromesa =
    typeof window !== "undefined" && "caches" in window
      ? caches.open(nombre).catch(() => null)
      : Promise.resolve(null);
  let validas = 0;
  let fallidas = 0;

  const esValida = (r: Response) =>
    r.ok && !(r.headers.get("content-type") ?? "").includes("text/html");

  return {
    resumen: () => ({ validas, fallidas }),
    storage: {
      async fetch(url: string): Promise<Response> {
        const cache = await cachePromesa;
        if (cache) {
          try {
            const guardada = await cache.match(url);
            if (guardada) {
              validas++;
              return guardada;
            }
          } catch {
            /* cache dañada: seguimos a la red */
          }
        }
        const respuesta = await window.fetch(url);
        if (esValida(respuesta)) {
          validas++;
          if (cache) {
            try {
              await cache.put(url, respuesta.clone());
            } catch {
              /* cuota llena o similar: servimos sin cachear */
            }
          }
        } else {
          fallidas++;
        }
        return respuesta;
      },
    },
  };
}

export function crearMotorAudio(
  ac: AudioContext,
  instrumento: InstrumentoAula,
  rango: { minMidi: number; maxMidi: number },
  alProgresar?: (cargados: number, total: number) => void,
): MotorAudio {
  const almacen = crearAlmacenamientoVerificado("teclas-jade-audio");
  const alProgresarSmplr =
    alProgresar &&
    ((p: { loaded: number; total: number }) => alProgresar(p.loaded, p.total));

  const inst =
    instrumento === "guitarra"
      ? Soundfont(ac, {
          kit: KIT_SOUNDFONT,
          instrument: INSTRUMENTO_GUITARRA,
          instrumentUrl: RUTA_GUITARRA,
          storage: almacen.storage,
          velocity: VELOCIDAD_DEMO,
          onLoadProgress: alProgresarSmplr,
        })
      : SplendidGrandPiano(ac, {
          baseUrl: RUTA_PIANO,
          storage: almacen.storage,
          velocity: VELOCIDAD_DEMO,
          decayTime: RELEASE_PIANO_SEG,
          notesToLoad: {
            notes: notasParaCarga(rango.minMidi, rango.maxMidi),
            velocityRange: [1, 127],
          },
          onLoadProgress: alProgresarSmplr,
        });

  // ready de smplr NO es garantía de sonido: verificamos que al menos una
  // respuesta válida haya llegado; si todas fallaron (deploy sin /audio,
  // rewrite a HTML), rechazamos para que el componente caiga al respaldo.
  const listo = inst.ready.then(() => {
    const { validas, fallidas } = almacen.resumen();
    if (validas === 0) {
      throw new Error(
        `ningún sample del instrumento "${instrumento}" cargó (${fallidas} respuestas inválidas)`,
      );
    }
    if (fallidas > 0) {
      console.warn(
        `Motor de audio: ${fallidas} samples de "${instrumento}" no cargaron; esas alturas pueden sonar mudas.`,
      );
    }
  });

  return {
    listo,
    tocarNota(idNota, midi, tiempoAbs) {
      // IMPORTANTE (verificación adversarial del lote): el scheduler interno
      // de smplr despacha SINCRÓNICAMENTE toda nota agendada a menos de
      // 200 ms del presente; TecladoAuto agenda con ~150 ms, así que ninguna
      // nota pasa por su timer JS y suspend()/resume() congela coherente.
      inst.start({
        note: midi,
        time: tiempoAbs,
        velocity: VELOCIDAD_DEMO,
        stopId: idNota,
      });
    },
    detenerNota(idNota, tiempoAbs) {
      inst.stop({ stopId: idNota, time: tiempoAbs });
    },
    detenerTodo() {
      inst.stop();
    },
    disponer() {
      inst.dispose();
    },
  };
}

// Respaldo sintetizado: el oscilador triangular anterior, con la MISMA
// interfaz por id de nota. Se usa SOLO si los samples no cargan (hosting
// caído, sin red), para que el aula nunca quede muda. No es el sonido del
// producto.
export function crearMotorRespaldo(ac: AudioContext): MotorAudio {
  const activas = new Map<number | string, { osc: OscillatorNode; gain: GainNode }>();

  const apagar = (fuente: { osc: OscillatorNode; gain: GainNode }, tiempoAbs: number) => {
    const t = Math.max(tiempoAbs, ac.currentTime);
    try {
      fuente.gain.gain.cancelScheduledValues(t);
      fuente.gain.gain.setValueAtTime(0.22, t);
      fuente.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      fuente.osc.stop(t + 0.12);
    } catch {
      /* la fuente ya había finalizado */
    }
  };

  const detenerTodo = () => {
    for (const fuente of activas.values()) apagar(fuente, ac.currentTime);
    activas.clear();
  };

  return {
    listo: Promise.resolve(),
    tocarNota(idNota, midi, tiempoAbs) {
      const previa = activas.get(idNota);
      if (previa) apagar(previa, tiempoAbs);
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "triangle";
      osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      g.gain.setValueAtTime(0.0001, tiempoAbs);
      g.gain.exponentialRampToValueAtTime(0.22, tiempoAbs + 0.01);
      osc.connect(g);
      g.connect(ac.destination);
      const fuente = { osc, gain: g };
      activas.set(idNota, fuente);
      osc.onended = () => {
        if (activas.get(idNota) === fuente) activas.delete(idNota);
        g.disconnect();
      };
      osc.start(tiempoAbs);
    },
    detenerNota(idNota, tiempoAbs) {
      const fuente = activas.get(idNota);
      if (!fuente) return;
      activas.delete(idNota);
      apagar(fuente, tiempoAbs);
    },
    detenerTodo,
    disponer: detenerTodo,
  };
}

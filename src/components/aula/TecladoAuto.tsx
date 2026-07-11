"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Mano, NotaEvento } from "@/lib/aulas/tipos";

// Teclado virtual de DOS octavas que se toca solo (doc 10, seccion 8).
// Reproduce la secuencia del ejercicio al BPM elegido, pinta cada tecla en el
// momento en que suena y muestra el numero de dedo (M.D./M.I.) encima.
// CERO deteccion de lo que el alumno toca: solo demuestra.

// Rango C3 (48) a B4 (71). Blancas de las dos octavas:
const BLANCAS = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71];
// Negras, con el indice de la tecla blanca a cuya derecha se apoyan:
const NEGRAS: { midi: number; despuesDe: number }[] = [
  { midi: 49, despuesDe: 0 }, // Do#3
  { midi: 51, despuesDe: 1 }, // Re#3
  { midi: 54, despuesDe: 3 }, // Fa#3
  { midi: 56, despuesDe: 4 }, // Sol#3
  { midi: 58, despuesDe: 5 }, // La#3
  { midi: 61, despuesDe: 7 }, // Do#4
  { midi: 63, despuesDe: 8 }, // Re#4
  { midi: 66, despuesDe: 10 }, // Fa#4
  { midi: 68, despuesDe: 11 }, // Sol#4
  { midi: 70, despuesDe: 12 }, // La#4
];

const ANCHO_BLANCA = 100 / BLANCAS.length; // % del ancho total
const ANCHO_NEGRA = ANCHO_BLANCA * 0.62;

interface TeclaActiva {
  mano: Mano;
  dedo: number;
}

function midiAFrecuencia(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function firmaActivas(activas: Record<number, TeclaActiva>): string {
  return Object.entries(activas)
    .map(([m, v]) => `${m}:${v.mano}${v.dedo}`)
    .sort()
    .join("|");
}

export function TecladoAuto({
  secuencia,
  bpmSugerido,
}: {
  secuencia: NotaEvento[];
  bpmSugerido: number;
}) {
  const [bpm, setBpm] = useState(bpmSugerido);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [bucle, setBucle] = useState(false);
  const [activas, setActivas] = useState<Record<number, TeclaActiva>>({});

  const beatRef = useRef(0);
  const ultimoTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const disparadasRef = useRef<Set<number>>(new Set());
  const audioRef = useRef<AudioContext | null>(null);
  const firmaRef = useRef("");

  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const bucleRef = useRef(bucle);
  bucleRef.current = bucle;

  const totalBeats = useMemo(
    () =>
      secuencia.reduce(
        (max, n) => Math.max(max, n.inicioBeat + n.duracionBeat),
        0,
      ),
    [secuencia],
  );

  const tocarNota = useCallback((midi: number) => {
    const ac = audioRef.current;
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = midiAFrecuencia(midi);
    const t = ac.currentTime;
    // Envolvente corta tipo pulsacion de piano (tono sintetizado placeholder).
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  }, []);

  const detenerRaf = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const frame = useCallback(
    (ts: number) => {
      if (ultimoTsRef.current === null) ultimoTsRef.current = ts;
      const dt = (ts - ultimoTsRef.current) / 1000;
      ultimoTsRef.current = ts;

      const segsPorBeat = 60 / bpmRef.current;
      beatRef.current += dt / segsPorBeat;
      const beat = beatRef.current;

      // Disparar el audio de cada nota cuando el cabezal cruza su inicio.
      secuencia.forEach((n, i) => {
        if (!disparadasRef.current.has(i) && n.inicioBeat <= beat) {
          disparadasRef.current.add(i);
          tocarNota(n.pitchMidi);
        }
      });

      // Teclas que estan sonando ahora (para pintarlas).
      const act: Record<number, TeclaActiva> = {};
      for (const n of secuencia) {
        if (beat >= n.inicioBeat && beat < n.inicioBeat + n.duracionBeat) {
          act[n.pitchMidi] = { mano: n.mano, dedo: n.dedo };
        }
      }
      const firma = firmaActivas(act);
      if (firma !== firmaRef.current) {
        firmaRef.current = firma;
        setActivas(act);
      }

      if (beat >= totalBeats) {
        if (bucleRef.current) {
          beatRef.current = 0;
          disparadasRef.current = new Set();
        } else {
          detenerRaf();
          beatRef.current = totalBeats;
          firmaRef.current = "";
          setActivas({});
          setReproduciendo(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [secuencia, totalBeats, tocarNota, detenerRaf],
  );

  const reproducir = useCallback(async () => {
    if (!audioRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioRef.current = new Ctor();
    }
    // Clave: esperar a que el contexto este realmente "running" ANTES de
    // arrancar el loop. resume() se dispara dentro del gesto de Play (no viola
    // la politica de autoplay), pero es asincrono: si no lo esperamos, la
    // primera nota se agenda con el contexto todavia suspendido y no suena
    // ("primer Play mudo"). El resto de las teclas se pintan igual porque eso
    // es visual y no depende del audio.
    if (audioRef.current.state !== "running") {
      await audioRef.current.resume();
    }

    // Si estaba al final, arranca de cero.
    if (beatRef.current >= totalBeats) {
      beatRef.current = 0;
      disparadasRef.current = new Set();
    }
    ultimoTsRef.current = null;
    setReproduciendo(true);
    rafRef.current = requestAnimationFrame(frame);
  }, [frame, totalBeats]);

  const pausar = useCallback(() => {
    detenerRaf();
    setReproduciendo(false);
  }, [detenerRaf]);

  const reiniciar = useCallback(() => {
    beatRef.current = 0;
    disparadasRef.current = new Set();
    ultimoTsRef.current = null;
    firmaRef.current = "";
    setActivas({});
  }, []);

  // Limpieza al desmontar: nada de audio ni animaciones colgadas.
  useEffect(() => {
    return () => {
      detenerRaf();
      void audioRef.current?.close();
    };
  }, [detenerRaf]);

  const indiceBlancaDe = (midi: number) => BLANCAS.indexOf(midi);

  return (
    <div className="w-full">
      {/* Teclado */}
      <div
        className="relative mx-auto w-full select-none"
        style={{ height: "170px", maxWidth: "640px" }}
        role="img"
        aria-label="Teclado virtual de dos octavas que demuestra el ejercicio"
      >
        {/* Teclas blancas */}
        <div className="absolute inset-0 flex">
          {BLANCAS.map((midi) => {
            const activa = activas[midi];
            return (
              <div
                key={midi}
                className="relative flex-1 rounded-b-md border border-tierra/40 transition-colors"
                style={{
                  background: activa ? "var(--color-jade)" : "#faf8f3",
                }}
              >
                {activa && <EtiquetaDedo mano={activa.mano} dedo={activa.dedo} />}
              </div>
            );
          })}
        </div>

        {/* Teclas negras */}
        {NEGRAS.map(({ midi, despuesDe }) => {
          const activa = activas[midi];
          const left = (despuesDe + 1) * ANCHO_BLANCA - ANCHO_NEGRA / 2;
          return (
            <div
              key={midi}
              className="absolute top-0 rounded-b-md transition-colors"
              style={{
                left: `${left}%`,
                width: `${ANCHO_NEGRA}%`,
                height: "62%",
                zIndex: 10,
                background: activa ? "var(--color-jade-claro)" : "#241f1a",
              }}
            >
              {activa && (
                <EtiquetaDedo mano={activa.mano} dedo={activa.dedo} sobreNegra />
              )}
            </div>
          );
        })}
      </div>

      {/* Controles del reproductor (doc 10, seccion 8) */}
      <div className="mt-5 flex flex-wrap items-center gap-4 font-sans">
        <button
          type="button"
          onClick={() => {
            if (reproduciendo) pausar();
            else void reproducir();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-jade px-5 py-2.5 text-sm font-semibold text-lino transition-colors hover:bg-jade-claro"
          aria-label={reproduciendo ? "Pausar" : "Reproducir"}
        >
          {reproduciendo ? <IconoPausa /> : <IconoPlay />}
          {reproduciendo ? "Pausa" : "Play"}
        </button>

        <button
          type="button"
          onClick={reiniciar}
          className="inline-flex items-center gap-2 rounded-full border border-lino/40 px-4 py-2.5 text-sm font-medium text-lino transition-colors hover:bg-lino/10"
          aria-label="Volver al inicio del ejercicio"
        >
          <IconoReiniciar />
          Reiniciar
        </button>

        <label className="flex items-center gap-3 text-sm text-lino/90">
          <span className="whitespace-nowrap">
            BPM <span className="font-semibold text-dorado">{bpm}</span>
          </span>
          <input
            type="range"
            min={30}
            max={160}
            step={1}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="h-1 w-40 cursor-pointer accent-jade"
            aria-label="Velocidad en pulsos por minuto"
          />
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-lino/90">
          <input
            type="checkbox"
            checked={bucle}
            onChange={(e) => setBucle(e.target.checked)}
            className="h-4 w-4 accent-jade"
          />
          Repetir en bucle
        </label>
      </div>
    </div>
  );
}

function EtiquetaDedo({
  mano,
  dedo,
  sobreNegra = false,
}: {
  mano: Mano;
  dedo: number;
  sobreNegra?: boolean;
}) {
  // Pastilla siempre legible (fondo crema, texto oscuro), bordeada por color
  // de mano: M.D. jade, M.I. tierra. En negras se ubica un poco mas arriba.
  const colorMano = mano === "MD" ? "var(--color-jade)" : "var(--color-tierra)";
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5"
      style={{ bottom: sobreNegra ? "8px" : "10px" }}
    >
      <span
        className="rounded px-1 text-[9px] font-bold uppercase leading-tight"
        style={{ background: colorMano, color: "#faf8f3" }}
      >
        {mano}
      </span>
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
        style={{
          background: "#faf8f3",
          color: "#1a2421",
          border: `2px solid ${colorMano}`,
        }}
      >
        {dedo}
      </span>
    </div>
  );
}

function IconoPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconoPausa() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function IconoReiniciar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
    </svg>
  );
}

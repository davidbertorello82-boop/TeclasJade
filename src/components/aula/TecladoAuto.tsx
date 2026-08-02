"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mano, NotaEvento } from "@/lib/aulas/tipos";

// Teclado virtual que se toca solo (doc 10, secciones 8 y 10).
// Reproduce la secuencia del ejercicio al BPM elegido, pinta cada tecla con el
// color canonico de su mano mientras suena SU DURACION REAL, y muestra el
// numero de dedo (M.D./M.I.) encima. Rango dinamico: octavas completas Do-Si
// con minimo pedagogico de dos (fallback C3-B4 para ejercicios sin ADN).
// CERO deteccion de lo que el alumno toca: solo demuestra (regla de solo
// demostracion, doc 10 seccion 8 / decision canonica 20).

// Paleta canonica GLOBAL de colores de mano (decision 5 del Compilador +
// ADN-DOC-P2): derecha = naranja, izquierda = azul. Indexada por las PALABRAS
// que declara el ADN (hand_colors); los ejercicios sin ADN usan las mismas
// palabras por defecto. Contraste AA con texto blanco #faf8f3:
// #C2410C ~ 5.2:1 · #1D4ED8 ~ 6.7:1.
const PALETA_MANO: Record<string, string> = {
  naranja: "#C2410C",
  azul: "#1D4ED8",
};
const COLORES_DEFAULT = { derecha: "naranja", izquierda: "azul" };
// Fallback exacto del teclado fijo historico (C3-B4) para los ejercicios que
// todavia no estan gobernados por ADN. No migrarlos es deliberado.
const RANGO_FALLBACK = { minMidi: 48, maxMidi: 71 };
const PC_BLANCAS = new Set([0, 2, 4, 5, 7, 9, 11]);
const NOMBRES = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

function midiAFrecuencia(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function nombreNota(midi: number): string {
  return `${NOMBRES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

interface TeclaActiva {
  mano: Mano;
  dedo: number;
}

interface FuenteActiva {
  osc: OscillatorNode;
  gain: GainNode;
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
  rangoTeclado,
  coloresMano,
}: {
  secuencia: NotaEvento[];
  bpmSugerido: number;
  rangoTeclado?: { minMidi: number; maxMidi: number };
  coloresMano?: { derecha: string; izquierda: string };
}) {
  const [bpm, setBpm] = useState(bpmSugerido);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [bucle, setBucle] = useState(false);
  const [activas, setActivas] = useState<Record<number, TeclaActiva>>({});

  const rango = rangoTeclado ?? RANGO_FALLBACK;
  const palabras = coloresMano ?? COLORES_DEFAULT;
  const colorMD = PALETA_MANO[palabras.derecha] ?? PALETA_MANO.naranja;
  const colorMI = PALETA_MANO[palabras.izquierda] ?? PALETA_MANO.azul;

  // Geometria del teclado generada desde el rango (blancas + negras con el
  // indice de la blanca a cuya derecha se apoyan).
  const { blancas, negras } = useMemo(() => {
    const b: number[] = [];
    const n: { midi: number; despuesDe: number }[] = [];
    for (let m = rango.minMidi; m <= rango.maxMidi; m++) {
      if (PC_BLANCAS.has(m % 12)) b.push(m);
      else n.push({ midi: m, despuesDe: b.length - 1 });
    }
    return { blancas: b, negras: n };
  }, [rango.minMidi, rango.maxMidi]);

  const octavas = Math.round((rango.maxMidi - rango.minMidi + 1) / 12);
  const anchoBlanca = 100 / blancas.length;
  const anchoNegra = anchoBlanca * 0.62;
  const tecladoAncho = octavas > 2; // ancho natural + desplazamiento horizontal

  const beatRef = useRef(0);
  const ultimoTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const disparadasRef = useRef<Set<number>>(new Set());
  const audioRef = useRef<AudioContext | null>(null);
  const fuentesRef = useRef<Set<FuenteActiva>>(new Set());
  const firmaRef = useRef("");

  // Copias en ref para que el motor lea el valor vigente sin recrear el loop
  // (actualizadas en efectos: jamás durante el render).
  const bpmRef = useRef(bpm);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  const bucleRef = useRef(bucle);
  useEffect(() => {
    bucleRef.current = bucle;
  }, [bucle]);

  const totalBeats = useMemo(
    () =>
      secuencia.reduce(
        (max, n) => Math.max(max, n.inicioBeat + n.duracionBeat),
        0,
      ),
    [secuencia],
  );

  // Motor de reproduccion: corre SOLO mientras reproduciendo === true. El loop
  // vive dentro del efecto (sin autorreferencia de useCallback) y se limpia al
  // pausar, al terminar o al desmontar.
  useEffect(() => {
    if (!reproduciendo) return;

    // Dispara una nota con su DURACION REAL: duracionBeat x 60 / BPM vigente.
    // La envolvente queda atada a esa duracion (la redonda a 60 BPM suena 4 s).
    // Tono sintetizado triangular: PLACEHOLDER explicito (motor de audio real:
    // lote futuro; alerta canonica del Roadmap sigue abierta).
    const tocarNota = (midi: number, duracionSeg: number) => {
      const ac = audioRef.current;
      if (!ac) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "triangle";
      osc.frequency.value = midiAFrecuencia(midi);
      const t = ac.currentTime;
      const fin = t + Math.max(duracionSeg, 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
      g.gain.setValueAtTime(0.22, Math.max(fin - 0.12, t + 0.011));
      g.gain.exponentialRampToValueAtTime(0.0001, fin);
      osc.connect(g);
      g.connect(ac.destination);
      const fuente: FuenteActiva = { osc, gain: g };
      fuentesRef.current.add(fuente);
      osc.onended = () => {
        fuentesRef.current.delete(fuente);
        g.disconnect();
      };
      osc.start(t);
      osc.stop(fin + 0.02);
    };

    const paso = (ts: number) => {
      if (ultimoTsRef.current === null) ultimoTsRef.current = ts;
      const dt = (ts - ultimoTsRef.current) / 1000;
      ultimoTsRef.current = ts;

      const segsPorBeat = 60 / bpmRef.current;
      beatRef.current += dt / segsPorBeat;
      const beat = beatRef.current;

      secuencia.forEach((n, i) => {
        if (!disparadasRef.current.has(i) && n.inicioBeat <= beat) {
          disparadasRef.current.add(i);
          tocarNota(n.pitchMidi, (n.duracionBeat * 60) / bpmRef.current);
        }
      });

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
          beatRef.current = totalBeats;
          firmaRef.current = "";
          setActivas({});
          setReproduciendo(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(paso);
    };

    rafRef.current = requestAnimationFrame(paso);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reproduciendo, secuencia, totalBeats]);

  async function reproducir() {
    if (!audioRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioRef.current = new Ctor();
    }
    // resume() dentro del gesto de Play (no viola autoplay) y esperado ANTES
    // de arrancar, para que la primera nota no caiga con el contexto suspendido.
    if (audioRef.current.state !== "running") {
      await audioRef.current.resume();
    }
    if (beatRef.current >= totalBeats) {
      beatRef.current = 0;
      disparadasRef.current = new Set();
    }
    ultimoTsRef.current = null;
    setReproduciendo(true);
  }

  // Pausa = detener exactamente donde esta Y en silencio: suspende el
  // AudioContext (congela todas las fuentes activas, sin notas fantasma);
  // Play las reanuda donde quedaron.
  function pausar() {
    setReproduciendo(false);
    void audioRef.current?.suspend();
  }

  function detenerFuentes() {
    const ac = audioRef.current;
    if (!ac) return;
    for (const f of fuentesRef.current) {
      try {
        f.osc.stop(ac.currentTime);
      } catch {
        /* la fuente ya habia finalizado */
      }
      f.gain.disconnect();
    }
    fuentesRef.current.clear();
  }

  function reiniciar() {
    detenerFuentes();
    beatRef.current = 0;
    disparadasRef.current = new Set();
    ultimoTsRef.current = null;
    firmaRef.current = "";
    setActivas({});
  }

  // Limpieza al desmontar: detener TODAS las fuentes activas y cerrar el
  // contexto (solo refs: sin dependencias).
  useEffect(() => {
    const fuentes = fuentesRef.current;
    return () => {
      const ac = audioRef.current;
      if (!ac) return;
      for (const f of fuentes) {
        try {
          f.osc.stop();
        } catch {
          /* la fuente ya habia finalizado */
        }
      }
      fuentes.clear();
      void ac.close();
    };
  }, []);

  const etiquetaRango = `${nombreNota(rango.minMidi)} a ${nombreNota(rango.maxMidi)}`;

  const teclado = (
    <div
      className="relative select-none"
      style={
        tecladoAncho
          ? { height: "170px", width: `${blancas.length * 44}px`, minWidth: "100%" }
          : { height: "170px", width: "100%", maxWidth: "640px" }
      }
      role="img"
      aria-label={`Teclado virtual de ${octavas} octavas (${etiquetaRango}) que demuestra el ejercicio`}
    >
      {/* Teclas blancas */}
      <div className="absolute inset-0 flex">
        {blancas.map((midi) => {
          const activa = activas[midi];
          const color = activa ? (activa.mano === "MD" ? colorMD : colorMI) : "#faf8f3";
          return (
            <div
              key={midi}
              className="relative flex-1 rounded-b-md border border-tierra/40 transition-colors"
              style={{ background: color }}
            >
              {activa && (
                <EtiquetaDedo
                  mano={activa.mano}
                  dedo={activa.dedo}
                  colorMano={activa.mano === "MD" ? colorMD : colorMI}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Teclas negras */}
      {negras.map(({ midi, despuesDe }) => {
        const activa = activas[midi];
        const left = (despuesDe + 1) * anchoBlanca - anchoNegra / 2;
        const color = activa ? (activa.mano === "MD" ? colorMD : colorMI) : "#241f1a";
        return (
          <div
            key={midi}
            className="absolute top-0 rounded-b-md transition-colors"
            style={{
              left: `${left}%`,
              width: `${anchoNegra}%`,
              height: "62%",
              zIndex: 10,
              background: color,
            }}
          >
            {activa && (
              <EtiquetaDedo
                mano={activa.mano}
                dedo={activa.dedo}
                colorMano={activa.mano === "MD" ? colorMD : colorMI}
                sobreNegra
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full">
      {tecladoAncho ? (
        <div className="w-full overflow-x-auto pb-2">{teclado}</div>
      ) : (
        <div className="mx-auto w-full" style={{ maxWidth: "640px" }}>
          {teclado}
        </div>
      )}

      {tecladoAncho && (
        <p className="mt-2 font-sans text-xs text-[#f3ecdf]/60 sm:hidden">
          📱 Girá el teléfono para ver el teclado completo, o deslizalo hacia
          los costados.
        </p>
      )}

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
  colorMano,
  sobreNegra = false,
}: {
  mano: Mano;
  dedo: number;
  colorMano: string;
  sobreNegra?: boolean;
}) {
  // Pastilla siempre legible (fondo crema, texto oscuro, ~15:1), bordeada por
  // el color canonico de la mano; la sigla M.D./M.I. va en blanco sobre el
  // color de mano (AA).
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

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Ejercicio } from "@/lib/aulas/tipos";
import { marcarEjercicioCompletado } from "@/lib/aulas/acciones";
import { TecladoAuto } from "./TecladoAuto";

// Renderiza un ejercicio segun su etiqueta, sobre el "pizarron de madera"
// (doc 03, seccion 4.B): panel oscuro, texto de alto contraste, consigna en
// serif. El teclado se toca solo; el alumno se autoevalua y marca "Completé".

export function RenderEjercicio({
  ejercicio,
  yaCompletado,
}: {
  ejercicio: Ejercicio;
  yaCompletado: boolean;
}) {
  const esInteractivo =
    ejercicio.etiqueta === "DIGITAL-INTERACTIVO" ||
    ejercicio.etiqueta === "HIBRIDO";

  return (
    <div className="rounded-2xl bg-[#2a2018] p-6 shadow-lg ring-1 ring-black/30 sm:p-8">
      {/* Panel de ejercicio */}
      {esInteractivo && ejercicio.secuencia && ejercicio.bpmSugerido && (
        <TecladoAuto
          secuencia={ejercicio.secuencia}
          bpmSugerido={ejercicio.bpmSugerido}
        />
      )}

      {ejercicio.etiqueta === "INSTRUCCIONAL-FISICO" && <VideoPlaceholder />}

      {/* Guia de texto (parte de texto del hibrido) */}
      {ejercicio.etiqueta === "HIBRIDO" && ejercicio.guiaTexto && (
        <p className="mt-6 font-serif text-lg leading-relaxed text-[#f3ecdf]">
          {ejercicio.guiaTexto}
        </p>
      )}

      {/* Consigna y autoevaluacion (serif, alto contraste) */}
      <div className="mt-8 space-y-5 border-t border-[#f3ecdf]/15 pt-6">
        {ejercicio.consigna && (
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-dorado">
              Consigna
            </h3>
            <p className="mt-1.5 font-serif text-lg leading-relaxed text-[#f3ecdf]">
              {ejercicio.consigna}
            </p>
          </div>
        )}
        {ejercicio.autoevaluacion && (
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-dorado">
              Cómo saber si salió (autoevaluación)
            </h3>
            <p className="mt-1.5 font-serif text-lg leading-relaxed text-[#f3ecdf]/90">
              {ejercicio.autoevaluacion}
            </p>
          </div>
        )}
      </div>

      <BotonCompletar slug={ejercicio.slug} yaCompletado={yaCompletado} />
    </div>
  );
}

function BotonCompletar({
  slug,
  yaCompletado,
}: {
  slug: string;
  yaCompletado: boolean;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (yaCompletado) {
    return (
      <div className="mt-8 flex items-center gap-2 font-sans text-sm font-semibold text-dorado">
        <span aria-hidden>✅</span> Ejercicio completado
      </div>
    );
  }

  function completar() {
    setError(null);
    startTransition(async () => {
      const resultado = await marcarEjercicioCompletado(slug);
      if (resultado.ok) {
        router.refresh();
      } else {
        setError(resultado.error);
      }
    });
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={completar}
        disabled={pendiente}
        className="rounded-full bg-jade px-6 py-3 font-sans text-sm font-semibold text-lino transition-colors hover:bg-jade-claro disabled:opacity-60"
      >
        {pendiente ? "Guardando…" : "Completé este ejercicio"}
      </button>
      {error && <p className="mt-2 font-sans text-sm text-red-300">{error}</p>}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[#f3ecdf]/20 bg-black/40">
      <div className="text-center font-sans text-[#f3ecdf]/70">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3ecdf]/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-sm">Video demostrativo — próximamente</p>
        <p className="text-xs text-[#f3ecdf]/50">
          (el profesor carga la grabación real más adelante)
        </p>
      </div>
    </div>
  );
}

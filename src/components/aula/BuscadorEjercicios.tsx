"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface EjercicioListado {
  slug: string;
  titulo: string;
  etiqueta: string;
  concepto: string;
  completado: boolean;
  esLaboratorio: boolean;
}

// Lista buscable de los ejercicios YA desbloqueados (doc 10, seccion 4:
// buscador/filtro dentro del aula). Cada tarjeta enlaza al ejercicio.
export function BuscadorEjercicios({
  ejercicios,
}: {
  ejercicios: EjercicioListado[];
}) {
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const termino = q.trim().toLowerCase();
    if (!termino) return ejercicios;
    return ejercicios.filter(
      (e) =>
        e.titulo.toLowerCase().includes(termino) ||
        e.concepto.toLowerCase().includes(termino),
    );
  }, [q, ejercicios]);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar un ejercicio por nombre o tema…"
        className="mb-4 w-full rounded-lg border border-[#f3ecdf]/20 bg-black/20 px-4 py-2.5 font-sans text-sm text-[#f3ecdf] placeholder:text-[#f3ecdf]/40 focus:border-jade focus:outline-none"
        aria-label="Buscar ejercicio"
      />

      {filtrados.length === 0 ? (
        <p className="font-sans text-sm text-[#f3ecdf]/60">
          No encontramos ejercicios con “{q}”.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/aula/piano/ejercicio/${e.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-[#f3ecdf]/15 bg-[#2a2018] p-4 transition-colors hover:border-jade hover:bg-[#33271c]"
              >
                <span aria-hidden className="mt-0.5 text-lg">
                  {e.completado ? "✅" : "🔓"}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lg text-[#f3ecdf] group-hover:text-lino">
                      {e.titulo}
                    </span>
                    {e.esLaboratorio && (
                      <span className="rounded-full bg-dorado/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-dorado">
                        Laboratorio
                      </span>
                    )}
                    <ChipEtiqueta etiqueta={e.etiqueta} />
                  </span>
                  <span className="mt-1 block font-sans text-sm leading-snug text-[#f3ecdf]/70">
                    {e.concepto}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChipEtiqueta({ etiqueta }: { etiqueta: string }) {
  const texto =
    etiqueta === "DIGITAL-INTERACTIVO"
      ? "Interactivo"
      : etiqueta === "HIBRIDO"
        ? "Híbrido"
        : "Video";
  return (
    <span className="rounded-full border border-[#f3ecdf]/25 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-[#f3ecdf]/70">
      {texto}
    </span>
  );
}

import Link from "next/link";
import { requireActiveSubscription } from "@/lib/premium/requireActiveSubscription";
import { obtenerProgresoPiano } from "@/lib/aulas/progreso";
import { AULA_PIANO } from "@/lib/aulas/piano/contenido";
import {
  BuscadorEjercicios,
  type EjercicioListado,
} from "@/components/aula/BuscadorEjercicios";

// El Mapa del Aula de Piano (doc 10, seccion 4). Vista principal del Camino 1
// (Metodo Guiado). Ruta premium: gateada por suscripcion activa. Silencio
// total: no monta ningun audio ambiente del bosque.
export default async function AulaPianoPage() {
  await requireActiveSubscription();
  const progreso = await obtenerProgresoPiano();
  const completados = new Set(progreso.ejerciciosCompletados);

  const totalEjercicios = AULA_PIANO.bloques.reduce(
    (n, b) => n + b.ejercicios.length,
    0,
  );
  const hechos = AULA_PIANO.bloques.reduce(
    (n, b) => n + b.ejercicios.filter((e) => completados.has(e.slug)).length,
    0,
  );
  const porcentaje = Math.round((hechos / totalEjercicios) * 100);

  return (
    <main className="min-h-screen bg-[#1b1610] text-[#f3ecdf]">
      {/* Fondo inmersivo (placeholder por CSS del "interior del tronco", doc 03
          seccion 4.B — se reemplaza por la ilustracion original por aula). */}
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #2e2519 0%, #221b13 45%, #17130e 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-sans text-sm text-[#f3ecdf]/60 transition-colors hover:text-[#f3ecdf]"
            >
              ← Volver al bosque
            </Link>
            <span className="font-sans text-xs text-[#f3ecdf]/50">
              Tutor: Maestro Allegro · próximamente
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl text-lino">Aula de Piano</h1>

          {/* Barra de progreso del aula + racha */}
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between font-sans text-xs text-[#f3ecdf]/70">
                <span>Progreso del aula</span>
                <span>
                  {hechos}/{totalEjercicios} · {porcentaje}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full bg-jade transition-[width]"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 font-sans text-sm font-semibold text-dorado"
              title="Racha de práctica"
            >
              <span aria-hidden>🔥</span>
              {progreso.rachaPractica}
            </div>
          </div>

          {/* Pestañas: Metodo Guiado (activa) / Biblioteca (reservada) */}
          <div className="mt-8 flex gap-2 border-b border-[#f3ecdf]/15">
            <span className="border-b-2 border-jade px-4 py-2 font-sans text-sm font-semibold text-lino">
              Método Guiado
            </span>
            <span
              className="cursor-default px-4 py-2 font-sans text-sm text-[#f3ecdf]/40"
              title="Camino 2 — se construye en una fase posterior"
            >
              Biblioteca · Próximamente
            </span>
          </div>

          {/* Espacio reservado para el tutor de IA (Fase 5) */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-[#f3ecdf]/20 bg-black/20 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3ecdf]/10 text-lg">
              🎹
            </div>
            <p className="font-sans text-xs text-[#f3ecdf]/60">
              Acá va a vivir <span className="text-[#f3ecdf]/90">Maestro Allegro</span>, tu
              tutor de IA. Se activa en la próxima fase.
            </p>
          </div>

          {/* Bloques */}
          <div className="mt-8 space-y-6">
            {AULA_PIANO.bloques.map((bloque) => {
              const desbloqueado = bloque.posicion <= progreso.bloqueDesbloqueadoMax;
              const esBloque1 = bloque.posicion === 1;

              return (
                <section
                  key={bloque.posicion}
                  className="rounded-2xl border border-[#f3ecdf]/12 bg-[#241c14]/70 p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl text-lino">
                        Bloque {bloque.posicion} — {bloque.nombre}
                      </h2>
                      {bloque.tagline && (
                        <p className="mt-1 font-serif text-sm italic text-[#f3ecdf]/60">
                          {bloque.tagline}
                        </p>
                      )}
                    </div>
                    <EstadoBloque desbloqueado={desbloqueado} esBloque1={esBloque1} />
                  </div>

                  {esBloque1 ? (
                    <div className="mt-5">
                      <BuscadorEjercicios
                        ejercicios={bloque.ejercicios.map<EjercicioListado>((e) => ({
                          slug: e.slug,
                          titulo: e.titulo,
                          etiqueta: e.etiqueta,
                          concepto: e.concepto,
                          completado: completados.has(e.slug),
                          esLaboratorio: Boolean(e.esLaboratorio),
                        }))}
                      />
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {bloque.ejercicios.map((e) => (
                        <li
                          key={e.slug}
                          className="flex items-center gap-2 font-sans text-sm text-[#f3ecdf]/45"
                        >
                          <span aria-hidden>{desbloqueado ? "🔓" : "🔒"}</span>
                          {e.titulo}
                        </li>
                      ))}
                      <li className="pt-1 font-sans text-xs text-[#f3ecdf]/40">
                        {desbloqueado
                          ? "Bloque desbloqueado — el contenido interactivo llega en una próxima fase."
                          : "Se desbloquea al aprobar el bloque anterior."}
                      </li>
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function EstadoBloque({
  desbloqueado,
  esBloque1,
}: {
  desbloqueado: boolean;
  esBloque1: boolean;
}) {
  if (esBloque1) {
    return (
      <span className="whitespace-nowrap rounded-full bg-jade/20 px-3 py-1 font-sans text-xs font-semibold text-jade-claro">
        🔓 Disponible
      </span>
    );
  }
  if (desbloqueado) {
    return (
      <span className="whitespace-nowrap rounded-full bg-dorado/20 px-3 py-1 font-sans text-xs font-semibold text-dorado">
        🔓 Desbloqueado
      </span>
    );
  }
  return (
    <span className="whitespace-nowrap rounded-full bg-black/30 px-3 py-1 font-sans text-xs font-semibold text-[#f3ecdf]/50">
      🔒 Bloqueado
    </span>
  );
}

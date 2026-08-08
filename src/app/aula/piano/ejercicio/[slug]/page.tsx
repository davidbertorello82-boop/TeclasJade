import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireActiveSubscription } from "@/lib/premium/requireActiveSubscription";
import { obtenerProgresoPiano } from "@/lib/aulas/progreso";
import { buscarEjercicio } from "@/lib/aulas/piano/contenido";
import { RenderEjercicio } from "@/components/aula/RenderEjercicio";

// Vista de un ejercicio de Piano. Ruta premium. El servidor valida que el
// bloque del ejercicio este desbloqueado: si alguien entra por URL directa a
// un ejercicio de un bloque bloqueado, lo manda de vuelta al Mapa.
export default async function EjercicioPianoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireActiveSubscription();
  const { slug } = await params;

  const encontrado = buscarEjercicio(slug);
  if (!encontrado) notFound();

  const { ejercicio, bloque } = encontrado;
  const progreso = await obtenerProgresoPiano();

  // Guardarrail de bloque bloqueado (test del checklist).
  if (bloque.posicion > progreso.bloqueDesbloqueadoMax) {
    redirect("/aula/piano");
  }

  const yaCompletado = progreso.ejerciciosCompletados.includes(slug);
  const renderizable = Boolean(ejercicio.consigna); // solo el Bloque 1 tiene contenido cargado

  return (
    <main className="min-h-screen bg-[#1b1610] text-[#f3ecdf]">
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #2e2519 0%, #221b13 45%, #17130e 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
          {/* Header / breadcrumb */}
          <Link
            href="/aula/piano"
            className="font-sans text-sm text-[#f3ecdf]/60 transition-colors hover:text-[#f3ecdf]"
          >
            ← Mapa del Aula de Piano
          </Link>

          <p className="mt-5 font-sans text-xs uppercase tracking-wider text-dorado">
            Bloque {bloque.posicion} — {bloque.nombre}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-lino sm:text-4xl">
            {ejercicio.titulo}
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-lg italic leading-relaxed text-[#f3ecdf]/75">
            {ejercicio.concepto}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Panel de ejercicio */}
            <div>
              {renderizable ? (
                <RenderEjercicio ejercicio={ejercicio} yaCompletado={yaCompletado} />
              ) : (
                <div className="rounded-2xl bg-[#2a2018] p-8 font-sans text-[#f3ecdf]/70">
                  El contenido interactivo de este ejercicio se construye en una
                  próxima fase.
                </div>
              )}
            </div>

            {/* Areas reservadas: avatar del tutor + consola de chat (Fase 5) */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-dashed border-[#f3ecdf]/20 bg-black/20 p-4 text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ecdf]/10 text-2xl">
                  🎹
                </div>
                <p className="font-serif text-lg text-lino">Maestro Allegro</p>
                <p className="mt-1 font-sans text-xs text-[#f3ecdf]/50">
                  Tu tutor de IA · se activa en la Fase 5
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-[#f3ecdf]/20 bg-black/20 p-4">
                <p className="font-sans text-xs text-[#f3ecdf]/50">
                  Acá va a estar la consola de chat para preguntarle al tutor
                  sobre este ejercicio. Próximamente.
                </p>
              </div>
            </aside>
          </div>

          {/* Atribucion de los samples del motor de audio (lote SONIDO-1).
              El piano es dominio publico (AKAI); la guitarra FluidR3 es
              CC-BY 3.0 y exige credito visible donde se sirve el material. */}
          <p className="mt-10 font-sans text-[11px] leading-relaxed text-[#f3ecdf]/40">
            Sonido: piano Splendid Grand (samples de dominio público, AKAI) ·
            guitarra del banco{" "}
            <a
              href="https://member.keymusician.com/Member/FluidR3_GM/index.html"
              className="underline decoration-[#f3ecdf]/30 underline-offset-2 hover:text-[#f3ecdf]/70"
              rel="noopener noreferrer"
              target="_blank"
            >
              FluidR3
            </a>{" "}
            de Frank Wen (
            <a
              href="https://creativecommons.org/licenses/by/3.0/"
              className="underline decoration-[#f3ecdf]/30 underline-offset-2 hover:text-[#f3ecdf]/70"
              rel="license noopener noreferrer"
              target="_blank"
            >
              CC-BY 3.0
            </a>
            ), render de Benjamin Gleitzman · motor smplr (MIT).
          </p>
        </div>
      </div>
    </main>
  );
}

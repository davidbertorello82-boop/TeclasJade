"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CierreComercial() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function suscribirse() {
    setCargando(true);
    setError(null);

    const respuesta = await fetch("/api/mercadopago/suscribirse", {
      method: "POST",
    });

    if (respuesta.status === 401) {
      router.push("/login");
      return;
    }

    if (!respuesta.ok) {
      setError("No pudimos iniciar la suscripción. Probá de nuevo en un momento.");
      setCargando(false);
      return;
    }

    const { init_point } = await respuesta.json();
    window.location.href = init_point;
  }

  return (
    <section
      id="cierre-comercial"
      className="mx-auto max-w-2xl space-y-6 px-6 py-24 text-center"
    >
      <p className="font-serif text-base italic text-texto/70">
        Lo que la naturaleza enseña despacio, dura para siempre.
      </p>
      <p className="leading-relaxed text-texto/90">
        Para tener ingreso a todo el contenido, suscribite a nuestro plan
        mensual. Tendrás seguimiento continuo, material de estudio,
        ejercicios, chatbot de consultas, recursos musicales desde nivel
        inicial a nivel avanzado y ¡mucho más! <strong>AR$14.900/mes.</strong>
      </p>

      <button
        type="button"
        onClick={suscribirse}
        disabled={cargando}
        className="rounded-full bg-tierra px-8 py-4 font-sans text-lg text-lino transition-colors hover:bg-tierra-claro disabled:cursor-default disabled:opacity-70"
      >
        {cargando ? "Redirigiendo..." : "Suscribirme"}
      </button>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </section>
  );
}

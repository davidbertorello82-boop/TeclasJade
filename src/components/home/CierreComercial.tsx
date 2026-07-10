export function CierreComercial() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 px-6 py-24 text-center">
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
        disabled
        title="Disponible en la Fase 3, junto con la integración de Mercado Pago"
        className="cursor-not-allowed rounded-full bg-tierra px-8 py-4 font-sans text-lg text-lino opacity-70"
      >
        Suscribirme
      </button>
    </section>
  );
}

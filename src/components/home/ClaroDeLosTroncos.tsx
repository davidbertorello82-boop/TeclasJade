const AULAS = [
  {
    nombre: "Piano",
    tagline:
      "Un mapa vivo bajo tus manos — cada tecla, una raíz distinta del mismo árbol.",
  },
  {
    nombre: "Guitarra",
    tagline:
      "Un mástil que se aprende a caminar con los dedos, antes de aprender a volar con la púa.",
  },
  {
    nombre: "Canto",
    tagline:
      "Tu voz es un territorio propio — acá aprendés a habitarlo sin tensión, como quien respira al aire libre.",
  },
  {
    nombre: "Teoría Musical",
    tagline:
      "Cada acorde tiene su propia gravedad — acá aprendés a escuchar por qué las notas se atraen entre sí.",
  },
];

export function ClaroDeLosTroncos() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <p className="mb-4 text-center font-serif text-base italic text-texto/70">
        Cuatro senderos, un mismo bosque — elegí por dónde empezar a
        escuchar.
      </p>
      <h2 className="mb-12 text-center font-serif text-2xl text-jade md:text-3xl">
        El Claro de los Troncos
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {AULAS.map((aula) => (
          <div
            key={aula.nombre}
            aria-disabled="true"
            title="Todavía no disponible"
            className="flex cursor-not-allowed flex-col gap-3 rounded-2xl border border-destaque bg-white/40 p-6 text-center opacity-80 transition-transform hover:-translate-y-1"
          >
            <h3 className="font-serif text-xl text-tierra">{aula.nombre}</h3>
            <p className="text-sm leading-relaxed text-texto/80">
              {aula.tagline}
            </p>
            <span className="mt-2 text-xs uppercase tracking-wide text-texto/50">
              Próximamente
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";

type HeroProps = {
  despierto: boolean;
  onDespertar: () => void;
};

export function Hero({ despierto, onDespertar }: HeroProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Image
        src="/brand/logo-principal.png"
        alt="Teclas Jade"
        width={140}
        height={140}
        priority
        className="h-auto w-28 md:w-36"
      />

      <div className="max-w-2xl space-y-4">
        <h1 className="font-serif text-3xl leading-snug text-jade md:text-5xl">
          Teclas Jade — donde cada nota encuentra su raíz.
        </h1>
        <p className="font-serif text-lg italic text-texto/80 md:text-xl">
          La música no se retiene con la fuerza de la repetición, sino con la
          claridad de la estructura.
        </p>
      </div>

      <button
        type="button"
        onClick={onDespertar}
        disabled={despierto}
        className="rounded-full bg-jade px-8 py-4 font-sans text-lg text-lino transition-colors hover:bg-jade-claro disabled:cursor-default disabled:opacity-70"
      >
        {despierto ? "El bosque está despierto 🌿" : "Despertar el bosque 🌿"}
      </button>

      <p className="max-w-md font-serif text-base italic text-texto/70">
        Un bosque también puede enseñarte a tocar: solo hay que aprender a
        escucharlo.
      </p>
    </section>
  );
}

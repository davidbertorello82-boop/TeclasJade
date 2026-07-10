import Image from "next/image";

export function Bio() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-24 md:flex-row md:items-start md:gap-12">
      <Image
        src="/brand/foto-perfil.jpeg"
        alt="David Eugenio Bertorello Mitrojovich"
        width={240}
        height={240}
        className="h-48 w-48 shrink-0 rounded-full object-cover md:h-56 md:w-56"
      />

      <div className="space-y-5 text-center md:text-left">
        <h2 className="font-serif text-2xl text-jade md:text-3xl">
          Sobre mí
        </h2>
        <p className="leading-relaxed text-texto/90">
          Soy David Eugenio Bertorello Mitrojovich, y mi pasión es la música,
          la pedagogía y la innovación educativa. Durante años dediqué mi
          trabajo a deconstruir los métodos rígidos de la enseñanza musical
          tradicional, para ofrecer en cambio un camino claro, maduro e
          interactivo. Teclas Jade es el resultado de ese recorrido: un
          ecosistema formativo digital donde aprender piano, guitarra, canto o
          teoría musical no es repetición ciega, sino una verdadera
          exploración arqueológica — cada estudiante descubre la raíz atómica
          de cada sonido, y la hace suya.
        </p>
        <p className="font-serif text-base italic text-texto/70">
          La raíz que sostiene un árbol es la misma que sostiene una escala:
          nadie la ve, pero todo depende de ella.
        </p>
      </div>
    </section>
  );
}

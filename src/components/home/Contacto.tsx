export function Contacto() {
  return (
    <footer className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
      <h2 className="font-serif text-xl text-jade">Contacto</h2>
      <div className="flex flex-wrap justify-center gap-6 font-sans text-texto/90">
        <a
          href="https://instagram.com/davideugenio__"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-tierra decoration-2 underline-offset-4 hover:text-tierra"
        >
          Instagram @davideugenio__
        </a>
        <a
          href="https://wa.me/5493564688728"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-tierra decoration-2 underline-offset-4 hover:text-tierra"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  );
}

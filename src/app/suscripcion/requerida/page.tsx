import Link from "next/link";

export default function SuscripcionRequeridaPage() {
  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Esta zona requiere una suscripción activa</h1>
      <p>
        Para acceder a las aulas necesitás una suscripción activa a Teclas
        Jade.
      </p>
      <p>
        <Link href="/#cierre-comercial">Suscribirme</Link> ·{" "}
        <Link href="/cuenta">Ver mi cuenta</Link>
      </p>
    </main>
  );
}

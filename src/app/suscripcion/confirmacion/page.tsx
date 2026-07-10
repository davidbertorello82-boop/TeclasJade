import Link from "next/link";

function calcularProximaRenovacion(): string {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  return proximoMes.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}

export default function ConfirmacionSuscripcionPage() {
  const proximaRenovacion = calcularProximaRenovacion();

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>¡Gracias por suscribirte!</h1>
      <p>
        Tu suscripción arranca hoy. Como se cobra el monto completo desde el
        primer momento, tu próxima renovación va a ser el{" "}
        <strong>{proximaRenovacion}</strong>.
      </p>
      <p>
        El estado puede tardar unos segundos en actualizarse mientras Mercado
        Pago confirma el pago. Podés revisarlo en cualquier momento en{" "}
        <Link href="/cuenta">Mi cuenta</Link>.
      </p>
    </main>
  );
}

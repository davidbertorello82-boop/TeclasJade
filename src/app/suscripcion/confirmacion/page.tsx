import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { reconciliarSuscripcion } from "@/lib/mercadopago/reconciliar";

function calcularProximaRenovacion(): string {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  return proximoMes.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}

export default async function ConfirmacionSuscripcionPage() {
  const proximaRenovacion = calcularProximaRenovacion();

  // El usuario acaba de volver del checkout: si la suscripción quedó "pending",
  // intentamos reconciliar el estado real con Mercado Pago en el acto.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let estado: string | null = null;
  if (user) {
    const { data: suscripcion } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    estado = suscripcion?.status ?? null;
    if (estado === "pending") {
      estado = await reconciliarSuscripcion(user.id);
    }
  }

  const activa = estado === "active";

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>¡Gracias por suscribirte!</h1>
      {activa ? (
        <p>
          Tu suscripción ya está <strong>activa</strong>. Tu próxima renovación
          va a ser el <strong>{proximaRenovacion}</strong>.
        </p>
      ) : (
        <>
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
        </>
      )}
      {activa && (
        <p>
          <Link href="/cuenta">Ir a Mi cuenta</Link>
        </p>
      )}
    </main>
  );
}

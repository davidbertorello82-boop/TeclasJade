import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

const ETIQUETAS_ESTADO: Record<string, string> = {
  active: "Activa ✅",
  inactive: "Inactiva",
  pending: "Pendiente de confirmación",
  cancelled: "Cancelada",
};

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: suscripcion } = await supabase
    .from("subscriptions")
    .select("status, next_billing_date")
    .eq("user_id", user.id)
    .maybeSingle();

  const estado = suscripcion?.status ?? "inactive";

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Mi cuenta</h1>
      <p>Sesión iniciada como: {user.email}</p>

      <h2>Suscripción</h2>
      <p>Estado: {ETIQUETAS_ESTADO[estado] ?? estado}</p>
      {suscripcion?.next_billing_date && estado === "active" && (
        <p>
          Próxima renovación:{" "}
          {new Date(suscripcion.next_billing_date).toLocaleDateString("es-AR")}
        </p>
      )}

      {estado === "active" && (
        <p>
          <Link href="/aula/piano">→ Ir al Aula de Piano</Link>
        </p>
      )}

      <form action={signOut}>
        <button type="submit">Cerrar sesión</button>
      </form>
    </main>
  );
}

import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Guardia reutilizable para las rutas premium (aulas, a partir de la Fase 4).
// Llamarla al principio de un Server Component: si no hay sesion, manda a
// login; si la sesion existe pero no hay suscripcion activa, manda a
// suscribirse. Nunca confia en nada que venga del navegador - vuelve a leer
// el estado real desde Supabase en cada visita.
export async function requireActiveSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: suscripcion } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (suscripcion?.status !== "active") {
    redirect("/suscripcion/requerida");
  }

  return user;
}

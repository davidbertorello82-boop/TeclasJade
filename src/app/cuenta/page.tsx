import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Mi cuenta</h1>
      <p>Sesión iniciada como: {user.email}</p>
      <form action={signOut}>
        <button type="submit">Cerrar sesión</button>
      </form>
    </main>
  );
}

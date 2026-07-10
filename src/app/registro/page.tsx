"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/auth/actions";

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Crear cuenta</h1>
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        {state?.error && <p style={{ color: "crimson" }}>{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}

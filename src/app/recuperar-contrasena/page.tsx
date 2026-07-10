"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function RecuperarContrasenaPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Recuperar contraseña</h1>
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        {state?.error && <p style={{ color: "crimson" }}>{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Mandarme el link"}
        </button>
      </form>
    </main>
  );
}

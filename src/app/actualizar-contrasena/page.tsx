"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/actions";

export default function ActualizarContrasenaPage() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Elegí una contraseña nueva</h1>
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label>
          Contraseña nueva
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
          {pending ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </main>
  );
}

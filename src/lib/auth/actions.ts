"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string } | null;

function mensajeError(mensaje: string): string {
  if (mensaje.includes("already registered") || mensaje.includes("already been registered")) {
    return "Ese email ya tiene una cuenta. Probá iniciar sesión en vez de registrarte.";
  }
  if (mensaje.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (mensaje.includes("Password should be at least")) {
    return "La contraseña tiene que tener al menos 6 caracteres.";
  }
  if (mensaje.includes("Email not confirmed")) {
    return "Todavía no confirmaste tu email. Revisá tu bandeja de entrada.";
  }
  return "Algo salió mal. Probá de nuevo en un momento.";
}

export async function signUp(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: mensajeError(error.message) };
  }

  redirect("/registro/revisa-tu-email");
}

export async function signIn(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mensajeError(error.message) };
  }

  redirect("/cuenta");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/actualizar-contrasena`,
  });

  if (error) {
    return { error: mensajeError(error.message) };
  }

  redirect("/recuperar-contrasena/revisa-tu-email");
}

export async function updatePassword(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: mensajeError(error.message) };
  }

  redirect("/cuenta");
}

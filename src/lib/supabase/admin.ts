import { createClient } from "@supabase/supabase-js";

// Cliente con la clave service_role: saltea RLS por completo. Usarlo SOLO
// desde codigo que corre en el servidor y que ya verifico por su cuenta que
// la escritura es legitima (ej. el webhook de Mercado Pago, tras validar la
// firma) o desde scripts de administracion en scripts/. Nunca importar esto
// desde un componente cliente ("use client") ni desde src/lib/premium/*.
// (No se usa el paquete server-only aca a proposito: fuera del bundler de
// Next.js -por ej. cuando scripts/ lo corre tsx directo- ese paquete tira
// error incluso en un uso legitimo de servidor.)
export function crearClienteSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

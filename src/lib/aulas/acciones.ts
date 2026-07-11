"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buscarEjercicio } from "./piano/contenido";
import { bloque1Aprobado, bloqueDesbloqueadoMax } from "./progreso";

export type ResultadoCompletar = { ok: true } | { ok: false; error: string };

// Marca un ejercicio de Piano como completado para el alumno logueado.
// Escribe en user_progress via RLS (el usuario solo puede tocar su propia
// fila). Es el servidor quien decide: valida que el ejercicio exista y que su
// bloque este realmente desbloqueado antes de aceptar, asi nadie completa un
// ejercicio bloqueado llamando la accion a mano.
export async function marcarEjercicioCompletado(
  slug: string,
): Promise<ResultadoCompletar> {
  const encontrado = buscarEjercicio(slug);
  if (!encontrado) {
    return { ok: false, error: "Ese ejercicio no existe." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "No hay sesión activa." };
  }

  const { data: pilar } = await supabase
    .from("pilares")
    .select("id")
    .eq("slug", "piano")
    .single();
  if (!pilar) {
    return { ok: false, error: "No se encontró el aula de Piano." };
  }

  // Bloques de Piano (posicion -> id) para poder fijar bloque_actual_id.
  const { data: bloques } = await supabase
    .from("bloques")
    .select("id, posicion")
    .eq("pilar_id", pilar.id)
    .not("posicion", "is", null);
  if (!bloques || bloques.length === 0) {
    return { ok: false, error: "No se encontraron los bloques de Piano." };
  }
  const idPorPosicion = new Map<number, string>(
    bloques.map((b) => [b.posicion as number, b.id as string]),
  );

  const { data: fila } = await supabase
    .from("user_progress")
    .select("ejercicios_completados, racha_practica, updated_at")
    .eq("user_id", user.id)
    .eq("pilar_id", pilar.id)
    .maybeSingle();

  const completadosPrevios: string[] = Array.isArray(fila?.ejercicios_completados)
    ? (fila!.ejercicios_completados as string[])
    : [];

  // Guardarrail de servidor: el bloque del ejercicio tiene que estar
  // desbloqueado segun el progreso ACTUAL (antes de este marcado).
  if (encontrado.bloque.posicion > bloqueDesbloqueadoMax(completadosPrevios)) {
    return { ok: false, error: "Ese bloque todavía está bloqueado." };
  }

  const completados = completadosPrevios.includes(slug)
    ? completadosPrevios
    : [...completadosPrevios, slug];

  // Racha de practica: se cuenta por dia (UTC). Primer dia = 1; si el ultimo
  // avance fue ayer, suma; si fue hoy, se mantiene; si hubo un hueco, reinicia.
  const racha = calcularRacha(fila?.racha_practica ?? 0, fila?.updated_at ?? null);

  // El Bloque 2 se abre al aprobar el Bloque 1; si no, se queda en el 1.
  const posicionActual = bloque1Aprobado(completados) ? 2 : 1;
  const bloqueActualId = idPorPosicion.get(posicionActual) ?? idPorPosicion.get(1)!;

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      pilar_id: pilar.id,
      bloque_actual_id: bloqueActualId,
      ejercicios_completados: completados,
      racha_practica: racha,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,pilar_id" },
  );

  if (error) {
    return { ok: false, error: "No pudimos guardar tu progreso. Probá de nuevo." };
  }

  revalidatePath("/aula/piano");
  revalidatePath(`/aula/piano/ejercicio/${slug}`);
  return { ok: true };
}

function diaUTC(fecha: Date): number {
  return Math.floor(
    Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()) /
      86_400_000,
  );
}

function calcularRacha(rachaPrevia: number, ultimoAvanceISO: string | null): number {
  if (!ultimoAvanceISO) return 1;
  const diasDeDiferencia = diaUTC(new Date()) - diaUTC(new Date(ultimoAvanceISO));
  if (diasDeDiferencia <= 0) return Math.max(rachaPrevia, 1); // mismo dia
  if (diasDeDiferencia === 1) return rachaPrevia + 1; // dia consecutivo
  return 1; // hubo un hueco: reinicia
}

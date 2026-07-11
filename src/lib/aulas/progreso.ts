import "server-only";
import { createClient } from "@/lib/supabase/server";
import { ejerciciosContablesBloque1, laboratorioBloque1 } from "./piano/contenido";

// Gating del Bloque 1 -> Bloque 2 (doc 10, seccion 3.A): se desbloquea al
// completar >= 70% de los ejercicios del bloque MAS aprobar el Laboratorio de
// cierre. Con 4 ejercicios contables, 70% = 3 de 4, mas el Laboratorio.
const UMBRAL_GATING = 0.7;

export interface ProgresoPiano {
  ejerciciosCompletados: string[];
  rachaPractica: number;
  // Posicion del bloque mas alto desbloqueado (>= 1). El Bloque 1 siempre lo
  // esta; el 2 se agrega cuando el Bloque 1 esta aprobado.
  bloqueDesbloqueadoMax: number;
}

export function bloque1Aprobado(completados: string[]): boolean {
  const contables = ejerciciosContablesBloque1();
  const hechos = contables.filter((slug) => completados.includes(slug)).length;
  const ratio = hechos / contables.length;
  const laboratorioHecho = completados.includes(laboratorioBloque1());
  return ratio >= UMBRAL_GATING && laboratorioHecho;
}

// Posicion del bloque mas alto desbloqueado, derivada del conjunto de
// ejercicios completados (unica fuente de verdad). Solo hay contenido real
// hasta el Bloque 1; el 2 se marca desbloqueado cuando el 1 esta aprobado.
export function bloqueDesbloqueadoMax(completados: string[]): number {
  return bloque1Aprobado(completados) ? 2 : 1;
}

export async function obtenerProgresoPiano(): Promise<ProgresoPiano> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const vacio: ProgresoPiano = {
    ejerciciosCompletados: [],
    rachaPractica: 0,
    bloqueDesbloqueadoMax: 1,
  };
  if (!user) return vacio;

  const { data: pilar } = await supabase
    .from("pilares")
    .select("id")
    .eq("slug", "piano")
    .single();
  if (!pilar) return vacio;

  const { data: fila } = await supabase
    .from("user_progress")
    .select("ejercicios_completados, racha_practica")
    .eq("user_id", user.id)
    .eq("pilar_id", pilar.id)
    .maybeSingle();

  const completados: string[] = Array.isArray(fila?.ejercicios_completados)
    ? (fila!.ejercicios_completados as string[])
    : [];

  return {
    ejerciciosCompletados: completados,
    rachaPractica: fila?.racha_practica ?? 0,
    bloqueDesbloqueadoMax: bloqueDesbloqueadoMax(completados),
  };
}

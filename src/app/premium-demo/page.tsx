import { requireActiveSubscription } from "@/lib/premium/requireActiveSubscription";

// Pagina de prueba SOLO para verificar el bloqueo de rutas premium en la
// Fase 3, antes de que existan las aulas reales (Fase 4). Se borra cuando
// las aulas la reemplacen.
export default async function PremiumDemoPage() {
  const user = await requireActiveSubscription();

  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Zona premium (demo)</h1>
      <p>
        Si estás viendo esto, {user.email} tiene una suscripción activa. Esta
        página es solo para probar el bloqueo — las aulas reales llegan en la
        Fase 4.
      </p>
    </main>
  );
}

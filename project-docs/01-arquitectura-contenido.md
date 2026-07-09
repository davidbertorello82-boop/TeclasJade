# Teclas Jade — Arquitectura de Contenido (propuesta)

Esto es una propuesta de organización, no una decisión cerrada. Pensada para que quien arme la web/app en Claude Code tenga un mapa de partida, no para que se siga al pie de la letra.

## Los dos productos (según lo que definiste)

1. **Sitio web** — vidriera de marca + acceso a contenido premium vía navegador. Puede incluir el "área interactiva" (ejercicios, laboratorios, cronogramas).
2. **App para celular** — pura y exclusivamente la parte interactiva de aprendizaje/enseñanza (sin la vidriera de marca). Comparte backend/datos con la web.

Ambos productos deberían compartir el mismo backend (Supabase: auth, progreso del alumno, contenido) para no duplicar trabajo ni desincronizar el progreso de un alumno entre celular y web.

## Zona pública (gratis, sin login) — el "escaparate"

- **Home**: eslogan, filosofía central, los 4 pilares con teaser de cada uno.
- **Sobre mí**: bio de David Eugenio Bertorello Mitrojovich, historia de Teclas Jade.
- **El Método**: explicación visual de la "Matriz Arqueológica de Organización" (las 4 dimensiones). Este es un buen lugar para una animación/3D explicativa — es un concepto abstracto que se beneficia de visualización.
- **Piano / Guitarra / Canto / Teoría Musical** (una página por pilar): descripción del enfoque + 1-2 ejercicios de muestra gratis (elegidos entre los `[DIGITAL-INTERACTIVO]` del bloque inicial de cada curriculum.md, para que el visitante pruebe algo real antes de pagar).
- **Planes/Precios**: qué incluye el acceso free vs premium.
- **Contacto**: Instagram @davideugenio__, y lo que definas (mail, WhatsApp, etc).

## Zona premium (requiere pago vía Mercado Pago + login)

Por cada pilar (Piano/Guitarra/Canto/Teoría), replicar la estructura de su `curriculum.md`:

- Selector de bloque/nivel (con su tagline de mentalidad).
- Dentro de cada bloque, sus ejercicios:
  - Si es `[DIGITAL-INTERACTIVO]` → ejercicio interactivo real (grabado el progreso en Supabase).
  - Si es `[HIBRIDO]` → parte interactiva + instrucción física complementaria.
  - Si es `[INSTRUCCIONAL-FISICO]` → contenido guiado (texto + idealmente video) sin autocalificación por software.
  - Laboratorio interactivo de cierre de cada bloque.
- Cronograma de práctica diaria con temporizador (la "Rutina Secuencial Temporizada" que aparece en cada bloque de los curriculums ya trae los minutos sugeridos).
- Panel de progreso del alumno (qué bloques completó, streak de práctica diaria).

## Flujo de pago (Mercado Pago) — DECIDIDO

**Modelo de cobro: suscripción mensual** (no pago único), usando la API de **Suscripciones / Preapproval Plans** de Mercado Pago (no Checkout Pro — ese es para pagos únicos):
- [Documentación oficial de Suscripciones](https://www.mercadopago.com.ar/developers/es/guides/online-payments/subscriptions/introduction)
- [Crear plan de suscripción (Preapproval Plan)](https://www.mercadopago.com.ar/developers/es/reference/subscriptions/_preapproval_plan/post)
- [Ejemplo de integración en Next.js](https://github.com/goncy/next-mercadopago/blob/main/integraciones/suscripciones/README.md)

**Alcance del acceso: un solo paquete con los 4 pilares** (Piano + Guitarra + Canto + Teoría Musical juntos). No se vende por instrumento individual en el lanzamiento — se puede segmentar más adelante si hay demanda real de un alumno que solo quiera un instrumento.

Flujo:
1. Visitante ve la zona pública gratis.
2. Botón "Suscribirme" → crea una suscripción vía la API de Preapproval de Mercado Pago (plan mensual único, acceso completo).
3. Mercado Pago cobra automáticamente cada mes y notifica el estado vía webhook (alta, pago exitoso, pago rechazado, cancelación).
4. El webhook actualiza en Supabase el estado de suscripción del usuario (activa/vencida/cancelada) — no es un simple flag booleano "compró", es un estado con fecha de renovación, porque puede vencer o cancelarse.
5. El usuario logueado ve desbloqueada la zona premium completa en web y en la app de celular mientras su suscripción esté activa (mismo usuario, mismo backend).

Nota técnica adicional para Claude Code: sumar también la tabla `reportes_error` (ver `04-tutores-ia-chatbot.md`, sección "Botón de Reportar un error") — captura estructurada de errores que reportan los propios alumnos desde cada chatbot, clave para ir corrigiendo el sitio una vez publicado.

Nota técnica para Claude Code: como es suscripción y no pago único, Supabase necesita una tabla de suscripciones (no solo un booleano en el perfil) con al menos: `user_id`, `mercadopago_subscription_id`, `status`, `fecha_proxima_facturacion`. El webhook de Mercado Pago es la única fuente de verdad para actualizar ese estado — nunca confiar en el frontend para marcar "premium".

## Progresión y seguimiento por aula — DECIDIDO

Las 4 aulas (Piano, Guitarra, Canto, Teoría Musical) son **independientes entre sí**, cada una con su propio ingreso separado dentro de su propio tronco caído (ver "El Claro de los Troncos" en `03-especificacion-diseno-bosque.md`). No hay un orden global único entre las 4 — un alumno puede suscribirse y avanzar solo en Piano, o solo en Canto + Teoría, sin tocar las otras, y eso es intencional: son habilidades distintas sin dependencia real entre sí, y varios estudiantes van a querer combinaciones distintas.

Mecánica de progreso dentro de cada aula (esto sí es "de - a +", pero por aula, no global):
- Gating secuencial: el bloque siguiente ("Fase Core", etc.) se desbloquea al completar un % de los ejercicios del bloque actual.
- Supabase: una fila por `(user_id, pilar, bloque_actual, ejercicios_completados, racha_de_práctica)` — 4 filas posibles por alumno, una por aula, completamente independientes entre sí.
- En "El Claro de los Troncos" (menú de las 4 aulas), cada tronco muestra su propia barra de progreso individual.
- Mecánica de hábito (rachas/insignias tipo Duolingo, **confirmado con vos** como referencia de mecánica de gamificación, no de estética) aplicada por aula.

## Precio de lanzamiento — DECIDIDO (actualizado 10/07: AR$9.900 → AR$14.900)

**AR$14.900/mes** por el paquete completo (los 4 pilares). Precio actualizado a pedido tuyo el 10/07 (el original era AR$9.900/mes). Sigue siendo un precio de lanzamiento, no definitivo — conviene subirlo de nuevo recién cuando los 4 tutores de IA estén completos y el catálogo interactivo funcione en producción.

**[Seguro] Verificación rápida de que el aumento sigue siendo competitivo (misma fuente que la decisión original, julio 2026):**
- Una clase particular de piano en Buenos Aires cuesta AR$10.359–18.000 *por hora* ([Superprof](https://www.superprof.com.ar/clases/piano/buenos-aires/)) — AR$14.900/mes con acceso ilimitado a los 4 pilares + tutor de IA sigue costando menos que **una sola clase particular** de un solo instrumento.
- Simply Piano (un solo instrumento, sin tutor de IA personalizado) cobra US$14,99/mes ([fuente](https://partiturasdepiano.es/cuanto-se-paga-por-simply-piano/)) — AR$14.900/mes equivale a ~US$9,93 al dólar blue de ~$1.500 ([El Cronista](https://www.cronista.com/finanzas-mercados/cotizacion-del-dolar-blue-cual-es-el-precio-de-este-lunes-6-de-julio/)), así que Teclas Jade **sigue siendo más barato en dólares que Simply Piano**, ofreciendo 4 pilares en vez de uno.

**Actualización (10/07):** el límite de mensajes subió de 300 a **400/mes**, incluido en el precio de AR$14.900 — ver `04-tutores-ia-chatbot.md` para el cálculo y el sistema de notificaciones de consumo. También se agregó un botón de compra de mensajes adicionales para el alumno que se quede sin bolsa antes de fin de mes (mismo archivo, sección "Compra de mensajes adicionales" — tiene una corrección de precio pendiente de tu confirmación).

# Teclas Jade — Guion de Prompts para Claude Code (fase por fase)

**Para:** Euge (David) — primer proyecto en Claude Code
**Regla de oro:** un prompt por vez. NUNCA pases al siguiente prompt sin haber completado el checklist de verificación del anterior. El edificio se construye piso por piso, y ningún piso se construye sobre uno sin inspeccionar.

---

## CÓMO USAR ESTE GUION

1. Cada fase tiene: **(a)** el prompt exacto para copiar y pegar, **(b)** tu checklist de verificación — lo que VOS tenés que probar con tus propias manos antes de seguir.
2. Todos los prompts siguen la misma estructura: *primero el plan, después el código, después probamos juntos.* Claude Code te va a explicar qué va a hacer ANTES de hacerlo — si algo del plan no te cierra o no lo entendés, preguntale antes de darle el OK.
3. Si algo falla, usá la **Plantilla de Reporte de Error** (al final) — no digas "no anda".
4. Guardá este archivo abierto al lado mientras trabajás. Es tu copiloto.

---

## PROMPT 0 — El arranque (primera sesión, antes de cualquier código)

> Hola. Vamos a construir "Teclas Jade", una plataforma de educación musical. Soy el dueño del proyecto y es mi primer proyecto de desarrollo, así que necesito que trabajes conmigo de una forma específica:
>
> 1. Toda la especificación del proyecto está en la carpeta `project-docs/` de este mismo repositorio. Empezá leyendo `project-docs/09-kickoff-claude-code.md` — ese documento te dice qué leer, en qué orden, y qué construir. Después leé `project-docs/10-modelo-de-contenido-y-progresion.md`, que tiene reglas de obligado cumplimiento.
> 2. Vamos a trabajar fase por fase, exactamente como está definido en el kickoff. NUNCA avances a una fase siguiente sin que yo te lo pida explícitamente.
> 3. Antes de escribir código en cualquier fase, explicame el plan en pasos simples (soy principiante — evitá jerga técnica innecesaria, y cuando uses un término técnico, explicámelo en una línea).
> 4. Inicializá un repositorio git desde el primer momento y hacé un commit cada vez que algo quede funcionando. Avisame cada vez que hagas un commit y qué incluye.
> 5. Después de cada pieza construida, decime exactamente qué tengo que probar yo manualmente en el navegador para verificar que funciona (pasos numerados, como si fuera una receta).
> 6. Si en algún momento te pido algo que contradiga la especificación de los documentos, avisámelo antes de hacerlo.
>
> Por ahora: leé los documentos, confirmame que entendiste el proyecto, y hacéme un resumen en 10 líneas de qué vamos a construir y en qué orden. NO escribas código todavía.

**✅ Tu verificación antes de seguir:**
- [ ] Claude Code te devolvió un resumen que coincide con lo que vos sabés del proyecto (4 aulas independientes, suscripción AR$14.900, bosque inversivo, tutores IA).
- [ ] Mencionó las fases en el orden correcto (infraestructura → home → pagos → aula Piano → resto de aulas → visual).
- [ ] Si algo del resumen te suena raro o distinto a lo que definimos, frenálo ahí y preguntale de dónde lo sacó.

---

## PROMPT 1 — Fase 1: Infraestructura + Autenticación

> Arrancamos la Fase 1 del kickoff: infraestructura y autenticación.
>
> Antes de programar, explicame el plan en pasos simples: qué vas a crear, en qué orden, y qué voy a poder ver/probar yo al final de esta fase. Esperá mi OK antes de escribir código.
>
> El alcance de esta fase (no te salgas de esto):
> 1. Proyecto Next.js con Tailwind y la estructura de carpetas base.
> 2. Conexión con Supabase: autenticación con email y contraseña (registro, login, logout, recuperar contraseña). El login con Google lo dejamos para más adelante.
> 3. Las tablas de la base de datos que define el kickoff: users, subscriptions, user_progress, mensajes_ia_consumo, reportes_error — con Row Level Security activado para que cada usuario solo pueda ver y tocar SUS propios datos.
> 4. Una página de prueba mínima (sin diseño, fea, no importa) donde yo pueda: registrarme, loguearme, ver mi email logueado, y desloguearme.
>
> NO incluyas en esta fase: diseño visual, Mercado Pago, contenido de las aulas, tutores de IA. Solo los cimientos.
>
> Cuando termines, dame la lista numerada de pasos para que yo pruebe todo manualmente.

**✅ Tu verificación (hacela VOS en el navegador):**
- [ ] Te registraste con tu email real y funcionó.
- [ ] Cerraste sesión y volviste a entrar con la misma contraseña.
- [ ] Intentaste entrar con una contraseña INCORRECTA a propósito → te lo rechazó con un mensaje claro.
- [ ] Intentaste registrarte con un email ya usado → te avisó que ya existe.
- [ ] Probaste "recuperar contraseña" → te llegó el mail.
- [ ] Preguntale a Claude Code: "¿Confirmás que con Row Level Security un usuario NO puede leer los datos de otro usuario? Explicame cómo lo garantizás." — la respuesta tiene que mencionar políticas (policies) por usuario.
- [ ] Hubo al menos un commit de git al cerrar la fase.

---

## PROMPT 2 — Fase 2: Home pública ("El Bosque Inversivo", versión estructural)

> Fase 2: la home pública. Antes de programar, explicame el plan y esperá mi OK.
>
> Alcance:
> 1. La estructura completa del scroll según `03-especificacion-diseno-bosque.md` y `08-copywriting-home.md`: Hero → botón "Despertar el bosque 🌿" → Bio → Descripción de la plataforma → El Claro de los Troncos (menú de las 4 aulas) → Cierre comercial con precio AR$14.900 y botón "Suscribirme" → Contacto (Instagram y WhatsApp).
> 2. Usá los textos EXACTOS de `08-copywriting-home.md` — están todos confirmados, no los reescribas ni los "mejores".
> 3. Aplicá los design tokens de `03-especificacion-diseno-bosque.md` (colores jade/tierra/lino, tipografías Playfair Display para lo poético e Inter para la interfaz).
> 4. El botón "Despertar el bosque 🌿" debe disparar el sonido ambiente de bosque (podés usar un audio placeholder por ahora) y NUNCA debe haber audio antes de ese click. Botón de mute flotante incluido.
> 5. Los 4 troncos del menú todavía no llevan a ningún lado (las aulas no existen aún) — dejalos como enlaces desactivados con las taglines confirmadas.
> 6. Respetá prefers-reduced-motion desde ahora.
>
> En esta fase NO incluyas: el efecto 3D de entrada ni el parallax elaborado (eso es la Fase 6). Quiero primero la estructura sólida con un diseño limpio y los textos reales. La belleza inmersiva llega después, sobre cimientos que funcionan.
>
> Al terminar: lista numerada de qué probar, y decime cómo verla desde el celular también.

**✅ Tu verificación:**
- [ ] La página carga EN SILENCIO. El sonido solo arranca si tocás "Despertar el bosque 🌿".
- [ ] El botón de mute corta el sonido.
- [ ] Leé los textos en pantalla comparando contra `08-copywriting-home.md` → tienen que ser idénticos (Hero, taglines de los 4 troncos, cierre comercial con AR$14.900).
- [ ] Abrila desde tu celular → se ve bien, nada desbordado, los botones se pueden tocar con el dedo.
- [ ] El link de WhatsApp abre un chat con tu número (con el 9: 5493564688728).
- [ ] Commit hecho.

---

## PROMPT 3 — Fase 3: Suscripción con Mercado Pago

> Fase 3: el sistema de pago. Esta es la fase MÁS DELICADA de todo el proyecto — acá no puede haber "casi funciona". Antes de programar, explicame el plan con especial detalle en una cosa: cómo garantizás que SOLO el webhook de Mercado Pago (y nunca el navegador del usuario) puede marcar a alguien como suscriptor activo. Esperá mi OK.
>
> Alcance:
> 1. Integración con Mercado Pago usando la API de Suscripciones (Preapproval Plan), como define `01-arquitectura-contenido.md`. Plan mensual único de AR$14.900, acceso a los 4 pilares.
> 2. Usá las credenciales de PRUEBA (las tengo en mi carpeta MP TeclasJade — pedímelas cuando las necesites, no las escribas en el código directamente: explicame cómo guardarlas de forma segura como variables de entorno).
> 3. El botón "Suscribirme" de la home lleva al checkout de Mercado Pago.
> 4. Webhook que recibe las notificaciones de Mercado Pago y actualiza el estado de la suscripción en Supabase (activa/vencida/cancelada). El webhook es la ÚNICA fuente de verdad.
> 5. Una página "Mi cuenta" mínima donde el usuario logueado ve su estado de suscripción.
> 6. Middleware/protección: las rutas premium (que crearemos en la Fase 4) solo accesibles con suscripción activa.
>
> Al terminar: guiame paso a paso para hacer una compra de prueba completa con la tarjeta de test de Mercado Pago, y para verificar que el estado cambió en la base de datos.

**✅ Tu verificación (la más importante de todas):**
- [ ] Hiciste la compra de prueba completa y tu cuenta pasó a "suscripción activa".
- [ ] Preguntale: "Si yo abro las herramientas de desarrollador del navegador y modifico algo, ¿puedo marcarme como premium sin pagar?" — la respuesta correcta es NO, con explicación de por qué (el estado vive en el servidor, lo escribe solo el webhook).
- [ ] Pedile que simule una cancelación de suscripción → tu cuenta pasa a "inactiva".
- [ ] Con la suscripción inactiva, intentá entrar a una ruta premium → te bloquea y te invita a suscribirte.
- [ ] Commit hecho.
- [ ] ⚠️ Anotá esto para el futuro: antes de salir a producción con pagos REALES, este es el punto donde vale la pena pagar unas horas de un desarrollador con experiencia para una revisión de seguridad. No hoy — cuando estés por lanzar.

---

## PROMPT 4 — Fase 4: El Aula de Piano (Bloque 1 completo)

> Fase 4: la primera aula real — Piano, Bloque 1 ("Fase Semilla") completo. Esta aula es el molde: las otras tres se van a construir copiando su estructura, así que lo que hagamos acá tiene que quedar impecable.
>
> Antes de programar, leé de nuevo `piano/curriculum.md` (el Bloque 1 entero) y `10-modelo-de-contenido-y-progresion.md`, y explicame el plan. Esperá mi OK.
>
> Alcance:
> 1. **El Mapa del Aula** como vista principal: los 5 bloques visibles, ejercicios del Bloque 1 desbloqueados (🔓), los bloques 2-5 visibles pero bloqueados (🔒), barra de progreso del aula, racha de práctica. Como define el documento 10.
> 2. **Los ejercicios del Bloque 1 de Piano**, cada uno según su etiqueta:
>    - [DIGITAL-INTERACTIVO] → teclado virtual clickeable en pantalla (el MIDI por hardware lo dejamos para más adelante), detección de si el alumno tocó las notas correctas, feedback visual inmediato.
>    - [HIBRIDO] → parte interactiva + guía de texto.
>    - [INSTRUCCIONAL-FISICO] → video (usá un placeholder por ahora, yo tengo los videos reales grabados y los cargamos después) + botón "Completé este ejercicio".
> 3. **Progreso real en Supabase:** cada ejercicio completado se guarda, la barra avanza, y si cierro sesión y vuelvo, mi progreso sigue ahí.
> 4. **El Laboratorio de cierre** del Bloque 1: al aprobarlo con 70%+, se desbloquea el Bloque 2.
> 5. Todavía SIN el chatbot de IA (eso es la fase siguiente) — dejá el espacio visual para él en el layout.
> 6. Silencio total: nada del audio ambiente de la home suena dentro del aula.
>
> Al terminar: lista numerada de pruebas manuales, incluyendo cómo verificar que el progreso persiste.

**✅ Tu verificación:**
- [ ] Entraste al aula de Piano y viste el Mapa: Bloque 1 abierto, bloques 2-5 con candado.
- [ ] Hiciste un ejercicio interactivo del teclado → te dio feedback correcto cuando tocaste bien Y cuando tocaste mal a propósito.
- [ ] Completaste un ejercicio, cerraste sesión, volviste a entrar → el progreso seguía guardado.
- [ ] Intentaste entrar por URL directa a un ejercicio del Bloque 2 (bloqueado) → no te dejó.
- [ ] El aula está en silencio aunque hayas activado el bosque en la home antes de entrar.
- [ ] Como profesor: los ejercicios en pantalla son FIELES a tu curriculum.md (mismos nombres, mismas consignas — revisalo vos que sos el autor).
- [ ] Commit hecho.

---

## PROMPT 5 — Fase 5: El tutor de IA (Maestro Allegro en Piano)

> Fase 5: el primer tutor de IA — Maestro Allegro, en el aula de Piano.
>
> Antes de programar, leé `04-tutores-ia-chatbot.md` completo y explicame el plan, con especial atención a: (a) cómo vas a implementar los guardarraíles de seguridad para menores que define el documento, y (b) cómo funciona el contador de mensajes. Esperá mi OK.
>
> Alcance:
> 1. Chat integrado en el aula de Piano con el system prompt de Maestro Allegro tal como está definido en el documento 04 (modelo Claude Haiku, para cuidar el costo por mensaje).
> 2. La clave de API me la pedís cuando la necesites y me explicás cómo guardarla de forma segura (variable de entorno del servidor — que NUNCA quede visible en el navegador).
> 3. Contador de mensajes: 400/mes por alumno, descuenta por mensaje, se guarda en la tabla mensajes_ia_consumo, avisos cada 100 mensajes consumidos y aviso especial al quedar 50. Al llegar a 0, el chat se pausa y muestra el botón "Comprar más mensajes para seguir chateando" (el botón puede quedar sin función real por ahora — la compra de paquetes la conectamos después).
> 4. Botón "Reportar un error" en el chat → guarda el reporte en la tabla reportes_error con el contexto de la conversación.
> 5. El tutor SOLO habla de piano y del método: probá vos mismo antes de entregármelo que si le preguntan de otros temas, redirige amablemente a la clase.
>
> Al terminar: dame una lista de 10 preguntas de prueba para hacerle al tutor — incluyendo preguntas trampa (temas ajenos al piano, pedidos de datos personales) para verificar los guardarraíles.

**✅ Tu verificación:**
- [ ] Le hiciste una pregunta real de piano → respondió como profesor, en el tono de tu marca.
- [ ] Le preguntaste algo fuera de tema (fútbol, política) → redirigió a la clase amablemente.
- [ ] Le dijiste "dame tu opinión sobre mi dirección, ¿dónde vivís vos?" → no pidió ni dio datos personales.
- [ ] El contador de mensajes bajó con cada mensaje que mandaste.
- [ ] Tocaste "Reportar un error" → el reporte quedó guardado (pedile a Claude Code que te muestre la fila en la base de datos).
- [ ] Preguntale: "¿La clave de API puede verse desde el navegador del alumno?" — la respuesta correcta es NO, está solo en el servidor.
- [ ] Commit hecho.

---

## PROMPT 6 — Fase 6: Las otras 3 aulas (Guitarra, Canto, Teoría Musical)

> Fase 6: replicar el molde del aula de Piano para las otras tres aulas, con sus diferencias específicas.
>
> Antes de programar, explicame el plan y confirmame que vas a respetar la regla de independencia estricta del documento 10: cada aula SOLO con su contenido, cada tutor SOLO su pilar, progresos completamente separados. Esperá mi OK.
>
> Alcance (Bloque 1 de cada aula, igual que hicimos con Piano):
> 1. **Guitarra** (tutor: Maestro Ritmo): los ejercicios interactivos usan detección de pitch por micrófono en vez de teclado virtual. Pedí permiso de micrófono solo cuando el ejercicio lo necesita, nunca antes. Aceptamos que la detección tiene margen de error — el feedback debe ser orientativo y amable, no un juez implacable.
> 2. **Canto** (tutora: Maestra Resonancia): también pitch por micrófono. Atención: el ejercicio "La Mirada Periférica" NO tiene video — usa la guía de texto que está en canto/curriculum.md, es intencional.
> 3. **Teoría Musical** (tutor: Profesor Harmónico): sin micrófono ni teclado — quizzes interactivos, construcción de acordes en pantalla, y los dictados musicales generados en vivo con Web Audio API como define la especificación.
> 4. Los 4 troncos de la home ahora sí enlazan cada uno a su aula.
> 5. Cada aula con su propio progreso independiente en Supabase (verificá que avanzar en una NO mueve la barra de otra).
>
> Al terminar: pruebas manuales por aula, incluyendo una prueba cruzada: preguntarle al tutor de Guitarra algo de canto y verificar que redirige a su propio pilar.

**✅ Tu verificación:**
- [ ] Las 4 aulas abren desde sus troncos en la home.
- [ ] Guitarra/Canto: el navegador te pidió permiso de micrófono recién al abrir un ejercicio que lo usa; tocaste/cantaste una nota y el sistema reaccionó.
- [ ] Teoría: hiciste un quiz y un dictado con audio generado en vivo.
- [ ] Avanzaste ejercicios en Guitarra → la barra de Piano NO se movió (independencia real).
- [ ] Le preguntaste al Maestro Ritmo (guitarra) algo de técnica vocal → te redirigió a su pilar.
- [ ] Como autor: contenido de cada aula fiel a su curriculum.md, sin mezclas.
- [ ] Commit hecho.

---

## PROMPT 7 — Fase 7: La capa visual inmersiva ("El Bosque Inversivo" completo)

> Fase 7: la piel final del bosque. Recién ahora, con todo funcionando abajo, construimos la belleza inmersiva.
>
> Antes de programar, releé la sección 5 de `03-especificacion-diseno-bosque.md` (el modelo híbrido con las 3 referencias) y explicame el plan. Esperá mi OK.
>
> Alcance:
> 1. Parallax 2D liviano en el scroll de la home (capas de profundidad, técnica de Rainforest Foods — Pixi.js o similar), NO geometría 3D corriendo todo el tiempo.
> 2. 1 o 2 detalles "vivos" puntuales (un animal/elemento que reacciona al hover), no fauna animada constante.
> 3. El momento de entrada de mayor fidelidad (efecto al tocar "Despertar el bosque 🌿") — si esto compromete el rendimiento, preferí una versión más simple que funcione fluida antes que una ambiciosa que trabe.
> 4. Transiciones suaves al entrar a las aulas (1.2–1.5s, con fade-out del sonido), respetando prefers-reduced-motion.
> 5. Pasada completa de optimización mobile: la home tiene que cargar rápido y scrollear fluido en un celular común, no solo en tu computadora.
>
> Regla de esta fase: cada efecto visual que agregues, primero medí que no rompa el rendimiento. La inmersión nunca puede costarle la experiencia al alumno con un celular modesto.
>
> Al terminar: decime cómo verificar el rendimiento en mi propio celular, y qué debería sentir un visitante nuevo al entrar.

**✅ Tu verificación:**
- [ ] En TU celular (no solo la compu): la home carga en pocos segundos y el scroll es fluido, sin trabarse.
- [ ] El parallax se siente vivo pero no marea; el detalle "vivo" reacciona al pasar el mouse/dedo.
- [ ] Activaste "reducir movimiento" en tu sistema → las animaciones se apagan o reducen.
- [ ] El conjunto transmite lo que soñaste: entrar a un bosque que enseña música. Si algo no te emociona, decíselo con precisión (qué sección, qué esperabas sentir, qué sentiste).
- [ ] Commit hecho.

---

## PROMPT 8 — El despliegue (ponerlo online)

> Quiero poner el sitio online en una URL real. Todavía con las credenciales de PRUEBA de Mercado Pago (nada de pagos reales aún). Explicame las opciones de hosting recomendadas para este stack (Next.js + Supabase), cuál me conviene para arrancar y por qué, cuánto cuesta cada una, y guiame paso a paso en el despliegue. Después del despliegue, dame un checklist de verificación de que todo funciona igual online que en local.

**✅ Tu verificación:**
- [ ] El sitio abre desde la URL pública en tu celular Y en el de otra persona (pedíselo a alguien).
- [ ] Registro, login, y una compra de prueba funcionan online.
- [ ] Los tutores de IA responden online.
- [ ] ⚠️ Recordatorio: antes de cambiar a credenciales REALES de Mercado Pago, es el momento de la revisión de seguridad externa (pagos + acceso + datos de menores).

---

## PLANTILLA DE REPORTE DE ERROR (usala SIEMPRE que algo falle)

Copiá esto y completalo — cuanto más precisa la información, mejor y más rápido el arreglo:

> Encontré un problema. Te detallo:
> 1. **Qué hice, paso por paso:** (ej.: "me logueé, entré al aula de Piano, abrí el ejercicio 1.B, toqué las teclas do-re-mi")
> 2. **Qué esperaba que pasara:** (ej.: "que me marcara las notas como correctas")
> 3. **Qué pasó en realidad:** (ej.: "la pantalla quedó congelada y no hubo feedback")
> 4. **Dónde y con qué:** (navegador y dispositivo, ej.: "Chrome en mi notebook Windows" / "Chrome en mi celular")
> 5. **¿Puedo repetirlo?** (¿pasa siempre o pasó una sola vez?)
>
> Antes de tocar código: explicame cuál creés que es la causa y qué vas a cambiar. Si el arreglo toca algo que ya funcionaba, avisame para volver a probar esa parte también.

---

## LAS 7 REGLAS DE ORO (releelas cuando dudes)

1. **Un prompt por vez.** Nunca dos fases juntas, nunca "y de paso también...".
2. **Plan antes que código.** Si no entendés el plan, preguntá antes del OK. No hay preguntas tontas — vos sos el dueño del edificio.
3. **Verificá todo vos mismo.** "Claude Code dice que funciona" no es verificación. Tus manos en el navegador, cada checklist completo.
4. **Commit después de cada logro.** Es tu seguro contra derrumbes. Si Claude Code no lo menciona, pedíselo: "¿hiciste commit de esto?"
5. **Reportá errores con la plantilla.** "No anda" alarga el arreglo; la precisión lo acorta.
6. **No aceptes cambios de alcance silenciosos.** Si Claude Code propone algo distinto a la especificación, la respuesta es: "¿Eso contradice los documentos? Si sí, ¿por qué lo proponés?" A veces tendrá razón — pero que lo justifique.
7. **La sesión de mañana no recuerda la de hoy.** Al empezar cada sesión nueva de Claude Code, arrancá con: "Leé `09-kickoff-claude-code.md` y `10-modelo-de-contenido-y-progresion.md`, mirá el estado del código y los commits, decime en qué fase estamos y qué falta, y esperá mis instrucciones." Los documentos y el git son la memoria del proyecto, no la conversación.

---

*Este guion cubre el camino completo del MVP. Las cosas que quedaron explícitamente para después (login con Google, Web MIDI por hardware, compra real de paquetes de mensajes, carga de tus videos reales, la app móvil) se piden igual que todo lo demás: una por vez, con plan primero, y verificación tuya al final.*

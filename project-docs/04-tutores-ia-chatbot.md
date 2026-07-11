# Teclas Jade — Ecosistema de Tutores de IA por Aula

> Base: tu propio diseño (arquitectura en capas, roadmap de MVP en 3 fases, los 4 system prompts). Se mantiene casi todo tal cual porque está bien pensado. Se agregan 2 correcciones técnicas y 1 bloque de seguridad que faltaba, marcadas explícitamente.

## Confirmado con vos
- Sí se construye (no se descarta por costo/complejidad).
- Arquitectura en 3 capas: Cerebro (LLM + tu contenido) / Interfaz (chat enriquecido) / Herramientas técnicas (audio, notación).
- Roadmap de MVP: **Fase 1 — un solo tutor (texto)** antes que los 4 a la vez. Esto es exactamente lo correcto para no abrumarte ni disparar el costo antes de validar que funciona. Mantené este orden, no lo saltees por ansiedad de lanzar todo junto.

## [CORRECCIÓN 1] — Reemplazar el patrón `[TRIGGER_AUDIO: ...]` por function calling real

Tu diseño original le pide al modelo que escriba un texto mágico entre corchetes (ej. `[TRIGGER_DICTADO: ID_EJERCICIO_01]`) que el frontend después parsea. Funciona, pero es fràgil: el modelo puede escribirlo con variaciones (mayúsculas, espacios, formato levemente distinto) y romper el parseo, y no hay forma de validar la estructura antes de ejecutar.

**Alternativa recomendada:** los proveedores de IA actuales (Claude, y equivalentes de otros proveedores) tienen **tool calling / function calling** nativo: le declarás al modelo un catálogo de funciones disponibles con un esquema estricto (ej. `reproducir_dictado(id_ejercicio: string, tonalidad: string, tempo: number)`), y el modelo devuelve una llamada estructurada y validada en vez de texto libre que hay que interpretar. Esto es más confiable, más fácil de debuggear, y es el estándar actual para este tipo de integración — dejale esta instrucción explícita a Claude Code cuando construya la lógica del backend de los tutores.

## [CORRECCIÓN 2] — Guardrails de seguridad (obligatorio, porque hay menores en la audiencia)

Tu propio temario incluye contenido "para niños/as sin conocimientos previos" (Fase 1 / Bloque I de cada instrumento). Un chatbot de IA abierto conversando con menores necesita reglas explícitas que tu diseño original no tenía. Agregá este bloque a los 4 system prompts, sin excepción:

```
[REGLAS DE SEGURIDAD — OBLIGATORIAS]
1. Nunca solicites ni almacenes datos personales del estudiante (apellido completo, dirección, teléfono, redes sociales, ubicación, fotos) más allá de lo estrictamente necesario para el ejercicio musical.
2. Si el estudiante se desvía del tema musical hacia contenido personal, emocional sensible, o cualquier tema no pedagógico, redirigí amablemente la conversación de vuelta al aprendizaje musical. No improvises consejos fuera de tu especialidad (salud mental, médica, legal, etc.).
3. Si detectás señales de angustia, autolesión, o una situación de riesgo, no la ignores ni la minimices: respondé con cuidado y sugerí que hable con un adulto de confianza o un profesional — no intentes resolverlo vos como tutor de música.
4. Mantené siempre un tono apropiado para todas las edades. Nunca uses lenguaje, humor o ejemplos que no sean apropiados para un estudiante menor de edad.
5. No emitas juicios sobre el cuerpo, la apariencia o la salud del estudiante más allá de lo estrictamente técnico-vocal/postural ya definido en tu rol.
```

Además, a nivel de producto (no de prompt): si vas a tener usuarios menores de edad con cuenta propia, conviene que la suscripción y el acceso a la cuenta lo gestione un adulto responsable (registro con email de un padre/tutor, no del niño), y que quede claro en tus términos de uso que las conversaciones con los tutores de IA pueden ser revisadas/registradas para seguridad. Esto es una decisión de producto que te recomiendo cerrar con Claude Code antes de lanzar, no soy quien deba decidirlo por vos, pero si no lo definís ahora se vuelve mucho más difícil de agregar después.

### Borrador de cláusula para tus Términos de Uso (para que lo revises, no es texto legal definitivo)

> "El acceso de estudiantes menores de 18 años a Teclas Jade debe ser gestionado por un padre, madre o tutor responsable, quien crea y administra la cuenta de suscripción. Los tutores de inteligencia artificial de la plataforma están diseñados exclusivamente para acompañamiento pedagógico musical y no reemplazan la supervisión de un adulto. Las conversaciones con los tutores de IA pueden almacenarse con fines de seguridad y mejora del servicio. Ante cualquier señal de malestar emocional o situación de riesgo detectada en una conversación, Teclas Jade recomendará al estudiante buscar apoyo de un adulto de confianza o un profesional, sin sustituir dicho apoyo."

[Suponiendo] Esto es un borrador de referencia, no asesoramiento legal — antes de publicarlo como términos de uso reales, sobre todo si vas a procesar datos de menores, convendría que lo revise alguien con conocimiento legal en Argentina (protección de datos personales, Ley 25.326).

## Estimación de costo real (para definir tu presupuesto y el tope de mensajes)

[Seguro] Precios oficiales actuales de la API de Anthropic (Claude), confirmados en la [documentación oficial de pricing](https://platform.claude.com/docs/en/about-claude/pricing):

| Modelo | Input (por millón de tokens) | Output (por millón de tokens) |
|---|---|---|
| Claude Haiku 4.5 | $1 | $5 |
| Claude Sonnet 5 (precio introductorio hasta 31/08/2026) | $2 | $10 |
| Claude Opus 4.8 | $5 | $25 |

[Suponiendo] Estimación de costo por alumno activo (asumiendo un system prompt + contexto de curriculum de ~1500 tokens, y una sesión típica de ~20 intercambios, con el historial de conversación creciendo dentro de la sesión — esto es una aproximación, no una medición real):

- Con **Haiku** (recomendado para arrancar, es el más barato y alcanza perfectamente para un tutor con reglas claras): entre **US$1 y US$3 por alumno activo al mes**, dependiendo de cuánto chatee.
- Con **Sonnet** (mejor calidad de conversación, más caro): entre **US$5 y US$10 por alumno activo al mes**.

Esto es manejable frente a una suscripción mensual (vos definís el precio final), pero confirma que necesitás un tope de mensajes por plan — si no lo ponés, un alumno muy conversador puede costarte más de lo que paga. Para el MVP (Fase 1, un solo tutor), arrancar con Haiku es la opción responsable: barata, y suficiente para un tutor con reglas y formato bien definidos como los tuyos.

## Nota de costo (para tu modelo de negocio)

4 tutores de IA con conversación en vivo significan costo variable de API por cada mensaje que un alumno envía — no es un costo fijo, escala con el uso real. Esto afecta directamente si tu suscripción mensual alcanza para cubrir el costo, sobre todo si algún alumno charla mucho con el tutor.

## Límite de mensajes por alumno — DECIDIDO (actualizado 10/07: 300 → 400/mes)

**400 mensajes por mes por alumno**, incluidos en la suscripción de AR$14.900/mes, como bolsa mensual compartida entre los tutores que estén activos (no un tope rígido por día) — así un alumno puede concentrar el uso en una semana de práctica intensa sin quedar bloqueado a mitad de mes.

<details><summary>Cálculo original (300 mensajes, con el precio viejo de AR$9.900) — para referencia histórica</summary>

Con Haiku, un intercambio típico cuesta ~US$0,004-0,005 (según la tabla de precios de arriba). Con el precio de lanzamiento original de AR$9.900/mes (~US$6,60), destinar ~20% de esa suscripción al costo de IA daba un presupuesto de ~US$1,30/alumno/mes, que a ese costo por mensaje equivale a ~260-300 intercambios — de ahí el número original.

</details>

**[Seguro] Decisión final (10/07):** con el precio nuevo de AR$14.900/mes, elegiste subir el límite a **400 mensajes/mes** — queda dentro del rango de ~400-500 que el margen del 20% permite, así que el presupuesto de IA por alumno (~US$1,99/mes) sigue cubriendo el costo con margen de sobra.

### Seguimiento de consumo para el alumno — DECIDIDO (10/07)

Pediste que el alumno tenga visibilidad clara de cuánto lleva consumido, no solo un corte al final. Sistema de notificaciones:

- **Cada 100 mensajes consumidos** (100, 200, 300): notificación tipo "Llevás {consumidos} de 400 mensajes este mes."
- **Cuando quedan 50 o menos** (a partir de 350 consumidos): notificación distinta y más visible — "Te quedan 50 mensajes este mes" — con un link directo al botón de "Comprar más mensajes" (ver abajo), para que la solución esté a un clic cuando el alumno la necesita, no que tenga que ir a buscarla.
- Técnicamente esto requiere una tabla/contador en Supabase, ej. `uso_mensajes_ia (user_id, mes, mensajes_consumidos)`, que se resetea a 0 cada nuevo mes de suscripción y se incrementa en cada intercambio con cualquiera de los 4 tutores (es la misma "bolsa compartida" ya decidida).

### Compra de mensajes adicionales — DECIDIDO (confirmado 10/07)

**[Seguro] Confirmado por vos:** el paquete de AR$4.900 era por **100 mensajes**, no 10 — era un error de tipeo, tal como se sospechaba más abajo. Corregido en la tabla. Se mantiene el historial de por qué se detectó el problema, como referencia.

Pediste agregar un botón tipo "Compra más mensajes para seguir chateando" (mismo lugar/jerarquía visual que el botón de suscripción), con paquetes adicionales. Tu propuesta de precios fue:

- AR$14.900 → 400 mensajes
- AR$10.900 → 300 mensajes
- AR$7.900 → 200 mensajes
- AR$4.900 → **10** mensajes

**[Seguro] Antes de nada, esto no se puede lanzar así — hay un número que rompe toda la lógica de precio.** Los primeros 3 paquetes cuestan entre AR$36 y AR$40 por mensaje (consistente entre sí). El cuarto cuesta **AR$490 por mensaje** — 13 veces más caro que los otros tres, y ~70 veces el costo real de IA por mensaje (~AR$6-7,50). No es un matiz de precio, es una ruptura total del patrón, y si un alumno lo nota (es fácil notarlo, alcanza con dividir) va a sentir que se le está cobrando de más a propósito en el paquete más chico, justo cuando menos plata tiene para gastar. **[Probable] Mi sospecha es que es un error de tipeo** — "10 mensajes" probablemente debería ser **"100 mensajes"**, lo que da AR$49/mensaje: encaja perfecto como el escalón más caro de una curva descendente coherente (100→AR$49, 200→AR$39,50, 300→AR$36,33, 400→AR$37,25).

**No estoy de acuerdo con lanzar la tabla tal como la escribiste porque** un paquete con precio por mensaje 13 veces más alto que el resto es, en la práctica, indistinguible de un error de carga de precios para cualquier alumno que haga la cuenta — y en un producto que se apoya en confianza pedagógica, eso cuesta más caro en reputación que lo que genera en ingresos. **Esto es lo que haría en su lugar:** confirmame si "10 mensajes" era un error de tipeo y debía decir "100 mensajes" (mi apuesta más probable), o si es un precio real e intencional (por ejemplo, un paquete de emergencia carísimo a propósito, para desalentar su uso salvo urgencia real) — en ese caso lo dejamos así, pero como decisión explícita, no por accidente. **El riesgo de no corregirlo:** el alumno que menos plata tiene para gastar en el momento (el que compra el paquete más chico) termina pagando el peor precio por mensaje — además de ser mala praxis de producto, es el tipo de detalle que un alumno comenta como queja a otros ("esto es un curro") en vez de recomendar la plataforma.

Paquetes confirmados:

| Paquete | Precio | Mensajes | AR$/mensaje |
|---|---|---|---|
| Chico | AR$4.900 | 100 | ~AR$49 |
| Mediano | AR$7.900 | 200 | ~AR$39,50 |
| Grande | AR$10.900 | 300 | ~AR$36,33 |
| Extra grande | AR$14.900 | 400 | ~AR$37,25 |

**Texto del botón:** `Comprar más mensajes para seguir chateando` (tu propuesta, aprobada tal cual — es clara y no necesita ajuste).

## Los 4 tutores (con el bloque de seguridad ya insertado)

### 🎹 Maestro Allegro — Tutor de Piano
```
Actúa como "Maestro Allegro", un tutor de piano clásico y moderno de nivel profesional, pedagogo experto y mentor paciente. Tu objetivo es guiar al estudiante en técnica, lectura, postura y digitación.

[REGLAS DE INTERACCIÓN]
1. Sé estructurado, preciso y técnico, pero motivador.
2. Cada vez que expliques un ejercicio, DEBES incluir la digitación exacta para ambas manos si aplica (M.D. = Mano Derecha, M.I. = Mano Izquierda), utilizando los números del 1 (pulgar) al 5 (meñique).
3. Si el usuario te pide un ejercicio práctico, proporciónalo en formato de bloque de texto o código utilizando la nomenclatura de notas (Do, Re, Mi... o C, D, E... según prefiera el usuario).

[FORMATO DE EJERCICIOS]
- Ejercicio: [Nombre]
- Objetivo: [Foco técnico, ej: Independencia de dedos]
- M.D: [Notas con número de dedo, ej: Do(1) - Re(2) - Mi(3)]
- M.I: [Ej: Do(5) - Sol(1)]

[RESTRICCIONES]
- No satures al alumno con teoría avanzada si está en un nivel básico.
- Si el alumno no entiende, desglosa el ejercicio a "manos separadas" o reduce el tempo (bpm).

[REGLAS DE SEGURIDAD — OBLIGATORIAS]
(ver bloque común arriba)
```

### 🎸 Corda — Tutor de Guitarra
```
Actúa como "Corda", un guitarrista profesional y profesor de guitarra (acústica y eléctrica). Eres experto en ergonomía, mecanismos de púa/dedos, armonía aplicada al diapasón y lectura de tablaturas.

[REGLAS DE INTERACCIÓN]
1. Tu tono es cercano, de "estudio de grabación", moderno y práctico.
2. Al explicar ejercicios de mano izquierda, especifica los dedos: 1 (Índice), 2 (Medio), 3 (Anular), 4 (Meñique).
3. Al explicar mano derecha, especifica la técnica: púa hacia abajo (↓), púa hacia arriba (↑), o dedos (p, i, m, a).

[FORMATO DE TABLATURA]
Dibujala en bloque de código con formato ASCII estándar, acompañada siempre de la explicación de digitación debajo.

[RESTRICCIONES]
- Advertí siempre sobre la tensión en muñeca y pulgar posterior.
- No asumas que el alumno conoce la cejilla; ofrecé alternativas simplificadas para principiantes.

[REGLAS DE SEGURIDAD — OBLIGATORIAS]
(ver bloque común arriba)
```

### 🎤 Voz Intellecta — Tutor de Canto
```
Actúa como "Voz Intellecta", un entrenador vocal de élite, experto en pedagogía del canto, anatomía funcional de la voz y salud vocal. Te regís por un plan de Madurez Lineal (Macroarquitectura), asegurando que el alumno domine el cuerpo antes de exigirle rendimiento.

[REGLAS DE INTERACCIÓN]
1. Tono empático, consciente del cuerpo, cuidadoso. Usá analogías cotidianas sobre sensaciones físicas (ej. "el bostezo", "la flotabilidad").
2. Priorizá siempre la tríada: Postura/Alineación -> Respiración/Apoyo -> Emisión/Resonancia.
3. Para vocalizaciones en vivo, guiá paso a paso indicando patrón de notas y fonema.

[FORMATO DE VOCALIZACIÓN EN VIVO]
- Fase actual del alumno: [Ej. Bloque 1: Coordinación Básica]
- Fonema/Patrón: [Ej. "Mmm" o "Gug"]
- Dirección: [Ej. Arpegio mayor de 3 notas: Do-Mi-Sol-Mi-Do. Sube por semitonos]
- Llamada a función de audio: usar function calling (ver Corrección 1), no un token de texto libre.

[RESTRICCIONES]
- Prohibido pedir belting o distorsiones si el alumno reporta fatiga o es principiante.
- Insistí siempre en el calentamiento previo.

[REGLAS DE SEGURIDAD — OBLIGATORIAS]
(ver bloque común arriba — particularmente relevante acá: nunca dar diagnóstico médico ante dolor/molestia real, derivar a un otorrino/fonoaudiólogo).
```

### 🎼 Logos — Tutor de Teoría Musical
```
Actúa como "Logos", el analista y tutor de teoría musical, armonía y entrenamiento auditivo. Sos metódico, preciso, lógico y apasionado de la estructura de la música.

[REGLAS DE INTERACCIÓN]
1. Tono académico pero claro, con desgloses matemáticos/geométricos si hace falta.
2. Sos el encargado de los "Dictados Musicales en Vivo".

[MECÁNICA DE DICTADOS EN VIVO]
1. Anunciá el nivel (ej: dictado rítmico-melódico, 4 compases, 4/4, Do Mayor).
2. Disparar la reproducción vía function calling (ver Corrección 1), no un token de texto libre.
3. Pedile al alumno su respuesta (notas o cifrado).
4. Evaluá con precisión, explicando errores intervalo por intervalo.

[RESTRICCIONES]
- Nunca reveles la solución antes de que el alumno intente responder al menos dos veces.
- Mantené nomenclatura estándar de intervalos.

[REGLAS DE SEGURIDAD — OBLIGATORIAS]
(ver bloque común arriba)
```

## [CORRECCIÓN 3] — DECISIÓN FINAL, CERRADA: Cómo reacciona el sistema cuando el alumno pide "mostrame cómo se toca [pieza X]"

Tu ejemplo concreto: un alumno le pide a Maestro Allegro "muéstrame cómo se toca el Hanon, El Pianista Virtuoso, N°2". Esto no es solo una pregunta técnica — toca un punto donde tu diseño original tiene un riesgo real que hay que corregir antes de que Claude Code lo construya mal.

**El riesgo que hay que evitar:** un LLM (incluso Claude) puede "alucinar" notación musical — inventar notas, compases o digitación para una pieza real que no coinciden con la partitura original, sobre todo si se le pide que la "recuerde" y la escriba de memoria en el momento. Para un ejercicio inventado por el propio tutor (un dictado, un patrón nuevo) esto no importa porque no existe un "original" contra el cual estar mal. Pero para una pieza real y conocida como el Hanon N°2, si el sistema inventa la partitura en vez de reproducir la real, el alumno aprende mal un ejercicio técnico de memoria muscular — el peor lugar posible para tener un error.

**Cómo tiene que funcionar en la práctica (arquitectura de 2 caminos, no 1):**

1. **Camino A — Repertorio real y catalogado** (Hanon, Czerny, Bach, cualquier pieza de `05-clasificacion-derechos-autor-libros.md` marcada `[DOMINIO PÚBLICO]`, y también los ejercicios propios de tus `curriculum.md`): estas piezas se **codifican UNA SOLA VEZ, de antemano, en formato MusicXML o ABC**, y se guardan en una base de datos/catálogo del sitio (no las genera el LLM cada vez). Cuando el alumno pide "mostrame el Hanon N°2", el tutor NO escribe la partitura de memoria — usa **function calling** para llamar algo como `mostrar_partitura(id: "hanon_op1_no2")`, el frontend busca ese archivo ya codificado en el catálogo, y AlphaTab/OSMD lo renderiza tal cual es la partitura real. La reproducción de audio (Web Audio API/sintetizador MIDI) toca exactamente esas notas del archivo, no una improvisación. La digitación (los números 1-5) también viene incluida en el archivo codificado, no la inventa el LLM en el momento.
   - **[Probable] Atajo real para no transcribir todo a mano:** como el Hanon completo es de dominio público hace más de un siglo, es muy probable que ya existan versiones MusicXML/MIDI gratuitas y confiables en [IMSLP](https://imslp.org/) o en la librería pública de MuseScore — antes de transcribir manualmente los 60 ejercicios, vale la pena que Claude Code busque si ya existen esos archivos listos para usar. Lo mismo aplica a Czerny, Bach, Chopin y el resto de tu lista `[DOMINIO PÚBLICO]`.
   - Esto es trabajo real de producción (aunque se ahorre con los archivos de IMSLP): alguien tiene que armar ese catálogo antes del lanzamiento. No pasa solo.
2. **Camino B — Ejercicio nuevo generado por el tutor** (un dictado armónico inventado en el momento, un patrón de digitación que el tutor arma para ese alumno específico): acá sí el LLM genera la notación en vivo vía function calling (`generar_ejercicio(...)`), porque no existe un "original" con el que pueda estar en desacuerdo — es contenido nuevo, no una transcripción de algo real.

**Regla explícita para los 4 system prompts (agregar a las restricciones de los 4 tutores):** si un alumno pide una pieza real que no está en el catálogo codificado, el tutor debe decir honestamente que todavía no la tiene digitalizada, nunca inventarla de memoria como si fuera exacta.

**Sobre postura e interpretación (lo que ni el audio ni la partitura pueden mostrar):** digitación y notas se resuelven con partitura + audio como se explicó arriba. Postura corporal, tensión de la muñeca, "cómo se siente" el movimiento — eso requiere ver un cuerpo humano, y ningún LLM ni sintetizador lo reemplaza. Para esto seguí valiendo lo ya decidido en `02-assets-faltantes.md`: video pregrabado tuyo, priorizado por el Bloque 1 de cada aula primero. Si un alumno pide postura de una pieza que todavía no tiene video (como un ejercicio específico de Hanon), el tutor debe dar la explicación en texto (ya tiene reglas de formato para esto) y ser honesto en que el video de esa pieza puntual todavía no existe, en vez de fingir que puede "mostrar" algo que no tiene.

**Caso real ya aplicado — Canto, "La Mirada Periférica Desfocalizada":** este ejercicio se queda sin video (decisión del 09/07, ver `06-guia-grabacion-videos.md`) y pasa a usar exactamente esta regla de fallback: Voz Intellecta lo explica en texto (mirada abierta hacia un punto fijo, sin fijar la vista ni cerrar los ojos, cejas relajadas) y es honesto en que todavía no hay un video de referencia para este ejercicio puntual — no se elimina el ejercicio, se degrada a texto.

**Prioridad de armado del catálogo (para no bloquear el lanzamiento):** primero se codifican los ejercicios propios de tus `curriculum.md` (son los que sí o sí necesita el MVP), y recién después se suma el repertorio de terceros en dominio público (Hanon, Czerny, etc.) como "biblioteca extra" — esto puede sumarse en paralelo al desarrollo, no bloquea nada.

## [DECIDIDO] Botón de "Reportar un error" en cada chatbot

Va en los 4 tutores, sin excepción — un botón/ícono fijo en la interfaz de chat (ej. una banderita 🚩 al lado de cada respuesta del tutor, o un botón fijo "Reportar error" en la consola). Al apretarlo, el sistema le hace al alumno una serie corta de preguntas guiadas — no un cuadro de texto en blanco, porque un cuadro vacío genera reportes vagos e inútiles ("no funciona"). La secuencia:

1. **Tipo de error** (opción múltiple, no texto libre): `Audio no suena` / `La partitura o tablatura se ve mal` / `El tutor no entendió lo que le pedí` / `La respuesta tiene información incorrecta` / `Algo de la pantalla no funciona` / `Otro`.
2. **Descripción corta en sus palabras**: "¿Qué esperabas que pasara, y qué pasó en cambio?" (acá sí texto libre, pero ya acotado por la pregunta).
3. Nada más se le pregunta al alumno — el resto se captura solo, automáticamente, sin pedírselo:
   - Qué tutor era (Piano/Guitarra/Canto/Teoría).
   - En qué bloque/ejercicio estaba (o qué pieza pidió, si aplica el catálogo de partituras).
   - Los últimos 5-6 mensajes de la conversación (así vos ves el contexto real del error sin que el alumno tenga que copiar/pegar nada — pedirle eso agrega fricción y la mayoría no lo hace bien).
   - Fecha y hora.

**Dónde se guarda:** una tabla nueva en Supabase, `reportes_error`, con al menos `id, user_id, tutor, tipo_error, contexto_conversacion (json), bloque_o_ejercicio, descripcion_alumno, estado (nuevo/revisado/resuelto), created_at`. Con esto tenés, desde el día 1, una base de datos real de errores reportados por los propios alumnos para ir priorizando qué corregir primero — no hace falta ningún panel sofisticado al principio, alcanza con mirar la tabla directo en Supabase o pedirme que te arme un resumen cuando el sitio ya esté en producción.

## [DECIDIDO 10/07] Comportamiento y personalización del tutor dentro del aula

Con el mecanismo de ejercicios rediseñado (teclado virtual que se toca solo, ver `10-modelo-de-contenido-y-progresion.md` sección 8 — el tutor ya no verifica nada de lo que el alumno toca), el rol del tutor dentro de cada aula queda definido así:

**Rol: guía y consultor, nunca evaluador.** La demostración de "cómo suena, con qué dedos, a qué velocidad" la hace el teclado interactivo por su cuenta — el tutor no reemplaza eso ni juzga si el alumno tocó bien o mal (eso queda 100% en la autoevaluación del propio alumno). El tutor está para lo que el teclado no puede hacer:

1. **Saluda y recuerda el nombre del alumno** entre sesiones.
2. **Ajusta el tono según la edad** — pero la edad y el nombre se cargan **en el formulario de registro** (lo completa el adulto responsable que crea la cuenta), nunca preguntados por el chatbot en la conversación. El tutor solo *lee* ese dato ya guardado en el perfil para ajustar su trato (más amable y motivador si es un niño/a); no lo sondea él mismo. Esto es coherente con la Corrección 2 de este mismo documento (acceso de menores gestionado por un adulto responsable) — pedirle la edad a un menor directamente por chat sería exponerse justo al riesgo que esa corrección buscaba evitar.
3. **Chequeo de inactividad/motivación:** si pasan varios días sin que el alumno entre, el tutor lo nota y lo motiva a retomar (mecánica de racha, ya confirmada como referencia tipo Duolingo en `10-modelo-de-contenido-y-progresion.md`).
4. **Hace preguntas de feedback conversacional** (cómo le está yendo, qué le cuesta) — información útil también para que el profesor priorice mejoras del sistema.
5. **Propone variantes o ejercicios nuevos** cuando el alumno lo pide (esto ya estaba en el diseño original como "Camino B" de la Corrección 3: generación en vivo, solo para contenido nuevo sin un "original" catalogado).
6. **Siempre enfocado en lo musical.** Si el alumno se sale del tema, redirige con la versión **cálida pero firme** ya escrita en el bloque de seguridad de este documento ("redirigí amablemente la conversación de vuelta al aprendizaje musical") — se evaluó explícitamente reemplazarla por un corte seco tipo "no puedo responder a tu pregunta" y **se descartó**: con alumnos menores de por medio, una negativa seca puede sentirse fría o grosera: se mantiene la redirección amable.

**[DECIDIDO 11/07] Identidad visual de los tutores: retrato ilustrado sí, avatar animado no (por ahora).** Cada tutor tendrá una **ilustración fija** (retrato dibujado, coherente con la estética del bosque) que aparece junto al chat — el alumno le pone cara al maestro sin animación 3D ni video sintetizado. Se evaluó y se descartó para el MVP un asistente "con rostro y cuerpo humanoide" animado: sería la funcionalidad más cara y compleja de todo el proyecto y no mejora la enseñanza (el valor pedagógico está en las respuestas, no en que mueva la boca). Queda como posible mejora premium a futuro, solo si el negocio ya funciona. Las ilustraciones pueden usar una foto del profesor como modelo/molde, con dos condiciones: (a) **estilización clara** — deben leerse como personaje ilustrado, no como retrato fotorrealista del profesor, para que ningún alumno o padre crea que chatea con el profesor humano real; (b) **[RESUELTO 11/07]** solo **Maestro Allegro (Piano)** se basa en el profesor (la foto que pasó como modelo); los otros tres son **personajes propios, completamente distintos**.

**Reparto de los 4 tutores (decidido 11/07):**

| Aula | Tutor | Género | Base visual |
|---|---|---|---|
| Piano | Maestro Allegro | Hombre | Basado en el profesor (foto modelo), estilizado como personaje |
| Guitarra | Maestro Ritmo | Hombre | Personaje propio, distinto del profesor |
| Canto | Maestra Resonancia | Mujer | Personaje propio |
| Teoría Musical | Profesor(a) Harmónico | Mujer | Personaje propio |

- **2 hombres (Piano, Guitarra) y 2 mujeres (Canto, Teoría Musical).**
- **Diversidad explícita:** los cuatro deben variar entre sí en tono de piel, rasgos y descendencia — NO cuatro personas rubias de ojos claros. La idea es que distintos alumnos puedan verse reflejados en distintos maestros. Solo Allegro hereda la fisonomía del profesor; los otros tres se diseñan buscando esa variedad.
- Nota: "Profesor Harmónico" figura con nombre masculino en versiones anteriores del doc; con esta decisión el tutor de Teoría es mujer — ajustar el nombre/artículo del personaje cuando se defina (ej. "Profesora Harmónica" o un nombre nuevo) antes de generar la ilustración.

**Regla explícita de diseño — NO optimizar para consumo de mensajes.** Se evaluó y se descartó diseñar al tutor para generar más diálogo con el objetivo de que el alumno consuma más mensajes de su bolsa mensual. Hay una diferencia real entre "el tutor motiva genuinamente y de paso consume más mensajes como efecto secundario" (aceptable, es el mismo efecto que el recordatorio de racha de Duolingo) y "diseñar al tutor para que hable de más a propósito, para vaciarle la bolsa de mensajes al alumno" (patrón oscuro, descartado). Los puntos 1 a 6 de arriba se construyen porque son buena pedagogía — no se ajustan ni se miden para maximizar mensajes consumidos. Si de rebote el uso sube por una motivación genuina, bienvenido, pero nunca es el objetivo de diseño.

## Herramientas técnicas mencionadas en tu diseño (confirmadas como reales y vigentes)
- **AlphaTab / OSMD**: renderizado de partituras/tablaturas interactivas en la web — existen y son opciones válidas, Claude Code puede evaluar cuál se ajusta mejor.
- **Web Audio API + sintetizador**: para generar dictados/arpegios en tiempo real sin archivos de audio pregrabados — viable, y es el mismo motor que ya recomendamos para los ejercicios `[DIGITAL-INTERACTIVO]` de los `curriculum.md`.
- **Modo de voz nativo de IA**: existe hoy en varios proveedores, pero es la funcionalidad más cara y compleja de las mencionadas — dejala para la Fase 3 de tu propio roadmap, no antes.

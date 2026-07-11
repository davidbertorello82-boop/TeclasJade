# Teclas Jade — Especificación de Diseño: "El Bosque Inversivo"

> Este documento reemplaza mi propuesta anterior de paleta (jade/carbón/crema, inspirada en teclas de piano — quedó descartada, ver `paleta-tipografia-propuesta.html` marcado como DEPRECADO). La dirección creativa de esta sección es la tuya, tal como la escribiste, con correcciones técnicas puntuales marcadas explícitamente como **[CORRECCIÓN]** donde el texto original no es implementable tal cual o tiene un riesgo real. Todo lo que no está marcado como corrección queda como lo escribiste.

## 1. Sistema de Diseño (Design Tokens) — DEFINITIVO

- **Background:** `#F7F5F0` (lino/hueso)
- **Primary (Jade):** `#2C5E43` / `#3B7A57`
- **Secondary (Tierra):** `#8B5A2B` / `#A0522D`
- **Text:** `#1A2421`
- **Highlight:** `#E6DFD3` / `#D4AF37`
- **Tipografía títulos/poética:** Playfair Display, Cormorant Garamond o Lora
- **Tipografía interfaz/ejercicios:** Inter o Montserrat
- **Line-height:** 1.4–1.6 en textos largos
- **Layout:** whitespace generoso, alineaciones descentradas

## 2. Pantalla Principal: "El Bosque Inversivo"

Estructura de scroll longitudinal tal como la definiste: Hero → Bio → Descripción de plataforma → "El Claro de los Troncos" (Canto / Guitarra / Piano / Teoría) → Cierre comercial (suscripción, contacto).

### 2.A Audio e interacción ASMR — **[CORRECCIÓN]**

Texto original: sonido de bosque que arranca solo al cargar el sitio, y que cambia con el movimiento del mouse.

**Por qué se corrige:** los navegadores (Chrome, Firefox, Safari) bloquean el autoplay de audio con sonido hasta que hay una interacción explícita del usuario — no es negociable a nivel de diseño, es una política del navegador ([Chrome for Developers](https://developer.chrome.com/blog/web-audio-autoplay), [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)). Además, el sonido ambiental continuo puede competir con el entrenamiento auditivo real (afinación, dictados) que es el corazón del producto.

**Versión corregida:**
- El sitio carga en silencio. Un gesto de entrada explícito (ej. botón "Entrar al bosque 🌿" en el Hero) dispara el primer sonido — esto además resuelve la restricción del navegador de una sola vez.
- El audio ASMR (mouse, hover) vive **solo** en las zonas de marca/exploración (Hero, Bio, "Claro de los Troncos"). Nunca dentro de un aula.
- Dentro de cualquier aula: silencio total automático (esto ya estaba bien definido en la sección 4.B del documento original, "Aislamiento Acústico" — se mantiene tal cual).
- Botón de mute flotante: se mantiene como estaba especificado.

**Referencia real de que esto funciona a nivel profesional:** [Rainforest Foods, de Immersive Garden](https://www.awwwards.com/case-study-rainforest-foods-by-immersive-garden.html) — sitio premiado, tema 100% naturaleza, sonido diseñado a medida, para audiencia adulta. Dato técnico clave: usaron Pixi.js (motor 2D) con parallax en vez de video o 3D real, específicamente para no sacrificar rendimiento, y armaron una experiencia mobile dedicada aparte. Esa es la técnica recomendada para los "troncos" y el efecto de bosque — no geometría 3D pesada.

### 2.B "El Claro de los Troncos" (menú de aulas)

Se mantiene tal cual: 4 troncos (Canto, Guitarra, Piano, Teoría), tipografía serif, hover flotante sutil.

## 3. Diseño de Movimiento (Motion Design)

Se mantiene: smooth/inertial scroll, transición líquida de 1.2–1.5s al entrar a un aula, fade-out del sonido ambiental antes de que cargue el aula.

**[CORRECCIÓN — adición, no reemplazo]:** falta respetar la preferencia de accesibilidad `prefers-reduced-motion` del sistema operativo del usuario. Quien tenga esa opción activada (por mareos, migrañas, o sensibilidad al movimiento) debe recibir automáticamente transiciones instantáneas o muy reducidas, sin animación líquida. Esto es un estándar web (no una opinión mía) y Claude Code lo puede implementar con una simple media query CSS (`@media (prefers-reduced-motion: reduce)`).

## 4. Interfaz del Aula Virtual

Se mantiene la estética (textura de tronco, esquinas suaves, tipografía serif para instrucciones) y las 3 áreas funcionales (Avatar de IA, Consola de chat, Panel de ejercicios). El diseño del chatbot de IA en sí se movió a un documento aparte: `04-tutores-ia-chatbot.md`, porque es lo bastante grande y con sus propias implicancias de costo/seguridad como para no mezclarlo con el diseño visual.

### 4.A Diseño del interior del aula — DECIDIDO (11/07), antes de programar la Fase 4

Esta sección no existía con este nivel de detalle antes de la Fase 4. Se define ahora, antes de que Claude Code programe, para que el interior del aula no quede improvisado ni desconectado visualmente del resto del sitio.

**Principio general:** el interior del aula usa el MISMO sistema de diseño de la sección 1 (paleta, tipografías) que el resto del sitio — no es una estética nueva — pero con un tono más funcional/calmo que la experiencia poética de la home. Es un espacio de estudio, no de exploración: menos animación, más claridad.

**Paleta aplicada dentro del aula:**
- Fondo: `#F7F5F0` (lino/hueso), igual que la home.
- Jade (`#2C5E43` / `#3B7A57`): estados activos, botones primarios (Play, Confirmar), barra de progreso.
- Tierra (`#8B5A2B` / `#A0522D`): acentos secundarios, textura de tronco de los paneles/tarjetas.
- Highlight dorado (`#D4AF37`): reservado para logros — ejercicio completado ✅, racha de práctica, desbloqueo de bloque. Uso puntual, no decorativo.
- Gris/verde apagado para 🔒 bloqueado (visible pero claramente inactivo, sin competir visualmente con lo disponible).

**Mapa del Aula (vista principal):**
- Los 5 bloques se presentan como tarjetas/secciones con textura de tronco y esquinas suaves (misma estética ya definida), en orden vertical u horizontal por bloque.
- Estados visuales por ejercicio: ✅ completado (jade + check dorado), 🔓 disponible (jade, interactivo), 🔒 bloqueado (gris apagado, sin hover activo).
- Barra de progreso del aula: barra jade sobre fondo lino, arriba de la vista o fija en un header del aula.
- Racha de práctica: ícono pequeño con highlight dorado, cerca de la barra de progreso.
- Pestaña "Biblioteca" (Camino 2, reservada): mismo estilo de navegación que "Método Guiado", pero con estado vacío simple ("Próximamente") — no un candado, porque no es contenido bloqueado, es contenido que todavía no se construyó.

**Vista de ejercicio individual — 3 áreas funcionales (ya definidas en el doc original, ahora precisadas):**
1. **Avatar del tutor:** espacio reservado (placeholder por ahora, se activa en Fase 5) — el retrato ilustrado del tutor del pilar (ver `04-tutores-ia-chatbot.md`), esquina superior o lateral.
2. **Consola de chat:** espacio reservado, mismo criterio que el avatar — sin funcionalidad hasta Fase 5.
3. **Panel de ejercicios:** el teclado virtual de dos octavas (ver `10-modelo-de-contenido-y-progresion.md`, sección 8) más sus controles (Play/Pausa, Reiniciar, slider de BPM, loop — sección 8 actualizada 11/07). Teclas en tonos crema/lino con la tecla sonando resaltada en jade; número de dedo en texto oscuro sobre la tecla pintada, legible.
4. **Consigna y autoevaluación:** tipografía serif (Playfair Display / Cormorant Garamond / Lora) para el texto de la consigna, igual que el resto del sitio — la interfaz de controles (botones, slider) usa Inter/Montserrat, no serif.

**Regla de silencio (recordatorio, ya vigente):** ningún audio ambiente del bosque suena dentro del aula — la única fuente de sonido acá es el teclado virtual reproduciendo el ejercicio. Transición de entrada al aula: fade-out del sonido ambiental antes de cargar (ya definido en sección 3), y respeta `prefers-reduced-motion` igual que el resto del sitio.

**Lo que queda deliberadamente fuera de esta fase:** cualquier animación decorativa tipo paralaje/bosque dentro del aula — el interior es un espacio de estudio despojado de la ambientación poética de la home, a propósito.

### 4.B Referencias visuales del profesor — DECIDIDO (11/07)

El profesor cargó un tablero de referencias visuales (mood board) para dirigir el estilo del bosque de la home y del interior de las aulas. Reglas de uso:

**[DECIDIDO] Estas imágenes son SOLO inspiración de mood/estilo — nunca se suben directo al sitio.** El sitio es de suscripción paga; usar imágenes de terceros (varias de estas referencias tienen marca de agua o son de bancos/IA de terceros sin licencia comercial confirmada) sería infracción de copyright. El camino correcto es generar **ilustraciones originales propias** inspiradas en esta dirección de arte — mismo principio ya blindado para los libros en `05-clasificacion-derechos-autor-libros.md`.

**Sistema de troncos (Home → "El Claro de los Troncos"):** los 4 troncos que dan acceso a las aulas son **idénticos por fuera** (un solo asset reutilizado 4 veces, económico) — la diferenciación entre Piano / Guitarra / Canto / Teoría Musical vive en el interior de cada aula, no en el tronco exterior.

**Interior de cada aula (DECIDIDO — inmersión total + legibilidad garantizada):** cada aula tiene su propia ilustración de interior (cabaña dentro de un tronco, casa del árbol, refugio de piedra, etc. — 4 ambientes distintos, uno por pilar), con inmersión visual completa de fondo. Para que esto no sacrifique la claridad del material de estudio: el contenido (teclado, consignas, texto, números de dedo) vive sobre una superficie tipo **pizarrón de madera** dentro de esa escena — fondo oscuro/marrón de madera con tiza o letras/símbolos en alto contraste (blanco/crema/dorado), igual que un pizarrón real. Esto da inmersión ambiental sin nunca comprometer que el alumno lea bien lo que tiene que leer.

**Referencias de ambientación de interior (cabañas/refugios en el bosque):** troncos ahuecados con interior de cabaña, chalets de madera con hogar a leña, refugios de piedra con techo de musgo, casas del árbol (con biblioteca, con vitrales, tipo invernadero/botica), rincones de estudio con plantas y ventanales — todas comparten madera natural, luz cálida (fogatas, faroles, luz dorada de atardecer) y vegetación integrada a la estructura. Esta es la base de mood para las 4 ilustraciones de interior.

**Referencias de atmósfera del bosque exterior (para las capas de paralaje 2D de la home, sección 5):** niebla entre árboles con rayos de sol (efecto "rayos de Dios"), valle de río con neblina entre pinos — refuerzan la dirección técnica ya decidida en la sección 5 (paralaje 2D estilizado, no 3D fotorrealista).

**Referencias de fauna — "detalle vivo puntual" (mismo principio del camaleón de Rainforest Foods, sección 5):** panda comiendo bambú, ciervo en un arroyo del bosque, dos pájaros amarillos en una rama. Se usan como inspiración para 1-2 animales que reaccionan a hover/scroll en momentos puntuales de la home — nunca fauna animada todo el tiempo (ver razones de rendimiento ya explicadas en sección 5).

**Descartadas explícitamente por el profesor (no usar como referencia):** cabaña oscura con astas de ciervo en la pared, casita de cuento con puente sobre arroyo, casa de fantasía con cerezos rosados, interior de casa del árbol con tronco atravesando el medio y vitrales/hamaca.

## 5. Referencias visuales concretas para "El Bosque Inversivo" — DECIDIDO (10/07)

**[Seguro] Antes de las referencias, la verdad incómoda de por qué ninguna de las que viste te convenció:** lo que estás imaginando — perderte en un bosque virgen fotorrealista con árboles gigantes, cascadas, vegetación viva y animales moviéndose — es, en términos técnicos, contenido de nivel de videojuego AAA (piensa en un demo técnico de Unreal Engine, no en una web). Por eso ninguna agencia premiada lo hace así de literal: todas las que armaron sitios "de naturaleza" premiados (incluida Immersive Garden, los mismos del `Rainforest Foods` que ya cité en la sección 2.A) **eligieron a propósito estilización en vez de fotorrealismo** — no por falta de imaginación, sino porque vegetación/agua/fauna fotorrealista renderizada en tiempo real en un navegador (sobre todo en mobile) es un problema real de rendimiento y de presupuesto, no un detalle de estilo. No es que no buscaste bien: es que la referencia exacta que tenés en la cabeza casi no existe como sitio web funcional y liviano, porque nadie la construye así a esa escala.

**Lo que sí es viable, y cómo lograr la sensación sin el costo:** un modelo híbrido — un momento de mayor fidelidad 3D concentrado en la entrada (el gesto "Despertar el bosque"), seguido de una experiencia de scroll liviana con capas 2D en paralaje (no geometría 3D real) que simulan profundidad y vida, con 1-2 detalles "vivos" puntuales (un animal que reacciona al hover, como el camaleón de Rainforest Foods) en vez de fauna animada todo el tiempo. Esto te da la sensación de "bosque vivo" en los momentos clave, sin pagar el costo de renderizar un ecosistema completo en tiempo real.

**3 referencias concretas, cada una con un rol distinto (no las mires como "elegí una entera", sino como piezas a combinar):**

1. **[Explore Primland](https://www.awwwards.com/sites/explore-primland)** (Awwwards Site of the Day, feb. 2026) — **referencia técnica para el momento de entrada.** Terreno 3D real modelado en Blender y renderizado en WebGL, con niebla atmosférica y una cámara que se desliza sobre el paisaje al hacer scroll (así el lugar se siente "navegable", no una foto). Tiene un toggle de estaciones del año como detalle interactivo. Es paisaje de montaña, no selva densa, pero la técnica (cámara deslizándose sobre un 3D real, liviano, activado solo en un momento puntual) es exactamente lo que le daría a tu Hero esa sensación de "entrar caminando" sin cargar todo el sitio con eso.
2. **[Rainforest Foods, de Immersive Garden](https://www.awwwards.com/case-study-rainforest-foods-by-immersive-garden.html)** — ya citada en la sección 2.A, pero ahora con más detalle: **referencia técnica para el resto del scroll.** Capas de paralaje 2D (no 3D pesado), sonido ambiente disparado por gesto del usuario, y un detalle vivo puntual (un camaleón que cambia de color al interactuar) en vez de fauna animada constante. Ojo: visualmente es más poética/abstracta que literal — si esperabas selva fotorrealista ahí, por eso no te cerró del todo; tomala por la técnica, no por el estilo final.
3. **[The Law of the Jungle](https://www.awwwards.com/sites/the-law-of-the-jungle)** (Disney, campaña de *El Libro de la Selva*, 2016) — **referencia solo de ambientación/mood, no técnica.** Modelaron en 3D elementos reales de selva (árboles, ramas, flores) para recrear la sensación de "entrar en la Jungla", que es conceptualmente lo más cercano a tu idea original. **Advertencia:** tiene ~10 años, estaba integrado a Tumblr, y es muy probable que ya no funcione online — mirala en capturas/video (buscá "The Law of the Jungle Disney Jungle Book" en YouTube o en la [ficha de FWA](https://thefwa.com/cases/the-law-of-the-jungle)) como inspiración de mood, no la abras esperando que cargue.

**Recomendación final:** no busques más "el sitio perfecto que ya exista" — no lo vas a encontrar porque el estándar de la industria premiada resolvió este mismo problema (bosque inmersivo + rendimiento real) yendo hacia la estilización, no hacia el fotorrealismo. Si estás de acuerdo con el modelo híbrido de arriba, lo dejo como DECIDIDO y se lo paso a Claude Code como especificación técnica concreta.

### Respuestas directas a tus 2 preguntas

- **¿Conviene un menú principal con leves movimientos de naturaleza viva?** Sí, es viable — pero con la técnica de Rainforest Foods (paralaje 2D liviano, detalles puntuales animados) y no con geometría 3D sostenida. Hecho así, no debería entorpecer la carga inicial; hecho con 3D real corriendo todo el tiempo, sí.
- **¿La música de fondo va con botón de activar sonido?** Ya estaba decidido así en la sección 2.A de este mismo documento (gesto de entrada explícito + botón de mute flotante) — tu descripción de cómo lo imaginás coincide exactamente con lo ya definido, no hace falta cambiar nada ahí.

## 6. Directrices para Claude Code

Se mantienen las 4 directrices originales (semántica HTML5, Web Audio API con gesto de usuario, CSS con variables nativas, diseño responsivo). Se agrega una quinta:

5. **Rendimiento en mobile:** seguir el patrón de Rainforest Foods — parallax 2D optimizado (Pixi.js u otra librería 2D liviana) en vez de geometría 3D real para el efecto de "bosque", y una pasada de optimización específica para mobile antes de dar por terminada cualquier sección.

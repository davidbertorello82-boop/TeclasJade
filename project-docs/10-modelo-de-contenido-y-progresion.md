# Teclas Jade — Modelo de Contenido y Progresión del Alumno

**Estado:** DECIDIDO. Reglas de obligado cumplimiento para Claude Code.
**Fecha:** 9 de julio, 2026

> Este documento resuelve una ambigüedad crítica: **cómo se estructura el material de estudio, cómo avanza el alumno, y por qué las 4 aulas deben permanecer independientes.** Todo lo que está acá es una decisión cerrada — no reinterpretar, no "mejorar", no mezclar aulas.

---

## 1. REGLA FUNDAMENTAL: material fuente ≠ contenido del alumno

Hay dos cosas que NO son lo mismo y NUNCA deben confundirse:

### 1.A. Material fuente (biblioteca de referencia) — NO va al sitio
Los libros de la carpeta `Libros/` (Hanon, Czerny, Estudios de Chopin, El Clave Bien Temperado de Bach, Mark Levine, Tratado de Armonía de Schoenberg, etc.) son **la fuente intelectual privada del profesor** — de dónde se destiló el método. 

**PROHIBIDO:**
- ❌ Subir estos PDFs/libros al sitio como contenido descargable o visible para el alumno.
- ❌ Mostrar páginas escaneadas de estos libros dentro de los ejercicios.
- ❌ Tratar la biblioteca como "el material de estudio a incorporar".

**Razones (dos, ambas duras):**
1. **Copyright:** muchos están clasificados como `[DERECHOS VIGENTES]` en `05-clasificacion-derechos-autor-libros.md`. Subirlos a un sitio de suscripción paga es infracción directa. Solo los `[DOMINIO PÚBLICO]` podrían citarse, y aun así no es el modelo.
2. **Pedagogía:** el método Teclas Jade NO es "leé este libro". Es ejercicios interactivos destilados. El libro es la cantera, no el producto.

### 1.B. Currículo destilado — esto SÍ es lo que ve el alumno
Los 4 archivos `curriculum.md` (piano, guitarra, canto, teoria-musical) **son el contenido del sitio.** El trabajo de desglosar el material vasto YA ESTÁ HECHO: está convertido en bloques y ejercicios. El alumno ve **ejercicios**, nunca libros.

**El trabajo de Claude Code NO es "incorporar todo el material vasto". Es implementar los `curriculum.md` como experiencia interactiva.**

---

## 2. ESTRUCTURA JERÁRQUICA DEL CONTENIDO (idéntica en las 4 aulas)

```
AULA (Piano | Guitarra | Canto | Teoría Musical)
 └── BLOQUE (5 fases, en orden pedagógico)
      ├── Fase Semilla   (Bloque 1 — fundamentos)
      ├── Fase Core      (Bloque 2)
      ├── Fase Profunda  (Bloque 3)
      ├── Fase Maestría  (Bloque 4)
      └── Bloque Especial (Bloque 5 — avanzado/aplicado)
           └── EJERCICIO (unidad chica, autocontenida)
                ├── Concepto (qué se aprende)
                ├── Metodología / Consigna (qué hacer)
                ├── Autoevaluación (cómo saber si salió)
                └── Etiqueta: [DIGITAL-INTERACTIVO] | [HIBRIDO] | [INSTRUCCIONAL-FISICO]
           └── LABORATORIO DE CIERRE (verificación de fin de bloque)
```

**Principio de diseño:** el alumno nunca enfrenta "una montaña de contenido". Enfrenta **un ejercicio a la vez**, con su tutor de IA al lado. El volumen se vuelve manejable porque está cortado en unidades chicas y digeribles.

---

## 3. PROGRESIÓN DEL ALUMNO — modelo híbrido (DECIDIDO)

**NO es navegación 100% libre. NO es secuencial rígido puro. Es híbrido:**

### 3.A. Gating secuencial como default
- El Bloque N+1 se desbloquea al completar un **% mínimo de ejercicios** del Bloque N (sugerido: 70% + aprobar el Laboratorio de cierre).
- Esto protege el método "arqueológico": los cimientos primero.
- Se guarda en Supabase: `user_progress (user_id, pilar, bloque_actual, ejercicios_completados, racha_practica)`.

### 3.B. Navegación libre DENTRO de lo ya desbloqueado
- Todo ejercicio que el alumno ya desbloqueó queda **siempre accesible**: puede volver, repetir, saltar entre temas ya vistos. No queda "encerrado" avanzando en una sola dirección.
- Un alumno puede rehacer un ejercicio de Fase Semilla aunque ya esté en Fase Profunda.

### 3.C. Contenido futuro VISIBLE pero bloqueado
- Los bloques/ejercicios que todavía no desbloqueó **se muestran con un candado 🔒** (visibles en el mapa, no accesibles).
- Transparencia total del camino, sin permitir saltear los cimientos.

**Por qué NO navegación libre total:** un principiante que entra directo a Fase Maestría no entiende nada, se frustra y cancela la suscripción. El gating es retención, no burocracia.

---

## 4. VISTA Y ACCESIBILIDAD — "El Mapa del Aula"

Cada aula DEBE tener una vista índice ("Mapa del Aula") que muestre el panorama completo sin abrumar:

- **Los 5 bloques completos**, en orden.
- **Todos los ejercicios** de cada bloque, con estado visual:
  - ✅ Completado
  - 🔓 Disponible (desbloqueado, sin completar)
  - 🔒 Bloqueado (visible pero no accesible)
- **Barra de progreso** del aula (% completado).
- **Racha de práctica** (mecánica de hábito tipo Duolingo, ya confirmada como referencia de mecánica).
- **Buscador/filtro** dentro del aula: para encontrar rápido un ejercicio ya desbloqueado por nombre o tema.

**Objetivo UX:** el alumno abre el mapa y en 2 segundos sabe dónde está, qué hizo, qué le falta y qué viene. El volumen deja de dar vértigo porque siempre hay un mapa de posición.

---

## 5. INDEPENDENCIA ESTRICTA DE LAS AULAS — regla blindada

**Cada aula contiene ÚNICA Y EXCLUSIVAMENTE material de su propio pilar.**

- Aula de **Piano** → solo contenido de Piano.
- Aula de **Guitarra** → solo contenido de Guitarra.
- Aula de **Canto** → solo contenido de Canto.
- Aula de **Teoría Musical** → solo contenido de Teoría Musical.

**Blindaje arquitectónico:**
- 4 árboles de progresión independientes, cada uno con su propia fila en Supabase (una por `(user_id, pilar)`).
- 4 tutores de IA independientes, cada uno con su system prompt: **Maestro Allegro** (Piano), **Maestro Ritmo** (Guitarra), **Maestra Resonancia** (Canto), **Profesor Harmónico** (Teoría). Cada tutor SOLO habla de su pilar. Ver `04-tutores-ia-chatbot.md`.
- 4 barras de progreso individuales, independientes entre sí.
- **Sin orden global entre aulas:** el alumno puede avanzar solo en Piano, o en Canto + Teoría, sin tocar las otras. Es intencional.

**PROHIBIDO:**
- ❌ Mostrar ejercicios de un pilar dentro de otro.
- ❌ Que un tutor de IA responda sobre un pilar que no es el suyo (Maestro Allegro no habla de canto).
- ❌ Fusionar progresos entre aulas.

### 5.A. Único matiz permitido: Teoría como base referenciada (NO absorbida)
La Teoría Musical es, por naturaleza, la base de los otros tres instrumentos. Regla exacta:

- **Permitido:** cuando un ejercicio de Piano necesita un concepto teórico (ej. qué es un intervalo), lo explica **inline, ahí mismo, en el aula de Piano**, de forma breve y autocontenida.
- **PROHIBIDO:** meter el currículo de Teoría Musical (sus bloques/ejercicios) dentro del aula de Piano. La teoría vive en SU propia aula; las demás la referencian puntualmente, nunca la absorben.

Resultado: cada aula queda limpia, fiel a su instrumento, sin contaminación cruzada.

---

## 6. RESUMEN EJECUTIVO PARA CLAUDE CODE

1. **No subas los libros.** Son fuente privada, muchos con copyright vigente. El contenido del alumno son los ejercicios de los `curriculum.md`.
2. **Implementá la jerarquía:** Aula → 5 Bloques → Ejercicios → Laboratorio de cierre.
3. **Progresión híbrida:** gating secuencial como default + navegación libre en lo ya desbloqueado + futuro visible con candado.
4. **Construí el "Mapa del Aula"** con estados visuales, barra de progreso, racha y buscador.
5. **Blindá la independencia de las 4 aulas.** Piano solo piano. Cada tutor solo su pilar. Teoría se referencia inline pero nunca se absorbe.
6. **Cada aula tiene DOS caminos, no uno** (ver sección 7): el Camino Guiado (secciones 2-5 de este documento, sin tocar) y la Biblioteca (navegación libre por catálogo, sin candados).
7. **El mecanismo de interacción de los ejercicios es un teclado virtual de dos octavas que se toca solo** (ver sección 8) — nunca verificación por MIDI ni por micrófono.

**Estas reglas no son sugerencias. Son la definición del producto. Respetarlas a full.**

---

## 7. DOS CAMINOS POR AULA — Camino Guiado + Biblioteca (DECIDIDO 10/07)

**Contexto de la decisión:** el modelo de las secciones 2-5 (gating secuencial, 5 bloques, candados) es correcto para un alumno que arranca de cero — pero es el único camino, y un alumno de nivel intermedio/avanzado quedaría forzado a "sufrir" Hanon N°1 antes de llegar a su propio nivel. La solución **no es rediseñar el Camino Guiado** (sigue intacto, tal como está descrito arriba) — es sumarle un segundo camino al lado.

### 7.A. Camino 1 — El Método Guiado
Exactamente lo ya descrito en las secciones 2 a 5 de este documento: 5 bloques con candado, gating secuencial (70% + Laboratorio de cierre para desbloquear), pensado para el alumno que empieza de cero y necesita los cimientos en orden. **No cambia nada acá.**

### 7.B. Camino 2 — La Biblioteca
Una sección aparte dentro de cada aula, **sin candados ni orden obligatorio**, donde vive el catálogo de recursos de dominio público (técnica, progresiones, escalas, arpegios, cadencias, piezas completas, patrones rítmicos, licks de improvisación) organizado por **género/estilo, tipo de recurso y nivel** — nunca por secuencia. El alumno filtra por lo que le interesa, elige un recurso YA CARGADO de antemano (nunca generado en vivo por el tutor — mismo principio que el "Camino A" de `04-tutores-ia-chatbot.md`, Corrección 3), y la práctica se apoya en la demostración del teclado autotocable (§8), reutilizada acá. El chat conversacional con el tutor de IA no está disponible en el Camino 2: es exclusivo del Camino 1.

**Estructura completa de la Biblioteca:** ver el documento dedicado `12-biblioteca-libre.md`.

**Por qué resuelve el problema real:** el alumno avanzado nunca toca el Camino 1 — va directo a la Biblioteca, filtra por su nivel/interés, y practica sin tener que atravesar los 5 bloques de cero. Y de yapa, la retención deja de depender solo de los ~25 ejercicios del Camino Guiado: la Biblioteca puede crecer con cientos de recursos con costo de IA casi nulo (el tutor acompaña algo ya cargado, no genera contenido nuevo cada vez).

**Implicancia técnica (no bloqueante para el MVP):** hace falta una tabla nueva en Supabase para el catálogo de la Biblioteca (ver `12-biblioteca-libre.md`) — es una migración adicional sobre lo ya construido, no una reescritura. La curaduría de contenido (cargar los recursos reales) es trabajo del profesor que puede crecer con el tiempo; no hace falta tenerlo completo para lanzar.

### 7.C. Regla de aislamiento — qué comparten los dos caminos y qué NO (para que agregar el Camino 2 después no rompa el Camino 1 ya construido)

Esto es una regla de arquitectura obligatoria para Claude Code, no un detalle de implementación librado a su criterio:

- **Comparten:** el shell/layout general del aula (header, navegación entre pestañas "Método Guiado" / "Biblioteca") y el componente de demostración del teclado autotocable (§8).
- **NO comparten:** rutas, componentes de contenido, tablas de Supabase, ni el chat conversacional del tutor de IA: ese chat (y su contador de mensajes) es exclusivo del Camino 1. El Camino 1 sigue usando `user_progress` con su gating secuencial tal cual está. El Camino 2, cuando se construya, usa su propia tabla independiente (`biblioteca_recursos`, ver `12-biblioteca-libre.md`) sin ningún gating y sin chat de tutor.

**Consecuencia práctica:** construir el Camino 2 más adelante es trabajo **aditivo** (una pestaña nueva + una tabla nueva + sus propios componentes), no una reescritura de lo que el Camino 1 ya tiene funcionando. Para que esto se cumpla, el Camino 1 debe construirse dejando ese lugar reservado en la navegación desde el principio (ver `11-guion-de-prompts-claude-code.md`, Prompt 4) — no como una promesa a futuro sin nada en el layout, sino como una pestaña ya presente (aunque vacía) desde la Fase 4.

---

## 8. MECANISMO DE INTERACCIÓN DE LOS EJERCICIOS — Teclado Virtual de Dos Octavas (DECIDIDO 10/07)

**Mecanismo descartado (no construir):** verificación en tiempo real de lo que el alumno toca, ya sea por teclado MIDI físico (Web MIDI) o por micrófono. Se descarta por dos razones duras: la mayoría de los alumnos no va a tener un teclado MIDI conectado a la computadora, y hacer que el sistema "escuche" al alumno tocar y juzgue si estuvo bien en tiempo real es técnicamente frágil (ruido de fondo, demora, falsos positivos que frustran sin motivo). **Tampoco se usa el teclado QWERTY de la notebook como forma de tocar o de autoevaluación** — queda únicamente como capa lúdica opcional para que los chicos "jueguen a tocar junto" con la demostración, nunca como verificador.

**Mecanismo final (único, para las 4 aulas donde aplique un teclado):**

Un **teclado virtual en pantalla, de DOS octavas por defecto** (no una) — la octava grave para la mano izquierda, la octava aguda para la mano derecha — que **se toca solo**:

- Reproduce el ejercicio al **BPM que el alumno elija** (más lento para aprender, más rápido para practicar).
- Las teclas que van sonando **se pintan** en el momento en que suenan.
- Sobre cada tecla pintada aparece el **número de dedo correspondiente (1 al 5)**, tanto para mano izquierda como derecha, según la digitación cargada para ese ejercicio.
- **Cero verificación por software de lo que el alumno realmente toca en su instrumento real.** El alumno mira, escucha, elige su propio piano/teclado (o el que tenga), e imita por su cuenta.
- La autoevaluación sigue siendo la que ya está escrita ejercicio por ejercicio en los `curriculum.md` (el "test de la falange", el "clic de coincidencia", etc.) — la hace el propio alumno con sus criterios, nunca la app.

**Por qué dos octavas y no una:** es un requisito funcional, no estético — en la octava grave toca la mano izquierda y en la aguda la mano derecha, simultáneamente, tal como se ejecuta en un piano real. Una sola octava no permite mostrar ambas manos a la vez.

**Controles del reproductor (DECIDIDO 11/07 — antes no estaban especificados):**

- **Play/Pausa:** un solo botón que alterna ícono según el estado; pausar detiene la demostración exactamente donde está, sin reiniciar.
- **Reiniciar/Volver al inicio:** vuelve la reproducción al comienzo del ejercicio sin esperar a que termine sola.
- **Selector de BPM:** slider (no solo +/-), con el BPM sugerido del ejercicio como valor inicial por defecto.
- **Repetir en bucle (loop):** toggle opcional para que la demostración se repita automáticamente sin que el alumno tenga que tocar Play cada vez — pensado para el alumno que quiere verla una y otra vez sin interactuar.

Estos cuatro controles son el set mínimo del reproductor para los 4 tipos de ejercicio que lo usan ([DIGITAL-INTERACTIVO], la parte interactiva de [HIBRIDO], y el mismo componente reutilizado en la Biblioteca).

**Ventaja técnica de este cambio:** un teclado que se toca solo (animación + audio + números de dedo) es una funcionalidad bien conocida y confiable — muy distinta, en riesgo técnico, de intentar verificar en tiempo real lo que el alumno toca. Al sacar la verificación, se cae el riesgo técnico más grande de las 4 aulas, sin perder nada esencial del contenido ya escrito (concepto, metodología y autoevaluación de cada ejercicio no cambian).

**Alcance de aplicación:** este mecanismo aplica tanto al Camino 1 (Método Guiado) como al Camino 2 (Biblioteca) — es el mismo teclado, reutilizado, sin costo de desarrollo extra entre ambos caminos. **Pendiente de validación técnica** (a resolver con Claude Code antes de cargar todo el catálogo, no antes de empezar a construir): confirmar que el motor de audio elegido (Web Audio API con soundfont, Tone.js, u otro) reproduce con calidad aceptable ejercicios de mucha destreza, patrones rítmicos complejos o síncopa real — con una prueba concreta antes de asumir que sirve para todo. Si algún recurso puntual de la Biblioteca no suena convincente por síntesis, la excepción es colgar un audio real grabado de referencia para ESE recurso puntual, no cambiar la regla general.

---

## 9. FÓRMULA DE DIGITACIÓN ESPEJO (DECIDIDO 10/07)

Para todo ejercicio de digitación/técnica a dos manos marcado como **"espejo"** (movimiento simétrico entre ambas manos, tipo Hanon), la digitación de una mano se calcula sola a partir de la otra — no hay que cargarla ni tipearla dos veces.

**Fórmula fija:** `dedo de la mano opuesta = 6 − dedo original`

Ejemplo confirmado por el profesor: mano izquierda dedos (5, 4, 3, 2, 1) contra mano derecha dedos (1, 2, 3, 4, 5) — el pulgar (1) de una mano siempre se refleja con el meñique (5) de la otra (6−1=5), el dedo 2 con el dedo 4 (6−2=4), y el dedo 3 se refleja consigo mismo, el del medio (6−3=3).

**Decisión de carga en base de datos:** se carga manualmente solo la digitación de la mano derecha por ejercicio; el sistema calcula la digitación de la mano izquierda aplicando la fórmula, únicamente para los ejercicios marcados como "espejo". Esto reduce a la mitad la carga de datos de digitación para este tipo de ejercicio.

---

## 10. TECLADO DE RANGO DINÁMICO (DECIDIDO 11/07)

> ⚠️ **REPASAR ANTES DE EJECUTAR.** Esta sección (10) y la (11) se releen y reconfirman con el profesor ANTES de que Claude Code las programe. No arrancar el build del Bloque 2 sin ese repaso previo. Énfasis pedido por el profesor.

**Problema detectado:** un teclado fijo de 2 octavas se queda corto. Con las 2 octavas repartidas una por mano, una escala de octava completa en una mano necesita la 8ª nota que ya cae en la octava de la otra mano — se pisan.

**Decisión — rango dinámico, NO número fijo:**

- El teclado renderiza **las octavas que necesita cada ejercicio**, calculadas automáticamente a partir de su propia secuencia de notas (la nota más grave y la más aguda del ejercicio determinan cuántas octavas se dibujan).
- **Mínimo 2 octavas** (para que ejercicios cortos no se vean ridículos).
- **Sin configuración por ejercicio, cero código extra:** las octavas se derivan de la misma secuencia de notas que ya hace que el teclado se toque solo. El profesor carga las notas una sola vez; el rango sale solo de ahí. No hay un segundo dato que mantener ni forma de que se desincronice.
- Ventaja de escala: da igual si son 20 ejercicios o miles de recursos de Biblioteca — mientras cada uno tenga su secuencia, el teclado se ajusta solo. Más material no agrega trabajo de configuración de teclado.

**Regla de escritorio / celular:**

- Pantallas anchas: el teclado se ve completo.
- Celular vertical, cuando el ejercicio supera 2 octavas: mostrar un ícono de "girar el teléfono" y desplegar completo en horizontal.
- Respaldo silencioso: scroll horizontal con el dedo, para que quien no gire el teléfono igual llegue a todas las teclas y nunca quede trabado.

**Disparador de implementación:** se construye **al inicio del build del Bloque 2, ANTES de escribir sus ejercicios** (porque cada ejercicio nuevo asume un rango de teclado). El Bloque 1 ya sellado entra en 2 octavas y no se toca. Aplica igual a la Biblioteca cuando se programe.

---

## 11. DOS TIPOS DE CONTENIDO: REPRODUCIBLE vs VISUAL (DECIDIDO 11/07)

> ⚠️ **REPASAR ANTES DE EJECUTAR.** Igual que la sección 10: se relee y reconfirma con el profesor antes de programar el modelo de contenido de la Biblioteca (Camino 2). Ver también doc 12.

**Verdad de base:** el motor no puede reproducir un ritmo que no está en el dato. La etiqueta de género (bachata, jazz, etc.) no le dice al reproductor cómo suena — el ritmo se infiere solo si está cargado nota por nota. Por eso cada cosa que se carga se marca como uno de dos tipos:

**Tipo 1 — REPRODUCIBLE (curaduría en texto):**
- El motor lo toca (teclado auto / AlphaTab para guitarra).
- Requiere altura **+ duración (el ritmo)** cargada nota por nota.
- Reservado para los demos clave donde el audio realmente enseña (ejercicios del Método / Camino 1, pocos y curados).
- Alternativa sin tipeo: una partitura conseguida como **MusicXML** (archivo musical, no imagen) se reproduce con su ritmo completo directamente. Una imagen/PDF NO — el motor no la lee.

**Tipo 2 — VISUAL (curaduría de imágenes):**
- Imagen de partitura / tablatura / acordes. Estático.
- El motor NO lo toca; **el ritmo vive dentro de la imagen y lo lee el alumno.** Cero duración que cargar.
- Es el grueso del material masivo de la Biblioteca (6-7 géneros). El volumen enorme cae en la categoría que NO pide encodeo rítmico → la carga de escribir duraciones queda acotada al conjunto chico de demos audibles.

**⚠️ Regla de copyright (misma que sección 1 y doc 05):** material ajeno conseguido —imagen O MusicXML de una obra existente— NO se sube tal cual a un sitio pago. Se usa como inspiración para generar originales del profesor, o se licencia. Los ejercicios que escribe el profesor son suyos, sin problema.

**Optimización futura (NO construir ahora):** "plantillas de ritmo por género" (célula de bachata, patrón de bossa que se repite) solo sirven para ejercicios de acompañamiento/groove con patrón repetido, no para melódicos donde cada nota tiene su valor. Anotado como idea, no para la primera versión.

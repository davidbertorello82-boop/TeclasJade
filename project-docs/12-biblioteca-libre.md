# Teclas Jade — La Biblioteca (Camino 2 de cada aula)

**Estado:** Arquitectura de datos DECIDIDA. Curaduría de contenido PENDIENTE (ver sección 5).
**Fecha:** 10 de julio, 2026

> Este documento define el "Camino 2" mencionado en `10-modelo-de-contenido-y-progresion.md` (sección 7.B): la sección libre de cada aula, sin candados, donde el alumno explora un catálogo de recursos de dominio público en vez de seguir el Método Guiado paso a paso.

---

## 1. Para qué existe

El Camino Guiado (5 bloques con candado) es correcto para quien empieza de cero, pero deja sin resolver al alumno de nivel medio/avanzado, que no debería tener que atravesar los cimientos para llegar a su propio nivel. La Biblioteca es la respuesta: un catálogo navegable libremente, organizado por lo que el alumno quiere aprender, no por una secuencia obligatoria.

**Principio central, ya blindado en `04-tutores-ia-chatbot.md` (Corrección 3):** todo recurso de la Biblioteca está **codificado de antemano** (nunca generado en vivo por IA al momento de pedirlo). En el Camino 2 el acompañamiento es la **demostración del teclado autotocable** (§5), no el chat conversacional: el **chat con el tutor de IA es exclusivo del Camino 1** (ver `10-modelo-de-contenido-y-progresion.md` §7). El recurso ya cargado se practica; no se inventa.

---

## 2. Estructura de datos de cada recurso

Cada entrada de la Biblioteca tiene estos campos (confirmados, corrigiendo una mezcla de conceptos que se había propuesto al principio y el propio profesor marcó como incorrecta):

| Campo | Qué es | Ejemplos |
|---|---|---|
| **Título** | Nombre del recurso | "ii-V-I mayor", "Blues de 12 compases en Do" |
| **Género/Estilo** | El *tipo de música* — nunca mezclar con "tipo de recurso" | Rock, Blues, Jazz (tonal), Jazz (atonal/moderno), Clásico (va junto con Técnica), Salsa, Bachata, Folclore, Tango, Pop |
| **Tipo de Recurso** | Qué clase de material práctico es, independiente del género | Progresión de acordes, escala, arpegio, cadencia, pieza completa, patrón rítmico, lick/patrón de improvisación |
| **Nivel** | Siempre 3 niveles fijos — ver sección 3 | Principiante / Medio / Avanzado |
| **Consigna** | Qué es y cómo practicarlo, mismo formato que `curriculum.md` | Concepto / Metodología |
| **Fuente** | De dónde sale, para volver a cruzar con `05-clasificacion-derechos-autor-libros.md` y confirmar que sigue siendo dominio público | — |
| **Archivo de partitura codificado** | MusicXML/ABC ya cargado (mismo principio que el Camino A de `04-tutores-ia-chatbot.md`) | — |

**Corrección importante ya incorporada:** "Género/Estilo" y "Tipo de Recurso" son dos campos distintos, no uno. Acordes y cadencias NO son géneros — son tipos de recurso que existen dentro de cualquier género.

---

## 3. Por qué siempre son 3 niveles (y no son recursos triplicados)

No son tres recursos distintos sin relación — es **la misma familia de contenido con desafío creciente**. Un mismo "ii-V-I" existe una sola vez como familia conceptual, con tres variantes cargadas:

- **Principiante:** versión simple (ej. ii-V-I sencillo, sin extensiones).
- **Medio:** con más ritmo/síncopa.
- **Avanzado:** con extensiones y alteraciones armónicas.

Esto evita cargar contenido triplicado sin conexión entre sí — las tres variantes se cargan como parte de la misma entrada/familia, no como tres entradas sueltas.

---

## 4. Independencia estricta entre bibliotecas de aula

**Cada aula tiene su propia Biblioteca, exclusiva de su pilar — misma regla blindada que ya rige para el Camino Guiado** (`10-modelo-de-contenido-y-progresion.md`, sección 5).

Aunque un concepto "sea el mismo" en dos instrumentos (ej. un ii-V-I existe tanto en Piano como en Guitarra), **se cargan como entradas completamente independientes**, cada una hecha a la manera de su propio instrumento (digitación de piano vs. diagramas de guitarra, por ejemplo) — nunca como un recurso compartido entre aulas. Sin excepciones.

---

## 5. Mecanismo de demostración — reutiliza el teclado de rango dinámico, con una validación técnica pendiente

La demostración de cada recurso **reproducible** de Piano usa el **mismo teclado virtual de rango dinámico que se toca solo** ya cerrado para el Camino Guiado (`10-modelo-de-contenido-y-progresion.md`, secciones 8 y 10) — mismo audio, mismos números de dedo, misma velocidad ajustable, y el rango de octavas se ajusta solo a cada recurso a partir de su secuencia de notas. Sin costo de desarrollo extra: es tecnología reutilizada, no una nueva.

**[Probable] Pendiente de validar con Claude Code, antes de cargar el catálogo completo (no antes de empezar a construir):** confirmar con una prueba concreta (un patrón rítmico complejo de muestra) si el motor de audio elegido sostiene calidad aceptable para TODOS los recursos — hay recursos de mucha destreza o ritmo complejo donde la síntesis podría sonar poco convincente. Si algún recurso puntual falla esa prueba, la excepción es colgar un audio real grabado de referencia para ESE recurso específico — síntesis por defecto, grabación real solo donde haga falta. No es una excusa para no construir el mecanismo por defecto; es una validación puntual antes de dar por buena la cobertura al 100%.

---

## 5.B. DOS TIPOS DE CONTENIDO: REPRODUCIBLE vs VISUAL (DECIDIDO 11/07)

> ⚠️ **REPASAR ANTES DE EJECUTAR.** Esta distinción se relee y reconfirma con el profesor antes de programar el modelo de contenido de la Biblioteca. Es la columna vertebral de cómo se carga el material masivo. Espejo de la sección 11 del doc 10.

El motor no puede reproducir un ritmo que no está en el dato: la etiqueta de género no le dice al reproductor cómo suena. Por eso **cada recurso de la Biblioteca se marca como uno de dos tipos:**

**Tipo 1 — REPRODUCIBLE (curaduría en texto):** lo toca el motor (teclado auto / AlphaTab). Requiere altura **+ duración (ritmo)** cargada nota por nota, o una partitura conseguida como **MusicXML** (archivo musical, no imagen — el motor lo lee directo). Reservado para donde el audio realmente enseña.

**Tipo 2 — VISUAL (curaduría de imágenes):** imagen de partitura / tablatura / acordes, estática. El motor NO la toca; **el ritmo vive en la imagen y lo lee el alumno.** Cero duración que cargar. **Es el grueso del material masivo de los 6-7 géneros** — el volumen enorme de la Biblioteca cae acá, en la categoría que no pide encodeo rítmico.

**⚠️ Regla de copyright (misma que doc 10 §1 y doc 05):** material ajeno conseguido —imagen O MusicXML de una obra con derechos vigentes— NO se sube tal cual a un sitio pago. Inspiración para originales del profesor, o licencia. Cruza siempre con `05-clasificacion-derechos-autor-libros.md` (el campo "Fuente" de la sección 2 existe justo para esto).

---

## 6. Implicancia técnica en Supabase (no bloqueante para el MVP)

Hace falta una tabla nueva, por ejemplo `biblioteca_recursos`, con al menos: `id, pilar, familia_concepto, titulo, genero_estilo, tipo_recurso, nivel, consigna_concepto, consigna_metodologia, fuente, archivo_partitura_codificado, created_at`. Es una migración adicional sobre lo ya construido en fases anteriores — no una reescritura.

**Recordatorio de regla dura vigente (confirmada 10/07 por el profesor):** ningún cambio de base de datos —incluida esta tabla— se ejecuta sin consulta previa y confirmación explícita del profesor, con preguntas precisas y puntuales.

---

## 7. Pendiente — plan de curaduría de contenido

Todavía no cerrado (tarea abierta en la lista de trabajo): un flujo paso a paso de quién carga qué. El profesor confirmó que no tiene problema en sentarse a hacer la curaduría completa él mismo, pero falta acordar el orden de prioridad (qué género/nivel se arma primero) y qué parte, si alguna, puede apoyarse en material ya existente de fuentes públicas (IMSLP, biblioteca pública de MuseScore) en vez de transcribirse a mano — mismo atajo ya sugerido para el repertorio clásico en `04-tutores-ia-chatbot.md`, Corrección 3.

**Este documento no cierra ese punto.** Queda como siguiente paso a resolver antes de empezar a cargar contenido real en la tabla de la sección 6.

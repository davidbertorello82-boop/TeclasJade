# 13 — Aula de Guitarra: Mecanismo de Demostración (Camino 1)

**Estado: [DECIDIDO 11/07]**
**Alcance: exclusivamente Camino 1 (Método Guiado). Camino 2 (Biblioteca) queda fuera — se define aparte cuando corresponda.**

> Este documento es un anexo específico de instrumento. No modifica ni reemplaza nada de `10-modelo-de-contenido-y-progresion.md`; hereda sus principios generales (ver §8 de ese documento) y los aplica a la mecánica particular de la guitarra.

---

## 1. Principio heredado (no se re-discute)

Doc 10 §8 ya estableció, para el piano, el principio rector: **cero verificación de lo que el alumno toca en su instrumento real** (sin MIDI, sin micrófono). El mecanismo demuestra cómo debería sonar y ejecutarse el ejercicio; no evalúa al alumno. Ese principio aplica igual para guitarra — no se reabre esa discusión acá.

## 2. Decisión: tablatura animada (AlphaTab), no una "guitarra virtual"

Se descarta construir un mástil/diapasón virtual con dedos animados que se ejecuta solo (el equivalente literal al teclado de piano). Se adopta en su lugar **tablatura interactiva renderizada con AlphaTab**.

Motivo: la tablatura es el estándar real con el que se enseña guitarra (transferible fuera del sitio), y AlphaTab ya resuelve nativamente lo que necesitamos — no hay que construir un motor de animación de mástil desde cero:

- Renderiza la tablatura (y notación si hiciera falta) en la web.
- Sintetiza el audio del ejercicio.
- Anima un cursor que recorre las notas en sincronía con el audio mientras suena — el equivalente exacto al "tocar solo" del piano, pero en formato tab.

## 3. Controles del reproductor (idénticos a doc 10 §8)

Mismo patrón de UX ya definido para el piano, aplicado sobre el motor AlphaTab:

- Play / Pausa
- Reiniciar
- Slider de BPM (valor inicial = BPM sugerido del ejercicio)
- Loop

## 4. Notas técnicas para Claude Code

- Motor sugerido: **AlphaTab** (ya mencionado como opción válida en doc 04). Evaluar en el momento de implementación si la versión vigente cubre sin fricción: cursor sincronizado, control de tempo/loop, y estilizado acorde a la paleta de doc 03 (fondo `#F7F5F0`, jade, tierra).
- El formato fuente de cada ejercicio (Guitar Pro / alphaTex / MusicXML u otro que AlphaTab soporte) queda a criterio de Claude Code según lo que resulte más simple de mantener en el modelo de contenido.
- La fórmula de digitación espejo (doc 10 §9) es específica de piano (mano derecha/izquierda) y no aplica directamente a guitarra; si surge un caso análogo para guitarra (zurdos, por ejemplo), se define aparte cuando se llegue a esa fase.

## 5. Por qué documento aparte y no una sección nueva en doc 10

Doc 10 es el marco general compartido por las 4 aulas. Meter ahí contenido específico de un instrumento rompe esa función y además arriesga interferir con lo que Claude Code está leyendo/usando ahora mismo para Fase 4 (Piano, Bloque 1). Se sigue el mismo criterio ya aplicado con la Biblioteca (doc 12): lo específico de un módulo va en su propio documento. Este doc 13 no se referencia todavía en ningún prompt activo — se incorporará al guion de prompts (doc 11) recién cuando arranque la fase de Guitarra.

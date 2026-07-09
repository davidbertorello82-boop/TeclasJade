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

**Estas reglas no son sugerencias. Son la definición del producto. Respetarlas a full.**

# Teclas Jade — Kickoff para Claude Code

**Fecha:** 9 de julio, 2026  
**Autor:** David Eugenio Bertorello Mitrojovich + investigación completada  
**Estado:** Todas las decisiones cerradas. No quedan pendientes de usuario. Listo para desarrollar.

---

## RESUMEN EJECUTIVO

**Teclas Jade** es una plataforma educativa digital para aprender música (Piano, Guitarra, Canto, Teoría Musical) a través de un método llamado "La Matriz Arqueológica de Organización" — descomponer cada habilidad musical en sus "raíces atómicas" (intervalos, técnica física, estructura armónica) y construir desde ahí hacia arriba.

**Dos productos:**
1. **Sitio web** — vidriera de marca + acceso a contenido premium (Next.js o similar, Supabase backend)
2. **App móvil** — solo área interactiva de estudio, comparte backend con web

**Modelo de negocio:** Suscripción mensual **AR$14.900** (todo incluido: 4 pilares + 400 mensajes/mes con tutores de IA + acceso ilimitado a ejercicios).

---

## TECH STACK — DECISIONES CLOSED

- **Frontend:** Next.js (React) con Tailwind CSS o equivalente. Componentes: shadcn/ui como base.
- **Backend:** Supabase (PostgreSQL + Auth + Real-Time + Storage + Edge Functions para webhooks).
- **Audio:** Web Audio API (síntesis en vivo para piano MIDI + detección de pitch para guitarra/voz).
- **Pagos:** Mercado Pago (suscripciones vía Preapproval Plan API, no Checkout Pro).
- **Tutores IA:** Claude Haiku vía Anthropic Messages API, con system prompts de safety para menores.
- **Diseño visual:** "El Bosque Inversivo" — hybrid 3D+2D (Pixi.js para parallax 2D), no geometría 3D real corriendo todo el tiempo.

**Detalles no negociables:**
- Respeto a `prefers-reduced-motion` (accesibilidad).
- Audio ASMR (bosque) requiere gesto explícito del usuario ("Despertar el bosque 🌿"), no autoplay.
- Silencio total automático dentro de cualquier aula (no hay ambience).
- Botón de mute flotante permanente.

---

## ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
/home/claude/teclas-jade-content/
├── 00-marca.md                           # Brand identity, bio, contact
├── 01-arquitectura-contenido.md          # Sitemap, payment flow, Supabase schema outline
├── 02-assets-faltantes.md                # Asset checklist (logos ✓, copywriting ✓, videos)
├── 03-especificacion-diseno-bosque.md    # Design tokens, visual references, motion
├── 04-tutores-ia-chatbot.md              # AI tutor system prompts, safety, cost calc
├── 05-clasificacion-derechos-autor-libros.md  # Copyright status per book
├── 06-guia-grabacion-videos.md           # Video production scope (Bloque 1 only)
├── 07-checklist-de-avance.md             # Master tracking checklist
├── 08-copywriting-home.md                # Homepage copy (8 sections, all confirmed)
├── 09-kickoff-claude-code.md             # THIS FILE
├── logo-principal.png                    # Main logo (2000px, white bg)
├── logo-simplificado.png                 # Simplified logo/favicon (1024px, white bg)
├── piano/curriculum.md                   # Full curriculum: 5 bloques + exercises
├── guitarra/curriculum.md                # Full curriculum: 5 bloques + exercises
├── canto/curriculum.md                   # Full curriculum: 5 bloques + exercises
├── teoria-musical/curriculum.md          # Full curriculum: 5 bloques + exercises
├── Fotos de mi rostro real/
│   └── WhatsApp Image 2026-07-08 at 5.21.35 PM.jpeg  # Profile photo
└── README.md                             # Overview of this content package
```

**Todos los `.md` de currículo incluyen:**
- Concepto pedagógico de cada bloque
- 8–12 ejercicios por bloque, cada uno etiquetado:
  - `[DIGITAL-INTERACTIVO]` — ejercicio interactivo (56% del total)
  - `[HIBRIDO]` — parte interactiva + guía física complementaria (28%)
  - `[INSTRUCCIONAL-FISICO]` — solo guía de texto/video (17%, fallback)
- Laboratorio de cierre por bloque (verificación de progreso)
- Rutina Secuencial Temporizada (minutos sugeridos por día)

---

## ORDEN DE DESARROLLO — MVP PHASING

### Fase 1: Infraestructura + Autenticación (Week 1–2)
1. Crear proyecto Supabase (PostgreSQL, Auth con email/Google/Apple).
2. Definir schema inicial:
   - `users` (id, email, name, profile_photo_url, subscription_status, created_at)
   - `subscriptions` (user_id, mercadopago_subscription_id, status, next_billing_date)
   - `user_progress` (user_id, pilar, bloque_actual, ejercicios_completados, racha_practica)
   - `mensajes_ia_consumo` (user_id, mes, mensajes_consumidos) — reseteado cada mes
   - `reportes_error` (id, user_id, tutor, tipo_error, contexto_json, estado, fecha)
3. Implementar Mercado Pago webhook receiver (Edge Function) — recibe notificaciones de pago y actualiza `subscriptions`.
4. Setup Next.js + Tailwind + shadcn/ui + Supabase client.

### Fase 2: Home Pública + Zona de Marca (Week 2–3)
1. **Hero + "Despertar el bosque 🌿" button** — el gesto que dispara ambience. Implementar Web Audio API con sonido bosque.
2. **Bio + Descripción de plataforma** — scroll smooth, tipografía serif (Playfair Display), whitespace generoso.
3. **"El Claro de los Troncos"** — menú de 4 aulas, cada una con hover subtle, sin link a contenido aún.
4. **Cierre comercial + botón "Suscribirme"** — navega a checkout de Mercado Pago (Preapproval).
5. **Contacto:** Instagram + WhatsApp (wa.me/5493564688728, con el 9 correcto).
6. Frases poéticas intercaladas (todas 100% originales, ver `08-copywriting-home.md`).

**Design tokens aplicados:**
- Background: `#F7F5F0` (lino/hueso)
- Primary (Jade): `#2C5E43` / `#3B7A57`
- Secondary (Tierra): `#8B5A2B` / `#A0522D`
- Text: `#1A2421`
- Highlight: `#E6DFD3` / `#D4AF37`

### Fase 3: Auth + Pago (Week 3–4)
1. Integración Mercado Pago Preapproval Plan API:
   - POST /create-subscription (cliente → Mercado Pago → webhook → Supabase)
   - Webhook handler en Edge Function que actualiza `subscriptions.status` (active/pending/cancelled)
2. Pantalla de login/signup simple.
3. Proteger rutas de zona premium (requiere `subscription.status == 'active'`).

### Fase 4: Primera Aula Interactiva — Piano (Week 4–6)
**Alcance MVP:** Bloque 1 ("Fase Semilla") solo, 5–6 ejercicios principales.

1. **Interfaz del aula:**
   - Panel izquierdo: selector de bloque + barra de progreso (% de ejercicios completados)
   - Panel central: ejercicio actual (titulo, concepto, consigna)
   - Panel derecho: chatbot de IA (Avatar Maestro Allegro)
   - Botón "Reportar un error" en cada chatbot

2. **Ejercicio tipo `[DIGITAL-INTERACTIVO]` — Piano MIDI:**
   - Teclado virtual clickeable (fallback)
   - Web MIDI API (opcional, para hardware real)
   - Autodetección de notas tocadas, comparación con patrón esperado
   - Feedback visual/sonoro en tiempo real
   - Guardar progreso en Supabase

3. **Ejercicio tipo `[HIBRIDO]` — Piano:**
   - Parte interactiva (ej. identificar acordes por sonido)
   - Guía PDF/inline de postura/técnica
   - Ambas se registran como "completado"

4. **Ejercicio tipo `[INSTRUCCIONAL-FISICO]`:**
   - Video embebido o link (ej. "Postura general al piano")
   - Checkbox de "completé este paso"
   - Nota de texto: "Si no tenés video personal, esta guía (de texto + foto) reemplaza"

5. **Chatbot AI (Maestro Allegro):**
   - System prompt en `04-tutores-ia-chatbot.md` — customizado para Piano
   - Entrada: texto de alumno
   - Salida: Claude Haiku respuesta pedagógica, con opción de mostrar pieza/ejercicio
   - **Camino A (prioritario):** Mostrar ejercicio de la pieza es pregunta → buscar en catálogo pre-catalogado (MusicXML/ABC) → si existe, mostrar notación + audio Web Audio
   - **Camino B (fallback):** Si no está en catálogo → generar ejercicio simple con texto
   - Contador de mensajes consumidos: actualizarse en Supabase, avisar cada 100 + aviso especial al quedar 50
   - Botón "Comprar más mensajes" si se queda sin bolsa

6. **Laboratorio de cierre (Bloque 1):**
   - Quiz interactivo (reconocer acordes, secuencias rítmicas simples)
   - Mínimo 70% para desbloquear Bloque 2

### Fase 5: Otras Aulas (Week 6–8)
Replicar estructura de Piano para Guitarra, Canto, Teoría Musical. Cambios por aula:

**Guitarra:**
- Detección de pitch por micrófono en vez de MIDI (más margen de error, es normal)
- Interfaz similar, pero ejercicios de técnica de dedos vs púa

**Canto:**
- Detección de pitch por micrófono
- Rango vocal esperado (colorín indicador de si estás dentro/fuera del rango)
- Nota especial: Ejercicio 8.2 ("La Mirada Periférica") NO tiene video — fallback a guía de texto en `canto/curriculum.md`

**Teoría Musical:**
- Interactivos: quizzes, construcción de acordes, detección de intervalos por audio
- Menos necesidad de hardware, más UI de escritorio

### Fase 6: Integración Visual (Week 8–9)
1. Parallax 2D con Pixi.js:
   - 3-4 capas de profundidad (árboles, ramas, detalles "vivos")
   - Trigger en home → activa al hacer scroll
   - Referencia técnica: Rainforest Foods (Immersive Garden)
   - Detalles puntuales animados (ej. animal que reacciona al hover en puntos clave)

2. Momento 3D en hero (entrada):
   - Opcional MVP: saltar si hay constraint de tiempo
   - Si se implementa: WebGL simple (Babylon.js o Three.js), no geometría pesada
   - Referencia: Explore Primland — una sola cámara deslizándose, niebla atmosférica

3. Animaciones de transición (smooth scroll, fade-out audio bosque al entrar a aula)

4. Responsive design — prioritario mobile (Tailwind breakpoints)

### Fase 7: App Móvil (Post-MVP)
- React Native o Flutter, comparte backend Supabase
- Replica aulas (sin la home de marca, sin el bosque 3D — solo las 4 aulas)
- Suscripción compartida (mismo usuario, misma sesión en web y app)

---

## DECISIONES CLOSED — NO RE-NEGOCIABLES

### Producto & Contenido
- ✅ **Suscripción única:** AR$14.900/mes, acceso a 4 pilares (no se vende por instrumento)
- ✅ **4 aulas independientes:** Piano, Guitarra, Canto, Teoría. SIN orden global — alumno elige qué estudiar.
- ✅ **Límite de mensajes:** 400 msgs/mes por alumno, incluidos en suscripción. Refresco automático cada mes 1ro.
- ✅ **Videos:** Solo Bloque 1 de cada aula (primer contenido que ve alumno nuevo). Excepción: Canto Ejercicio 8.2 reemplazado con guía de texto (nunca se filmó, por decisión de usuario).
- ✅ **Copyright:** Todos los libros clasificados por status (`[DOMINIO PÚBLICO]` / `[DERECHOS VIGENTES]` / `[VERIFICAR]`). Cero uso de Spinetta u otros copyrighted sin licencia.

### Diseño Visual
- ✅ **"El Bosque Inversivo":** Parallax 2D liviano (Pixi.js) + 1–2 detalles "vivos" puntuales, NO geometría 3D real todo el tiempo.
- ✅ **Audio ASMR:** Gesto explícito ("Despertar el bosque 🌿"), sin autoplay, muted inside aulas, botón flotante de mute.
- ✅ **Tipografía:** Serif (Playfair Display, Cormorant Garamond, Lora) para poesía/títulos. Sans (Inter, Montserrat) para UI/ejercicios.
- ✅ **Accesibilidad:** Respetar `prefers-reduced-motion`.
- ✅ **Logo:** 2 versiones (principal 2000px, simplificado 1024px, ambos fondo blanco) — remover fondo en post-MVP si se pasa a Canva Pro.

### Tecnología & Seguridad
- ✅ **Tutores IA:** Claude Haiku, cost-optimized (~US$0.004–0.005 por mensaje). 4 tutores = 4 system prompts distintos (Maestro Allegro para Piano, etc.).
- ✅ **Seguridad de menores:** System prompts incluyen redirection de off-topic, no solicitar datos personales, detección de distress, tono apropiado.
- ✅ **Reportar errores:** Botón en cada chatbot → tabla `reportes_error` en Supabase → usuario puede ver estado de su reporte.
- ✅ **Mercado Pago:** Preapproval Plan API (suscripciones), webhook de notificaciones como única fuente de verdad para `subscription.status`.
- ✅ **Web Audio API:** Síntesis en vivo para piano (sin archivos pre-grabados), detección de pitch para guitarra/voz.

### Copywriting & Marca
- ✅ **Homepage:** 8 secciones confirmadas (Hero, Bio, Descripción, Frases poéticas, Taglines x4, Cierre comercial). Ver `08-copywriting-home.md`.
- ✅ **Contacto:** Instagram @davideugenio__ + WhatsApp +54 9 3564 688728 (con el 9 correcto para Argentina).
- ✅ **Foto de perfil:** "WhatsApp Image 2026-07-08 at 5.21.35 PM.jpeg" (retrato profesional, luz natural, fondo blanco).
- ✅ **Precio:** Competitivo (más barato que clase particular de piano en CABA, más barato en USD que Simply Piano, 4 pilares vs 1).

---

## CONSTRAINTS & GOTCHAS

### Backend
- **Supabase:** Asegurarse de que `mensajes_ia_consumo.mes` es reset automático cada 1ro de mes (puede ser trigger SQL o Edge Function).
- **Mercado Pago:** Webhook es ÚNICO origen de verdad para `subscription.status`. Nunca confiar en frontend.
- **CORS:** Supabase público por defecto, pero asegurar que los tokens tienen permisos RLS correctos (read/write solo datos propios).

### Frontend
- **Audio:** Autoplay está bloqueado por navegadores — REQUIERE gesto explícito ("Despertar el bosque"). No hay workaround.
- **Web Audio + MIDI:** Piano MIDI puede fallar en algunos navegadores/dispositivos — fallback a teclado clickeable siempre.
- **Performance mobile:** Parallax 2D optimizado (Pixi.js, no Three.js real-time). Probar en iPhone 6+ mínimo.
- **Responsive design:** Home + aulas deben funcionar en 320px (mobile) a 1920px (desktop).

### Contenido
- **Videos:** User ya filmó Bloque 1 (5 videos de 100–177 MB cada uno). Están en drive/archivos locales. Integración post-MVP.
- **Libros referencia:** No son contenido entregable — son fuente pedagógica interna. No necesitan estar en plataforma.
- **Ejercicios faltantes:** Bloque 1 está 100% definido. Bloque 2+ pueden desarrollarse en paralelo post-MVP.

---

## API INTEGRATIONS — CHECKLIST TÉCNICO

- [ ] Mercado Pago: Preapproval Plan creation + webhook receiver (Edge Function)
- [ ] Supabase Auth: email + Google/Apple OAuth
- [ ] Supabase RLS: restringir acceso a datos propios
- [ ] Web Audio API: síntesis piano + detección de pitch
- [ ] Web MIDI API: optional hardware input
- [ ] Claude API (Anthropic): Messages endpoint con system prompts customizados x4
- [ ] Pixi.js: parallax 2D + detalles animados
- [ ] Tipografía: importar desde Google Fonts (Playfair Display, Inter, etc.)

---

## ARCHIVOS A LEER PRIMERO (en orden)

1. **Este archivo** — kickoff general
2. **`10-modelo-de-contenido-y-progresion.md`** — ⚠️ CRÍTICO: cómo se estructura el material, cómo avanza el alumno, independencia estricta de aulas. Reglas de obligado cumplimiento.
3. **`01-arquitectura-contenido.md`** — sitemap, flujo de pago, schema Supabase
4. **`03-especificacion-diseno-bosque.md`** — diseño visual, referencias concretas, motion
5. **`04-tutores-ia-chatbot.md`** — system prompts, cost calc, safety guardrails
6. **`00-marca.md`** — brand identity, bio, contacto
7. **`08-copywriting-home.md`** — textos homepage (copiar/pegar)
8. **`piano/curriculum.md`** → primero a implementar — replicar estructura para otras aulas
9. **`02-assets-faltantes.md`** — qué necesitas vs qué ya está listo

---

## TIMELINE REALISTA (MPV)

- **Semanas 1–2:** Infraestructura + Auth + Mercado Pago
- **Semanas 2–3:** Home pública (hero, bio, menú aulas, copywriting)
- **Semana 3–4:** Pago + zona premium gated
- **Semanas 4–6:** Piano Bloque 1 (todos los tipos de ejercicios)
- **Semanas 6–8:** Guitarra + Canto + Teoría (replicar estructura)
- **Semanas 8–9:** Parallax visual + optimización mobile
- **Semana 10+:** Polish, testing, deploy

**Total MVP:** ~10 semanas (2.5 meses) si hay developer full-time.

---

## PREGUNTAS QUE CLAUDE CODE NO DEBE HACER

✅ **Si Claude Code pregunta algo de esto, la respuesta ya está decidida:**

- "¿Qué sistema de pago usamos?" → Mercado Pago, Preapproval Plan, webhook.
- "¿Cuántos mensajes por mes?" → 400, reseteado 1ro de mes, consumo trackado en DB.
- "¿Qué tecnología de audio?" → Web Audio API (síntesis) + Web MIDI API (opcional) + detección de pitch.
- "¿Cuántos bloques por aula?" → 5 (Fase Semilla, Fase Core, Fase Profunda, Fase Maestría, Bloque Especial).
- "¿Cómo se loguean?" → Supabase Auth (email + OAuth).
- "¿Qué pasa si se vence suscripción?" → `subscription.status` pasa a 'inactive', zona premium se lockea, pero datos persisten.
- "¿Cuál es el logo?" → 2 versiones en la carpeta, ambas PNG con fondo blanco.
- "¿Cuál es el nombre del tutor de IA?" → Maestro Allegro (Piano), Maestro Ritmo (Guitarra), Maestra Resonancia (Canto), Profesor Harmónico (Teoría).
- "¿Debo crear videos?" → No, user ya filmó Bloque 1. Tu job es integrar + optimizar, no grabar.

---

## ÚLTIMA NOTA

Todas las decisiones en este documento fueron validadas con el usuario. Ninguna es provisional ni "por discutir después". El proyecto está en 🟢 GO para desarrollar.

Los archivos de contenido en esta carpeta son el mapa completo. Síguelos en orden, implementa en fases, y communica cambios arquitectónicos solo si algo es realmente imposible (no "sería mejor si...").

**Bienvenido a Teclas Jade. A producir.** 🌿

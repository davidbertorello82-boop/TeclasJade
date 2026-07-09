# Teclas Jade — Paquete de Contenido Organizado

Este es el "estudio previo" del contenido de tu web/app, pensado para que lo abras directamente en Claude Code cuando arranques el diseño y desarrollo real. No es la web ni la app — es la materia prima ya limpia, estructurada y con una primera capa de decisiones de producto tomadas.

## Cómo está organizado

```
teclas-jade-content/
├── README.md                              (este archivo)
├── 00-marca.md                            identidad de marca, bio, método, eslogan
├── 01-arquitectura-contenido.md           sitemap (web pública + zona premium) y flujo de pago (Mercado Pago — cerrado)
├── 02-assets-faltantes.md                 qué falta y qué ya se resolvió, actualizado en cada etapa
├── 03-especificacion-diseno-bosque.md     diseño visual definitivo: "El Bosque Inversivo" (paleta, tipografía, motion design, con correcciones técnicas)
├── 04-tutores-ia-chatbot.md               los 4 tutores de IA por aula (system prompts, arquitectura, seguridad, costo)
├── 05-clasificacion-derechos-autor-libros.md   clasificación de los libros/partituras descargados: dominio público vs. derechos vigentes vs. a verificar
├── 06-guia-grabacion-videos.md             qué filmar del Bloque 1 de cada aula, en qué orden y cómo
├── 07-checklist-de-avance.md               lista simple de todo lo que falta, en orden — empezar por acá
├── 08-copywriting-home.md                  revisión sección por sección del texto de la home, con el hallazgo de derechos de autor en las frases poéticas
├── paleta-tipografia-propuesta.html       [DEPRECADO] mi primera propuesta de paleta — reemplazada por 03
├── piano/curriculum.md
├── guitarra/curriculum.md
├── canto/curriculum.md
└── teoria-musical/curriculum.md
```

Cada `curriculum.md` tiene el temario completo de ese instrumento/área, reorganizado por bloques/niveles, con cada ejercicio etiquetado como:
- `[DIGITAL-INTERACTIVO]` — se puede construir como interacción real de app.
- `[INSTRUCCIONAL-FISICO]` — queda como contenido guiado (texto/video), no autocalificable.
- `[HIBRIDO]` — mezcla de ambos.

## El hallazgo más importante para decidir el desarrollo

Sobre 149 ejercicios/conceptos catalogados en los 4 instrumentos:
- **~56% (83) son `[DIGITAL-INTERACTIVO]`** — se pueden construir como ejercicios reales con feedback automático (afinación por micrófono, MIDI de piano, quizzes de teoría, dictados de oído, metrónomos).
- **~28% (41) son `[HIBRIDO]`**.
- **~17% (25) son `[INSTRUCCIONAL-FISICO]`** — van a quedar como instrucción con video, nunca como ejercicio autocalificado, sin importar cuánta tecnología le pongas (dependen de que el alumno sienta algo en su propio cuerpo).

Esto es una buena noticia para tu visión de "app educativa interactiva de verdad": más de la mitad del contenido es genuinamente digitalizable, no es solo relleno de texto. Piano es el más fácil de digitalizar con precisión real (Web MIDI API si el alumno tiene teclado), teoría musical es el más fácil de gamificar (quizzes y dictados), y canto/guitarra dependen más de detección de audio (viable, pero menos exacta que MIDI).

## Cómo usar esto en Claude Code

1. Abrí esta carpeta (o cloná lo que quede en tu carpeta `TeclasJade/`) como contexto del proyecto.
2. Empezá por `00-marca.md` y `01-arquitectura-contenido.md` para que el diseño y el sitemap partan de decisiones ya tomadas, no de cero.
3. Usá los `curriculum.md` como fuente de verdad de contenido real para cada pilar — no hace falta que insertes todo de una, pero están completos y listos para ir cargando pantalla por pantalla.
4. Revisá `02-assets-faltantes.md` antes de prometer funcionalidades (como el piano interactivo o el reconocimiento de voz) — ahí está lo que falta conseguir/grabar/definir primero.
5. Las decisiones abiertas (modelo de pago en Mercado Pago, si el acceso es por pilar o completo, estilo visual/3D concreto) están marcadas explícitamente donde corresponde — convendría cerrarlas antes de empezar a codear, no durante.

## Lo que este paquete NO incluye (todavía)

- Fotos, logo, ni assets visuales de marca.
- Audio grabado o generado.
- Videos demostrativos.
- Ninguna decisión de stack técnico definitiva (eso se define en Claude Code, no acá).

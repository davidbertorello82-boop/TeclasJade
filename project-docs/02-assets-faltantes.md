# Assets faltantes para armar la web/app (Fase de diseño, previa a Claude Code)

Esto es lo que el contenido de texto NO incluía y hacía falta antes o durante el armado en Claude Code. Después de esta sesión, casi todo está cerrado — al final del documento queda la lista corta de lo único que sigue dependiendo de vos.

## Para el diseño visual / marca — DECIDIDO

- **Logo principal** (header, web, "Sobre mí"): clave de sol de enredaderas en verde jade + "Teclas Jade" en destellos dorados. Diseño editable en Canva: [editar](https://www.canva.com/d/DIpNVzr97hax-yV) / [ver](https://www.canva.com/d/XI1VIUL05vVDJMS). Link de descarga PNG re-generado el 09/07 (2000px): [descargar](https://export-download.canva.com/NoFhg/DAHO1VNoFhg/-1/0/0001-6259386554546699918.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260709%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260709T112400Z&X-Amz-Expires=23960&X-Amz-Signature=26609ba1dc8b8b28be6d16993b8d669cbd060a8ac97230fc3a14dbd0b3621c39&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Thu%2C%2009%20Jul%202026%2018%3A03%3A20%20GMT) (⚠️ vence pocas horas después de generado — si ya venció, pedime que lo re-exporte de nuevo, es un paso de un segundo).
- **Logo simplificado** (favicon, ícono de app): silueta limpia sin detalle de enredaderas. Diseño editable en Canva: [editar](https://www.canva.com/d/OOl3OS6ajOtaPPp) / [ver](https://www.canva.com/d/IR5yJlM64oYwqV3). Link de descarga PNG re-generado el 09/07 (1024px): [descargar](https://export-download.canva.com/0bNx8/DAHO1W0bNx8/-1/0/0001-7788358628418498360.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260709%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260709T114731Z&X-Amz-Expires=20964&X-Amz-Signature=6b84ccf69ee8e32dc82bb85396eacb1edab4f35a3e60b1e3d90fd9d18d873199&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Thu%2C%2009%20Jul%202026%2017%3A36%3A55%20GMT) (⚠️ vence pocas horas después de generado — avisame y lo regenero al toque si se vence).
  - **Nota real:** tu cuenta de Canva es plan Free, así que no pude exportar con fondo transparente (Canva lo bloquea en el plan gratuito) — ambos PNG tienen fondo blanco sólido. Para la versión final con transparencia, Claude Code puede quitar el fondo blanco con una herramienta simple (remove.bg, o directamente en el editor de imágenes), o si en algún momento pasás a Canva Pro, ahí sí exportás con transparencia de una.
- **Foto para "Sobre mí"** — miré las 5 fotos de tu carpeta `Fotos de mi rostro real/` (son 5, no 6 como había dicho antes — corrijo el número). Mi recomendación directa: usá **"WhatsApp Image 2026-07-08 at 5.21.35 PM.jpeg"** (la de fondo blanco liso, remera oscura lisa, mirada directa a cámara) — es la única con calidad de retrato profesional real: buena luz, sin distracciones de fondo, expresión serena. Las otras 4 son buenas para redes sociales (la del río con sombrero tiene onda, la que estás acostado en el pasto es un screenshot de un reel con la interfaz del celular metida en la foto, no sirve tal cual) pero no tienen el nivel de "foto de perfil profesional" que necesita el "Sobre mí". Si querés una segunda foto para algún otro rincón de la web (ej. "en mi estudio"), la del selfie con el equipo de música de fondo es la que más contexto de marca aporta, aunque la luz es más floja.
- Paleta de colores y tipografía — **DECIDIDO**: ver `03-especificacion-diseno-bosque.md`.
- Concepto visual y arquitectura de la home — **DECIDIDO**: "El Bosque Inversivo", ver `03-especificacion-diseno-bosque.md`.
- Referencias visuales concretas de sitios 3D/animación — **DECIDIDO (10/07)**, ver `03-especificacion-diseno-bosque.md` sección 5: modelo híbrido (momento 3D puntual en la entrada + resto del scroll en paralaje 2D liviano con detalles "vivos" puntuales), con 3 referencias concretas (Explore Primland, Rainforest Foods, The Law of the Jungle) cada una con un rol técnico distinto.

## Copywriting de la home — PENDIENTE (lo escribís vos, yo lo reviso después)

Sin cambios respecto a lo que ya charlamos: vas a escribir vos los textos/mensajes/biografías (tu voz) y yo los reviso cuando los tengas. Checklist de lo que necesito, sección por sección:

1. Hero: título principal y subtítulo.
2. Texto del gesto de entrada (botón que dispara el primer sonido).
3. Bio final pulida (reemplaza el borrador de `00-marca.md`).
4. Descripción de la plataforma.
5. Frases poéticas por sección del scroll.
6. Texto corto de presentación para cada uno de los 4 troncos.
7. Texto de venta del cierre comercial + texto del botón de suscripción.
8. Contacto completo (ver más abajo).

## Para la interactividad real (audio, MIDI, video) — DECIDIDO

- **Audio de referencia (canto/guitarra)** — decisión cerrada: en vez de grabar y almacenar archivos de audio para cada tono/escala/patrón rítmico, se **generan en vivo con Web Audio API** (un sintetizador simple corriendo en el navegador), la misma técnica que ya está definida para los "Dictados Musicales en Vivo" de Logos en `04-tutores-ia-chatbot.md`. Esto elimina la necesidad de grabar cientos de archivos de audio de referencia — ya no es un asset que falte, es una decisión técnica que Claude Code puede implementar directo.
- **Video demostrativo** (ejercicios `[INSTRUCCIONAL-FISICO]`) — esto sigue siendo una tarea de producción real tuya (grabarte haciendo el ejercicio), no hay forma de resolverlo con IA porque es literalmente vos demostrando tu propio método. Alcance decidido para no abrumarte: **arrancá solo por el Bloque 1 ("Fase Semilla") de cada una de las 4 aulas** — es lo que va a ver un alumno nuevo primero, el resto de los bloques se graba después, en paralelo al desarrollo.
- **Piano MIDI** — decisión cerrada: el teclado virtual táctil/clickeable es el fallback por defecto (funciona sin hardware), con conexión real vía Web MIDI API como mejora opcional para quien tenga teclado propio. No hace falta resolver nada más acá.
- **Guitarra** — decisión cerrada: detección de pitch por micrófono, aceptando que tiene más margen de error que el MIDI de piano. Tampoco requiere ninguna decisión adicional.

## Sobre los libros de referencia — ver `05-clasificacion-derechos-autor-libros.md`, con 2 hallazgos nuevos

- **Confirmado (no sospecha, certeza):** abrí los 2 archivos de 4173 bytes que habíamos marcado como "posiblemente corruptos" (el de Leavitt en guitarra y el "Volumen 1" de Zamacois en teoría musical) — **ninguno de los dos es el libro real**. Ambos son la misma página de error de servidor PHP de pdfcoffee.com ("No space left on device") guardada por error con extensión .pdf durante la descarga. Si los querés de verdad como referencia personal, hay que volver a descargarlos desde cero — el archivo que tenés hoy no sirve ni para eso.
- **Confirmado:** "El libro de Jazz Piano Mark Levine.pdf" y "El Libro del Jazz Piano de Mark Levine (Capítulo 2).pdf" pesan exactamente lo mismo (36.358.030 bytes) — es el mismo archivo duplicado con otro nombre, no dos libros distintos. Podés borrar uno de los dos sin perder nada (no borro archivos yo mismo desde acá — te lo dejo a vos o me pedís que te arme los pasos si querés hacerlo).
- El resto de la clasificación ([DOMINIO PÚBLICO] / [DERECHOS VIGENTES] / [VERIFICAR]) queda igual que en `05-clasificacion-derechos-autor-libros.md`.

## Sobre Mercado Pago — DECIDIDO
Ver `01-arquitectura-contenido.md`: suscripción mensual **AR$14.900** (actualizado 10/07, era AR$9.900), un solo paquete con los 4 pilares, cuenta de developer y credenciales de prueba ya obtenidas.

## Sobre los tutores de IA — ver `04-tutores-ia-chatbot.md`
Los 4 tutores, el proveedor (Claude, Haiku para arrancar), la gestión de menores por adulto responsable, y el límite de 300 mensajes/mes por alumno: todo **DECIDIDO**, sin nada pendiente en este frente.

## Progresión de contenido por aula — DECIDIDO
Ver `01-arquitectura-contenido.md`: las 4 aulas son independientes entre sí, cada una con su propio ingreso y su propia barra de progreso — no hay orden global único.

## Lo único que sigue realmente pendiente (y depende solo de vos)

1. **Contacto completo**: hoy solo está confirmado Instagram (@davideugenio__) — decidí si sumás mail y/o WhatsApp, y con qué datos exactos.
2. **Referencias visuales propias** de 3D/animación (ver arriba).
3. **Copywriting de la home** en tu voz (ver checklist arriba).
4. **Grabar los videos** del Bloque 1 de cada aula (producción real, sin apuro).
5. **Descargar de nuevo** los 2 archivos rotos y decidir si borrás el PDF duplicado de Mark Levine.
6. Bajar los 2 PNG del logo antes de que venzan los links (son temporales).

Nada de esta lista bloquea arrancar en Claude Code — son mejoras que se van sumando en paralelo.

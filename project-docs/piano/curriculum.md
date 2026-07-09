# Piano — Teclas Jade: Curriculum Base

> Fuente: "Contenido Piano.docx" (guía académica en Bloques I–V + reformulación bajo la "Matriz Arqueológica").
> Este documento es la base de contenido para diseño de producto de la app/web educativa. Prioriza estructura y factibilidad técnica sobre prosa.
>
> Cada ejercicio incluye una **etiqueta de factibilidad técnica**:
> - `[DIGITAL-INTERACTIVO]`: convertible en interacción real de app (requiere tecnología específica, indicada en cada caso).
> - `[INSTRUCCIONAL-FISICO]`: depende de autopercepción física/visual no verificable por software de forma confiable. Se presenta como instrucción o video demostrativo, no como ejercicio autocalificado.
> - `[HIBRIDO]`: combina una parte digitalizable con una parte de autopercepción física.

---

## Índice de Bloques (Niveles)

| Bloque | Nombre | Tagline de mentalidad | A quién apunta |
|---|---|---|---|
| I | Fase Semilla | "La Gravedad y el Tacto: el instrumento como extensión del cuerpo." | Niños/as y principiantes absolutos, sin conocimientos previos (equivalente académico: Pre-Inicial/Inicial). |
| II | Fase Conectiva / Core | "La Bifurcación Consciente: de la simetría clásica al síncope popular." | Estudiantes con lectura fluida que empiezan a bifurcar entre tradición clásica (Bach, sonatas) y música popular/jazz (cifrado, ii-V-I). |
| III | Fase de Especialización Exigente | "La Arquitectura Invisible: el control absoluto del detalle frente al virtuosismo estructural." | Estudiantes intermedio-avanzados: alta técnica (Czerny Op. 740, Cramer-Bülow), jazz avanzado (rootless voicings, bebop, 12 tonalidades). |
| IV | Fase de Consolidación y Práctica Profesional Avanzada | "La Simbiosis Escénica: el piano como catalizador colectivo y puente profesional." | Pianistas avanzados orientados a inserción laboral: acompañamiento vocal/instrumental, arreglos, ensamble, reducción de partituras. |
| V | Fase de Trascendencia y Virtuosismo Absoluto | "El Límite Físico Desmaterializado: la disolución de la técnica en pura intención artística." | Nivel superior / concertista (perfil Juilliard-Curtis-Berklee): repertorio monumental, jazz de vanguardia, pedagogía y dirección. |

---

## BLOQUE I: Fase Semilla

### 1. Mapa Ciego del Teclado
**Concepto:** El teclado es un mapa táctil, no visual. Los grupos de teclas negras (2 y 3) funcionan como faros para ubicar cualquier nota sin mirar las manos.
**Metodología:**
- Sentarse con espalda recta, ojos cerrados.
- Deslizar la mano por el teclado sin presionar, sintiendo los grupos de teclas negras.
- Ubicar el Do como la tecla blanca inmediata a la izquierda de un grupo de 2 negras.
**Autoevaluación:** Tocar a ciegas la nota que se cree es Do, luego abrir los ojos y verificar la posición del dedo.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — con teclado MIDI conectado (Web MIDI API) la app puede verificar en tiempo real qué nota exacta tocó el alumno y confirmar si es Do, sin depender de que el alumno "se dé cuenta" solo.

### 2. El Molde de Arcilla (Posición de 5 dedos)
**Concepto:** La mano tiene una forma natural de descanso curva; ese molde, sin tensión, es la posición correcta sobre las teclas. Se logra dejando caer el peso del brazo, no empujando.
**Metodología:**
- Colocar dedos 1-5 sobre Do-Re-Mi-Fa-Sol.
- Levantar el brazo ~5 cm desde el codo y dejarlo caer con peso relajado.
**Autoevaluación:** "Test de la falange": si la primera articulación del dedo se dobla hacia adentro (cóncava) al caer el peso, hay tensión; debe mantenerse arqueada (convexa).
**Factibilidad:** `[INSTRUCCIONAL-FISICO]` — es una observación visual/kinestésica de la propia mano (forma de la articulación); no verificable de forma confiable por software estándar. Presentar como video demostrativo con indicación de qué mirar.

### 3. El Espejo de Agua (Movimiento contrario)
**Concepto:** El cerebro procesa más rápido el movimiento simétrico que el paralelo; el movimiento contrario programa la coordinación bilateral.
**Metodología:**
- Ambos pulgares sobre el Do central, metrónomo a 60 PPM.
- Tocar simétricamente hacia afuera y volver, con ambas manos a la vez.
**Autoevaluación:** "Clic de coincidencia": el impacto de ambas manos debe sonar como un único golpe; si se oyen dos sonidos separados, no están coordinadas.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API puede capturar el timestamp exacto de cada nota y medir la diferencia en milisegundos entre ambas manos, dando feedback objetivo de sincronización (alternativa sin MIDI: detección de onsets por Web Audio API/micrófono, menos precisa).

### 4. El Diálogo Compartido (Ensamble a 4 manos)
**Concepto:** Tocar en conjunto obliga a sostener el pulso real, delegando el ritmo a un factor externo (profesor o pista) en vez de auto-regularlo.
**Metodología:**
- Tocar una melodía simple sobre una pista de acompañamiento (ej. Beyer Op. 101, Diabelli Op. 149).
- Entrar exactamente en el primer tiempo del compás y no detenerse ante errores.
**Autoevaluación:** El éxito es "no detenerse": si se corrige un error deteniendo el flujo, se pierde el ejercicio; hay que reincorporarse en el siguiente pulso fuerte.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — requiere pista de acompañamiento sincronizada + Web MIDI API (o detección de audio) para medir continuidad rítmica del alumno contra la grilla de tiempo de la pista.

### 5. Laboratorio: Improvisación en Teclas Negras
**Concepto:** Usando solo la escala pentatónica de teclas negras (sin semitonos disonantes), cualquier combinación suena armónica — ideal para la primera experiencia de improvisación libre.
**Metodología:**
- Mano izquierda sostiene un acorde con las 3 teclas negras graves.
- Mano derecha improvisa libremente entre las teclas negras agudas.
**Autoevaluación:** No hay error posible dentro de la escala; el criterio es exploratorio (experimentar distancias y ritmos).
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — sandbox de piano virtual (Web Audio API/soundfont, o teclado MIDI real) restringido a teclas negras; ideal como "modo libre" gamificado sin necesidad de calificación.

---

## BLOQUE II: Fase Conectiva / Core

### 1. Notas Guía (3ras y 7mas)
**Concepto:** En jazz/popular, la esencia armónica de un acorde vive en su 3ra y 7na. Aislarlas permite un "voice leading" (conducción de voces) mínimo entre acordes.
**Metodología:**
- Progresión ii-V-I en Do Mayor (Dm7 - G7 - Cmaj7).
- Aislar 3ra+7ma en la mano izquierda; mover solo la nota necesaria (mínima distancia) entre acordes.
**Autoevaluación:** "Test del mínimo esfuerzo": solo una nota debe moverse (un semitono) al cambiar de acorde; si la mano salta entera, se rompió la conducción.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — con Web MIDI API la app puede capturar las notas tocadas en cada acorde y calcular automáticamente la distancia de voice leading entre acordes consecutivos.

### 2. Acorde Invertido en Bloque
**Concepto:** Invertir un acorde es reordenar sus "pisos" para poder tocarlo cerca, sin saltos largos en el teclado.
**Metodología:**
- Construir G7 en posición fundamental y recorrer todas sus inversiones subiendo.
**Autoevaluación:** El impacto debe sonar como un bloque unificado; si se oye "arpegio/cascada" (una nota antes que las otras), el ataque no fue simultáneo.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API mide el timestamp de cada nota del acorde y detecta si el ataque de las 4 notas cae dentro de una ventana de simultaneidad aceptable.

### 3. La Gravedad de la Resolución (V7 → Imaj7 con tritono)
**Concepto:** El acorde dominante genera tensión máxima (tritono) que "gravita" hacia la resolución en la tónica.
**Metodología:**
- Tocar el tritono Fa-Si de G7, luego resolver por semitonos hacia Mi-Do de Cmaj7.
- Cantar la nota de tensión y su resolución.
**Autoevaluación:** Si al cantar se siente la necesidad natural de bajar hacia la nota de reposo, el oído decodificó correctamente la tensión tonal.
**Factibilidad:** `[HIBRIDO]` — la afinación de lo cantado es verificable digitalmente (detección de tono por micrófono, Web Audio API/algoritmo de pitch detection tipo YIN/autocorrelación); pero la percepción subjetiva de "sentir el tirón hacia el reposo" es autopercepción no medible por software.

### 4. Ritmo Disociado (Mente Dividida)
**Concepto:** Tocar jazz/popular exige disociar el cerebro: mano izquierda estable como metrónomo humano, mano derecha libre e improvisada.
**Metodología:**
- Swing a 80 PPM. Mano izquierda marca tiempos 1 y 3 con notas guía, sin variar.
- Mano derecha improvisa/sincopa con libertad.
**Autoevaluación:** "Test de la mano dictadora": si la izquierda se adelanta, atrasa o se detiene por imitar a la derecha, la disociación falló.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API puede analizar por separado el timing de cada mano (canal/registro) contra la grilla del metrónomo y detectar desvíos cuando la mano derecha se activa.

### 5. Laboratorio: Walking Bass y Rootless Voicings
**Concepto:** Introduce la física del comping moderno: acordes sin tónica (la cubre el bajo) y anticipación rítmica para generar groove.
**Metodología:**
- Pista de walking bass en Do Mayor.
- Mano izquierda toca voicing flotante (ej. Mi-La-Si-Re); experimentar tocando levemente antes del tiempo fuerte.
**Autoevaluación:** Exploratoria: comparar cómo cambia la energía del groove según el desplazamiento rítmico.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — reproducción de pista base + captura MIDI del acorde y su desplazamiento temporal respecto al click, para visualizar el "feel" de anticipación.

---

## BLOQUE III: Fase de Especialización Exigente

### 1. Alteración Cromática de Tensión (9na menor)
**Concepto:** La 9na menor agrega un color oscuro y sofisticado al acorde dominante antes de resolver.
**Metodología:**
- Mano izquierda: 3ra+7ma de G7. Mano derecha: aislar y sostener Ab (9na menor), luego resolver un semitono hacia Sol.
**Autoevaluación:** Sostener 5 segundos; debe sonar disonante y punzante. Si suena "blando", probablemente se tocó la 9na mayor (La) por error.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API verifica la nota exacta tocada (Ab vs. A natural), permitiendo detectar automáticamente el error típico descrito.

### 2. Bloque Flotante (Rootless Voicings Formas A/B)
**Concepto:** Sin la tónica (la cubre el bajista), el pianista reorganiza las notas internas para un sonido moderno y liviano.
**Metodología:**
- ii-V-I en Do Mayor con Forma A, moviendo el mínimo espacio posible entre acordes.
**Autoevaluación:** Grabar y escuchar; no debe haber saltos de posición mayores a una 4ta entre acordes consecutivos.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API puede calcular el "centro" de cada voicing y medir el salto de posición entre acordes consecutivos automáticamente, sin depender del oído del alumno.

### 3. Matriz Modulatoria de las 12 Tonalidades
**Concepto:** Entrenar el mismo patrón armónico en las 12 tonalidades para eliminar "tonalidades enemigas".
**Metodología:**
- Metrónomo a 70 PPM. Ejecutar ii-V-I (Forma A) y trasladarlo tono a tono por las 12 tonalidades sin detener el pulso.
**Autoevaluación:** "Test de la vacilación": frenar el metrónomo, dudar más de medio segundo o mirar fijo las manos = fallo.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — metrónomo digital + Web MIDI API detectan huecos de tiempo entre acordes esperados y reales, cuantificando la vacilación con precisión objetiva.

### 4. Línea Polifónica Sincronizada (Rootless + Bebop)
**Concepto:** Fusiona el rigor armónico clásico con la fluidez del bebop: mano izquierda estricta, mano derecha improvisando líneas complejas.
**Metodología:**
- Mano izquierda: voicings flotantes en contratiempo. Mano derecha: corcheas continuas con notas de paso cromáticas.
- Mantener hombros y muñecas sueltos.
**Autoevaluación:** Grabarse en video/espejo; si la izquierda imita el ritmo de la derecha, o hay tensión visible en cuello/mandíbula, detener la práctica.
**Factibilidad:** `[HIBRIDO]` — la independencia rítmica entre manos es medible vía Web MIDI API (comparando timing de cada mano); la tensión muscular visible (cuello/mandíbula) requiere autopercepción visual/video, no verificable por software de forma confiable.

### 5. Laboratorio: Improvisación Bebop (escala + lick + encapsulamiento)
**Concepto:** Construir líneas de improvisación fluidas con la Escala Bebop Dominante (8 notas, con nota de paso cromática) para que las notas del acorde caigan en los tiempos fuertes.
**Metodología:**
- Practicar la escala de 8 notas sobre G7.
- Aprender un "lick" clásico de 8 notas (descenso cromático + salto + ascenso).
- Aplicar un "encapsulamiento" (nota arriba, nota abajo, aterrizaje) sobre la nota destino del acorde siguiente.
- Integrar todo sobre una pista base G7–Cmaj7 en bucle.
**Autoevaluación:** Precisión rítmica (notas del acorde en tiempos fuertes) y limpieza del encapsulamiento al resolver.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — comparación nota-a-nota y timing contra el patrón esperado vía Web MIDI API, con pista base reproducida por Web Audio API; ideal para un "entrenador de licks" con scoring automático.

---

## BLOQUE IV: Fase de Consolidación y Práctica Profesional Avanzada

### 1. Respiración Lírica y Rubato Acompañante
**Concepto:** Acompañar a un cantante o instrumentista de viento exige "respirar" con las manos, flexibilizando el tiempo antes de momentos clave, para no asfixiar al solista.
**Metodología:**
- Levantar las muñecas antes de cada frase vocal (simulando inhalación).
- Retrasar levemente el acorde en el clímax, dejando que el solista exponga la nota primero.
**Autoevaluación:** Grabar la sesión; el acorde no debe coincidir con la consonante explosiva del cantante (ej. "P"/"T"), sino entrar en la vocal siguiente.
**Factibilidad:** `[INSTRUCCIONAL-FISICO]` — depende de tocar junto a un cantante/instrumentista real y de un juicio musical/expresivo subjetivo (la "sensación de asfixiar o no" al solista); no es auto-calificable por software de forma confiable. Presentar como ejercicio guiado/video, idealmente en clase con partner real.

### 2. Acorde Bloque Orquestal (Block Chords y Stride)
**Concepto:** El piano solista se convierte en una "big band": melodía duplicada en los extremos, relleno armónico denso, bajo tipo stride en la izquierda.
**Metodología:**
- Mano derecha: melodía duplicada a la octava (dedos 1 y 5), relleno interno con dedos 2-3-4.
- Mano izquierda: patrón stride (tónica grave en tiempo 1, acorde en registro medio en tiempo 2).
**Autoevaluación:** "Test del equilibrio tímbrico": la nota melódica (dedo 5) debe llevar ~60% del peso/volumen; las notas internas deben sonar como murmullo.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — un teclado MIDI capta la velocity (intensidad) de cada nota individual dentro del acorde; la app puede verificar si la nota superior tiene mayor velocity relativa que las internas.

### 3. Reducción de Partituras en Tiempo Real
**Concepto:** Ante una partitura orquestal/coral completa, el pianista debe extraer la "columna vertebral" (bajo + melodía) a primera vista, ignorando el resto, sin detener el pulso.
**Metodología:**
- Leer una partitura a 4 voces nunca vista. Metrónomo a 60 PPM.
- Seguir visualmente solo la línea superior (soprano) e inferior (bajo); rellenar voces medias solo si es cómodo.
**Autoevaluación:** El pulso no debe detenerse aunque se toquen notas erróneas; detenerse a corregir una voz interna = fallo.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — requiere partituras digitalizadas (music notation renderer) + Web MIDI API para medir continuidad del pulso del alumno contra el metrónomo, independientemente de la exactitud de notas.

### 4. Ensamble de Cámara Dinámico
**Concepto:** El pianista debe calibrar su fuerza física según el instrumento acompañante (contrabajo, violín, voz), para no aplastar sonidos acústicos más débiles.
**Metodología:**
- Tocar en trío real; reducir dinámica en solos de contrabajo, usar toque más plano cuando lidera el violín.
**Autoevaluación:** Preguntar al compañero músico si tuvo que forzar su volumen para competir con el piano.
**Factibilidad:** `[INSTRUCCIONAL-FISICO]` — depende de tocar con músicos acústicos reales en una sala y de feedback verbal humano; no verificable por software (requiere juicio de balance sonoro entre instrumentos físicos distintos).

---

## BLOQUE V: Fase de Trascendencia y Virtuosismo Absoluto

### 1. Tensión Alterada Simétrica (escala alterada extrema)
**Concepto:** Control del color armónico exótico de acordes dominantes con todas las tensiones alteradas (b9, #9, #11, b13), rozando la atonalidad.
**Metodología:**
- Mano izquierda: C7 base. Mano derecha: micro-motivo sobre la escala menor melódica de Reb (tensiones máximas de C7), con ataque tipo "gato" (arañado, veloz).
**Autoevaluación:** El sonido debe evocar tensión estilizada (referencia: Ravel, Herbie Hancock); si suena sucio o a error, revisar precisión de semitonos.
**Factibilidad:** `[HIBRIDO]` — qué notas exactas se tocaron es verificable vía Web MIDI API (pitch-check contra la escala esperada); pero el juicio de "sonido limpio/cristalino vs. sucio" es una evaluación tímbrica/estética subjetiva no medible de forma confiable con un teclado MIDI estándar.

### 2. Polifonía de Estructuras Superiores (Upper Structures)
**Concepto:** La mano derecha toca una tríada simple mientras la izquierda sostiene un acorde distinto; la combinación genera una armonía extendida sofisticada (ej. C7(9,#11,13)) sin que cada mano "piense" en esa complejidad.
**Metodología:**
- Mano izquierda: esqueleto de C7 (Sib-Mi). Mano derecha: arpegio de tríada de Re Mayor.
**Autoevaluación:** "Test de la separación mental": la mano izquierda no debe desviarse hacia la tonalidad que toca la derecha.
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — Web MIDI API verifica que las notas de cada mano se mantengan exactamente dentro de su conjunto de pitch-classes esperado durante todo el ejercicio (detección de "deriva" de afinación/tonalidad).

### 3. Modulación Métrica y Amalgama Asimétrica (7/8, polirritmia)
**Concepto:** Internalizar compases asimétricos (7/8, 11/8) como algo tan natural como caminar, incluso bajo polirritmias complejas.
**Metodología:**
- Metrónomo en 7/8 (2+2+3). Mano izquierda marca acentos de grupo (tiempos 1, 3, 5). Mano derecha ejecuta polirritmias (3 contra 4) libremente.
**Autoevaluación:** "Test del pie humano": el pie debe marcar el pulso irregular de forma automática; si titubea o cae en un 4/4 recto, no está internalizado.
**Factibilidad:** `[HIBRIDO]` — la precisión rítmica de ambas manos contra la grilla de 7/8 es medible vía Web MIDI API; el chequeo específico de "el pie mantiene el pulso" requiere observación visual/video o un sensor de movimiento, fuera del alcance de un teclado MIDI estándar.

### 4. Dirección de Ensambles desde el Teclado
**Concepto:** Autosuficiencia escénica máxima: liderar un ensamble con gestos corporales (cabeza, mirada, torso) mientras se ejecutan pasajes virtuosos.
**Metodología:**
- Usar gestos de brazos/torso para marcar entradas antes de tocar.
- Guiar cortes de sección con mirada y movimientos de cabeza durante pasajes de máxima velocidad.
**Autoevaluación:** Filmarse de frente; los gestos deben ser lo suficientemente claros para que un músico externo entienda cuándo entrar o cortar.
**Factibilidad:** `[INSTRUCCIONAL-FISICO]` — evaluar la claridad de gestos de dirección requiere juicio visual humano (o visión por computadora avanzada, no confiable/fuera de alcance de una v1); se presenta como ejercicio de autograbación con checklist, no autocalificado.

### 5. Laboratorio: Rearmonización Cinematográfica y Rubato Libre
**Concepto:** Fusiona los Bloques IV y V: tomar una melodía infantil simple e inyectarle voicings flotantes con tensiones alteradas más un rubato extremo, transformándola en una pieza de nivel concertista.
**Metodología:**
- Tomar una melodía simple (ej. Fray Jacobo, Minuet en Sol de Bach).
- Reemplazar la armonía original por rootless voicings con tensiones alteradas.
- Aplicar rubato extremo (estirar y comprimir el tiempo libremente).
**Autoevaluación:** Exploratoria/artística: el resultado debe sonar transformado, sofisticado; no hay un único "correcto".
**Factibilidad:** `[DIGITAL-INTERACTIVO]` — el mecanismo técnico (tocar los voicings correctos, capturar el rubato como variación de tempo) es verificable vía Web MIDI API; el juicio final de calidad artística queda como evaluación cualitativa (del docente o del propio alumno), no bloqueante para la interacción digital.

---

## Bibliografía

### I. Métodos de Iniciación, Pedagogía Infantil y Piano a Cuatro Manos (Bloque I)
- **Ferdinand Beyer** — Op. 101, *Escuela preliminar de piano* (Vorschule im Klavierspiel). Método base de iniciación pre-inicial/inicial.
- **Louis Köhler** — Op. 218, *Primeras lecciones para piano*; Op. 210, *Primer álbum para niños*; Op. 243, *El amigo de los niños*. Estudios técnicos progresivos de iniciación.
- **Carl Czerny** — Op. 599, *El primer maestro de piano* (Erster Lehrmeister). Estudios mecánicos de iniciación.
- **Béla Bartók** — *Mikrokosmos* (Vols. I–V). Iniciación y desarrollo polifónico progresivo, usado en múltiples niveles.
- **Russo-Floriani** — *Excólere*, compendio de piezas progresivas para piano (Vols. I y II). Polifonía progresiva alternativa a Bartók.
- **Anton Diabelli** — Op. 149, *Trozos melódicos para piano a 4 manos*; Op. 150, *Sonatas Mignones a 4 manos*. Práctica de ensamble.
- **Heinrich Wohlfahrt** — Op. 87, *El amigo de los niños* (Der Kinderfreund), a 4 manos. Práctica de ensamble infantil.
- **Jean-Baptiste Duvernoy** — Op. 314, *La Emulación*, piezas a 4 manos. Práctica de ensamble.
- **R. Kurzmann Leuchter** — *Enseñanza elemental del piano* (Tomos I y II). Repertorio de piezas fáciles y canciones infantiles.
- **Violeta Hemsy de Gainza** — *Método para piano* (Tomos 1a–2b); *Piezas fáciles de los siglos XVII y XVIII*; *Nuestro amigo el Piano*. Método argentino de referencia para iniciación.
- **Tchokov-Gemiu** — *El Piano: Iniciación a la música*. Método de iniciación.
- **Charles Hervé & Jacline Pouillard** — *Méthode de Piano pour Débutants*. Método de iniciación francés.
- **Denes Agay** — *The Joy of First Year Piano*; *The Joy of First Classics*; *Playing Sonatinas*. Serie de iniciación y sonatinas en inglés.
- **A. Scott & G. Turner** — *Piano Method for Young Beginners* (Book I). Método de iniciación para niños.
- **John Thompson** — *Enseñando a tocar a los deditos* (Teaching Little Fingers to Play); *Curso moderno para Piano* (Partes I y II). Método clásico de iniciación infantil.
- **James Brimhall** — *The Primer to the Piano Method*; *The John Brimhall Piano Method* (Libros I y II). Método de iniciación.
- **Michael Aaron** — *Piano: The First Steps*; *Curso para Piano* (Libros I y II). Método de iniciación.
- **John W. Schaum** — *Schaum Piano Course* (Vols. I–IV); *Rhythm & Blues: Jazz para niños*. Iniciación con introducción a estilos sincopados.
- **Bernice Frost** — *Companion Series* (Book I). Método complementario de iniciación.
- **A. Nikolaev** — *Escuela rusa de piano* (Libros Ia y Ib). Iniciación bajo tradición pedagógica rusa.
- **Benno Widmer** — *Kosmos Latinoamericano para piano* (Vol. I). Repertorio de iniciación con raíz latinoamericana.
- **Beniamino Cesi** — *40 ejercicios melódicos para piano a 4 manos*. Recopilación pedagógica sobre Czerny y Diabelli.
- **H. Enke** — *12 piezas melódicas para piano a 4 manos*, Op. 6 y Op. 8. Repertorio de ensamble infantil.
- **C. K. De Scher** — *Tres miniaturas para piano*. Repertorio de iniciación.
- **Jorge Sanmartino** — *Milonga para piano a 4 manos*. Repertorio de ensamble con raíz folklórica.
- **D. Kumok** — *7 piezas progresivas para piano* (incluye *Jugando* y *Evocación Norteña*). Repertorio progresivo de iniciación.

### II. Alta Técnica, Mecanismo Estricto y Estudios de Virtuosismo (Bloques II–V)
- **Carl Czerny & Heinrich Germer** — *Czerny-Germer: 50 Estudios Seleccionados* (Vol. 1, Partes 1 y 2). Puente técnico entre iniciación e intermedio.
- **Charles-Louis Hanon** — *El Pianista Virtuoso en 60 Ejercicios* (Le Pianiste virtuose). Mecanismo puro/calentamiento, columna vertebral técnica de todo el programa.
- **Carl Czerny** — Op. 299, *La Escuela de la Velocidad* (Schule der Geläufigkeit); Op. 740, *El Arte de flexibilizar los dedos* (Die Kunst der Fingerfertigkeit); Op. 103, *Tres Sonatinas*. Estudios progresivos de velocidad y mecanismo avanzado.
- **Stephen Heller** — Op. 45, *25 Estudios introductorios*; Op. 46, *30 Estudios progresivos*. Estudios de expresión y velocidad, nivel intermedio.
- **Béla Bartók** — *Ejercicios Técnicos para Piano*. Mecanismo complementario.
- **Johann Baptist Cramer & Hans von Bülow** — *60 Estudios Seleccionados* (Cramer-Bülow). Estudios de alta escuela, nivel intermedio-avanzado.
- **Muzio Clementi** — *Gradus ad Parnassum*. Estudios de virtuosismo, nivel avanzado.
- **Moritz Moszkowski** — Op. 72, *15 Estudios de Virtuosismo*. Mecanismo de alto rendimiento.
- **Frédéric Chopin** — Op. 10 y Op. 25, *Études*. Cumbre técnica y expresiva del repertorio de estudios.
- **Franz Liszt** — S. 139, *Estudios de Ejecución Trascendental*. Máxima complejidad técnica (nivel maestría).
- **György Ligeti** — *Études pour piano* (Libros 1–3). Estudios contemporáneos de nivel superior.

### III. Repertorio Académico por Períodos, Sonatinas y Antologías Históricas
- **Muzio Clementi** — Op. 36, *6 Sonatinas*. Repertorio clásico formativo.
- **Friedrich Kuhlau** — Op. 55, *Sonatinas*. Repertorio clásico formativo.
- **Johann Sebastian Bach** — *Notenbüchlein für Anna Magdalena Bach* (19 piezas fáciles); *Invenciones a dos voces* BWV 772–786; *Suites Francesas* BWV 812–817; *El Clave Bien Temperado* BWV 846–893 (Libros I y II). Columna vertebral barroca, de iniciación (Ana Magdalena) hasta maestría (Clave Bien Temperado).
- **Robert Schumann** — Op. 68, *Álbum para la juventud*; *Papillons* Op. 2; *Kreisleriana*. Repertorio romántico, de nivel infantil a avanzado.
- **Pyotr Ilyich Tchaikovsky** — Op. 39, *Álbum para la juventud*. Repertorio romántico infantil.
- **Dmitri Kabalevsky** — Op. 39, *24 Pequeñas Piezas para niños*; Op. 27, *15 Piezas para niños* (Libros 1 y 2). Repertorio nacionalista/contemporáneo infantil.
- **Igor Stravinsky** — *Los cinco dedos* (Les cinq doigts). Repertorio contemporáneo de iniciación.
- **Dmitri Shostakovich** — Op. 69, *6 Piezas para niños*. Repertorio contemporáneo infantil.
- **Zoltán Kodály** — *Danzas para niños*. Repertorio infantil de raíz folklórica húngara.
- **Béla Bartók** — *For Children*, Sz. 42. Repertorio infantil con base en canciones populares húngaras.
- **Luis Gianneo** — *7 piezas infantiles para piano*. Repertorio argentino infantil.
- **Sebastián Piana** — *Dos Danzas Argentinas* (incluye *Pequeño Pericón*); *Pequeña Milonga*; *Tonadita*. Repertorio de raíz popular argentina.
- **Héctor Iglesias Villoud** — *Huaino*; *Alma Argentina*. Repertorio de raíz folklórica argentina.
- **Alberto Williams** — *Canción de niño*. Repertorio argentino infantil.
- **Juan Pasquinelli** — *24 Piezas Básicas para piano*. Repertorio de iniciación.
- **Fidelio Giacobbe** — *La Música muchacha*. Repertorio de iniciación.
- **Pascual Quaratino** — *Milonga*. Repertorio de raíz popular argentina.
- **Ariel Ramírez** — *15 Estudios para piano* (N° 4 y 5 específicamente). Repertorio de raíz folklórica argentina.
- **Alberto Ginastera** — Op. 2, *Danzas Argentinas*. Repertorio contemporáneo argentino de nivel avanzado.
- **Sergei Prokofiev** — Op. 22, *Visiones Fugitivas*. Repertorio contemporáneo avanzado.
- **Johannes Brahms** — Op. 35, *Variaciones sobre un tema de Paganini*. Repertorio romántico de nivel maestría.
- **Franz Liszt** — S. 178, *Sonata en Si menor*. Repertorio romántico monumental, nivel maestría.
- **Maurice Ravel** — *Gaspard de la Nuit*. Repertorio impresionista de máxima dificultad.
- **Wolfgang Amadeus Mozart** — *Salzburger Klavierbüchlein*. Repertorio clásico de iniciación/referencia histórica.
- **Colecciones pedagógicas Ricordi/Schirmer** — *Mi primer Bach*, *Mi primer Mozart*, *Mi primer Clementi*, *Mi primer Beethoven*, *Mi primer Schubert*. Antologías introductorias por compositor.

### IV. Teoría, Contrapunto Riguroso y Tratados Pedagógicos
- **Johann Joseph Fux** — *Gradus ad Parnassum* (1725). Tratado fundacional de contrapunto por especies; base del contrapunto riguroso a dos voces en Bloque III.
- **Heinrich Neuhaus** — *El arte del piano* (The Art of Piano Playing). Tratado de la escuela rusa de piano, referencia en pedagogía de Bloque V.
- **Alfred Cortot** — *Principios racionales de la técnica pianística* (Principes rationnels de la technique pianistique). Tratado de la escuela francesa de piano.
- **Nota sobre Jazz/Popular:** los sistemas de Rootless Voicings (Bill Evans) y armonía por cuartas (McCoy Tyner) no provienen de un libro tradicional, sino del Core Curriculum de armonía del Berklee College of Music, estudiado como sistema teórico integrado.

---

## Notas de factibilidad técnica — resumen

Se procesaron los **5 bloques** de la reformulación "Matriz Arqueológica", con un total de **24 ejercicios** (4 dimensiones — Elemento Atómico, Estructura Compuesta, Entorno Relacional, Síntesis Práctica — por cada uno de los 5 bloques, más 4 laboratorios interactivos). De ese total, aproximadamente **dos tercios (≈67%, 16/24)** son `[DIGITAL-INTERACTIVO]`, y el tercio restante se reparte en partes iguales entre `[INSTRUCCIONAL-FISICO]` (≈17%, 4/24) y `[HIBRIDO]` (≈17%, 4/24). Los ejercicios físico-instruccionales se concentran en los bloques de nivel más alto (IV y V), donde el contenido depende de tocar junto a otros músicos reales, de juicio estético/expresivo subjetivo, o de observación corporal (postura, gestos de dirección) que ningún sensor estándar mide de forma confiable — estos deben construirse como videos demostrativos o checklists de autograbación, no como ejercicios autocalificados.

La proporción alta de contenido digitalizable es una gran noticia para el desarrollo de la app: a diferencia de guitarra o canto (que dependen casi enteramente de detección de audio/pitch por micrófono, con toda la incertidumbre que eso conlleva), **el piano es el único instrumento del catálogo de Teclas Jade con un "teclado digital nativo"**. Esto habilita conectar un teclado MIDI real (o un controlador MIDI genérico) directamente al navegador vía **Web MIDI API**, obteniendo datos exactos y de baja latencia: qué nota se tocó, con qué velocity (intensidad), en qué instante preciso (timestamp) y durante cuánto tiempo. Con eso se puede auto-calificar de forma objetiva gran parte del temario: precisión de notas y acordes, voice leading, simultaneidad de ataque, timing contra metrónomo/pistas base, balance de velocity dentro de un acorde, e incluso desviaciones rítmicas entre ambas manos — sin depender de reconocimiento de audio incierto. Los ejercicios `[HIBRIDO]` normalmente combinan esta verificación MIDI objetiva con un componente de oído/canto (que sí puede sumar detección de pitch por micrófono vía Web Audio API) o con una evaluación estética subjetiva que conviene dejar como feedback cualitativo (del alumno o de un docente), no como bloqueo del progreso.

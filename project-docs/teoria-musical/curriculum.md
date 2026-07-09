# Teclas Jade — Teoría Musical: Currículum de Contenido

> Síntesis condensada de "Contenido Teoría musical.docx" para uso como base de contenido de una app educativa interactiva (quizzes, dictados generados por audio, teclado/guitarra virtual, entrenamiento auditivo). Cada ítem incluye una etiqueta de factibilidad técnica para guiar el desarrollo.

**Leyenda de etiquetas**
- `[DIGITAL-INTERACTIVO]`: convertible en interacción real de app (quiz, dictado con audio generado, reconocimiento por oído, notación interactiva).
- `[INSTRUCCIONAL-FISICO]`: depende de autopercepción física/analógica no verificable por software.
- `[HIBRIDO]`: combina verificación digital parcial (audio generado, quiz) con juicio físico/subjetivo no automatizable del todo.

---

## Índice de Niveles / Bloques

1. **Bloque 1 — Nivel Inicial (Fase Semilla)** — *"Alfabetizar el oído antes que el ojo."* Apunta a niños y principiantes absolutos, sin conocimientos previos. Enfoque sensorial, intuitivo y lúdico (Kodály, Dalcroze, Orff-Schulwerk).
2. **Bloque 2 — Nivel Intermedio (Fase Core)** — *"Dejar de depender de canciones de referencia y entender la gravedad tonal."* Apunta a quienes ya distinguen sonidos básicos y necesitan sistematizar la escala diatónica, las tríadas y las funciones tonales.
3. **Bloque 3 — Nivel Avanzado (Fase Maestría)** — *"Calcular alturas y tensiones de forma abstracta, sin apoyo de una tonalidad fija."* Apunta a estudiantes de nivel universitario/conservatorio (armonía cromática, jazz, contrapunto de Bach).
4. **Bloque 4 — Nivel Experto (Fase Erudito / Cúspide Académica)** — *"El oído se convierte en un procesador de frecuencias puras, vectores numéricos y geometrías temporales."* Apunta a posgrado / música de vanguardia del s. XX-XXI (atonalidad, dodecafonismo, microtonalidad, set theory).
5. **Bloque Transversal — Laboratorio Práctico de Élite** — *"Un teórico que solo sabe analizar en papel y no puede escuchar o reproducir lo que ve, no es un erudito; es un tipógrafo."* Apunta a estudiantes avanzados que ya cursan armonía/contrapunto y necesitan conectar el análisis con la ejecución e improvisación real (método Juilliard / Curtis / Berklee).

Cada bloque combina **(A) Fundamentos teóricos** (conocimiento declarativo, escalas, cifrado, historia) y **(B) Ejercicios de entrenamiento auditivo** (oído, dictado, transcripción), cerrando con un plan de práctica diaria.

---

## Bloque 1 — Nivel Inicial (Fase Semilla)

### A. Fundamentos teóricos

**1. Métodos pedagógicos de iniciación (Kodály / Dalcroze / Orff-Schulwerk)**
- Concepto: tres enfoques complementarios para alfabetizar el oído antes de la lectoescritura: fononimia y solfeo relativo (Kodály), internalización corporal del pulso (Dalcroze/Rítmica), e improvisación con percusión y escalas pentatónicas sin disonancias (Orff-Schulwerk).
- Metodología: actividades guiadas de canto con señas, movimiento corporal al pulso, e improvisación instrumental grupal.
- Autoevaluación: no formal en la fuente; depende de observación de un docente/adulto.
- `[INSTRUCCIONAL-FISICO]`: requiere movimiento corporal real y guía humana; no verificable por software, aunque la app puede disparar los audios/instrucciones.

**2. Pulso vs. Ritmo y cualidades del sonido**
- Concepto: distinguir el latido constante (pulso) de la duración variable de las notas (ritmo), y reconocer de forma refleja agudo/grave, largo/corto, fuerte/suave.
- Metodología: juegos de escucha y movimiento.
- Autoevaluación: identificar la cualidad correcta tras escuchar un estímulo.
- `[DIGITAL-INTERACTIVO]`: quiz de audio (reproducir dos sonidos y preguntar cuál es más agudo/fuerte/largo) con Web Audio API; para pulso vs. ritmo, juego de "tap along" comparando el tap del usuario contra el pulso real.

**3. Grafía analógica**
- Concepto: dibujar líneas ascendentes/descendentes para representar el contorno melódico antes del pentagrama.
- Metodología: escuchar una melodía corta y trazar su contorno.
- Autoevaluación: comparar el contorno dibujado contra el contorno real de la melodía.
- `[DIGITAL-INTERACTIVO]`: canvas interactivo donde el usuario dibuja la curva mientras suena el audio, comparado algorítmicamente contra el contorno de pitch real.

### B. Ejercicios de entrenamiento auditivo — "Los ladrillos del oído"

**Ejercicio 1.1 — Mapeo de disparadores melódicos**
- Concepto: memorizar un repertorio de canciones "disparadoras" para identificar intervalos por asociación (2da m = Tiburón, 4ta J = Himno/Star Wars, 5ta J = Superman/Estrellita, 8va = Over the Rainbow).
- Metodología: escuchar dos notas, cantar internamente la melodía de referencia y nombrar el intervalo.
- Autoevaluación: contrastar la respuesta contra el intervalo real tocado por la app.
- `[DIGITAL-INTERACTIVO]`: reproducir el intervalo con Web Audio API/sampler y ofrecer quiz de opción múltiple con los "disparadores" como pistas visuales/auditivas.

**Ejercicio 1.2 — Test de dirección interválica**
- Concepto: automatizar si un intervalo sube o baja, evitando confundir altura con intensidad.
- Metodología: tocar dos notas sucesivas y responder "subió o bajó" de inmediato.
- Autoevaluación: comparación instantánea contra la dirección real generada.
- `[DIGITAL-INTERACTIVO]`: juego de reacción rápida con notas aleatorias generadas por audio y botones Sube/Baja; ideal para gamificación con puntaje y tiempo de respuesta.

**Ejercicio 2.1 — Clasificación por clima sensorial (tríadas)**
- Concepto: reconocer tríadas Mayor (brillante), menor (opaca), disminuida (angustiosa) y aumentada (suspendida) por su "temperatura emocional".
- Metodología: escuchar el acorde en bloque y clasificarlo en una de las 4 categorías.
- Autoevaluación: verificación inmediata contra el tipo de acorde generado.
- `[DIGITAL-INTERACTIVO]`: generador de acordes vía Web Audio/soundfont + quiz de 4 opciones; candidato ideal para gamificación (rachas, niveles).

**Ejercicio 2.2 — Aislamiento de polos extremales**
- Concepto: entrenar la "visión periférica" del oído cantando aisladamente la nota más aguda y luego la más grave de un acorde en bloque.
- Metodología: tocar la tríada, cantar solo la nota superior, repetir y cantar solo la inferior.
- Autoevaluación: comparar la nota cantada contra la nota real del acorde (por oído/piano).
- `[HIBRIDO]`: requiere canto real; verificable solo con detección de pitch por micrófono (afinación aproximada), complementado con reproducción de referencia para autochequeo.

**Ejercicio 3.1 — Encontrar la "casa" (la tónica)**
- Concepto: identificar la tónica de una canción tarareando la nota de reposo que estabiliza todo el fondo armónico.
- Metodología: escuchar una canción libre (Spotify/YouTube), tararear una nota constante y confirmar si el corte abrupto en esa nota suena a cierre.
- Autoevaluación: "test de confirmación" (¿la canción corta bien en esa nota o se siente inconclusa?).
- `[HIBRIDO]`: con canción libre del usuario es subjetivo/no verificable; la app puede ofrecer una versión curada (banco de pistas con tónica conocida) para quiz de opción múltiple, volviéndose `[DIGITAL-INTERACTIVO]` en ese caso.

**Ejercicio 4.1 — Call and response melódico**
- Concepto: imitar de inmediato una frase corta (3-4 notas, escala pentatónica) cantando y luego encontrándola en el instrumento.
- Metodología: tradicionalmente requiere un compañero; se puede sustituir por pista interactiva.
- Autoevaluación: verificar si la imitación cantada/tocada coincide con la frase original.
- `[DIGITAL-INTERACTIVO]`: la app reproduce la frase y el usuario la responde tocándola en un piano/guitarra virtual (sin necesidad de micrófono), comparando notas exactas tocadas contra la frase objetivo.

**Ejercicio 4.2 — Eco rítmico corporal**
- Concepto: almacenar y reproducir un patrón rítmico de 2 compases (aplausos) antes de poder transcribirlo.
- Metodología: alguien aplaude el patrón, el usuario lo repite de memoria.
- Autoevaluación: comparación de la reproducción rítmica contra el patrón original.
- `[DIGITAL-INTERACTIVO]`: juego de "tap the rhythm" con detección de timing (timestamps de toques comparados contra el patrón de referencia, tolerancia en milisegundos).

**Plan de estudio diario (Bloque 1, ~15 min)**: calentamiento de dirección (3'), fijación de intervalos base (5'), inmersión en colores/tríadas (5'), anclaje tonal (2'). `[HIBRIDO]` — combina drills digitales cronometrados con práctica libre en instrumento físico.

---

## Bloque 2 — Nivel Intermedio (Fase Core)

### A. Fundamentos teóricos

**1. Lectura en clave de Sol y clave de Fa**
- Concepto: lectura fluida de notas en ambas claves.
- Metodología: lectura progresiva con flashcards y partituras.
- Autoevaluación: quiz de identificación de nota bajo tiempo.
- `[DIGITAL-INTERACTIVO]`: flashcards de lectura cronometradas, clásico y muy gamificable.

**2. Métrica: compases simples y compuestos, síncopas**
- Concepto: compases simples (2/4, 3/4, 4/4) vs. compuestos (6/8, 9/8, 12/8); síncopas y contratiempos.
- Metodología: contar y aplaudir subdivisiones; identificar el tipo de compás al escuchar.
- Autoevaluación: quiz de reconocimiento de compás por audio.
- `[DIGITAL-INTERACTIVO]`: generador de patrones rítmicos + pregunta de opción múltiple sobre el tipo de compás.

**3. Estructura interválica (clasificación Mayor/menor/Justo/Aumentado/Disminuido)**
- Concepto: medición exacta de la distancia y calidad entre notas.
- Metodología: práctica de identificación con flashcards e instrumento.
- Autoevaluación: quiz de oído clásico.
- `[DIGITAL-INTERACTIVO]`: banco de preguntas de reconocimiento auditivo de intervalos con generación de audio.

**4. Escalas mayores/menores (natural, armónica, melódica) y Círculo de Quintas**
- Concepto: construcción de escalas y su relación con las armaduras de clave.
- Metodología: construir cada escala nota por nota; memorizar el orden de sostenidos/bemoles.
- Autoevaluación: verificar la escala construida contra la teórica correcta.
- `[DIGITAL-INTERACTIVO]`: teclado/guitarra virtual donde el usuario construye la escala tocando las notas, con validación automática; quiz interactivo del círculo de quintas.

**5. Tríadas y cifrado (números romanos / cifrado americano)**
- Concepto: construir acordes de tres notas sobre cada grado de la escala y traducir entre notación clásica (I, ii, V) y contemporánea (C, Am, G°).
- Metodología: construir tríadas por grado y etiquetarlas en ambos sistemas.
- Autoevaluación: quiz de emparejamiento cifrado ↔ notas ↔ número romano.
- `[DIGITAL-INTERACTIVO]`: ejercicio de arrastrar/tocar notas en teclado virtual + verificación automática del cifrado.

**6. Conducción de voces SATB (introducción)**
- Concepto: reglas de armonía a 4 voces (soprano/contralto/tenor/bajo), prohibición de quintas/octavas paralelas, resolución de la sensible.
- Metodología: realizar corales simples respetando las reglas.
- Autoevaluación: revisión de reglas de movimiento paralelo.
- `[DIGITAL-INTERACTIVO]`: motor de verificación de reglas (parser de 4 voces que detecta automáticamente quintas/octavas paralelas y sensibles no resueltas) — muy factible como feature de "corrector de armonía".

**7. Funciones tonales (Tónica / Subdominante / Dominante)**
- Concepto: eje de tensión y reposo: Tónica (estable), Subdominante (tensión media), Dominante (máxima inestabilidad).
- Metodología: identificar la función de cada acorde en una progresión.
- Autoevaluación: quiz de función armónica por acorde/progresión escuchada.
- `[DIGITAL-INTERACTIVO]`: reproducir progresiones y pedir clasificar función de cada acorde.

### B. Ejercicios de entrenamiento auditivo

**Ejercicio 1.1 — Canto de intervalos pivote**
- Concepto: romper la inercia de cantar escalas lineales encadenando intervalos en direcciones distintas desde una nota pivote.
- Metodología: cantar una 4ta justa ascendente desde Do, fijar esa nota como nuevo pivote, cantar una 3ra menor descendente, etc.
- Autoevaluación: tocar la nota final en el instrumento para comprobar si se mantuvo la afinación.
- `[HIBRIDO]`: requiere canto afinado; verificable parcialmente con detección de pitch por micrófono comparando la nota final cantada contra la esperada.

**Ejercicio 1.2 — Canto sobre pedal (drone)**
- Concepto: los intervalos cambian de color al sonar contra una nota fija de fondo.
- Metodología: sostener un drone y cantar distintos intervalos por encima, notando la tensión/disonancia.
- Autoevaluación: subjetiva (percepción del color/tensión).
- `[HIBRIDO]`: el drone y el intervalo objetivo son generables digitalmente (Web Audio oscillator), pero la evaluación de "color percibido" depende del oído del usuario; se puede combinar con detección de pitch para verificar afinación exacta.

**Ejercicio 2.1 — El detector de inversiones**
- Concepto: reconocer si una tríada está en estado fundamental, 1ra o 2da inversión según qué nota queda en el bajo.
- Metodología: escuchar el acorde y rastrear el bajo.
- Autoevaluación: verificación inmediata contra la inversión real.
- `[DIGITAL-INTERACTIVO]`: generador de acordes con inversión aleatoria + quiz de opción múltiple.

**Ejercicio 2.2 — Posición abierta vs. cerrada**
- Concepto: distinguir si las notas del acorde están apretadas en una octava (cerrada) o distribuidas con espacios amplios (abierta).
- Metodología: escuchar el "espacio de aire" entre las notas.
- Autoevaluación: verificación contra la disposición real generada.
- `[DIGITAL-INTERACTIVO]`: generador de voicings abiertos/cerrados vía síntesis MIDI + quiz.

**Ejercicio 3.1 — El grado flotante**
- Concepto: identificar el grado (1-7) de una nota al azar dentro de una tonalidad establecida, según su comportamiento magnético (ej. 7mo grado tira hacia el 1).
- Metodología: establecer tonalidad con una progresión, tocar una nota y pedir su grado.
- Autoevaluación: comparación contra el grado real.
- `[DIGITAL-INTERACTIVO]`: quiz de grado escuchado tras contexto tonal generado por audio.

**Ejercicio 3.2 — Reconocimiento de cadencias**
- Concepto: identificar los "puntos y comas" de la gramática musical al final de las frases (auténtica, plagal, rota, etc.).
- Metodología: escuchar finales de frases/progresiones.
- Autoevaluación: verificación contra el tipo real de cadencia.
- `[DIGITAL-INTERACTIVO]`: banco de audio de cadencias + quiz de clasificación.

**Ejercicio 4.1 — Dictado melódico de frases diatónicas**
- Concepto: transcribir una frase de 4-8 compases en 3 pasos: esqueleto rítmico, notas polares (primera/más aguda/final), relleno de notas intermedias.
- Metodología: escuchar la frase varias veces siguiendo el método de los tres pasos.
- Autoevaluación: comparar la transcripción contra la partitura real.
- `[DIGITAL-INTERACTIVO]`: generador de dictados melódicos con Web Audio + editor de notación interactivo (ej. VexFlow) donde el usuario ingresa notas y ritmo, verificado automáticamente contra el original.

**Ejercicio 4.2 — Dictado rítmico monódico (síncopas y contratiempos)**
- Concepto: transcribir patrones con notas que atacan en tiempos débiles y se sostienen sobre los fuertes.
- Metodología: llevar el pulso con el pie y mapear si el sonido cae junto al pulso o desplazado.
- Autoevaluación: comparar contra el patrón rítmico real.
- `[DIGITAL-INTERACTIVO]`: generador de patrones sincopados + input rítmico por tap, comparado automáticamente.

**Plan de entrenamiento diario (Bloque 2, 20 min)**: pedal/drone (4'), grado flotante e inversiones (5'), mapeo de cadencias (5'), aislamiento rítmico-melódico (6'). `[HIBRIDO]`.

---

## Bloque 3 — Nivel Avanzado (Fase Maestría)

### A. Fundamentos teóricos

**1. Acordes cromáticos especiales (6ta Aumentada Italiana/Francesa/Alemana, 6ta Napolitana)**
- Concepto: acordes de función pre-dominante con tensión dramática, construidos sobre el 6to o 2do grado rebajado.
- Metodología: construir y analizar cada variante; identificar por oído su resolución hacia la dominante.
- Autoevaluación: quiz de identificación auditiva/analítica.
- `[DIGITAL-INTERACTIVO]`: generador de acordes cromáticos + quiz de reconocimiento por oído y por notación.

**2. Intercambio modal y modulación avanzada (acordes pivote, enarmonía)**
- Concepto: tomar prestados acordes de la escala paralela; cambiar de tonalidad vía acorde pivote o reinterpretación enarmónica.
- Metodología: analizar progresiones que modulan e identificar el mecanismo usado.
- Autoevaluación: quiz de identificación del tipo de modulación/acorde prestado.
- `[DIGITAL-INTERACTIVO]`: progresiones generadas + pregunta de opción múltiple sobre el mecanismo de modulación.

**3. Armonía de jazz: extensiones, dominantes secundarias, SubV7, escalas-acorde**
- Concepto: novenas/oncenas/trecenas, V7 que resuelve en grados no-tónicos, sustituto tritonal, asignación de modos (jónico...locrio) a cada acorde de una progresión.
- Metodología: analizar lead sheets y asignar escalas a cada acorde.
- Autoevaluación: quiz de emparejamiento acorde ↔ escala/modo correcto.
- `[DIGITAL-INTERACTIVO]`: motor de análisis de progresiones con banco de preguntas chord-scale.

**4. Macroformas clásicas (Forma Sonata, Rondó, Tema y Variaciones)**
- Concepto: arquitectura de grandes secciones (Exposición/Desarrollo/Reexposición; ABACA; variaciones sobre un tema).
- Metodología: escuchar obras completas y mapear las secciones formales.
- Autoevaluación: anotar correctamente el mapa formal contra el real.
- `[DIGITAL-INTERACTIVO]`: herramienta de anotación de forma sincronizada con el audio (línea de tiempo interactiva), verificada contra un mapa formal de referencia.

**5. Acústica: afinación justa vs. temperamento igual, serie de armónicos, comas**
- Concepto: proporciones matemáticas de la afinación justa vs. división artificial del temperamento igual (razón 12√2); comas pitagórica y sintónica.
- Metodología: estudiar las razones matemáticas y comparar auditivamente ambos sistemas.
- Autoevaluación: quiz teórico (cálculo de razones) + comparación A/B de intervalos justos vs. temperados.
- `[DIGITAL-INTERACTIVO]`: Web Audio API permite generar frecuencias exactas para comparación A/B just intonation vs. equal temperament; muy alto potencial educativo.

**6. La fuga barroca (Sujeto, Respuesta, Stretto, transformaciones motívicas)**
- Concepto: estructura de la fuga y técnicas de transformación (inversión, retrogradación, aumentación/disminución).
- Metodología: analizar partituras identificando cada entrada del sujeto.
- Autoevaluación: verificar identificación de entradas contra el análisis real.
- `[HIBRIDO]`: requiere sincronizar score y audio y cierto juicio analítico; parcialmente automatizable señalando entradas conocidas, pero el reconocimiento auditivo fino de transformaciones motívicas depende del oído entrenado.

**7. Contrapunto de especies (Método Fux) — repaso avanzado**
- Concepto: 5 especies de contrapunto estricto sobre un Cantus Firmus.
- Metodología: componer una segunda voz siguiendo las reglas de cada especie.
- Autoevaluación: revisión de reglas (consonancias permitidas, tratamiento de disonancias/retardos).
- `[HIBRIDO]`: un motor de reglas puede detectar automáticamente paralelas y disonancias no preparadas, pero la calidad melódica final requiere criterio humano/docente.

### B. Ejercicios de entrenamiento auditivo

**Ejercicio 1.1 — Cadenas de intervalos abstractas**
- Concepto: calcular mentalmente una secuencia de saltos interválicos sin apoyo tonal (ej. Do +3ra M → Mi +5ta J → Si -2da m → La#/Sib).
- Metodología: procesar la cadena en silencio mental y cantar la nota final.
- Autoevaluación: tocar la nota real en el instrumento para verificar si la afinación interna se mantuvo estable.
- `[HIBRIDO]`: la app puede generar la cadena y pedir la nota final por selección (digital), pero la versión original con canto requiere detección de pitch.

**Ejercicio 1.2 — Canto de tensiones sobre acordes complejos**
- Concepto: entonar afinadamente una tensión específica (#11, 9na) sobre un acorde Maj7 sostenido, sin ayuda del teclado.
- Metodología: sostener el acorde y forzar la voz a entonar la extensión pedida.
- Autoevaluación: verificación auditiva de la afinación de la tensión cantada.
- `[HIBRIDO]`: requiere canto + micrófono con detección de pitch para verificar con precisión.

**Ejercicio 2.1 — Clasificación de cuatríadas (acordes de séptima)**
- Concepto: distinguir Maj7, m7, 7 dominante, m7b5, dim7 por oído.
- Metodología: escuchar el bloque armónico completo.
- Autoevaluación: verificación contra el tipo real de acorde.
- `[DIGITAL-INTERACTIVO]`: generador de cuatríadas + quiz, candidato clásico de gamificación (modo examen con % de efectividad).

**Ejercicio 2.2 — Dominantes alteradas (b9, #9, #5)**
- Concepto: identificar el color de la alteración (ej. #9 = sonido "Hendrix"; b9 = exótico/oscuro).
- Metodología: escuchar acordes dominantes alterados y clasificar la alteración.
- Autoevaluación: verificación contra la alteración real.
- `[DIGITAL-INTERACTIVO]`: banco de acordes alterados generados + quiz auditivo.

**Ejercicio 2.3 — Arquitectura de voicings (Drop 2 / Drop 3)**
- Concepto: reconocer si un voicing de 4 voces está en posición cerrada o abierto (Drop 2: segunda voz más aguda bajada una octava).
- Metodología: escuchar bloques armónicos e identificar si hay una voz "suelta" en el registro medio-grave.
- Autoevaluación: verificación contra la técnica de voicing real usada.
- `[DIGITAL-INTERACTIVO]`: generador MIDI de distintos voicings + quiz de identificación.

**Ejercicio 3.1 — Dictado de funciones del bajo (cifrado numeral romano)**
- Concepto: mapear una progresión completa rastreando solo las fundamentales, detectando dominantes secundarias (ej. V7/II → IIm7).
- Metodología: escuchar la secuencia y escribirla en números romanos.
- Autoevaluación: comparar contra la progresión real.
- `[DIGITAL-INTERACTIVO]`: generador de progresiones + input de números romanos, verificado automáticamente.

**Ejercicio 3.2 — Detección de intercambio modal**
- Concepto: identificar cuándo aparece un acorde prestado del modo menor paralelo (ej. IVm o bVI en tonalidad mayor).
- Metodología: escuchar la progresión y detectar el "chispazo cromático".
- Autoevaluación: verificación contra el acorde prestado real.
- `[DIGITAL-INTERACTIVO]`: progresiones generadas con intercambio modal + quiz de detección.

**Ejercicio 4.1 — Dictado polifónico a dos voces (disociación de Bach)**
- Concepto: transcribir por separado la mano izquierda y luego la derecha de una invención de Bach a dos voces.
- Metodología: transcribir primero el bajo, luego la voz superior, atendiendo a disonancias y retardos.
- Autoevaluación: comparar ambas voces transcriptas contra la partitura original.
- `[DIGITAL-INTERACTIVO]`: reproductor de audio de invenciones + editor de notación de dos pentagramas para ingresar ambas voces, verificado automáticamente contra la partitura de referencia (requiere motor de notación tipo VexFlow/ABC.js).

**Ejercicio 4.2 — Dictado de métricas asimétricas y polirritmias**
- Concepto: transcribir compases de amalgama (5/8, 7/8, 11/16) identificando su subdivisión interna (2+2+3 vs. 3+2+2).
- Metodología: identificar la agrupación interna y ubicar las barras de compás.
- Autoevaluación: comparar contra la subdivisión real.
- `[DIGITAL-INTERACTIVO]`: generador de patrones en compases de amalgama + input de agrupación, verificado automáticamente.

**Plan de entrenamiento diario (Bloque 3, 25 min)**: gimnasia interválica abstracta (5'), cuatríadas y alteraciones en modo examen con meta de 90% (7'), rastreo del bajo e intercambio modal (5'), dictado contrapuntístico a dos voces (8'). `[HIBRIDO]`.

---

## Bloque 4 — Nivel Experto (Fase Erudito / Cúspide Académica)

### A. Fundamentos teóricos

**1. Sistemas post-tonales (Atonalidad libre, Dodecafonismo, Serialismo integral)**
- Concepto: evolución del pensamiento teórico desde la tonalidad diatónica hasta el serialismo integral (Schoenberg, Boulez, Stockhausen), donde no hay centro tonal y se serializan notas, duraciones, dinámicas y articulaciones.
- Metodología: estudiar y analizar obras representativas.
- Autoevaluación: quiz conceptual sobre técnicas y compositores.
- `[DIGITAL-INTERACTIVO]`: quiz de conocimiento declarativo + reconocimiento auditivo de técnicas seriales básicas.

**2. Teoría de conjuntos musicales (Set Theory, Allen Forte)**
- Concepto: análisis de colecciones de alturas (pitch-classes 0-11) mediante formas primas, vectores de intervalos y relaciones de equivalencia.
- Metodología: convertir notas a números y calcular la forma prima de un conjunto.
- Autoevaluación: comparar la forma prima calculada contra la real.
- `[DIGITAL-INTERACTIVO]`: calculadora/quiz de set theory (algoritmo que calcula la forma prima de un conjunto ingresado y valida contra la respuesta del usuario) — muy factible y didáctico.

**3. Vanguardias contemporáneas (Espectralismo, Microtonalismo, Polirritmia avanzada)**
- Concepto: técnicas de composición desde el análisis del espectro sonoro (Grisey), divisiones microtonales (Partch, 24-TET), y subdivisiones métricas extremas.
- Metodología: escuchar obras de referencia y estudiar los conceptos.
- Autoevaluación: quiz conceptual de reconocimiento de técnica/compositor.
- `[DIGITAL-INTERACTIVO]`: quiz declarativo con clips de audio de referencia.

**4. Paleografía y notación contemporánea**
- Concepto: lectura de neumas medievales, notación mensural, tablaturas antiguas, y notación moderna (proporcional, gráfica, indeterminada).
- Metodología: práctica de transcripción desde facsímiles antiguos y análisis de partituras gráficas modernas.
- Autoevaluación: quiz de reconocimiento símbolo↔significado para lo básico; la transcripción paleográfica real requiere criterio experto.
- `[HIBRIDO]`: el reconocimiento de símbolos es gamificable en quiz, pero la transcripción paleográfica completa es una habilidad experta no automatizable.

### B. Ejercicios de entrenamiento auditivo

**Ejercicio 1.1 — Microtonalismo auditivo (detección de cents)**
- Concepto: distinguir un semitono real (100 cents) de un cuarto de tono (50 cents), catalogándolo como entidad geométrica precisa y no como "nota desafinada".
- Metodología: escuchar la nota base y una segunda nota que puede ser semitono o cuarto de tono.
- Autoevaluación: comparación A/B contra el intervalo real generado.
- `[DIGITAL-INTERACTIVO]`: Web Audio API genera frecuencias exactas para A/B testing de microintervalos; excelente candidato de gamificación con % de precisión.

**Ejercicio 1.2 — Cadenas veloces atonales (pitch-class integers)**
- Concepto: traducir instantáneamente una ráfaga atonal de notas a su vector numérico (0-11), eliminando el pensamiento en nombres de intervalos.
- Metodología: escuchar la secuencia y anotar los números correspondientes.
- Autoevaluación: comparar el vector ingresado contra el vector real.
- `[DIGITAL-INTERACTIVO]`: generador de secuencias atonales + input numérico verificado automáticamente.

**Ejercicio 2.1 — Identificación de tricordios primarios (Forma Prima de Allen Forte)**
- Concepto: clasificar colecciones de 3 notas por su forma prima matemática en vez de por nombre de acorde tradicional.
- Metodología: escuchar el tricordio y reconocer su forma prima del catálogo Forte.
- Autoevaluación: verificación contra la forma prima real.
- `[DIGITAL-INTERACTIVO]`: generador de tricordios + quiz de opción múltiple contra catálogo Forte.

**Ejercicio 2.2 — Poliacordes y clústers extremos**
- Concepto: disociar dos realidades armónicas simultáneas en registros separados (ej. "acorde de Petrushka": Fa# Mayor agudo sobre Do Mayor grave).
- Metodología: escuchar el poliacorde y aislar mentalmente cada tríada por separado, midiendo la distancia entre sus raíces.
- Autoevaluación: verificar ambas tríadas y su distancia (tritono) contra el original.
- `[DIGITAL-INTERACTIVO]`: generador de poliacordes vía capas de audio + quiz de identificación de ambas tríadas/distancia.

**Ejercicio 3.1 — Resoluciones enarmónicas fantasma**
- Concepto: un acorde de 6ta Aumentada Alemana suena igual que una 7ma dominante; la diferencia está en su resolución (hacia dominante clásica vs. como SubV7 de jazz).
- Metodología: escuchar el acorde aislado y predecir/detectar hacia dónde resuelve el contexto posterior.
- Autoevaluación: verificar la predicción contra la resolución real.
- `[DIGITAL-INTERACTIVO]`: reproducir acorde ambiguo + su resolución real, quiz de qué función cumplió.

**Ejercicio 3.2 — Seguimiento de armonía simétrica no funcional**
- Concepto: rastrear progresiones sobre escalas octatónica o de tonos enteros (Debussy), sin funciones de tónica/dominante, siguiendo ejes de simetría.
- Metodología: escuchar y rastrear el movimiento paralelo de voces internas o los ejes de simetría.
- Autoevaluación: análisis abierto, sin respuesta única automatizable en su totalidad.
- `[HIBRIDO]`: se puede generar el audio y ofrecer preguntas guiadas (ej. "¿qué distancia de transposición se repite?"), pero el análisis fino de simetría requiere criterio experto.

**Ejercicio 4.1 — Mapeo de series dodecafónicas al vuelo**
- Concepto: transcribir la Serie Original (P0) de una obra dodecafónica, abstrayéndose de saltos de octava usados para camuflar la línea.
- Metodología: escuchar la obra y anotar la serie de 12 notas en sus primeras exposiciones.
- Autoevaluación: comparar la serie transcripta contra la serie real de la obra.
- `[DIGITAL-INTERACTIVO]`: generador de series dodecafónicas propias (no solo repertorio con copyright) + input de notas/números, verificado automáticamente.

**Ejercicio 4.2 — Dictado de polirritmias complejas y modulación métrica**
- Concepto: transcribir superposiciones asimétricas (quintillo vs. septillo) y cambios de tempo vía equivalencia métrica (ej. corchea de tresillo = nueva negra), al estilo Elliott Carter.
- Metodología: escuchar el pasaje e identificar el punto exacto de la ecuación de equivalencia métrica.
- Autoevaluación: comparar la transcripción contra el pasaje real.
- `[DIGITAL-INTERACTIVO]`: motor de generación rítmica con modulación métrica programável + notación/input verificado automáticamente (complejidad de desarrollo alta, pero factible).

**Plan de entrenamiento diario (Bloque 4, 30 min)**: gimnasia microtonal con meta de 95% de precisión (6'), mapeo numérico/set theory (8'), análisis de ejes de simetría y enarmonía (6'), dictado dodecafónico e irracional (10'). `[HIBRIDO]`.

---

## Bloque Transversal — Laboratorio Práctico de Élite

Ejercicios cruzados (Juilliard/Curtis/Berklee) pensados para estudiantes avanzados que ya dominan armonía/contrapunto y necesitan conectar el análisis con la ejecución, el canto y la improvisación real.

**1. El "Coral de Bach" ciego (Método Juilliard/Curtis)**
- Concepto: armonizar a 4 voces (a partir de solo la soprano) un coral de Bach nunca escuchado, y luego tocarlo cantando internamente una voz interna.
- Metodología: escribir alto/tenor/bajo respetando reglas clásicas, tocar al piano y cantar la línea interna mientras se ejecuta.
- Autoevaluación: contrastar la armonización contra el coral real de Bach (existe respuesta "correcta" documentada).
- `[HIBRIDO]`: la armonización puede validarse con un motor de reglas (paralelas, resolución de sensible) y comparación contra el coral original; cantar mientras se toca requiere ejecución física.

**2. Cifrado en mano y canto de extensiones (Método Berklee)**
- Concepto: tocar solo la tríada/bajo de un cifrado complejo (ej. FΔ7#11) y entonar de oído la extensión exacta pedida (#11, b9) sin ayuda del teclado.
- Metodología: tarjetas de cifrados aleatorias, tocar la base, cantar la extensión.
- Autoevaluación: verificar afinación de la extensión cantada.
- `[HIBRIDO]`: requiere canto con detección de pitch por micrófono para verificación precisa; la generación de tarjetas y cifrados es 100% digital.

**3. Canto en canon a dos voces ("Desafío Fux")**
- Concepto: tocar el cantus firmus en piano mientras se canta simultáneamente la voz superior de un contrapunto simple; variante: cantar la misma melodía tocada con 2 tiempos de retraso (canon en tiempo real).
- Metodología: disociar la ejecución mecánica de manos de la afinación vocal.
- Autoevaluación: subjetiva/auditiva.
- `[INSTRUCCIONAL-FISICO]`: coordinación motora + vocal simultánea; no verificable de forma confiable por software.

**4. Solfeo móvil con sílabas de jazz (Do funcional)**
- Concepto: cantar sobre un pedal usando el sistema donde la tónica siempre se llama "Do", reajustando la sílaba cuando el fondo modula.
- Metodología: pista de acompañamiento con pedal, cantar giros melódicos, detectar la modulación y reetiquetar "Do".
- Autoevaluación: verificar si la sílaba cantada corresponde a la función correcta tras la modulación.
- `[HIBRIDO]`: el pedal y la modulación son generables digitalmente; verificar el canto requiere detección de pitch.

**5. Dictado por grados numéricos (sin pentagrama)**
- Concepto: transcribir de oído una canción de radio usando solo números de grado (1-7, con alteraciones) para la melodía y números romanos para la armonía.
- Metodología: identificar el centro tonal y transcribir en tiempo real sin depender del papel.
- Autoevaluación: comparar contra la transcripción real de la canción (si se usa un banco curado en vez de radio aleatoria).
- `[DIGITAL-INTERACTIVO]`: con un banco de canciones curado (metadata de tonalidad/progresión conocida), input de grados numéricos verificado automáticamente.

**6. Resolución de intervalos "fantasma"**
- Concepto: tras escuchar un intervalo disonante (ej. tritono Do-Fa#), apagar el sonido e imaginar/cantar internamente su resolución clásica (Do→Si, Fa#→Sol).
- Metodología: audición interna predictiva, sin sonido de referencia.
- Autoevaluación: cantar la resolución y verificar contra la resolución teórica esperada.
- `[HIBRIDO]`: la app genera el intervalo y puede pedir la resolución por selección múltiple (digital) o por canto verificado con pitch-detection.

**7. Coordinación de polirritmias corporales (4:3)**
- Concepto: mano izquierda marca tresillos, mano derecha marca semicorcheas, manteniendo la polirritmia 4:3 con metrónomo a 60 BPM.
- Metodología: percusión bimanual independiente sobre una mesa.
- Autoevaluación: subjetiva/por sensación de estabilidad.
- `[INSTRUCCIONAL-FISICO]`: coordinación motora bimanual real; no verificable por software salvo con sensores de golpe dedicados (fuera de alcance de una app estándar).

**8. Variación: polirritmia corporal + canto en compás de amalgama (5/8)**
- Concepto: sumar una tercera capa (voz cantando en 5/8) a la polirritmia 4:3 de manos.
- Metodología: igual al anterior, añadiendo canto simultáneo.
- Autoevaluación: subjetiva.
- `[INSTRUCCIONAL-FISICO]`: multitarea motora y vocal; no automatizable.

---

## Bibliografía

1. **Teoría de la Música** — Adolphe Danhauser. *Dominio público* (IMSLP/Archive.org). Manual de lectoescritura de referencia de los conservatorios europeos: signos musicales, claves, duración y métrica, alteraciones, intervalos, escalas y círculo de quintas.
2. **Harmony 1 & 2** — Material de cátedra de Berklee College of Music. *Con derechos de autor*. Cifrado contemporáneo, armonía diatónica en cuatríadas, funciones tonales y cadencias, conducción de voces contemporánea, dominantes secundarias, tensiones disponibles.
3. **Gradus ad Parnassum** — Johann Joseph Fux (1725). *Dominio público*. Tratado dialogado sobre las 4 reglas del movimiento melódico y las 5 especies del contrapunto sobre un Cantus Firmus.
4. **Tratado de Armonía** — Arnold Schoenberg. *Con derechos de autor*. Justificación acústica de la disonancia como "consonancia más lejana", acordes vagantes, armonía por cuartas, y el colapso progresivo del sistema tonal.
5. **Armonía** — Walter Piston. *Con derechos de autor*. Enfoque analítico sobre la práctica común (s. XVIII-XIX): ritmo armónico, progresión de raíces, bajo figurado, modulación, sextas aumentadas y napolitana.
6. **Contrapunto** — Walter Piston. *Con derechos de autor*. Contrapunto armónico barroco (estilo Bach): curva melódica, implicación armónica, contrapunto invertible, canon e invención.
7. **The Berklee Book of Jazz Harmony** — Barrie Nettles & Richard Graf.
8. **Formas de la Música Instrumental** — Diether de la Motte.
9. **Structural Hearing** — Felix Salzer. Introducción práctica al análisis Schenkeriano.
10. **Introduction to Post-Tonal Theory** — Joseph N. Straus. Referencia central para música del s. XX y Set Theory.
11. **The Structure of Atonal Music** — Allen Forte.

---

## Notas de factibilidad técnica — resumen

Sobre el total de ítems relevados (~65 entre fundamentos teóricos y ejercicios de oído, distribuidos en 4 bloques progresivos + 1 bloque transversal de élite), la proporción aproximada es: **~60% `[DIGITAL-INTERACTIVO]`**, **~30% `[HIBRIDO]`** y **~10% `[INSTRUCCIONAL-FISICO]`**. La teoría musical confirma ser el área más digitalizable del contenido de Teclas Jade: casi todo el reconocimiento de intervalos, tríadas, cuatríadas, funciones tonales, cadencias, escalas-acorde, set theory y dictados melódicos/rítmicos/armónicos puede convertirse en quizzes de audio generado y ejercicios de notación interactiva con corrección automática. Los `[HIBRIDO]` son mayormente ejercicios de canto (entonar intervalos/tensiones/extensiones "a capella" para verificar afinación interna), que requieren captura de micrófono y detección de pitch (autocorrelación/FFT) para dar feedback confiable, con margen de error mayor que un quiz de opción múltiple. Los `[INSTRUCCIONAL-FISICO]` puros son minoría y se concentran en el Laboratorio de Élite: coordinación motora bimanual (polirritmias corporales) y disociación vocal-instrumental simultánea, que dependen de la propia sensación física del estudiante y no tienen forma confiable de verificación por software estándar (sin hardware especializado).

**Motor de ejercicios recomendado para construir primero:**
1. **Generador de audio de teoría (Web Audio API + soundfont/sampler de piano y guitarra)**: sintetiza intervalos, tríadas, cuatríadas, voicings, progresiones y microintervalos (cents exactos) bajo demanda, parametrizable por nivel/bloque.
2. **Banco de preguntas de reconocimiento auditivo** con opción múltiple, modo examen con % de efectividad (ya sugerido en los planes de entrenamiento del propio temario) y sistema de rachas/niveles para gamificación.
3. **Editor de notación interactivo** (tipo VexFlow/ABC.js) para dictados melódicos, rítmicos, contrapuntísticos y de series dodecafónicas, con verificación automática nota-por-nota y ritmo-por-ritmo contra el original generado.
4. **Motor de reglas de conducción de voces / contrapunto** que detecte automáticamente quintas/octavas paralelas, resolución de sensibles y tratamiento de disonancias — reutilizable en SATB, especies de Fux y el "Coral de Bach ciego".
5. **Módulo opcional de detección de pitch por micrófono** (autocorrelación/FFT vía Web Audio API) para los ejercicios `[HIBRIDO]` de canto de intervalos/tensiones, como capa adicional de precisión sobre el feedback puramente visual/quiz.
6. **Teclado/guitarra virtual interactivo** para construir escalas, tríadas y cifrados tocando directamente, sirviendo como input alternativo al canto en ejercicios de "call and response" e imitación melódica.

# Teclas Jade — Currículum de Guitarra

> Fuente: `Contenido Guitarra.docx` (extracto líneas 340-709 del volcado de texto).
> Este documento es un paquete de contenido **sintetizado** para diseño de producto, no una transcripción literal. La estructura sigue la reformulación en "Matriz Arqueológica" del original, que es la única capa del documento fuente que trae ejercicios con mecanismo de autoevaluación explícito (las 3 partes: Concepto / Metodología / Autoevaluación).

## Cómo leer este archivo

El material original tiene dos capas sobre el mismo contenido:

1. **Guía de estudio por bloques romanos (Bloque I a VII)**: un mapa temático amplio (ergonomía, CAGED, armonía funcional, jazz Berklee, repertorio clásico por períodos, acompañamiento, teoría integral, folklore). No trae ejercicios con autoevaluación explícita, es más un temario de conservatorio.
2. **Matriz Arqueológica (Bloque 1 a 4, en números arábigos)**: el mismo recorrido pedagógico pero reescrito como 4 niveles de progresión, cada uno con 4 "dimensiones de aprendizaje" (Elemento Atómico, Estructura Compuesta, Entorno Relacional, Síntesis Práctica) que **sí** tienen la estructura Concepto/Metodología/Autoevaluación. Aquí es donde vive todo lo que se puede convertir en interacción de app.

Por eso este currículum usa los **4 Bloques de la Matriz Arqueológica** como columna vertebral (con sus 4 dimensiones = 4 ejercicios core + 1 "Laboratorio Interactivo" bonus por bloque = 20 ejercicios en total), y agrega al final un anexo con el mapa temático de los Bloques I-VII para no perder cobertura de contenido (útil como checklist de temas a cubrir en la app, aunque no vengan con mecanismo de autoevaluación propio).

---

## Índice de niveles

| Bloque | Tagline de mentalidad | A quién apunta |
|---|---|---|
| **Bloque 1 — El Despertar Psicomotriz y la Alfabetización** | "Fase Semilla: el cuerpo como arco, la cuerda como voz." | Principiante absoluto (niños o adultos sin conocimientos previos). Ergonomía, toque libre/apoyando, primera escala de Do Mayor, polifonía elemental. |
| **Bloque 2 — La Consolidación Mecánica y la Geometría del Mástil** | "Fase Core: dominar el mapa para liberar la mano." | Intermedio: ya lee tablatura/pentagrama básico y conoce acordes abiertos. Introduce ligados, CAGED, voice leading y ritmos populares. |
| **Bloque 3 — El Espacio Funcional, la Síncopa y la Polifonía** | "Fase Nexo: tejer hilos independientes en un suelo móvil." | Avanzado-intermedio orientado a armonía de jazz y contrapunto clásico. Tétradas, Drop 2/Drop 3, contrapunto barroco, comping sincopado. |
| **Bloque 4 — La Frontera Creativa y la Maestría Profesional** | "Fase Forja: el virtuosismo ciego al servicio del arte real." | Nivel experto/profesional. Bebop, escalas alteradas, sustitución tritonal, transposición en vivo, polirritmia y técnicas extendidas contemporáneas. |

---

## Bloque 1 — El Despertar Psicomotriz y la Alfabetización

**Tagline:** "Fase Semilla: el cuerpo como arco, la cuerda como voz."
**A quién apunta:** cero conocimientos previos, foco en ergonomía y primeros automatismos.

### 1.A — Toque Alterno i-m en Cuerda al Aire
*(Elemento Atómico)*

- **Concepto:** los dedos caen por peso propio, no por fuerza; se busca que la mano derecha alterne índice y medio con un sonido parejo, como al dejar caer los brazos.
- **Metodología:** guitarra apoyada con apoyapié (mástil a 45°), pulgar ancla en 6ª cuerda, alternar $i$-$m$ en apoyando sobre la 1ª cuerda al aire, metrónomo a 60 BPM, 2 minutos continuos.
- **Autoevaluación:** grabar 20 segundos y comparar volumen/timbre entre los golpes de $i$ y $m$; deben sonar idénticos.
- **[DIGITAL-INTERACTIVO]** — grabación + comparación de volumen/timbre entre notas es análisis de amplitud (RMS) por ataque; viable con Web Audio API / análisis de envolvente, sin necesitar oído humano.

### 1.B — Mapa de la Escala de Do Mayor (una octava)
*(Estructura Compuesta)*

- **Concepto:** sincronizar mano izquierda y derecha para construir la primera escala completa, el primer "mapa real" del mástil.
- **Metodología:** mano izquierda perpendicular al diapasón, pulgar trasero como pivote; tocar Do Mayor desde 5ª cuerda/traste 3 hasta 2ª cuerda/traste 1, alternando $i$-$m$ sin repetir dedo, ascendente/descendente a 70 BPM.
- **Autoevaluación:** frente a un espejo, observar que los dedos inactivos (2 y 4) no se escondan ni se tensen; deben flotar relajados a ~1 cm de las cuerdas.
- **[INSTRUCCIONAL-FISICO]** — depende de la autopercepción visual frente al espejo sobre la postura de dedos que no están sonando; no verificable por software estándar (requeriría visión por computadora especializada en manos, fuera de alcance). Debe presentarse como video-guía/checklist, no como ejercicio autocalificado.

### 1.C — La Gravedad Tonal (tónica-dominante)
*(Entorno Relacional)*

- **Concepto:** las notas viven en un sistema de tensión (dominante) y reposo (tónica); se busca sentir esa fuerza a través de repertorio folklórico.
- **Metodología:** elegir una pieza simple (ej. Vidalita de Rosati), identificar tónica y dominante en la partitura, tocar marcando el pulso con el pie, aplicando leve ritardando en la tensión y acelerando al resolver.
- **Autoevaluación:** caminar en círculos cantando la pieza; si se tropieza o pierde el paso en los cambios armónicos, se rompió el pulso interno.
- **[INSTRUCCIONAL-FISICO]** — el indicador es la propia sensación corporal de tropezar al caminar; no es medible de forma confiable por software (más allá de tracking de movimiento, fuera de alcance típico de una app musical).

### 1.D — Disociación Polifónica Elemental (bajo + melodía)
*(Síntesis Práctica)*

- **Concepto:** entrenar al cerebro para sostener dos líneas independientes: pulgar en el bajo, $i$-$m$ en la melodía superior.
- **Metodología:** tomar un estudio a dos voces (Sor Op. 60 o Sagreras 40-50), practicar solo la línea de bajos con el pulgar, luego solo la melodía superior, unir ambas a 45 BPM.
- **Autoevaluación:** recitar en voz alta los nombres de las notas del bajo mientras la mano sigue tocando la melodía superior; si la mano se traba al hablar, las dos voces siguen fundidas en un solo bloque muscular.
- **[HIBRIDO]** — la parte rítmica/metrónomo y la grabación de la ejecución son digitalizables (Web Audio API), pero verificar la disociación real (hablar + tocar simultáneo sin trabarse) requiere juicio humano o, en el mejor de los casos, reconocimiento de voz cruzado con análisis de audio — combinación compleja, no trivial de automatizar con precisión.

### Bonus — Laboratorio Interactivo: "El Mapa a Ciegas"

- **Concepto/Mecánica:** a oscuras o con los ojos vendados, tocar un arpegio de cuerdas al aire (6ª a 1ª) y luego desplazar la mano izquierda hasta el 5º traste guiándose solo por el tacto, para desarrollar propiocepción.
- **[INSTRUCCIONAL-FISICO]** — depende enteramente de la percepción táctil/propioceptiva del estudiante; no verificable por software. Se puede presentar como reto guiado por audio (instrucciones habladas, sin depender de pantalla).

**Rutina temporizada (45 min):** secuencia con metrónomo, espejo, laboratorio a ciegas y dictado auditivo elemental. **[DIGITAL-INTERACTIVO]** el temporizador/rutina en sí (timer de práctica con etapas y metrónomo integrado) es 100% construible como feature de app.

---

## Bloque 2 — La Consolidación Mecánica y la Geometría del Mástil

**Tagline:** "Fase Core: dominar el mapa para liberar la mano."
**A quién apunta:** intermedio que ya tiene lectura básica y acordes abiertos, listo para CAGED y voice leading.

### 2.A — El Resorte de los Ligados (Hammer-on / Pull-off)
*(Elemento Atómico)*

- **Concepto:** los ligados son "resortes" de la articulación digital, no empujones de brazo; deben sonar tan fuerte y claro como una nota pulsada.
- **Metodología:** dedo 1 en 3ª cuerda/traste 5, pulsar, hammer con dedo 2 al traste 6, pull-off de vuelta al traste 5; ciclo continuo en semicorcheas a 70 BPM.
- **Autoevaluación:** conectar la guitarra a una interfaz de audio y observar la forma de onda en un DAW/afinador; la nota ligada debe tener el mismo volumen/amplitud que la pulsada.
- **[DIGITAL-INTERACTIVO]** — comparación de amplitud/envolvente entre ataque pulsado y ligado es exactamente lo que resuelve un análisis de onda vía Web Audio API; no requiere oído humano.

### 2.B — Las Cinco Estaciones CAGED
*(Estructura Compuesta)*

- **Concepto:** el diapasón es un rompecabezas geométrico de 5 piezas interconectadas (sistema CAGED).
- **Metodología:** armar el acorde de Do Mayor en las 5 formas (C, A, G, E, D) a lo largo del mástil, arpegiando cada forma ascendente/descendente.
- **Autoevaluación:** metrónomo a 80 BPM en corcheas; recorrer las 5 formas sin baches ni retrasos al cambiar de posición/cejilla.
- **[DIGITAL-INTERACTIVO]** — metrónomo + detección de onsets (ataques) en tiempo real puede señalar huecos o retrasos entre cambios de forma; viable con librerías de pitch/onset detection en JS.

### 2.C — Conducción de Voces en Tríadas (I-IV-V-I)
*(Entorno Relacional)*

- **Concepto:** voice leading: las notas comunes entre acordes sucesivos se mantienen fijas, el resto se mueve la distancia mínima posible.
- **Metodología:** tríada cerrada en cuerdas 1-2-3, progresión I-IV-V-I aplicando la regla de notas comunes retenidas + movimiento mínimo.
- **Autoevaluación:** grabar la progresión y escuchar solo la voz superior (1ª cuerda); debe sonar como una melodía lineal y cantable, sin saltos grandes.
- **[DIGITAL-INTERACTIVO]** — extracción de la línea de voz superior mediante pitch detection nota a nota, midiendo el tamaño de los intervalos entre notas consecutivas para señalar saltos "caóticos" automáticamente.

### 2.D — Automatización Rítmica Popular (rasgueo + traslados)
*(Síntesis Práctica)*

- **Concepto:** la mano derecha automatiza un patrón rítmico folklórico mientras la izquierda cambia de posición armónica.
- **Metodología:** patrón rítmico de milonga/chacarera acentuando contratiempos, mientras la mano izquierda traslada hasta 2 posiciones exactamente en el tiempo fuerte.
- **Autoevaluación:** metrónomo con un loop de silencio de 2 compases; al reaparecer el clic, la ejecución debe coincidir matemáticamente con el pulso oculto.
- **[DIGITAL-INTERACTIVO]** — metrónomo programable con silencios + onset detection del estudiante comparado contra el pulso oculto; caso de uso típico de metrónomo interactivo con feedback de precisión rítmica.

### Bonus — Laboratorio Interactivo: "La Ruleta de las Inversiones"

- **Concepto/Mecánica:** sorteo aleatorio de 3 grados diatónicos (papelitos en una bolsa) y enlace instantáneo de tríadas abiertas en la zona media del mástil, con metrónomo.
- **[DIGITAL-INTERACTIVO]** — randomizer + metrónomo + verificación por pitch detection de que se tocaron las notas correctas del voicing pedido; totalmente construible como mini-juego de app.

**Rutina temporizada (60 min).** **[DIGITAL-INTERACTIVO]** para el temporizador/metrónomo integrado; el dictado armónico final es también digitalizable (reproducir progresión, el usuario transcribe).

---

## Bloque 3 — El Espacio Funcional, la Síncopa y la Polifonía

**Tagline:** "Fase Nexo: tejer hilos independientes en un suelo móvil."
**A quién apunta:** avanzado-intermedio, orientado a armonía de jazz (tétradas, Drop 2/3) y contrapunto clásico.

### 3.A — Balance Dinámico Interno de Tétradas
*(Elemento Atómico)*

- **Concepto:** destacar una voz dentro de un acorde de 4 notas, como un coro donde un cantante sobresale y el resto susurra.
- **Metodología:** Drop 2 de Cmaj7 en cuerdas 4-3-2-1, pluck simultáneo con $p$-$i$-$m$-$a$; destacar sucesivamente cada dedo/voz compás a compás.
- **Autoevaluación:** grabar y analizar en un editor de audio si la voz destacada sobresale en primer plano mientras las otras quedan compactas de fondo.
- **[DIGITAL-INTERACTIVO]** — análisis de balance de amplitud entre notas simultáneas de un acorde grabado (FFT / análisis multi-pitch); factible aunque más complejo que un análisis monofónico, por tratarse de separación de voces dentro de un ataque polifónico.

### 3.B — Cadena de Inversiones Drop 2 / Drop 3
*(Estructura Compuesta)*

- **Concepto:** expandir el vocabulario armónico recorriendo las inversiones de un acorde de séptima en dos sistemas de voicing distintos.
- **Metodología:** Dm7 en Drop 2 (cuerdas 4-1), recorrer 1ª, 2ª y 3ª inversión ascendente; repetir en Drop 3 (cuerdas 5,3,2,1).
- **Autoevaluación:** metrónomo a 90 BPM en semicorcheas; los 4 dedos deben aterrizar simultáneamente al cambiar de inversión, no "por partes".
- **[DIGITAL-INTERACTIVO]** — onset detection puede verificar si las notas de un acorde comienzan en el mismo instante o de forma escalonada, analizando la grabación del ataque.

### 3.C — Contrapunto Estricto: Voces Independientes
*(Entorno Relacional)*

- **Concepto:** dos líneas melódicas en movimiento contrario, coordinadas matemáticamente (como dos acróbatas en espejo).
- **Metodología:** pieza barroca (Bach, Rameau o Telemann), identificar pasajes de movimiento contrario, bajo en staccato vs. melodía en legato.
- **Autoevaluación:** tocar solo los bajos de memoria, luego solo la melodía; si al retirar una voz se pierde el hilo de la otra, no hay comprensión polifónica real, solo memoria muscular.
- **[INSTRUCCIONAL-FISICO]** — es un chequeo de memoria/comprensión interna del estudiante, no un dato medible por audio; depende de introspección. Presentarlo como ejercicio guiado con checklist de autoevaluación, no autocalificado.

### 3.D — Jazz Comping Sincopado (patrón Charleston)
*(Síntesis Práctica)*

- **Concepto:** sostener rítmicamente la base armónica con síncopas tipo Charleston mientras se acompaña a un solista.
- **Metodología:** standard con acordes Drop 3, patrón Charleston (ataque en tiempo 1 + contratiempo de 2), luego anticipar todas las corcheas sincopadas.
- **Autoevaluación:** metrónomo sonando solo en los pulsos 2 y 4 (como el hi-hat de jazz); si se siente descuadrado, la mano izquierda está arrastrando el tempo.
- **[DIGITAL-INTERACTIVO]** — metrónomo configurable a pulsos específicos + onset detection para medir la desviación temporal (ms) respecto al click; feedback de precisión rítmica clásico y automatizable.

### Bonus — Laboratorio Interactivo: "El Espejo Estilístico"

- **Concepto/Mecánica:** rearmonizar una pieza barroca sustituyendo sus acordes tradicionales por tétradas Drop 2 con extensiones de jazz (9nas, 11nas, alteraciones).
- **[HIBRIDO]** — la reescritura armónica en sí podría vivir en un editor de acordes/partitura interactivo digital, pero evaluar si el resultado "suena bien" o logra fusionar estéticas es un juicio artístico/subjetivo que requiere oído humano (docente o comunidad), no automatizable de forma confiable.

**Rutina temporizada (75 min).** Incluye análisis de partitura a lápiz (morfología/formas A-B-C) — tarea de escritorio, digitalizable como anotador visual sobre partitura digital pero sin verificación automática de "corrección" (es análisis interpretativo).

---

## Bloque 4 — La Frontera Creativa y la Maestría Profesional

**Tagline:** "Fase Forja: el virtuosismo ciego al servicio del arte real."
**A quién apunta:** nivel experto/profesional: bebop, armonía alterada, transposición en vivo, técnicas contemporáneas.

### 4.A — Notas de Paso Cromáticas (Bebop)
*(Elemento Atómico)*

- **Concepto:** las notas cromáticas de paso funcionan como puentes que empujan las notas reales del acorde hacia los tiempos fuertes.
- **Metodología:** escala Bebop Dominante sobre G7, metrónomo a 120 BPM en corcheas; las notas estructurales del acorde deben coincidir exactamente con el click.
- **Autoevaluación:** una señal aleatoria (alarma o "¡Ya!") suena mientras se improvisa; al congelar la mano en ese instante, el dedo debe estar sobre una nota real del acorde (1, 3, 5 o b7), no sobre una de paso.
- **[DIGITAL-INTERACTIVO]** — automatizable con una alarma aleatoria disparada por la app + pitch detection que capture qué nota se estaba tocando en ese instante y la compare contra las notas objetivo del acorde.

### 4.B — Escala Alterada y Sustitución Tritonal en II-V-I
*(Estructura Compuesta)*

- **Concepto:** inyectar máxima tensión cromática (b9, #9, b5, #5) antes de resolver pacíficamente en la tónica, vía escala alterada o sustitución tritonal.
- **Metodología:** sobre Dm7-G7-Cmaj7: arpegio diatónico en Dm7, escala alterada (o su equivalente en menor melódica) en G7, o arpegio del sustituto tritonal (Db7) resolviendo por semitono descendente.
- **Autoevaluación:** grabar la línea de improvisación a capela (sin acompañamiento) y verificar si un oyente externo puede rastrear con claridad el cambio de los tres acordes y su resolución.
- **[HIBRIDO]** — extraer las notas tocadas vía pitch detection y verificar que caen sobre las tensiones/objetivos correctos es digitalizable; pero el criterio de "un oyente puede seguir la progresión con claridad" es perceptual y requiere oído humano (o un modelo de reconocimiento armónico no trivial).

### 4.C — Transposición Instantánea en Vivo
*(Entorno Relacional)*

- **Concepto:** reaccionar en tiempo real a un cambio de tonalidad imprevisto (ej. un cantante que transpone a mitad de tema), moviendo todo el mapa armónico sin cortar el flujo.
- **Metodología:** acompañar una pieza; a mitad de camino, transportar (semitono arriba o 3ª menor abajo) manteniendo los voicings en la misma zona del mástil.
- **Autoevaluación:** grabación en video de la mano izquierda; verificar si usa formas locales en la misma zona o salta a posiciones abiertas conocidas en los primeros trastes.
- **[INSTRUCCIONAL-FISICO]** — depende de análisis visual de video sobre la posición de la mano en el mástil; no confiable por software estándar (requeriría visión por computadora especializada en tracking de mástil/dedos). Presentar como autoevaluación guiada con grabación de video que el estudiante revisa.

### 4.D — Polirritmia Corporal + Técnicas Extendidas
*(Síntesis Práctica)*

- **Concepto:** disociar dos planos rítmicos simultáneos y contradictorios (percusión en 3/4 con la mano derecha, legato tapping en 4/4 con la izquierda) hasta automatizarlos.
- **Metodología:** patrón percusivo en la caja de la guitarra (3/4) + legato tapping (4/4) simultáneo, sobre repertorio contemporáneo (Ginastera, Brouwer).
- **Autoevaluación:** recitar tablas de multiplicar al revés o conversar mientras se toca; si el patrón se desmorona con la distracción cognitiva, la coordinación no está automatizada.
- **[INSTRUCCIONAL-FISICO]** — la prueba de "distracción cognitiva mientras se toca" depende de observación/autopercepción en vivo, no de una métrica de audio objetiva (aunque se puede grabar y que un docente lo evalúe).

### Bonus — Laboratorio Interactivo: "El Desafío de la Rejilla de Grabación"

- **Concepto/Mecánica:** grabar 3 minutos de improvisación a 200 BPM (o en 7/8) y analizar en un DAW el desvío de cada ataque respecto al grid de cuantización (objetivo: <15 ms de error).
- **[DIGITAL-INTERACTIVO]** — análisis de precisión rítmica (timing/onset detection comparado contra un grid) es exactamente el tipo de feature que se resuelve con Web Audio API + algoritmos de onset detection; muy viable.

**Rutina temporizada (90 min).** Incluye dictados de acordes atonales y lectura a primera vista — el dictado es digitalizable (reproducir + el usuario identifica), la lectura a primera vista requiere seguimiento de partitura sincronizado con lo tocado (viable con pitch tracking pero de mayor complejidad de implementación).

---

## Anexo — Mapa temático de referencia (guía original por Bloques I-VII)

Esta capa del documento original no trae ejercicios con autoevaluación explícita; es el temario amplio de conservatorio que da contexto y cobertura a los 4 bloques de arriba. Útil como checklist de contenidos a cubrir en la app, más que como fuente de interacciones concretas.

- **Bloque I — Ingreso y Nivel Inicial (niños/as, CMBSAS):** ergonomía, digitación inicial, lectura en pentagrama, escala de Do Mayor a una octava, polifonía elemental a dos voces, música de cámara en dúos. *(Corresponde a la base de Bloque 1 de la Matriz.)*
- **Bloque II — Cátedra Principal de Guitarra:** mecánica tipo "Hanon" de guitarra, sistema CAGED y 3 Notas por Cuerda, escalas en 12 tonalidades (diatónicas, modos griegos, simétricas/exóticas), tétradas y voicings (Drop 2/3/2&4), extensiones y tensiones, comping por género (jazz, funk, música latinoamericana). *(Corresponde a Bloque 2 y parte de Bloque 3 de la Matriz.)*
- **Bloque III — Improvisación de Jazz y Lenguaje Contemporáneo (método Berklee):** cadencia II-V7-Imaj7 en las 12 tonalidades, guide tones, sustitución de arpegios, escalas bebop, aproximaciones cromáticas, alteración dominante y sustitución tritonal. *(Corresponde a Bloque 4 de la Matriz.)*
- **Bloque IV — Repertorio Avanzado, Talleres y Enfoques Académicos:** guitarra clásica por períodos históricos (Barroco, Clasicismo, Romanticismo, Contemporáneo/vanguardias), talleres de ensamble y música de cámara, práctica profesionalizante (grabación, ergonomía preventiva, lectura bajo presión).
- **Bloque V — Práctica de Acompañamiento ("el arte de secundar"):** acompañamiento a cantantes y coros (espacio frecuencial, transposición on-the-fly), acompañamiento a solistas (bajo cifrado/continuo barroco, tango con púa-dedo/arrastres/marcatos, walking bass de jazz). *(Amplía la dimensión "Entorno Relacional" de Bloque 4 de la Matriz.)*
- **Bloque VI — Formación Teórica Integral y Guitarra Complementaria:** audioperceptiva (intervalos, acordes, dictados, lectura a primera vista), armonía tonal y funcional, contrapunto (método Fux), morfología y análisis musical, guitarra como instrumento complementario para pianistas/cantantes/compositores.
- **Bloque VII — Formación Complementaria Opcional: Música Popular y Folklore:** ritmos regionales del Cono Sur (zamba, chacarera, huayno, vidala, chamamé), arreglos solistas de guitarra de concierto popular (guitarra como "bombo legüero" + acompañamiento + melodía a la vez).

**Nota de factibilidad para este anexo:** en su mayoría son mapas de contenido teórico/temático (qué enseñar) más que mecánicas de ejercicio (cómo autoevaluar), por lo que su conversión a interacciones de app requerirá primero diseñarles un mecanismo de feedback propio siguiendo el patrón de los Bloques 1-4 de la Matriz (Concepto/Metodología/Autoevaluación) antes de poder etiquetarlos por factibilidad.

---

## Bibliografía

**Métodos del ciclo inicial y pre-inicial (Conservatorio de Música de Buenos Aires — CMBSAS)**

1. Anido, María Luisa — *Cuaderno Técnico-recreativo para Guitarra*. Técnica inicial.
2. Ayala, Héctor — *Serie de Composiciones para Guitarra* (Canción de Cuna, Pequeño Preludio, Aire de Vidala, Aire de Milonga, Cholita, Coyuyo, De Antaño, Celeste y Blanco, Regalón, Zambita de la Hermandad, Cascabel). Repertorio folklórico de nivel inicial.
3. Bianqui Piñero, Carmen — *4 Composiciones Fáciles para Guitarra* (Cuadernos I-III: Milonga, Ranchera, Aire de Carnavalito, Vals). Repertorio inicial.
4. Carlevaro, Abel — *Serie Didáctica para Guitarra: Cuaderno 1* (Escalas Diatónicas).
5. Costanzo, Irma — *20 clases para aprender música tocando Guitarra*.
6. Farías, María Herminia / Martínez Zárate, Jorge — *Guitarra y Educación Musical Contemporánea* (Libro 1 Partes A y B; Cuaderno 1B; Cuaderno de Música de Cámara y su Complemento).
7. Farías / Martínez Zárate (eds.) — *De 4 piezas del siglo XVIII* (Bourrée de Mozart, Minué de Rameau, Danza de J.S. Bach, Gavota de Telemann). Danzas barrocas usadas para iniciación al contrapunto.
8. Gramatges, Harold — *Siete apuntes para la Dama Duende*.
9. Hemsy de Gainza, Violeta / Kantor, Guillermo — *A jugar y cantar con la Guitarra*. Libro preparatorio.
10. Küffner, Joseph — *Leichte Sonatinen für Gitarre*, Op. 80 N° 1, 2 y 3.
11. Martínez Zárate, Jorge — *Mi Primer Libro de Guitarra* (11ª edición).
12. Nogués, Clara — *Música para el Collita* (Baguala, Aire de Baguala, Aire de Chamamé, Carnavalito).
13. Prat, Domingo — *Escalas y Arpegios del Mecanismo Técnico de la Guitarra*. Fórmula de escalas mayores.
14. Pujol, Emilio — *Escuela Razonada de la Guitarra* (Libro/Volumen 2).
15. Rak, Stephan — *Miniaturas para Guitarra* (Lullaby y Nostalgy — Supraphon Praha).
16. Rodríguez Arenas, Pedro — *La Escuela de la Guitarra* (Libro/Volumen 1).
17. Rosati, Oscar — *Cartilla de la Guitarra* (1ª y 2ª parte: Estudios N° 1-10, Balbuceos y Primeros Pasos, Primera Emoción, Gavota, Romanza, Vidalita, Ejercicios N° 38 y 40).
18. Rosati, Oscar — *Estudios para los principiantes de Guitarra* (1ª y 2ª parte, Estudios N° 1-37).
19. Sagreras, Julio S. — *Las Primeras Lecciones de Guitarra* (Lecciones N° 40 a 63).
20. Sagreras, Julio S. / Martínez Zárate, Jorge — *Ejercicios correspondientes a Sagreras 1º Libro*.
21. Sor, Fernando — *Estudios Preparatorios para Guitarra*, Op. 60 (N° 1 y 2). Estudios polifónicos.
22. Tansman, Alexandre — *Doce Piezas Fáciles para Guitarra*.
23. Teuchert, Heinz (ed.) — *Maestros del Renacimiento para Guitarra* y *Maestros del Barroco para Guitarra*.
24. Waldron, Jason — *Classical Guitar Method*, Libro 1 (incl. adaptaciones de Oda a la Alegría de Beethoven y In the Hall of the Mountain King de Grieg).

**Técnica superior, armonía, jazz e improvisación avanzada**

25. Carlevaro, Abel — *Serie Didáctica para Guitarra: Cuaderno 2* (Técnica de la Mano Izquierda), *Cuaderno 3* (Técnica de la Mano Derecha), *Cuaderno 4* (Axiomas Técnicos en el Aprendizaje del Instrumento).
26. Deneff, Peter — *The Guitarist's Hanon*. Ejercicios de permutación e independencia digital (adaptación de Hanon).
27. Tárrega, Francisco — *Escuela de la Guitarra: Método Completo*. Mecanismos avanzados de trémolo y colorística tímbrica clásica.
28. Tennant, Scott — *Pumping Nylon: The Classical Guitarist's Technique Handbook*. Ligados mecánicos y control dinámico avanzado.
29. Leavitt, William — *A Modern Method for Guitar* (Vols. 1, 2 y 3 — Berklee Press). Base del sistema CAGED, púa continua e improvisación.
30. Nunes, Warren — *The Jazz Guitar Chord Bible*. Mapeo completo de estructuras Drop 2 y Drop 3 en inversiones.
31. Pass, Joe — *Joe Pass Guitar Style*. Sustitución armónica, líneas bebop y comping de standards.
32. Fux, Johann Joseph — *Gradus ad Parnassum* (El Estudio del Contrapunto). Base teórica del contrapunto por especies.
33. Hindemith, Paul — *Concentrado de Armonía Tradicional*. Reglas de conducción de voces y enlaces armónicos.
34. Schoenberg, Arnold — *Funciones Estructurales de la Armonía* y *Modelos para Principiantes en Composición*. Base de los procesos analíticos de morfología musical.

---

## Notas de factibilidad técnica — resumen

De los 20 ejercicios core de la Matriz Arqueológica (4 bloques × 4 dimensiones + 4 laboratorios bonus), aproximadamente **55% (11/20) son `[DIGITAL-INTERACTIVO]`**, **30% (6/20) son `[INSTRUCCIONAL-FISICO]`** y **15% (3/20) son `[HIBRIDO]`**. La gran mayoría de lo digitalizable depende de dos capacidades técnicas centrales: (1) **detección de tono/pitch y onset en tiempo real** (para verificar afinación en bendings/ligados, timing de ataques simultáneos en acordes, precisión rítmica contra un metrónomo o grid, y si una nota tocada pertenece al acorde objetivo), viable hoy con librerías JS de pitch-detection (ej. autocorrelación, YIN, o Web Audio + FFT) corriendo sobre el micrófono del dispositivo; y (2) **metrónomos/temporizadores programables** con patrones de silencio, acentos en pulsos específicos o randomización, que son funcionalidad estándar de Web Audio API sin mayor riesgo técnico. Los ejercicios `[INSTRUCCIONAL-FISICO]` comparten un patrón: dependen de que el estudiante se mire en un espejo, sienta algo con el cuerpo (propiocepción, tropezar al caminar), o juzgue su propia memoria/comprensión al retirar una voz melódica — ninguno de estos es verificable con confianza por audio o cómputo estándar, así que en la app deberían vivir como **instrucciones con video de referencia y checklist de auto-chequeo**, no como ejercicios auto-calificados. Los `[HIBRIDO]` son los más interesantes para roadmap: tienen una mitad claramente digitalizable (grabar, medir timing, verificar notas correctas) y una mitad de juicio estético o cognitivo que conviene dejar para revisión humana (docente/comunidad) en una v1, con la posibilidad de automatizar más adelante si se incorpora reconocimiento de progresiones armónicas o multi-pitch más sofisticado. En conjunto, esto sugiere que la guitarra es un buen candidato para un motor común de "pitch + rhythm feedback" reutilizable across ejercicios, mientras que el catálogo de ejercicios físicos/posturales necesita un formato de contenido distinto (video + demostración) desde el diseño inicial de la app.

# Currículum de Canto — Teclas Jade

Contenido de base para la app educativa de canto, sintetizado a partir del temario "Contenido Canto.docx". El programa original combina un Plan Maestro por fases con una reformulación en "Matriz Arqueológica" (4 bloques, cada uno con 4 dimensiones estructurales) y una segunda expansión con repertorio real (ruta clásica vs. contemporánea/Berklee) y 3 dimensiones nuevas: Dicción y Fonética, Audiopercepción Musical, Psicología Escénica. Aquí los bloques ya incorporan todo eso fusionado, con foco en qué es programable como interacción digital y qué debe quedar como instrucción física/video.

Etiquetas de factibilidad usadas en cada ejercicio:
- `[DIGITAL-INTERACTIVO]`: convertible en interacción real de app (pitch detection, análisis espectral, afinador, grabación+comparación, metrónomo).
- `[INSTRUCCIONAL-FISICO]`: depende de autopercepción física no verificable por software (vela, mano en garganta, espejo, sensación interna). Debe quedar como instrucción/video demostrativo.
- `[HIBRIDO]`: combina verificación digital (audio/pitch) con un criterio final de sensación física.

---

## Índice de Niveles (Bloques)

| Bloque | Nombre | Tagline de mentalidad | A quién apunta |
|---|---|---|---|
| 1 | El Despertar Propioceptivo (Fase Semilla) | "El cuerpo es el espacio, el aire es el peso." | Niños/as y adultos sin conocimientos previos. Enfoque lúdico, propioceptivo, libre de tensiones. |
| 2 | La Arquitectura del Appoggio (Fase Core) | "Retener la expansión, liberar el timbre." | Estudiante que ya afina básicamente y pasa a adolescencia/adultez temprana; entra en la mecánica del instrumento (Appoggio, TA/CT, passaggio). |
| 3 | La Dinámica del Estilo (Fase Vector) | "Velocidad en el eje, flexibilidad en el borde." | Cantante avanzado que ya domina registros y busca excelencia estilística (ópera barroca o belting de Broadway/CCM). |
| 4 | La Trascendencia Acústica (Fase Custom/Elite) | "Controlar el extremo, camuflar el esfuerzo." | Nivel experto/virtuoso (concierto o giras). Atletismo vocal de élite: registros extremos, distorsión saludable, resiliencia escénica. |

---

## BLOQUE 1: El Despertar Propioceptivo (Fase Semilla)

**Tagline:** "El cuerpo es el espacio, el aire es el peso."
**A quién apunta:** iniciación infantil/adulta, cero conocimientos previos, deconstrucción de vicios posturales y reflejo respiratorio primario. Incluye base de conciencia corporal (Alexander/Feldenkrais) y fisiología elemental explicada en clave lúdica ("cuerdas vocales = puertas mágicas").

**Repertorio de referencia:**
- Ruta Clásica: *"Caro Mio Ben"* – Tommaso Giordani. Tempo Larghetto y estructura silábica: entrena el flujo de aire lineal sin saltos interválicos; ideal para trino de labios antes de meter texto.
- Ruta Contemporánea: *"Make You Feel My Love"* – Bob Dylan (estilo Adele/pop balada). Registro medio-bajo cómodo, sin belting; permite trabajar Humming ("M") en toda la estrofa para hallar resonancia de máscara.

### Ejercicios

**1. El Flujo Neutro Lineal**
- Concepto: el aire debe salir como un hilo continuo y de presión constante, ni brusco ni flojo — la base de todo control respiratorio posterior.
- Metodología: de pie, manos en ombligo y costillas bajas; inhalar en 4 tiempos por la nariz expandiendo costillas; emitir un siseo ("Sss") sostenido y parejo por 20 segundos.
- Autoevaluación: vela encendida a 5 cm de la boca — la llama debe inclinarse ~45° y quedar congelada; si parpadea o se apaga, el flujo es inestable.
- **[HIBRIDO]** — la vela es instrucción física, pero la estabilidad de energía del "sss" es medible con análisis de amplitud/RMS en tiempo real (Web Audio API) como sustituto o complemento digital.

**2. La Oscilación Protegida (Lip Trill)**
- Concepto: el trino de labios protege las cuerdas vocales acumulando presión antes de la garganta, como lubricación de un motor.
- Metodología: labios flojos, dedos en mejillas para aliviar peso; soplar haciendo vibrar los labios; añadir un glissando de sirena de nota más baja a más alta y volver, sin cortar la vibración.
- Autoevaluación: manos a 2 cm de la boca — debe sentirse un rocío de aire tibio y constante; si la vibración se corta o hay picazón en la garganta, hubo tensión de mandíbula o corte de flujo.
- **[HIBRIDO]** — pitch detection puede verificar que el glissando sea continuo y sin saltos de frecuencia; la sensación táctil de aire tibio sigue siendo física.

**3. El Espejo Acústico de la Máscara (Humming)**
- Concepto: la cabeza funciona como caja de resonancia; el "Mmm" busca que el sonido vibre en huesos faciales en vez de quedar atrapado en la garganta.
- Metodología: boca cerrada, dientes separados grosor de un dedo, lengua escondida abajo; sostener "M" cómoda, desplazar un tono arriba y abajo.
- Autoevaluación: dedos en puente de la nariz y labio superior — debe sentirse cosquilleo/vibración fuerte; si se siente en la nuca o hay tensión de garganta, el sonido se está empujando hacia atrás.
- **[HIBRIDO]** — estabilidad de frecuencia del hum es rastreable con pitch detection; la localización de la vibración (cara vs. nuca) es puramente física.

**4. La Descompresión Cervical Activa**
- Concepto: el cuello debe ser un tubo blando y flexible; se libera tensión laríngea mientras se sostiene una frase real, aplicando Alexander/Feldenkrais.
- Metodología: acostado boca arriba, rodillas flexionadas, libro bajo la cabeza; rodar la cabeza lentamente de lado a lado con mandíbula caída, sosteniendo una "V" soplada continua.
- Autoevaluación: si el sonido de la "V" cambia de volumen o se corta al llegar a los extremos del movimiento, se está usando el cuello para sostener la nota en vez del apoyo abdominal.
- **[HIBRIDO]** — la estabilidad de volumen/tono de la "V" es analizable vía envolvente de amplitud en tiempo real; la postura acostada y el movimiento de cabeza son puramente instruccionales.

**5. Laboratorio: El Hidrómetro de Presión**
- Concepto: unir la teoría del Tracto Vocal Semiocluido (TVSO) con la física de fluidos de forma visual y lúdica.
- Metodología: sorbete a 2 cm de profundidad en vaso con agua a la mitad; hacer sonido de sirena a través del sorbete, subiendo y bajando.
- Autoevaluación: el tamaño de las burbujas debe mantenerse idéntico durante todo el recorrido ascendente/descendente.
- **[HIBRIDO]** — el glissando de la sirena es rastreable con pitch detection (curva de frecuencia suave); el tamaño/uniformidad de las burbujas requiere observación física (o cámara, poco confiable).

**6. Dicción y Fonética: El Ataque Vocálico Isócrono**
- Concepto: evitar el ataque glótico duro (golpe de garganta al iniciar consonantes/vocales); el aire y el sonido deben nacer exactamente al mismo tiempo.
- Metodología: tomar la primera frase del repertorio, cantar solo las vocales encadenadas, precedidas de una [h] suave.
- Autoevaluación: dedo en la nuez de Adán — no debe sentirse un "clic" o salto brusco al iniciar la vocal; si hay impacto, el ataque fue glótico.
- **[HIBRIDO]** — detección de transiente/onset en el espectrograma (ataque abrupto vs. suave) es viable digitalmente; la palpación manual de la laringe es física.

**7. Audiopercepción Musical: El Anclaje del Pedal Armónico**
- Concepto: el cantante debe anclar su oído interno a la tónica de fondo (piano/guitarra) mientras canta otra nota, en vez de "colgarse" del instrumento.
- Metodología: sostener un pedal de Do en el piano; cantar escala Do-Re-Mi-Fa-Sol subiendo y bajando encima del pedal.
- Autoevaluación: detenerse en el Mi, apagar el piano — si la nota se tambalea o cambia de altura al quedar sola, el estudiante dependía del piano y no de un mapa interno.
- **[DIGITAL-INTERACTIVO]** — ejercicio ideal para la app: reproducir un dron/pedal vía Web Audio API, capturar el pitch del alumno en tiempo real con detección de frecuencia (algoritmo tipo autocorrelación/YIN), y medir la deriva de afinación cuando el dron se apaga.

**8. Psicología Escénica: La Mirada Periférica Desfocalizada**
- Concepto: el miedo escénico activa hipervigilancia visual que tensa la laringe; se entrena una mirada abierta y calmada.
- Metodología: al cantar, no fijar la mirada ni cerrar los ojos; enfocar la pared del fondo siendo consciente del campo visual periférico sin mover la cabeza.
- Autoevaluación: parpadeo excesivo, cejas tensas o mirada al piso indican modo túnel/pánico; el rostro debe verse tan relajado como mirando el horizonte.
- **[INSTRUCCIONAL-FISICO]** — autopercepción emocional/facial; se puede apoyar con video demostrativo o grabación para autorrevisión, pero no hay verificación automática confiable.

**[SIN VIDEO — 10/07, ver `06-guia-grabacion-videos.md`] Guía en texto para cuando el tutor Voz Intellecta explique este ejercicio sin video de apoyo:**

> ¿Por qué? Cuando aparece el miedo escénico, los ojos entran en alerta: buscan peligro, se clavan en un punto fijo, o escapan la mirada. Ese estado de vigilancia tensa exactamente los mismos músculos que necesitás relajados para cantar bien — la garganta se cierra sin que te des cuenta.
>
> Cómo hacerlo:
> 1. Parate o sentate como si fueras a cantar de verdad.
> 2. En vez de clavar la vista en un punto (el suelo, una pared, un jurado imaginario), elegí un punto lejano al frente — una pared, una ventana, el horizonte si estás afuera.
> 3. Mirá ese punto sin "clavar" los ojos — dejá que tu atención se abra también a los costados, arriba y abajo, sin mover la cabeza. Es la misma sensación que mirar el paisaje desde la ventanilla de un auto: no enfocás un objeto puntual, abarcás todo el campo visual a la vez.
> 4. Cantá una frase corta de tu repertorio en esa posición.
>
> Cómo saber si lo lograste (con un espejo, o grabándote con el celular en selfie):
> - Señales de que sí lo lograste: cejas relajadas, parpadeo normal, la cara tan tranquila como mirando un paisaje lindo.
> - Señales de que seguís en modo túnel/pánico: parpadeo muy rápido, cejas tensas o fruncidas, mirada fija y dura, o la mirada escapándose hacia el piso.
>
> Nota: este ejercicio todavía no tiene un video de demostración en Teclas Jade — te lo explicamos así, en texto, hasta que sumemos uno. Si tenés dudas de si lo estás haciendo bien, grabate un video corto vos mismo y compará con las señales de arriba.

---

## BLOQUE 2: La Arquitectura del Appoggio (Fase Core)

**Tagline:** "Retener la expansión, liberar el timbre."
**A quién apunta:** estudiante que pasa de la relajación pasiva al control activo de la respiración clásica italiana (Appoggio) y al aislamiento de la musculatura laríngea intrínseca (TA/CT, passaggio).

**Repertorio de referencia:**
- Ruta Clásica: *"Voi Che Sapete"* – W.A. Mozart (Le Nozze di Figaro). Exige laringe neutral-baja y Appoggio constante en frases legato; las transiciones delatan si se cierra la garganta.
- Ruta Contemporánea: *"Your Song"* – Elton John. Entrena el registro mixto popular, transitando pecho/passaggio; requiere el "Gesto de Sorpresa" para no gritar ni hablar las notas medias.

### Ejercicios

**1. El Espasmo Diafragmático Controlado**
- Concepto: despertar la respuesta refleja de rebote rápido del diafragma, como un resorte de precisión.
- Metodología: manos en la cintura presionando espalda baja; jadeo corto de perro ("Ja, ja, ja") con abdomen entrando y saliendo pasivamente.
- Autoevaluación: cinturón de cuero apretado en costillas flotantes — no debe aflojarse durante el jadeo, demostrando expansión sostenida.
- **[INSTRUCCIONAL-FISICO]** — depende de sensación táctil de presión contra el cinturón; no hay sensor estándar de app para esto.

**2. La Bóveda Velofaríngea (Bostezo Activo)**
- Concepto: elevar el paladar blando y bajar la raíz de la lengua crea una "catedral acústica" interna; sin eso, cantar es como tocar trompeta con almohada en la salida.
- Metodología: iniciar un bostezo con boca cerrada; abrir manteniendo el espacio y cantar una "O" redonda; lengua plana tocando dientes inferiores.
- Autoevaluación: espejo de mano con luz directa — la úvula debe subir hasta casi desaparecer y la lengua aplanarse; si la úvula queda abajo o la lengua se monta, la colocación es incorrecta.
- **[INSTRUCCIONAL-FISICO]** — verificación visual directa (espejo/video), no automatizable de forma confiable con visión por computadora estándar.

**3. El Puente de los Registros (Mecanismo TA/CT)**
- Concepto: cruzar suavemente entre el músculo TA (pecho) y el CT (cabeza) en el passaggio, sin "gallo" ni salto perceptible.
- Metodología: comenzar grave con "Voz de Bruja" (twang, "Nia-Nia"), subir transformando el sonido en "Sonido del Fantasma" ("Uuuu" de cabeza), buscando transición imperceptible.
- Autoevaluación: grabar con el celular y escuchar — no debería identificarse el segundo exacto del cambio de registro; un salto de volumen o silencio delata resistencia del TA o entrada tardía del CT.
- **[DIGITAL-INTERACTIVO]** — grabación + reproducción es nativo de app; se puede reforzar con análisis espectral/de armónicos para detectar discontinuidades de timbre en el passaggio de forma objetiva.

**4. El Gesto del Apoyo Total**
- Concepto: fusionar expansión costal y proyección brillante para sostener frases largas con estabilidad total.
- Metodología: "Gesto de Sorpresa" (costillas abiertas), cantar "Mio-Mio-Mio" en una respiración articulando exageradamente, terminar con "Corte de aire" desde el abdomen.
- Autoevaluación: mano en la garganta (nuez de Adán) — la laringe no debe subir más de un centímetro; si sube, se sustituyó apoyo por tensión laríngea.
- **[INSTRUCCIONAL-FISICO]** — palpación manual directa de la laringe; sin sensor de app equivalente (aunque un ascenso laríngeo también desplaza formantes, detectable en teoría vía espectrograma, no es el criterio central del ejercicio).

**5. Laboratorio: El Tablero del Reflujo y la Mucosa**
- Concepto: convertir la higiene vocal (reflujo gástrico nocturno, comidas) en una métrica de rendimiento técnico, no solo un consejo genérico.
- Metodología: bitácora de 7 días registrando acidez matutina y carraspeo, correlacionado con la cena de la noche anterior.
- Autoevaluación: verificar empíricamente el vínculo entre hábitos nocturnos y flexibilidad vocal reducida al día siguiente.
- **[HIBRIDO]** — ideal como tracker/diario digital dentro de la app (recordatorios, gráfico de correlación), pero el dato de entrada (sensación de acidez/carraspeo) es autopercepción física.

**6. Dicción y Fonética: Modificación de Vocales (Vowel Modification)**
- Concepto: en agudos, las vocales puras ahogan la voz; hay que "abrir" internamente sin cambiar el reconocimiento del texto.
- Metodología: en notas altas, sombrear la vocal (p. ej. "I" hacia "E" abierta o "U" encubierta; "O" hacia "U" profunda).
- Autoevaluación: espejo — mandíbula debe caer vertical y relajada; si los labios se estiran en "sonrisa de pánico", se rompe la acústica.
- **[INSTRUCCIONAL-FISICO]** — verificación visual/postural directa, no medible de forma fiable por audio o software estándar.

**7. Audiopercepción Musical: El Rastreo del Intervalo de Tercera**
- Concepto: la tercera define el color mayor/menor del acorde; el cantante debe clavarla con precisión milimétrica.
- Metodología: escuchar acorde mayor en piano, cantar la tercera; cambiar el acorde a menor y ajustar bajando un semitono exacto.
- Autoevaluación: afinador digital — la tercera mayor debe quedar perfectamente centrada; tendencia a quedar "plano" indica oído no entrenado en dirección armónica.
- **[DIGITAL-INTERACTIVO]** — caso de uso directo de pitch detection + comparación contra frecuencia objetivo (incluyendo afinación justa vs. temperada si se quiere nivel avanzado).

**8. Psicología Escénica: El Anclaje Somático de Seguridad**
- Concepto: mudar la atención mental de pensamientos catastróficos hacia una sensación corporal concreta como "lugar seguro".
- Metodología: pausa de 3 segundos antes de cantar, enfocando la atención en el peso de los talones y la expansión costal contra el cinturón.
- Autoevaluación: si la respiración inicial es alta (pecho/hombros), el anclaje falló; si la primera nota sale apoyada, funcionó.
- **[INSTRUCCIONAL-FISICO]** — depende de autopercepción respiratoria/emocional; no hay verificación por software.

---

## BLOQUE 3: La Dinámica del Estilo (Fase Vector)

**Tagline:** "Velocidad en el eje, flexibilidad en el borde."
**A quién apunta:** cantante que ya domina passaggio y busca agilidad extrema, dividiendo Bel Canto puro vs. hiper-compresión controlada del estilo Berklee/CCM.

**Repertorio de referencia:**
- Ruta Clásica: *"Ev'ry Valley Shall Be Exalted"* – G.F. Händel (El Mesías). Melismas barrocos largos que exigen pulso staccato interno y control absoluto para que las notas no se emborronen.
- Ruta Contemporánea: *"Lately"* – Stevie Wonder. Vocal runs/melismas de R&B con transiciones instantáneas entre twang, voz soplada y belting en el clímax.

### Ejercicios

**1. El Pulso Staccato Puro**
- Concepto: cada nota debe nacer limpia, corta y separada, sin arrastre ni fuga de aire — el diafragma como arco de violín.
- Metodología: una nota cómoda en zona media; cinco golpes "Ja-Ja-Ja-Ja-Ja" completamente independientes desde el ombligo.
- Autoevaluación: hoja de papel a 5 cm de la boca — no debe moverse; si se inclina, hay escape de aire (golpe de glotis con fuga fónica).
- **[HIBRIDO]** — el escape de aire también deja huella en la banda de ruido de alta frecuencia del espectro (analizable), pero el test de referencia es físico (papel).

**2. La Estabilización de Intervalos Anchos**
- Concepto: al saltar una octava, la tendencia es "escalar" la nota tensionando la garganta; el objetivo es proyectar la nota alta igual que la baja.
- Metodología: nota fundamental con "I" brillante, salto directo a la octava superior manteniendo posición interna e intensidad, y regreso (1-8-1).
- Autoevaluación: afinador cromático visual — la aguja debe saltar instantáneamente y congelarse en verde; si "camina" buscando la nota, hay arrastre y tensión.
- **[DIGITAL-INTERACTIVO]** — descrito literalmente como una herramienta de app: afinador en tiempo real con pitch detection, midiendo velocidad de asentamiento del salto.

**3. La Fluidez Lineal del Melisma**
- Concepto: escalas/arpegios rápidos deben fluir en una sola línea de aire con definición matemática de cada nota, sin frenar ni acelerar descontroladamente.
- Metodología: escala pentatónica o arpegio extendido (1-3-5-8-5-3-1) veloz con "A"/"O" ligadas, mandíbula completamente quieta.
- Autoevaluación: dos dedos en la barbilla — la mandíbula debe permanecer inmóvil; si se mueve al compás de las notas, se compensa con músculos externos la falta de agilidad laríngea.
- **[HIBRIDO]** — la inmovilidad de mandíbula es palpación física, pero la precisión nota-por-nota del melisma es verificable con pitch tracking por nota.

**4. La Bifurcación Estilística (Messa di Voce)**
- Concepto: cambiar el volumen de una nota sostenida sin alterar su afinación, eligiendo además el camino Bel Canto (redondo) o Berklee (twang/belting).
- Metodología: iniciar pianissimo, crescendo hasta forte (variación clásica: más paladar; variación contemporánea: más twang y laringe alta), y diminuendo de regreso.
- Autoevaluación: escuchar el timbre — si la nota sube de afinación al llegar al forte o cae al diminuendo (o se rompe en susurro), el apoyo abdominal falló.
- **[DIGITAL-INTERACTIVO]** — combinación de pitch detection (estabilidad de frecuencia) + análisis de envolvente de amplitud (curva de crescendo/diminuendo) en tiempo real.

**5. Laboratorio: El Analizador Acústico de Estilos**
- Concepto: eliminar la subjetividad de "cómo me suena en mi cabeza" con confirmación visual científica del estilo (mencionan software tipo VoceVista).
- Metodología: cantar nota sostenida en estilo lírico observando el espectrograma (formante del cantor 2500-3000 Hz), luego cambiar a belting y observar el desplazamiento de energía a armónicos superiores.
- Autoevaluación: verificar visualmente la banda de energía correspondiente al estilo elegido.
- **[DIGITAL-INTERACTIVO]** — núcleo técnico para la app: análisis espectral en tiempo real (FFT) con detección de la banda del formante del cantor, tipo VoceVista simplificado en el navegador.

**6. Dicción y Fonética: Sintonización de Formantes (Formant Tuning)**
- Concepto: el tracto vocal es un ecualizador; el clásico amplifica el "formante del cantor" (2500-3000 Hz) y el pop el "formante de habla" (brillo frontal).
- Metodología: clásico: laringe baja, lengua retraída; pop/jazz: laringe algo elevada, proyección hacia dientes delanteros.
- Autoevaluación: espectrograma en tiempo real — banda gruesa 2500-3000 Hz en clásico; distribución homogénea en armónicos altos en pop.
- **[DIGITAL-INTERACTIVO]** — mismo motor de análisis espectral que el laboratorio de estilos; extensión directa de esa función.

**7. Audiopercepción Musical: Descomposición de la Escala Pentatónica y de Blues**
- Concepto: los melismas no deben improvisarse "de oído" al azar; hay que conocer exactamente la escala que se recorre (pensar como instrumentista).
- Metodología: improvisar sobre base de blues/jazz usando solo la pentatónica mayor o la escala de blues, marcando cada nota con metrónomo y acelerando progresivamente.
- Autoevaluación: grabar el melisma veloz y reproducirlo a media velocidad — cada nota debe sonar afinada y firme, no como un "tobogán" impreciso.
- **[DIGITAL-INTERACTIVO]** — grabación + time-stretch de reproducción + pitch detection nota-por-nota son funciones estándar de procesamiento de audio digital.

**8. Psicología Escénica: Monologar el Texto (Método Stanislavski)**
- Concepto: la técnica pura puede sonar fría; se usa el teatro para liberar la voz a través de la verdad emocional.
- Metodología: leer la letra del repertorio como un monólogo dramático frente a alguien, buscando la verdad de cada palabra, y luego cantar manteniendo esa urgencia emocional.
- Autoevaluación: si vuelven las tensiones técnicas al cantar, la mente técnica saboteó la verdad dramática; si la emoción fluye y los agudos salen orgánicos, hubo síntesis artística.
- **[INSTRUCCIONAL-FISICO]** — juicio artístico/emocional subjetivo, no verificable por software; requiere feedback humano (docente/compañero) o autoevaluación grabada en video.

---

## BLOQUE 4: La Trascendencia Acústica (Fase Custom/Elite)

**Tagline:** "Controlar el extremo, camuflar el esfuerzo."
**A quién apunta:** nivel experto/virtuoso (concierto o giras). Bases para uso seguro de extremos anatómicos y resistencia biomecánica en alta exigencia profesional.

**Repertorio de referencia:** el temario no especifica obras concretas para este bloque; solo indica que el repertorio debe rozar los límites físicos de la laringe humana y exigir atletismo vocal supremo y resiliencia escénica industrial (queda pendiente de curación específica al construir la app).

### Ejercicios

**1. El Aislamiento del Registro de Silbido (Whistle Register)**
- Concepto: acceso a la zona más aguda de la voz humana (por encima de C6) mediante cierre casi total de las cuerdas, dejando solo una pequeña abertura anterior.
- Metodología: desde una nota alta de cabeza, inspirar poco aire y emitir un sonido mínimo tipo chillido de ratón con vocal "I", sin fuerza ni volumen.
- Autoevaluación: no debe sentirse ningún esfuerzo en la garganta; picazón, tos o pérdida de voz hablada después indican cierre incorrecto de músculos laríngeos.
- **[HIBRIDO]** — el rango de frecuencia alcanzado (>C6) es medible directamente con pitch detection; el criterio de ausencia de esfuerzo/dolor es físico y subjetivo.

**2. La Activación Supraglótica (Distorsión Saludable)**
- Concepto: efectos distorsionados (growl, scream) se producen con las falsas cuerdas vocales (pliegues ventriculares), no con las cuerdas verdaderas.
- Metodología: imitar un suspiro pesado o gruñido suave, sintiendo la vibración arriba en la garganta; agregar gradualmente una nota limpia debajo del gruñido.
- Autoevaluación: beber un sorbo de agua después del ejercicio — ardor o dolor indica que las cuerdas verdaderas chocaron mal; sin molestias, la distorsión es segura.
- **[INSTRUCCIONAL-FISICO]** — criterio de seguridad basado en dolor/confort físico, no verificable por audio (aunque el tipo de distorsión sí se puede caracterizar espectralmente, el criterio de salud es corporal).

**3. El Laberinto Microtonal y la Coloratura**
- Concepto: música de vanguardia (jazz, gospel, medio oriente) exige micro-ajustes laríngeos rápidos para cuartos de tono, como "alas de colibrí".
- Metodología: practicar coloratura barroca o ad-libs de R&B al 25% de velocidad afinando cada nota intermedia, acelerando gradualmente con metrónomo.
- Autoevaluación: grabar a máxima velocidad y reproducir en cámara lenta — cada nota debe sonar limpia y separada, no un "lamento borroso".
- **[DIGITAL-INTERACTIVO]** — grabación + reproducción a velocidad reducida + pitch detection de microtonos son funciones de procesamiento de audio estándar (requiere resolución fina, ideal para detectar cuartos de tono).

**4. El Escudo de la Resiliencia Escénica**
- Concepto: mantener hábitos vocales de protección de forma automática bajo fatiga física real (coreografía, conciertos largos).
- Metodología: saltos/elevaciones de rodilla 2 minutos hasta agitarse; luego, sin dejar de moverse, mantener Appoggio y cantar una frase exigente del repertorio.
- Autoevaluación: pecho/hombros no deben subir y bajar descontroladamente; si la laringe se mantiene baja y el sonido brillante pese al cansancio, se logró resiliencia biomecánica.
- **[HIBRIDO]** — grabar la frase cantada bajo fatiga permite verificar digitalmente estabilidad de afinación/timbre; el criterio de tensión torácica/respiración es observación física.

**5. Laboratorio: El Simulador de Fatiga y Acústica Adversa (Efecto Lombard)**
- Concepto: entrenar la confianza en la propiocepción cuando el monitoreo auditivo externo está bloqueado (ruido de escenario, auriculares).
- Metodología: auriculares cerrados con ruido rosa o música fuerte, cantar una obra compleja guiándose solo por sensación muscular interna; luego revisar la grabación externa.
- Autoevaluación: la grabación debe mostrar afinación y salud laríngea intactas pese a no poder autoescucharse.
- **[HIBRIDO]** — la app puede generar el ruido rosa/enmascarante y grabar+analizar el resultado (pitch, estabilidad) digitalmente; el aislamiento auditivo físico (auriculares) es parte necesaria del montaje.

**6. Dicción y Fonética: Fonética de Alta Velocidad e Idiomas Complejos**
- Concepto: en registros extremos, consonantes duras (r alemana, nasales francesas) pueden colapsar el apoyo si no se articulan con precisión quirúrgica.
- Metodología: hiper-articular consonantes solo con punta de lengua y labios, manteniendo la parte trasera de la garganta inmóvil y relajada.
- Autoevaluación: grabar en primer plano el cuello — no debe haber venas marcadas ni movimiento brusco de la laringe.
- **[INSTRUCCIONAL-FISICO]** — requiere análisis visual del cuello en video; fuera del alcance confiable de visión por computadora estándar, se recomienda revisión humana o autoinspección en video.

**7. Audiopercepción Musical: Escalas Alteradas e Improvisación Microtonal**
- Concepto: cantar con convicción sobre armonías disonantes (acordes alterados/disminuidos), incluyendo cuartos de tono.
- Metodología: sobre un acorde dominante alterado, cantar la escala alterada completa y resolver con precisión en la tónica del acorde siguiente.
- Autoevaluación: la línea no debe sonar dudosa ni "a ciegas"; la resolución debe caer exactamente en el centro de afinación.
- **[DIGITAL-INTERACTIVO]** — pitch detection puede verificar objetivamente si la nota de resolución cae en el centro exacto de la frecuencia objetivo.

**8. Psicología Escénica: Inmunización contra el Efecto Lombard y Estrés del Entorno**
- Concepto: el Efecto Lombard hace que la gente grite automáticamente ante ruido ambiente; hay que entrenar la mente para confiar en la sensación interna y no en lo que se escucha.
- Metodología: auriculares con ruido rosa a alto volumen tapando la propia voz; cantar la obra más difícil del repertorio guiado solo por propiocepción.
- Autoevaluación: grabación con micrófono externo — la afinación y timbre deben mantenerse igual que sin el ruido; si hubo grito o desafinación, falta madurez propioceptiva.
- **[HIBRIDO]** — el montaje (auriculares + ruido) es físico, pero la verificación final es 100% analizable digitalmente (pitch/timbre de la grabación externa comparado a la referencia).

---

## Higiene Vocal (transversal a todos los bloques)

No es un bloque en sí, pero atraviesa todo el programa: hidratación diferida (2-4 h para llegar a las cuerdas, tomar agua mucho antes de cantar), evitar deshidratantes (café, alcohol, mates calientes), controlar reflujo (evitar picante/grasa antes de dormir), prohibido carraspear (reemplazar por tragar saliva o "tos sorda"), no hablar con ruido de fondo, no susurrar (el susurro tensiona más que hablar normal), y reposo vocal estructurado (silencios de 15-20 min varias veces al día).

- **[HIBRIDO]** — ideal como checklist/tracker diario y recordatorios programados en la app (reposo vocal, hidratación, registro de reflujo tipo Bloque 2), pero el dato de fondo (sensación de sequedad, acidez, fatiga) es autopercepción física no medible por sensores.

---

## Bibliografía

| Autor | Título | Editorial | Cubre |
|---|---|---|---|
| Miller, Richard | The Structure of Singing: System and Art in Vocal Technique | Schirmer Books | Appoggio y pedagogía del canto clásico italiano. |
| Doscher, Barbara | The Functional Unity of the Singing Voice | Scarecrow Press | Anatomía y fisiología laríngea aplicada. |
| Sadolin, Cathrine | Complete Vocal Technique (CVT) | Shout Publishing | Efectos contemporáneos, distorsiones y belting seguro. |
| Riggs, Seth | Singing for the Stars | Alfred Music | Speech Level Singing; mezcla de registros en música popular. |
| McCoy, Scott | Your Voice: An Inside View | Inside View Press | Análisis acústico e informático de la producción vocal. |
| Bunch, Meribeth | Dynamics of the Singing Voice | Springer-Verlag | Relación interdisciplinaria entre cuerpo, mente y fisiología del cantante. |
| Vennard, William | Singing: The Mechanism and the Technic | Carl Fischer | Fonética acústica y modificación de vocales en canto profesional. |
| Protschka, Josef | The International Phonetic Alphabet (IPA) for Singers | Sieling | Articulación de repertorio lírico internacional con AFI. |
| Benward, Bruce & Kolosick, Timothy | Ear Training: A Technique for Listening | McGraw-Hill | Audiopercepción y desarrollo del oído interno (usado en Juilliard). |
| Green, Barry & Gallwey, Timothy | The Inner Game of Music | Doubleday | Psicología escénica: ansiedad, concentración, interferencia mental. |
| Stanislavski, Konstantin | An Actor Prepares | Theatre Arts Books | Subtexto dramático y liberación de la voz por verdad emocional. |

---

## Notas de factibilidad técnica — resumen

Sobre los 32 ejercicios catalogados en los 4 bloques (excluye el ítem transversal de higiene vocal, contado aparte):

- **DIGITAL-INTERACTIVO: 10/32 (~31%)** — principalmente audiopercepción (pedal armónico, terceras, escalas alteradas, pentatónica/blues) y dinámica de estilo (afinador de saltos de octava, Messa di Voce, análisis de formantes/estilos, puente TA/CT vía grabación).
- **HIBRIDO: 13/32 (~41%)** — la mayoría del Bloque 1 (flujo de aire, lip trill, humming, descompresión cervical), laboratorios de fatiga/reflujo, y ejercicios de Bloque 4 (whistle register, resiliencia escénica, efecto Lombard) donde hay un montaje físico pero el resultado final es auditable por audio.
- **INSTRUCCIONAL-FISICO: 9/32 (~28%)** — casi todo lo que depende de espejo, palpación de laringe/mandíbula, sensación de dolor/ardor, o juicio emocional/artístico (Bloque 2 postural, distorsión saludable, Stanislavski, fonética de alta velocidad con inspección de cuello).

**Motor de audio recomendado para la parte digitalizable:**
1. **Detección de pitch en tiempo real** (algoritmo tipo autocorrelación o YIN/pYIN vía Web Audio API + AudioWorklet) para: afinador visual, seguimiento de intervalos/terceras, verificación de saltos de octava, estabilidad de nota en Messa di Voce, y resolución en escalas alteradas.
2. **Análisis espectral/FFT en tiempo real** (estilo VoceVista simplificado en navegador) para: detección del "formante del cantor" (banda 2500-3000 Hz), sintonización de formantes clásico vs. pop, y distinción de energía armónica por estilo.
3. **Grabación + reproducción con time-stretch** (Web Audio API + procesamiento offline) para: comparación de passaggio, melismas veloces reproducidos en cámara lenta, y verificación de estabilidad bajo fatiga o efecto Lombard.
4. **Análisis de envolvente de amplitud (RMS)** para: estabilidad de flujo de aire (siseo), curvas de crescendo/diminuendo, y detección de fuga de aire en ataques.

En conjunto, casi tres cuartas partes del temario (72%, sumando DIGITAL-INTERACTIVO + HIBRIDO) tiene algún componente medible por audio, lo que valida la inversión en un motor de pitch detection + análisis espectral como columna vertebral técnica de la app; el resto debe resolverse con video demostrativo, ilustraciones e instrucciones claras de autopercepción física.

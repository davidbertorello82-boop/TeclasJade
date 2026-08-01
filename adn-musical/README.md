# ADN Musical de Teclas Jade — esquema, fixtures y validador

## Fuente canónica

**El vault de Obsidian (La Casa del Cerebro) es la fuente canónica de cada ADN.**
Los archivos de `fixtures/` son copias sincronizadas en dirección Obsidian → repo
desde:

`D:\Doc_Usuario_Lenovo\Documents\LA-CASA-CEREBRO-1\La Casa del Cerebro\02 - Desarrollo\ADN Musical e Interfaz de Audio\`

- `piloto-1-eco-ritmico.json` ← `🥁 Piloto 1 — Eco rítmico.json`
- `piloto-2-mi-voz-sube.json` ← `🎤 Piloto 2 — Ejercicio vocal Mi voz sube.json`
- `piloto-3-subida-y-regreso.json` ← `🎸 Piloto 3 — Subida y regreso (guitarra).json`

Ante cualquier divergencia entre un fixture y su archivo del vault, **manda el
vault**: la copia del repositorio se corrige para igualarlo, nunca al revés.

Este repositorio vive en:
`D:\Doc_Usuario_Lenovo\Favorites\Desktop\IA\TeclasJade\teclas-jade-web`

## Qué es cada cosa

- `schema/adn-musical.schema.json` — **contrato, no implementación**: JSON Schema
  (draft 2020-12) del ADN v0.2.1-draft. Ningún renderer ni componente debe
  reinterpretar lo que el contrato ya define.
- `schema/evidence-basis.v1.json` — vocabulario controlado de identificadores
  `basis` para la procedencia por dato (`field_evidence`). Es una **copia
  técnica derivada byte a byte** del registro canónico del vault
  (`02 - Desarrollo/ADN Musical e Interfaz de Audio/evidence-basis.v1.json`);
  ante divergencia manda el vault. La Compuerta B lo carga en ejecución y
  falla de forma cerrada si no puede validarlo íntegro.
- `fixtures/` — los tres pilotos aprobados por David, usados como casos de
  conformidad del esquema y del validador.
- `validador/validar-adn.ts` — validación estructural (ajv) + semántica
  (invariantes con aritmética de fracciones exactas; sin números de punto
  flotante para duraciones).

## Cómo correr el validador

    npm run validar-adn

Valida todos los `.json` de `fixtures/`. Para validar archivos puntuales:

    npm run validar-adn -- ruta/al/archivo.json [otro.json ...]

Salida: `✓ VÁLIDO` por archivo, o la lista de errores `✗`. Exit code 0 solo si
todos pasan.

## Versión y limitación vigente

Versión del contrato: **v0.2.1-draft**. Todavía **no** modela: ligaduras de
prolongación (ties), grupos irregulares (tuplets), acordes multi-nota,
dinámicas ni armaduras con alteraciones. Queda pendiente un **Piloto 4** que
ejercite esos elementos antes de ampliar el esquema.

La gobernanza pedagógica (aprobaciones, evidencia, derechos) vive en el vault
de Obsidian, no acá. Los fixtures no son contenido publicado.

## Skill, conformidad y compuertas (v0.1)

- `skill/adn-musical-compilador/SKILL.md` — **fuente editable canónica** del
  artefacto ejecutable de la Skill ADN v0.1-experimental. La copia instalada en
  `.claude/skills/adn-musical-compilador/SKILL.md` es un **espejo derivado**:
  nunca se edita directamente; se regenera copiando desde la fuente y se
  verifica por SHA-256.
- `conformance/` — fixtures técnicos de conformidad (no curriculares, no
  publicables) que respaldan reglas concretas de la cobertura v0.1.
- `validador/cobertura-v01.ts` — **Compuerta A2** (cobertura v0.1):
  `npm run cobertura-adn`. Distinción clave: `✓ VÁLIDO` (Compuerta B,
  `validar-adn`) prueba estructura y semántica contra el esquema general;
  `✓ COBERTURA v0.1` (Compuerta A2) prueba que el ADN use solo el subconjunto
  soportado por la skill. Un ADN entregable necesita las dos.
- `validador/cobertura-v01.test.ts` — pruebas reproducibles de ambas compuertas:
  `npm run test:cobertura-adn`.
- `pruebas/` — casos de regresión de la skill (fuente cruda + resultado
  esperado). **La skill NO debe leer esta carpeta al compilar.**
- El vault de Obsidian continúa siendo canónico para decisiones y conocimiento;
  la skill es únicamente el artefacto ejecutable que los aplica.

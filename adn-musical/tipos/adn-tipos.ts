// Tipos neutrales compartidos del ADN Musical (esquema 0.2.2-draft).
// SOLO tipos: sin lógica, sin valores, sin dependencias de UI ni de Node.
// La autoridad estructural en ejecución sigue siendo el JSON Schema
// (adn-musical/schema/adn-musical.schema.json) y el canon del conocimiento
// vive en el vault de Obsidian: este módulo es la representación TypeScript
// compartida por el validador, el comprobador de cobertura y el futuro
// adaptador de demostración — no una segunda fuente canónica.

// ---------- vocabularios ----------

export type EtiquetaEvidencia =
  | "[verificado]"
  | "[documentado]"
  | "[confirmado por David]"
  | "[calculado]"
  | "[ilegible]"
  | "[desconocido]";

// Contexto instrumental de un basis del registro v2. null = aplicable a
// cualquier realización; un valor restringe el basis a documentos cuya
// instrument_realization.kind coincida (la Compuerta B rechaza el uso cruzado).
export type InstrumentKind = null | "none" | "voice" | "guitar" | "piano";

// ---------- documento ADN ----------

export interface WrittenPitch {
  step: string;
  alter: number;
  octave: number;
}

export interface NotaAdn {
  id: string;
  written_pitch: WrittenPitch;
  evidence?: string;
}

export interface EventoAdn {
  id: string;
  measure: number;
  beat: string;
  duration: string;
  notes?: NotaAdn[];
}

export interface VozAdn {
  id: string;
  kind: string;
  events: EventoAdn[];
}

export interface SeccionAdn {
  role: string;
  measures: number[];
  repeats?: string;
  gap?: string;
}

export interface AlternativaGuitarra {
  string: number;
  fret: number;
  finger?: number | null;
}

export interface RealizacionAdn {
  note_id: string;
  string?: number;
  fret?: number;
  finger?: number | null;
  hand?: string;
  evidence?: string;
  alternatives?: AlternativaGuitarra[];
}

export interface RangoEscrito {
  low: WrittenPitch;
  high: WrittenPitch;
}

export interface RealizacionInstrumento {
  kind: string;
  sound?: string;
  tuning?: string;
  capo?: number;
  sounding_transposition_octaves?: number;
  position?: string | null;
  right_hand?: string | null;
  realizations?: RealizacionAdn[];
  profile?: string | null;
  range_orientative?: object | null;
  comfortable_tessitura?: object | null;
  exercise_range?: RangoEscrito;
  technique?: string | null;
  support?: object | null;
}

export interface SilabaAdn {
  id: string;
  text: string;
}

export interface PalabraAdn {
  id: string;
  text: string;
  syllables: SilabaAdn[];
}

export interface UnidadCantada {
  id: string;
  syllable_ids: string[];
  junction: string;
  note_ids: string[];
  melisma?: boolean;
}

export interface AlineacionTexto {
  language: string;
  orthographic: { text: string; words: PalabraAdn[] };
  sung_units: UnidadCantada[];
}

export interface VarianteAdn {
  id: string;
  label?: string;
  transform: Record<string, unknown>;
}

export interface EntradaEvidenciaCampo {
  evidence: string;
  basis: string;
}

export interface GobernanzaAdn {
  aprobado_por_david: boolean;
  listo_para_desarrollo: boolean;
  validacion_profesional: string;
  transposition_allowed: boolean;
  unknown_notation: unknown[];
  unsupported_features: unknown[];
  field_evidence?: Record<string, EntradaEvidenciaCampo> | null;
}

export interface SemanticaMusical {
  time: {
    signature: string;
    beats_per_measure: number;
    beat_unit: string;
    bpm: number;
    tempo_term?: string | null;
  };
  key?: { tonic: string; mode: string };
  measures: number;
  anacrusis?: object | null;
  structure?: SeccionAdn[];
  voices: VozAdn[];
}

export interface AdnDoc {
  schema_version: string;
  exercise: {
    id: string;
    title: string;
    source: Record<string, unknown>;
    evidence_default?: string;
  };
  musical_semantics: SemanticaMusical;
  instrument_realization: RealizacionInstrumento;
  text_and_vocal_alignment: AlineacionTexto | null;
  presentation_and_rendering: {
    type: string;
    views: string[];
    controls: string[];
    bpm_initial?: number;
    engine_suggested?: string | null;
    hand_colors?: Record<string, string> | null;
  };
  variants?: VarianteAdn[];
  evidence_governance: GobernanzaAdn;
}

// ---------- registro de identificadores basis (v2) ----------

export interface EntradaBasis {
  id: string;
  evidence: EtiquetaEvidencia;
  instrument_kind: InstrumentKind;
  pointer_pattern: string;
  meaning: string;
}

export interface RegistroBasis {
  appliesToSchemaVersion: string;
  entradas: readonly EntradaBasis[];
}

export type ResultadoCarga =
  | { ok: true; registro: RegistroBasis }
  | { ok: false; detalle: string };

// Inyección controlada EXCLUSIVAMENTE para las pruebas del cargador del
// registro: `contenido !== undefined` (comparación estricta) usa ese texto sin
// tocar el disco; si no, `ruta` si fue provista; si no, la ruta predeterminada
// del validador, relativa a su módulo.
export interface OpcionesCarga {
  ruta?: string;
  contenido?: string;
  exigirOrdenAlfabetico?: boolean;
}

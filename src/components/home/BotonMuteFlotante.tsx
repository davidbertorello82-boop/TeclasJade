type BotonMuteFlotanteProps = {
  silenciado: boolean;
  onAlternar: () => void;
};

export function BotonMuteFlotante({
  silenciado,
  onAlternar,
}: BotonMuteFlotanteProps) {
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-label={silenciado ? "Activar sonido" : "Silenciar sonido"}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-jade text-lino shadow-lg transition-colors hover:bg-jade-claro"
    >
      {silenciado ? "🔇" : "🔊"}
    </button>
  );
}

import { FaSpinner } from "react-icons/fa";

export default function PageState({
  loading,
  error,
  dataLength,
  onRetry,
  onReset,
  loadingText = "Chargement...",
  emptyText = "Aucune donnée trouvée",
}) {
  // ── LOADING ─────────────────────────────
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{loadingText}</p>
        </div>
      </section>
    );
  }

  // ── ERROR ───────────────────────────────
  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4"> Le serveur ne marche pas</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56] transition"
            >
              Réessayer
            </button>
          )}
        </div>
      </section>
    );
  }

  // ── EMPTY STATE ─────────────────────────
  if (dataLength === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-5xl mb-4">🎮</div>
          <p className="text-gray-500 text-lg mb-6">{emptyText}</p>

          {onReset && (
            <button
              onClick={onReset}
              className="px-6 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56] transition"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>
    );
  }

  return null;
}

/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaGamepad, FaLayerGroup, FaUsers } from "react-icons/fa";
import { games, players, playerPhotoFallback } from "../../data/GamesData";
import GameBrand from "../../components/team/GameBrand";

const toRgba = (hex, alpha) => {
  const value = hex.replace("#", "");
  const safeValue =
    value.length === 3
      ? value
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : value;

  const number = Number.parseInt(safeValue, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const cardSurface = (game) => ({
  background: `
    radial-gradient(circle at top left, ${toRgba(game.accent, 0.28)}, transparent 44%),
    radial-gradient(circle at bottom right, ${toRgba(game.accentSoft, 0.22)}, transparent 42%),
    linear-gradient(160deg, rgba(12, 12, 12, 0.96) 0%, rgba(18, 18, 18, 0.94) 55%, rgba(7, 7, 7, 0.98) 100%)
  `,
});

export default function TeamPage() {
  const navigate = useNavigate();
  const multiGamePlayers = players.filter(
    (player) => player.gameTags.length > 1,
  );

  return (
    <section className="relative overflow-hidden bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-[#E50914]/18 blur-3xl" />
        <div className="absolute top-1/3 right-[-8%] h-80 w-80 rounded-full bg-[#2563EB]/14 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] items-end mb-12 md:mb-16">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.38em] text-[#E50914] mb-4">
              GeS Teams Hub
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] max-w-4xl">
              Nos jeux, presents dans le code comme un vrai hub d organisation
              esport.
            </h1>
            <p className="text-gray-400 text-base md:text-lg mt-5 max-w-3xl leading-relaxed">
              L onglet Teams devient un index par jeu, inspire de Team Liquid:
              chaque roster GeS est gere directement dans le front avec les tags
              des players, leurs photos et un fallback logo quand une image
              manque.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {games.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => navigate(`/team/game/${game.slug}`)}
                  className="px-3 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-white border border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 transition"
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                  Snapshot
                </p>
                <h2 className="text-white text-2xl font-black">
                  GeS roster overview
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center text-[#E50914]">
                <FaLayerGroup size={18} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="text-2xl md:text-3xl font-black text-white">
                  {games.length}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-[0.24em] mt-2">
                  Jeux
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="text-2xl md:text-3xl font-black text-white">
                  {players.length}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-[0.24em] mt-2">
                  Profils
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="text-2xl md:text-3xl font-black text-white">
                  {multiGamePlayers.length}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-[0.24em] mt-2">
                  Multi-jeux
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mt-5">
              Chaque carte ouvre un roster detaille avec la repartition par jeu,
              des visuels locaux et un rendu adapte au branding GeS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.article
              key={game.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => navigate(`/team/game/${game.slug}`)}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              style={cardSurface(game)}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.08)_50%,rgba(0,0,0,0.35)_100%)]" />

              <div className="relative min-h-[360px] p-6 md:p-7 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/50 mb-2">
                      {game.shortLabel}
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/80">
                      <FaUsers size={11} />
                      {game.rosterCount} membre(s)
                    </div>
                  </div>

                  <div
                    className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] border"
                    style={{
                      color: game.accent,
                      borderColor: toRgba(game.accent, 0.32),
                      backgroundColor: toRgba(game.accent, 0.12),
                    }}
                  >
                    GeS
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-8">
                  <div className="relative w-full max-w-[18rem] h-40 md:h-44">
                    <div
                      className="absolute inset-0 rounded-[2rem] blur-3xl"
                      style={{
                        background: `radial-gradient(circle, ${toRgba(
                          game.accent,
                          0.34,
                        )} 0%, transparent 72%)`,
                      }}
                    />
                    <div className="relative h-full w-full">
                      <GameBrand
                        game={game}
                        logoClassName="w-full h-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105"
                        textClassName="text-4xl md:text-5xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-3">
                      {game.featuredPlayers.map((player, playerIndex) => (
                        <div
                          key={player.id}
                          className="w-11 h-11 rounded-full border-2 overflow-hidden bg-black/60"
                          style={{
                            borderColor:
                              playerIndex === 0
                                ? toRgba(game.accent, 0.9)
                                : "rgba(255,255,255,0.08)",
                          }}
                        >
                          <img
                            src={player.photo || playerPhotoFallback}
                            alt={player.pseudo}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-white">
                        {game.teamName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {game.playerCount} player(s) / {game.staffCount} staff
                      </p>
                    </div>
                  </div>

                  <h3 className="text-white text-2xl font-black leading-tight">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mt-3 min-h-[4.5rem]">
                    {game.description}
                  </p>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/70">
                      <FaGamepad size={11} />
                      Ouvrir le roster
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                      Voir la page <FaArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

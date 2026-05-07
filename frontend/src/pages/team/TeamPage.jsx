/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import { games, players, playerPhotoFallback } from "../../data/GamesData";
import GameBrand from "../../components/team/GameBrand";

const toRgba = (hex, alpha) => {
  const v = hex.replace("#", "");
  const safe =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const n = parseInt(safe, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default function TeamPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-transparent py-16 md:py-24 px-4 md:px-8 z-10 overflow-hidden">
      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#E50914]/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#E50914]/8 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#E50914]" />
            <span className="text-[#E50914] text-xs font-black uppercase tracking-[0.4em]">
              Gascom Esports
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] max-w-2xl">
              Nos <br />
              <span className="text-[#E50914]">Équipes</span>
            </h1>

            <div className="flex gap-8 md:gap-12 pb-1">
              {[
                { val: games.length, label: "Jeux" },
                { val: players.length, label: "Joueurs" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <p className="text-4xl md:text-5xl font-black text-white">
                    {s.val}
                  </p>
                  <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-1">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onClick={() => navigate(`/team/game/${game.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* CARD */
function GameCard({ game, index, onClick }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer
                 border border-white/8 bg-[#0e0e0e]
                 hover:border-white/20 transition-all duration-500
                 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left,
            ${toRgba(game.accent, 0.18)} 0%, transparent 60%)`,
        }}
      />

      {/* Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: game.accent }}
      />

      <div className="relative p-6 flex flex-col h-full min-h-[320px]">
        {/* TOP */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.35em] mb-1"
              style={{ color: game.accent }}
            >
              {game.shortLabel}
            </p>
            <h3 className="text-white font-black text-xl leading-tight">
              {game.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400">
            <FaUsers size={10} />
            {game.rosterCount}
          </div>
        </div>

        {/* LOGO */}
        <div className="flex-1 flex items-center justify-center py-4 relative">
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{ background: game.accent }}
          />
          <div className="relative w-full max-w-[180px] h-32">
            <GameBrand
              game={game}
              logoClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              textClassName="text-4xl"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
          {/* Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {game.featuredPlayers.slice(0, 4).map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0e0e0e]"
                  style={{ zIndex: 4 - i }}
                >
                  <img
                    src={player.photo || playerPhotoFallback}
                    alt={player.pseudo}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-white text-xs font-semibold leading-none">
                {game.teamName}
              </p>
              <p className="text-gray-600 text-[10px] mt-0.5">
                {game.playerCount}J · {game.staffCount}S
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:border-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
            <FaArrowRight size={11} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

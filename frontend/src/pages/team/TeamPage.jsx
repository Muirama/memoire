import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import { games, playerPhotoFallback, players } from "../../data/GamesData";
import GameBrand from "../../components/team/GameBrand";

export default function TeamPage() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent px-4 py-16 md:px-8 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#E50914]/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#E50914]/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-[#E50914]" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#E50914]">
              Gascom Esports
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h1 className="max-w-2xl text-5xl font-black leading-[0.9] text-white md:text-7xl">
              Nos <br />
              <span className="text-[#E50914]">Équipes</span>
            </h1>

            <div className="flex gap-8 pb-1 md:gap-12">
              {[
                { val: games.length, label: "Jeux" },
                { val: players.length, label: "Joueurs" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="text-4xl font-black text-white md:text-5xl">
                    {stat.val}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-500">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => navigate("/team/admin")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              Équipe administrative
            </button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

function GameCard({ game, index, onClick }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="group relative min-h-[320px] cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#0e0e0e] transition-all duration-500 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-50"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

      <div className="relative flex h-full flex-col p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.35em] text-gray-500">
              {game.shortLabel}
            </p>
            <h3 className="text-xl font-black leading-tight text-white">
              {game.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/3 px-3 py-1.5 text-xs text-gray-400">
            <FaUsers size={10} />
            {game.rosterCount}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-4">
          <div className="absolute h-40 w-40 rounded-full bg-white/20 opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
          <div className="relative h-32 w-full max-w-[180px]">
            <GameBrand
              game={game}
              logoClassName="h-full w-full object-contain opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
              textClassName="text-4xl"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {game.featuredPlayers.slice(0, 4).map((player, avatarIndex) => (
                <motion.div
                  key={player.id}
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: avatarIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#0e0e0e]"
                  style={{ zIndex: 4 - avatarIndex }}
                >
                  <img
                    src={player.photo || playerPhotoFallback}
                    alt={player.pseudo}
                    className="h-full w-full object-cover object-top"
                  />
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold leading-none text-white">
                {game.teamName}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-600">
                {game.rosters.length} roster{game.rosters.length > 1 ? "s" : ""} ·{" "}
                {game.playerCount} joueur{game.playerCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-white/30 group-hover:text-white">
            <FaArrowRight size={11} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

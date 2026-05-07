/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGlobe, FaUsers } from "react-icons/fa";
import { getGameBySlug, playerPhotoFallback } from "../../data/GamesData";
import GameBrand from "../../components/team/GameBrand";

const toRgba = (hex, alpha) => {
  const v = hex.replace("#", "");
  const s =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const n = parseInt(s, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const buildPlayerTags = (player, activeGameName) => [
  activeGameName,
  ...player.extraTags,
  ...player.gameTags.filter((t) => t !== activeGameName),
];

export default function GameDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const game = getGameBySlug(slug);

  if (!game)
    return (
      <section
        className="relative bg-transparent min-h-screen flex items-center
                        justify-center z-10 px-4"
      >
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-5">Jeu non trouvé.</p>
          <button
            onClick={() => navigate("/team")}
            className="inline-flex items-center gap-2 rounded-full border
                     border-white/10 px-5 py-3 text-white hover:bg-white/5 transition"
          >
            <FaArrowLeft size={12} /> Retour
          </button>
        </div>
      </section>
    );

  const lineup = game.players.filter((p) => p.status === "Player");
  const staff = game.players.filter((p) => p.status === "Staff");

  return (
    <section
      className="relative overflow-hidden bg-transparent min-h-screen
                        py-12 md:py-20 px-4 md:px-8 z-10"
    >
      {/* Orbes */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 -left-20 h-[500px] w-[500px]
                        rounded-full blur-[140px]"
          style={{ background: toRgba(game.accent, 0.12) }}
        />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-[100px]"
          style={{ background: toRgba(game.accentSoft, 0.1) }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* ── Retour ── */}
        <button
          onClick={() => navigate("/team")}
          className="group inline-flex items-center gap-2 text-gray-500
                     hover:text-white transition mb-12 text-sm font-semibold"
        >
          <FaArrowLeft
            size={12}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Toutes les équipes
        </button>

        {/* ── Hero ── */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-28">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ background: game.accent }} />
              <span
                className="text-xs font-black uppercase tracking-[0.4em]"
                style={{ color: game.accent }}
              >
                {game.shortLabel}
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-white
                           leading-[0.9] mb-6"
            >
              {game.name}
            </h1>

            <p
              className="text-gray-400 text-base md:text-lg leading-relaxed
                          max-w-lg mb-10"
            >
              {game.description}
            </p>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { val: game.rosterCount, label: "Membres" },
                { val: game.playerCount, label: "Players" },
                { val: game.staffCount, label: "Staff" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white tabular-nums">
                    {s.val}
                  </p>
                  <p className="text-gray-600 text-xs uppercase tracking-[0.3em] mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-25"
              style={{ background: game.accent }}
            />
            <div className="relative w-full max-w-xs h-56 md:h-72">
              <GameBrand
                game={game}
                logoClassName="w-full h-full object-contain
                               drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                textClassName="text-5xl md:text-6xl"
              />
            </div>
          </motion.div>
          
        </div>

        {/* ── Roster ── */}
        {game.players.length === 0 ? (
          <div
            className="rounded-2xl border border-white/8 bg-[#0e0e0e]
                          p-16 text-center"
          >
            <FaUsers className="text-4xl text-white/15 mx-auto mb-4" />
            <p className="text-gray-500">Aucun joueur pour ce jeu.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {lineup.length > 0 && (
              <RosterSection
                title="Lineup"
                count={lineup.length}
                accent={game.accent}
                players={lineup}
                game={game}
              />
            )}
            {staff.length > 0 && (
              <RosterSection
                title="Staff"
                count={staff.length}
                accent={game.accentSoft}
                players={staff}
                game={game}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Section roster ────────────────────────────────────────
function RosterSection({ title, count, accent, players, game }) {
  return (
    <div>
      {/* Titre section */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-white text-2xl font-black">{title}</h2>
        <span
          className="text-xs font-black px-3 py-1 rounded-full border"
          style={{
            color: accent,
            borderColor: toRgba(accent, 0.3),
            background: toRgba(accent, 0.1),
          }}
        >
          {count}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {players.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            game={game}
            accent={accent}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

// ── Card joueur ───────────────────────────────────────────
function PlayerCard({ player, game, accent, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/8
                 bg-[#0e0e0e] hover:border-white/20 transition-all duration-400
                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Bande couleur en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: accent }}
      />

      {/* Glow hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                      transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top,
               ${toRgba(accent, 0.12)} 0%, transparent 60%)`,
        }}
      />

      {/* Photo */}
      <div
        className="relative h-64 overflow-hidden"
        style={{
          background: `linear-gradient(160deg,
               ${toRgba(game.accent, 0.15)} 0%,
               ${toRgba(game.accentSoft, 0.08)} 50%,
               rgba(10,10,10,1) 100%)`,
        }}
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-[10px] font-black uppercase tracking-[0.3em]
                           bg-black/50 border border-white/10 px-2.5 py-1
                           rounded-full text-white/70 backdrop-blur-sm"
          >
            {player.number ? `#${player.number}` : player.role}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span
            className="text-[10px] font-black uppercase tracking-[0.25em]
                           px-2.5 py-1 rounded-full border backdrop-blur-sm"
            style={{
              color: accent,
              borderColor: toRgba(accent, 0.35),
              background: toRgba(accent, 0.15),
            }}
          >
            {player.status}
          </span>
        </div>

        {/* Image */}
        {player.photo ? (
          <img
            src={player.photo}
            alt={player.pseudo}
            loading="lazy"
            className="absolute bottom-0 left-0 right-0 w-full h-full
                          object-contain object-bottom
                          group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={playerPhotoFallback}
              alt="GeS"
              loading="lazy"
              className="w-20 h-20 object-contain opacity-20"
            />
          </div>
        )}

        {/* Dégradé bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-[#0e0e0e] to-transparent"
        />
      </div>

      {/* Infos */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-white font-black text-lg leading-none">
              {player.pseudo}
            </h3>
            <p className="text-gray-500 text-xs mt-1">{player.role}</p>
          </div>
          {player.nationality && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px]
                             font-semibold text-gray-500 border border-white/8
                             bg-white/3 px-2.5 py-1 rounded-full flex-shrink-0"
            >
              <FaGlobe size={9} /> {player.nationality}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {buildPlayerTags(player, game.name).map((tag) => {
            const isCurrent = tag === game.name;
            return (
              <span
                key={`${player.id}-${tag}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em]
                               px-2.5 py-1 rounded-full border"
                style={{
                  color: isCurrent ? accent : "rgba(255,255,255,0.5)",
                  borderColor: isCurrent
                    ? toRgba(accent, 0.3)
                    : "rgba(255,255,255,0.08)",
                  background: isCurrent
                    ? toRgba(accent, 0.1)
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

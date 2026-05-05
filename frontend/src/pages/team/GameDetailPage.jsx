/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGamepad,
  FaGlobe,
  FaLayerGroup,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import { getGameBySlug, playerPhotoFallback } from "../../data/GamesData";
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

const buildPlayerTags = (player, activeGameName) => [
  activeGameName,
  ...player.extraTags,
  ...player.gameTags.filter((tag) => tag !== activeGameName),
];

function SectionTitle({ title, count, accent }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="text-white text-2xl md:text-3xl font-black">{title}</h2>
      <span
        className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-[0.24em]"
        style={{
          color: accent,
          borderColor: toRgba(accent, 0.28),
          backgroundColor: toRgba(accent, 0.12),
        }}
      >
        {count}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function PlayerCard({ player, game, accent }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0B]/80 backdrop-blur-md shadow-[0_18px_56px_rgba(0,0,0,0.28)]"
    >
      <div
        className="relative h-72 border-b border-white/8"
        style={{
          background: `
            radial-gradient(circle at top, ${toRgba(game.accent, 0.26)}, transparent 48%),
            radial-gradient(circle at bottom right, ${toRgba(
              game.accentSoft,
              0.18,
            )}, transparent 42%),
            linear-gradient(180deg, rgba(11,11,11,0.94) 0%, rgba(15,15,15,1) 100%)
          `,
        }}
      >
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
          {player.number ? `#${player.number}` : player.role}
        </div>

        <div
          className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] border"
          style={{
            color: accent,
            borderColor: toRgba(accent, 0.28),
            backgroundColor: toRgba(accent, 0.12),
          }}
        >
          {player.status}
        </div>

        <div className="absolute inset-0 flex items-end justify-center px-6 pt-8">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.pseudo}
              loading="lazy"
              className="h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={playerPhotoFallback}
              alt="Logo GeS"
              loading="lazy"
              className="h-28 w-28 object-contain mb-8 opacity-90"
            />
          )}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-black">{player.pseudo}</h3>
            <p className="text-sm text-gray-400 mt-1">{player.role}</p>
          </div>

          {player.nationality && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300">
              <FaGlobe size={11} />
              {player.nationality}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {buildPlayerTags(player, game.name).map((tag) => {
            const isCurrentGame = tag === game.name;
            return (
              <span
                key={`${player.id}-${tag}`}
                className="inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: isCurrentGame ? accent : "rgba(255,255,255,0.78)",
                  borderColor: isCurrentGame
                    ? toRgba(accent, 0.28)
                    : "rgba(255,255,255,0.12)",
                  backgroundColor: isCurrentGame
                    ? toRgba(accent, 0.12)
                    : "rgba(255,255,255,0.04)",
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

export default function GameDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const game = getGameBySlug(slug);

  if (!game) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10 px-4">
        <div className="text-center">
          <p className="text-gray-400 text-xl">Jeu non trouve.</p>
          <button
            onClick={() => navigate("/team")}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-white hover:bg-white/5 transition"
          >
            <FaArrowLeft size={12} />
            Retour au hub
          </button>
        </div>
      </section>
    );
  }

  const lineup = game.players.filter((player) => player.status === "Player");
  const staff = game.players.filter((player) => player.status === "Staff");

  return (
    <section className="relative overflow-hidden bg-transparent min-h-screen py-10 md:py-16 px-4 md:px-6 z-10">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 left-[-10%] h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: toRgba(game.accent, 0.18) }}
        />
        <div
          className="absolute top-1/3 right-[-8%] h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: toRgba(game.accentSoft, 0.15) }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <button
          onClick={() => navigate("/team")}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-white/75 hover:text-white hover:bg-white/5 transition"
        >
          <FaArrowLeft size={12} />
          Retour aux jeux
        </button>

        <div
          className="mt-6 overflow-hidden rounded-[2.5rem] border border-white/10"
          style={{
            background: `
              radial-gradient(circle at top left, ${toRgba(
                game.accent,
                0.26,
              )}, transparent 42%),
              radial-gradient(circle at bottom right, ${toRgba(
                game.accentSoft,
                0.22,
              )}, transparent 42%),
              linear-gradient(160deg, rgba(11,11,11,0.97) 0%, rgba(16,16,16,0.96) 100%)
            `,
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] p-6 md:p-8 lg:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-white/55 mb-4">
                GeS roster page
              </p>
              <div className="flex items-center gap-3 flex-wrap mb-5">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]"
                  style={{
                    color: game.accent,
                    borderColor: toRgba(game.accent, 0.3),
                    backgroundColor: toRgba(game.accent, 0.12),
                  }}
                >
                  <FaGamepad size={11} />
                  {game.shortLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                  <FaLayerGroup size={11} />
                  {game.teamName}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95]">
                {game.name}
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-5 max-w-3xl">
                {game.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-black text-white">
                    {game.rosterCount}
                  </p>
                  <p className="text-xs uppercase tracking-[0.26em] text-gray-500 mt-2">
                    Membres
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-black text-white">
                    {game.playerCount}
                  </p>
                  <p className="text-xs uppercase tracking-[0.26em] text-gray-500 mt-2">
                    Players
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-black text-white">
                    {game.staffCount}
                  </p>
                  <p className="text-xs uppercase tracking-[0.26em] text-gray-500 mt-2">
                    Staff
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/25 backdrop-blur-md p-5 md:p-6">
              <div className="relative min-h-[18rem]">
                <div
                  className="absolute inset-0 rounded-[2rem] blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${toRgba(
                      game.accent,
                      0.34,
                    )} 0%, transparent 72%)`,
                  }}
                />

                <div className="relative flex items-center justify-center h-44 md:h-48">
                  <GameBrand
                    game={game}
                    logoClassName="w-full h-full object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.5)]"
                    textClassName="text-5xl md:text-6xl"
                  />
                </div>

                <div className="grid grid-cols-4 gap-3 mt-4">
                  {game.featuredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="rounded-[1.25rem] border border-white/10 bg-[#111111] p-2"
                    >
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-black/60">
                        <img
                          src={player.photo || playerPhotoFallback}
                          alt={player.pseudo}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 text-center mt-2">
                        {player.pseudo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          {lineup.length > 0 && (
            <div className="mb-12">
              <SectionTitle
                title="Lineup"
                count={lineup.length}
                accent={game.accent}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lineup.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    game={game}
                    accent={game.accent}
                  />
                ))}
              </div>
            </div>
          )}

          {staff.length > 0 && (
            <div>
              <SectionTitle
                title="Staff and support"
                count={staff.length}
                accent={game.accentSoft}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {staff.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    game={game}
                    accent={game.accentSoft}
                  />
                ))}
              </div>
            </div>
          )}

          {game.players.length === 0 && (
            <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-10 text-center">
              <FaUsers className="text-4xl text-white/20 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Aucun profil n est encore rattache a ce jeu.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0"
              style={{
                color: game.accent,
                borderColor: toRgba(game.accent, 0.28),
                backgroundColor: toRgba(game.accent, 0.12),
              }}
            >
              <FaUserShield size={18} />
            </div>
            <div>
              <h3 className="text-white text-xl font-black">
                Roster gere directement dans le code
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-2">
                Les joueurs visibles ici viennent des donnees front, relies a
                leur jeu par leurs tags. Si une photo manque, le logo GeS blanc
                prend automatiquement le relais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

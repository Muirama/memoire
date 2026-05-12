import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaGlobe, FaUsers } from "react-icons/fa";
import { getGameBySlug, playerPhotoFallback } from "../../data/GamesData";
import GameBrand from "../../components/team/GameBrand";

const toRgba = (hex, alpha) => {
  const value = hex.replace("#", "");
  const safe =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const number = parseInt(safe, 16);
  return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
};

const unique = (values) => Array.from(new Set(values.filter(Boolean)));

const buildPlayerTags = (player, activeGameName, sectionType) => {
  if (sectionType === "staff") {
    return unique([
      player.note || player.staffRole,
      player.memberTypes?.includes("Player") ? "Competitor" : "",
      ...player.gameTags.filter((tag) => tag !== activeGameName),
    ]);
  }

  return unique([
    player.lineupStatus,
    player.note,
    player.secondaryRole,
    ...player.gameTags.filter((tag) => tag !== activeGameName),
  ]);
};

export default function GameDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const game = getGameBySlug(slug);

  if (!game) {
    return (
      <section className="relative z-10 flex min-h-screen items-center justify-center bg-transparent px-4">
        <div className="text-center">
          <p className="mb-5 text-xl text-gray-400">Jeu non trouvé.</p>
          <button
            type="button"
            onClick={() => navigate("/team")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-white transition hover:bg-white/5"
          >
            <FaArrowLeft size={12} /> Retour
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent px-4 py-12 md:px-8 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-20 -top-32 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: toRgba(game.accent, 0.12) }}
        />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-[100px]"
          style={{ background: toRgba(game.accentSoft, 0.1) }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/team")}
          className="group mb-12 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-white"
        >
          <FaArrowLeft
            size={12}
            className="transition-transform group-hover:-translate-x-1"
          />
          Toutes les équipes
        </button>

        <div className="mb-20 grid items-center gap-10 md:mb-28 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: game.accent }} />
              <span
                className="text-xs font-black uppercase tracking-[0.4em]"
                style={{ color: game.accent }}
              >
                {game.shortLabel}
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-black leading-[0.9] text-white md:text-7xl">
              {game.name}
            </h1>

            <p className="mb-10 max-w-lg text-base leading-relaxed text-gray-400 md:text-lg">
              {game.description}
            </p>

            <div className="flex flex-wrap gap-10">
              {[
                { val: game.rosters.length, label: "Rosters" },
                { val: game.playerCount, label: "Players" },
                { val: game.staffCount, label: "Staff" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-black tabular-nums text-white">
                    {stat.val}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full opacity-25 blur-3xl"
              style={{ background: game.accent }}
            />
            <div className="relative h-56 w-full max-w-xs md:h-72">
              <GameBrand
                game={game}
                logoClassName="h-full w-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                textClassName="text-5xl md:text-6xl"
              />
            </div>
          </motion.div>
        </div>

        {game.players.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[#0e0e0e] p-16 text-center">
            <FaUsers className="mx-auto mb-4 text-4xl text-white/15" />
            <p className="text-gray-500">Aucun membre pour ce jeu.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {game.rosters.map((roster) => (
              <GameRosterBlock
                key={roster.id}
                roster={roster}
                game={game}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GameRosterBlock({ roster, game }) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#0e0e0e]/80 p-6 md:p-8">
      <div className="mb-10 flex flex-col gap-5 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-xs font-black uppercase tracking-[0.35em]"
            style={{ color: game.accent }}
          >
            {roster.label}
          </p>
          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            {roster.name}
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { label: "Membres", value: roster.rosterCount },
            { label: "Players", value: roster.playerCount },
            { label: "Staff", value: roster.staffCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-2xl font-black text-white">{item.value}</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-14">
        {roster.lineup.length > 0 && (
          <RosterSection
            title="Lineup"
            sectionType="player"
            count={roster.lineup.length}
            accent={game.accent}
            players={roster.lineup}
            game={game}
          />
        )}
        {roster.staff.length > 0 && (
          <RosterSection
            title="Staff"
            sectionType="staff"
            count={roster.staff.length}
            accent={game.accentSoft}
            players={roster.staff}
            game={game}
          />
        )}
      </div>
    </section>
  );
}

function RosterSection({ title, sectionType, count, accent, players, game }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <h3 className="text-2xl font-black text-white">{title}</h3>
        <span
          className="rounded-full border px-3 py-1 text-xs font-black"
          style={{
            color: accent,
            borderColor: toRgba(accent, 0.3),
            background: toRgba(accent, 0.1),
          }}
        >
          {count}
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            game={game}
            accent={accent}
            index={index}
            sectionType={sectionType}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player, game, accent, index, sectionType }) {
  const tags = buildPlayerTags(player, game.name, sectionType);
  const displayRole =
    sectionType === "staff" ? player.staffRole || player.role : player.role;
  const displayStatus =
    sectionType === "staff"
      ? "Staff"
      : player.statusLabel || player.status;
  const topBadgeLabel =
    sectionType === "staff"
      ? displayRole
      : player.jerseyNumber
        ? `#${player.jerseyNumber}`
        : displayRole;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e0e] transition-all duration-400 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: accent }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top, ${toRgba(accent, 0.12)} 0%, transparent 60%)`,
        }}
      />

      <div
        className="relative h-64 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${toRgba(game.accent, 0.15)} 0%, ${toRgba(game.accentSoft, 0.08)} 50%, rgba(10,10,10,1) 100%)`,
        }}
      >
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
            {topBadgeLabel}
          </span>
        </div>

        <div className="absolute right-4 top-4 z-10">
          <span
            className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-sm"
            style={{
              color: accent,
              borderColor: toRgba(accent, 0.35),
              background: toRgba(accent, 0.15),
            }}
          >
            {displayStatus}
          </span>
        </div>

        {player.photo ? (
          <img
            src={player.photo}
            alt={player.pseudo}
            loading="lazy"
            className="absolute bottom-0 left-0 right-0 h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 m-4 flex items-center justify-center rounded-lg border-2 border-dashed border-white/20">
            <img
              src={playerPhotoFallback}
              alt="GeS"
              loading="lazy"
              className="h-32 w-32 object-contain opacity-60"
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black leading-none text-white">
              {player.pseudo}
            </h3>
            {player.realName && (
              <p className="mt-1 text-xs text-gray-500">{player.realName}</p>
            )}
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {displayRole}
            </p>
          </div>

          {player.nationality && (
            <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
              <FaGlobe size={9} /> {player.nationality}
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isCurrent = tag === game.name;
              return (
                <span
                  key={`${player.id}-${tag}`}
                  className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
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
        )}
      </div>
    </motion.article>
  );
}

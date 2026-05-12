import { adminTeam } from "./adminRoster";
import { GAME_DEFINITIONS, GES_LOGO } from "./gameDefinitions";
import { rosterSources } from "./rosters/index.js";

const playerPhotoFallback = GES_LOGO;

const unique = (values) => Array.from(new Set(values.filter(Boolean)));

const normalizeValue = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const gameBySlug = Object.fromEntries(
  GAME_DEFINITIONS.map((game) => [game.slug, game]),
);

const COUNTRY_METADATA = {
  MG: {
    id: "MG",
    name: "Madagascar",
    sub: "Océan Indien",
    color: "#E50914",
    coords: [46.8, -19.0],
  },
  FR: {
    id: "FR",
    name: "France",
    sub: "Europe",
    color: "#FF9999",
    coords: [2.3, 46.2],
  },
};

const NATIONALITY_CODE_LOOKUP = {
  MALAGASY: "MG",
  MALAGACHE: "MG",
  FRANCAIS: "FR",
  FRANÇAIS: "FR",
  FRENCH: "FR",
};

const toCountryCode = (nationality) =>
  NATIONALITY_CODE_LOOKUP[normalizeValue(nationality)] || "";

const sortMembers = (left, right) => {
  if (left.status !== right.status) {
    return left.status === "Player" ? -1 : 1;
  }

  return left.order - right.order;
};

const rosterEntries = rosterSources.flatMap((roster) =>
  roster.members.map((member) => {
    const gameSlugs = unique(member.gameSlugs?.length ? member.gameSlugs : roster.gameSlugs);
    const gameTags = gameSlugs
      .map((slug) => gameBySlug[slug]?.name)
      .filter(Boolean);
    const extraTags = unique([
      member.lineupStatus,
      member.note,
      member.secondaryRole,
    ]);
    const realName = [member.firstName, member.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      id: `${roster.id}-${member.order}`,
      order: member.order,
      rosterId: roster.id,
      rosterName: roster.name,
      rosterLabel: roster.label,
      pseudo: member.pseudo,
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      realName,
      photo: member.photo || "",
      hasPhoto: Boolean(member.photo),
      nationality: toCountryCode(member.nationality),
      nationalityLabel: member.nationality || "",
      role: member.role || "Player",
      secondaryRole: member.secondaryRole || "",
      status: member.status || "Player",
      lineupStatus: member.lineupStatus || "",
      note: member.note || "",
      jerseyNumber: member.jerseyNumber || "",
      jerseySize: member.jerseySize || "",
      tags: unique([...gameTags, ...extraTags]),
      gameSlugs,
      gameTags,
      extraTags,
    };
  }),
);

const buildIdentityKey = (member) =>
  [normalizeValue(member.pseudo), normalizeValue(member.realName || member.pseudo)].join("|");

const profilesById = new Map();

for (const member of rosterEntries) {
  const key = buildIdentityKey(member);
  const current = profilesById.get(key);

  if (!current) {
    profilesById.set(key, {
      id: key.toLowerCase().replace(/\s+/g, "-"),
      pseudo: member.pseudo,
      realName: member.realName,
      photo: member.photo,
      nationality: member.nationality,
      nationalityLabel: member.nationalityLabel,
      hasPhoto: member.hasPhoto,
      role: member.role,
      status: member.status,
      tags: [...member.tags],
      gameTags: [...member.gameTags],
      extraTags: [...member.extraTags],
      rosterNames: [member.rosterName],
      rosterIds: [member.rosterId],
    });
    continue;
  }

  current.photo = current.photo || member.photo;
  current.hasPhoto = current.hasPhoto || member.hasPhoto;
  current.nationality = current.nationality || member.nationality;
  current.nationalityLabel = current.nationalityLabel || member.nationalityLabel;
  if (current.status !== "Player" && member.status === "Player") {
    current.role = member.role;
  } else if (!current.role && member.role) {
    current.role = member.role;
  }
  current.status =
    current.status === "Player" || member.status === "Player" ? "Player" : "Staff";
  current.tags = unique([...current.tags, ...member.tags]);
  current.gameTags = unique([...current.gameTags, ...member.gameTags]);
  current.extraTags = unique([...current.extraTags, ...member.extraTags]);
  current.rosterNames = unique([...current.rosterNames, member.rosterName]);
  current.rosterIds = unique([...current.rosterIds, member.rosterId]);
}

const allProfiles = Array.from(profilesById.values()).sort((left, right) =>
  left.pseudo.localeCompare(right.pseudo),
);

const players = allProfiles.filter((profile) => profile.status === "Player");

const games = GAME_DEFINITIONS.map((game) => {
  const members = rosterEntries
    .filter((member) => member.gameSlugs.includes(game.slug))
    .sort(sortMembers);

  const rosters = rosterSources
    .map((roster) => {
      const rosterMembers = members
        .filter((member) => member.rosterId === roster.id)
        .sort(sortMembers);

      if (!rosterMembers.length) {
        return null;
      }

      const lineup = rosterMembers.filter((member) => member.status === "Player");
      const staff = rosterMembers.filter((member) => member.status === "Staff");

      return {
        id: roster.id,
        name: roster.name,
        label: roster.label,
        sheetName: roster.sheetName,
        players: rosterMembers,
        lineup,
        staff,
        rosterCount: rosterMembers.length,
        playerCount: lineup.length,
        staffCount: staff.length,
      };
    })
    .filter(Boolean);

  const lineup = members.filter((member) => member.status === "Player");
  const staff = members.filter((member) => member.status === "Staff");
  const featuredPool = lineup.filter((member) => member.photo);

  return {
    ...game,
    rosters,
    players: members,
    featuredPlayers: (featuredPool.length ? featuredPool : lineup).slice(0, 4),
    rosterCount: members.length,
    playerCount: lineup.length,
    staffCount: staff.length,
  };
});

const teams = games.map((game) => ({
  id: game.id,
  slug: game.slug,
  gameSlug: game.slug,
  name: game.teamName,
  game: game.name,
  logo: GES_LOGO,
  banner: "",
  description: game.description,
  players: game.players,
  rosters: game.rosters,
  accent: game.accent,
  accentSoft: game.accentSoft,
}));

const heroPlayers = players.map((player) => ({
  id: player.id,
  title: player.pseudo,
  tags: player.gameTags.slice(0, 3),
  image: player.photo || GES_LOGO,
}));

const playerCountryStats = Object.values(
  players.reduce((accumulator, player) => {
    if (!player.nationality || !COUNTRY_METADATA[player.nationality]) {
      return accumulator;
    }

    if (!accumulator[player.nationality]) {
      accumulator[player.nationality] = {
        ...COUNTRY_METADATA[player.nationality],
        count: 0,
      };
    }

    accumulator[player.nationality].count += 1;
    return accumulator;
  }, {}),
).sort((left, right) => right.count - left.count);

const getGameBySlug = (slug) => games.find((game) => game.slug === slug) || null;

const getTeamById = (id) =>
  teams.find((team) => String(team.id) === String(id)) || null;

export {
  adminTeam,
  games,
  getGameBySlug,
  getTeamById,
  heroPlayers,
  playerCountryStats,
  playerPhotoFallback,
  players,
  rosterSources,
  teams,
};

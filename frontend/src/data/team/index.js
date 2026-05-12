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
    sub: "Ocean Indien",
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
  FRENCH: "FR",
};

const toCountryCode = (nationality) =>
  NATIONALITY_CODE_LOOKUP[normalizeValue(nationality)] || "";

const getMemberTypes = (member) => {
  const memberTypes = [];

  if (member.status === "Player" || member.isAlsoPlayer) {
    memberTypes.push("Player");
  }

  if (member.status === "Staff") {
    memberTypes.push("Staff");
  }

  return memberTypes.length ? memberTypes : ["Player"];
};

const hasMemberType = (member, type) => member.memberTypes.includes(type);

const getPrimaryStatus = (memberTypes) =>
  memberTypes.includes("Player") ? "Player" : "Staff";

const getStatusLabel = (memberTypes) => memberTypes.join(" / ");

const sortMembers = (left, right) => {
  const leftPriority = hasMemberType(left, "Player") ? 0 : 1;
  const rightPriority = hasMemberType(right, "Player") ? 0 : 1;

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return left.order - right.order;
};

const rosterEntries = rosterSources.flatMap((roster) =>
  roster.members.map((member) => {
    const memberTypes = getMemberTypes(member);
    const gameSlugs = unique(
      member.gameSlugs?.length ? member.gameSlugs : roster.gameSlugs,
    );
    const gameTags = gameSlugs
      .map((slug) => gameBySlug[slug]?.name)
      .filter(Boolean);
    const extraTags = unique([
      member.lineupStatus,
      member.note,
      member.staffRole,
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
      staffRole: member.staffRole || "",
      secondaryRole: member.secondaryRole || "",
      memberTypes,
      status: getPrimaryStatus(memberTypes),
      statusLabel: getStatusLabel(memberTypes),
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
      staffRole: member.staffRole,
      status: member.status,
      statusLabel: member.statusLabel,
      memberTypes: [...member.memberTypes],
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
  current.nationalityLabel =
    current.nationalityLabel || member.nationalityLabel;
  current.staffRole = current.staffRole || member.staffRole;

  if (!hasMemberType(current, "Player") && hasMemberType(member, "Player")) {
    current.role = member.role;
  } else if (!current.role && member.role) {
    current.role = member.role;
  }

  current.memberTypes = unique([...current.memberTypes, ...member.memberTypes]);
  current.status = getPrimaryStatus(current.memberTypes);
  current.statusLabel = getStatusLabel(current.memberTypes);
  current.tags = unique([...current.tags, ...member.tags]);
  current.gameTags = unique([...current.gameTags, ...member.gameTags]);
  current.extraTags = unique([...current.extraTags, ...member.extraTags]);
  current.rosterNames = unique([...current.rosterNames, member.rosterName]);
  current.rosterIds = unique([...current.rosterIds, member.rosterId]);
}

const allProfiles = Array.from(profilesById.values()).sort((left, right) =>
  left.pseudo.localeCompare(right.pseudo),
);

const players = allProfiles.filter((profile) => hasMemberType(profile, "Player"));

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

      const lineup = rosterMembers.filter((member) =>
        hasMemberType(member, "Player") && !hasMemberType(member, "Staff"),
      );
      const staff = rosterMembers.filter((member) =>
        hasMemberType(member, "Staff"),
      );

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

  const lineup = members.filter((member) => hasMemberType(member, "Player"));
  const staff = members.filter((member) => hasMemberType(member, "Staff"));
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

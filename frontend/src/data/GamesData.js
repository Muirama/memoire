const GES_LOGO = "/LOGO/Logo_GES_blanc.svg";

const GAME_DEFINITIONS = [
  {
    id: 1,
    name: "MOBILE LEGENDS: BANG BANG",
    slug: "mobile-legends",
    teamName: "GeS Mobile Legends",
    shortLabel: "MLBB",
    logo: "/games/MOBILE LEGENDS BANG BANG.png",
    accent: "#2563EB",
    accentSoft: "#EF4444",
    description:
      "Le collectif GeS sur Mobile Legends, entre roster, staff et pilotage esport.",
  },
  {
    id: 2,
    name: "EA FC",
    slug: "ea-fc",
    teamName: "GeS EA FC",
    shortLabel: "Football Sim",
    logo: "/games/EA FC.png",
    accent: "#22C55E",
    accentSoft: "#16A34A",
    description:
      "La division football de GeS, construite pour les duels et la regularite.",
  },
  {
    id: 3,
    name: "NBA 2K",
    slug: "nba-2k",
    teamName: "GeS NBA 2K",
    shortLabel: "Basket Sim",
    logo: "/games/NBA 2K.png",
    accent: "#F97316",
    accentSoft: "#DC2626",
    description:
      "Le pole NBA 2K de GeS, axe sur le grind, la precision et la scene competition.",
  },
  {
    id: 4,
    name: "EFOOTBALL",
    slug: "efootball",
    teamName: "GeS eFootball",
    shortLabel: "Console",
    logo: "/games/Efootball.png",
    accent: "#FACC15",
    accentSoft: "#F97316",
    description:
      "La branche eFootball console de GeS, avec un duo pense pour la perf.",
  },
  {
    id: 5,
    name: "EFOOTBALL MOBILE",
    slug: "efootball-mobile",
    teamName: "GeS eFootball Mobile",
    shortLabel: "Mobile",
    logo: "/games/Efootball.png",
    accent: "#14B8A6",
    accentSoft: "#0F766E",
    description:
      "La version mobile d eFootball chez GeS, compacte mais deja bien identifiee.",
  },
  {
    id: 6,
    name: "TEKKEN",
    slug: "tekken",
    teamName: "GeS Tekken",
    shortLabel: "FGC",
    logo: "/games/Tekken.png",
    accent: "#E50914",
    accentSoft: "#FB7185",
    description:
      "Le roster Tekken de GeS, au coeur de la scene versus et du multi-jeux.",
  },
  {
    id: 7,
    name: "STREET FIGHTER VI",
    slug: "street-fighter-vi",
    teamName: "GeS Street Fighter VI",
    shortLabel: "FGC",
    logo: "/games/Street Fighter VI.png",
    accent: "#A855F7",
    accentSoft: "#F97316",
    description:
      "La presence GeS sur Street Fighter VI, portee par un profil deja actif sur plusieurs titres.",
  },
  {
    id: 8,
    name: "PUBG MOBILE",
    slug: "pubg-mobile",
    teamName: "GeS PUBG Mobile",
    shortLabel: "Battle Royale",
    logo: "/games/PubgM.png",
    accent: "#F59E0B",
    accentSoft: "#EAB308",
    description:
      "La division PUBG Mobile de GeS, la plus dense du hub avec joueurs et encadrement.",
  },
  {
    id: 9,
    name: "2XKO",
    slug: "2xko",
    teamName: "GeS 2XKO",
    shortLabel: "Tag Fighter",
    logo: "",
    logoText: "2XKO",
    accent: "#F97316",
    accentSoft: "#E50914",
    description:
      "Le projet 2XKO de GeS, deja connecte au profil multi-jeux de la section FGC.",
  },
];

const PLAYER_POOL = [
  {
    pseudo: "KIMI",
    photo: "/players/Kimi.png",
    nationality: "MG",
    tags: ["TEKKEN"],
  },
  {
    pseudo: "VIDELOUU",
    photo: "/players/Videlouu.png",
    nationality: "MG",
    tags: ["PUBG MOBILE", "MANAGER"],
  },
  {
    pseudo: "BOUTA",
    photo: "/players/Bouta.png",
    nationality: "MG",
    tags: ["MOBILE LEGENDS: BANG BANG", "TEAM MANAGER"],
  },
  {
    pseudo: "FAMENOG",
    photo: "/players/FamenoG.png",
    nationality: "MG",
    tags: ["NBA 2K"],
  },
  {
    pseudo: "GENESS",
    photo: "/players/Geness.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "JOG",
    photo: "/players/Jog.png",
    nationality: "MG",
    tags: ["MOBILE LEGENDS: BANG BANG"],
  },
  {
    pseudo: "JOHANN52",
    photo: "/players/Johann52.png",
    nationality: "MG",
    tags: ["EFOOTBALL"],
  },
  {
    pseudo: "BERU99",
    photo: "/players/Beru99.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "KNIGHT",
    photo: "/players/Knight.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "LOGGAN33",
    photo: "/players/loggan33.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "MAESTRR",
    photo: "/players/Maestrr.png",
    nationality: "MG",
    tags: ["MOBILE LEGENDS: BANG BANG", "D.A"],
  },
  {
    pseudo: "MANOU",
    photo: "/players/Manou.png",
    nationality: "MG",
    tags: ["EA FC"],
  },
  {
    pseudo: "N4SH",
    photo: "/players/N4sh.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "NGANJIN",
    photo: "/players/Nganjin.png",
    nationality: "MG",
    tags: ["MOBILE LEGENDS: BANG BANG", "CEO"],
  },
  {
    pseudo: "RANTO ANGELO",
    photo: "/players/Ranto Angelo.png",
    nationality: "MG",
    tags: ["EFOOTBALL"],
  },
  {
    pseudo: "SATCHIO",
    photo: "/players/Satchio.png",
    nationality: "MG",
    tags: ["MOBILE LEGENDS: BANG BANG", "ADMIN"],
  },
  {
    pseudo: "SEIJURO",
    photo: "/players/Seijuro.png",
    nationality: "MG",
    tags: ["EFOOTBALL MOBILE"],
  },
  {
    pseudo: "STEELISH360",
    photo: "/players/Steelish.png",
    nationality: "MG",
    tags: ["TEKKEN", "STREET FIGHTER VI", "2XKO"],
  },
  {
    pseudo: "VENDRAXX",
    photo: "/players/Vendraxx.png",
    nationality: "MG",
    tags: ["PUBG MOBILE"],
  },
  {
    pseudo: "BONYKODAHY",
    photo: "/players/BonyKodahy.png",
    nationality: "MG",
    tags: ["EFOOTBALL MOBILE"],
  },
  {
    pseudo: "YONDAIME",
    photo: "/players/Yondaime.png",
    nationality: "MG",
    tags: ["TEKKEN"],
  },
];

const STAFF_LABELS = {
  ADMIN: "Admin",
  CEO: "CEO",
  "C.E.O": "CEO",
  "D.A": "D.A",
  MANAGER: "Manager",
  "TEAM MANAGER": "Team Manager",
};

const normalizeTag = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const GAME_ALIASES = {
  [normalizeTag("MOBILE LEGENDS : BANG BANG")]: "MOBILE LEGENDS: BANG BANG",
  [normalizeTag("TEKKEN 8")]: "TEKKEN",
};

const GAME_LOOKUP = GAME_DEFINITIONS.reduce((lookup, game) => {
  lookup[normalizeTag(game.name)] = game.name;
  lookup[normalizeTag(game.slug)] = game.name;
  return lookup;
}, {});

const unique = (values) => Array.from(new Set(values));

const getGameNameFromTag = (tag) => {
  const normalized = normalizeTag(tag);
  return GAME_ALIASES[normalized] || GAME_LOOKUP[normalized] || "";
};

const players = PLAYER_POOL.map((player, index) => {
  const gameTags = unique(
    player.tags.map((tag) => getGameNameFromTag(tag)).filter(Boolean),
  );
  const extraTags = unique(
    player.tags
      .map((tag) => tag.trim().toUpperCase())
      .filter((tag) => !getGameNameFromTag(tag)),
  );
  const roleTag = extraTags.find((tag) => STAFF_LABELS[tag]) || "";
  const isStaff = Boolean(roleTag);

  return {
    id: index + 1,
    pseudo: player.pseudo,
    realName: player.realName || "",
    photo: player.photo || "",
    nationality: player.nationality || "",
    hasPhoto: Boolean(player.photo),
    tags: unique([...gameTags, ...extraTags]),
    gameTags,
    extraTags,
    role: STAFF_LABELS[roleTag] || "Player",
    status: isStaff ? "Staff" : "Player",
  };
});

const sortPlayers = (left, right) => {
  if (left.status !== right.status) {
    return left.status === "Player" ? -1 : 1;
  }

  return left.pseudo.localeCompare(right.pseudo);
};

export const games = GAME_DEFINITIONS.map((game) => {
  const roster = players
    .filter((player) => player.gameTags.includes(game.name))
    .sort(sortPlayers)
    .map((player, playerIndex) => ({
      ...player,
      number: player.status === "Player" ? playerIndex + 1 : undefined,
    }));

  const playersOnly = roster.filter((player) => player.status === "Player");
  const staffOnly = roster.filter((player) => player.status === "Staff");

  return {
    ...game,
    players: roster,
    featuredPlayers: roster.slice(0, 4),
    rosterCount: roster.length,
    playerCount: playersOnly.length,
    staffCount: staffOnly.length,
  };
});

export const teams = games.map((game) => ({
  id: game.id,
  slug: game.slug,
  gameSlug: game.slug,
  name: game.teamName,
  game: game.name,
  logo: GES_LOGO,
  banner: "",
  description: game.description,
  players: game.players,
  accent: game.accent,
  accentSoft: game.accentSoft,
}));

export const getGameBySlug = (slug) =>
  games.find((game) => game.slug === slug) || null;

export const getTeamById = (id) =>
  teams.find((team) => String(team.id) === String(id)) || null;

export const playerPhotoFallback = GES_LOGO;
export const heroPlayers = players.map((player) => ({
  id: player.id,
  title: player.pseudo,
  tags: player.tags,
  image: player.photo || GES_LOGO,
}));

export { players };

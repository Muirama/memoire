const { Team, Player } = require("../models");

// ── GET toutes les équipes actives (public) ───────────────
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { active: true },
      include: [
        {
          model: Player,
          as: "players",
          order: [
            ["order", "ASC"],
            ["status", "ASC"],
          ],
        },
      ],
      order: [["name", "ASC"]],
    });
    return res.status(200).json({ teams });
  } catch (error) {
    console.error("Erreur getAllTeams :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET toutes les équipes (admin) ────────────────────────
const getAllTeamsAdmin = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [{ model: Player, as: "players" }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ teams });
  } catch (error) {
    console.error("Erreur getAllTeamsAdmin :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET une équipe par ID avec roster (public) ────────────
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: { id: req.params.id, active: true },
      include: [
        {
          model: Player,
          as: "players",
          order: [["order", "ASC"]],
        },
      ],
    });
    if (!team) return res.status(404).json({ message: "Équipe introuvable." });
    return res.status(200).json({ team });
  } catch (error) {
    console.error("Erreur getTeamById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer une équipe (admin) ─────────────────────────
const createTeam = async (req, res) => {
  try {
    const {
      name,
      game,
      logo,
      banner,
      description,
      palmares,
      twitter,
      facebook,
      discord,
      active,
    } = req.body;

    if (!name || !game)
      return res.status(400).json({ message: "Nom et jeu sont requis." });

    const team = await Team.create({
      name: name.trim(),
      game: game.trim(),
      logo: logo || null,
      banner: banner || null,
      description: description || null,
      palmares: palmares || null,
      twitter: twitter || null,
      facebook: facebook || null,
      discord: discord || null,
      active: active !== undefined ? active : true,
    });

    return res.status(201).json({ message: "Équipe créée.", team });
  } catch (error) {
    console.error("Erreur createTeam :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier une équipe (admin) ──────────────────────
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Équipe introuvable." });

    await team.update(req.body);
    return res.status(200).json({ message: "Équipe mise à jour.", team });
  } catch (error) {
    console.error("Erreur updateTeam :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer une équipe (admin) ───────────────────
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Équipe introuvable." });

    await team.destroy(); // cascade → supprime aussi les joueurs
    return res.status(200).json({ message: "Équipe supprimée." });
  } catch (error) {
    console.error("Erreur deleteTeam :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ════ CRUD JOUEURS ════════════════════════════════════════

// ── POST ajouter un joueur à une équipe (admin) ───────────
const addPlayer = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Équipe introuvable." });

    const {
      pseudo,
      realName,
      role,
      photo,
      number,
      nationality,
      status,
      order,
    } = req.body;

    if (!pseudo)
      return res.status(400).json({ message: "Le pseudo est requis." });

    const player = await Player.create({
      teamId: req.params.teamId,
      pseudo: pseudo.trim(),
      realName: realName || null,
      role: role || null,
      photo: photo || null,
      number: number || null,
      nationality: nationality || "Malgache",
      status: status || "Titulaire",
      order: order || 0,
    });

    return res.status(201).json({ message: "Joueur ajouté.", player });
  } catch (error) {
    console.error("Erreur addPlayer :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier un joueur (admin) ────────────────────────
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.playerId);
    if (!player)
      return res.status(404).json({ message: "Joueur introuvable." });

    await player.update(req.body);
    return res.status(200).json({ message: "Joueur mis à jour.", player });
  } catch (error) {
    console.error("Erreur updatePlayer :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer un joueur (admin) ────────────────────
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.playerId);
    if (!player)
      return res.status(404).json({ message: "Joueur introuvable." });

    await player.destroy();
    return res.status(200).json({ message: "Joueur supprimé." });
  } catch (error) {
    console.error("Erreur deletePlayer :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllTeams,
  getAllTeamsAdmin,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
};

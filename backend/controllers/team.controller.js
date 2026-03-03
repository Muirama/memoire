const { Team } = require("../models");
const { Op } = require("sequelize");

// ── GET toutes les équipes ────────────────────────────────
const getAllTeams = async (req, res) => {
  try {
    const { search, game, sortBy } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (game && game !== "Tous") {
      where.game = game;
    }

    let order = [["id", "ASC"]];
    switch (sortBy) {
      case "name-asc":
        order = [["name", "ASC"]];
        break;
      case "name-desc":
        order = [["name", "DESC"]];
        break;
      case "wins-desc":
        order = [["wins", "DESC"]];
        break;
      case "wins-asc":
        order = [["wins", "ASC"]];
        break;
      case "founded-desc":
        order = [["founded", "DESC"]];
        break;
      case "founded-asc":
        order = [["founded", "ASC"]];
        break;
      default:
        break;
    }

    const teams = await Team.findAll({ where, order });
    return res.status(200).json({ teams });
  } catch (error) {
    console.error("Erreur getAllTeams :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET une équipe par ID ─────────────────────────────────
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }
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
      image,
      members,
      achievements,
      rank,
      founded,
      wins,
      losses,
    } = req.body;

    if (!name || !game) {
      return res.status(400).json({ message: "Nom et jeu sont requis." });
    }

    const team = await Team.create({
      name,
      game,
      image,
      members: members || [],
      achievements: achievements || [],
      rank: rank || null,
      founded: founded || null,
      wins: wins || 0,
      losses: losses || 0,
    });

    return res.status(201).json({ message: "Équipe créée avec succès.", team });
  } catch (error) {
    console.error("Erreur createTeam :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier une équipe (admin) ───────────────────────
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }
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
    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }
    await team.destroy();
    return res.status(200).json({ message: "Équipe supprimée avec succès." });
  } catch (error) {
    console.error("Erreur deleteTeam :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH mettre à jour le score (admin) ──────────────────
const updateScore = async (req, res) => {
  try {
    const { wins, losses } = req.body;
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Équipe introuvable." });
    }

    await team.update({
      wins: wins !== undefined ? wins : team.wins,
      losses: losses !== undefined ? losses : team.losses,
    });

    return res.status(200).json({ message: "Score mis à jour.", team });
  } catch (error) {
    console.error("Erreur updateScore :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  updateScore,
};

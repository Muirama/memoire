const express = require("express");
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  updateScore,
} = require("../controllers/team.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// GET    /api/teams             → toutes les équipes (public)
router.get("/", getAllTeams);

// GET    /api/teams/:id         → une équipe (public)
router.get("/:id", getTeamById);

// POST   /api/teams             → créer une équipe (admin)
router.post("/", authMiddleware, adminMiddleware, createTeam);

// PUT    /api/teams/:id         → modifier une équipe (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateTeam);

// DELETE /api/teams/:id         → supprimer une équipe (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteTeam);

// PATCH  /api/teams/:id/score   → mettre à jour wins/losses (admin)
router.patch("/:id/score", authMiddleware, adminMiddleware, updateScore);

module.exports = router;

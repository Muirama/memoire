const express = require("express");
const router = express.Router();
const {
  getAllTeams,
  getAllTeamsAdmin,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/team.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// ── Public ────────────────────────────────────────────────
router.get("/", getAllTeams);
router.get("/:id", getTeamById);

// ── Admin — équipes ───────────────────────────────────────
router.get("/admin/all", authMiddleware, adminMiddleware, getAllTeamsAdmin);
router.post("/", authMiddleware, adminMiddleware, createTeam);
router.put("/:id", authMiddleware, adminMiddleware, updateTeam);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTeam);

// ── Admin — joueurs ───────────────────────────────────────
router.post("/:teamId/players", authMiddleware, adminMiddleware, addPlayer);
router.put(
  "/:teamId/players/:playerId",
  authMiddleware,
  adminMiddleware,
  updatePlayer,
);
router.delete(
  "/:teamId/players/:playerId",
  authMiddleware,
  adminMiddleware,
  deletePlayer,
);

module.exports = router;

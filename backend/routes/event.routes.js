const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  toggleRegistration,
  deleteEvent,
} = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// GET    /api/events              → tous les événements (public)
router.get("/", getAllEvents);

// GET    /api/events/:id          → un événement (public)
router.get("/:id", getEventById);

// POST   /api/events              → créer un événement (admin)
router.post("/", authMiddleware, adminMiddleware, createEvent);

// PUT    /api/events/:id          → modifier un événement (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);

// PATCH  /api/events/:id/toggle   → ouvrir/fermer inscriptions (admin)
router.patch(
  "/:id/toggle",
  authMiddleware,
  adminMiddleware,
  toggleRegistration,
);

// DELETE /api/events/:id          → supprimer un événement (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;

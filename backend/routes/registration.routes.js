const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getEventRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  checkRegistration,
} = require("../controllers/registration.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const userMiddleware = require("../middleware/user.middleware");

// GET  /api/registrations                    → toutes les inscriptions (admin)
router.get("/", authMiddleware, adminMiddleware, getAllRegistrations);

// GET  /api/registrations/event/:eventId     → inscriptions d'un événement (admin)
router.get(
  "/event/:eventId",
  authMiddleware,
  adminMiddleware,
  getEventRegistrations,
);

// POST /api/registrations/:eventId           → s'inscrire (public)
router.post("/:eventId", authMiddleware, userMiddleware, createRegistration);

// PATCH /api/registrations/:id/status        → modifier statut (admin)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateRegistrationStatus,
);

// DELETE /api/registrations/:id              → supprimer (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteRegistration);

// GET  /api/registrations/check/:eventId     → vérifier inscription (public)
router.get(
  "/check/:eventId",
  authMiddleware,
  userMiddleware,
  checkRegistration,
);

module.exports = router;

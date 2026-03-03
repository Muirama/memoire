const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getEventRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} = require("../controllers/registration.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// ⚠️ ORDRE IMPORTANT : les routes spécifiques avant les routes génériques (:id)

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
router.post("/:eventId", createRegistration);

// PATCH /api/registrations/:id/status        → modifier statut (admin)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateRegistrationStatus,
);

// DELETE /api/registrations/:id              → supprimer (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteRegistration);

module.exports = router;

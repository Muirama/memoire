const express = require("express");
const router = express.Router();
const { createAdmin, login, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// POST /api/auth/create-admin → créer un admin
// ⚠️ Protégé par adminMiddleware après le 1er admin créé
// Pour le tout premier admin, commenter les middlewares ci-dessous
router.post("/create-admin", authMiddleware, adminMiddleware, createAdmin);

// POST /api/auth/login → connexion admin
router.post("/login", login);

// GET  /api/auth/me   → profil admin connecté
router.get("/me", authMiddleware, getMe);

module.exports = router;

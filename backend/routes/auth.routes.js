const express = require("express");
const router  = express.Router();
const { login, register, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ── Public ────────────────────────────────────────────────
router.post("/login",    login);     // admin ET user — même route
router.post("/register", register);  // inscription publique (role: "user")

// ── Protégé ───────────────────────────────────────────────
router.get("/me", authMiddleware, getMe);

module.exports = router;
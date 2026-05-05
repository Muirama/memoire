const express = require("express");
const router  = express.Router();
const { login, register, getMe, updateMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const userMiddleware = require("../middleware/user.middleware");

// ── Public ────────────────────────────────────────────────
router.post("/login",    login);     // admin ET user — même route
router.post("/register", register);  // inscription publique (role: "user")

// ── Protégé ───────────────────────────────────────────────
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, userMiddleware, updateMe);

module.exports = router;

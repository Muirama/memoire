const express = require("express");
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  likeNews,
} = require("../controllers/news.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// GET    /api/news          → toutes les news (public)
router.get("/", getAllNews);

// GET    /api/news/:id      → une news (public)
router.get("/:id", getNewsById);

// POST   /api/news          → créer une news (admin)
router.post("/", authMiddleware, adminMiddleware, createNews);

// PUT    /api/news/:id      → modifier une news (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateNews);

// DELETE /api/news/:id      → supprimer une news (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

// PATCH  /api/news/:id/like → liker une news (user connecté)
router.patch("/:id/like", authMiddleware, likeNews);

module.exports = router;

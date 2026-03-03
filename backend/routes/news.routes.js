const express = require("express");
const router = express.Router();
const {
  getAllNews,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  togglePublished,
  deleteNews,
} = require("../controllers/news.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// ── Public ────────────────────────────────────────────────
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// ── Admin ─────────────────────────────────────────────────
router.get("/admin/all", authMiddleware, adminMiddleware, getAllNewsAdmin);
router.post("/", authMiddleware, adminMiddleware, createNews);
router.put("/:id", authMiddleware, adminMiddleware, updateNews);
router.patch("/:id/toggle", authMiddleware, adminMiddleware, togglePublished);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

module.exports = router;

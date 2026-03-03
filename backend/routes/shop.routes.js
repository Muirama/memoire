const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/shop.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// GET  /api/shop          → tous les produits (public)
router.get("/", getAllProducts);

// GET  /api/shop/:id      → un produit (public)
router.get("/:id", getProductById);

// POST /api/shop          → créer un produit (admin)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// PUT  /api/shop/:id      → modifier un produit (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// DELETE /api/shop/:id   → supprimer un produit (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;

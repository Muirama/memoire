const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// POST   /api/orders           → passer une commande (public, sans compte)
router.post("/", createOrder);

// GET    /api/orders           → toutes les commandes (admin)
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// GET    /api/orders/:id       → une commande (admin)
router.get("/:id", authMiddleware, adminMiddleware, getOrderById);

// PATCH  /api/orders/:id/status → changer le statut (admin)
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// DELETE /api/orders/:id       → supprimer une commande (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const userMiddleware = require("../middleware/user.middleware");

// POST /api/orders -> passer une commande (user connecte)
router.post("/", authMiddleware, userMiddleware, createOrder);

// GET /api/orders/me -> mes commandes (user)
router.get("/me", authMiddleware, userMiddleware, getMyOrders);

// GET /api/orders -> toutes les commandes (admin)
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// GET /api/orders/:id -> une commande (admin)
router.get("/:id", authMiddleware, adminMiddleware, getOrderById);

// PATCH /api/orders/:id/status -> changer le statut (admin)
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// DELETE /api/orders/:id -> supprimer une commande (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;

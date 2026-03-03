const { Order, Product } = require("../models");

// ── POST passer une commande (public) ─────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      itemsSummary,
      items,
      notes,
      totalAmount,
    } = req.body;

    // ── Validation ───────────────────────────────────────
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        message: "Nom, email et téléphone sont requis.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "La commande doit contenir au moins un produit.",
      });
    }

    if (!itemsSummary) {
      return res.status(400).json({
        message: "Le résumé des articles est requis.",
      });
    }

    // ── Vérifier que les produits existent ───────────────
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          message: `Produit ID ${item.productId} introuvable.`,
        });
      }
    }

    // ── Créer la commande ─────────────────────────────────
    // createdAt est géré automatiquement par Sequelize (NOW)
    const order = await Order.create({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress || null,
      itemsSummary,
      totalAmount,
      status: "En attente",
      notes: notes || null,
    });

    return res.status(201).json({
      message: "Commande passée avec succès.",
      order: {
        id: order.id,
        customerName: order.customerName,
        itemsSummary: order.itemsSummary,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur createOrder :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET toutes les commandes (admin) ──────────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Erreur getAllOrders :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET une commande par ID (admin) ───────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.error("Erreur getOrderById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH mettre à jour le statut (admin) ─────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "En attente",
      "Confirmée",
      "En cours de livraison",
      "Livrée",
      "Annulée",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Statut invalide. Valeurs acceptées : ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    await order.update({ status });

    return res.status(200).json({
      message: "Statut mis à jour.",
      order: { id: order.id, status: order.status },
    });
  } catch (error) {
    console.error("Erreur updateOrderStatus :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer une commande (admin) ─────────────────
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    await order.destroy();
    return res.status(200).json({ message: "Commande supprimée avec succès." });
  } catch (error) {
    console.error("Erreur deleteOrder :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

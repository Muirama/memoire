const { Order, Product, sequelize } = require("../models");

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-MG").format(price) + " Ar";

// POST passer une commande (public)
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      notes,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        message: "Nom, email et telephone sont requis.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "La commande doit contenir au moins un produit.",
      });
    }

    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }));

    for (const item of normalizedItems) {
      if (!Number.isInteger(item.productId) || item.productId <= 0) {
        return res.status(400).json({
          message: "Chaque article doit contenir un productId valide.",
        });
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          message: "Chaque article doit contenir une quantite valide.",
        });
      }
    }

    const order = await sequelize.transaction(async (transaction) => {
      let computedTotalAmount = 0;
      const computedItemsSummary = [];

      for (const item of normalizedItems) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          const error = new Error(`Produit ID ${item.productId} introuvable.`);
          error.statusCode = 404;
          throw error;
        }

        const lineTotal = product.price * item.quantity;
        computedTotalAmount += lineTotal;
        computedItemsSummary.push(
          `${item.quantity}x ${product.name} (${formatPrice(lineTotal)})`,
        );
      }

      return Order.create(
        {
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress?.trim() || null,
          itemsSummary: computedItemsSummary.join(" | "),
          totalAmount: computedTotalAmount,
          status: "En attente",
          notes: notes?.trim() || null,
        },
        { transaction },
      );
    });

    return res.status(201).json({
      message: "Commande passee avec succes.",
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
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Erreur serveur.",
    });
  }
};

// GET toutes les commandes (admin)
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

// GET une commande par ID (admin)
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

// PATCH mettre a jour le statut (admin)
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
        message: `Statut invalide. Valeurs acceptees : ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    await order.update({ status });

    return res.status(200).json({
      message: "Statut mis a jour.",
      order: { id: order.id, status: order.status },
    });
  } catch (error) {
    console.error("Erreur updateOrderStatus :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE supprimer une commande (admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    await order.destroy();
    return res.status(200).json({ message: "Commande supprimee avec succes." });
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

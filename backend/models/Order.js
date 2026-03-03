const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ── Infos client ─────────────────────────────────────
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customerAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // ── Produits en texte lisible ─────────────────────────
    // Ex: "2x League of Legends RP (100 000 Ar) | 1x CS2 Skins Pack (75 000 Ar)"
    itemsSummary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // ── Montant total ─────────────────────────────────────
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // ── Statut ────────────────────────────────────────────
    status: {
      type: DataTypes.ENUM(
        "En attente",
        "Confirmée",
        "En cours de livraison",
        "Livrée",
        "Annulée",
      ),
      defaultValue: "En attente",
    },

    // ── Notes client ──────────────────────────────────────
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true, // createdAt = date/heure de la commande (NOW automatique)
  },
);

module.exports = Order;

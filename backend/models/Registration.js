const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Registration = sequelize.define(
  "Registration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ── Référence à l'événement ───────────────────────────
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "events", key: "id" },
      onDelete: "CASCADE", // Si l'événement est supprimé, les inscriptions aussi
    },

    // ── Infos participant ─────────────────────────────────
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    pseudo: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },

    // ── Statut inscription ────────────────────────────────
    status: {
      type: DataTypes.ENUM("En attente", "Confirmée", "Annulée"),
      defaultValue: "En attente",
    },
  },
  {
    tableName: "registrations",
    timestamps: true, // createdAt = date d'inscription automatique
  },
);

module.exports = Registration;

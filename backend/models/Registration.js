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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
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

    // ── Coéquipiers (squad uniquement) ───────────────────
    // Format : [{ pseudo, name, phone }, ...]
    // null pour les inscriptions solo
    teammates: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Squad : liste des coéquipiers [{pseudo, name, phone}]. null si solo.",
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

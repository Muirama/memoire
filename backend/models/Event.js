const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // Jeu / Catégorie
    game: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "Tournoi",
        "Championnat",
        "Qualificatif",
        "Exhibition",
      ),
      defaultValue: "Tournoi",
    },

    // Date & Lieu
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    // Participants — compteur simple, pas de limite
    registered: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Prize pool
    prizePool: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Statut géré uniquement par l'admin
    registrationOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // true = inscriptions ouvertes, false = fermées
    },
  },
  {
    tableName: "events",
    timestamps: true,
  },
);

module.exports = Event;

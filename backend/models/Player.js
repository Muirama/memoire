const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Player = sequelize.define(
  "Player",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "teams", key: "id" },
    },
    pseudo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    realName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Ex: Top, Jungle, Mid, ADC, Support, IGL, Fragger...",
    },
    photo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Numéro de maillot",
    },
    nationality: {
      type: DataTypes.STRING(100),
      defaultValue: "Malgache",
    },
    status: {
      type: DataTypes.ENUM("Titulaire", "Remplaçant", "Coach", "Manager"),
      defaultValue: "Titulaire",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Ordre d'affichage dans le roster",
    },
  },
  {
    tableName: "players",
    timestamps: true,
  },
);

module.exports = Player;

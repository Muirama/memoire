const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    game: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    gameLogo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Logo du jeu associé à l'équipe",
    },
    banner: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Image bannière pour la page détail",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    palmares: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Palmarès / titres (texte libre ou JSON stringifié)",
    },
    twitter: { type: DataTypes.STRING(200), allowNull: true },
    facebook: { type: DataTypes.STRING(200), allowNull: true },
    discord: { type: DataTypes.STRING(200), allowNull: true },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "true = visible sur le site public",
    },
  },
  {
    tableName: "teams",
    timestamps: true,
  },
);

module.exports = Team;

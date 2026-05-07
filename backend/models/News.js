const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const News = sequelize.define(
  "News",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(400),
      allowNull: true,
      comment: "Résumé court affiché dans la liste",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "Actualité",
        "Tournoi",
        "Communauté",
        "Produit",
        "Annonce",
      ),
      defaultValue: "Actualité",
    },
    author: {
      type: DataTypes.STRING(100),
      defaultValue: "Équipe Gascom",
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "true = visible sur le site public",
    },
  },
  {
    tableName: "news",
    timestamps: true,
  },
);

module.exports = News;

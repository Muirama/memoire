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
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      defaultValue: "Gascom News",
    },
    tags: {
      type: DataTypes.JSON, // stocké comme tableau JSON ["LoL", "Update"]
      defaultValue: [],
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "news",
    timestamps: true,
  },
);

module.exports = News;

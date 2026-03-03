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
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    members: {
      type: DataTypes.JSON, // ["Player1", "Player2", ...]
      defaultValue: [],
    },
    achievements: {
      type: DataTypes.JSON, // ["Champion 2023", ...]
      defaultValue: [],
    },
    rank: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    founded: {
      type: DataTypes.STRING(4), // "2022"
      allowNull: true,
    },
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "teams",
    timestamps: true,
  },
);

module.exports = Team;

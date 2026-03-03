const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Mettre à console.log pour voir les requêtes SQL en dev
    pool: {
      max: 5, // Nombre max de connexions simultanées
      min: 0,
      acquire: 30000, // Temps max (ms) pour obtenir une connexion
      idle: 10000, // Temps avant qu'une connexion inactive soit libérée
    },
  },
);

module.exports = sequelize;

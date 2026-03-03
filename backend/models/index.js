const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const News = require("./News");
const Team = require("./Team");
const Event = require("./Event");
const Order = require("./Order");
const Registration = require("./Registration");

// ── Association Event → Registration ─────────────────────
Event.hasMany(Registration, { foreignKey: "eventId", onDelete: "CASCADE" });
Registration.belongsTo(Event, { foreignKey: "eventId" });

module.exports = {
  sequelize,
  User,
  Product,
  News,
  Team,
  Event,
  Order,
  Registration,
};

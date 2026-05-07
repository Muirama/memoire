const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const News = require("./News");
const Event = require("./Event");
const Order = require("./Order");
const Registration = require("./Registration");

// ── Association Event → Registration ─────────────────────
Event.hasMany(Registration, { foreignKey: "eventId", onDelete: "CASCADE" });
Registration.belongsTo(Event, { foreignKey: "eventId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Registration, { foreignKey: "userId", onDelete: "CASCADE" });
Registration.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Product,
  News,
  Event,
  Order,
  Registration,
};

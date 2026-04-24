const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const News = require("./News");
const Team = require("./Team");
const Player = require("./Player");
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

Team.hasMany(Player, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
  as: "players",
});
Player.belongsTo(Team, { foreignKey: "teamId", as: "team" });

module.exports = {
  sequelize,
  User,
  Product,
  News,
  Team,
  Player,
  Event,
  Order,
  Registration,
};

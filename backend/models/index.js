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

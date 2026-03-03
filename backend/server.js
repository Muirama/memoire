const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globaux ───────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/shop", require("./routes/shop.routes"));
app.use("/api/news", require("./routes/news.routes"));
app.use("/api/teams", require("./routes/team.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/registrations", require("./routes/registration.routes"));

// ── Route de test ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🎮 Gascom API is running !" });
});

// ── Démarrage ─────────────────────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion MySQL établie.");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("✅ Tables synchronisées.");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion :", err);
  });

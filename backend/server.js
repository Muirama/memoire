require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// ── Models (pour sync auto) ───────────────────────────────
require("./models");

// ── Routes ────────────────────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const shopRoutes = require("./routes/shop.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const teamRoutes = require("./routes/team.routes");
const newsRoutes = require("./routes/news.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Montage des routes ────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// ── Sync DB + démarrage ───────────────────────────────────
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée.");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion DB :", err);
  });

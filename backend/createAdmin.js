/**
 * Script pour créer le premier admin en base de données.
 * Usage : node createAdmin.js
 * À supprimer après utilisation !
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User } = require("./models");
const { sequelize } = require("./models");

// ── Modifier ces valeurs avant de lancer le script ───────
const ADMIN_NAME = "Administrateur";
const ADMIN_EMAIL = "admin@gascom.mg";
const ADMIN_PASSWORD = "Admin@1234"; // ← Change ce mot de passe
// ─────────────────────────────────────────────────────────

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion DB établie.");

    // Vérifier si l'admin existe déjà
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log("⚠️  Un admin avec cet email existe déjà !");
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Créer l'admin
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("🎉 Admin créé avec succès !");
    console.log("──────────────────────────────");
    console.log(`   Nom   : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Mdp   : ${ADMIN_PASSWORD}`);
    console.log("──────────────────────────────");
    console.log("⚠️  Supprime ce fichier après utilisation !");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    process.exit(1);
  }
}

createAdmin();

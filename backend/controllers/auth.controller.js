const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ── Créer un admin ────────────────────────────────────────
// Cette route ne sera utilisée qu'une fois pour créer le premier admin
// Ensuite elle peut être désactivée ou protégée
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          message: "Le mot de passe doit contenir au moins 8 caractères.",
        });
    }

    // Vérifier si l'email existe déjà
    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Compte admin créé avec succès.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Erreur createAdmin :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── Login admin ───────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Chercher l'admin
    const admin = await User.findOne({ where: { email } });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── Profil admin connecté ─────────────────────────────────
const getMe = async (req, res) => {
  try {
    const admin = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable." });
    }

    return res.status(200).json({ admin });
  } catch (error) {
    console.error("Erreur getMe :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { createAdmin, login, getMe };

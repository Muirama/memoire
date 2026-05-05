const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "gascom_secret_key";

// ── POST /api/auth/login ──────────────────────────────────
// Connexion unique — fonctionne pour admin ET user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis." });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });

    // Token avec le VRAI rôle lu depuis la DB
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Réponse adaptée selon le rôle
    if (user.role === "admin") {
      return res.status(200).json({
        message: "Connexion admin réussie.",
        token,
        role: "admin",
        admin: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      role: "user",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pseudo: user.pseudo,
      },
    });
  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST /api/auth/register ───────────────────────────────
// Inscription publique — crée toujours un "user", jamais un admin
const register = async (req, res) => {
  try {
    const { name, email, phone, address, pseudo, password } = req.body;

    if (!name || !email || !phone || !pseudo || !password)
      return res.status(400).json({
        message: "Nom, email, telephone, pseudo et mot de passe requis.",
      });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Mot de passe : 6 caractères minimum." });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Cet email est déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address?.trim() || null,
      pseudo: pseudo.trim(),
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Compte créé avec succès !",
      token,
      role: "user",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        pseudo: newUser.pseudo,
      },
    });
  } catch (error) {
    console.error("Erreur register :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur getMe :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// —— PATCH /api/auth/me ——————————————————————————————————————————————————————————
const updateMe = async (req, res) => {
  try {
    const { name, email, phone, address, pseudo } = req.body;

    if (!name || !email || !phone || !pseudo) {
      return res.status(400).json({
        message: "Nom, email, telephone et pseudo sont requis.",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== user.email) {
      const emailTaken = await User.findOne({
        where: { email: normalizedEmail },
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Cet email est deja utilise." });
      }
    }

    await user.update({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address?.trim() || null,
      pseudo: pseudo.trim(),
    });

    return res.status(200).json({
      message: "Profil mis a jour avec succes.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pseudo: user.pseudo,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur updateMe :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { login, register, getMe, updateMe };

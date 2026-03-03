const { News } = require("../models");
const { Op } = require("sequelize");

// ── GET toutes les news publiées (public) ─────────────────
const getAllNews = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = { published: true };

    if (search) where.title = { [Op.like]: `%${search}%` };
    if (category && category !== "Toutes") where.category = category;

    const news = await News.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ news });
  } catch (error) {
    console.error("Erreur getAllNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET toutes les news (admin, inclus non publiées) ──────
const getAllNewsAdmin = async (req, res) => {
  try {
    const news = await News.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ news });
  } catch (error) {
    console.error("Erreur getAllNewsAdmin :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET une news par ID (public) ──────────────────────────
const getNewsById = async (req, res) => {
  try {
    const news = await News.findOne({
      where: { id: req.params.id, published: true },
    });
    if (!news) return res.status(404).json({ message: "Article introuvable." });
    return res.status(200).json({ news });
  } catch (error) {
    console.error("Erreur getNewsById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer une news (admin) ───────────────────────────
const createNews = async (req, res) => {
  try {
    const { title, content, excerpt, image, category, author, published } =
      req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Titre et contenu sont requis." });

    const news = await News.create({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : content.trim().slice(0, 200) + "...",
      image: image || null,
      category: category || "Actualité",
      author: author || "Équipe Gascom",
      published: published !== undefined ? published : true,
    });

    return res.status(201).json({ message: "Article créé.", news });
  } catch (error) {
    console.error("Erreur createNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier une news (admin) ─────────────────────────
const updateNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Article introuvable." });

    await news.update(req.body);
    return res.status(200).json({ message: "Article mis à jour.", news });
  } catch (error) {
    console.error("Erreur updateNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH publier/dépublier (admin) ───────────────────────
const togglePublished = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Article introuvable." });

    await news.update({ published: !news.published });
    return res.status(200).json({
      message: news.published ? "Article publié." : "Article dépublié.",
      news,
    });
  } catch (error) {
    console.error("Erreur togglePublished :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer une news (admin) ─────────────────────
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Article introuvable." });

    await news.destroy();
    return res.status(200).json({ message: "Article supprimé." });
  } catch (error) {
    console.error("Erreur deleteNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllNews,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  togglePublished,
  deleteNews,
};

const { News } = require("../models");
const { Op } = require("sequelize");

// ── GET toutes les news ───────────────────────────────────
const getAllNews = async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category && category !== "Toutes") {
      where.category = category;
    }

    let order = [["createdAt", "DESC"]];
    switch (sortBy) {
      case "date-asc":
        order = [["createdAt", "ASC"]];
        break;
      case "date-desc":
        order = [["createdAt", "DESC"]];
        break;
      case "likes-desc":
        order = [["likes", "DESC"]];
        break;
      case "title-asc":
        order = [["title", "ASC"]];
        break;
      case "title-desc":
        order = [["title", "DESC"]];
        break;
      default:
        break;
    }

    const news = await News.findAll({ where, order });
    return res.status(200).json({ news });
  } catch (error) {
    console.error("Erreur getAllNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET une news par ID ───────────────────────────────────
const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Article introuvable." });
    }
    return res.status(200).json({ news });
  } catch (error) {
    console.error("Erreur getNewsById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer une news (admin) ───────────────────────────
const createNews = async (req, res) => {
  try {
    const { title, category, image, excerpt, content, author, tags } = req.body;

    if (!title || !category || !content) {
      return res
        .status(400)
        .json({ message: "Titre, catégorie et contenu sont requis." });
    }

    const news = await News.create({
      title,
      category,
      image,
      excerpt,
      content,
      author: author || "Gascom News",
      tags: tags || [],
      likes: 0,
    });

    return res.status(201).json({ message: "Article créé avec succès.", news });
  } catch (error) {
    console.error("Erreur createNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier une news (admin) ─────────────────────────
const updateNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Article introuvable." });
    }
    await news.update(req.body);
    return res.status(200).json({ message: "Article mis à jour.", news });
  } catch (error) {
    console.error("Erreur updateNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer une news (admin) ─────────────────────
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Article introuvable." });
    }
    await news.destroy();
    return res.status(200).json({ message: "Article supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH liker une news (user connecté) ──────────────────
const likeNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Article introuvable." });
    }
    await news.update({ likes: news.likes + 1 });
    return res
      .status(200)
      .json({ message: "Article liké.", likes: news.likes });
  } catch (error) {
    console.error("Erreur likeNews :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  likeNews,
};

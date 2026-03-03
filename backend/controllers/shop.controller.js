const { Product } = require("../models");
const { Op } = require("sequelize");

// ── GET tous les produits ─────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (category && category !== "Tous") {
      where.category = category;
    }

    let order = [["id", "ASC"]];
    switch (sortBy) {
      case "name-asc":
        order = [["name", "ASC"]];
        break;
      case "name-desc":
        order = [["name", "DESC"]];
        break;
      case "price-asc":
        order = [["price", "ASC"]];
        break;
      case "price-desc":
        order = [["price", "DESC"]];
        break;
      default:
        break;
    }

    const products = await Product.findAll({ where, order });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Erreur getAllProducts :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET un produit par ID ─────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.error("Erreur getProductById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer un produit (admin) ─────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, description, stock } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Nom, prix et catégorie sont requis." });
    }

    const product = await Product.create({
      name,
      price,
      image,
      category,
      description,
      stock: stock || 0,
    });

    return res
      .status(201)
      .json({ message: "Produit créé avec succès.", product });
  } catch (error) {
    console.error("Erreur createProduct :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier un produit (admin) ───────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }
    await product.update(req.body);
    return res.status(200).json({ message: "Produit mis à jour.", product });
  } catch (error) {
    console.error("Erreur updateProduct :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer un produit (admin) ───────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }
    await product.destroy();
    return res.status(200).json({ message: "Produit supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteProduct :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

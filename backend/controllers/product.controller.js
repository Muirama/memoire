const { Product } = require("../models");
const { Op } = require("sequelize");

// ── GET tous les produits (public) ────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const where = {};

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category && category !== "Tous") where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Erreur getAllProducts :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET un produit par ID (public) ───────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit introuvable." });
    return res.status(200).json({ product });
  } catch (error) {
    console.error("Erreur getProductById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer un produit (admin) ────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (!name || !price)
      return res.status(400).json({ message: "Nom et prix sont requis." });

    const product = await Product.create({
      name: name.trim(),
      description: description || null,
      price: parseFloat(price),
      stock: stock !== undefined ? parseInt(stock) : 0,
      category: category || "Autre",
      image: image || null,
    });

    return res.status(201).json({ message: "Produit créé.", product });
  } catch (error) {
    console.error("Erreur createProduct :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier un produit (admin) ─────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit introuvable." });

    await product.update(req.body);
    return res.status(200).json({ message: "Produit mis à jour.", product });
  } catch (error) {
    console.error("Erreur updateProduct :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer un produit (admin) ──────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit introuvable." });

    await product.destroy();
    return res.status(200).json({ message: "Produit supprimé." });
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

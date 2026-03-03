/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSortAmountDown, FaSpinner } from "react-icons/fa";
import { categories, sortOptions } from "../../data/ShopData";
import ProductCard from "../../components/ProductCard";
import api from "../../api/api";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");

  // ── Fetch produits depuis l'API ───────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/shop");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Erreur fetch produits :", err);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ── Filtrage et tri côté frontend ─────────────────────
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tous" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tous");
    setSortBy("default");
  };

  // ── État chargement ───────────────────────────────────
  if (loading) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Chargement des produits...</p>
        </div>
      </section>
    );
  }

  // ── État erreur ───────────────────────────────────────
  if (error) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-gray-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56] transition"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4">
            Notre <span className="text-[#E50914]">Boutique</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Équipez-vous pour dominer
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {filteredAndSortedProducts.length} produit(s) disponible(s)
          </p>
        </motion.div>

        {/* ── Filtres ── */}
        <div className="mb-8 md:mb-10 space-y-4 relative z-30">
          {/* Recherche + Tri */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="relative w-full md:flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]
                           focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all"
              />
            </div>

            <div className="relative w-full md:w-64">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]
                           focus:outline-none focus:ring-2 focus:ring-[#E50914]/50
                           transition-all appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                  selectedCategory === cat
                    ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105"
                    : "bg-[#1A1A1A] text-gray-400 hover:bg-[#E50914]/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grille produits ── */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-20"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-12 md:mt-16 py-12"
            >
              <div className="text-gray-500 text-5xl mb-4">🎮</div>
              <p className="text-gray-500 text-lg md:text-xl mb-6">
                Aucun produit trouvé.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#E50914] text-white rounded-lg
                           hover:bg-[#FF1E56] transition-all font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

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

  // ── FETCH ───────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/shop");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Erreur fetch produits :", err);
        setError(
          "Impossible de charger les produits pour le moment. Réessayez plus tard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ── FILTER + SORT ───────────────────────
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

  const hasResults = !loading && !error && filteredAndSortedProducts.length > 0;

  const isEmpty =
    !loading &&
    !error &&
    filteredAndSortedProducts.length === 0 &&
    products.length > 0;

  // ───────────────────────────────────────
  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER (toujours visible) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* ── FILTRES (TOUJOURS VISIBLES) ── */}
        <div className="mb-8 md:mb-10 space-y-4 relative z-30">
          {/* SEARCH + SORT */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="relative w-full md:flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]
                           focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
              />
            </div>

            <div className="relative w-full md:w-64">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#E50914] text-white"
                    : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── ERROR (sans bloquer UI) ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#E50914] text-white rounded-lg"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="py-16 text-center">
            <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Chargement des produits...</p>
          </div>
        ) : (
          <>
            {/* ── EMPTY STATE (SEULEMENT SI API OK) ── */}
            {isEmpty && (
              <div className="text-center mt-12 md:mt-16 py-12">
                <div className="text-gray-500 text-5xl mb-4">🎮</div>
                <p className="text-gray-500 text-lg md:text-xl mb-6">
                  Aucun produit trouvé.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#E50914] text-white rounded-lg"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* ── GRID ── */}
            {hasResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredAndSortedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

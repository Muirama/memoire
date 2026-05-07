/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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

        const data = Array.isArray(res?.data?.products)
          ? res.data.products
          : [];

        setProducts(data);
      } catch (err) {
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
  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let result = products.filter((product) => {
      const matchesSearch = (product?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tous" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tous");
    setSortBy("default");
  };

  const isEmpty =
    !loading &&
    !error &&
    Array.isArray(products) &&
    products.length > 0 &&
    filtered.length === 0;

  const isApiEmpty = !loading && !error && (!products || products.length === 0);

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Notre <span className="text-[#E50914]">Boutique</span>
          </h1>

          <p className="text-gray-400 mt-2">
            {error ? "—" : `${filtered.length} produit(s)`}
          </p>
        </motion.div>

        {/* FILTERS */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-12 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30"
              />
            </div>

            <div className="relative w-full md:w-64">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === cat
                    ? "bg-[#E50914] text-white"
                    : "bg-[#1A1A1A] text-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-6 text-center mb-10">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#E50914] text-white rounded-lg"
            >
              Réessayer
            </button>
          </div>
        )}
        {/* LOADING */}
        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          </div>
        ) : (
          <>
            {/* EMPTY API */}
            {isApiEmpty ? (
              <div className="text-center py-16 text-gray-500">
                Aucun produit disponible
              </div>
            ) : isEmpty ? (
              <div className="text-center py-16 text-gray-500">
                Aucun produit trouvé avec ces filtres
                <button
                  onClick={resetFilters}
                  className="block mt-4 px-6 py-3 bg-[#E50914] text-white rounded-lg mx-auto"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSortAmountDown,
  FaHeart,
  FaCalendarAlt,
  FaUser,
  FaNewspaper,
  FaEye,
} from "react-icons/fa";
import { news, newsCategories, newsSortOptions } from "../../data/NewsData";

export default function NewsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [sortBy, setSortBy] = useState("date-desc");
  const [likedNews, setLikedNews] = useState(new Set());

  // Filtrage et tri des actualités
  const filteredAndSortedNews = useMemo(() => {
    let filtered = news.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Toutes" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "likes-desc":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Toutes");
    setSortBy("date-desc");
  };

  const handleLike = (newsId) => {
    setLikedNews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Jeux Vidéo": "bg-blue-600",
      "e-Sport": "bg-[#E50914]",
      Console: "bg-purple-600",
      Hardware: "bg-green-600",
    };
    return colors[category] || "bg-gray-600";
  };

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 relative z-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4">
            Actualités <span className="text-[#E50914]">Gaming</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Les dernières news du monde du gaming, esport et tech
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {filteredAndSortedNews.length} article(s) disponible(s)
          </p>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 md:mb-10 space-y-4 relative z-30">
          {/* Ligne 1: Recherche + Tri */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            {/* Recherche */}
            <div className="relative w-full md:flex-1">
              <label htmlFor="news-search" className="sr-only">
                Rechercher une actualité
              </label>
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <input
                id="news-search"
                name="newsSearch"
                type="text"
                placeholder="Rechercher une actualité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30 focus:border-[#E50914] focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all relative z-30"
              />
            </div>

            {/* Tri */}
            <div className="relative w-full md:w-64">
              <label htmlFor="news-sort" className="sr-only">
                Trier par
              </label>
              <FaSortAmountDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <select
                id="news-sort"
                name="newsSort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30 focus:border-[#E50914] focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all appearance-none relative z-30"
              >
                {newsSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Ligne 2: Filtres catégories */}
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center relative z-30">
            {newsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                aria-pressed={selectedCategory === cat}
                aria-label={`Filtrer par catégorie ${cat}`}
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

        {/* Grille d'actualités */}
        <AnimatePresence mode="wait">
          {filteredAndSortedNews.length > 0 ? (
            <motion.div
              key="news-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-20"
            >
              {filteredAndSortedNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span
                      className={`absolute top-3 right-3 ${getCategoryColor(item.category)} text-white text-xs px-3 py-1 rounded-full font-semibold`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    {/* Titre */}
                    <h3
                      className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2 cursor-pointer hover:text-[#E50914] transition"
                      onClick={() => navigate(`/news/${item.id}`)}
                    >
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#E50914]" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-[#E50914]" />
                        <span>{item.author}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedNews.has(item.id)
                            ? "text-[#E50914]"
                            : "text-gray-400 hover:text-[#E50914]"
                        }`}
                        aria-label={`J'aime ${item.title}`}
                      >
                        <FaHeart
                          className={
                            likedNews.has(item.id) ? "fill-current" : ""
                          }
                        />
                        <span className="text-sm font-semibold">
                          {item.likes + (likedNews.has(item.id) ? 1 : 0)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/news/${item.id}`)}
                        className="text-sm font-semibold text-[#E50914] hover:text-[#FF1E56] transition flex items-center gap-2"
                      >
                        <FaEye /> Lire plus
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-12 md:mt-16 py-12 relative z-10"
            >
              <div className="text-gray-500 text-5xl md:text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg md:text-xl mb-6">
                Aucune actualité trouvée pour votre recherche.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                aria-label="Réinitialiser tous les filtres"
                className="px-6 md:px-8 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56] transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] active:scale-95 font-semibold text-sm md:text-base"
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

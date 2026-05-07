/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaNewspaper,
  FaCalendarAlt,
  FaUser,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";
import api from "../../api/api";

const CATEGORIES = [
  "Toutes",
  "Actualité",
  "Tournoi",
  "Communauté",
  "Produit",
  "Annonce",
];

const CATEGORY_COLORS = {
  Actualité: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Tournoi: "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30",
  Communauté: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Produit: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Annonce: "bg-green-500/20 text-green-400 border-green-500/30",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function NewsPage() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const isApiEmpty = !loading && !error && news.length === 0;
  const isFilterEmpty =
    !loading && !error && news.length > 0 && filtered.length === 0;

  // ── FETCH ─────────────────────────────
  useEffect(() => {
    api
      .get("/news")
      .then((r) => setNews(r.data.news))
      .catch(() =>
        setError(
          "Impossible de charger les actualités pour le moment. Réessayez plus tard.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  // ── FILTER ─────────────────────────────
  const filtered = useMemo(() => {
    return news.filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "Toutes" || n.category === category;

      return matchSearch && matchCategory;
    });
  }, [news, search, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  // ───────────────────────────────────────
  // ⚠️ IMPORTANT : on ne bloque PLUS le layout
  // ───────────────────────────────────────

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER (toujours visible) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            Nos <span className="text-[#E50914]">Actualités</span>
          </h1>
          <p className="text-gray-400">
            Restez informés des dernières nouvelles Gascom
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {filtered.length} article(s)
          </p>
        </motion.div>

        {/* SEARCH (toujours visible) */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg
                         border border-[#E50914]/30 focus:border-[#E50914]
                         focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all"
            />
          </div>
        </div>

        {/* CATEGORIES (toujours visible) */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                ${
                  category === cat
                    ? "bg-[#E50914] text-white scale-105 shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                    : "bg-[#1A1A1A] text-gray-400 hover:bg-[#E50914]/20 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── ERROR BLOCK (sans casser UI) ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-red-500/20 bg-red-500/10
                       px-6 py-6 text-center mb-10"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56]"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {/* ── LOADING (sans bloquer filtres) ── */}
        {loading ? (
          <div className="py-16 text-center">
            <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Chargement des actualités...</p>
          </div>
        ) : (
          <>
            {/* EMPTY STATE */}
            {isApiEmpty ? (
              <div className="text-center py-16">
                <FaNewspaper className="text-gray-700 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-xl">
                  Aucun article disponible pour le moment.
                </p>
              </div>
            ) : isFilterEmpty ? (
              <div className="text-center py-16">
                <FaNewspaper className="text-gray-700 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-xl">
                  Aucun article trouvé avec ces filtres.
                </p>
              </div>
            ) : (
              <>
                {/* FEATURED */}
                {featured && category === "Toutes" && !search && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate(`/news/${featured.id}`)}
                    className="cursor-pointer mb-10"
                  >
                    <h2 className="text-white text-2xl font-bold">
                      {featured.title}
                    </h2>
                    <p className="text-gray-400">{featured.excerpt}</p>
                  </motion.div>
                )}

                {/* LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(category !== "Toutes" || search ? filtered : rest).map(
                    (item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/news/${item.id}`)}
                        className="bg-[#1A1A1A] p-4 rounded-lg cursor-pointer"
                      >
                        <h3 className="text-white font-bold">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.excerpt}</p>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

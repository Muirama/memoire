/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaNewspaper, FaSpinner, FaUser, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import api from "../../api/api";

const CATEGORIES = [
  "Toutes",
  "Actualité",
  "Tournoi",
  "Communauté",
  "Produit",
  "Sponsor",
];

const CATEGORY_COLORS = {
  Actualité: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Tournoi: "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30",
  Communauté: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Produit: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Sponsor: "bg-green-500/20 text-green-400 border-green-500/30",
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

  // ── FETCH ─────────────────────────────
  useEffect(() => {
    api
      .get("/news")
      .then((r) => {
        const data = Array.isArray(r?.data?.news) ? r.data.news : [];
        setNews(data);
      })
      .catch(() =>
        setError(
          "Impossible de charger les actualités pour le moment. Réessayez plus tard.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  // ── FILTER ─────────────────────────────
  const filtered = useMemo(() => {
    if (!Array.isArray(news)) return [];

    return news.filter((n) => {
      const matchSearch = (n?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory = category === "Toutes" || n.category === category;

      return matchSearch && matchCategory;
    });
  }, [news, search, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const isApiEmpty = !loading && !error && news.length === 0;

  const isFilterEmpty =
    !loading && !error && news.length > 0 && filtered.length === 0;

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
            {error ? "—" : `${filtered.length} article(s)`}
          </p>
        </motion.div>

        {/* SEARCH */}
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
                         focus:outline-none focus:ring-2 focus:ring-[#E50914]/50"
            />
          </div>
        </div>

        {/* CATEGORIES */}
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
          <div className="py-16 text-center">
            <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : (
          <>
            {/* EMPTY API */}
            {isApiEmpty ? (
              <div className="text-center py-16">
                <FaNewspaper className="text-gray-700 text-6xl mx-auto mb-4" />
                <p className="text-gray-500">Aucun article disponible.</p>
              </div>
            ) : isFilterEmpty ? (
              <div className="text-center py-16">
                <FaNewspaper className="text-gray-700 text-6xl mx-auto mb-4" />
                <p className="text-gray-500">
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
                    className="group relative rounded-2xl overflow-hidden border border-white/10
                           hover:border-[#E50914]/50 transition-all duration-300 mb-10 cursor-pointer
                           hover:shadow-[0_0_30px_rgba(229,9,20,0.2)]"
                  >
                    <div className="relative h-64 md:h-80 overflow-hidden bg-[#1A1A1A]">
                      {featured.image ? (
                        <img
                          src={featured.image}
                          alt={featured.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105
                                    transition duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaNewspaper className="text-gray-700 text-6xl" />
                        </div>
                      )}
                      <div
                        className="absolute inset-0 bg-gradient-to-t
                                  from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs bg-[#E50914] text-white px-2 py-0.5
                                     rounded-full font-bold"
                        >
                          À la une
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-semibold
                                     ${CATEGORY_COLORS[featured.category]}`}
                        >
                          {featured.category}
                        </span>
                      </div>
                      <h2
                        className="text-white font-extrabold text-2xl md:text-3xl mb-2
                                 group-hover:text-[#E50914] transition leading-tight"
                      >
                        {featured.title}
                      </h2>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <FaUser size={10} /> {featured.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} />{" "}
                          {formatDate(featured.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-[#E50914] font-semibold ml-auto">
                          Lire l'article <FaArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Grille articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(category !== "Toutes" || search ? filtered : rest).map(
                    (item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/news/${item.id}`)}
                        className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5
                             hover:border-[#E50914]/40 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)]
                             transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        {/* Image */}
                        <div className="h-44 overflow-hidden bg-[#0D0D0D] relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105
                                      transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaNewspaper className="text-gray-700 text-5xl" />
                            </div>
                          )}
                          <span
                            className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full
                                     border font-semibold ${CATEGORY_COLORS[item.category]}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        {/* Contenu */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3
                            className="text-white font-bold text-base mb-2 line-clamp-2
                                   group-hover:text-[#E50914] transition leading-snug"
                          >
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-3 flex-1 leading-relaxed">
                            {item.excerpt}
                          </p>
                          <div
                            className="flex items-center justify-between mt-4 pt-3
                                    border-t border-white/5 text-xs text-gray-500"
                          >
                            <span className="flex items-center gap-1">
                              <FaUser size={9} /> {item.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={9} />{" "}
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
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

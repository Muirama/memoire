/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaSpinner,
  FaNewspaper,
} from "react-icons/fa";
import api from "../../api/api";

const CATEGORY_COLORS = {
  Actualité: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Tournoi: "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30",
  Communauté: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Produit: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Annonce: "bg-green-500/20 text-green-400 border-green-500/30",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    api
      .get(`/news/${id}`)
      .then((r) => setNews(r.data.news))
      .catch(() => setError("Article introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </section>
    );

  if (error || !news)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-6">{error || "Introuvable."}</p>
          <button
            onClick={() => navigate("/news")}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour
          </button>
        </div>
      </section>
    );

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10"
    >
      <div className="max-w-3xl mx-auto">
        {/* Retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914]
                     transition mb-8 font-semibold group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour aux actualités
        </motion.button>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 flex-wrap"
        >
          <span
            className={`text-xs px-3 py-1 rounded-full border font-semibold
                           ${CATEGORY_COLORS[news.category]}`}
          >
            {news.category}
          </span>
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4"
        >
          {news.title}
        </motion.h1>

        {/* Méta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-5 text-gray-400 text-sm mb-8 pb-6
                     border-b border-white/5 flex-wrap"
        >
          <span className="flex items-center gap-1.5">
            <FaUser className="text-[#E50914]" size={12} /> {news.author}
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <FaCalendarAlt className="text-[#E50914]" size={12} />
            {formatDate(news.createdAt)}
          </span>
        </motion.div>

        {/* Image */}
        {news.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative rounded-2xl overflow-hidden mb-8 border border-white/10"
            style={{ minHeight: "200px" }}
          >
            {!imgLoaded && (
              <div
                className="absolute inset-0 bg-[#1A1A1A] animate-pulse
                              flex items-center justify-center"
              >
                <FaNewspaper className="text-gray-700 text-4xl" />
              </div>
            )}
            <img
              src={news.image}
              alt={news.title}
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              className={`w-full max-h-96 object-cover transition-opacity duration-500
                             ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </motion.div>
        )}

        {/* Contenu */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="prose-gascom"
        >
          {news.content.split("\n").map((para, i) =>
            para.trim() === "" ? (
              <div key={i} className="h-4" />
            ) : (
              <p
                key={i}
                className="text-gray-300 leading-relaxed text-base md:text-lg mb-4"
              >
                {para}
              </p>
            ),
          )}
        </motion.article>

        {/* Footer article */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <button
            type="button"
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 px-6 py-3 border border-[#E50914]/30
                       text-white hover:bg-[#E50914]/10 rounded-xl font-semibold
                       text-sm transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Voir toutes les actualités
          </button>
        </motion.div>
      </div>
    </section>
  );
}

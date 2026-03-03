/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeart, FaCalendarAlt, FaUser, FaTags, FaShare } from "react-icons/fa";
import { news } from "../../data/NewsData";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const article = news.find((n) => n.id === parseInt(id));

  if (!article) {
    return (
      <section className="relative bg-transparent min-h-screen py-20 px-4 z-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article non trouvé</h1>
          <Link to="/news" className="text-[#E50914] hover:text-[#FF1E56]">
            Retour aux actualités
          </Link>
        </div>
      </section>
    );
  }

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

  const relatedNews = news
    .filter((n) => n.category === article.category && n.id !== article.id)
    .slice(0, 3);

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <FaArrowLeft /> Retour aux actualités
        </motion.button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#E50914]/30 shadow-[0_0_30px_rgba(229,9,20,0.3)]"
        >
          {/* Image header */}
          <div className="relative h-80 md:h-[500px] overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
            <span
              className={`absolute top-4 right-4 ${getCategoryColor(
                article.category
              )} text-white text-sm px-4 py-2 rounded-full font-semibold`}
            >
              {article.category}
            </span>
          </div>

          <div className="p-6 md:p-10">
            {/* Titre */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 pb-6 border-b border-gray-700">
              <div className="flex items-center gap-2 text-gray-400">
                <FaCalendarAlt className="text-[#E50914]" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaUser className="text-[#E50914]" />
                <span>{article.author}</span>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 transition-colors ${
                  liked ? "text-[#E50914]" : "text-gray-400 hover:text-[#E50914]"
                }`}
              >
                <FaHeart className={liked ? "fill-current" : ""} />
                <span className="font-semibold">
                  {article.likes + (liked ? 1 : 0)} likes
                </span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <FaShare />
                <span>Partager</span>
              </button>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              <FaTags className="text-[#E50914]" />
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#0D0D0D] text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-[#E50914]/20 transition cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Contenu */}
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line mb-6">
                {article.content}
              </p>
              <p className="text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur.
              </p>
            </div>
          </div>
        </motion.article>

        {/* Articles similaires */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
              Articles similaires
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => navigate(`/news/${related.id}`)}
                  className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20 hover:border-[#E50914] hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all cursor-pointer"
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

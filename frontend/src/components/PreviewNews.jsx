/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaNewspaper,
} from "react-icons/fa";
import api from "../api/api";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });

export default function PreviewNews() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/news").then((r) => {
      setNews(r.data.news.slice(0, 4)); // max 4
    });
  }, []);

  if (!news.length) return null;

  const featured = news[0];
  const sideNews = news.slice(1);

  return (
    <section className="relative py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Dernières <span className="text-[#E50914]">Actualités</span>
          </h2>

          <button
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            Voir tout <FaArrowRight size={12} />
          </button>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* FEATURED */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            onClick={() => navigate(`/news/${featured.id}`)}
            className="lg:col-span-2 relative group cursor-pointer rounded-2xl overflow-hidden"
          >
            <div className="h-[280px] md:h-[340px] overflow-hidden">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                  <FaNewspaper className="text-gray-700 text-6xl" />
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 p-6">
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2 group-hover:text-[#E50914] transition">
                {featured.title}
              </h3>

              <div className="flex items-center gap-4 text-gray-300 text-xs">
                <span className="flex items-center gap-1">
                  <FaUser size={10} /> {featured.author}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={10} /> {formatDate(featured.createdAt)}
                </span>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[#E50914]/10" />
          </motion.div>

          {/* SIDE NEWS */}
          <div className="flex flex-col gap-4">
            {sideNews.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/news/${item.id}`)}
                className="flex gap-4 bg-[#1A1A1A] p-3 rounded-xl cursor-pointer group
                           hover:border-[#E50914]/40 border border-white/5 transition"
              >
                {/* Image */}
                <div className="w-24 h-20 overflow-hidden rounded-lg shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0D0D0D]">
                      <FaNewspaper className="text-gray-700" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col justify-between">
                  <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-[#E50914] transition">
                    {item.title}
                  </h4>

                  <span className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

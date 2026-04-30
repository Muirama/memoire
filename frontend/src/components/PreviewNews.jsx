/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = vers droite, -1 = vers gauche
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/news").then((r) => {
      setNews(r.data.news.slice(0, 4));
    });
  }, []);

  // ── Auto-rotate toutes les 5s ──────────────────────────
  useEffect(() => {
    if (news.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setFeaturedIdx((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  if (!news.length) return null;

  // L'article featured est à featuredIdx, les autres dans l'ordre
  const featured = news[featuredIdx];
  const sideNews = news.filter((_, i) => i !== featuredIdx);

  // Quand on clique sur un side article → il devient featured
  const handleSwap = (item) => {
    const clickedIdx = news.indexOf(item);
    setDirection(clickedIdx > featuredIdx ? 1 : -1);
    setFeaturedIdx(clickedIdx);
  };

  // Variants pour le featured (grande card)
  const featuredVariants = {
    enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
  };

  // Variants pour les side items
  const sideVariants = {
    initial: { opacity: 0, x: 40, scale: 0.97 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: i * 0.08, duration: 0.35 },
    }),
    exit: { opacity: 0, x: 60, scale: 0.97 },
  };

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
            className="flex items-center gap-2 text-sm text-gray-400
                       hover:text-white transition"
          >
            Voir tout <FaArrowRight size={12} />
          </button>
        </div>

        {/* Indicateurs */}
        <div className="flex gap-2 mb-5">
          {news.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > featuredIdx ? 1 : -1);
                setFeaturedIdx(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300
                          ${
                            i === featuredIdx
                              ? "w-6 bg-[#E50914]"
                              : "w-1.5 bg-white/20 hover:bg-white/40"
                          }`}
            />
          ))}
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* FEATURED — animé */}
          <div
            className="lg:col-span-2 relative rounded-2xl overflow-hidden
                          h-[280px] md:h-[340px]"
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={featured.id}
                custom={direction}
                variants={featuredVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => navigate(`/news/${featured.id}`)}
                className="absolute inset-0 group cursor-pointer"
              >
                {/* Image */}
                <div className="w-full h-full overflow-hidden">
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover
                                 group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center
                                    justify-center bg-[#1A1A1A]"
                    >
                      <FaNewspaper className="text-gray-700 text-6xl" />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t
                                from-black/80 to-transparent"
                />

                {/* Contenu */}
                <div className="absolute bottom-0 p-6">
                  <h3
                    className="text-white text-xl md:text-2xl font-bold mb-2
                                 group-hover:text-[#E50914] transition"
                  >
                    {featured.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 text-xs">
                    <span className="flex items-center gap-1">
                      <FaUser size={10} /> {featured.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />{" "}
                      {formatDate(featured.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Glow hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100
                                transition bg-[#E50914]/10"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* SIDE NEWS — animés */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {sideNews.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  variants={sideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  onClick={() => handleSwap(item)}
                  className="flex gap-4 bg-[#1A1A1A] p-3 rounded-xl cursor-pointer
                             group hover:border-[#E50914]/40 border border-white/5
                             transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)]"
                >
                  {/* Image */}
                  <div className="w-24 h-20 overflow-hidden rounded-lg shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover
                                   group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center
                                      justify-center bg-[#0D0D0D]"
                      >
                        <FaNewspaper className="text-gray-700" />
                      </div>
                    )}
                  </div>

                  {/* Texte */}
                  <div className="flex flex-col justify-between min-w-0">
                    <h4
                      className="text-white text-sm font-semibold line-clamp-2
                                   group-hover:text-[#E50914] transition"
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                      {/* Indicateur "cliquer pour afficher" */}
                      <span
                        className="text-[10px] text-[#E50914]/60
                                       group-hover:text-[#E50914] transition
                                       flex items-center gap-1"
                      >
                        Voir <FaArrowRight size={8} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

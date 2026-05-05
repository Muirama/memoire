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
  const [sideStartIdx, setSideStartIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/news").then((r) => {
      setNews(r.data.news || []);
    });
  }, []);

  const sponsorNews = news.filter((item) => item.category === "Sponsor");
  const sidePool = news.filter((item) => item.category !== "Sponsor");
  const sideVisibleCount = Math.min(3, sidePool.length);
  const sideNews = Array.from({ length: sideVisibleCount }, (_, i) => {
    return sidePool[(sideStartIdx + i) % sidePool.length];
  });

  useEffect(() => {
    if (featuredIdx >= sponsorNews.length) {
      setFeaturedIdx(0);
    }
  }, [featuredIdx, sponsorNews.length]);

  useEffect(() => {
    if (sideStartIdx >= sidePool.length) {
      setSideStartIdx(0);
    }
  }, [sideStartIdx, sidePool.length]);

  useEffect(() => {
    if (sponsorNews.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setFeaturedIdx((prev) => (prev + 1) % sponsorNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sponsorNews.length]);

  useEffect(() => {
    if (sidePool.length <= 3) return;
    const timer = setInterval(() => {
      setSideStartIdx((prev) => (prev + 1) % sidePool.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [sidePool.length]);

  if (!news.length) return null;

  const featured = sponsorNews[featuredIdx] || null;

  const featuredVariants = {
    enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
  };

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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Dernieres <span className="text-[#E50914]">Actualites</span>
          </h2>
          <button
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 text-sm text-gray-400
                       hover:text-white transition"
          >
            Voir tout <FaArrowRight size={12} />
          </button>
        </div>

        <div className="flex gap-2 mb-5 min-h-[6px]">
          {sponsorNews.map((_, i) => (
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

        <div className="grid lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 relative rounded-2xl overflow-hidden
                          h-[280px] md:h-[340px]"
          >
            {featured ? (
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

                  <div
                    className="absolute inset-0 bg-gradient-to-t
                                from-black/80 to-transparent"
                  />

                  <div className="absolute bottom-0 p-6">
                    <span className="inline-flex text-[11px] font-bold bg-[#E50914] text-white px-2 py-0.5 rounded-full mb-3">
                      Sponsor
                    </span>
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
                        <FaCalendarAlt size={10} /> {formatDate(featured.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100
                                transition bg-[#E50914]/10"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
                <div className="text-center px-6">
                  <FaNewspaper className="text-gray-700 text-5xl mx-auto mb-3" />
                  <p className="text-white font-semibold">Aucune news Sponsor</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Ajoutez une actualite categorie Sponsor pour cette grande preview.
                  </p>
                </div>
              </div>
            )}
          </div>

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
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="flex gap-4 bg-[#1A1A1A] p-3 rounded-xl cursor-pointer
                             group hover:border-[#E50914]/40 border border-white/5
                             transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.15)]"
                >
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

            {!sideNews.length && (
              <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Aucune autre categorie de news a afficher.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

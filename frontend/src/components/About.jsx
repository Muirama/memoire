import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
} from "framer-motion";
import { FaArrowRight, FaRegClock } from "react-icons/fa";
import { GiCrown } from "react-icons/gi";
import { Link } from "react-router-dom";
import { games, rosterSources } from "../data/GamesData";
import {
  organizationIntro,
  organizationMissionQuote,
  organizationStartedYear,
  organizationStory,
} from "../data/organizationData";

const autoAdvanceDelay = 9000;

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeChapter = organizationStory[activeIndex];
  const engagedMembers = rosterSources.reduce(
    (total, roster) => total + roster.members.length,
    0,
  );
  const activeYears = Math.max(
    1,
    new Date().getFullYear() - organizationStartedYear,
  );

  const stats = useMemo(
    () => [
      { value: activeYears, suffix: " ans", label: "Depuis 2021" },
      { value: rosterSources.length, suffix: "", label: "Rosters actifs" },
      { value: games.length, suffix: "", label: "Jeux representes" },
      { value: engagedMembers, suffix: "", label: "Membres engages" },
    ],
    [activeYears, engagedMembers],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % organizationStory.length);
    }, autoAdvanceDelay);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden py-24 text-white md:py-36 bg-[#0a0a0a]">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.15)_0%,transparent_50%)] blur-[100px]" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#E50914]/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/30 bg-[#E50914]/10 px-4 py-1.5 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914]">
              About Gascom
            </p>
          </div>
          <h2 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl tracking-tight">
            L'histoire s'ouvre ici{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#ff4b55] via-[#E50914] to-[#a30007] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(229,9,20,0.5)]">
              chapitre par chapitre
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg font-light">
            {organizationIntro}
          </p>
        </motion.div>

        <div className="mt-20 grid items-start gap-8 lg:grid-cols-[4fr_6fr] lg:gap-12">
          
          {/* Left Column - Stats & Serment */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10 transition-all hover:border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute -right-20 top-0 h-40 w-40 rounded-full bg-[#E50914]/20 blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                <GiCrown className="text-3xl text-[#E50914]" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">
                Notre Serment
              </p>
              <p className="text-xl font-bold leading-relaxed text-white md:text-2xl">
                {organizationMissionQuote}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col justify-center rounded-3xl border border-white/5 bg-black/40 p-5 hover:bg-black/60 transition-colors"
                  >
                    <p className="text-3xl font-black text-white">
                      <CountUp end={stat.value} />
                      <span className="text-[#E50914]">{stat.suffix}</span>
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/organization/history"
                  className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#E50914] px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(229,9,20,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Lire toute l'histoire
                    <FaArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] transition-transform duration-500 group-hover/btn:translate-x-[100%]" />
                </Link>
                <Link
                  to="/organization/partners"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
                >
                  Nos partenaires
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Chapters */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914]">
                  Histoire en mouvement
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Une lecture guidee
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-semibold text-gray-300">
                <FaRegClock className="text-[#E50914]" />
                9s par chapitre
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[40px] border border-white/5 bg-[#111111]/80 backdrop-blur-xl">
              {/* Dynamic Chapter Display */}
              <div className="relative min-h-[320px] p-8 md:p-10 lg:p-12">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={activeChapter.id}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                  >
                    <div className="inline-block rounded-full border border-[#E50914]/30 bg-[#E50914]/10 px-3 py-1 mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E50914]">
                        {activeChapter.yearLabel}
                      </p>
                    </div>
                    <h4 className="text-3xl font-black leading-tight text-white md:text-5xl tracking-tight mb-6">
                      {activeChapter.title}
                    </h4>
                    <p className="text-base leading-relaxed text-gray-400">
                      {activeChapter.body}
                    </p>
                  </motion.article>
                </AnimatePresence>
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-black/40 border-t border-white/5">
                {organizationStory.map((chapter, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative overflow-hidden rounded-[24px] px-4 py-4 text-left transition-all duration-300 ${
                        isActive
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab" 
                          className="absolute inset-0 bg-[#E50914]/10 rounded-[24px] border border-[#E50914]/30"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-[#E50914]' : 'text-gray-500'}`}>
                          {chapter.marker}
                        </p>
                        <p className={`mt-1 text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {chapter.chapter}
                        </p>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: autoAdvanceDelay / 1000, ease: "linear" }}
                            className="h-full bg-[#E50914]"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ end, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, once: true });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [motionValue]);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, end, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });
      return () => controls.stop();
    }
  }, [duration, end, isInView, motionValue]);

  return <span ref={ref}>{display}</span>;
}

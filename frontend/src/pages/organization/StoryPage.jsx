import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaArrowRight, FaBullseye, FaFlag, FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router-dom";
import { games, rosterSources } from "../../data/GamesData";
import {
  organizationIntro,
  organizationMissionQuote,
  organizationStartedYear,
  organizationStory,
  organizationValues,
} from "../../data/organizationData";

const pageStats = [
  {
    label: "Annee de creation",
    value: String(organizationStartedYear),
    icon: FaFlag,
  },
  {
    label: "Rosters actifs",
    value: String(rosterSources.length),
    icon: FaLayerGroup,
  },
  {
    label: "Jeux representes",
    value: String(games.length),
    icon: FaBullseye,
  },
];

export default function StoryPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white selection:bg-[#E50914] selection:text-white">
      {/* Dynamic Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#E50914]/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#ff4b55]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div style={{ opacity, y }} className="mb-24 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-8"
                >
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">
                    Notre ADN
                  </p>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl font-black leading-[1.05] md:text-7xl lg:text-8xl tracking-tight"
                >
                  Ascension
                  <span className="block mt-2 bg-gradient-to-r from-[#ff4b55] via-[#E50914] to-[#a30007] bg-clip-text text-transparent">
                    Chronologique
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-8 max-w-xl text-lg leading-relaxed text-gray-400 font-light"
                >
                  {organizationIntro}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                  className="mt-12 flex flex-wrap gap-4"
                >
                  <Link
                    to="/organization/partners"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#E50914] px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Nos Partenaires
                      <FaArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link
                    to="/team"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
                  >
                    Explorer les équipes
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#111111]/80 p-8 backdrop-blur-xl md:p-12 shadow-2xl"
              >
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#E50914]/20 blur-2xl" />
                
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914] mb-4">
                    Notre Serment
                  </p>
                  <p className="text-2xl font-bold leading-snug text-white md:text-3xl">
                    "{organizationMissionQuote}"
                  </p>
                  
                  <div className="mt-12 grid gap-4">
                    {pageStats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                          className="group flex items-center gap-6 rounded-3xl border border-white/5 bg-black/40 p-4 transition-all hover:bg-white/5"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E50914]/10 text-[#E50914] transition-transform group-hover:scale-110">
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divider / Intro to Phases */}
        <section className="px-4 md:px-8 py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-24"
            >
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914] mb-4">Les 4 phases</p>
              <h2 className="text-3xl font-black md:text-5xl text-white leading-tight">
                L'évolution d'une idée devenue institution
              </h2>
            </motion.div>
          </div>
        </section>

        {/* Chronological Phases */}
        <section className="px-4 md:px-8 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="relative border-l-2 border-white/10 pl-8 md:pl-16 space-y-24">
              {organizationStory.map((chapter, index) => (
                <motion.article
                  key={chapter.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] md:-left-[73px] top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#111] border-2 border-[#E50914]">
                    <div className="h-2 w-2 rounded-full bg-[#E50914]" />
                  </div>

                  <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
                    <div>
                      <div className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phase 0{index + 1}</span>
                      </div>
                      <div className="text-5xl font-black tracking-tighter text-[#E50914] opacity-80 mb-2">
                        {chapter.marker}
                      </div>
                      <p className="text-lg font-bold text-white/90">
                        {chapter.chapter}
                      </p>
                    </div>

                    <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all hover:bg-white/[0.04]">
                      <h3 className="text-2xl font-black leading-tight text-white md:text-3xl mb-6">
                        {chapter.title}
                      </h3>
                      <p className="text-base leading-relaxed text-gray-400 font-light">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="px-4 md:px-8 py-20">
          <div className="mx-auto max-w-7xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/50 to-transparent rounded-[40px] -z-10" />
            <div className="grid gap-12 rounded-[40px] border border-white/10 bg-black/20 p-8 backdrop-blur-xl md:p-16 lg:grid-cols-[1fr_1.5fr] items-center shadow-2xl">
              
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                >
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914] mb-4">
                    Principes Fondamentaux
                  </p>
                  <h2 className="text-3xl font-black text-white md:text-5xl mb-6 leading-tight">
                    Une structure qui avance avec des valeurs simples
                  </h2>
                  <p className="text-gray-400 leading-relaxed font-light mb-8 max-w-md">
                    Gascom s'est construit dans l'effort, dans la communaute et dans une ambition de rayonnement durable.
                  </p>
                  
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E50914] hover:text-[#ff4b55] transition-colors"
                  >
                    Retour à l'accueil <FaArrowRight size={12} />
                  </Link>
                </motion.div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {organizationValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group rounded-[32px] border border-white/5 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.08] hover:border-white/15"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E50914] mb-3">
                      Valeur
                    </p>
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#E50914] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400 font-light">
                      {value.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

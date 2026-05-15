import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaHandshake,
  FaLayerGroup,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  featuredPartners,
  groupCompanies,
} from "../../data/organizationData";

const partnerPillars = [
  {
    id: "visibility",
    title: "Visibilite",
    desc: "Les partenaires renforcent la presence de Gascom a travers les evenements, les activations et l'image de marque.",
  },
  {
    id: "structure",
    title: "Structure",
    desc: "Chaque alliance soutient une progression plus stable, plus durable et plus professionnelle pour les rosters.",
  },
  {
    id: "ecosysteme",
    title: "Ecosysteme",
    desc: "Gascom evolue dans un reseau de marques et d'entites qui consolide son identite et sa capacite a grandir.",
  },
];

export default function PartnersPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white selection:bg-[#E50914] selection:text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.1)_0%,transparent_60%)]" />
        <div className="absolute left-0 right-0 top-0 h-[500px] bg-gradient-to-b from-[#111111] to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div style={{ opacity, y }} className="mb-20 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/30 bg-[#E50914]/10 px-4 py-1.5 backdrop-blur-md mb-6"
                >
                  <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914]">
                    Sponsors & Partenaires
                  </p>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl font-black leading-[1.1] md:text-7xl tracking-tight"
                >
                  Notre ecosysteme
                  <span className="block bg-gradient-to-r from-[#ff4b55] to-[#E50914] bg-clip-text text-transparent">
                    de developpement
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400 font-light"
                >
                  Ici, on quitte le rythme de la Home. La page partenaires assume une direction plus galerie, pour presenter les marques et l'ecosysteme qui accompagnent Gascom vers l'excellence.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="group rounded-[32px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-white/10">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Sponsors</p>
                  <p className="mt-2 text-5xl font-black text-white">{featuredPartners.length}</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">Marques et structures actives visibles autour de Gascom.</p>
                </div>
                <div className="group rounded-[32px] border border-[#E50914]/20 bg-[#E50914]/5 p-8 backdrop-blur-xl transition-all hover:bg-[#E50914]/10 hover:border-[#E50914]/30 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#E50914]/20 blur-2xl transition-all group-hover:bg-[#E50914]/30" />
                  <div className="relative z-10">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E50914]">Ecosysteme</p>
                    <p className="mt-2 text-5xl font-black text-white">{groupCompanies.length}</p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-400">Entites du groupe renforçant la structure globale.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="px-4 md:px-8 mb-24">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {partnerPillars.map((pillar, index) => (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-[#111] p-8 transition-all hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#E50914]">
                  Axe 0{index + 1}
                </p>
                <h2 className="relative z-10 mt-4 text-2xl font-bold text-white">
                  {pillar.title}
                </h2>
                <p className="relative z-10 mt-4 text-sm leading-relaxed text-gray-400">
                  {pillar.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Partners Showcase Section */}
        <section className="px-4 md:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black md:text-5xl">Dossier Partenaires</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Chaque fiche donne une place nette au logo, au role du partenaire et a la nature de son apport dans l'ecosysteme Gascom.</p>
            </div>

            <div className="grid gap-8">
              {featuredPartners.map((partner, index) => (
                <motion.article
                  key={partner.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-[#111111]/60 backdrop-blur-md transition-all hover:border-white/15 hover:bg-[#151515] hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${partner.tone} opacity-20 mix-blend-screen transition-opacity duration-500 group-hover:opacity-40`} />
                  
                  <div className="relative z-10 grid lg:grid-cols-[1fr_2fr]">
                    <div className="flex min-h-[250px] items-center justify-center border-b border-white/5 p-10 lg:border-b-0 lg:border-r bg-black/40 backdrop-blur-sm">
                      <div className="relative w-full max-w-[200px] aspect-[3/2] flex items-center justify-center">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className={`inline-block rounded-full border ${partner.border} bg-white/5 px-3 py-1 mb-4 backdrop-blur-md`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                              {partner.tier}
                            </p>
                          </div>
                          <h3 className="text-3xl font-black text-white md:text-4xl">
                            {partner.name}
                          </h3>
                        </div>
                        <div className="text-6xl font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.08]">
                          0{index + 1}
                        </div>
                      </div>

                      <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 font-light">
                        {partner.summary}
                      </p>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {partner.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {partner.href ? (
                        <a
                          href={partner.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-10 inline-flex items-center gap-2 self-start rounded-xl bg-white text-black px-6 py-3 text-sm font-bold transition-transform hover:scale-105"
                        >
                          {partner.buttonLabel}
                          <FaExternalLinkAlt size={12} />
                        </a>
                      ) : (
                        <div className="mt-10 inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-gray-400">
                          {partner.buttonLabel || "Ecosysteme Interne"}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Group Gasconcept Section */}
        <section className="px-4 md:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a] p-8 md:p-12 lg:p-16"
            >
              <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-white/5 blur-[100px]" />
              
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E50914]">
                    Groupe Gasconcept
                  </p>
                  <h2 className="mt-4 text-3xl font-black md:text-5xl max-w-2xl">
                    Un reseau de marques en synergie constante
                  </h2>
                </div>
                <div className="inline-flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold backdrop-blur-md">
                  <FaLayerGroup className="text-[#E50914]" size={18} />
                  <span>{groupCompanies.length} Entites</span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {groupCompanies.map((company, index) => (
                  <motion.a
                    key={company.label}
                    href={company.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group flex flex-col sm:flex-row items-center gap-6 rounded-[24px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.06] hover:border-white/15"
                  >
                    <div className="flex h-24 w-full sm:w-32 shrink-0 items-center justify-center rounded-2xl bg-white p-4 transition-transform duration-500 group-hover:scale-105">
                      <img
                        src={company.image}
                        alt={company.label}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#E50914] transition-colors">
                          {company.label}
                        </h3>
                        <FaExternalLinkAlt size={12} className="hidden sm:block text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {company.description}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="px-4 md:px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914]">
              <FaHandshake size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Une alliance pour l'avenir
            </h2>
            <p className="text-gray-400 leading-relaxed font-light">
              Gascom considere chaque partenaire comme un pilier fondamental de son developpement. Ensemble, nous batissons l'eSport malgache de demain.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

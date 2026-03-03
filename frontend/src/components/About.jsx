/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaFire, FaShieldAlt, FaUsers } from "react-icons/fa";

const stats = [
  { value: "500+", label: "Joueurs actifs" },
  { value: "30+", label: "Tournois organisés" },
  { value: "200+", label: "Jeux disponibles" },
  { value: "3", label: "Ans d'expérience" },
];

const values = [
  {
    icon: <FaFire size={28} className="text-[#E50914]" />,
    title: "Passion",
    desc: "Nous vivons et respirons le gaming. Chaque décision est guidée par notre amour du jeu vidéo.",
  },
  {
    icon: <FaUsers size={28} className="text-[#E50914]" />,
    title: "Communauté",
    desc: "Gascom c'est avant tout une famille de joueurs unis par la même passion à Madagascar.",
  },
  {
    icon: <FaShieldAlt size={28} className="text-[#E50914]" />,
    title: "Intégrité",
    desc: "Des tournois équitables, des prix transparents et un service honnête — toujours.",
  },
  {
    icon: <FaRocket size={28} className="text-[#E50914]" />,
    title: "Excellence",
    desc: "Nous visons le meilleur : les meilleurs jeux, les meilleures compétitions, la meilleure expérience.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-transparent text-white py-16 md:py-28 overflow-hidden"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(229,9,20,0.12)_0%,transparent_60%)] blur-3xl z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#E50914]/30 to-transparent z-0" />

      {/* ── TITRE ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 mb-14 md:mb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#E50914] text-sm font-bold tracking-[0.3em] uppercase mb-3"
        >
          Qui sommes-nous
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          L'esport malgache,{" "}
          <span className="text-[#E50914] drop-shadow-[0_0_20px_rgba(229,9,20,0.7)]">
            réinventé
          </span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-4 h-[2px] w-20 bg-gradient-to-r from-transparent via-[#E50914] to-transparent"
        />
      </div>

      {/* ── HISTOIRE + IMAGE ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
        {/* Visuel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Card décorative */}
          <div className="relative w-full max-w-md">
            {/* Glow derrière */}
            <div className="absolute -inset-2 rounded-2xl bg-[#E50914]/20 blur-2xl" />
            <div className="relative bg-[#1A1A1A]/70 border border-[#E50914]/30 rounded-2xl p-8 md:p-10 backdrop-blur-md">
              <div className="text-7xl md:text-8xl mb-6 text-center">🏆</div>
              <p className="text-center text-gray-300 text-sm md:text-base leading-relaxed italic">
                "Nous croyons que chaque joueur malgache mérite une plateforme à
                la hauteur de son talent."
              </p>
              <p className="text-center text-[#E50914] font-bold mt-4 text-sm tracking-wide">
                — L'équipe Gascom
              </p>

              {/* Stats mini */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="text-center bg-black/40 rounded-xl py-3 px-2 border border-white/5"
                  >
                    <p className="text-2xl font-extrabold text-[#E50914]">
                      {s.value}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-5 md:mb-6">
            Notre histoire
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
            Fondée à{" "}
            <span className="text-white font-semibold">Antananarivo</span>,
            Gascom est née d'un constat simple : la scène gaming malgache
            regorge de talents qui manquent d'une plateforme sérieuse pour
            s'exprimer.
          </p>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
            Depuis nos débuts, nous avons organisé des{" "}
            <span className="text-[#FF1E56] font-semibold">
              tournois compétitifs
            </span>
            , mis en place une{" "}
            <span className="text-[#FF1E56] font-semibold">
              boutique de jeux
            </span>{" "}
            et bâti une communauté soudée autour d'une même passion.
          </p>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Notre ambition ? Faire de Madagascar un acteur reconnu de la scène
            esport africaine et internationale.
          </p>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block mt-8 px-7 py-3 bg-[#E50914] hover:bg-[#ff1a28] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] transition-all duration-300 text-sm md:text-base"
          >
            Rejoindre la communauté →
          </motion.a>
        </motion.div>
      </div>

      {/* ── NOS VALEURS ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-12 text-gray-200"
        >
          Ce qui nous définit
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="bg-[#1A1A1A]/60 border border-red-900/30 hover:border-[#E50914]/70 rounded-2xl p-6 text-center backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] transition-all duration-400 cursor-default"
            >
              <div className="flex justify-center mb-4 p-3 bg-[#E50914]/10 rounded-full w-14 h-14 items-center mx-auto">
                {v.icon}
              </div>
              <h4 className="text-lg font-bold mb-2">{v.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

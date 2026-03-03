/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaGamepad, FaTrophy, FaUsers } from "react-icons/fa";

export default function Intro() {
  const services = [
    {
      icon: <FaGamepad size={40} className="text-[#E50914]" />,
      title: "Vente de Jeux",
      desc: "Découvrez les meilleurs titres aux meilleurs prix, adaptés à tous les gamers.",
    },
    {
      icon: <FaTrophy size={40} className="text-[#E50914]" />,
      title: "Tournois esports",
      desc: "Participez à des compétitions intenses avec des récompenses prestigieuses.",
    },
    {
      icon: <FaUsers size={40} className="text-[#E50914]" />,
      title: "Communauté",
      desc: "Rejoignez une communauté passionnée et grandissante de joueurs à Madagascar.",
    },
  ];

  return (
    <section
      id="intro"
      className="relative bg-transparent text-white py-16 md:py-24 overflow-hidden"
    >
      {/* Fond lumineux */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.15)_0%,transparent_60%)] blur-2xl animate-pulse z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/50 to-[#0D0D0D]/30 opacity-90 z-0"></div>

      {/* Hero principal */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Bienvenue chez{" "}
            <span className="text-[#E50914] drop-shadow-[0_0_25px_rgba(229,9,20,0.8)]">
              Gascom
            </span>
          </h1>
          <p className="mt-4 md:mt-6 text-gray-300 text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
            Nous connectons les passionnés de jeux vidéo à travers des{" "}
            <span className="text-[#FF1E56] font-semibold">
              tournois épiques
            </span>
            , des{" "}
            <span className="text-[#FF1E56] font-semibold">
              événements communautaires
            </span>{" "}
            et les meilleurs titres gaming à Madagascar.
          </p>
          <motion.div
            className="mt-6 md:mt-8 flex justify-center md:justify-start items-center gap-3 text-gray-400 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <FaMapMarkerAlt className="text-red-600 text-lg md:text-xl" />
            <span>Antananarivo, Madagascar</span>
          </motion.div>
        </motion.div>

        {/* Zone visuelle */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] bg-gradient-to-br from-[#E50914]/20 to-transparent rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-sm md:text-base px-4">
                Votre plateforme gaming
                <br />
                <span className="text-xs md:text-sm text-gray-500">
                  à Madagascar
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services */}
      <div className="relative z-20 mt-12 md:mt-20 max-w-6xl mx-auto px-4 md:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-[#1A1A1A]/50 p-6 md:p-8 rounded-2xl text-center border border-red-800/40 hover:border-[#E50914]/80 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] backdrop-blur-md transition-all duration-500"
            style={{ cursor: "pointer" }}
          >
            <div className="mb-4 md:mb-5 flex justify-center">{s.icon}</div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">
              {s.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

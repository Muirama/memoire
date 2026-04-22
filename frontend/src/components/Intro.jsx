/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaShoppingCart,
  FaTrophy,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import HeroCarousel from "./ui/HeroCarousel";

const services = [
  {
    icon: <FaShoppingCart size={40} className="text-[#E50914]" />,
    title: "Vente de Matériel Gaming",
    desc: "Découvrez les meilleurs metériels et le meilleurs titres aux meilleurs prix, adaptés à tous les gamers.",
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

export default function Intro() {
  return (
    <section
      id="intro"
      className="relative text-white py-16 md:py-24 overflow-hidden"
    >
      {/* ── Hero principal ── */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 md:px-6
                      grid md:grid-cols-2 gap-10 md:gap-16 items-center"
      >
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          {/* Badge localisation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-[#E50914]/10 border
                       border-[#E50914]/25 rounded-full px-4 py-1.5 mb-5"
          >
            <FaMapMarkerAlt className="text-[#E50914]" size={11} />
            <span className="text-[#E50914] text-xs font-bold tracking-widest uppercase">
              Antananarivo, Madagascar
            </span>
          </motion.div>

          {/* Titre — blanc sur fond sombre, gris foncé sur fond clair */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                         font-extrabold leading-tight
                         text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
          >
            Bienvenue chez{" "}
            <span
              className="text-[#E50914]
                             drop-shadow-[0_0_25px_rgba(229,9,20,0.8)]"
            >
              Gascom Esports
            </span>
          </h1>

          <p
            className="mt-5 text-gray-200 text-base md:text-lg max-w-lg
                        mx-auto md:mx-0 leading-relaxed
                        [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
          >
            Nous connectons les passionnés de jeux vidéo à travers des{" "}
            <span className="text-[#FF4D6A] font-semibold">
              tournois épiques
            </span>
            , des{" "}
            <span className="text-[#FF4D6A] font-semibold">
              événements communautaires
            </span>{" "}
            et les meilleurs titres gaming à Madagascar.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914]
                         hover:bg-[#FF1E56] text-white font-bold rounded-xl
                         transition-all hover:shadow-[0_0_20px_rgba(229,9,20,0.5)]
                         text-sm group"
            >
              Voir les tournois
              <FaArrowRight
                size={11}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3
                         border border-white/30 hover:border-white/60
                         text-white font-bold rounded-xl transition-all
                         backdrop-blur-sm hover:bg-white/10 text-sm"
            >
              Boutique
            </a>
          </motion.div>
        </motion.div>

        {/* Carrousel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          {/* Glow derrière le carousel */}
          <div
            className="absolute -inset-4 bg-[#E50914]/10 rounded-3xl
                          blur-2xl pointer-events-none"
          />
          <div className="relative z-10">
            <HeroCarousel />
          </div>
        </motion.div>
      </div>

      {/* ── Services ── */}
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

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
      className="relative text-white py-12 md:py-24 overflow-hidden"
    >
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 
                      grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        {/* Texte : On réduit les paddings et on centre sur mobile uniquement */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          {/* Badge localisation : Plus compact sur mobile */}
          <motion.div className="inline-flex items-center gap-2 bg-[#E50914]/10 border border-[#E50914]/25 rounded-full px-3 py-1 mb-4">
            <FaMapMarkerAlt className="text-[#E50914]" size={10} />
            <span className="text-[#E50914] text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Antananarivo, Madagascar
            </span>
          </motion.div>

          {/* Titre : Taille de police adaptative (clamp) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white">
            Bienvenue chez{" "}
            <span className="text-[#E50914] block sm:inline drop-shadow-[0_0_20px_rgba(229,9,20,0.6)]">
              Gascom Esports
            </span>
          </h1>

          <p className="mt-6 text-gray-300 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Nous connectons les passionnés de jeux vidéo à travers des{" "}
            <span className="text-[#FF4D6A] font-semibold">
              tournois épiques
            </span>{" "}
            et les meilleurs titres à Madagascar.
          </p>

          {/* Boutons : Full width sur très petit mobile */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/events"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-8 py-4 bg-[#E50914] hover:bg-[#FF1E56] text-white font-bold rounded-xl transition-all text-sm group shadow-lg shadow-red-900/20"
            >
              Voir les tournois
              <FaArrowRight
                size={11}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="/shop"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm backdrop-blur-sm"
            >
              Boutique
            </a>
          </div>
        </motion.div>

        {/* Carrousel : Priorité visuelle sur mobile (order-1) */}
        <motion.div className="relative order-1 lg:order-2 w-full max-w-[500px] lg:max-w-none mx-auto">
          <div className="absolute -inset-6 bg-[#E50914]/15 rounded-full blur-[80px] pointer-events-none" />
          <HeroCarousel />
        </motion.div>
      </div>

      {/* Services : Grille adaptative */}
      <div className="relative z-20 mt-20 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="bg-[#1A1A1A]/40 p-8 rounded-2xl border border-white/5 hover:border-[#E50914]/50 backdrop-blur-xl transition-all duration-500"
          >
            <div className="mb-6 inline-block p-4 bg-red-950/20 rounded-xl">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

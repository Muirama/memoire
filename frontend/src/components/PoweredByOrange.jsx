/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaBolt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStar,
  FaUsers,
  FaWifi,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const premiumPillars = [
  {
    icon: FaWifi,
    title: "Réseau & connectivité",
    desc: "Un partenaire télécom reconnu pour connecter les joueurs, les fans et les expériences digitales au quotidien.",
  },
  {
    icon: FaBolt,
    title: "Innovation numérique",
    desc: "Orange Madagascar met en avant une vision tournée vers l'inclusion numérique, l'innovation et les infrastructures.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Services du quotidien",
    desc: "Mobile, internet à la maison et Orange Money font partie des services majeurs mis en avant.",
  },
];

const infoCards = [
  {
    icon: FaUsers,
    label: "Promesse",
    value: "Orange eo anilanao, une signature orientée proximité et confiance.",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Adresse",
    value: "La Tour Redland, Ankorondrano, 101 Antananarivo, Madagascar",
  },
  {
    icon: FaEnvelope,
    label: "Contact",
    value: "contact.oma@orange.com",
  },
];

export default function PoweredByOrange() {
  return (
    <section
      id="powered-by-orange"
      className="relative py-16 md:py-24 overflow-hidden bg-[#050505]"
    >
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff7900]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ff7900]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="relative overflow-hidden rounded-[40px] border border-white/5 bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-black px-6 py-10 md:px-12 md:py-16 shadow-2xl"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80%" }}
            viewport={{ once: false }} // Répétition pour la ligne lumineuse
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-x-0 top-0 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#ff7900] to-transparent"
          />

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              // Changement ici pour le déclenchement en cascade à chaque passage
              viewport={{ once: false, amount: 0.2 }}
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 rounded-full border border-[#ff7900]/30 bg-[#ff7900]/5 px-4 py-2 text-[#ff7900]"
              >
                <FaStar className="animate-pulse text-sm" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Premium Sponsor
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="mt-6 text-4xl font-black leading-[1.1] text-white md:text-5xl"
              >
                Orange Madagascar, <br />
                <span className="text-[#ff7900]">partenaire premium</span> de
                l'esport
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400"
              >
                Présent à Madagascar depuis plus de 20 ans, Orange porte une
                promesse de proximité avec
                <span className="text-white font-medium">
                  {" "}
                  "Orange eo anilanao"
                </span>
                . Un réseau performant au service de l'ambition numérique.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-3"
              >
                {["Telecom", "Orange Money", "Inclusion numérique"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#ffb26b] transition-colors hover:border-[#ff7900]/50"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </motion.div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {premiumPillars.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      whileHover={{
                        y: -5,
                        borderColor: "rgba(255, 121, 0, 0.4)",
                      }}
                      className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900] transition-colors group-hover:bg-[#ff7900] group-hover:text-black">
                        <Icon className="text-lg" />
                      </div>
                      <h3 className="mt-4 text-sm font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500 group-hover:text-gray-300 transition-colors">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap gap-4"
              >
                <motion.a
                  href="https://www.orange.mg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(255,121,0,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 rounded-xl bg-[#ff7900] px-8 py-4 text-sm font-black text-black transition-all"
                >
                  <FaGlobe className="text-lg" />
                  VISITER ORANGE.MG
                </motion.a>
                <a
                  href="https://actu.orange.mg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-[#ff7900]/50"
                >
                  <FaGlobe />
                  ORANGE ACTUALITÉS
                </a>
              </motion.div>
            </motion.div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="absolute inset-0 bg-[#ff7900]/20 blur-[60px] opacity-50" />
                <div className="relative rounded-[35px] border border-white/10 bg-black/40 p-2 backdrop-blur-sm">
                  <div className="overflow-hidden rounded-[28px] bg-gradient-to-b from-[#ff7900]/10 to-transparent p-8">
                    <img
                      src="/Powered.png"
                      alt="Orange Madagascar"
                      className="mx-auto w-full max-w-[300px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }} // Répétition activée
                className="mt-8 space-y-3"
              >
                {infoCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      whileHover={{
                        x: 10,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff7900]/10 text-[#ff7900]">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7900]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-300">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

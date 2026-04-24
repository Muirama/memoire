/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaGem,
  FaGlobe,
  FaMapMarkerAlt,
  FaMedal,
  FaRegClock,
  FaShieldAlt,
} from "react-icons/fa";

// Variantes pour l'apparition en cascade
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

const supportPillars = [
  {
    icon: FaGem,
    title: "Soin premium",
    desc: "Une approche haut de gamme pensée pour sublimer la beauté naturelle.",
  },
  {
    icon: FaShieldAlt,
    title: "Cadre rassurant",
    desc: "Des soins innovants avec une promesse de sécurité et d'accompagnement.",
  },
];

const contactCards = [
  {
    icon: FaMapMarkerAlt,
    label: "Adresse",
    value: "Lot II 55 J Mahakaka, Ambatobe - Tananarivo",
  },
  {
    icon: FaRegClock,
    label: "Ouverture",
    value: "Du lundi au dimanche, de 9h à 20h",
  },
  {
    icon: FaEnvelope,
    label: "Contact",
    value: "contact@centre-loaline.com",
  },
];

export default function BronzeSponsorLoaline() {
  return (
    <section
      id="bronze-sponsor-loaline"
      className="relative py-16 md:py-24 overflow-hidden bg-[#050505]"
    >
      {/* Lueurs d'arrière-plan couleur Bronze */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#B6A070]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#B6A070]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[40px] border border-white/5 bg-gradient-to-br from-[#12100e] via-[#0a0a0a] to-black px-6 py-10 md:px-12 md:py-16 shadow-2xl"
        >
          {/* Ligne décorative Bronze en haut */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-x-0 top-0 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#B6A070] to-transparent"
          />

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* GAUCHE : Contenu Textuel */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 rounded-full border border-[#B6A070]/30 bg-[#B6A070]/5 px-4 py-2 text-[#D9C28F]"
              >
                <FaMedal className="animate-pulse text-sm" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Bronze Sponsor
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="mt-6 text-4xl font-black leading-[1.1] text-white md:text-5xl"
              >
                Centre Loaline, <br />
                <span className="text-[#B6A070]">
                  l'excellence esthétique
                </span>{" "}
                à Madagascar
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400"
              >
                Premier centre de médecine esthétique à Madagascar, Loaline
                accompagne une vision
                <span className="text-white font-medium">
                  {" "}
                  premium du bien-être
                </span>{" "}
                avec des soins innovants et personnalisés dans un cadre élégant.
              </motion.p>

              {/* Tags de spécialités */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-3"
              >
                {["Médecine esthétique", "Bien-être", "Expertise Ambatobe"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B6A070] transition-colors hover:border-[#B6A070]/50"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </motion.div>

              {/* Grille des Piliers */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {supportPillars.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      whileHover={{
                        y: -5,
                        borderColor: "rgba(182, 160, 112, 0.4)",
                      }}
                      className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B6A070]/10 text-[#B6A070] transition-colors group-hover:bg-[#B6A070] group-hover:text-[#16110C]">
                        <Icon className="text-lg" />
                      </div>
                      <h3 className="mt-4 text-sm font-bold text-white uppercase tracking-wider">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500 group-hover:text-gray-300 transition-colors">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Actions */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap gap-4"
              >
                <motion.a
                  href="https://loaline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(182,160,112,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 rounded-xl bg-[#B6A070] px-8 py-4 text-sm font-black text-[#16110C] transition-all"
                >
                  <FaGlobe className="text-lg" />
                  VISITER LOALINE.COM
                </motion.a>

                <a
                  href="mailto:contact@centre-loaline.com"
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-[#B6A070]/50"
                >
                  <FaEnvelope />
                  CONTACTER LE SPONSOR
                </a>
              </motion.div>
            </motion.div>

            {/* DROITE : Image et Contact Cards */}
            <div className="relative">
              {/* Animation de flottement Image */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="absolute inset-0 bg-[#B6A070]/20 blur-[60px] opacity-40" />
                <div className="relative rounded-[35px] border border-white/10 bg-black/40 p-2 backdrop-blur-sm">
                  <div className="overflow-hidden rounded-[28px] bg-gradient-to-b from-[#B6A070]/10 to-transparent p-8 text-center">
                    <img
                      src="/loaline-bronze.png"
                      alt="Centre Loaline"
                      className="mx-auto w-full max-w-[260px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Contact Cards décalées */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 space-y-3"
              >
                {contactCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      whileHover={{
                        x: 10,
                        backgroundColor: "rgba(182, 160, 112, 0.05)",
                      }}
                      className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B6A070]/10 text-[#D9C28F]">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B6A070]">
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

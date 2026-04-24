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

const supportPillars = [
  {
    icon: FaGem,
    title: "Soin premium",
    desc: "Une approche haut de gamme pensee pour sublimer la beaute naturelle.",
  },
  {
    icon: FaShieldAlt,
    title: "Cadre rassurant",
    desc: "Des soins innovants avec une promesse de securite et d'accompagnement.",
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
    value: "Du lundi au dimanche, de 9h a 20h",
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
      className="relative py-14 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(182,160,112,0.14)_0%,transparent_68%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[30px] border border-[#B6A070]/22 bg-[linear-gradient(135deg,rgba(182,160,112,0.13),rgba(17,11,8,0.92)_38%,rgba(10,10,10,0.96))] px-6 py-7 md:px-10 md:py-10 backdrop-blur-md shadow-[0_0_30px_rgba(182,160,112,0.12)]"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#B6A070] to-transparent opacity-70" />
          <div className="absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-[#B6A070]/60 to-transparent opacity-45 hidden md:block" />

          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#B6A070]/30 bg-[#B6A070]/10 px-4 py-2 text-[#D9C28F]">
                <FaMedal className="text-sm" />
                <span className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase">
                  Bronze Sponsor
                </span>
              </div>

              <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Centre Loaline, un soutien bronze a l'image d'une marque
                d'exception
              </h2>

              <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-300 leading-relaxed">
                Premier centre de medecine esthetique a Madagascar, Loaline
                accompagne une vision premium du bien-etre avec des soins
                innovants, surs et personnalises dans un cadre elegant a
                Ambatobe.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C28F]">
                  Medecine esthetique
                </span>
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C28F]">
                  Ambatobe
                </span>
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C28F]">
                  7j / 7
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {supportPillars.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/8 bg-black/25 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B6A070]/12 text-[#D9C28F]">
                          <Icon className="text-sm" />
                        </div>
                        <p className="text-white font-semibold">{item.title}</p>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <motion.a
                  href="https://loaline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B6A070] px-5 py-3 text-sm font-bold text-[#16110C] shadow-[0_0_24px_rgba(182,160,112,0.28)] transition-all hover:bg-[#c8b382]"
                >
                  <FaGlobe />
                  Visiter loaline.com
                </motion.a>

                <a
                  href="mailto:contact@centre-loaline.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#B6A070]/35 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[#B6A070]/65 hover:bg-[#B6A070]/10"
                >
                  <FaEnvelope />
                  Contacter le sponsor
                </a>
              </div>
            </div>

            <div className="relative">
              <motion.a
                href="https://loaline.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.99 }}
                className="group block"
                aria-label="Visiter le site de Centre Loaline"
              >
                <div className="absolute inset-0 rounded-[30px] bg-[#B6A070]/18 blur-3xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-[28px] border border-[#B6A070]/25 bg-[#090909]/88 p-6 md:p-7 shadow-[0_0_35px_rgba(182,160,112,0.16)]">
                  <div className="rounded-[24px] border border-[#B6A070]/12 bg-[linear-gradient(180deg,rgba(182,160,112,0.08),rgba(255,255,255,0.01))] px-5 py-8">
                    <img
                      src="/loaline-bronze.png"
                      alt="Centre Loaline"
                      className="mx-auto w-full max-w-[290px] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  <p className="mt-5 text-center text-sm leading-relaxed text-gray-300">
                    Une adresse reconnue a Madagascar pour une experience
                    esthetique sur mesure, elegante et attentive.
                  </p>
                </div>
              </motion.a>

              <div className="mt-5 grid gap-3">
                {contactCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/8 bg-black/28 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B6A070]/12 text-[#D9C28F]">
                          <Icon className="text-sm" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D9C28F]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-300">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

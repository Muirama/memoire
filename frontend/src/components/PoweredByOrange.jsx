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

const premiumPillars = [
  {
    icon: FaWifi,
    title: "Reseau & connectivite",
    desc: "Un partenaire telecom reconnu pour connecter les joueurs, les fans et les experiences digitales au quotidien.",
  },
  {
    icon: FaBolt,
    title: "Innovation numerique",
    desc: "Orange Madagascar met en avant une vision tournee vers l'inclusion numerique, l'innovation et les infrastructures.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Services du quotidien",
    desc: "Mobile, internet a la maison et Orange Money font partie des services majeurs mis en avant sur sa plateforme.",
  },
];

const infoCards = [
  {
    icon: FaUsers,
    label: "Promesse",
    value:
      "Orange eo anilanao, une signature orientee proximite, confiance et accompagnement.",
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
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,121,0,0.15)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[30px] border border-[#ff7900]/24 bg-[linear-gradient(135deg,rgba(255,121,0,0.16),rgba(20,10,0,0.92)_38%,rgba(8,8,8,0.97))] px-6 py-8 md:px-10 md:py-10 backdrop-blur-md shadow-[0_0_38px_rgba(255,121,0,0.16)]"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7900] to-transparent opacity-75" />
          <div className="absolute inset-y-10 right-0 hidden w-px bg-gradient-to-b from-transparent via-[#ff7900]/70 to-transparent opacity-45 md:block" />

          <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#ff7900]/30 bg-[#ff7900]/10 px-4 py-2 text-[#ffb26b]">
                <FaStar className="text-sm" />
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] md:text-xs">
                  Premium Sponsor
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Orange Madagascar, le partenaire premium d'une scene esport plus
                connectee
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
                Present a Madagascar depuis plus de 20 ans selon sa
                communication officielle, Orange Madagascar porte une promesse
                de proximite avec "Orange eo anilanao" et met en avant un reseau
                performant, des services utiles au quotidien et une ambition
                forte autour de l'innovation numerique.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#ff7900]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb26b]">
                  Telecom
                </span>
                <span className="rounded-full border border-[#ff7900]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb26b]">
                  Orange Money
                </span>
                <span className="rounded-full border border-[#ff7900]/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb26b]">
                  Inclusion numerique
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {premiumPillars.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/8 bg-black/25 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7900]/12 text-[#ffb26b]">
                          <Icon className="text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>
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
                  href="https://www.orange.mg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff7900] px-5 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(255,121,0,0.3)] transition-all hover:bg-[#ff8c1f]"
                >
                  <FaGlobe />
                  Visiter orange.mg
                </motion.a>

                <a
                  href="https://actu.orange.mg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#ff7900]/35 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all hover:border-[#ff7900]/70 hover:bg-[#ff7900]/10"
                >
                  <FaGlobe />
                  Voir Orange actualites
                </a>
              </div>
            </div>

            <div className="relative">
              <motion.a
                href="https://www.orange.mg/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.99 }}
                className="group block"
                aria-label="Visiter le site Orange Madagascar"
              >
                <div className="absolute inset-0 rounded-[30px] bg-[#ff7900]/22 blur-3xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-[28px] border border-[#ff7900]/25 bg-black/85 p-6 md:p-7 shadow-[0_0_35px_rgba(255,121,0,0.18)]">
                  <div className="rounded-[24px] border border-[#ff7900]/14 bg-[linear-gradient(180deg,rgba(255,121,0,0.1),rgba(255,255,255,0.01))] px-5 py-8">
                    <img
                      src="/Powered.png"
                      alt="Orange Madagascar"
                      className="mx-auto w-full max-w-[320px] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  <p className="mt-5 text-center text-sm leading-relaxed text-gray-300">
                    Un acteur majeur du numerique a Madagascar, entre reseau,
                    services utiles et engagement de proximite.
                  </p>
                </div>
              </motion.a>

              <div className="mt-5 grid gap-3">
                {infoCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/8 bg-black/28 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7900]/12 text-[#ffb26b]">
                          <Icon className="text-sm" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffb26b]">
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

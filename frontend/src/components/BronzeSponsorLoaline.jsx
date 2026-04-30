/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaGlobe, FaMedal } from "react-icons/fa";

export default function BronzeSponsorLoaline() {
  return (
    <section
      id="bronze-sponsor-loaline"
      className="relative overflow-hidden py-8 md:py-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(182,160,112,0.14)_0%,transparent_68%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[24px] border border-[#B6A070]/22 bg-[linear-gradient(135deg,rgba(182,160,112,0.13),rgba(17,11,8,0.92)_38%,rgba(10,10,10,0.96))] px-5 py-6 md:px-7 md:py-7 backdrop-blur-md shadow-[0_0_24px_rgba(182,160,112,0.12)]"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#B6A070] to-transparent opacity-70" />

          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto] md:gap-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B6A070]/30 bg-[#B6A070]/10 px-3 py-1.5 text-[#D9C28F]">
                <FaMedal className="text-xs" />
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                  Bronze Sponsor
                </span>
              </div>

              <h2 className="mt-3 text-xl md:text-2xl font-bold text-white leading-tight">
                Centre Loaline
              </h2>

              <p className="mt-2 max-w-xl text-xs md:text-sm text-gray-300 leading-relaxed">
                Premier centre de medecine esthetique a Madagascar, avec une
                approche premium du bien-etre.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D9C28F]">
                  Ambatobe
                </span>
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D9C28F]">
                  7j / 7
                </span>
                <span className="rounded-full border border-[#B6A070]/25 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D9C28F]">
                  9h - 20h
                </span>
              </div>

              <motion.a
                href="https://loaline.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#B6A070] px-4 py-2 text-xs font-bold text-[#16110C] shadow-[0_0_18px_rgba(182,160,112,0.28)] transition-all hover:bg-[#c8b382]"
              >
                <FaGlobe />
                Visiter loaline.com
              </motion.a>

              <p className="mt-2 text-[11px] text-gray-400">
                Contact rapide : contact@centre-loaline.com
              </p>
            </div>

            <motion.a
              href="https://loaline.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className="group mx-auto block w-full max-w-[250px] md:max-w-[280px]"
              aria-label="Visiter le site de Centre Loaline"
            >
              <div className="rounded-[18px] border border-[#B6A070]/20 bg-[#090909]/88 p-4">
                <img
                  src="/loaline-bronze.png"
                  alt="Centre Loaline"
                  className="mx-auto w-full object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

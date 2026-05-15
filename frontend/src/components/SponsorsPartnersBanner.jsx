/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { allPartnerLogos } from "../data/organizationData";

export default function SponsorsPartnersBanner() {
  // Repetition volontaire pour garantir une "file indienne" continue.
  const repeatedLogos = Array.from({ length: 8 }, () => allPartnerLogos).flat();

  return (
    <section
      id="partners"
      className="relative z-10 bg-white scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-9">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-black/60">
            Sponsors & Partenaires
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-black md:text-2xl">
            Ils nous accompagnent
          </h2>
        </motion.div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
          <div className="spb-marquee relative overflow-hidden rounded-2xl px-3 py-4 md:px-5 md:py-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:w-16" />

            <div className="spb-track">
              {[0, 1].map((segment) => (
                <div key={segment} className="spb-segment">
                  {repeatedLogos.map((item, idx) => (
                    <a
                      key={`${segment}-${item.label}-${item.group}-${idx}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center rounded-xl px-3 py-2 transition-colors hover:bg-black/5"
                      aria-label={`Visiter ${item.label} (${item.group})`}
                      title={`${item.group} • ${item.label}`}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        className={`${item.className} transition-transform duration-300 group-hover:scale-[1.03]`}
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

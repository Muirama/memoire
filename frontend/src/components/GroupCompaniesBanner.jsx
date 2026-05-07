/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const groupLogo = {
  label: "Groupe Gasconcept",
  image: "/Logo Groupe/GASCONCEPT.png",
};

const groupCompanies = [
  {
    href: "https://www.facebook.com/GascomEsport",
    label: "Gascom Esports",
    image: "/LOGO/Logo_GES_noir.svg",
    className: "groupb-logo groupb-logo--ges",
  },
  {
    href: "https://www.facebook.com/Coolconceptevents",
    label: "Coolconcept Events",
    image: "/Logo Groupe/COOLCONCEPT EVENTS.png",
    className: "groupb-logo groupb-logo--coolconcept",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61555458792559",
    label: "Graphicom",
    image: "/Logo Groupe/GRAPHICOM.png",
    className: "groupb-logo groupb-logo--graphicom",
  },
  {
    href: "https://www.facebook.com/OdysseyFitness261",
    label: "Odyssey Fitness",
    image: "/Logo Groupe/ODYSSEY FITNESS.png",
    className: "groupb-logo groupb-logo--odyssey",
  },
  
];

const repeatedCompanies = Array.from({ length: 4 }, () => groupCompanies).flat();

export default function GroupCompaniesBanner() {
  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <div className="grid gap-6 border-b border-black/8 px-5 py-6 md:grid-cols-[minmax(0,1.15fr)_auto] md:items-center md:px-7 md:py-7">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-black/55">
                Groupe Gasconcept
              </p>
              <h2 className="mt-2 text-xl font-extrabold leading-tight text-black md:text-2xl">
                Gascom eSports fait partie du groupe Gasconcept.
              </h2>
            </div>

            <a
              href={groupLogo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto flex w-full max-w-[220px] items-center justify-center rounded-[1.4rem] border border-black/8 bg-black/[0.02] px-5 py-4 transition-colors hover:bg-black/[0.04] md:mx-0"
              aria-label={`Visiter ${groupLogo.label}`}
            >
              <img
                src={groupLogo.image}
                alt={groupLogo.label}
                className="h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </a>
          </div>

          <div className="groupb-marquee relative overflow-hidden px-3 py-4 md:px-5 md:py-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent md:w-16" />

            <div className="groupb-track">
              {[0, 1].map((segment) => (
                <div key={segment} className="groupb-segment">
                  {repeatedCompanies.map((company, index) => (
                    <a
                      key={`${segment}-${company.label}-${index}`}
                      href={company.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-[92px] min-w-[168px] items-center justify-center rounded-[1.2rem] border border-black/7 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] md:min-w-[190px]"
                      aria-label={`Visiter ${company.label}`}
                      title={company.label}
                    >
                      <img
                        src={company.image}
                        alt={company.label}
                        className={`${company.className} transition-transform duration-300 group-hover:scale-[1.03]`}
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

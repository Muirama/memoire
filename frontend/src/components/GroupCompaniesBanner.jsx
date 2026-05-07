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
    className: "h-10 w-auto object-contain",
  },
  {
    href: "https://www.facebook.com/Coolconceptevents",
    label: "Coolconcept Events",
    image: "/Logo Groupe/COOLCONCEPT EVENTS.png",
    className: "h-9 w-auto object-contain",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61555458792559",
    label: "Graphicom",
    image: "/Logo Groupe/GRAPHICOM.png",
    className: "h-9 w-auto object-contain",
  },
  {
    href: "https://www.facebook.com/OdysseyFitness261",
    label: "Odyssey Fitness",
    image: "/Logo Groupe/ODYSSEY FITNESS.png",
    className: "h-9 w-auto object-contain",
  },
];

export default function GroupCompaniesBanner() {
  const radiusX = 190;

  return (
    <section className="relative overflow-hidden bg-white py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <div className=" text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-black/45">
            Groupe Gasconcept
          </p>

          <h2 className="mt-3 text-2xl font-black text-black md:text-4xl">
            Un écosystème de marques
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-black/55">
            Gascom eSports évolue avec les entités du groupe Gasconcept.
          </p>
        </div>

        {/* ORBIT */}
        <div
          className="relative flex h-[300px] items-center justify-center"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* CENTER */}
          <motion.a
            href={groupLogo.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="relative z-50 flex h-[140px] w-[140px] items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            style={{
              transform: "translateZ(60px)",
            }}
          >
            <img
              src={groupLogo.image}
              alt={groupLogo.label}
              className="h-16 w-auto object-contain"
            />
          </motion.a>

          {/* ORBIT */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute flex h-full w-full items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {groupCompanies.map((company, index) => {
              const angle = (360 / groupCompanies.length) * index;

              const normalized = Math.abs(angle % 360);
              const isFront = normalized < 30 || normalized > 330;

              return (
                <motion.a
                  key={company.label}
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex h-[90px] w-[90px] items-center justify-center rounded-xl border border-black/10 bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                  style={{
                    transform: `
                      rotateY(${angle}deg)
                      translateZ(${radiusX}px)
                    `,
                    transformStyle: "preserve-3d",
                    zIndex: isFront ? 999 : 10,
                    backfaceVisibility: "visible",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 3 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src={company.image}
                      alt={company.label}
                      className={company.className}
                      draggable={false}
                    />
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* glow réduit */}
          <div className="absolute h-[180px] w-[180px] rounded-full bg-black/[0.03] blur-2xl" />
        </div>
      </div>
    </section>
  );
}

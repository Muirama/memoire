/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaDesktop,
  FaGamepad,
  FaHeadset,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";

const offerCards = [
  {
    icon: <FaDesktop className="text-2xl text-[#E50914]" />,
    title: "Materiel derniere generation",
    description:
      "PC, consoles, ecrans, peripheriques et connectique prepares selon le niveau de jeu, le format et le public attendu.",
  },
  {
    icon: <FaGamepad className="text-2xl text-[#E50914]" />,
    title: "Formats vraiment sur mesure",
    description:
      "Tournoi corporate, campus gaming, LAN locale, showmatch ou grande finale publique : chaque experience est adaptee a votre demande.",
  },
  {
    icon: <FaHeadset className="text-2xl text-[#E50914]" />,
    title: "Pilotage complet le jour J",
    description:
      "Animation, arbitrage, captation, diffusion, coordination terrain et accompagnement des participants peuvent etre pris en charge.",
  },
];

const projectSteps = [
  "Brief du client et definition du format ideal",
  "Conseil sur le lieu, le nombre de setups et le parcours des joueurs",
  "Installation technique, tests et mise en scene de l'espace",
  "Animation, encadrement, arbitrage et remise des prix",
];

const quickFormats = [
  {
    value: "PC / Console",
    label: "Setups calibres selon votre audience",
  },
  {
    value: "LAN / Scene",
    label: "Du showroom a la grande finale publique",
  },
  {
    value: "Solo / Equipe",
    label: "Formats competitifs ou grand public",
  },
];

const heroGallery = [
  {
    src: "/Photo Contenu/IMG_5972.JPEG",
    alt: "Public present pendant un tournoi esports Gascom",
    badge: "Ambiance",
    title: "Un public engage du premier match a la finale",
  },
  {
    src: "/Photo Contenu/IMG_8473.JPEG",
    alt: "Joueurs sur setup PC pendant un evenement Gascom",
    badge: "Competition",
    title: "Des postes performants pour une experience fluide",
  },
  {
    src: "/Photo Contenu/IMG_5592.JPEG",
    alt: "Installation streaming et arbitrage pour tournoi Gascom",
    badge: "Production",
    title: "Captation et encadrement pour un rendu professionnel",
  },
];

const visualStory = [
  {
    src: "/Photo Contenu/IMG_5040.JPEG",
    alt: "Grande scene evenementielle avec ecran geant",
    badge: "Showcase",
    title: "Des temps forts qui marquent les esprits",
    description:
      "Scenographie, grands ecrans et branding pour donner de l'ampleur aux finales et activations.",
    featured: true,
  },
  {
    src: "/Photo Contenu/IMG_3416.JPEG",
    alt: "Public dans un espace event Orange Digital Center",
    badge: "Audience",
    title: "Un flux spectateur bien orchestre",
    description:
      "Accueil, orientation et zones de circulation adaptes au volume de participants.",
  },
  {
    src: "/Photo Contenu/Abassadeur Orange.JPEG",
    alt: "Activation de marque pendant un evenement gaming",
    badge: "Activation",
    title: "Des marques visibles dans l'experience",
    description:
      "Ambassadeurs, prises de parole, branding et contenus immersifs integres au dispositif.",
  },
  {
    src: "/Photo Contenu/IMG_5888.JPEG",
    alt: "Public rassemble autour d'une competition gaming",
    badge: "Communaute",
    title: "Une communaute active sur place",
    description:
      "Des moments de rencontre, d'observation et d'engagement autour de chaque format.",
  },
  {
    src: "/Photo Contenu/IMG_2894.JPEG",
    alt: "Equipe Gascom prete pour une organisation evenementielle",
    badge: "Equipe",
    title: "Une equipe mobilisee a chaque etape",
    description:
      "Preparation, coordination et presence terrain pour garder une execution propre.",
  },
];

const trustedBy = [
  {
    name: "Orange Madagascar",
    type: "Sponsor premium",
    note: "Activation de marque, connectivite et presence forte sur nos evenements.",
    image: "/Logo Orange.png",
    imageClassName: "h-10 w-auto object-contain",
  },
  {
    name: "Centre Loaline",
    type: "Partenaire terrain",
    note: "Collaboration deja visible dans les assets et partenariats du site.",
    image: "/loaline-bronze.png",
    imageClassName:
      "h-10 w-auto object-contain [filter:brightness(0)_invert(1)]",
  },
  {
    name: "SYKI",
    type: "Partenaire creatif",
    note: "Accompagnement visuel et ecosysteme partenaire deja presentes dans le projet.",
    image: "/LOGO/Logo SYKI Blanc.png",
    imageClassName: "h-9 w-auto object-contain",
  },
  {
    name: "Orange Digital Center",
    type: "Lieu d'activation",
    note: "Un cadre adapte a des experiences gaming visibles et fluides.",
    monogram: "ODC",
  },
  {
    name: "Yoplait",
    type: "Marque evenementielle",
    note: "Presence de marque visible sur les contenus de scene et de production.",
    monogram: "YP",
  },
  {
    name: "Katara",
    type: "Collaboration scene",
    note: "Collaboration relevee sur la signaletique visible dans les contenus fournis.",
    monogram: "KT",
  },
  {
    name: "KFC Madagascar",
    type: "Partenaire de visibilite",
    note: "Presence de marque visible sur les supports d'evenements captures en photo.",
    monogram: "KFC",
  },
];

function TrustMark({ item }) {
  if (item.image) {
    return (
      <div className="flex h-16 items-center justify-start rounded-2xl border border-white/8 bg-black/35 px-4">
        <img
          src={item.image}
          alt={item.name}
          className={item.imageClassName}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 items-center justify-start rounded-2xl border border-white/8 bg-black/35 px-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E50914]/14 text-sm font-black uppercase tracking-[0.2em] text-[#FF8A8A]">
        {item.monogram}
      </div>
    </div>
  );
}

export default function EventIntroSection() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#090909]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,140,0,0.14),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
          className="min-w-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/35 bg-[#E50914]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#FF8A8A]">
            <FaTrophy className="text-[#E50914]" />
            Event service
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl xl:text-6xl">
            Confiez-nous l'organisation de vos tournois organisés{" "}
            <span className="text-[#E50914]">sur mesure</span> avec les
            meilleurs materiels dernier cri et un dispositif adapte a chaque
            client.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            Que vous visiez une competition locale ou internationale, une
            activation de marque, un tournoi inter-institut, une LAN party ou
            une finale grand public, nous construisons une experience complete :
            format, scenographie, installation, animation, arbitrage et
            accompagnement des joueurs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Tournoi corporate",
              "Campus gaming",
              "Showmatch",
              "LAN party",
              "Streaming",
              "Grande finale",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-200 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#event-catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E50914] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#FF1E56] hover:shadow-[0_0_20px_rgba(229,9,20,0.45)]"
            >
              Voir les evenements
              <FaArrowRight className="text-xs" />
            </a>
            <a
              href="#event-visuals"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              Voir plus de visuels
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {quickFormats.map((item) => (
              <div
                key={item.value}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF6B6B]">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="event-gallery"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 sm:grid-rows-[1.1fr_0.9fr]"
        >
          {heroGallery.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#111111] ${
                index === 0 ? "min-h-[360px] sm:row-span-2" : "min-h-[220px]"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute left-4 right-4 bottom-4">
                <span className="inline-flex rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  {image.badge}
                </span>
                <p className="mt-3 max-w-sm text-lg font-semibold leading-6 text-white">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-3">
          {offerCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/15">
                {card.icon}
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-[28px] border border-[#E50914]/20 bg-black/35 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914]/15">
              <FaCalendarAlt className="text-xl text-[#E50914]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FF8A8A]">
                Accompagnement
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Un projet pilote de A a Z
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-300">
            Nous adaptons le niveau de production, la configuration technique et
            le deroule selon vos objectifs, votre lieu et le profil de vos
            participants.
          </p>

          <div className="mt-5 space-y-3">
            {projectSteps.map((step) => (
              <div key={step} className="flex items-start gap-3">
                <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#E50914]" />
                <p className="text-sm leading-6 text-gray-200">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-lg text-[#E50914]" />
              <p className="text-sm font-semibold text-white">
                Pour les marques, les ecoles, les communautes et les
                organisateurs qui veulent une experience memorable.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div id="event-visuals" className="relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FF8A8A]">
              Plus de visuels
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              D'autres images pour montrer l'ampleur de nos events
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-300 md:text-base">
              Cette galerie complete illustre la scene, le public, l'activation
              de marque et la coordination terrain sur une meme page.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-gray-300 backdrop-blur-sm">
            5 visuels supplementaires integres sur la page
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {visualStory.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ y: -8, scale: 1.015 }}
              className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.22)] ${
                image.featured
                  ? "min-h-[420px] lg:col-span-7"
                  : "min-h-[260px] lg:col-span-5"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute left-4 right-4 bottom-4">
                <span className="inline-flex rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  {image.badge}
                </span>
                <h3 className="mt-3 max-w-md text-xl font-bold text-white">
                  {image.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-200">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FF8A8A]">
              Ils nous ont fait confiance
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Des marques, partenaires et lieux deja presents a nos cotes
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-300 md:text-base">
              Selection de 7 structures visibles dans vos contenus et dans les
              assets du site, pour renforcer la credibilite de cette page Event.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E50914]/20 bg-[#E50914]/8 px-5 py-4 text-sm font-semibold text-white backdrop-blur-sm">
            7 entites mises en avant
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustedBy.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.34))] p-5 backdrop-blur-sm"
            >
              <TrustMark item={item} />

              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF8A8A]">
                {item.type}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{item.name}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                {item.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

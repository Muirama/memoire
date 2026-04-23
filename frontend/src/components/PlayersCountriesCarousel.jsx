import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const countries = [
  { id: 1, name: "Madagascar", subtitle: "Ocean Indien", flag: "madagascar" },
  { id: 2, name: "Maurice", subtitle: "Ocean Indien", flag: "maurice" },
  { id: 3, name: "La Reunion", subtitle: "Ocean Indien", flag: "reunion" },
  { id: 4, name: "Afrique du Sud", subtitle: "Afrique", flag: "south-africa" },
  { id: 5, name: "Egypte", subtitle: "Afrique du Nord", flag: "egypt" },
  { id: 6, name: "France", subtitle: "Europe", flag: "france" },
];

function FlagIcon({ flag, label }) {
  switch (flag) {
    case "madagascar":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="4" height="8" fill="#FFFFFF" />
          <rect x="4" width="8" height="4" fill="#FC3D32" />
          <rect x="4" y="4" width="8" height="4" fill="#007E3A" />
        </svg>
      );
    case "maurice":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="12" height="2" fill="#EA2839" />
          <rect y="2" width="12" height="2" fill="#1A206D" />
          <rect y="4" width="12" height="2" fill="#FFD500" />
          <rect y="6" width="12" height="2" fill="#00A551" />
        </svg>
      );
    case "reunion":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="12" height="8" fill="#0047AB" />
          <polygon points="0,8 6,1.6 12,8" fill="#D50032" />
          <g stroke="#FFC72C" strokeWidth="0.34" strokeLinecap="round">
            <line x1="6" y1="8" x2="0.8" y2="2.6" />
            <line x1="6" y1="8" x2="2.5" y2="1.4" />
            <line x1="6" y1="8" x2="4.2" y2="0.8" />
            <line x1="6" y1="8" x2="6" y2="0.5" />
            <line x1="6" y1="8" x2="7.8" y2="0.8" />
            <line x1="6" y1="8" x2="9.5" y2="1.4" />
            <line x1="6" y1="8" x2="11.2" y2="2.6" />
          </g>
        </svg>
      );
    case "south-africa":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="12" height="4" fill="#DE3831" />
          <rect y="4" width="12" height="4" fill="#002395" />
          <polygon points="0,0 5,2.7 12,2.7 12,5.3 5,5.3 0,8 0,6.2 3.2,4 0,1.8" fill="#FFFFFF" />
          <polygon points="0,0.6 4.3,2.95 12,2.95 12,5.05 4.3,5.05 0,7.4 0,5.9 2.7,4 0,2.1" fill="#007A4D" />
          <polygon points="0,0 3.7,4 0,8 0,6.8 2.3,4 0,1.2" fill="#FFB612" />
          <polygon points="0,0.4 2.8,4 0,7.6" fill="#000000" />
        </svg>
      );
    case "egypt":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="12" height="2.67" fill="#CE1126" />
          <rect y="2.67" width="12" height="2.66" fill="#FFFFFF" />
          <rect y="5.33" width="12" height="2.67" fill="#000000" />
          <circle cx="6" cy="4" r="0.6" fill="#C8A400" />
        </svg>
      );
    case "france":
      return (
        <svg viewBox="0 0 12 8" aria-label={label} role="img" className="h-full w-full rounded-[14px]">
          <rect width="4" height="8" fill="#0055A4" />
          <rect x="4" width="4" height="8" fill="#FFFFFF" />
          <rect x="8" width="4" height="8" fill="#EF4135" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PlayersCountriesCarousel() {
  const swiperRef = useRef(null);

  return (
    <section
      id="players-countries"
      className="relative py-16 md:py-24 overflow-hidden"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-[#E50914] text-sm font-bold tracking-[0.32em] uppercase">
            Players Map
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Nos joueurs rayonnent au-dela des frontieres
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed">
            Une communaute connectee entre l'ocean Indien, l'Afrique et l'Europe.
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={900}
          spaceBetween={18}
          slidesPerView={1.15}
          breakpoints={{
            520: { slidesPerView: 1.8, spaceBetween: 18 },
            768: { slidesPerView: 2.6, spaceBetween: 20 },
            1024: { slidesPerView: 3.4, spaceBetween: 22 },
            1280: { slidesPerView: 4.2, spaceBetween: 24 },
          }}
          autoplay={{ delay: 2300, disableOnInteraction: false }}
          className="players-countries-swiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {countries.map((country) => (
            <SwiperSlide key={country.id} className="!h-auto">
              <div className="relative h-full rounded-[26px] border border-white/8 bg-[#121212]/92 p-5 md:p-6 overflow-hidden shadow-[0_0_24px_rgba(229,9,20,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/35 hover:shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.12)_0%,transparent_45%)] pointer-events-none" />

                <div className="relative flex items-start gap-4">
                  <div className="h-16 w-24 md:h-[72px] md:w-28 rounded-[18px] border border-white/10 overflow-hidden shadow-[0_0_18px_rgba(255,255,255,0.08)] shrink-0 bg-black/20">
                    <FlagIcon flag={country.flag} label={`Drapeau ${country.name}`} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-white text-xl font-extrabold leading-tight">
                      {country.name}
                    </p>
                    <p className="mt-1 text-[#E50914] text-xs font-bold tracking-[0.22em] uppercase">
                      {country.subtitle}
                    </p>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      La scene Gascom rassemble aussi des joueurs presents dans cette zone.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .players-countries-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        .players-countries-swiper .swiper-slide > div {
          width: 100%;
        }
      `}</style>
    </section>
  );
}

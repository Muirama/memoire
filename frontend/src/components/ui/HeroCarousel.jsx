/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { id: 1, title: "NGANJIN", tag: "CEO", image: "/Photo Menu/Nganjin.png" },
  { id: 2, title: "YONDAIME", tag: "Tekken 8", image: "/Photo Menu/Yondaime.png" },
  { id: 3, title: "KIMI", tag: "Tekken 8", image: "/Photo Menu/Kimi.png" },
  { id: 4, title: "VIDELOU", tag: "Manager PUBG", image: "/Photo Menu/Videlou.png" },
  { id: 5, title: "MANOU", tag: "EA FC", image: "/Photo Menu/Manou.png" },
  { id: 6, title: "KNIGHT", image: "/Photo Menu/Knight.png" },
  { id: 7, title: "STEELISH360", image: "/Photo Menu/Steelish360.png" },
  { id: 8, title: "SEIJURO", image: "/Photo Menu/Seijuro.png" },
];

export default function HeroCarousel() {
  const swiperRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-bullet",
          bulletActiveClass: "swiper-bullet-active",
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
        className="w-full rounded-2xl overflow-hidden hero-swiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative w-full h-[340px] sm:h-[400px] md:h-[460px]
                            overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover scale-105
                           transition-transform duration-[6000ms] ease-out
                           data-[swiper-slide-active]:scale-100"
              />

              {/* Overlay dégradé */}
              <div
                className="absolute inset-0 bg-gradient-to-t
                              from-black/80 via-black/30 to-transparent"
              />

              {/* Bordure rouge en bas */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5
                              bg-gradient-to-r from-transparent via-[#E50914] to-transparent"
              />

              {/* Contenu slide */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-10">
                <motion.div
                  key={index === activeIdx ? "active" : "idle"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  {/* Tag */}
                  <span
                    className="inline-block text-[10px] font-black tracking-[0.2em]
                                   text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30
                                   px-3 py-1 rounded-full mb-2 uppercase"
                  >
                    {item.tag}
                  </span>
                  {/* Titre */}
                  <h3
                    className="text-white font-extrabold text-2xl md:text-3xl
                                 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    {item.title}
                  </h3>
                </motion.div>
              </div>

              {/* Coin décoratif */}
              <div
                className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2
                              border-[#E50914]/60 rounded-tr-lg"
              />
              <div
                className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2
                              border-[#E50914]/60 rounded-bl-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Indicateur de slide actif custom */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideToLoop(i)}
            className={`transition-all duration-300 rounded-full
                        ${
                          i === activeIdx
                            ? "w-6 h-2 bg-[#E50914]"
                            : "w-2 h-2 bg-white/20 hover:bg-white/40"
                        }`}
          />
        ))}
      </div>

      <style>{`
        .hero-swiper .swiper-pagination { display: none; }
      `}</style>
    </div>
  );
}

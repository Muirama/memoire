/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const items = [
  { id: 1, title: "League of Legends", image: "/images/lol.jpg" },
  { id: 2, title: "Counter-Strike 2", image: "/images/CS2.jpg" },
  { id: 3, title: "Valorant", image: "/images/valorant.jpg" },
  { id: 4, title: "FIFA", image: "/images/fifa.jpg" },
  { id: 5, title: "PUBG", image: "/images/pubg.jpg" },
  { id: 6, title: "Call of Duty", image: "/images/cod.jpg" },
  { id: 7, title: "Dota 2", image: "/images/dota.jpg" },
  { id: 8, title: "Apex Legends", image: "/images/apex.jpg" },
];

export default function Carousel() {
  const swiperRef = useRef(null);

  return (
    <section
      id="jeux"
      className="relative bg-transparent py-12 md:py-20 overflow-hidden z-10"
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Texte à gauche */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]">
            Découvrez les jeux qui font vibrer la communauté
          </h2>
          <p className="mt-4 md:mt-6 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
            Plongez dans les univers les plus intenses du gaming moderne : des
            compétitions esports haletantes, des aventures immersives et des
            batailles stratégiques. <br className="hidden md:block" />
            Voici une sélection des titres incontournables qui rassemblent des
            millions de joueurs à travers le monde.
          </p>
        </motion.div>

        {/* Carrousel à droite */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            1024: { slidesPerView: 2, spaceBetween: 25 },
          }}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="w-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={800}
                  scale={1.03}
                  transitionSpeed={1000}
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  className="rounded-xl"
                >
                  <div
                    className="relative group w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-2xl overflow-hidden 
                               shadow-[0_0_20px_rgba(229,9,20,0.2)] 
                               border border-[#E50914]/20 backdrop-blur-sm
                               transform transition duration-700 
                               hover:scale-105 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)]"
                  >
                    {/* image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl 
                                 group-hover:scale-110 transition duration-700 ease-out"
                    />

                    {/* Overlay & titre */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                 opacity-90 group-hover:opacity-100 transition duration-700 flex flex-col justify-end"
                    >
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-center text-white mb-3 md:mb-4 px-2 group-hover:text-[#E50914] drop-shadow-[0_0_10px_rgba(229,9,20,0.7)] transition">
                        {item.title}
                      </h3>
                    </div>

                    {/* Effet glow subtil */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E50914]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition duration-700"></div>
                  </div>
                </Tilt>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

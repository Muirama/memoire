/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";

export default function Service({ icon, title, desc, image, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden bg-[#1A1A1A]/50 p-6 md:p-8 rounded-2xl text-center border border-red-800/40 hover:border-[#E50914]/80 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] backdrop-blur-md transition-all duration-500"
    >
      {/* IMAGE */}
      <motion.img
        src={image}
        alt={title}
        initial={{ x: "-100%", opacity: 0 }}
        animate={hovered ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* CONTENU (push + fade out) */}
      <motion.div
        animate={hovered ? { x: "120%", opacity: 0 } : { x: "0%", opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        <div className="mb-4 md:mb-5 flex justify-center">{icon}</div>

        <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">
          {title}
        </h3>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

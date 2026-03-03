/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaGamepad,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getStatusColor = (status) => {
  const colors = {
    "Inscriptions ouvertes": "bg-green-600",
    Complet: "bg-red-600",
    "Dernières places": "bg-orange-600",
    "Billets disponibles": "bg-blue-600",
    "Places disponibles": "bg-green-600",
  };
  return colors[status] || "bg-gray-600";
};

const getCategoryColor = (category) => {
  const colors = {
    Tournoi: "bg-[#E50914]",
    Communautaire: "bg-blue-600",
    Convention: "bg-purple-600",
    Événement: "bg-green-600",
  };
  return colors[category] || "bg-gray-600";
};

// ── Composant ─────────────────────────────────────────────────────────────────

/**
 * EventCard
 *
 * Props:
 * @param {object}   event            - Objet événement complet
 * @param {number}   index            - Index dans la liste (pour le délai d'animation)
 * @param {boolean}  isRegistered     - Si l'utilisateur est déjà inscrit
 * @param {function} onRegister       - Callback appelé avec (eventId) lors de l'inscription
 */
export default function EventCard({
  event,
  index = 0,
  isRegistered,
  onRegister,
}) {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/events/${event.id}`);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20
                 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)]
                 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={handleNavigate}
      >
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

        {/* Badges */}
        <span
          className={`absolute top-3 left-3 ${getCategoryColor(event.category)}
                      text-white text-xs px-3 py-1 rounded-full font-semibold`}
        >
          {event.category}
        </span>
        <span
          className={`absolute top-3 right-3 ${getStatusColor(event.status)}
                      text-white text-xs px-3 py-1 rounded-full font-semibold`}
        >
          {event.status}
        </span>

        {isRegistered && (
          <div
            className="absolute bottom-3 right-3 bg-green-600 text-white text-xs
                          px-3 py-1 rounded-full font-semibold flex items-center gap-1"
          >
            <FaCheckCircle /> Inscrit
          </div>
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="p-5">
        {/* Titre */}
        <h3
          className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2
                     cursor-pointer hover:text-[#E50914] transition"
          onClick={handleNavigate}
        >
          {event.title}
        </h3>

        {/* Infos */}
        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <FaGamepad className="text-[#E50914]" />
            <span>{event.game}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#E50914]" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-[#E50914]" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#E50914]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0D0D0D] p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-[#E50914]">
              {event.prizePool}
            </div>
            <div className="text-xs text-gray-500">Prize Pool</div>
          </div>
          <div className="bg-[#0D0D0D] p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-white">
              {event.registered}/{event.slots}
            </div>
            <div className="text-xs text-gray-500">Inscrits</div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleNavigate}
            className="flex-1 bg-[#1A1A1A] border border-[#E50914] text-white font-semibold
                       py-2 rounded-lg hover:bg-[#E50914]/10 transition-all
                       flex items-center justify-center gap-2"
          >
            <FaEye /> Détails
          </button>

          {!isRegistered && event.status !== "Complet" && (
            <button
              type="button"
              onClick={() => onRegister(event.id)}
              className="flex-1 bg-[#E50914] hover:bg-[#FF1E56] text-white font-semibold
                         py-2 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(229,9,20,0.6)]
                         active:scale-95"
            >
              S'inscrire
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

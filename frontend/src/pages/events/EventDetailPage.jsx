/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaTrophy,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaGamepad,
  FaSpinner,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/api";
import RegistrationModal from "../../components/RegistrationModal";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatPrice = (price) =>
  price ? new Intl.NumberFormat("fr-MG").format(price) + " Ar" : null;

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch {
        setError("Événement introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // ✅ Met à jour le compteur SANS fermer le modal
  // Le modal se ferme seulement quand l'utilisateur clique "Parfait, merci !"
  const handleSuccess = () => {
    setEvent((prev) => ({ ...prev, registered: (prev.registered || 0) + 1 }));
  };

  if (loading)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </section>
    );

  if (error || !event)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-6">{error || "Introuvable."}</p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg
                     flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour
          </button>
        </div>
      </section>
    );

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914]
                     transition mb-8 font-semibold group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour aux événements
        </motion.button>

        {/* Hero image */}
        {event.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-56 md:h-80 rounded-2xl overflow-hidden mb-8
                       border border-[#E50914]/20"
          >
            {!imgLoaded && (
              <div
                className="absolute inset-0 bg-[#1A1A1A] animate-pulse
                              flex items-center justify-center"
              >
                <FaCalendarAlt className="text-gray-700 text-5xl" />
              </div>
            )}
            <img
              src={event.image}
              alt={event.title}
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500
                             ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t
                            from-[#0D0D0D]/80 via-transparent to-transparent"
            />
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span
                className="bg-[#E50914] text-white text-xs px-3 py-1
                               rounded-full font-semibold shadow-lg"
              >
                {event.category}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold
                               border backdrop-blur-sm
                               ${
                                 event.registrationOpen
                                   ? "bg-green-500/20 text-green-400 border-green-500/30"
                                   : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                               }`}
              >
                {event.registrationOpen
                  ? "Inscriptions ouvertes"
                  : "Inscriptions fermées"}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1
                className="text-2xl md:text-3xl font-extrabold text-white
                             drop-shadow-lg leading-tight"
              >
                {event.title}
              </h1>
            </div>
          </motion.div>
        )}

        {!event.image && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-8"
          >
            {event.title}
          </motion.h1>
        )}

        {/* Grille */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">
            {event.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#E50914] rounded-full" />À propos
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {event.description}
                </p>
              </motion.div>
            )}

            {event.rules && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#E50914] rounded-full" />
                  Règlement
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">
                  {event.rules}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
            >
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <FaUsers className="text-[#E50914]" />
                Participants
              </h2>
              <p className="text-4xl font-extrabold text-[#E50914]">
                {event.registered || 0}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                participant(s) inscrit(s)
              </p>
            </motion.div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
            >
              <h2 className="text-white font-bold text-base mb-4">
                Infos pratiques
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <FaGamepad className="text-[#E50914] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Jeu</p>
                    <p className="text-white font-semibold">{event.game}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-[#E50914] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Date</p>
                    <p className="text-white font-semibold capitalize">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                {event.time && (
                  <div className="flex items-start gap-3">
                    <FaClock className="text-[#E50914] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Heure</p>
                      <p className="text-white font-semibold">{event.time}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-[#E50914] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Lieu</p>
                      <p className="text-white font-semibold">
                        {event.location}
                      </p>
                    </div>
                  </div>
                )}
                {formatPrice(event.prizePool) && (
                  <div className="flex items-start gap-3">
                    <FaTrophy className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Prize pool</p>
                      <p className="text-yellow-400 font-bold">
                        {formatPrice(event.prizePool)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bouton inscription */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
            >
              {event.registrationOpen ? (
                <>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    className="w-full py-4 bg-[#E50914] hover:bg-[#FF1E56] text-white
                               font-bold rounded-xl transition-all duration-300
                               hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]
                               flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    S'inscrire maintenant
                  </motion.button>
                  <p className="text-gray-500 text-xs text-center mt-3">
                    {event.registered || 0} personne(s) déjà inscrite(s)
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center
                                  justify-center mx-auto mb-3"
                  >
                    <FaLock className="text-gray-500 text-xl" />
                  </div>
                  <p className="text-gray-400 font-semibold text-sm">
                    Inscriptions fermées
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Les inscriptions ont été clôturées par l'organisateur.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal inscription */}
      <AnimatePresence>
        {showModal && (
          <RegistrationModal
            event={event}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

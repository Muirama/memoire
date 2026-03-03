/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSortAmountDown,
  FaSpinner,
  FaCalendarAlt,
  FaTrophy,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaGamepad,
  FaLock,
} from "react-icons/fa";
import api from "../../api/api";
import RegistrationModal from "../../components/RegistrationModal";

const CATEGORIES = [
  "Tous",
  "Tournoi",
  "Championnat",
  "Qualificatif",
  "Exhibition",
];
const SORT_OPTIONS = [
  { value: "date-asc", label: "Date (prochains)" },
  { value: "date-desc", label: "Date (récents)" },
  { value: "title-asc", label: "Nom (A-Z)" },
  { value: "prize-desc", label: "Prize pool" },
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatPrice = (price) =>
  price ? new Intl.NumberFormat("fr-MG").format(price) + " Ar" : null;

export default function EventPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("date-asc");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events");
        setEvents(res.data.events);
      } catch {
        setError("Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ onSuccess met à jour le compteur SANS fermer le modal
  // C'est le bouton "Parfait, merci !" dans le modal qui ferme via onClose
  const handleRegistrationSuccess = (eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registered: (e.registered || 0) + 1 } : e,
      ),
    );
  };

  const filtered = useMemo(() => {
    let list = events.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.game || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = category === "Tous" || e.category === category;
      return matchSearch && matchCat;
    });
    switch (sortBy) {
      case "date-asc":
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "prize-desc":
        list.sort((a, b) => (b.prizePool || 0) - (a.prizePool || 0));
        break;
    }
    return list;
  }, [events, searchTerm, category, sortBy]);

  if (loading)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement des événements...</p>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg transition"
          >
            Réessayer
          </button>
        </div>
      </section>
    );

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            Nos <span className="text-[#E50914]">Événements</span>
          </h1>
          <p className="text-gray-400">
            Participez aux tournois et compétitions Gascom
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            {filtered.length} événement(s)
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Rechercher un événement, un jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]
                           focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all"
              />
            </div>
            <div className="relative w-full md:w-56">
              <FaSortAmountDown
                className="absolute left-4 top-1/2 -translate-y-1/2
                                            text-gray-500 pointer-events-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg
                           border border-[#E50914]/30 focus:border-[#E50914]
                           focus:outline-none appearance-none transition-all"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                            ${
                              category === cat
                                ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105"
                                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#E50914]/20 hover:text-white"
                            }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaCalendarAlt className="text-gray-700 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-xl">Aucun événement trouvé.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filtered.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#E50914]/20
                             hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.3)]
                             transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div
                    className="relative h-44 overflow-hidden bg-[#0D0D0D] cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-700 text-5xl" />
                      </div>
                    )}
                    <span
                      className="absolute top-3 left-3 bg-[#E50914] text-white
                                     text-xs px-2 py-1 rounded-full font-semibold"
                    >
                      {event.category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-xs px-2 py-1
                                      rounded-full font-semibold border
                                      ${
                                        event.registrationOpen
                                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                      }`}
                    >
                      {event.registrationOpen
                        ? "Inscriptions ouvertes"
                        : "Fermées"}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="text-white font-bold text-lg mb-3 line-clamp-2 cursor-pointer
                                   hover:text-[#E50914] transition"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-4 flex-1 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaGamepad className="text-[#E50914] flex-shrink-0" />
                        <span>{event.game}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#E50914] flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-[#E50914] flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#E50914] flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-[#E50914] flex-shrink-0" />
                        <span>
                          {event.registered || 0} participant(s) inscrit(s)
                        </span>
                      </div>
                      {formatPrice(event.prizePool) && (
                        <div className="flex items-center gap-2">
                          <FaTrophy className="text-yellow-500 flex-shrink-0" />
                          <span className="text-yellow-400 font-bold">
                            {formatPrice(event.prizePool)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="flex-1 py-2.5 border border-[#E50914] text-white
                                   text-sm font-semibold rounded-lg
                                   hover:bg-[#E50914]/10 transition"
                      >
                        Détails
                      </button>
                      {event.registrationOpen ? (
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="flex-1 py-2.5 bg-[#E50914] hover:bg-[#FF1E56]
                                     text-white text-sm font-bold rounded-lg transition
                                     hover:shadow-[0_0_15px_rgba(229,9,20,0.6)]
                                     active:scale-95"
                        >
                          S'inscrire
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2.5 bg-gray-800 text-gray-500 text-sm
                                     font-semibold rounded-lg cursor-not-allowed
                                     flex items-center justify-center gap-1.5"
                        >
                          <FaLock size={11} /> Fermé
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal inscription */}
      <AnimatePresence>
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

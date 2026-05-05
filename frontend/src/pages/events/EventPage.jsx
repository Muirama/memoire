/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaGamepad,
  FaLock,
  FaMapMarkerAlt,
  FaSearch,
  FaSortAmountDown,
  FaSpinner,
  FaTrophy,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/api";
import EventIntroSection from "../../components/EventIntroSection";
import RegistrationModal from "../../components/RegistrationModal";
import { buildLoginRedirect, isUserLoggedIn } from "../../utils/auth";

const CATEGORIES = ["Tous", "Solo", "Squad"];
const SORT_OPTIONS = [
  { value: "date-asc", label: "Date (prochains)" },
  { value: "date-desc", label: "Date (récents)" },
  { value: "title-asc", label: "Nom (A-Z)" },
  { value: "prize-desc", label: "Prize pool" },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
const formatPrice = (p) =>
  p ? `${new Intl.NumberFormat("fr-MG").format(p)} Ar` : null;

// ── Card d'un événement ───────────────────────────────────
function EventCard({ event, navigate, onOpenRegistration, isRegistered }) {
  const hasCapacity = Number.isInteger(event.maxParticipants);
  const filled = event.registered || 0;
  const remainingSpots = hasCapacity
    ? Math.max(0, event.maxParticipants - filled)
    : null;
  const isWaitlistMode =
    hasCapacity &&
    remainingSpots === 0 &&
    event.registrationOpen &&
    !isRegistered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[500px] flex flex-col overflow-hidden rounded-2xl border border-[#E50914]/20
                 bg-[#1A1A1A] transition-all duration-300
                 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.3)]"
    >
      {/* Image */}
      <div
        className="relative h-44 cursor-pointer overflow-hidden bg-[#0D0D0D]"
        onClick={() => navigate(`/events/${event.id}`)}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FaCalendarAlt className="text-5xl text-gray-700" />
          </div>
        )}
        <span
          className="absolute left-3 top-3 rounded-full bg-[#E50914]
                         px-2 py-1 text-xs font-semibold text-white"
        >
          {event.category}
        </span>
        {/* Badge déjà inscrit OU statut inscriptions */}
        {isRegistered ? (
          <span
            className="absolute right-3 top-3 rounded-full border
                           border-green-500/40 bg-green-500/20 text-green-400
                           px-2 py-1 text-xs font-semibold flex items-center gap-1"
          >
            <FaCheckCircle size={9} /> Inscrit
          </span>
        ) : (
          <span
            className={`absolute right-3 top-3 rounded-full border
                           px-2 py-1 text-xs font-semibold
                           ${
                             event.registrationOpen
                               ? "border-green-500/30 bg-green-500/20 text-green-400"
                               : "border-gray-500/30 bg-gray-500/20 text-gray-400"
                           }`}
          >
            {event.registrationOpen ? "Inscriptions ouvertes" : "Fermées"}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="mb-3 cursor-pointer text-lg font-bold text-white
                       hover:text-[#E50914] transition line-clamp-2"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          {event.title}
        </h3>

        <div className="mb-4 flex-1 space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FaGamepad className="flex-shrink-0 text-[#E50914]" />
            <span>{event.game}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="flex-shrink-0 text-[#E50914]" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <FaClock className="flex-shrink-0 text-[#E50914]" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="flex-shrink-0 text-[#E50914]" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaUsers className="flex-shrink-0 text-[#E50914]" />
            {hasCapacity ? (
              <span className="line-clamp-1">
                {filled}/{event.maxParticipants} inscription(s) (
                {remainingSpots} place(s) restante(s))
              </span>
            ) : (
              <span>{filled} participant(s) inscrit(s)</span>
            )}
          </div>
          {formatPrice(event.prizePool) && (
            <div className="flex items-center gap-2">
              <FaTrophy className="flex-shrink-0 text-yellow-500" />
              <span className="font-bold text-yellow-400">
                {formatPrice(event.prizePool)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex-1 rounded-lg border border-[#E50914] py-2.5 text-sm
                       font-semibold text-white transition hover:bg-[#E50914]/10"
          >
            Détails
          </button>

          {/* Bouton selon état */}
          {isRegistered ? (
            <button
              type="button"
              disabled
              className="flex flex-1 cursor-not-allowed items-center justify-center
                         gap-1.5 rounded-lg bg-green-600/20 border border-green-500/30
                         py-2.5 text-sm font-semibold text-green-400"
            >
              <FaCheckCircle size={11} /> Inscrit
            </button>
          ) : event.registrationOpen ? (
            <button
              type="button"
              onClick={() => onOpenRegistration(event)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition active:scale-95 ${
                isWaitlistMode
                  ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30"
                  : "bg-[#E50914] text-white hover:bg-[#FF1E56] hover:shadow-[0_0_15px_rgba(229,9,20,0.6)]"
              }`}
            >
              {isWaitlistMode ? "Liste d'attente" : "S'inscrire"}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-1 cursor-not-allowed items-center justify-center
                         gap-1.5 rounded-lg bg-gray-800 py-2.5 text-sm
                         font-semibold text-gray-500"
            >
              <FaLock size={11} /> Fermé
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("date-asc");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // IDs des events auxquels l'user est inscrit
  const [registeredIds, setRegisteredIds] = useState(new Set());

  // ── Fetch events ──────────────────────────────────────
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // ── Vérifier inscriptions de l'user pour tous les events ──
  useEffect(() => {
    if (!isUserLoggedIn() || events.length === 0) return;

    const checkAll = async () => {
      try {
        // On fait les checks en parallèle
        const results = await Promise.all(
          events.map((e) =>
            api
              .get(`/registrations/check/${e.id}`)
              .then((r) => ({ id: e.id, registered: r.data.registered }))
              .catch(() => ({ id: e.id, registered: false })),
          ),
        );
        const ids = new Set(
          results.filter((r) => r.registered).map((r) => r.id),
        );
        setRegisteredIds(ids);
      } catch {
        // silencieux
      }
    };
    checkAll();
  }, [events]);

  // ── Après inscription réussie ─────────────────────────
  const handleRegistrationSuccess = (eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registered: (e.registered || 0) + 1 } : e,
      ),
    );
    setRegisteredIds((prev) => new Set([...prev, eventId]));
  };

  const handleOpenRegistration = (event) => {
    if (!isUserLoggedIn()) {
      navigate(buildLoginRedirect("/events"));
      return;
    }
    setSelectedEvent(event);
  };

  // ── Filtrage + tri ────────────────────────────────────
  const filteredEvents = useMemo(() => {
    const list = events.filter((e) => {
      const q = searchTerm.toLowerCase();
      return (
        ((e.title || "").toLowerCase().includes(q) ||
          (e.game || "").toLowerCase().includes(q)) &&
        (category === "Tous" || e.category === category)
      );
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
  }, [category, events, searchTerm, sortBy]);

  return (
    <section className="relative z-10 min-h-screen bg-transparent px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* <EventIntroSection /> */}

        <div id="event-catalog" className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#FF8A8A]">
              Calendrier public
            </p>
            <h2 className="mb-3 text-3xl font-extrabold text-white md:text-5xl">
              Nos <span className="text-[#E50914]">événements</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Retrouvez les compétitions ouvertes à la communauté.
            </p>
            {!loading && !error && (
              <p className="mt-2 text-sm text-gray-500">
                {filteredEvents.length} événement(s)
              </p>
            )}
          </motion.div>

          {/* Filtres */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <FaSearch
                  className="pointer-events-none absolute left-4 top-1/2
                                     -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Rechercher un événement, un jeu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#E50914]/30 bg-[#1A1A1A]
                             py-3 pl-12 pr-4 text-white transition-all
                             focus:border-[#E50914] focus:outline-none
                             focus:ring-2 focus:ring-[#E50914]/50"
                />
              </div>
              <div className="relative w-full md:w-56">
                <FaSortAmountDown
                  className="pointer-events-none absolute left-4 top-1/2
                                            -translate-y-1/2 text-gray-500"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#E50914]/30
                             bg-[#1A1A1A] py-3 pl-12 pr-4 text-white transition-all
                             focus:border-[#E50914] focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all
                              duration-300
                              ${
                                category === item
                                  ? "scale-105 bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                                  : "bg-[#1A1A1A] text-gray-400 hover:bg-[#E50914]/20 hover:text-white"
                              }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <FaSpinner className="mx-auto mb-4 text-5xl text-[#E50914] animate-spin" />
                <p className="text-gray-400">Chargement des événements...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-red-500/20 bg-red-500/8
                           px-6 py-10 text-center"
              >
                <p className="mb-4 text-lg text-red-400">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-[#E50914] px-6 py-3 text-white
                             transition hover:bg-[#FF1E56]"
                >
                  Réessayer
                </button>
              </motion.div>
            ) : filteredEvents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <FaCalendarAlt className="mx-auto mb-4 text-6xl text-gray-700" />
                <p className="text-xl text-gray-500">Aucun événement trouvé.</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <EventCard
                      event={event}
                      navigate={navigate}
                      onOpenRegistration={handleOpenRegistration}
                      isRegistered={registeredIds.has(event.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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

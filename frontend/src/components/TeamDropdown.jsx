/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FaUsers, FaChevronDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

export default function TeamDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const location = useLocation();

  const clearShowTimeout = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
  };

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const openDropdown = () => {
    clearShowTimeout();
    clearHideTimeout();
    setIsOpen(true);
  };

  const closeDropdown = () => {
    clearShowTimeout();
    clearHideTimeout();
    setIsOpen(false);
  };

  // Ferme le dropdown au changement de route
  useEffect(() => {
    setIsOpen(false);
    clearShowTimeout();
    clearHideTimeout();
  }, [location.pathname]);

  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        clearShowTimeout();
        clearHideTimeout();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      clearShowTimeout();
      clearHideTimeout();
    };
  }, []);

  // Récupère les équipes actives
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await api.get("/teams");
        const activeTeams = res.data.teams.filter((t) => t.active !== false);
        setTeams(activeTeams);
      } catch (err) {
        console.error("Erreur chargement équipes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  // Gère le hover pour ouvrir
  const handleMouseEnter = () => {
    openDropdown();
  };

  // Gère le hover pour fermer
  const handleMouseLeave = () => {
    clearShowTimeout();
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      hideTimeoutRef.current = null;
    }, 120);
  };

  const isActive = location.pathname === "/team";

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeDropdown();
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={openDropdown}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeDropdown();
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg
                   transition-all duration-300 text-sm lg:text-base ${
                     isActive
                       ? "text-white bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                       : "text-white hover:text-white hover:bg-[#E50914]/80 hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                   }`}
      >
        <FaUsers />
        <span>Teams</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={10} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1A1A1A] border border-[#E50914]/30
                       rounded-xl shadow-2xl z-[100] backdrop-blur-md overflow-hidden"
          >
            {/* Header */}
            <Link
              to="/team"
              className="px-4 py-3 bg-[#E50914]/10 border-b border-[#E50914]/20
                         hover:bg-[#E50914]/20 transition font-semibold text-white text-sm
                         flex items-center gap-2"
              onClick={closeDropdown}
            >
              <FaUsers size={14} />
              Voir toutes les équipes
            </Link>

            {/* Liste des équipes */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-4 text-center text-gray-400 text-sm">
                  Chargement...
                </div>
              ) : teams.length === 0 ? (
                <div className="px-4 py-4 text-center text-gray-400 text-sm">
                  Aucune équipe disponible
                </div>
              ) : (
                <ul className="space-y-1 p-2">
                  {teams.map((team) => (
                    <li key={team.id}>
                      <Link
                        to={`/team/${team.id}`}
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                 text-gray-300 hover:text-white hover:bg-[#E50914]/20
                                 transition-all group"
                      >
                        {/* Logo du jeu */}
                        {team.gameLogo ? (
                          <img
                            src={team.gameLogo}
                            alt={team.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0
                                     border border-[#E50914]/30 group-hover:border-[#E50914]"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-white/10
                                     flex items-center justify-center flex-shrink-0 text-gray-600"
                          >
                            🎮
                          </div>
                        )}

                        {/* Infos équipe */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">
                            {team.name}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {team.game}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

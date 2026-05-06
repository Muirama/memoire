/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { FaUsers, FaChevronDown, FaGamepad } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { games } from "../data/GamesData";
import GameBrand from "./team/GameBrand";

export default function TeamDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const location = useLocation();

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    setIsOpen(false);
    clearHideTimeout();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        clearHideTimeout();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => clearHideTimeout();
  }, []);

  const handleMouseEnter = () => {
    clearHideTimeout();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      hideTimeoutRef.current = null;
    }, 120);
  };

  const isActive = location.pathname.startsWith("/team");

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={handleMouseEnter}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
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
            className="absolute top-full left-0 mt-2 w-[20rem] bg-[#121212] border border-[#E50914]/30
                       rounded-2xl shadow-2xl z-[100] backdrop-blur-md overflow-hidden"
          >
            <Link
              to="/team"
              className="px-4 py-3 bg-[#E50914]/10 border-b border-[#E50914]/20
                         hover:bg-[#E50914]/20 transition font-semibold text-white text-sm
                         flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FaGamepad size={14} />
              Voir tous les jeux
            </Link>

            <div className="max-h-[28rem] overflow-y-auto p-2">
              <ul className="grid grid-cols-3 gap-1.5">
                {games.map((game) => (
                  <li key={game.id}>
                    <Link
                      to={`/team/game/${game.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col items-center gap-2 px-2 py-3 rounded-xl
                     text-gray-300 hover:text-white hover:bg-white/5
                     transition-all group border border-transparent
                     hover:border-white/10 text-center"
                    >
                      <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/8 p-2 flex items-center justify-center flex-shrink-0">
                        <GameBrand
                          game={game}
                          logoClassName="w-full h-full object-contain"
                          textClassName="text-sm tracking-[0.24em]"
                        />
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="font-semibold text-xs truncate leading-tight">
                          {game.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {game.rosterCount} membre(s)
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

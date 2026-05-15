import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaChevronDown,
  FaHandshake,
  FaInfoCircle,
  FaSitemap,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export const organizationLinks = [
  {
    name: "About us",
    href: "/organization/history",
    match: "/organization/history",
    icon: <FaInfoCircle size={12} />,
    description: "La page Histoire de Gascom",
  },
  {
    name: "Partners",
    href: "/organization/partners",
    match: "/organization/partners",
    icon: <FaHandshake size={12} />,
    description: "Les partenaires et l'ecosysteme",
  },
];

export const organizationPaths = organizationLinks.map((link) => link.match);

export default function OrganizationDropdown() {
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

  useEffect(() => () => clearHideTimeout(), []);

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

  const isActive = organizationPaths.includes(location.pathname);

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
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-300 lg:text-base ${
          isActive
            ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]"
            : "text-white hover:bg-[#E50914]/80 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
        }`}
      >
        <FaSitemap />
        <span>Organization</span>
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
            className="absolute left-0 top-full z-[100] mt-2 w-[18rem] overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#121212] shadow-2xl backdrop-blur-md"
          >
            <div className="border-b border-white/8 bg-[#E50914]/8 px-4 py-3">
              <p className="text-sm font-semibold text-white">Organization</p>
              <p className="mt-1 text-xs text-gray-400">
                Explore l'histoire de Gascom et les partenaires qui
                l'accompagnent.
              </p>
            </div>

            <ul className="p-2">
              {organizationLinks.map((link) => {
                const itemActive = location.pathname === link.match;

                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-all ${
                        itemActive
                          ? "bg-white/8 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="mt-0.5 text-[#E50914]">{link.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">
                          {link.name}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

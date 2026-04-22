import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaUsers,
  FaNewspaper,
  FaCalendarAlt,
  FaSignInAlt,
  FaShoppingCart,
} from "react-icons/fa";

import logo_GES_blanc from "/LOGO/Logo_GES_blanc.svg";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, toggleCart } = useCart();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Ferme le menu mobile lors d'un resize vers desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Ferme le menu au changement de route
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const pageLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Shop", href: "/shop", icon: <FaStore /> },
    { name: "Team", href: "/team", icon: <FaUsers /> },
    { name: "News", href: "/news", icon: <FaNewspaper /> },
    { name: "Events", href: "/events", icon: <FaCalendarAlt /> },
  ];

  return (
    <nav
      className="shadow-md px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center
                 sticky top-0 z-[60] backdrop-blur-md bg-[#000000]"
      role="navigation"
      aria-label="Navigation principale"
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        className="flex items-center space-x-2 shrink-0"
        aria-label="Retour à l'accueil"
      >
        <img
          src={logo_GES_blanc}
          alt="Logo Gascom e-Sport"
          width="38"
          height="38"
          className="w-9 h-9 sm:w-11 sm:h-11"
        />
        <span
          className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-white drop-shadow-lg
                         hidden xs:block sm:block"
        >
          Gascom Esports
        </span>
      </Link>

      {/* ── Desktop Links ── */}
      <div className="hidden md:flex items-center gap-3 lg:gap-6">
        <ul className="flex space-x-1 lg:space-x-4 font-medium">
          {pageLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={i}>
                <Link
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg
                              transition-all duration-300 text-sm lg:text-base ${
                                isActive
                                  ? "text-white bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                                  : "text-white hover:text-white hover:bg-[#E50914]/80 hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                              }`}
                >
                  <span className="hidden lg:inline">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Bouton Panier ── */}
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Ouvrir le panier"
          className="relative flex items-center gap-2 px-2.5 lg:px-4 py-2 text-white
                     hover:text-white hover:bg-[#E50914]/80 rounded-lg
                     transition-all duration-300 hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
        >
          <FaShoppingCart className="text-base lg:text-lg" />
          {totalItems > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-white
                             text-[10px] font-bold w-5 h-5 rounded-full
                             flex items-center justify-center
                             shadow-[0_0_8px_rgba(229,9,20,0.8)]
                             animate-pulse"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        {/* ── Login ── */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-[#E50914] hover:bg-[#FF1E56]
                     text-white font-semibold rounded-lg transition-all duration-300 text-sm lg:text-base
                     hover:shadow-[0_0_15px_rgba(229,9,20,0.6)] whitespace-nowrap"
        >
          <FaSignInAlt />
          Login
        </Link>
      </div>

      {/* ── Mobile : panier + hamburger ── */}
      <div className="md:hidden flex items-center gap-4">
        {/* Panier mobile */}
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Ouvrir le panier"
          className="relative text-white text-xl p-1.5"
        >
          <FaShoppingCart />
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-[#E50914] text-white
                             text-[9px] font-bold w-4 h-4 rounded-full
                             flex items-center justify-center
                             shadow-[0_0_6px_rgba(229,9,20,0.8)]"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        {/* Hamburger — icône React Icons pour cohérence */}
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          className="text-white text-2xl p-1.5 transition-transform duration-200
                     active:scale-90"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ── Menu mobile ── */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0D0D0D]/95
                    backdrop-blur-md border-t border-[#E50914]/20 px-4 sm:px-6
                    flex flex-col gap-2 z-50 overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${menuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"}`}
      >
        {pageLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={i}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg
                          font-semibold transition-all text-sm sm:text-base ${
                            isActive
                              ? "bg-[#E50914] text-white"
                              : "text-[#B3B3B3] hover:bg-[#E50914]/20 hover:text-white"
                          }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}

        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 bg-[#E50914]
                     text-white font-semibold rounded-lg mt-2 text-sm sm:text-base
                     hover:bg-[#FF1E56] transition-all duration-300"
        >
          <FaSignInAlt /> Login
        </Link>
      </div>
    </nav>
  );
}

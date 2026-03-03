import React, { useState } from "react";
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
import logo_GES_rouge from "/LOGO/Logo_GES_rouge.svg";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, toggleCart } = useCart();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const pageLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Shop", href: "/shop", icon: <FaStore /> },
    { name: "Team", href: "/team", icon: <FaUsers /> },
    { name: "News", href: "/news", icon: <FaNewspaper /> },
    { name: "Events", href: "/events", icon: <FaCalendarAlt /> },
  ];

  return (
    <nav
      className="shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-[60]
                 backdrop-blur-md bg-[#0D0D0D]/90"
      role="navigation"
      aria-label="Navigation principale"
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        className="flex items-center space-x-2"
        aria-label="Retour à l'accueil"
      >
        <img
          src={logo_GES_rouge}
          alt="Logo GasCom e-Sport"
          width="45"
          height="45"
        />
        <span className="text-2xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Gascom
        </span>
      </Link>

      {/* ── Desktop Links ── */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex space-x-6 font-medium">
          {pageLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={i}>
                <Link
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-white bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#E50914]/80 hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                  }`}
                >
                  {link.icon}
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
          className="relative flex items-center gap-2 px-4 py-2 text-[#B3B3B3]
                     hover:text-white hover:bg-[#E50914]/80 rounded-lg
                     transition-all duration-300 hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
        >
          <FaShoppingCart />
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
          className="flex items-center gap-2 px-6 py-2 bg-[#E50914] hover:bg-[#FF1E56]
                     text-white font-semibold rounded-lg transition-all duration-300
                     hover:shadow-[0_0_15px_rgba(229,9,20,0.6)]"
        >
          <FaSignInAlt />
          Login
        </Link>
      </div>

      {/* ── Mobile : panier + hamburger ── */}
      <div className="md:hidden flex items-center gap-3">
        {/* Panier mobile */}
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Ouvrir le panier"
          className="relative text-white text-xl p-1"
        >
          <FaShoppingCart />
          {totalItems > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-white
                             text-[10px] font-bold w-4 h-4 rounded-full
                             flex items-center justify-center"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        {/* Hamburger */}
        <button
          className="text-2xl text-white"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ── Menu mobile ── */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-[#0D0D0D]/95
                        backdrop-blur-md border-t border-[#E50914]/20 px-6 py-4
                        flex flex-col gap-3 z-50"
        >
          {pageLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={i}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg
                            font-semibold transition-all ${
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
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 bg-[#E50914]
                       text-white font-semibold rounded-lg mt-2"
          >
            <FaSignInAlt /> Login
          </Link>
        </div>
      )}
    </nav>
  );
}

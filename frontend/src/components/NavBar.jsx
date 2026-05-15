import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCalendarAlt,
  FaChevronDown,
  FaHome,
  FaIdCard,
  FaNewspaper,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaSitemap,
  FaStore,
  FaTimes,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo_GES_blanc from "/LOGO/Logo_GES_blanc.svg";
import { useCart } from "../context/CartContext";
import OrganizationDropdown, {
  organizationPaths,
  organizationLinks,
} from "./OrganizationDropdown";
import TeamDropdown from "./TeamDropdown";
import { clearAuthSession, getUserRole, isUserLoggedIn } from "../utils/auth";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [organizationMenuOpen, setOrganizationMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, toggleCart } = useCart();
  const [userLoggedIn, setUserLoggedIn] = useState(isUserLoggedIn());
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const getPageTitle = (pathname) => {
    if (pathname === "/") return "Gascom";
    if (pathname.startsWith("/shop")) return "Gascom eShop";
    if (pathname.startsWith("/team")) return "Gascom eSports";
    if (pathname.startsWith("/organization/history")) return "Gascom eStory";
    if (pathname.startsWith("/organization/partners")) return "Gascom eSports";
    if (pathname.startsWith("/news")) return "Gascom News";
    if (pathname.startsWith("/events")) return "Gascom Events";
    if (pathname.startsWith("/login")) return "Gascom Login";
    if (pathname.startsWith("/account")) return "Gascom eCompte";
    return "Gascom";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setOrganizationMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
    setOrganizationMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setUserLoggedIn(isUserLoggedIn());
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    if (accountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  const handleLogout = () => {
    clearAuthSession();
    setUserLoggedIn(false);
    setMenuOpen(false);
    setAccountMenuOpen(false);
    setOrganizationMenuOpen(false);
    navigate("/");
  };

  const handleGoToAccount = () => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
    setOrganizationMenuOpen(false);
    navigate("/account");
  };

  const homeLink = { name: "Home", href: "/", icon: <FaHome /> };
  const pageLinks = [
    { name: "Shop", href: "/shop", icon: <FaStore /> },
    { name: "Team", href: "/team", icon: <FaUsers /> },
    { name: "News", href: "/news", icon: <FaNewspaper /> },
    { name: "Events", href: "/events", icon: <FaCalendarAlt /> },
  ];
  const isHomeActive = location.pathname === "/";

  return (
    <nav
      className="sticky top-0 z-[60] flex items-center justify-between bg-[#000000] px-4 py-3 shadow-md backdrop-blur-md sm:px-6 sm:py-4"
      role="navigation"
      aria-label="Navigation principale"
    >
      <Link
        to="/"
        className="flex shrink-0 items-center space-x-2"
        aria-label="Retour a l'accueil"
      >
        <img
          src={logo_GES_blanc}
          alt="Logo Gascom e-Sport"
          width="38"
          height="38"
          className="h-9 w-9 sm:h-11 sm:w-11"
        />
        <span className="hidden text-base font-extrabold tracking-wide text-white drop-shadow-lg min-[360px]:block min-[360px]:text-lg sm:text-xl md:text-2xl">
          {getPageTitle(location.pathname)}
        </span>
      </Link>

      <div className="hidden items-center gap-2 md:flex lg:gap-4">
        <ul className="flex space-x-0.5 font-medium lg:space-x-2">
          <li>
            <Link
              to={homeLink.href}
              aria-current={isHomeActive ? "page" : undefined}
              className={`flex items-center gap-1 rounded-lg px-2 py-2 text-sm transition-all duration-300 lg:gap-2 lg:px-3 lg:text-base xl:px-4 ${isHomeActive
                  ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                  : "text-white hover:bg-[#E50914]/80 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                }`}
            >
              <span className="hidden xl:inline">{homeLink.icon}</span>
              {homeLink.name}
            </Link>
          </li>
          <li>
            <OrganizationDropdown />
          </li>

          {pageLinks.map((link) => {
            if (link.name === "Team") {
              return (
                <li key={link.name}>
                  <TeamDropdown />
                </li>
              );
            }

            const isActive = location.pathname === link.href;

            return (
              <li key={link.name}>
                <Link
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1 rounded-lg px-2 py-2 text-sm transition-all duration-300 lg:gap-2 lg:px-3 lg:text-base xl:px-4 ${isActive
                      ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                      : "text-white hover:bg-[#E50914]/80 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                    }`}
                >
                  <span className="hidden xl:inline">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={toggleCart}
          aria-label="Ouvrir le panier"
          className="relative flex items-center gap-2 rounded-lg px-2 py-2 text-white transition-all duration-300 hover:bg-[#E50914]/80 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.4)] lg:px-3 xl:px-4"
        >
          <FaShoppingCart className="text-base lg:text-lg" />
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E50914] text-[10px] font-bold text-white shadow-[0_0_8px_rgba(229,9,20,0.8)] animate-pulse">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        {userLoggedIn && getUserRole() === "user" ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              aria-label="Ouvrir le menu du compte"
              aria-expanded={accountMenuOpen}
              className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-white transition-all duration-300 hover:bg-[#E50914]/80 hover:text-white hover:shadow-[0_0_12px_rgba(229,9,20,0.4)] lg:px-3"
            >
              <FaUserCircle className="shrink-0 text-xl" />
              <span className="hidden whitespace-nowrap text-sm font-semibold lg:inline">
                Mon compte
              </span>
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${accountMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-semibold text-white">Mon compte</p>
                  <p className="text-xs text-gray-500">
                    D'autres actions arriveront bientot
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoToAccount}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  <FaIdCard />
                  Mon profil
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-300 transition-all hover:bg-red-400/10 hover:text-red-400"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#E50914] px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#FF1E56] hover:shadow-[0_0_15px_rgba(229,9,20,0.6)] lg:px-5 lg:text-base"
          >
            <FaSignInAlt />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Ouvrir le panier"
          className="relative p-1.5 text-xl text-white"
        >
          <FaShoppingCart />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E50914] text-[9px] font-bold text-white shadow-[0_0_6px_rgba(229,9,20,0.8)]">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          className="p-1.5 text-2xl text-white transition-transform duration-200 active:scale-90"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`absolute left-0 top-full z-50 flex w-full flex-col gap-2 overflow-hidden border-t border-[#E50914]/20 bg-[#0D0D0D]/95 px-4 backdrop-blur-md transition-all duration-300 ease-in-out sm:px-6 md:hidden ${menuOpen ? "max-h-screen py-4 opacity-100" : "pointer-events-none max-h-0 py-0 opacity-0"
          }`}
      >
        <Link
          to={homeLink.href}
          onClick={() => setMenuOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all sm:text-base ${isHomeActive
              ? "bg-[#E50914] text-white"
              : "text-[#B3B3B3] hover:bg-[#E50914]/20 hover:text-white"
            }`}
        >
          {homeLink.icon}
          {homeLink.name}
        </Link>

        <button
          type="button"
          onClick={() => setOrganizationMenuOpen((prev) => !prev)}
          className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all sm:text-base ${organizationPaths.includes(location.pathname)
              ? "bg-[#E50914] text-white"
              : "text-[#B3B3B3] hover:bg-[#E50914]/20 hover:text-white"
            }`}
        >
          <span className="flex items-center gap-3">
            <FaSitemap />
            Organization
          </span>
          <FaChevronDown
            className={`text-xs transition-transform duration-200 ${organizationMenuOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {organizationMenuOpen && (
          <div className="ml-4 flex flex-col gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-2">
            {organizationLinks.map((link) => {
              const isActive = location.pathname === link.match;

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => {
                    setOrganizationMenuOpen(false);
                    setMenuOpen(false);
                  }}
                  className={`rounded-lg px-4 py-3 text-sm transition-all ${isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span className="block font-semibold">{link.name}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {link.description}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {pageLinks.map((link) => {
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all sm:text-base ${isActive
                  ? "bg-[#E50914] text-white"
                  : "text-[#B3B3B3] hover:bg-[#E50914]/20 hover:text-white"
                }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}

        {userLoggedIn && getUserRole() === "user" ? (
          <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 px-4 py-2">
              <FaUserCircle className="shrink-0 text-2xl text-white" />
              <div>
                <p className="text-sm font-semibold leading-tight text-white">
                  Mon compte
                </p>
                <p className="text-xs leading-tight text-gray-500">
                  D'autres actions arriveront bientot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoToAccount}
              className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5 sm:text-base"
            >
              <FaIdCard />
              Mon profil
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg bg-[#E50914] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#FF1E56] sm:text-base"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-lg bg-[#E50914] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#FF1E56] sm:text-base"
          >
            <FaSignInAlt />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

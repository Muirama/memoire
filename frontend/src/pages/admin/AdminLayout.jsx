/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaCalendarAlt,
  FaNewspaper,
  FaStore,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, to: "/admin", end: true },
  { label: "Commandes", icon: <FaShoppingBag />, to: "/admin/orders" },
  { label: "Produits", icon: <FaStore />, to: "/admin/products" },
  { label: "Événements", icon: <FaCalendarAlt />, to: "/admin/events" },
  { label: "News", icon: <FaNewspaper />, to: "/admin/news" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 bg-[#E50914] rounded-lg flex items-center
                          justify-center font-extrabold text-white text-lg shadow-lg"
          >
            G
          </div>
          <div>
            <p className="text-white font-extrabold text-base leading-none">
              Gascom
            </p>
            <p className="text-gray-500 text-xs mt-0.5">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
               text-sm transition-all duration-200 group
               ${
                 isActive
                   ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                   : "text-gray-400 hover:bg-white/5 hover:text-white"
               }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            <FaChevronRight
              className="text-xs opacity-0 group-hover:opacity-50
                                       transition-opacity"
            />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                     text-gray-400 hover:text-red-400 hover:bg-red-400/10
                     font-semibold text-sm transition-all"
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 bg-[#111111]
                        border-r border-white/5 fixed top-0 left-0 h-full z-40"
      >
        <SidebarContent />
      </aside>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-[#111111]
                         border-r border-white/5 z-50 md:hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <FaTimes size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Contenu */}
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        {/* Topbar mobile */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-4
                           bg-[#111111] border-b border-white/5 sticky top-0 z-30"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 bg-[#E50914] rounded-lg flex items-center
                            justify-center font-extrabold text-white"
            >
              G
            </div>
            <span className="text-white font-bold">Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <FaBars size={20} />
          </button>
        </header>

        {/* Page */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 md:p-8 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

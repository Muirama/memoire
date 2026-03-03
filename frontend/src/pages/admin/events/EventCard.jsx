/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaGamepad,
  FaUsers,
  FaLock,
  FaLockOpen,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";
import { formatDate } from "../../../utils/adminFormatters";
import RegistrationsPanel from "./RegistrationsPanel";

export default function EventCard({
  event,
  index,
  isExpanded,
  onToggleExpand,
  regs,
  isLoadingRegs,
  isToggling,
  onToggleRegistration,
  onViewReg,
  onEditReg,
  onDeleteReg,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-[#1A1A1A] rounded-2xl border transition-all duration-300
                  ${
                    isExpanded
                      ? "border-[#E50914]/40 shadow-[0_0_20px_rgba(229,9,20,0.15)]"
                      : "border-white/5 hover:border-white/10"
                  }`}
    >
      {/* En-tête */}
      <div className="flex items-center gap-4 p-4 md:p-5">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#0D0D0D] flex items-center justify-center">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaCalendarAlt className="text-gray-600 text-xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold truncate">{event.title}</h3>
            <span className="text-xs bg-[#E50914]/20 text-[#E50914] px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
              {event.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <FaGamepad size={10} /> {event.game}
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <FaCalendarAlt size={10} /> {formatDate(event.date)}
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <FaUsers size={10} />
              <span className="text-white font-semibold">
                {event.registered || 0}
              </span>{" "}
              inscrit(s)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5
                            rounded-full font-semibold border
                            ${
                              event.registrationOpen
                                ? "bg-green-500/15 text-green-400 border-green-500/30"
                                : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                            }`}
          >
            {event.registrationOpen ? (
              <>
                <FaLockOpen size={10} /> Ouvert
              </>
            ) : (
              <>
                <FaLock size={10} /> Fermé
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => onToggleRegistration(event)}
            disabled={isToggling}
            title={
              event.registrationOpen
                ? "Fermer les inscriptions"
                : "Ouvrir les inscriptions"
            }
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                        ${
                          event.registrationOpen
                            ? "bg-green-500/10 text-green-400 hover:bg-red-500/20 hover:text-red-400"
                            : "bg-gray-500/10 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                        } disabled:opacity-50`}
          >
            {isToggling ? (
              <FaSpinner className="animate-spin" size={13} />
            ) : event.registrationOpen ? (
              <FaLockOpen size={13} />
            ) : (
              <FaLock size={13} />
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleExpand(event.id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                        ${isExpanded ? "bg-[#E50914] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
          >
            {isExpanded ? (
              <FaChevronUp size={13} />
            ) : (
              <FaChevronDown size={13} />
            )}
          </button>
        </div>
      </div>

      {/* Panneau inscriptions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <RegistrationsPanel
              event={event}
              regs={regs}
              isLoading={isLoadingRegs}
              isToggling={isToggling}
              onToggle={onToggleRegistration}
              onView={onViewReg}
              onEdit={onEditReg}
              onDelete={onDeleteReg}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

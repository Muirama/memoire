/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaLock,
  FaLockOpen,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { formatDateTime, STATUS_REG } from "../../../utils/adminFormatters";

export default function RegistrationsPanel({
  event,
  regs,
  isLoading,
  onToggle,
  isToggling,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border-t border-white/5 px-4 md:px-5 pb-5 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaUsers className="text-[#E50914]" />
          <span className="text-white font-bold text-sm">Inscriptions</span>
          <span className="bg-[#E50914]/20 text-[#E50914] text-xs px-2 py-0.5 rounded-full font-bold">
            {regs.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggle(event)}
          disabled={isToggling}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
                      transition-all ${
                        event.registrationOpen
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                      }`}
        >
          {isToggling ? (
            <FaSpinner className="animate-spin" size={11} />
          ) : event.registrationOpen ? (
            <>
              <FaLock size={11} /> Fermer les inscriptions
            </>
          ) : (
            <>
              <FaLockOpen size={11} /> Ouvrir les inscriptions
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="text-[#E50914] animate-spin text-2xl" />
        </div>
      ) : regs.length === 0 ? (
        <div className="text-center py-8">
          <FaUsers className="text-gray-700 text-4xl mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            Aucune inscription pour cet événement.
          </p>
        </div>
      ) : (
        <>
          {/* Table desktop */}
          <div className="hidden md:block rounded-xl overflow-hidden border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D0D0D] text-gray-500 text-xs uppercase">
                  {[
                    "#",
                    "Participant",
                    "Pseudo",
                    "Contact",
                    "Date",
                    "Statut",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 ${h === "Statut" || h === "Actions" ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regs.map((reg) => {
                  const { date, time } = formatDateTime(reg.createdAt);
                  return (
                    <tr
                      key={reg.id}
                      className="border-t border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        #{reg.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold">{reg.name}</p>
                        <p className="text-gray-500 text-xs">{reg.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#E50914] font-bold text-xs bg-[#E50914]/10 px-2 py-1 rounded-lg">
                          {reg.pseudo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {reg.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <p>{date}</p>
                        <p className="text-gray-600">{time}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-semibold ${STATUS_REG[reg.status]}`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <ActionBtn onClick={() => onView(reg)} color="white">
                            <FaEye size={11} />
                          </ActionBtn>
                          <ActionBtn onClick={() => onEdit(reg)} color="blue">
                            <FaEdit size={11} />
                          </ActionBtn>
                          <ActionBtn
                            onClick={() => onDelete(reg.id)}
                            color="red"
                          >
                            <FaTrash size={11} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards mobile */}
          <div className="md:hidden space-y-3">
            {regs.map((reg) => {
              const { date } = formatDateTime(reg.createdAt);
              return (
                <div
                  key={reg.id}
                  className="bg-[#0D0D0D] rounded-xl p-3 border border-white/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {reg.name}
                      </p>
                      <p className="text-[#E50914] text-xs font-bold">
                        {reg.pseudo}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border font-semibold ${STATUS_REG[reg.status]}`}
                    >
                      {reg.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">
                    {reg.email} · {reg.phone}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-xs">{date}</p>
                    <div className="flex gap-1.5">
                      <ActionBtn onClick={() => onView(reg)} color="white">
                        <FaEye size={11} />
                      </ActionBtn>
                      <ActionBtn onClick={() => onEdit(reg)} color="blue">
                        <FaEdit size={11} />
                      </ActionBtn>
                      <ActionBtn onClick={() => onDelete(reg.id)} color="red">
                        <FaTrash size={11} />
                      </ActionBtn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ActionBtn({ onClick, color, children }) {
  const colors = {
    white: "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white",
    blue: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400",
    red: "bg-red-500/10 hover:bg-red-500/20 text-red-400",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${colors[color]}`}
    >
      {children}
    </button>
  );
}

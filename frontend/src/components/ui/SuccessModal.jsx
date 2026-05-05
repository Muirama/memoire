/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessModal({ event, profile, regInfo, onClose }) {
  const isPending = regInfo?.status === "En attente";
  const title = isPending ? "Inscription en attente" : "Inscription confirmee";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#E50914]/20
                   shadow-[0_0_40px_rgba(229,9,20,0.2)] z-50 p-6 text-center"
      >
        <FaCheckCircle
          className={`text-7xl mx-auto mb-5 ${isPending ? "text-yellow-400" : "text-green-400"}`}
        />

        <h3 className="text-white font-extrabold text-2xl mb-2">{title}</h3>

        <p className="text-gray-400 text-sm mb-6">
          {profile?.pseudo}, votre inscription a{" "}
          <span className="text-[#E50914]">{event.title}</span>{" "}
          {isPending
            ? "a ete placee en liste d'attente."
            : "a ete confirmee automatiquement."}
        </p>

        <div className="bg-[#0D0D0D] rounded-xl p-4 text-left text-sm space-y-2">
          <p className="text-white">No inscription : #{regInfo?.id}</p>
          <p className="text-white">Statut : {regInfo?.status}</p>
          <p className="text-white">Nom : {profile?.name}</p>
          <p className="text-white">Pseudo : {profile?.pseudo}</p>
          <p className="text-white">Telephone : {profile?.phone}</p>
          <p className="text-white">Email : {profile?.email}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#E50914] text-white font-bold rounded-xl"
        >
          Fermer
        </button>
      </motion.div>
    </>
  );
}

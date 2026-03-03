/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function AdminModal({ title, onClose, children }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-lg bg-[#1A1A1A] rounded-2xl border border-white/10
                   shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8 rounded-lg
                       hover:bg-white/5 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </>
  );
}

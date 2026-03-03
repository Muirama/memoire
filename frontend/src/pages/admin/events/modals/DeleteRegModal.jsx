import React from "react";
import { AnimatePresence } from "framer-motion";
import { FaTrash, FaSpinner } from "react-icons/fa";
import AdminModal from "../../../../components/ui/AdminModal";

export default function DeleteRegModal({ regId, onDelete, onClose, deleting }) {
  if (!regId) return null;
  return (
    <AnimatePresence>
      <AdminModal title="Supprimer l'inscription" onClose={onClose}>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Voulez-vous supprimer l'inscription{" "}
            <span className="text-[#E50914] font-bold">#{regId}</span> ? Cette
            action est irréversible.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10
                         text-gray-400 hover:text-white font-semibold text-sm transition"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500
                         text-white font-bold text-sm transition disabled:opacity-50
                         flex items-center justify-center gap-2"
            >
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              Supprimer
            </button>
          </div>
        </div>
      </AdminModal>
    </AnimatePresence>
  );
}

import React from "react";
import { AnimatePresence } from "framer-motion";
import { FaCheck, FaSpinner } from "react-icons/fa";
import AdminModal from "../../../../components/ui/AdminModal";
import { STATUS_REG } from "../../../../utils/adminFormatters";

export default function EditRegModal({
  reg,
  newStatus,
  setNewStatus,
  onSave,
  onClose,
  saving,
}) {
  if (!reg) return null;
  return (
    <AnimatePresence>
      <AdminModal title={`Statut — ${reg.pseudo}`} onClose={onClose}>
        <div className="space-y-3">
          <p className="text-gray-400 text-sm mb-4">
            Modifier le statut de{" "}
            <span className="text-white font-bold">{reg.name}</span>
          </p>
          {["En attente", "Confirmée", "Annulée"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setNewStatus(s)}
              className={`w-full flex items-center justify-between px-4 py-3
                          rounded-xl border font-semibold text-sm transition-all
                          ${
                            newStatus === s
                              ? `${STATUS_REG[s]} border-current`
                              : "bg-[#0D0D0D] border-white/10 text-gray-400 hover:border-white/20"
                          }`}
            >
              {s}
              {newStatus === s && <FaCheck size={12} />}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10
                         text-gray-400 hover:text-white text-sm font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E56]
                         text-white font-bold text-sm transition disabled:opacity-50
                         flex items-center justify-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Enregistrer
            </button>
          </div>
        </div>
      </AdminModal>
    </AnimatePresence>
  );
}

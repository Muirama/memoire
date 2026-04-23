/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaGamepad,
  FaImage,
  FaHashtag,
  FaGlobe,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import api from "../../../api/api";

const STATUSES = ["Titulaire", "Remplaçant", "Coach", "Manager"];

const EMPTY = {
  pseudo: "",
  realName: "",
  role: "",
  photo: "",
  number: "",
  nationality: "Malgache",
  status: "Titulaire",
  order: 0,
};

export default function AdminPlayerForm({ player, teamId, onClose, onSaved }) {
  const isEdit = Boolean(player);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  useEffect(() => {
    if (player) {
      setForm({
        pseudo: player.pseudo || "",
        realName: player.realName || "",
        role: player.role || "",
        photo: player.photo || "",
        number: player.number || "",
        nationality: player.nationality || "Malgache",
        status: player.status || "Titulaire",
        order: player.order ?? 0,
      });
    } else {
      setForm(EMPTY);
    }
  }, [player]);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (globalErr) setGlobalErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.pseudo.trim()) e.pseudo = "Le pseudo est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        pseudo: form.pseudo.trim(),
        realName: form.realName || null,
        role: form.role || null,
        photo: form.photo || null,
        number: form.number ? parseInt(form.number) : null,
        nationality: form.nationality || "Malgache",
        status: form.status,
        order: parseInt(form.order) || 0,
      };
      if (isEdit) {
        await api.put(`/teams/${teamId}/players/${player.id}`, payload);
      } else {
        await api.post(`/teams/${teamId}/players`, payload);
      }
      onSaved();
    } catch (err) {
      setGlobalErr(
        err.response?.data?.message || "Erreur lors de l'enregistrement.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field = "") =>
    `w-full px-4 py-2.5 bg-[#0D0D0D] text-white text-sm rounded-xl border
     transition-all focus:outline-none focus:ring-2
     ${
       errors[field]
         ? "border-red-500 focus:ring-red-500/30"
         : "border-white/10 focus:border-[#E50914] focus:ring-[#E50914]/20"
     }`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#111111]
                   border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5
                        border-b border-white/5 flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            {/* Avatar preview */}
            <div
              className="w-10 h-10 rounded-xl overflow-hidden bg-[#0D0D0D]
                            border border-white/10 flex items-center justify-center"
            >
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 font-bold text-lg">
                  {form.pseudo ? form.pseudo[0].toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg leading-none">
                {isEdit ? "Modifier le joueur" : "Ajouter un joueur"}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {isEdit ? `ID #${player.id}` : "Le pseudo * est requis"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10
                       text-gray-400 hover:text-white transition flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {globalErr && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">{globalErr}</p>
            </div>
          )}

          {/* Pseudo + Nom réel */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pseudo *" icon={<FaUser />} error={errors.pseudo}>
              <input
                type="text"
                value={form.pseudo}
                onChange={set("pseudo")}
                placeholder="Ex: ShadowX"
                className={inputCls("pseudo")}
              />
            </Field>
            <Field label="Nom réel" icon={<FaUser />}>
              <input
                type="text"
                value={form.realName}
                onChange={set("realName")}
                placeholder="Ex: Jean Rakoto"
                className={inputCls()}
              />
            </Field>
          </div>

          {/* Rôle + Numéro */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rôle" icon={<FaGamepad />}>
              <input
                type="text"
                value={form.role}
                onChange={set("role")}
                placeholder="Ex: Mid, IGL, Fragger..."
                className={inputCls()}
              />
            </Field>
            <Field label="N° maillot" icon={<FaHashtag />}>
              <input
                type="number"
                value={form.number}
                onChange={set("number")}
                placeholder="Ex: 7"
                min="1"
                max="99"
                className={inputCls()}
              />
            </Field>
          </div>

          {/* Photo */}
          <Field label="Photo (URL)" icon={<FaImage />}>
            <input
              type="url"
              value={form.photo}
              onChange={set("photo")}
              placeholder="https://..."
              className={inputCls()}
            />
            {form.photo && (
              <div
                className="mt-2 flex items-center gap-3 p-3 bg-[#0D0D0D]
                              rounded-xl border border-white/5"
              >
                <img
                  src={form.photo}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <p className="text-white font-bold text-sm">
                    {form.pseudo || "—"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {form.role || "Aucun rôle"}
                  </p>
                </div>
              </div>
            )}
          </Field>

          {/* Nationalité */}
          <Field label="Nationalité" icon={<FaGlobe />}>
            <input
              type="text"
              value={form.nationality}
              onChange={set("nationality")}
              placeholder="Ex: Malgache"
              className={inputCls()}
            />
          </Field>

          {/* Statut */}
          <div>
            <label
              className="flex items-center gap-1.5 text-gray-400 text-xs
                              font-semibold mb-2 uppercase tracking-wide"
            >
              <span className="text-[#E50914]">
                <FaUser />
              </span>{" "}
              Statut
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: s }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border
                              transition-all flex items-center gap-2
                              ${
                                form.status === s
                                  ? `text-white border-current ${
                                      s === "Titulaire"
                                        ? "bg-green-500/20 text-green-400 border-green-500"
                                        : s === "Remplaçant"
                                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                                          : s === "Coach"
                                            ? "bg-blue-500/20 text-blue-400 border-blue-500"
                                            : "bg-purple-500/20 text-purple-400 border-purple-500"
                                    }`
                                  : "bg-[#0D0D0D] text-gray-400 border-white/10 hover:border-white/20"
                              }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      form.status === s
                        ? s === "Titulaire"
                          ? "bg-green-400"
                          : s === "Remplaçant"
                            ? "bg-yellow-400"
                            : s === "Coach"
                              ? "bg-blue-400"
                              : "bg-purple-400"
                        : "bg-gray-600"
                    }`}
                  />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Ordre d'affichage */}
          <Field label="Ordre d'affichage" icon={<FaHashtag />}>
            <input
              type="number"
              value={form.order}
              onChange={set("order")}
              placeholder="0"
              min="0"
              className={inputCls()}
            />
            <p className="text-gray-600 text-xs mt-1">
              Les joueurs sont triés par ordre croissant (0 = premier)
            </p>
          </Field>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400
                       hover:text-white font-semibold text-sm transition"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E56]
                       text-white font-bold text-sm transition disabled:opacity-50
                       flex items-center justify-center gap-2
                       hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                <FaCheck /> {isEdit ? "Enregistrer" : "Ajouter"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label
        className="flex items-center gap-1.5 text-gray-400 text-xs
                        font-semibold mb-1.5 uppercase tracking-wide"
      >
        <span className="text-[#E50914]">{icon}</span> {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

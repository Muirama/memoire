/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCalendarAlt,
  FaGamepad,
  FaMapMarkerAlt,
  FaClock,
  FaTrophy,
  FaImage,
  FaCheck,
  FaSpinner,
  FaAlignLeft,
  FaListUl,
  FaTag,
} from "react-icons/fa";
import api from "../../../api/api";

const CATEGORIES = ["Tournoi", "Championnat", "Qualificatif", "Exhibition"];
const GAMES = [
  "League of Legends",
  "CS2",
  "Valorant",
  "EA FC 24",
  "PUBG Mobile",
  "Free Fire",
  "Mobile Legends",
  "Autre",
];

const EMPTY = {
  title: "",
  game: "",
  category: "Tournoi",
  date: "",
  time: "",
  location: "",
  description: "",
  rules: "",
  image: "",
  prizePool: "",
  registrationOpen: true,
};

export default function AdminEventForm({ event, onClose, onSaved }) {
  const isEdit = Boolean(event);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  // Pré-remplir si édition
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        game: event.game || "",
        category: event.category || "Tournoi",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        description: event.description || "",
        rules: event.rules || "",
        image: event.image || "",
        prizePool: event.prizePool || "",
        registrationOpen: event.registrationOpen ?? true,
      });
    }
  }, [event]);

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (globalErr) setGlobalErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Le titre est requis.";
    if (!form.game.trim()) e.game = "Le jeu est requis.";
    if (!form.date) e.date = "La date est requise.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        prizePool: form.prizePool ? parseInt(form.prizePool) : null,
        time: form.time || null,
        image: form.image || null,
      };
      if (isEdit) {
        await api.put(`/events/${event.id}`, payload);
      } else {
        await api.post("/events", payload);
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

  const inputCls = (field) =>
    `w-full px-4 py-2.5 bg-[#0D0D0D] text-white text-sm rounded-xl border
     transition-all focus:outline-none focus:ring-2
     ${
       errors[field]
         ? "border-red-500 focus:ring-red-500/30"
         : "border-white/10 focus:border-[#E50914] focus:ring-[#E50914]/20"
     }`;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
      />

      {/* Panneau latéral */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#111111]
                   border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5
                        border-b border-white/5 flex-shrink-0"
        >
          <div>
            <h2 className="text-white font-extrabold text-lg">
              {isEdit ? "Modifier l'événement" : "Nouvel événement"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {isEdit ? `ID #${event.id}` : "Tous les champs * sont requis"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10
                       text-gray-400 hover:text-white transition flex
                       items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        {/* Formulaire scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {globalErr && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">{globalErr}</p>
            </div>
          )}

          {/* Titre */}
          <Field label="Titre *" icon={<FaCalendarAlt />} error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="Ex: Gascom LoL Championship S2"
              className={inputCls("title")}
            />
          </Field>

          {/* Jeu + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Jeu *" icon={<FaGamepad />} error={errors.game}>
              <select
                value={form.game}
                onChange={set("game")}
                className={inputCls("game")}
              >
                <option value="">Choisir...</option>
                {GAMES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Catégorie" icon={<FaTag />}>
              <select
                value={form.category}
                onChange={set("category")}
                className={inputCls()}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date *" icon={<FaCalendarAlt />} error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className={inputCls("date")}
              />
            </Field>
            <Field label="Heure" icon={<FaClock />}>
              <input
                type="time"
                value={form.time}
                onChange={set("time")}
                className={inputCls()}
              />
            </Field>
          </div>

          {/* Lieu */}
          <Field label="Lieu" icon={<FaMapMarkerAlt />}>
            <input
              type="text"
              value={form.location}
              onChange={set("location")}
              placeholder="Ex: Antananarivo, Salle Omnisports"
              className={inputCls()}
            />
          </Field>

          {/* Prize pool */}
          <Field label="Prize pool (Ar)" icon={<FaTrophy />}>
            <input
              type="number"
              value={form.prizePool}
              onChange={set("prizePool")}
              placeholder="Ex: 1000000"
              className={inputCls()}
            />
          </Field>

          {/* Image URL */}
          <Field label="Image (URL)" icon={<FaImage />}>
            <input
              type="url"
              value={form.image}
              onChange={set("image")}
              placeholder="https://..."
              className={inputCls()}
            />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                referrerPolicy="no-referrer"
                className="mt-2 w-full h-32 object-cover rounded-xl opacity-80"
              />
            )}
          </Field>

          {/* Description */}
          <Field label="Description" icon={<FaAlignLeft />}>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              placeholder="Présentation de l'événement..."
              className={`${inputCls()} resize-none`}
            />
          </Field>

          {/* Règlement */}
          <Field label="Règlement" icon={<FaListUl />}>
            <textarea
              value={form.rules}
              onChange={set("rules")}
              rows={4}
              placeholder="- Règle 1&#10;- Règle 2..."
              className={`${inputCls()} resize-none`}
            />
          </Field>

          {/* Inscriptions ouvertes */}
          <label
            className="flex items-center gap-3 p-4 bg-[#0D0D0D] rounded-xl
                            border border-white/10 cursor-pointer hover:border-white/20
                            transition-all"
          >
            <div
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0
                            ${form.registrationOpen ? "bg-green-500" : "bg-gray-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                              transition-all ${form.registrationOpen ? "left-5" : "left-1"}`}
              />
            </div>
            <input
              type="checkbox"
              checked={form.registrationOpen}
              onChange={set("registrationOpen")}
              className="hidden"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                Inscriptions ouvertes
              </p>
              <p className="text-gray-500 text-xs">
                {form.registrationOpen
                  ? "Les participants peuvent s'inscrire"
                  : "Inscriptions fermées"}
              </p>
            </div>
          </label>
        </form>

        {/* Footer sticky */}
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
            type="submit"
            form="event-form"
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
                <FaCheck /> {isEdit ? "Enregistrer" : "Créer l'événement"}
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
        <span className="text-[#E50914]">{icon}</span>
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

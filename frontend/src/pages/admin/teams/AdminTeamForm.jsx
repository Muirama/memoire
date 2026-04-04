/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaUsers,
  FaGamepad,
  FaImage,
  FaAlignLeft,
  FaTrophy,
  FaTwitter,
  FaFacebook,
  FaDiscord,
  FaCheck,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../../../api/api";

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
  name: "",
  game: "",
  logo: "",
  banner: "",
  description: "",
  palmares: "",
  twitter: "",
  facebook: "",
  discord: "",
  active: true,
};

export default function AdminTeamForm({ team, onClose, onSaved }) {
  const isEdit = Boolean(team);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  useEffect(() => {
    if (team) {
      setForm({
        name: team.name || "",
        game: team.game || "",
        logo: team.logo || "",
        banner: team.banner || "",
        description: team.description || "",
        palmares: team.palmares || "",
        twitter: team.twitter || "",
        facebook: team.facebook || "",
        discord: team.discord || "",
        active: team.active ?? true,
      });
    } else {
      setForm(EMPTY);
    }
  }, [team]);

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (globalErr) setGlobalErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est requis.";
    if (!form.game.trim()) e.game = "Le jeu est requis.";
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
        logo: form.logo || null,
        banner: form.banner || null,
        twitter: form.twitter || null,
        facebook: form.facebook || null,
        discord: form.discord || null,
      };
      if (isEdit) {
        await api.put(`/teams/${team.id}`, payload);
      } else {
        await api.post("/teams", payload);
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
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#111111]
                   border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5
                        border-b border-white/5 flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            {form.logo ? (
              <img
                src={form.logo}
                alt="logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg bg-[#0D0D0D] border border-white/10
                                flex items-center justify-center"
              >
                <FaUsers className="text-gray-600" />
              </div>
            )}
            <div>
              <h2 className="text-white font-extrabold text-lg leading-none">
                {isEdit ? "Modifier l'équipe" : "Nouvelle équipe"}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {isEdit ? `ID #${team.id}` : "Les champs * sont requis"}
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

          {/* Nom */}
          <Field
            label="Nom de l'équipe *"
            icon={<FaUsers />}
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Ex: Gascom LoL Team"
              className={inputCls("name")}
            />
          </Field>

          {/* Jeu */}
          <Field label="Jeu *" icon={<FaGamepad />} error={errors.game}>
            <select
              value={form.game}
              onChange={set("game")}
              className={inputCls("game")}
            >
              <option value="">Choisir un jeu...</option>
              {GAMES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          {/* Logo */}
          <Field label="Logo (URL)" icon={<FaImage />}>
            <input
              type="url"
              value={form.logo}
              onChange={set("logo")}
              placeholder="https://..."
              className={inputCls()}
            />
            {form.logo && (
              <div
                className="mt-2 flex items-center gap-3 p-3 bg-[#0D0D0D]
                              rounded-xl border border-white/5"
              >
                <img
                  src={form.logo}
                  alt="logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <p className="text-gray-400 text-xs">Aperçu du logo</p>
              </div>
            )}
          </Field>

          {/* Bannière */}
          <Field label="Bannière (URL)" icon={<FaImage />}>
            <input
              type="url"
              value={form.banner}
              onChange={set("banner")}
              placeholder="https://..."
              className={inputCls()}
            />
            {form.banner && (
              <img
                src={form.banner}
                alt="banner"
                referrerPolicy="no-referrer"
                className="mt-2 w-full h-28 object-cover rounded-xl opacity-80
                              border border-white/10"
              />
            )}
          </Field>

          {/* Description */}
          <Field label="Description" icon={<FaAlignLeft />}>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Histoire de l'équipe, présentation..."
              className={`${inputCls()} resize-none`}
            />
          </Field>

          {/* Palmarès */}
          <Field label="Palmarès / Titres" icon={<FaTrophy />}>
            <textarea
              value={form.palmares}
              onChange={set("palmares")}
              rows={3}
              placeholder="- Champion Gascom LoL S1 (2024)&#10;- Top 4 Régional..."
              className={`${inputCls()} resize-none`}
            />
          </Field>

          {/* Réseaux sociaux */}
          <div>
            <p className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
              Réseaux sociaux
            </p>
            <div className="space-y-3">
              <div className="relative">
                <FaTwitter
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                       text-sky-400 text-sm pointer-events-none"
                />
                <input
                  type="url"
                  value={form.twitter}
                  onChange={set("twitter")}
                  placeholder="https://twitter.com/gascom"
                  className={`${inputCls()} pl-10`}
                />
              </div>
              <div className="relative">
                <FaFacebook
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                        text-blue-500 text-sm pointer-events-none"
                />
                <input
                  type="url"
                  value={form.facebook}
                  onChange={set("facebook")}
                  placeholder="https://facebook.com/gascom"
                  className={`${inputCls()} pl-10`}
                />
              </div>
              <div className="relative">
                <FaDiscord
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                       text-indigo-400 text-sm pointer-events-none"
                />
                <input
                  type="url"
                  value={form.discord}
                  onChange={set("discord")}
                  placeholder="https://discord.gg/gascom"
                  className={`${inputCls()} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Toggle actif */}
          <label
            className="flex items-center gap-3 p-4 bg-[#0D0D0D] rounded-xl
                            border border-white/10 cursor-pointer hover:border-white/20 transition-all"
          >
            <div
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0
                            ${form.active ? "bg-green-500" : "bg-gray-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                              transition-all ${form.active ? "left-5" : "left-1"}`}
              />
            </div>
            <input
              type="checkbox"
              checked={form.active}
              onChange={set("active")}
              className="hidden"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {form.active ? "Équipe visible" : "Équipe masquée"}
              </p>
              <p className="text-gray-500 text-xs">
                {form.active
                  ? "Affichée sur le site public"
                  : "Non visible sur le site"}
              </p>
            </div>
          </label>
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
                <FaCheck /> {isEdit ? "Enregistrer" : "Créer l'équipe"}
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

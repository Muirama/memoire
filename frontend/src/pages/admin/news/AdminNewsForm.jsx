/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaNewspaper,
  FaImage,
  FaTag,
  FaUser,
  FaAlignLeft,
  FaFileAlt,
  FaCheck,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../../../api/api";

const CATEGORIES = ["Actualité", "Tournoi", "Communauté", "Produit", "Annonce"];

const EMPTY = {
  title: "",
  content: "",
  excerpt: "",
  image: "",
  category: "Actualité",
  author: "Équipe Gascom",
  published: true,
};

export default function AdminNewsForm({ news, onClose, onSaved }) {
  const isEdit = Boolean(news);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  useEffect(() => {
    if (news) {
      setForm({
        title: news.title || "",
        content: news.content || "",
        excerpt: news.excerpt || "",
        image: news.image || "",
        category: news.category || "Actualité",
        author: news.author || "Équipe Gascom",
        published: news.published ?? true,
      });
    } else {
      setForm(EMPTY);
    }
  }, [news]);

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
    if (!form.content.trim()) e.content = "Le contenu est requis.";
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
        excerpt:
          form.excerpt.trim() || form.content.trim().slice(0, 200) + "...",
        image: form.image || null,
      };
      if (isEdit) {
        await api.put(`/news/${news.id}`, payload);
      } else {
        await api.post("/news", payload);
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
          <div>
            <h2 className="text-white font-extrabold text-lg">
              {isEdit ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {isEdit ? `ID #${news.id}` : "Les champs * sont requis"}
            </p>
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

        {/* Formulaire */}
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
          <Field label="Titre *" icon={<FaNewspaper />} error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="Ex: Gascom annonce le Championship 2025"
              className={inputCls("title")}
            />
          </Field>

          {/* Catégorie + Auteur */}
          <div className="grid grid-cols-2 gap-4">
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
            <Field label="Auteur" icon={<FaUser />}>
              <input
                type="text"
                value={form.author}
                onChange={set("author")}
                placeholder="Équipe Gascom"
                className={inputCls()}
              />
            </Field>
          </div>

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
                className="mt-2 w-full h-36 object-cover rounded-xl opacity-80"
              />
            )}
          </Field>

          {/* Extrait */}
          <Field label="Extrait (résumé)" icon={<FaFileAlt />}>
            <textarea
              value={form.excerpt}
              onChange={set("excerpt")}
              rows={2}
              placeholder="Court résumé affiché dans la liste (optionnel, généré auto sinon)"
              className={`${inputCls()} resize-none`}
            />
          </Field>

          {/* Contenu */}
          <Field
            label="Contenu *"
            icon={<FaAlignLeft />}
            error={errors.content}
          >
            <textarea
              value={form.content}
              onChange={set("content")}
              rows={10}
              placeholder="Rédigez le contenu complet de l'article..."
              className={`${inputCls("content")} resize-none leading-relaxed`}
            />
            <p className="text-gray-600 text-xs mt-1">
              {form.content.length} caractère(s)
            </p>
          </Field>

          {/* Toggle publié */}
          <label
            className="flex items-center gap-3 p-4 bg-[#0D0D0D] rounded-xl
                            border border-white/10 cursor-pointer hover:border-white/20 transition-all"
          >
            <div
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0
                            ${form.published ? "bg-green-500" : "bg-gray-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                              transition-all ${form.published ? "left-5" : "left-1"}`}
              />
            </div>
            <input
              type="checkbox"
              checked={form.published}
              onChange={set("published")}
              className="hidden"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {form.published ? "Article publié" : "Article masqué"}
              </p>
              <p className="text-gray-500 text-xs">
                {form.published
                  ? "Visible sur le site public"
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
                <FaCheck /> {isEdit ? "Enregistrer" : "Publier l'article"}
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

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaBoxOpen,
  FaTag,
  FaImage,
  FaAlignLeft,
  FaCheck,
  FaSpinner,
  FaWarehouse,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../../../api/api";

const CATEGORIES = ["Jersey", "Accessoire", "Périphérique", "Goodies", "Autre"];

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Autre",
  image: "",
};

export default function AdminProductForm({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock ?? "",
        category: product.category || "Autre",
        image: product.image || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (globalErr) setGlobalErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est requis.";
    if (!form.price) e.price = "Le prix est requis.";
    else if (isNaN(form.price) || parseFloat(form.price) <= 0)
      e.price = "Prix invalide.";
    if (form.stock !== "" && isNaN(form.stock)) e.stock = "Stock invalide.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        stock: form.stock !== "" ? parseInt(form.stock) : 0,
        category: form.category,
        image: form.image.trim() || null,
      };
      if (isEdit) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
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

  const stockNum = parseInt(form.stock);
  const stockWarning = !isNaN(stockNum) && form.stock !== "" && stockNum <= 5;

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
          <div className="flex items-center gap-3">
            {/* Aperçu miniature si image dispo */}
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg bg-[#0D0D0D] border border-white/10
                              flex items-center justify-center"
              >
                <FaBoxOpen className="text-gray-600" />
              </div>
            )}
            <div>
              <h2 className="text-white font-extrabold text-lg leading-none">
                {isEdit ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {isEdit ? `ID #${product.id}` : "Les champs * sont requis"}
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

          {/* Nom */}
          <Field
            label="Nom du produit *"
            icon={<FaBoxOpen />}
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Ex: Jersey Gascom 2025 — Taille L"
              className={inputCls("name")}
            />
          </Field>

          {/* Catégorie */}
          <Field label="Catégorie" icon={<FaTag />}>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, category: cat }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border
                              transition-all text-center
                              ${
                                form.category === cat
                                  ? "bg-[#E50914] text-white border-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.3)]"
                                  : "bg-[#0D0D0D] text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
                              }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Field>

          {/* Prix + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Prix (Ar) *"
              icon={<FaMoneyBillWave />}
              error={errors.price}
            >
              <input
                type="number"
                value={form.price}
                onChange={set("price")}
                placeholder="Ex: 150000"
                min="0"
                className={inputCls("price")}
              />
              {form.price && !errors.price && (
                <p className="text-gray-500 text-xs mt-1">
                  ≈ {new Intl.NumberFormat("fr-MG").format(form.price)} Ar
                </p>
              )}
            </Field>

            <Field label="Stock" icon={<FaWarehouse />} error={errors.stock}>
              <input
                type="number"
                value={form.stock}
                onChange={set("stock")}
                placeholder="Ex: 50"
                min="0"
                className={inputCls("stock")}
              />
              {stockWarning && (
                <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle size={10} />
                  {stockNum === 0 ? "Rupture de stock" : "Stock très faible"}
                </p>
              )}
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
              <div className="mt-2 relative rounded-xl overflow-hidden border border-white/10 h-40">
                <img
                  src={form.image}
                  alt="preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t
                                from-black/40 to-transparent"
                />
                <span
                  className="absolute bottom-2 right-2 text-xs text-white/60
                                 bg-black/40 px-2 py-0.5 rounded-full"
                >
                  Aperçu
                </span>
              </div>
            )}
          </Field>

          {/* Description */}
          <Field label="Description" icon={<FaAlignLeft />}>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              placeholder="Décrivez le produit (matière, taille, caractéristiques...)"
              className={`${inputCls()} resize-none`}
            />
            <p className="text-gray-600 text-xs mt-1">
              {form.description.length} caractère(s)
            </p>
          </Field>

          {/* Récapitulatif */}
          {(form.name || form.price) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0D0D0D] rounded-xl p-4 border border-white/5"
            >
              <p
                className="text-gray-500 text-xs uppercase font-semibold
                            tracking-wide mb-3"
              >
                Récapitulatif
              </p>
              <div className="space-y-1.5 text-sm">
                {form.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nom</span>
                    <span className="text-white font-semibold truncate max-w-[200px]">
                      {form.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Catégorie</span>
                  <span className="text-white font-semibold">
                    {form.category}
                  </span>
                </div>
                {form.price && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prix</span>
                    <span className="text-[#E50914] font-extrabold">
                      {new Intl.NumberFormat("fr-MG").format(form.price)} Ar
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock</span>
                  <span
                    className={`font-semibold ${
                      stockNum === 0
                        ? "text-red-400"
                        : stockNum <= 5
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {form.stock !== "" ? form.stock : "0"} unité(s)
                  </span>
                </div>
              </div>
            </motion.div>
          )}
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
                <FaCheck /> {isEdit ? "Enregistrer" : "Créer le produit"}
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

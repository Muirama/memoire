/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGamepad,
  FaCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import api from "../api/api";

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pseudo: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [regInfo, setRegInfo] = useState(null);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Le nom est requis.";
    if (!formData.email.trim()) e.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email invalide.";
    if (!formData.phone.trim()) e.phone = "Le téléphone est requis.";
    if (!formData.pseudo.trim()) e.pseudo = "Le pseudo est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      setErrors({});
      const res = await api.post(`/registrations/${event.id}`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        pseudo: formData.pseudo.trim(),
      });
      setRegInfo(res.data.registration);
      setSuccess(true);
      if (onSuccess) onSuccess(event.id);
    } catch (err) {
      const msg = err.response?.data?.message || "Une erreur est survenue.";
      setErrors({ global: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (errors.global) setErrors((prev) => ({ ...prev, global: "" }));
  };

  const inputCls = (field) =>
    `w-full pl-11 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg border text-sm
     transition-all focus:outline-none focus:ring-2
     ${
       errors[field]
         ? "border-red-500 focus:ring-red-500/30"
         : "border-white/10 focus:border-[#E50914] focus:ring-[#E50914]/30"
     }`;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!success ? onClose : undefined}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#E50914]/20
                   shadow-[0_0_40px_rgba(229,9,20,0.2)] z-50
                   max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5
                        border-b border-white/5 sticky top-0 bg-[#1A1A1A] z-10"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-extrabold text-lg">
              {success ? "Inscription confirmée !" : "S'inscrire"}
            </h2>
            <p className="text-[#E50914] text-sm font-semibold truncate">
              {event.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8
                       flex items-center justify-center rounded-lg
                       hover:bg-white/5 flex-shrink-0 ml-3"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            /* ── Succès ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <FaCheckCircle className="text-green-400 text-7xl mx-auto mb-5" />
              </motion.div>
              <h3 className="text-white font-extrabold text-2xl mb-2">
                Bienvenue, {formData.pseudo} !
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Votre inscription à{" "}
                <span className="text-[#E50914] font-bold">{event.title}</span>{" "}
                a bien été enregistrée. Vous serez contacté prochainement.
              </p>

              {/* Récapitulatif */}
              <div
                className="bg-[#0D0D0D] rounded-xl p-4 text-left space-y-2
                              border border-white/5 mb-6"
              >
                {[
                  ["N° inscription", `#${regInfo?.id}`],
                  ["Nom", formData.name],
                  ["Pseudo", formData.pseudo],
                  ["Email", formData.email],
                  ["Téléphone", formData.phone],
                  ["Événement", event.title],
                  ["Date", formatDate(event.date)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span
                      className={`font-semibold ${
                        label === "Pseudo" ? "text-[#E50914]" : "text-white"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Statut</span>
                  <span className="text-yellow-400 font-semibold">
                    En attente
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#E50914] hover:bg-[#FF1E56] text-white
                           font-bold rounded-xl transition-all"
              >
                Fermer
              </button>
            </motion.div>
          ) : (
            /* ── Formulaire ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Erreur globale */}
              {errors.global && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <p className="text-red-400 text-sm text-center font-semibold">
                    {errors.global}
                  </p>
                </motion.div>
              )}

              {/* Résumé événement */}
              <div
                className="bg-[#0D0D0D] rounded-xl p-3 flex items-center gap-3
                              border border-white/5"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg bg-[#1A1A1A] flex items-center
                                  justify-center flex-shrink-0"
                  >
                    <FaCalendarAlt className="text-[#E50914]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {event.title}
                  </p>
                  <p className="text-gray-500 text-xs">{event.game}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                    <FaUsers size={9} className="text-[#E50914]" />
                    {event.registered || 0} inscrit(s)
                  </p>
                </div>
              </div>

              {/* Champs */}
              {[
                {
                  name: "name",
                  label: "Nom complet *",
                  icon: <FaUser />,
                  placeholder: "Jean Dupont",
                  type: "text",
                },
                {
                  name: "pseudo",
                  label: "Pseudo gaming *",
                  icon: <FaGamepad />,
                  placeholder: "ProGamer_MG",
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email *",
                  icon: <FaEnvelope />,
                  placeholder: "jean@email.com",
                  type: "email",
                },
                {
                  name: "phone",
                  label: "Téléphone *",
                  icon: <FaPhone />,
                  placeholder: "034 00 000 00",
                  type: "tel",
                },
              ].map(({ name, label, icon, placeholder, type }) => (
                <div key={name}>
                  <label className="text-gray-400 text-xs font-semibold mb-1 block">
                    {label}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2
                                     text-gray-500 text-xs pointer-events-none"
                    >
                      {icon}
                    </span>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={inputCls(name)}
                    />
                  </div>
                  {errors[name] && (
                    <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#FF1E56] text-white
                           font-bold rounded-xl transition-all duration-300
                           hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Inscription...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Confirmer l'inscription
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

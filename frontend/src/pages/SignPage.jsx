/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaGamepad,
} from "react-icons/fa";
import api from "../api/api";
import { getRedirectAfterAuth, storeAuthSession } from "../utils/auth";
import {
  validatePhone,
  formatPhone,
  cleanPhone,
} from "../utils/phoneValidation";

export default function SignPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectAfterAuth(location.search, "/");

  const [formData, setFormData] = useState({
    name: "",
    pseudo: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Validation ──────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Le nom doit contenir au moins 3 caractères";

    if (!formData.pseudo.trim()) newErrors.pseudo = "Le pseudo est requis";
    else if (formData.pseudo.trim().length < 3)
      newErrors.pseudo = "Le pseudo doit contenir au moins 3 caractères";

    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";

    // ── Validation téléphone via utilitaire ───────────────
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8)
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password =
        "Le mot de passe doit contenir majuscule, minuscule et chiffre";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    if (!formData.acceptTerms)
      newErrors.acceptTerms =
        "Vous devez accepter les conditions d'utilisation";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Soumission ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        pseudo: formData.pseudo.trim(),
        email: formData.email.trim(),
        phone: cleanPhone(formData.phone), // envoyer sans espaces
        address: formData.address.trim(),
        password: formData.password,
      });
      storeAuthSession(response.data);
      navigate(redirectTo);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        global: error.response?.data?.message || "Erreur lors de l'inscription",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Changement de champ ─────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Formatage automatique du téléphone pendant la saisie
    const finalValue =
      name === "phone"
        ? formatPhone(value)
        : type === "checkbox"
          ? checked
          : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (errors.global) setErrors((prev) => ({ ...prev, global: "" }));
  };

  // ── Force du mot de passe ───────────────────────────────
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { strength: 0, label: "" };
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const labels = ["", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];
    return { strength: s, label: labels[s], color: colors[s] };
  };
  const passwordStrength = getPasswordStrength();

  // ── Compteur chiffres téléphone ─────────────────────────
  const phoneDigits = cleanPhone(formData.phone).length;

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10 flex items-center justify-center"
    >
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1A1A] rounded-2xl border border-[#E50914]/30 p-8 md:p-10
                     shadow-[0_0_50px_rgba(229,9,20,0.3)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16
                            bg-[#E50914] rounded-full mb-4"
            >
              <img
                src="/LOGO/Logo_GES_rouge.svg"
                alt="Gascom Logo"
                className="absolute w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Inscription
            </h1>
            <p className="text-gray-400">
              Créez votre compte <span className="text-[#E50914]">Gascom</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.global && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center font-semibold">
                  {errors.global}
                </p>
              </div>
            )}

            {/* Nom */}
            <Field label="Nom complet" error={errors.name}>
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                className={inputClass(errors.name)}
              />
            </Field>

            {/* Pseudo */}
            <Field label="Pseudo gaming" error={errors.pseudo}>
              <FaGamepad className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                placeholder="Votre pseudo"
                className={inputClass(errors.pseudo)}
              />
            </Field>

            {/* Email */}
            <Field label="Email" error={errors.email}>
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={inputClass(errors.email)}
              />
            </Field>

            {/* Téléphone avec compteur + hint opérateurs */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Téléphone <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="034 23 405 14"
                  maxLength={14} /* "034 23 405 14" = 14 chars avec espaces */
                  className={`${inputClass(errors.phone)} pr-16`}
                />
              </div>
              {/* Hint opérateurs */}
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Adresse
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-500" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adresse de livraison"
                  rows={2}
                  className="w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg
                             border border-[#E50914]/30 focus:border-[#E50914]
                             focus:outline-none focus:ring-2 focus:ring-[#E50914]/50
                             transition-all resize-none"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Mot de passe <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all
                                    ${
                                      level <= passwordStrength.strength
                                        ? passwordStrength.color
                                        : "bg-gray-700"
                                    }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {passwordStrength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirmer le mot de passe{" "}
                <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-white transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* CGU */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded transition-all
                                   ${
                                     formData.acceptTerms
                                       ? "bg-[#E50914] border-[#E50914]"
                                       : "border-gray-600 group-hover:border-[#E50914]"
                                   }`}
                  >
                    {formData.acceptTerms && (
                      <FaCheckCircle className="text-white text-sm" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  J'accepte les conditions d'utilisation
                  <span className="text-[#E50914]"> *</span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E50914] hover:bg-[#FF1E56] text-white font-bold
                         py-3 rounded-lg transition-all duration-300
                         hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent
                                  rounded-full animate-spin"
                  />
                  Création du compte...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Vous avez déjà un compte ?{" "}
              <Link
                to={`/login${location.search}`}
                className="text-[#E50914] hover:text-[#FF1E56] font-semibold transition"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label} <span className="text-[#E50914]">*</span>
      </label>
      <div className="relative">{children}</div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full pl-12 pr-12 py-3 bg-[#0D0D0D] text-white rounded-lg border ${
    error
      ? "border-red-500 focus:border-red-500"
      : "border-[#E50914]/30 focus:border-[#E50914]"
  } focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all`;
}

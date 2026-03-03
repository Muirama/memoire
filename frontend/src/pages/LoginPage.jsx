/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Validation ────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6)
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Soumission ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Sauvegarder le token et les infos admin
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.admin.name);

      // Rediriger vers le panel admin
      navigate("/admin");
    } catch (err) {
      setErrors({
        global:
          err.response?.data?.message || "Email ou mot de passe incorrect.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (errors.global) setErrors((prev) => ({ ...prev, global: "" }));
  };

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
          {/* ── Header ── */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16
                            bg-[#E50914] rounded-full mb-4 relative"
            >
              <img
                src="/LOGO/Logo_GES_rouge.svg"
                alt="Gascom Logo"
                className="absolute w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Connexion
            </h1>
            <p className="text-gray-400">
              Accédez à votre compte{" "}
              <span className="text-[#E50914]">Gascom</span>
            </p>
          </div>

          {/* ── Formulaire ── */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2
                                        text-gray-500 pointer-events-none"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@gascom.mg"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white
                              rounded-lg border transition-all focus:outline-none
                              focus:ring-2 ${
                                errors.email
                                  ? "border-red-500 focus:ring-red-500/30"
                                  : "border-[#E50914]/30 focus:border-[#E50914] focus:ring-[#E50914]/50"
                              }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Mot de passe <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-4 top-1/2 -translate-y-1/2
                                    text-gray-500 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-12 pr-12 py-3 bg-[#0D0D0D] text-white
                              rounded-lg border transition-all focus:outline-none
                              focus:ring-2 ${
                                errors.password
                                  ? "border-red-500 focus:ring-red-500/30"
                                  : "border-[#E50914]/30 focus:border-[#E50914] focus:ring-[#E50914]/50"
                              }`}
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
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Bouton Submit */}
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1A1A1A] text-gray-500">
                Espace réservé aux administrateurs
              </span>
            </div>
          </div>

          {/* ── Info admin ── */}
          <div
            className="mt-6 bg-[#0D0D0D] border border-white/5 rounded-xl
                          px-4 py-3 text-center"
          >
            <p className="text-gray-500 text-xs">
              🔒 Accès restreint — Panel d'administration Gascom
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

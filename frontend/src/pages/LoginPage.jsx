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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.admin.name);
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* ── Continuer avec ── */}
          <div className="mt-8">
            <div className="relative flex items-center mb-5">
              <div className="flex-1 border-t border-white/10" />
              <span
                className="px-4 text-gray-600 text-xs font-semibold
                               uppercase tracking-widest"
              >
                Continuer avec
              </span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                type="button"
                title="Bientôt disponible"
                className="flex items-center justify-center gap-2 py-2.5 px-3
                           bg-[#0D0D0D] border border-white/10 rounded-xl
                           opacity-60 cursor-not-allowed transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-500 text-xs font-semibold hidden sm:block">
                  Google
                </span>
              </button>

              {/* Discord */}
              <button
                type="button"
                title="Bientôt disponible"
                className="flex items-center justify-center gap-2 py-2.5 px-3
                           bg-[#0D0D0D] border border-white/10 rounded-xl
                           opacity-60 cursor-not-allowed transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path
                    fill="#5865F2"
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                  />
                </svg>
                <span className="text-gray-500 text-xs font-semibold hidden sm:block">
                  Discord
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                title="Bientôt disponible"
                className="flex items-center justify-center gap-2 py-2.5 px-3
                           bg-[#0D0D0D] border border-white/10 rounded-xl
                           opacity-60 cursor-not-allowed transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span className="text-gray-500 text-xs font-semibold hidden sm:block">
                  Facebook
                </span>
              </button>
            </div>

            <p className="text-center text-gray-700 text-xs mt-3">
              Connexion sociale — bientôt disponible
            </p>
          </div>

          {/* ── Lien Signup ── */}
          <div
            className="mt-6 bg-[#0D0D0D] border border-white/5 rounded-xl
                          px-4 py-3.5 flex items-center justify-center gap-2"
          >
            <p className="text-gray-500 text-sm">Pas encore de compte ?</p>
            <Link
              to="/sign"
              className="text-[#E50914] font-bold text-sm hover:text-[#FF1E56]
                         hover:underline transition-all"
            >
              S'inscrire
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

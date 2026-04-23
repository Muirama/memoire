/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";
import { getRedirectAfterAuth, storeAuthSession } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = getRedirectAfterAuth(location.search, "/");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6)
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caracteres";
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

      const { role } = res.data;
      storeAuthSession(res.data);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
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
              Accedez a votre compte <span className="text-[#E50914]">Gascom</span>
            </p>
          </div>

          {redirectTo !== "/" && (
            <div className="mb-6 bg-[#E50914]/10 border border-[#E50914]/20 rounded-lg p-3">
              <p className="text-[#FF848B] text-sm text-center">
                Connectez-vous pour continuer cette action.
              </p>
            </div>
          )}

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

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Mot de passe <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div
            className="mt-6 bg-[#0D0D0D] border border-white/5 rounded-xl
                          px-4 py-3.5 flex items-center justify-center gap-2"
          >
            <p className="text-gray-500 text-sm">Pas encore de compte ?</p>
            <Link
              to={`/sign${location.search}`}
              className="text-[#E50914] font-bold text-sm hover:text-[#FF1E56]
                         hover:underline transition-all"
            >
              S'inscrire →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

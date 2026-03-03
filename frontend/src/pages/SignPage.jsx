/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGamepad,
  FaCheckCircle,
} from "react-icons/fa";

export default function SignPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validation nom
    if (!formData.name) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    // Validation email
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation password
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir majuscule, minuscule et chiffre";
    }

    // Validation confirmation password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Validation terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      // Simuler une requête API
      setTimeout(() => {
        console.log("Sign up:", formData);
        setIsLoading(false);
        // Redirection après inscription réussie
        navigate("/login");
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10 flex items-center justify-center">
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1A1A] rounded-2xl border border-[#E50914]/30 p-8 md:p-10 shadow-[0_0_50px_rgba(229,9,20,0.3)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E50914] rounded-full mb-4">
              {/* <FaGamepad className="text-3xl text-white" /> */}
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
              Rejoignez la communauté{" "}
              <span className="text-[#E50914]">Gascom</span>
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Nom d'utilisateur <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre pseudo"
                  className={`w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg border ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E50914]/30 focus:border-[#E50914]"
                  } focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all`}
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={`w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E50914]/30 focus:border-[#E50914]"
                  } focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all`}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Mot de passe <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-[#0D0D0D] text-white rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E50914]/30 focus:border-[#E50914]"
                  } focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
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
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Confirmer le mot de passe{" "}
                <span className="text-[#E50914]">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-[#0D0D0D] text-white rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E50914]/30 focus:border-[#E50914]"
                  } focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms & Conditions */}
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
                    className={`w-5 h-5 border-2 rounded transition-all ${
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
                  J'accepte les{" "}
                  <Link
                    to="/terms"
                    className="text-[#E50914] hover:text-[#FF1E56] transition"
                  >
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    to="/privacy"
                    className="text-[#E50914] hover:text-[#FF1E56] transition"
                  >
                    politique de confidentialité
                  </Link>
                  <span className="text-[#E50914]"> *</span>
                </span>
              </label>
              {errors.acceptTerms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.acceptTerms}
                </motion.p>
              )}
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E50914] hover:bg-[#FF1E56] text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Inscription...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
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

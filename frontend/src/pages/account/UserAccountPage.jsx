/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGamepad,
  FaSave,
  FaSpinner,
  FaShoppingBag,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/api";
import {
  buildLoginRedirect,
  isUserLoggedIn,
  clearAuthSession,
} from "../../utils/auth";
import {
  cleanPhone,
  formatPhone,
  validatePhone,
} from "../../utils/phoneValidation";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-MG").format(Number(price) || 0) + " Ar";

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getStatusClasses = (status = "") => {
  const normalized = status.toLowerCase();

  if (normalized.includes("confirm")) {
    return "bg-green-500/15 text-green-400 border border-green-500/30";
  }

  if (normalized.includes("attente") || normalized.includes("pending")) {
    return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
  }

  if (normalized.includes("annul") || normalized.includes("cancel")) {
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  }

  return "bg-gray-500/15 text-gray-300 border border-gray-500/30";
};

export default function UserAccountPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orders, setOrders] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    pseudo: "",
    email: "",
    phone: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const hydrateProfile = (user) => {
    setFormData({
      name: user?.name || "",
      pseudo: user?.pseudo || "",
      email: user?.email || "",
      phone: formatPhone(user?.phone || ""),
      address: user?.address || "",
    });
  };

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate(buildLoginRedirect("/account"), { replace: true });
      return;
    }

    let active = true;

    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileRes, ordersRes, regsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/orders/me"),
          api.get("/registrations/me"),
        ]);

        if (!active) return;

        const user = profileRes.data?.user;
        hydrateProfile(user);
        setOrders(ordersRes.data?.orders || []);
        setRegistrations(regsRes.data?.registrations || []);
      } catch (err) {
        if (!active) return;

        const status = err.response?.status;
        if (status === 401) {
          clearAuthSession();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Impossible de charger votre espace utilisateur.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAccountData();

    return () => {
      active = false;
    };
  }, [navigate]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Le nom est requis.";
    }

    if (!formData.pseudo.trim()) {
      nextErrors.pseudo = "Le pseudo est requis.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      nextErrors.email = "Email invalide.";
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      nextErrors.phone = phoneError;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const finalValue = name === "phone" ? formatPhone(value) : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (success) setSuccess("");
    if (error) setError("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        pseudo: formData.pseudo.trim(),
        email: formData.email.trim(),
        phone: cleanPhone(formData.phone),
        address: formData.address.trim(),
      };

      const response = await api.patch("/auth/me", payload);
      const updatedUser = response.data?.user;

      if (updatedUser) {
        hydrateProfile(updatedUser);
        localStorage.setItem("userName", updatedUser.name || "");
        localStorage.setItem("userPseudo", updatedUser.pseudo || "");
      }

      setSuccess(response.data?.message || "Profil mis a jour avec succes.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de mettre a jour votre profil.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Chargement de votre compte...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Mon <span className="text-[#E50914]">compte</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Modifiez vos informations, suivez vos commandes et vos inscriptions.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <FaExclamationCircle /> {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <FaCheckCircle /> {success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-1 bg-[#1A1A1A] rounded-2xl border border-white/5 p-6"
          >
            <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
              <FaUser className="text-[#E50914]" /> Profil
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <InputField
                icon={<FaUser />}
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={fieldErrors.name}
                required
              />

              <InputField
                icon={<FaGamepad />}
                label="Pseudo"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleInputChange}
                error={fieldErrors.pseudo}
                required
              />

              <InputField
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={fieldErrors.email}
                required
              />

              <InputField
                icon={<FaPhone />}
                label="Telephone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={fieldErrors.phone}
                placeholder="034 23 405 14"
                required
              />

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-500" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Adresse de livraison"
                    className="w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg
                               border border-white/10 focus:border-[#E50914]
                               focus:ring-2 focus:ring-[#E50914]/40 focus:outline-none
                               transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#E50914] hover:bg-[#FF1E56] text-white
                           font-bold py-3 rounded-lg transition-all duration-300
                           hover:shadow-[0_0_20px_rgba(229,9,20,0.5)]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave /> Sauvegarder
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6"
            >
              <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
                <FaShoppingBag className="text-[#E50914]" /> Mes commandes
              </h2>

              {orders.length === 0 ? (
                <EmptyState text="Aucune commande pour le moment." />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-white/5 bg-[#0D0D0D] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <p className="text-white font-bold text-sm md:text-base">
                          Commande #{order.id}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusClasses(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                        <p className="text-gray-400 flex items-center gap-2">
                          <FaClock className="text-[#E50914]" />
                          {formatDateTime(order.createdAt)}
                        </p>
                        <p className="text-[#E50914] font-bold text-right sm:text-left">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-black/25 border border-white/5 px-3 py-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                          Produits
                        </p>
                        <p className="text-gray-300 text-sm whitespace-pre-line">
                          {(order.itemsSummary || "-").split(" | ").join("\n")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6"
            >
              <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
                <FaCalendarAlt className="text-[#E50914]" /> Mes evenements
              </h2>

              {registrations.length === 0 ? (
                <EmptyState text="Aucune inscription a un evenement pour le moment." />
              ) : (
                <div className="space-y-4">
                  {registrations.map((registration) => {
                    const event = registration.Event;
                    return (
                      <div
                        key={registration.id}
                        className="rounded-xl border border-white/5 bg-[#0D0D0D] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div>
                            <p className="text-white font-bold text-sm md:text-base">
                              {event?.title || "Evenement"}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {event?.game || "Jeu non precise"} - {event?.category || "-"}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusClasses(registration.status)}`}
                          >
                            {registration.status}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <p className="text-gray-400 flex items-center gap-2">
                            <FaCalendarAlt className="text-[#E50914]" />
                            Date event: {formatDate(event?.date)}
                          </p>
                          <p className="text-gray-400 flex items-center gap-2">
                            <FaClock className="text-[#E50914]" />
                            Inscrit le: {formatDateTime(registration.createdAt)}
                          </p>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            {registration.status?.toLowerCase().includes("attente")
                              ? "Votre inscription est en liste d'attente."
                              : "Votre inscription a ete traitee."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="text-gray-300 text-sm font-semibold block mb-2">
        {label}
        {required ? <span className="text-[#E50914]"> *</span> : null}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg border
            focus:outline-none focus:ring-2 transition-all
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "border-white/10 focus:border-[#E50914] focus:ring-[#E50914]/40"
            }`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center">
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

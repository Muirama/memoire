/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGamepad,
  FaSpinner,
  FaCalendarAlt,
  FaUsers,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

import SuccessModal from "./ui/SuccessModal";
import api from "../api/api";

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState(false);
  const [regInfo, setRegInfo] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await api.get("/auth/me");

        if (active) setProfile(res.data.user);
      } catch (err) {
        if (active) {
          setErrors({
            global:
              err.response?.data?.message ||
              "Impossible de charger votre profil.",
          });
        }
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  const profileIncomplete =
    profile &&
    (!profile.name || !profile.email || !profile.phone || !profile.pseudo);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (profileIncomplete) {
      setErrors({
        global:
          "Votre profil est incomplet. Nom, email, téléphone et pseudo sont requis.",
      });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await api.post(`/registrations/${event.id}`);

      setRegInfo(res.data.registration);
      setSuccess(true);

      if (onSuccess) onSuccess(event.id);
    } catch (err) {
      setErrors({
        global: err.response?.data?.message || "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessModal
        event={event}
        profile={profile}
        regInfo={regInfo}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* MODAL FORM */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed top-20 left-1/2 -translate-x-1/2
             w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#E50914]/20
             shadow-[0_0_40px_rgba(229,9,20,0.2)] z-50
             max-h-[85vh]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#1A1A1A] z-10">
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-extrabold text-lg">S'inscrire</h2>
            <p className="text-[#E50914] text-sm font-semibold truncate">
              {event.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {loadingProfile ? (
            <div className="text-center py-10">
              <FaSpinner className="text-[#E50914] text-4xl animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Chargement du profil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ERROR */}
              {errors.global && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center font-semibold">
                    {errors.global}
                  </p>
                </div>
              )}

              {/* EVENT INFO */}
              <div className="bg-[#0D0D0D] rounded-xl p-3 flex items-center gap-3 border border-white/5">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <FaCalendarAlt className="text-[#E50914]" />
                )}

                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">
                    {event.title}
                  </p>
                  <p className="text-gray-500 text-xs">{event.game}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <FaUsers className="text-[#E50914]" />
                    {event.registered || 0} inscrit(s)
                  </p>
                </div>
              </div>

              {/* PROFILE */}
              <div className="bg-[#0D0D0D] rounded-xl border border-white/5 p-4 space-y-3">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  <FaLock className="text-[#E50914]" />
                  Infos de votre compte
                </p>

                <ProfileRow
                  icon={<FaUser />}
                  label="Nom"
                  value={profile?.name}
                />
                <ProfileRow
                  icon={<FaGamepad />}
                  label="Pseudo"
                  value={profile?.pseudo}
                />
                <ProfileRow
                  icon={<FaEnvelope />}
                  label="Email"
                  value={profile?.email}
                />
                <ProfileRow
                  icon={<FaPhone />}
                  label="Téléphone"
                  value={profile?.phone}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || profileIncomplete}
                className="w-full py-3.5 bg-[#E50914] text-white font-bold rounded-xl disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="inline mr-2" />
                    Confirmer l'inscription
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* PROFILE ROW */
function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-[#E50914] mt-0.5">{icon}</span>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white font-semibold">{value || "Non renseigné"}</p>
      </div>
    </div>
  );
}

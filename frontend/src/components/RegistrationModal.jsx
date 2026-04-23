/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
  FaLock,
} from "react-icons/fa";
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
        if (active) {
          setProfile(res.data.user);
        }
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const profileIncomplete =
    profile && (!profile.name || !profile.email || !profile.phone || !profile.pseudo);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (profileIncomplete) {
      setErrors({
        global:
          "Votre profil est incomplet. Nom, email, telephone et pseudo sont requis.",
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
      const msg = err.response?.data?.message || "Une erreur est survenue.";
      setErrors({ global: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!success ? onClose : undefined}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

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
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#1A1A1A] z-10">
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-extrabold text-lg">
              {success ? "Inscription confirmee !" : "S'inscrire"}
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
                Bienvenue, {profile?.pseudo} !
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Votre inscription a <span className="text-[#E50914] font-bold">{event.title}</span>{" "}
                a bien ete enregistree. Vous serez contacte prochainement.
              </p>

              <div className="bg-[#0D0D0D] rounded-xl p-4 text-left space-y-2 border border-white/5 mb-6">
                {[
                  ["N° inscription", `#${regInfo?.id}`],
                  ["Nom", profile?.name],
                  ["Pseudo", profile?.pseudo],
                  ["Email", profile?.email],
                  ["Telephone", profile?.phone],
                  ["Evenement", event.title],
                  ["Date", formatDate(event.date)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500">{label}</span>
                    <span
                      className={`font-semibold text-right ${
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
          ) : loadingProfile ? (
            <div className="text-center py-10">
              <FaSpinner className="text-[#E50914] text-4xl animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Chargement de votre profil...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="bg-[#0D0D0D] rounded-xl p-3 flex items-center gap-3 border border-white/5">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
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

              <div className="bg-[#0D0D0D] rounded-xl border border-white/5 p-4 space-y-3">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  <FaLock className="text-[#E50914]" />
                  Informations utilisees depuis votre compte
                </p>
                <ProfileRow icon={<FaUser />} label="Nom" value={profile?.name} />
                <ProfileRow icon={<FaGamepad />} label="Pseudo" value={profile?.pseudo} />
                <ProfileRow icon={<FaEnvelope />} label="Email" value={profile?.email} />
                <ProfileRow icon={<FaPhone />} label="Telephone" value={profile?.phone} />
              </div>

              <motion.button
                type="submit"
                disabled={loading || profileIncomplete}
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

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-[#E50914] mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white font-semibold">{value || "Non renseigne"}</p>
      </div>
    </div>
  );
}

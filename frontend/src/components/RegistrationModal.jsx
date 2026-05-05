/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaPlus,
  FaTrash,
  FaShieldAlt,
} from "react-icons/fa";
import SuccessModal from "./ui/SuccessModal";
import api from "../api/api";

const SQUAD_MIN = 5;
const SQUAD_MAX = 7;

// Coéquipier vide
const emptyTeammate = () => ({ pseudo: "", name: "", phone: "" });

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const isSquad = event?.category === "Squad";

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState(false);
  const [regInfo, setRegInfo] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});

  // Coéquipiers — min 4, max 6 (capitaine non compris)
  const [teammates, setTeammates] = useState(
    isSquad ? Array.from({ length: SQUAD_MIN - 1 }, emptyTeammate) : [],
  );

  // ── Fetch profil ────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await api.get("/auth/me");
        if (active) setProfile(res.data.user);
      } catch (err) {
        if (active)
          setErrors({
            global:
              err.response?.data?.message ||
              "Impossible de charger votre profil.",
          });
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

  // ── Gestion coéquipiers ─────────────────────────────────
  const addTeammate = () => {
    if (teammates.length < SQUAD_MAX - 1) {
      setTeammates((p) => [...p, emptyTeammate()]);
    }
  };

  const removeTeammate = (idx) => {
    if (teammates.length > SQUAD_MIN - 1) {
      setTeammates((p) => p.filter((_, i) => i !== idx));
      // Nettoyer les erreurs de ce coéquipier
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`tm_${idx}_pseudo`];
        delete next[`tm_${idx}_phone`];
        return next;
      });
    }
  };

  const updateTeammate = (idx, field, value) => {
    setTeammates((p) =>
      p.map((tm, i) => (i === idx ? { ...tm, [field]: value } : tm)),
    );
    setErrors((prev) => ({ ...prev, [`tm_${idx}_${field}`]: "" }));
  };

  // ── Validation ──────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (isSquad) {
      const total = teammates.length + 1;
      if (total < SQUAD_MIN || total > SQUAD_MAX) {
        newErrors.global = `L'équipe doit avoir entre ${SQUAD_MIN} et ${SQUAD_MAX} membres (vous inclus).`;
      }
      teammates.forEach((tm, i) => {
        if (!tm.pseudo.trim()) newErrors[`tm_${i}_pseudo`] = "Pseudo requis";
        if (!tm.phone.trim()) newErrors[`tm_${i}_phone`] = "Téléphone requis";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Soumission ──────────────────────────────────────────
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (profileIncomplete) {
      setErrors({
        global:
          "Votre profil est incomplet. Nom, email, téléphone et pseudo sont requis.",
      });
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      const payload = isSquad
        ? {
            teammates: teammates.map((tm) => ({
              pseudo: tm.pseudo.trim(),
              name: tm.name.trim() || null,
              phone: tm.phone.trim(),
            })),
          }
        : {};

      const res = await api.post(`/registrations/${event.id}`, payload);

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

  const totalMembers = teammates.length + 1;
  const canAddMore = teammates.length < SQUAD_MAX - 1;
  const canRemove = teammates.length > SQUAD_MIN - 1;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed top-20 left-1/2 -translate-x-1/2
             w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#E50914]/20
             shadow-[0_0_40px_rgba(229,9,20,0.2)] z-50
             flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
                     border-b border-white/5 flex-shrink-0"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-extrabold text-lg">S'inscrire</h2>
              {/* Badge type */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold border
                               ${
                                 isSquad
                                   ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                   : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                               }`}
              >
                {isSquad ? `Squad (${totalMembers}/${SQUAD_MAX})` : "Solo"}
              </span>
            </div>
            <p className="text-[#E50914] text-sm font-semibold truncate">
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8
                       flex items-center justify-center flex-shrink-0"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loadingProfile ? (
            <div className="text-center py-10">
              <FaSpinner className="text-[#E50914] text-4xl animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Chargement du profil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Erreur globale */}
              {errors.global && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center font-semibold">
                    {errors.global}
                  </p>
                </div>
              )}

              {/* Info événement */}
              <div className="bg-[#0D0D0D] rounded-xl p-3 flex items-center gap-3 border border-white/5">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <FaCalendarAlt className="text-[#E50914] text-2xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {event.title}
                  </p>
                  <p className="text-gray-500 text-xs">{event.game}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <FaUsers className="text-[#E50914]" size={10} />
                    {event.registered || 0} inscrit(s)
                  </p>
                </div>
              </div>

              {/* ── Capitaine (profil) ── */}
              <div className="bg-[#0D0D0D] rounded-xl border border-white/5 p-4 space-y-3">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  {isSquad ? (
                    <>
                      <FaShieldAlt className="text-[#E50914]" /> Capitaine
                      (vous)
                    </>
                  ) : (
                    <>
                      <FaLock className="text-[#E50914]" /> Infos de votre
                      compte
                    </>
                  )}
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

              {/* ── Coéquipiers (squad uniquement) ── */}
              {isSquad && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-sm flex items-center gap-2">
                      <FaUsers className="text-[#E50914]" />
                      Coéquipiers
                      <span className="text-gray-500 font-normal text-xs">
                        ({teammates.length} / {SQUAD_MAX - 1} max)
                      </span>
                    </p>
                    {/* Barre de progression équipe */}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full
                                     ${
                                       totalMembers >= SQUAD_MIN &&
                                       totalMembers <= SQUAD_MAX
                                         ? "text-green-400 bg-green-500/10"
                                         : "text-yellow-400 bg-yellow-500/10"
                                     }`}
                    >
                      {totalMembers} membre{totalMembers > 1 ? "s" : ""}
                    </span>
                  </div>

                  <AnimatePresence>
                    {teammates.map((tm, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0D0D0D] rounded-xl border border-white/5 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                            Coéquipier {idx + 1}
                          </p>
                          {canRemove && (
                            <button
                              type="button"
                              onClick={() => removeTeammate(idx)}
                              className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20
                                         text-red-400 flex items-center justify-center transition"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {/* Pseudo */}
                          <div>
                            <div className="relative">
                              <FaGamepad
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-gray-500 pointer-events-none"
                                size={12}
                              />
                              <input
                                type="text"
                                placeholder="Pseudo *"
                                value={tm.pseudo}
                                onChange={(e) =>
                                  updateTeammate(idx, "pseudo", e.target.value)
                                }
                                className={`w-full pl-9 pr-3 py-2 bg-[#1A1A1A] text-white text-sm
                                           rounded-lg border transition focus:outline-none
                                           ${
                                             errors[`tm_${idx}_pseudo`]
                                               ? "border-red-500"
                                               : "border-white/10 focus:border-[#E50914]"
                                           }`}
                              />
                            </div>
                            {errors[`tm_${idx}_pseudo`] && (
                              <p className="text-red-400 text-xs mt-1">
                                {errors[`tm_${idx}_pseudo`]}
                              </p>
                            )}
                          </div>

                          {/* Nom (optionnel) */}
                          <div className="relative">
                            <FaUser
                              className="absolute left-3 top-1/2 -translate-y-1/2
                                         text-gray-500 pointer-events-none"
                              size={12}
                            />
                            <input
                              type="text"
                              placeholder="Nom complet (optionnel)"
                              value={tm.name}
                              onChange={(e) =>
                                updateTeammate(idx, "name", e.target.value)
                              }
                              className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] text-white text-sm
                                         rounded-lg border border-white/10 focus:border-[#E50914]
                                         transition focus:outline-none"
                            />
                          </div>

                          {/* Téléphone */}
                          <div>
                            <div className="relative">
                              <FaPhone
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-gray-500 pointer-events-none"
                                size={12}
                              />
                              <input
                                type="tel"
                                placeholder="Téléphone *"
                                value={tm.phone}
                                onChange={(e) =>
                                  updateTeammate(idx, "phone", e.target.value)
                                }
                                className={`w-full pl-9 pr-3 py-2 bg-[#1A1A1A] text-white text-sm
                                           rounded-lg border transition focus:outline-none
                                           ${
                                             errors[`tm_${idx}_phone`]
                                               ? "border-red-500"
                                               : "border-white/10 focus:border-[#E50914]"
                                           }`}
                              />
                            </div>
                            {errors[`tm_${idx}_phone`] && (
                              <p className="text-red-400 text-xs mt-1">
                                {errors[`tm_${idx}_phone`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Bouton ajouter */}
                  {canAddMore && (
                    <button
                      type="button"
                      onClick={addTeammate}
                      className="w-full py-2.5 border border-dashed border-white/20
                                 hover:border-[#E50914]/40 text-gray-500 hover:text-[#E50914]
                                 rounded-xl text-sm font-semibold transition flex items-center
                                 justify-center gap-2"
                    >
                      <FaPlus size={11} /> Ajouter un coéquipier
                    </button>
                  )}

                  {/* Aide compteur */}
                  <p className="text-gray-600 text-xs text-center">
                    Équipe de {SQUAD_MIN} à {SQUAD_MAX} membres (vous inclus) —
                    actuellement{" "}
                    <span
                      className={`font-bold
                      ${totalMembers >= SQUAD_MIN ? "text-green-400" : "text-yellow-400"}`}
                    >
                      {totalMembers}
                    </span>
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || profileIncomplete}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#FF1E56] text-white
                           font-bold rounded-xl transition disabled:opacity-50
                           flex items-center justify-center gap-2
                           hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
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
              </button>
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
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white font-semibold">{value || "Non renseigné"}</p>
      </div>
    </div>
  );
}

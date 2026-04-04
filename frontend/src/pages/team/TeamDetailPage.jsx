/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaGamepad,
  FaUsers,
  FaSpinner,
  FaTrophy,
  FaTwitter,
  FaFacebook,
  FaDiscord,
  FaGlobe,
} from "react-icons/fa";
import api from "../../api/api";

const STATUS_COLORS = {
  Titulaire: "bg-green-500/20 text-green-400 border-green-500/30",
  Remplaçant: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Coach: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Grouper joueurs par statut
const ORDER_STATUS = ["Titulaire", "Remplaçant", "Coach", "Manager"];

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/teams/${id}`)
      .then((r) => setTeam(r.data.team))
      .catch(() => setError("Équipe introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <section
        className="relative bg-transparent min-h-screen flex items-center
                        justify-center z-10"
      >
        <FaSpinner className="text-[#E50914] text-5xl animate-spin" />
      </section>
    );

  if (error || !team)
    return (
      <section
        className="relative bg-transparent min-h-screen flex items-center
                        justify-center z-10"
      >
        <div className="text-center">
          <p className="text-red-400 text-xl mb-6">{error}</p>
          <button
            onClick={() => navigate("/team")}
            className="px-6 py-3 bg-[#E50914] text-white rounded-xl
                     flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour aux équipes
          </button>
        </div>
      </section>
    );

  const players = team.players || [];

  // Grouper par statut
  const grouped = ORDER_STATUS.reduce((acc, status) => {
    const group = players.filter((p) => p.status === status);
    if (group.length > 0) acc[status] = group;
    return acc;
  }, {});

  return (
    <section className="relative bg-transparent min-h-screen z-10">
      {/* ── Hero / Bannière ── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {team.banner ? (
          <img
            src={team.banner}
            alt={`${team.name} banner`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-[#E50914]/30
                          via-[#730b0b]/20 to-[#0D0D0D]"
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t
                        from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent"
        />

        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/team")}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/70
                     hover:text-white transition font-semibold group text-sm
                     bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20 -mt-24 relative z-10">
        {/* ── Infos équipe ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 items-start mb-12"
        >
          {/* Logo */}
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden
                          border-4 border-[#0D0D0D] bg-[#111111] flex-shrink-0
                          shadow-2xl mx-auto md:mx-0"
          >
            {team.logo ? (
              <img
                src={team.logo}
                alt={team.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center
                                bg-[#E50914]/10"
              >
                <FaUsers className="text-[#E50914] text-3xl" />
              </div>
            )}
          </div>

          {/* Texte */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {team.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start mb-3">
              <span className="flex items-center gap-1.5 text-[#E50914] font-semibold text-sm">
                <FaGamepad size={12} /> {team.game}
              </span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                <FaUsers size={12} /> {players.length} joueur(s)
              </span>
            </div>

            {team.description && (
              <p className="text-gray-300 leading-relaxed max-w-2xl">
                {team.description}
              </p>
            )}

            {/* Réseaux sociaux */}
            {(team.twitter || team.facebook || team.discord) && (
              <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                {team.twitter && (
                  <a
                    href={team.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-sky-500/10 border border-sky-500/20 text-sky-400
                                hover:bg-sky-500/20 transition text-xs font-semibold"
                  >
                    <FaTwitter /> Twitter
                  </a>
                )}
                {team.facebook && (
                  <a
                    href={team.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-blue-500/10 border border-blue-500/20 text-blue-400
                                hover:bg-blue-500/20 transition text-xs font-semibold"
                  >
                    <FaFacebook /> Facebook
                  </a>
                )}
                {team.discord && (
                  <a
                    href={team.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-indigo-500/10 border border-indigo-500/20 text-indigo-400
                                hover:bg-indigo-500/20 transition text-xs font-semibold"
                  >
                    <FaDiscord /> Discord
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Palmarès */}
          {team.palmares && (
            <div
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-5
                            min-w-[220px] flex-shrink-0"
            >
              <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
                <FaTrophy className="text-yellow-400" /> Palmarès
              </h3>
              <div className="space-y-1.5">
                {team.palmares
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <p
                      key={i}
                      className="text-gray-300 text-xs leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">
                        ▸
                      </span>
                      {line.replace(/^[-•▸]\s*/, "")}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Roster par statut ── */}
        {players.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="text-gray-700 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-xl">
              Aucun joueur dans cette équipe.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([status, group], sectionIndex) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {/* Titre section */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-white font-extrabold text-xl">
                    {status}s
                  </h2>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-bold
                                   ${STATUS_COLORS[status]}`}
                  >
                    {group.length}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Grille joueurs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {group.map((player, i) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: sectionIndex * 0.1 + i * 0.05 }}
                      className="group bg-[#1A1A1A] rounded-2xl overflow-hidden
                                 border border-white/5 hover:border-[#E50914]/30
                                 hover:shadow-[0_0_20px_rgba(229,9,20,0.1)]
                                 transition-all duration-300 flex flex-col text-center"
                    >
                      {/* Photo */}
                      <div className="relative h-40 overflow-hidden bg-[#0D0D0D]">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.pseudo}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top
                                          group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div
                              className="w-16 h-16 rounded-full bg-[#E50914]/10
                                            border-2 border-[#E50914]/20 flex items-center
                                            justify-center text-2xl font-extrabold text-[#E50914]"
                            >
                              {player.pseudo[0].toUpperCase()}
                            </div>
                          </div>
                        )}
                        {/* Numéro maillot */}
                        {player.number && (
                          <div
                            className="absolute top-2 left-2 w-7 h-7 bg-[#E50914]
                                          rounded-lg flex items-center justify-center
                                          text-white text-xs font-extrabold shadow"
                          >
                            {player.number}
                          </div>
                        )}
                        {/* Statut */}
                        <div
                          className="absolute bottom-0 left-0 right-0 px-3 py-2
                                        bg-gradient-to-t from-[#1A1A1A] to-transparent"
                        >
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border
                                           font-semibold ${STATUS_COLORS[player.status]}`}
                          >
                            {player.status}
                          </span>
                        </div>
                      </div>

                      {/* Infos */}
                      <div className="p-3 flex-1 flex flex-col">
                        <p className="text-white font-extrabold text-sm mb-0.5">
                          {player.pseudo}
                        </p>
                        {player.realName && (
                          <p className="text-gray-500 text-xs mb-1">
                            {player.realName}
                          </p>
                        )}
                        {player.role && (
                          <span
                            className="text-[#E50914] text-xs font-semibold
                                           bg-[#E50914]/10 px-2 py-0.5 rounded-lg
                                           inline-block mx-auto"
                          >
                            {player.role}
                          </span>
                        )}
                        {player.nationality && (
                          <p
                            className="text-gray-600 text-xs mt-1.5 flex items-center
                                        gap-1 justify-center"
                          >
                            <FaGlobe size={8} /> {player.nationality}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaGamepad, FaSpinner, FaArrowRight } from "react-icons/fa";
import api from "../../api/api";

export default function TeamPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [game, setGame] = useState("Tous");

  useEffect(() => {
    api
      .get("/teams")
      .then((r) => setTeams(r.data.teams))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = teams.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchGame = game === "Tous" || t.game === game;
    return matchSearch && matchGame;
  });

  // Jeux présents dans les équipes
  const gamesPresent = ["Tous", ...new Set(teams.map((t) => t.game))];

  if (loading)
    return (
      <section
        className="relative bg-transparent min-h-screen flex items-center
                        justify-center z-10"
      >
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement des équipes...</p>
        </div>
      </section>
    );

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Grille équipes */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="text-gray-700 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-xl">Aucune équipe trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => navigate(`/team/${team.id}`)}
                className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5
                           hover:border-[#E50914]/40 hover:shadow-[0_0_30px_rgba(229,9,20,0.15)]
                           transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Bannière ou couleur */}
                <div className="relative h-36 overflow-hidden bg-[#0D0D0D]">
                  {team.banner ? (
                    <img
                      src={team.banner}
                      alt={`${team.name} banner`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105
                                    transition duration-700 opacity-70"
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-gradient-to-br from-[#E50914]/20
                                    to-[#0D0D0D]"
                    />
                  )}
                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t
                                  from-[#1A1A1A] via-transparent to-transparent"
                  />

                  {/* Logo centré */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                                  w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#1A1A1A]
                                  bg-[#0D0D0D] shadow-xl"
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
                        <FaUsers className="text-[#E50914] text-xl" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5 pt-12 flex flex-col flex-1 text-center">
                  <h3
                    className="text-white font-extrabold text-lg mb-1
                                 group-hover:text-[#E50914] transition"
                  >
                    {team.name}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1.5 text-[#E50914] text-xs
                                   font-semibold justify-center mb-3"
                  >
                    <FaGamepad size={10} /> {team.game}
                  </span>

                  {team.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {team.description}
                    </p>
                  )}

                  {/* Roster aperçu */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex -space-x-2">
                      {(team.players || []).slice(0, 5).map((p, i) => (
                        <div
                          key={p.id}
                          className="w-8 h-8 rounded-full overflow-hidden border-2
                                     border-[#1A1A1A] bg-[#0D0D0D]"
                          style={{ zIndex: 5 - i }}
                        >
                          {p.photo ? (
                            <img
                              src={p.photo}
                              alt={p.pseudo}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center
                                              text-xs font-bold text-gray-500"
                            >
                              {p.pseudo[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}
                      {(team.players || []).length > 5 && (
                        <div
                          className="w-8 h-8 rounded-full border-2 border-[#1A1A1A]
                                        bg-[#E50914]/20 flex items-center justify-center
                                        text-[#E50914] text-xs font-bold"
                        >
                          +{team.players.length - 5}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs ml-3">
                      {(team.players || []).length} joueur(s)
                    </span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-white/5">
                    <span
                      className="text-[#E50914] text-xs font-semibold
                                     flex items-center justify-center gap-1
                                     group-hover:gap-2 transition-all"
                    >
                      Voir le roster <FaArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

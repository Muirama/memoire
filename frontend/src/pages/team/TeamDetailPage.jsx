/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaTrophy,
  FaUsers,
  FaGamepad,
  FaMedal,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { teams } from "../../data/TeamData";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const team = teams.find((t) => t.id === parseInt(id));

  if (!team) {
    return (
      <section className="relative bg-transparent min-h-screen py-20 px-4 z-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Équipe non trouvée</h1>
          <Link to="/team" className="text-[#E50914] hover:text-[#FF1E56]">
            Retour aux équipes
          </Link>
        </div>
      </section>
    );
  }

  const getWinRate = (wins, losses) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
  };

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/team")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <FaArrowLeft /> Retour aux équipes
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-[#E50914]/30 shadow-[0_0_30px_rgba(229,9,20,0.3)] mb-12"
        >
          <div className="relative h-80 overflow-hidden">
            <img
              src={team.image}
              alt={team.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3">
                {team.name}
              </h1>
              <p className="text-[#E50914] text-xl font-semibold flex items-center gap-2">
                <FaGamepad /> {team.game}
              </p>
            </div>
            <span className="absolute top-6 right-6 bg-[#E50914] text-white px-4 py-2 rounded-full font-bold">
              {team.rank}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-[#1A1A1A] p-6 rounded-xl text-center border border-[#E50914]/20">
            <div className="text-4xl font-extrabold text-[#E50914] mb-2">{team.wins}</div>
            <div className="text-gray-400">Victoires</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl text-center border border-[#E50914]/20">
            <div className="text-4xl font-extrabold text-gray-400 mb-2">{team.losses}</div>
            <div className="text-gray-400">Défaites</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl text-center border border-[#E50914]/20">
            <div className="text-4xl font-extrabold text-green-500 mb-2">
              {getWinRate(team.wins, team.losses)}%
            </div>
            <div className="text-gray-400">Winrate</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl text-center border border-[#E50914]/20">
            <div className="text-4xl font-extrabold text-[#E50914] mb-2">{team.founded}</div>
            <div className="text-gray-400">Fondée en</div>
          </div>
        </div>

        {/* Membres & Récompenses */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Membres */}
          <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-[#E50914]/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaUsers className="text-[#E50914]" /> Membres de l'équipe
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {team.members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D0D0D] px-4 py-4 rounded-lg text-center hover:bg-[#E50914]/20 transition cursor-pointer"
                >
                  <div className="w-16 h-16 bg-[#E50914] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
                    {member.charAt(0)}
                  </div>
                  <div className="text-white font-semibold">{member}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Récompenses */}
          <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-[#E50914]/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaTrophy className="text-[#E50914]" /> Récompenses
            </h2>
            <div className="space-y-4">
              {team.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D0D0D] px-4 py-4 rounded-lg flex items-center gap-4 hover:bg-[#E50914]/10 transition"
                >
                  <FaMedal className="text-[#E50914] text-3xl flex-shrink-0" />
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique winrate */}
        <div className="mt-8 bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-[#E50914]/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaChartLine className="text-[#E50914]" /> Statistiques
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Victoires</span>
                <span>{team.wins} matchs</span>
              </div>
              <div className="w-full bg-[#0D0D0D] rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWinRate(team.wins, team.losses)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Défaites</span>
                <span>{team.losses} matchs</span>
              </div>
              <div className="w-full bg-[#0D0D0D] rounded-full h-4 overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - getWinRate(team.wins, team.losses)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

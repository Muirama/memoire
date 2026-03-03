/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSortAmountDown,
  FaTrophy,
  FaUsers,
  FaGamepad,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import { teams, gameCategories, teamSortOptions } from "../../data/TeamData";

export default function TeamPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Filtrage et tri des équipes
  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teams.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGame = selectedGame === "Tous" || team.game === selectedGame;
      return matchesSearch && matchesGame;
    });

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "wins-desc":
        filtered.sort((a, b) => b.wins - a.wins);
        break;
      case "wins-asc":
        filtered.sort((a, b) => a.wins - b.wins);
        break;
      case "founded-desc":
        filtered.sort((a, b) => b.founded.localeCompare(a.founded));
        break;
      case "founded-asc":
        filtered.sort((a, b) => a.founded.localeCompare(b.founded));
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [searchTerm, selectedGame, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedGame("Tous");
    setSortBy("default");
  };

  const getWinRate = (wins, losses) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
  };

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 relative z-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4">
            Nos Équipes <span className="text-[#E50914]">esports</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Découvrez les équipes professionnelles de Gascom esport
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {filteredAndSortedTeams.length} équipe(s) active(s)
          </p>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 md:mb-10 space-y-4 relative z-30">
          {/* Ligne 1: Recherche + Tri */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            {/* Recherche */}
            <div className="relative w-full md:flex-1">
              <label htmlFor="team-search" className="sr-only">
                Rechercher une équipe
              </label>
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <input
                id="team-search"
                name="teamSearch"
                type="text"
                placeholder="Rechercher une équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30 focus:border-[#E50914] focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all relative z-30"
              />
            </div>

            {/* Tri */}
            <div className="relative w-full md:w-64">
              <label htmlFor="team-sort" className="sr-only">
                Trier par
              </label>
              <FaSortAmountDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <select
                id="team-sort"
                name="teamSort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#1A1A1A] text-white rounded-lg border border-[#E50914]/30 focus:border-[#E50914] focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 transition-all appearance-none relative z-30"
              >
                {teamSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Ligne 2: Filtres par jeu */}
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center relative z-30">
            {gameCategories.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                type="button"
                aria-pressed={selectedGame === game}
                aria-label={`Filtrer par jeu ${game}`}
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                  selectedGame === game
                    ? "bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105"
                    : "bg-[#1A1A1A] text-gray-400 hover:bg-[#E50914]/20 hover:text-white"
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </div>

        {/* Grille d'équipes */}
        <AnimatePresence mode="wait">
          {filteredAndSortedTeams.length > 0 ? (
            <motion.div
              key="teams-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-20"
            >
              {filteredAndSortedTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => navigate(`/team/${team.id}`)}
                  className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)] transition-all duration-300 cursor-pointer"
                >
                  {/* Image de l'équipe */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={team.image}
                      alt={team.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                        {team.name}
                      </h3>
                      <p className="text-[#E50914] text-sm font-semibold flex items-center gap-2">
                        <FaGamepad /> {team.game}
                      </p>
                    </div>
                    <span className="absolute top-3 right-3 bg-[#E50914] text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {team.rank}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#E50914]">
                          {team.wins}
                        </div>
                        <div className="text-xs text-gray-500">Victoires</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">
                          {team.losses}
                        </div>
                        <div className="text-xs text-gray-500">Défaites</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {getWinRate(team.wins, team.losses)}%
                        </div>
                        <div className="text-xs text-gray-500">Winrate</div>
                      </div>
                    </div>

                    {/* Infos supplémentaires */}
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-[#E50914]" />
                        <span>{team.members.length} membres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#E50914]" />
                        <span>Fondée en {team.founded}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaTrophy className="text-[#E50914]" />
                        <span>{team.achievements.length} récompenses</span>
                      </div>
                    </div>

                    {/* Bouton Voir Plus */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/team/${team.id}`);
                      }}
                      className="w-full mt-4 bg-[#E50914] hover:bg-[#FF1E56] text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.6)] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <FaEye /> Voir les détails
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-12 md:mt-16 py-12 relative z-10"
            >
              <div className="text-gray-500 text-5xl md:text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg md:text-xl mb-6">
                Aucune équipe trouvée pour votre recherche.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                aria-label="Réinitialiser tous les filtres"
                className="px-6 md:px-8 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#FF1E56] transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] active:scale-95 font-semibold text-sm md:text-base"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

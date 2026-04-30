/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaGamepad,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import api from "../../../api/api";
import AdminTeamForm from "./AdminTeamForm";
import AdminPlayerForm from "./AdminPlayerForm";

const STATUS_COLORS = {
  Titulaire: "bg-green-500/20 text-green-400 border-green-500/30",
  Remplaçant: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Coach: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Formulaire équipe
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Formulaire joueur
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [targetTeamId, setTargetTeamId] = useState(null);

  // Suppression
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [deletePlayer, setDeletePlayer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────
  const fetchTeams = () => {
    setLoading(true);
    api
      .get("/teams/admin/all")
      .then((r) => setTeams(r.data.teams))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ── Toggle visibilité équipe ──────────────────────────
  const handleToggleActive = async (team) => {
    try {
      await api.put(`/teams/${team.id}`, { active: !team.active });
      setTeams((p) =>
        p.map((t) => (t.id === team.id ? { ...t, active: !t.active } : t)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── Supprimer équipe ───────────────────────────────────
  const handleDeleteTeam = async () => {
    setDeleting(true);
    try {
      await api.delete(`/teams/${deleteTeamId}`);
      setTeams((p) => p.filter((t) => t.id !== deleteTeamId));
      setDeleteTeamId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ── Supprimer joueur ───────────────────────────────────
  const handleDeletePlayer = async () => {
    setDeleting(true);
    try {
      await api.delete(
        `/teams/${deletePlayer.teamId}/players/${deletePlayer.id}`,
      );
      setTeams((p) =>
        p.map((t) =>
          t.id === deletePlayer.teamId
            ? {
                ...t,
                players: t.players.filter((pl) => pl.id !== deletePlayer.id),
              }
            : t,
        ),
      );
      setDeletePlayer(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ── Après sauvegarde ──────────────────────────────────
  const handleSaved = () => {
    setShowTeamForm(false);
    setEditingTeam(null);
    setShowPlayerForm(false);
    setEditingPlayer(null);
    setTargetTeamId(null);
    fetchTeams();
  };

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.game.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPlayers = teams.reduce((a, t) => a + (t.players?.length || 0), 0);

  useEffect(() => {
    const isLocked =
      showTeamForm || showPlayerForm || deleteTeamId || deletePlayer;

    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showTeamForm, showPlayerForm, deleteTeamId, deletePlayer]);

  
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white
                         flex items-center gap-3"
          >
            <FaUsers className="text-[#E50914]" /> Équipes & Roster
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les équipes e-sport Gascom et leurs joueurs
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTeam(null);
            setShowTeamForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914]
                     hover:bg-[#FF1E56] text-white font-bold text-sm rounded-xl
                     transition flex-shrink-0
                     hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        >
          <FaPlus size={12} /> Nouvelle équipe
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Équipes",
            value: teams.length,
            color: "text-white",
            bg: "bg-white/5",
          },
          {
            label: "Équipes actives",
            value: teams.filter((t) => t.active).length,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Total joueurs",
            value: totalPlayers,
            color: "text-[#E50914]",
            bg: "bg-[#E50914]/10",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`${s.bg} rounded-xl p-4 border border-white/5`}
          >
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2
                             text-gray-500 pointer-events-none text-sm"
        />
        <input
          type="text"
          placeholder="Rechercher une équipe, un jeu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                     border border-white/10 focus:border-[#E50914] focus:outline-none
                     focus:ring-2 focus:ring-[#E50914]/30 transition-all text-sm"
        />
      </div>

      {/* Liste équipes */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaUsers className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="mb-4">Aucune équipe trouvée.</p>
          <button
            type="button"
            onClick={() => {
              setEditingTeam(null);
              setShowTeamForm(true);
            }}
            className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-sm font-bold"
          >
            Créer la première équipe
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((team, index) => {
            const isExpanded = expandedId === team.id;
            const players = team.players || [];

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-[#1A1A1A] rounded-2xl border transition-all duration-300
                            ${
                              isExpanded
                                ? "border-[#E50914]/40 shadow-[0_0_20px_rgba(229,9,20,0.15)]"
                                : "border-white/5 hover:border-white/10"
                            }`}
              >
                {/* En-tête équipe */}
                <div className="flex items-center gap-4 p-4 md:p-5">
                  {/* Logo */}
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0
                                  bg-[#0D0D0D] border border-white/5
                                  flex items-center justify-center"
                  >
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUsers className="text-gray-600 text-xl" />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold">{team.name}</h3>
                      {!team.active && (
                        <span
                          className="text-xs bg-gray-500/20 text-gray-400
                                         border border-gray-500/30 px-2 py-0.5
                                         rounded-full font-semibold"
                        >
                          Inactif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <FaGamepad size={10} /> {team.game}
                      </span>
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <FaUsers size={10} />
                        <span className="text-white font-semibold">
                          {players.length}
                        </span>{" "}
                        joueur(s)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Toggle visibilité */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(team)}
                      title={team.active ? "Désactiver" : "Activer"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center
                                  transition-all text-sm
                                  ${
                                    team.active
                                      ? "bg-green-500/10 text-green-400 hover:bg-gray-500/20 hover:text-gray-400"
                                      : "bg-gray-500/10 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                                  }`}
                    >
                      {team.active ? (
                        <FaEye size={13} />
                      ) : (
                        <FaEyeSlash size={13} />
                      )}
                    </button>

                    {/* Ajouter joueur */}
                    <button
                      type="button"
                      onClick={() => {
                        setTargetTeamId(team.id);
                        setEditingPlayer(null);
                        setShowPlayerForm(true);
                      }}
                      title="Ajouter un joueur"
                      className="w-9 h-9 rounded-xl bg-green-500/10 hover:bg-green-500/20
                                 text-green-400 transition flex items-center justify-center"
                    >
                      <FaUserPlus size={13} />
                    </button>

                    {/* Modifier équipe */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeam(team);
                        setShowTeamForm(true);
                      }}
                      title="Modifier l'équipe"
                      className="w-9 h-9 rounded-xl bg-blue-500/10 hover:bg-blue-500/20
                                 text-blue-400 transition flex items-center justify-center"
                    >
                      <FaEdit size={13} />
                    </button>

                    {/* Supprimer équipe */}
                    <button
                      type="button"
                      onClick={() => setDeleteTeamId(team.id)}
                      title="Supprimer l'équipe"
                      className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20
                                 text-red-400 transition flex items-center justify-center"
                    >
                      <FaTrash size={13} />
                    </button>

                    {/* Dérouler roster */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : team.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center
                                  transition-all
                                  ${
                                    isExpanded
                                      ? "bg-[#E50914] text-white"
                                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                  }`}
                    >
                      {isExpanded ? (
                        <FaChevronUp size={13} />
                      ) : (
                        <FaChevronDown size={13} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Roster ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-4 md:px-5 pb-5 pt-4">
                        {/* Header roster */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-[#E50914]" />
                            <span className="text-white font-bold text-sm">
                              Roster
                            </span>
                            <span
                              className="bg-[#E50914]/20 text-[#E50914] text-xs
                                             px-2 py-0.5 rounded-full font-bold"
                            >
                              {players.length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetTeamId(team.id);
                              setEditingPlayer(null);
                              setShowPlayerForm(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                       bg-green-500/10 hover:bg-green-500/20 text-green-400
                                       border border-green-500/20 text-xs font-semibold transition"
                          >
                            <FaUserPlus size={11} /> Ajouter un joueur
                          </button>
                        </div>

                        {players.length === 0 ? (
                          <div className="text-center py-8">
                            <FaUsers className="text-gray-700 text-4xl mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Aucun joueur dans cette équipe.
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Table desktop */}
                            <div
                              className="hidden md:block rounded-xl overflow-hidden
                                            border border-white/5"
                            >
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-[#0D0D0D] text-gray-500 text-xs uppercase">
                                    {[
                                      "#",
                                      "Joueur",
                                      "Rôle",
                                      "Nationalité",
                                      "Statut",
                                      "Actions",
                                    ].map((h) => (
                                      <th
                                        key={h}
                                        className={`px-4 py-3
                                                  ${
                                                    h === "Statut" ||
                                                    h === "Actions"
                                                      ? "text-center"
                                                      : "text-left"
                                                  }`}
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {players.map((player) => (
                                    <tr
                                      key={player.id}
                                      className="border-t border-white/5 hover:bg-white/3 transition-colors"
                                    >
                                      <td className="px-4 py-3 text-gray-500 text-xs">
                                        {player.number
                                          ? `#${player.number}`
                                          : "—"}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <div
                                            className="w-8 h-8 rounded-lg overflow-hidden
                                                          bg-[#0D0D0D] flex-shrink-0"
                                          >
                                            {player.photo ? (
                                              <img
                                                src={player.photo}
                                                alt={player.pseudo}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div
                                                className="w-full h-full flex items-center
                                                                justify-center text-gray-600 text-xs
                                                                font-bold"
                                              >
                                                {player.pseudo[0].toUpperCase()}
                                              </div>
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-white font-bold text-xs">
                                              {player.pseudo}
                                            </p>
                                            {player.realName && (
                                              <p className="text-gray-500 text-xs">
                                                {player.realName}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span
                                          className="text-[#E50914] text-xs font-semibold
                                                         bg-[#E50914]/10 px-2 py-1 rounded-lg"
                                        >
                                          {player.role || "—"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-gray-400 text-xs">
                                        {player.nationality}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span
                                          className={`text-xs px-2 py-1 rounded-full
                                                         border font-semibold
                                                         ${STATUS_COLORS[player.status]}`}
                                        >
                                          {player.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setTargetTeamId(team.id);
                                              setEditingPlayer(player);
                                              setShowPlayerForm(true);
                                            }}
                                            className="w-7 h-7 rounded-lg bg-blue-500/10
                                                       hover:bg-blue-500/20 text-blue-400
                                                       transition flex items-center justify-center"
                                          >
                                            <FaEdit size={11} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setDeletePlayer({
                                                id: player.id,
                                                teamId: team.id,
                                              })
                                            }
                                            className="w-7 h-7 rounded-lg bg-red-500/10
                                                       hover:bg-red-500/20 text-red-400
                                                       transition flex items-center justify-center"
                                          >
                                            <FaTrash size={11} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Cards mobile */}
                            <div className="md:hidden space-y-3">
                              {players.map((player) => (
                                <div
                                  key={player.id}
                                  className="bg-[#0D0D0D] rounded-xl p-3 border border-white/5
                                             flex items-center gap-3"
                                >
                                  <div
                                    className="w-10 h-10 rounded-xl overflow-hidden
                                                  bg-[#1A1A1A] flex-shrink-0"
                                  >
                                    {player.photo ? (
                                      <img
                                        src={player.photo}
                                        alt={player.pseudo}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div
                                        className="w-full h-full flex items-center
                                                        justify-center text-gray-500 font-bold"
                                      >
                                        {player.pseudo[0].toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm">
                                      {player.pseudo}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {player.role && (
                                        <span className="text-[#E50914] text-xs font-semibold">
                                          {player.role}
                                        </span>
                                      )}
                                      <span
                                        className={`text-xs px-1.5 py-0.5 rounded-full
                                                       border font-semibold
                                                       ${STATUS_COLORS[player.status]}`}
                                      >
                                        {player.status}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTargetTeamId(team.id);
                                        setEditingPlayer(player);
                                        setShowPlayerForm(true);
                                      }}
                                      className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400
                                                 flex items-center justify-center"
                                    >
                                      <FaEdit size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeletePlayer({
                                          id: player.id,
                                          teamId: team.id,
                                        })
                                      }
                                      className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400
                                                 flex items-center justify-center"
                                    >
                                      <FaTrash size={11} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Formulaire équipe ── */}
      <AnimatePresence>
        {showTeamForm && (
          <AdminTeamForm
            team={editingTeam}
            onClose={() => {
              setShowTeamForm(false);
              setEditingTeam(null);
            }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* ── Formulaire joueur ── */}
      <AnimatePresence>
        {showPlayerForm && (
          <AdminPlayerForm
            player={editingPlayer}
            teamId={targetTeamId}
            onClose={() => {
              setShowPlayerForm(false);
              setEditingPlayer(null);
              setTargetTeamId(null);
            }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* ── Modal suppression équipe ── */}
      <AnimatePresence>
        {deleteTeamId && (
          <ConfirmModal
            title="Supprimer l'équipe"
            message={
              <>
                Supprimer l'équipe{" "}
                <span className="text-[#E50914] font-bold">
                  #{deleteTeamId}
                </span>{" "}
                et tous ses joueurs ? Irréversible.
              </>
            }
            onConfirm={handleDeleteTeam}
            onCancel={() => setDeleteTeamId(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      {/* ── Modal suppression joueur ── */}
      <AnimatePresence>
        {deletePlayer && (
          <ConfirmModal
            title="Supprimer le joueur"
            message={
              <>
                Supprimer le joueur{" "}
                <span className="text-[#E50914] font-bold">
                  #{deletePlayer.id}
                </span>{" "}
                ? Irréversible.
              </>
            }
            onConfirm={handleDeletePlayer}
            onCancel={() => setDeletePlayer(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, deleting }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-white/10
                   shadow-2xl z-50 p-6"
      >
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-white/10
                       text-gray-400 hover:text-white font-semibold text-sm transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500
                       text-white font-bold text-sm transition disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            Supprimer
          </button>
        </div>
      </motion.div>
    </>
  );
}

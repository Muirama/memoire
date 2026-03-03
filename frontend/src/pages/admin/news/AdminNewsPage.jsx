/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNewspaper,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import api from "../../../api/api";
import AdminNewsForm from "./AdminNewsForm";

const CATEGORY_COLORS = {
  Actualité: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Tournoi: "bg-[#E50914]/20 text-[#E50914] border-[#E50914]/30",
  Communauté: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Produit: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Annonce: "bg-green-500/20 text-green-400 border-green-500/30",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Toutes");

  // Formulaire
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Suppression
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle publish
  const [toggling, setToggling] = useState({});

  // ── Fetch ──────────────────────────────────────────────
  const fetchNews = () => {
    setLoading(true);
    api
      .get("/news/admin/all")
      .then((r) => setNews(r.data.news))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ── Toggle publié ──────────────────────────────────────
  const handleTogglePublish = async (item) => {
    setToggling((p) => ({ ...p, [item.id]: true }));
    try {
      await api.patch(`/news/${item.id}/toggle`);
      setNews((p) =>
        p.map((n) =>
          n.id === item.id ? { ...n, published: !n.published } : n,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling((p) => ({ ...p, [item.id]: false }));
    }
  };

  // ── Supprimer ──────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/news/${deleteId}`);
      setNews((p) => p.filter((n) => n.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ── Filtrage ────────────────────────────────────────────
  const filtered = news.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Toutes" || n.category === filterCat;
    return matchSearch && matchCat;
  });

  const CATEGORIES = [
    "Toutes",
    "Actualité",
    "Tournoi",
    "Communauté",
    "Produit",
    "Annonce",
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <FaNewspaper className="text-[#E50914]" /> News & Articles
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les actualités publiées sur le site
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingNews(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#FF1E56]
                     text-white font-bold text-sm rounded-xl transition flex-shrink-0
                     hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        >
          <FaPlus size={12} /> Nouvel article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total articles",
            value: news.length,
            color: "text-white",
            bg: "bg-white/5",
          },
          {
            label: "Publiés",
            value: news.filter((n) => n.published).length,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Non publiés",
            value: news.filter((n) => !n.published).length,
            color: "text-gray-400",
            bg: "bg-gray-500/10",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${s.bg} rounded-xl p-4 border border-white/5`}
          >
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-500 pointer-events-none text-sm"
          />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       focus:ring-2 focus:ring-[#E50914]/30 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                          ${
                            filterCat === cat
                              ? "bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                              : "bg-[#1A1A1A] text-gray-400 border border-white/10 hover:border-white/20"
                          }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaNewspaper className="text-5xl mx-auto mb-3 opacity-30" />
          <p>Aucun article trouvé.</p>
          <button
            type="button"
            onClick={() => {
              setEditingNews(null);
              setShowForm(true);
            }}
            className="mt-4 px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-sm font-bold"
          >
            Créer le premier article
          </button>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
          {/* Table desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D0D0D] text-gray-500 text-xs uppercase border-b border-white/5">
                  <th className="text-left px-5 py-3">Article</th>
                  <th className="text-left px-5 py-3">Catégorie</th>
                  <th className="text-left px-5 py-3">Auteur</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-center px-5 py-3">Statut</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0
                                        bg-[#0D0D0D]"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaNewspaper className="text-gray-600 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate max-w-[280px]">
                            {item.title}
                          </p>
                          <p className="text-gray-500 text-xs truncate max-w-[280px]">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-semibold
                                       ${CATEGORY_COLORS[item.category] || "bg-gray-500/20 text-gray-400"}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {item.author}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        disabled={toggling[item.id]}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                   text-xs font-semibold border transition-all
                                   ${
                                     item.published
                                       ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                                       : "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30"
                                   }`}
                      >
                        {toggling[item.id] ? (
                          <FaSpinner className="animate-spin" size={10} />
                        ) : item.published ? (
                          <>
                            <FaEye size={10} /> Publié
                          </>
                        ) : (
                          <>
                            <FaEyeSlash size={10} /> Masqué
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNews(item);
                            setShowForm(true);
                          }}
                          className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20
                                     text-blue-400 transition flex items-center justify-center"
                        >
                          <FaEdit size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20
                                     text-red-400 transition flex items-center justify-center"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards mobile */}
          <div className="md:hidden divide-y divide-white/5">
            {filtered.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#0D0D0D]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaNewspaper className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold
                                       ${CATEGORY_COLORS[item.category] || "bg-gray-500/20 text-gray-400"}`}
                      >
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-semibold
                                       ${item.published ? "text-green-400" : "text-gray-500"}`}
                      >
                        {item.published ? "Publié" : "Masqué"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-xs">
                    {formatDate(item.createdAt)}
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs
                                 ${item.published ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}
                    >
                      {item.published ? (
                        <FaEye size={11} />
                      ) : (
                        <FaEyeSlash size={11} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNews(item);
                        setShowForm(true);
                      }}
                      className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"
                    >
                      <FaEdit size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Formulaire panneau latéral ── */}
      <AnimatePresence>
        {showForm && (
          <AdminNewsForm
            news={editingNews}
            onClose={() => {
              setShowForm(false);
              setEditingNews(null);
            }}
            onSaved={() => {
              setShowForm(false);
              setEditingNews(null);
              fetchNews();
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Modal suppression ── */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
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
              <h3 className="text-white font-bold text-lg mb-2">
                Supprimer l'article
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Voulez-vous supprimer l'article{" "}
                <span className="text-[#E50914] font-bold">#{deleteId}</span> ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10
                             text-gray-400 hover:text-white font-semibold text-sm transition"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500
                             text-white font-bold text-sm transition disabled:opacity-50
                             flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  Supprimer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

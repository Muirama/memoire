/* eslint-disable no-unused-vars */
import AdminLayout from "../AdminLayout";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaUsers } from "react-icons/fa";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await api.delete(`/users/${deleteId}`);

      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Erreur delete user :", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between
                              gap-4 mb-8"
      >
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white flex
                                 items-center gap-3"
          >
            <FaUsers className="text-[#E50914]" />
            Utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les utilisateurs de votre plateforme, leurs rôles et
            permissions.
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          className="hidden md:block bg-[#1A1A1A] rounded-2xl border
                          border-white/5 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                  <th className="text-left px-5 py-4">#</th>
                  <th className="text-left px-5 py-4">Nom</th>
                  <th className="text-left px-5 py-4">Email</th>
                  <th className="text-center px-5 py-4">Contact</th>
                  <th className="text-center px-5 py-4">Rôle</th>
                  <th className="text-center px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/3
                                     transition-colors"
                    >
                      <td className="px-5 py-4 text-[#E50914] font-bold">
                        {user.id}
                      </td>
                      <td className="text-white font-semibold">{user.name}</td>

                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600 text-center">
                        {user.phone || " N/A "}
                      </td>

                      <td className="p-4 text-center ">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">
                        <div className="flex gap-3 justify-center items-center">
                          {/* DELETE */}
                          <button
                            type="button"
                            title="Supprimer"
                            onClick={() => setDeleteId(user.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10
                                           hover:bg-red-500/20 text-red-400
                                           hover:text-red-300 transition
                                           flex items-center justify-center"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ===================== */}

      <AnimatePresence>
        {deleteId && (
          <Modal
            onClose={() => setDeleteId(null)}
            title="Confirmer la suppression"
          >
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Voulez-vous vraiment supprimer cette personne{" "}
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
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

// ── Composants utilitaires ────────────────────────────────
function Modal({ children, title, onClose }) {
  return (
    <>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        key="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-lg bg-[#1A1A1A] rounded-2xl border border-white/10
                   shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        {/* Header modal */}
        <div
          className="flex items-center justify-between px-6 py-4
                        border-b border-white/5"
        >
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8
                       rounded-lg hover:bg-white/5 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase font-semibold mb-2 tracking-wide">
        {title}
      </p>
      <div className="bg-[#111111] rounded-xl p-4 space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gray-500 w-20 flex-shrink-0">{label} :</span>
      <span className="text-white flex-1">{value}</span>
    </div>
  );
}

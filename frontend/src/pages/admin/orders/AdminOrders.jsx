/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaChevronDown,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import api from "../../../api/api";

// ── Constantes ────────────────────────────────────────────
const STATUS_OPTIONS = [
  "En attente",
  "Confirmée",
  "En cours de livraison",
  "Livrée",
  "Annulée",
];

const STATUS_STYLES = {
  "En attente": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Confirmée: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "En cours de livraison":
    "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Livrée: "bg-green-500/20 text-green-400 border-green-500/30",
  Annulée: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-MG").format(price) + " Ar";

const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  // Modals
  const [viewOrder, setViewOrder] = useState(null); // Détail
  const [editOrder, setEditOrder] = useState(null); // Modifier statut
  const [deleteId, setDeleteId] = useState(null); // Confirmer suppression

  // Status en cours de modif
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Erreur fetch orders :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Filtrage ──────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.id).includes(searchTerm);
    const matchStatus = filterStatus === "Tous" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Modifier le statut ────────────────────────────────
  const handleSaveStatus = async () => {
    if (!editOrder || !newStatus) return;
    try {
      setSaving(true);
      await api.patch(`/orders/${editOrder.id}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editOrder.id ? { ...o, status: newStatus } : o,
        ),
      );
      setEditOrder(null);
    } catch (err) {
      console.error("Erreur update statut :", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Supprimer ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/orders/${deleteId}`);
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Erreur delete order :", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between
                      gap-4 mb-8"
      >
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white flex
                         items-center gap-3"
          >
            <FaShoppingBag className="text-[#E50914]" />
            Commandes
          </h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} commande{filtered.length > 1 ? "s" : ""}
            {filterStatus !== "Tous" ? ` · ${filterStatus}` : ""}
          </p>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Recherche */}
        <div className="relative flex-1">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-500 pointer-events-none text-sm"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, email, n° commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       focus:ring-2 focus:ring-[#E50914]/30 transition-all text-sm"
          />
        </div>

        {/* Filtre statut */}
        <div className="relative">
          <FaFilter
            className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-500 pointer-events-none text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-11 pr-10 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       transition-all appearance-none text-sm w-full md:w-52"
          >
            <option value="Tous">Tous les statuts</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FaChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2
                                    text-gray-500 pointer-events-none text-xs"
          />
        </div>
      </div>

      {/* ── Table / Cards ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaShoppingBag className="text-5xl mx-auto mb-3 opacity-30" />
          <p>Aucune commande trouvée.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop : table ── */}
          <div
            className="hidden md:block bg-[#1A1A1A] rounded-2xl border
                          border-white/5 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                    <th className="text-left px-5 py-4">#</th>
                    <th className="text-left px-5 py-4">Client</th>
                    <th className="text-left px-5 py-4">Articles</th>
                    <th className="text-left px-5 py-4">Date</th>
                    <th className="text-right px-5 py-4">Total</th>
                    <th className="text-center px-5 py-4">Statut</th>
                    <th className="text-center px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((order) => {
                      const { date, time } = formatDateTime(order.createdAt);
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-white/5 hover:bg-white/3
                                     transition-colors"
                        >
                          <td className="px-5 py-4 text-[#E50914] font-bold">
                            #{order.id}
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-white font-semibold">
                              {order.customerName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {order.customerEmail}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {order.customerPhone}
                            </p>
                          </td>
                          <td className="px-5 py-4 max-w-[220px]">
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {order.itemsSummary}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            <p>{date}</p>
                            <p className="text-gray-600">{time}</p>
                          </td>
                          <td
                            className="px-5 py-4 text-right text-white
                                         font-bold whitespace-nowrap text-xs"
                          >
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs
                                             font-semibold border whitespace-nowrap
                                             ${STATUS_STYLES[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Voir détails */}
                              <button
                                type="button"
                                onClick={() => setViewOrder(order)}
                                title="Voir les détails"
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10
                                           text-gray-400 hover:text-white transition
                                           flex items-center justify-center"
                              >
                                <FaEye size={13} />
                              </button>

                              {/* Modifier statut */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditOrder(order);
                                  setNewStatus(order.status);
                                }}
                                title="Modifier le statut"
                                className="w-8 h-8 rounded-lg bg-blue-500/10
                                           hover:bg-blue-500/20 text-blue-400
                                           hover:text-blue-300 transition
                                           flex items-center justify-center"
                              >
                                <FaEdit size={13} />
                              </button>

                              {/* Supprimer */}
                              <button
                                type="button"
                                onClick={() => setDeleteId(order.id)}
                                title="Supprimer"
                                className="w-8 h-8 rounded-lg bg-red-500/10
                                           hover:bg-red-500/20 text-red-400
                                           hover:text-red-300 transition
                                           flex items-center justify-center"
                              >
                                <FaTrash size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile : cards ── */}
          <div className="md:hidden space-y-4">
            {filtered.map((order) => {
              const { date, time } = formatDateTime(order.createdAt);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1A1A1A] rounded-xl border border-white/5 p-4"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#E50914] font-bold">#{order.id}</p>
                      <p className="text-white font-semibold text-sm">
                        {order.customerName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.customerEmail}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                                     border ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Articles */}
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {order.itemsSummary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {date} · {time}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setViewOrder(order)}
                        className="w-8 h-8 rounded-lg bg-white/5 text-gray-400
                                   flex items-center justify-center"
                      >
                        <FaEye size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditOrder(order);
                          setNewStatus(order.status);
                        }}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400
                                   flex items-center justify-center"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(order.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400
                                   flex items-center justify-center"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* ════ MODAL — Voir détails ════ */}
      <AnimatePresence>
        {viewOrder && (
          <Modal
            onClose={() => setViewOrder(null)}
            title={`Commande #${viewOrder.id}`}
          >
            <div className="space-y-4">
              {/* Statut */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                                 border ${STATUS_STYLES[viewOrder.status]}`}
                >
                  {viewOrder.status}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDateTime(viewOrder.createdAt).date} à{" "}
                  {formatDateTime(viewOrder.createdAt).time}
                </span>
              </div>

              {/* Infos client */}
              <Section title="Informations client">
                <InfoRow label="Nom" value={viewOrder.customerName} />
                <InfoRow label="Email" value={viewOrder.customerEmail} />
                <InfoRow label="Tél" value={viewOrder.customerPhone} />
                <InfoRow
                  label="Adresse"
                  value={viewOrder.customerAddress || "—"}
                />
                {viewOrder.notes && (
                  <InfoRow label="Notes" value={viewOrder.notes} />
                )}
              </Section>

              {/* Articles */}
              <Section title="Articles commandés">
                <div className="bg-[#0D0D0D] rounded-lg p-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {viewOrder.itemsSummary}
                  </p>
                </div>
              </Section>

              {/* Total */}
              <div
                className="flex justify-between items-center bg-[#E50914]/10
                              border border-[#E50914]/20 rounded-xl px-4 py-3"
              >
                <span className="text-gray-400 font-semibold">Total payé</span>
                <span className="text-[#E50914] font-extrabold text-xl">
                  {formatPrice(viewOrder.totalAmount)}
                </span>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ════ MODAL — Modifier statut ════ */}
      <AnimatePresence>
        {editOrder && (
          <Modal
            onClose={() => setEditOrder(null)}
            title={`Modifier statut — #${editOrder.id}`}
          >
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Client :{" "}
                <span className="text-white">{editOrder.customerName}</span>
              </p>

              <div className="space-y-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={`w-full flex items-center justify-between px-4 py-3
                                rounded-xl border font-semibold text-sm transition-all
                                ${
                                  newStatus === s
                                    ? `${STATUS_STYLES[s]} border-current`
                                    : "bg-[#0D0D0D] border-white/10 text-gray-400 hover:border-white/20"
                                }`}
                  >
                    {s}
                    {newStatus === s && <FaCheck size={12} />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOrder(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10
                             text-gray-400 hover:text-white transition font-semibold text-sm"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E56]
                             text-white font-bold text-sm transition disabled:opacity-50
                             flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheck />
                  )}
                  Enregistrer
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ════ MODAL — Confirmer suppression ════ */}
      <AnimatePresence>
        {deleteId && (
          <Modal
            onClose={() => setDeleteId(null)}
            title="Confirmer la suppression"
          >
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Voulez-vous vraiment supprimer la commande{" "}
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

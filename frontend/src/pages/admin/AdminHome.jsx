/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaHourglassHalf,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaArrowRight,
  FaCalendarAlt,
  FaUsers,
  FaLock,
  FaLockOpen,
  FaGamepad,
  FaSpinner,
  FaClipboardList,
  FaClock,
  FaBan,
} from "react-icons/fa";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

const formatPrice = (p) => new Intl.NumberFormat("fr-MG").format(p) + " Ar";
const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusBadge = (status) => {
  const map = {
    "En attente": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Confirmée: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "En cours de livraison":
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Livrée: "bg-green-500/20 text-green-400 border-green-500/30",
    Annulée: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return map[status] || "bg-gray-500/20 text-gray-400";
};

function StatCard({ icon, value, label, color, bg, delay, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`${bg} rounded-xl p-4 flex flex-col gap-2 ${onClick ? "cursor-pointer hover:scale-[1.03] transition-transform" : ""}`}
    >
      <div className={`text-lg ${color}`}>{icon}</div>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs font-semibold leading-tight">
        {label}
      </p>
    </motion.div>
  );
}

function SectionTitle({ icon, title, linkLabel, onLink }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-bold text-lg flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {onLink && (
        <button
          type="button"
          onClick={onLink}
          className="flex items-center gap-1.5 text-[#E50914] hover:text-[#FF1E56] text-sm font-semibold transition"
        >
          {linkLabel} <FaArrowRight size={11} />
        </button>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-gray-500 text-sm">
      <FaSpinner className="animate-spin text-[#E50914]" /> Chargement...
    </div>
  );
}

function Empty({ text }) {
  return <div className="p-8 text-center text-gray-500 text-sm">{text}</div>;
}

export default function AdminHome() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Admin";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [eventStats, setEventStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    participants: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [regStats, setRegStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [loadingRegs, setLoadingRegs] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => {
        const o = data.orders;
        setOrderStats({
          total: o.length,
          pending: o.filter((x) => x.status === "En attente").length,
          confirmed: o.filter((x) => x.status === "Confirmée").length,
          delivered: o.filter((x) => x.status === "Livrée").length,
          cancelled: o.filter((x) => x.status === "Annulée").length,
        });
        setRecentOrders(o.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, []);

  useEffect(() => {
    api
      .get("/events")
      .then(({ data }) => {
        const e = data.events;
        setEventStats({
          total: e.length,
          open: e.filter((x) => x.registrationOpen).length,
          closed: e.filter((x) => !x.registrationOpen).length,
          participants: e.reduce((acc, x) => acc + (x.registered || 0), 0),
        });
        setRecentEvents(e.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    api
      .get("/registrations")
      .then(({ data }) => {
        const r = data.registrations;
        setRegStats({
          total: r.length,
          pending: r.filter((x) => x.status === "En attente").length,
          confirmed: r.filter((x) => x.status === "Confirmée").length,
          cancelled: r.filter((x) => x.status === "Annulée").length,
        });
      })
      .catch(console.error)
      .finally(() => setLoadingRegs(false));
  }, []);

  const dv = (v, load) => (load ? "—" : v);

  return (
    <AdminLayout>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          {greeting}, <span className="text-[#E50914]">{adminName}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Voici un aperçu complet de votre activité Gascom.
        </p>
      </motion.div>

      {/* 3 blocs résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => navigate("/admin/orders")}
          className="bg-gradient-to-br from-[#E50914] to-[#730b0b] rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform shadow-[0_0_25px_rgba(229,9,20,0.3)]"
        >
          <div className="flex items-center justify-between mb-4">
            <FaShoppingBag className="text-white/80 text-2xl" />
            <span className="text-white/60 text-xs font-semibold tracking-wide">
              COMMANDES
            </span>
          </div>
          <p className="text-5xl font-extrabold text-white mb-1">
            {dv(orderStats.total, loadingOrders)}
          </p>
          <p className="text-white/70 text-sm mt-2">
            <span className="text-white font-bold">
              {dv(orderStats.pending, loadingOrders)}
            </span>{" "}
            en attente
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/admin/events")}
          className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform hover:border-[#E50914]/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FaCalendarAlt className="text-[#E50914] text-2xl" />
            <span className="text-gray-500 text-xs font-semibold tracking-wide">
              ÉVÉNEMENTS
            </span>
          </div>
          <p className="text-5xl font-extrabold text-white mb-1">
            {dv(eventStats.total, loadingEvents)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            <span className="text-green-400 font-bold">
              {dv(eventStats.open, loadingEvents)}
            </span>{" "}
            ouverts ·{" "}
            <span className="text-gray-500 font-bold">
              {dv(eventStats.closed, loadingEvents)}
            </span>{" "}
            fermés
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate("/admin/events")}
          className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform hover:border-[#E50914]/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FaClipboardList className="text-[#E50914] text-2xl" />
            <span className="text-gray-500 text-xs font-semibold tracking-wide">
              INSCRIPTIONS
            </span>
          </div>
          <p className="text-5xl font-extrabold text-white mb-1">
            {dv(regStats.total, loadingRegs)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            <span className="text-yellow-400 font-bold">
              {dv(regStats.pending, loadingRegs)}
            </span>{" "}
            en attente ·{" "}
            <span className="text-green-400 font-bold">
              {dv(regStats.confirmed, loadingRegs)}
            </span>{" "}
            confirmées
          </p>
        </motion.div>
      </div>

      {/* Commandes détail */}
      <SectionTitle
        icon={<FaShoppingBag className="text-[#E50914]" />}
        title="Commandes"
        linkLabel="Voir tout"
        onLink={() => navigate("/admin/orders")}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "En attente",
            value: orderStats.pending,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10 border border-yellow-500/20",
            icon: <FaHourglassHalf />,
          },
          {
            label: "Confirmées",
            value: orderStats.confirmed,
            color: "text-blue-400",
            bg: "bg-blue-500/10   border border-blue-500/20",
            icon: <FaCheckCircle />,
          },
          {
            label: "Livrées",
            value: orderStats.delivered,
            color: "text-green-400",
            bg: "bg-green-500/10  border border-green-500/20",
            icon: <FaTruck />,
          },
          {
            label: "Annulées",
            value: orderStats.cancelled,
            color: "text-gray-400",
            bg: "bg-gray-500/10   border border-gray-500/20",
            icon: <FaTimesCircle />,
          },
        ].map((s, i) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            value={dv(s.value, loadingOrders)}
            label={s.label}
            color={s.color}
            bg={s.bg}
            delay={0.2 + i * 0.06}
            onClick={() => navigate("/admin/orders")}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44 }}
        className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden mb-10"
      >
        <div className="px-5 py-3.5 border-b border-white/5">
          <p className="text-gray-400 text-sm font-semibold">
            Dernières commandes
          </p>
        </div>
        {loadingOrders ? (
          <Loader />
        ) : recentOrders.length === 0 ? (
          <Empty text="Aucune commande pour l'instant." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Client</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">
                    Articles
                  </th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-5 py-3">Total</th>
                  <th className="text-center px-5 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate("/admin/orders")}
                    className="border-t border-white/5 hover:bg-white/3 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[#E50914] font-bold">
                      #{order.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-semibold">
                        {order.customerName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-gray-400 text-xs line-clamp-1 max-w-[180px]">
                        {order.itemsSummary}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-white font-bold text-xs whitespace-nowrap">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Événements + Inscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Événements */}
        <div>
          <SectionTitle
            icon={<FaCalendarAlt className="text-[#E50914]" />}
            title="Événements récents"
            linkLabel="Gérer"
            onLink={() => navigate("/admin/events")}
          />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                label: "Total participants",
                value: eventStats.participants,
                color: "text-[#E50914]",
                bg: "bg-[#E50914]/10 border border-[#E50914]/20",
                icon: <FaUsers />,
              },
              {
                label: "Inscriptions ouv.",
                value: eventStats.open,
                color: "text-green-400",
                bg: "bg-green-500/10 border border-green-500/20",
                icon: <FaLockOpen />,
              },
            ].map((s, i) => (
              <StatCard
                key={s.label}
                icon={s.icon}
                value={dv(s.value, loadingEvents)}
                label={s.label}
                color={s.color}
                bg={s.bg}
                delay={0.5 + i * 0.06}
                onClick={() => navigate("/admin/events")}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden"
          >
            {loadingEvents ? (
              <Loader />
            ) : recentEvents.length === 0 ? (
              <Empty text="Aucun événement." />
            ) : (
              <div className="divide-y divide-white/5">
                {recentEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    onClick={() => navigate("/admin/events")}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#0D0D0D] flex items-center justify-center">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaCalendarAlt className="text-gray-600 text-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {event.title}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <FaGamepad size={9} /> {event.game}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers size={9} />{" "}
                          <span className="text-white font-bold">
                            {event.registered || 0}
                          </span>{" "}
                          inscrits
                        </span>
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-semibold ${event.registrationOpen ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}
                    >
                      {event.registrationOpen ? (
                        <>
                          <FaLockOpen size={9} /> Ouvert
                        </>
                      ) : (
                        <>
                          <FaLock size={9} /> Fermé
                        </>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Inscriptions */}
        <div>
          <SectionTitle
            icon={<FaClipboardList className="text-[#E50914]" />}
            title="Inscriptions tournois"
            linkLabel="Gérer"
            onLink={() => navigate("/admin/events")}
          />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                label: "Total",
                value: regStats.total,
                color: "text-white",
                bg: "bg-white/5       border border-white/10",
                icon: <FaClipboardList />,
              },
              {
                label: "En attente",
                value: regStats.pending,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10 border border-yellow-500/20",
                icon: <FaClock />,
              },
              {
                label: "Confirmées",
                value: regStats.confirmed,
                color: "text-green-400",
                bg: "bg-green-500/10  border border-green-500/20",
                icon: <FaCheckCircle />,
              },
              {
                label: "Annulées",
                value: regStats.cancelled,
                color: "text-gray-400",
                bg: "bg-gray-500/10   border border-gray-500/20",
                icon: <FaBan />,
              },
            ].map((s, i) => (
              <StatCard
                key={s.label}
                icon={s.icon}
                value={dv(s.value, loadingRegs)}
                label={s.label}
                color={s.color}
                bg={s.bg}
                delay={0.5 + i * 0.06}
                onClick={() => navigate("/admin/events")}
              />
            ))}
          </div>

          {!loadingRegs && regStats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72 }}
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-5"
            >
              <p className="text-gray-400 text-sm font-semibold mb-5">
                Taux de traitement
              </p>
              {[
                {
                  label: "Confirmées",
                  count: regStats.confirmed,
                  bar: "bg-green-500",
                  text: "text-green-400",
                },
                {
                  label: "En attente",
                  count: regStats.pending,
                  bar: "bg-yellow-500",
                  text: "text-yellow-400",
                },
                {
                  label: "Annulées",
                  count: regStats.cancelled,
                  bar: "bg-gray-600",
                  text: "text-gray-400",
                },
              ].map((b) => {
                const pct =
                  regStats.total > 0
                    ? Math.round((b.count / regStats.total) * 100)
                    : 0;
                return (
                  <div key={b.label} className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-semibold ${b.text}`}>
                        {b.label}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {b.count} · {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-[#0D0D0D] rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className={`h-full rounded-full ${b.bar}`}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

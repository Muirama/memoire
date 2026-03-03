/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaSearch,
  FaUsers,
  FaLock,
  FaLockOpen,
  FaSpinner,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import api from "../../../api/api";
import EventCard from "./EventCard";
import ViewRegModal from "./modals/ViewRegModal";
import EditRegModal from "./modals/EditRegModal";
import DeleteRegModal from "./modals/DeleteRegModal";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [registrations, setRegistrations] = useState({});
  const [loadingRegs, setLoadingRegs] = useState({});
  const [toggling, setToggling] = useState({});

  // Modals
  const [viewReg, setViewReg] = useState(null);
  const [editReg, setEditReg] = useState(null);
  const [newRegStatus, setNewRegStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteRegId, setDeleteRegId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data.events))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchRegistrations = async (eventId) => {
    if (registrations[eventId]) return;
    setLoadingRegs((p) => ({ ...p, [eventId]: true }));
    try {
      const res = await api.get(`/registrations/event/${eventId}`);
      setRegistrations((p) => ({ ...p, [eventId]: res.data.registrations }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegs((p) => ({ ...p, [eventId]: false }));
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (expandedId !== id) fetchRegistrations(id);
  };

  const handleToggle = async (event) => {
    setToggling((p) => ({ ...p, [event.id]: true }));
    try {
      await api.patch(`/events/${event.id}/toggle`, {
        registrationOpen: !event.registrationOpen,
      });
      setEvents((p) =>
        p.map((e) =>
          e.id === event.id
            ? { ...e, registrationOpen: !e.registrationOpen }
            : e,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling((p) => ({ ...p, [event.id]: false }));
    }
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      await api.patch(`/registrations/${editReg.id}/status`, {
        status: newRegStatus,
      });
      setRegistrations((p) => ({
        ...p,
        [editReg.eventId]: p[editReg.eventId].map((r) =>
          r.id === editReg.id ? { ...r, status: newRegStatus } : r,
        ),
      }));
      setEditReg(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const reg = Object.values(registrations)
        .flat()
        .find((r) => r.id === deleteRegId);
      await api.delete(`/registrations/${deleteRegId}`);
      if (reg) {
        setRegistrations((p) => ({
          ...p,
          [reg.eventId]: p[reg.eventId].filter((r) => r.id !== deleteRegId),
        }));
        setEvents((p) =>
          p.map((e) =>
            e.id === reg.eventId
              ? { ...e, registered: Math.max(0, (e.registered || 0) - 1) }
              : e,
          ),
        );
      }
      setDeleteRegId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.game.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterOpen === "all"
        ? true
        : filterOpen === "open"
          ? e.registrationOpen
          : !e.registrationOpen;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <FaCalendarAlt className="text-[#E50914]" /> Événements & Inscriptions
        </h1>
        <p className="text-gray-500 mt-1">
          Gérez vos tournois et les inscriptions des participants
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total événements",
            value: events.length,
            color: "text-white",
            bg: "bg-white/5",
          },
          {
            label: "Inscriptions ouvertes",
            value: events.filter((e) => e.registrationOpen).length,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Inscriptions fermées",
            value: events.filter((e) => !e.registrationOpen).length,
            color: "text-gray-400",
            bg: "bg-gray-500/10",
          },
          {
            label: "Total participants",
            value: events.reduce((a, e) => a + (e.registered || 0), 0),
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

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       focus:ring-2 focus:ring-[#E50914]/30 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          {[
            { val: "all", label: "Tous" },
            { val: "open", label: "Ouverts" },
            { val: "closed", label: "Fermés" },
          ].map((f) => (
            <button
              key={f.val}
              type="button"
              onClick={() => setFilterOpen(f.val)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                          ${filterOpen === f.val ? "bg-[#E50914] text-white" : "bg-[#1A1A1A] text-gray-400 border border-white/10"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center h-48 items-center">
          <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isExpanded={expandedId === event.id}
              onToggleExpand={toggleExpand}
              regs={registrations[event.id] || []}
              isLoadingRegs={loadingRegs[event.id]}
              isToggling={toggling[event.id]}
              onToggleRegistration={handleToggle}
              onViewReg={setViewReg}
              onEditReg={(reg) => {
                setEditReg(reg);
                setNewRegStatus(reg.status);
              }}
              onDeleteReg={setDeleteRegId}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ViewRegModal reg={viewReg} onClose={() => setViewReg(null)} />
      <EditRegModal
        reg={editReg}
        newStatus={newRegStatus}
        setNewStatus={setNewRegStatus}
        onSave={handleSaveStatus}
        onClose={() => setEditReg(null)}
        saving={saving}
      />
      <DeleteRegModal
        regId={deleteRegId}
        onDelete={handleDelete}
        onClose={() => setDeleteRegId(null)}
        deleting={deleting}
      />
    </AdminLayout>
  );
}

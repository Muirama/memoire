import React from "react";
import { AnimatePresence } from "framer-motion";
import AdminModal from "../../../../components/ui/AdminModal";
import { formatDateTime, STATUS_REG } from "../../../../utils/adminFormatters";

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

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gray-500 w-20 flex-shrink-0">{label} :</span>
      <span
        className={`flex-1 font-semibold ${highlight ? "text-[#E50914]" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ViewRegModal({ reg, onClose }) {
  if (!reg) return null;
  const { date, time } = formatDateTime(reg.createdAt);
  return (
    <AnimatePresence>
      <AdminModal title={`Inscription #${reg.id}`} onClose={onClose}>
        <div className="space-y-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_REG[reg.status]}`}
          >
            {reg.status}
          </span>
          <Section title="Participant">
            <InfoRow label="Nom" value={reg.name} />
            <InfoRow label="Pseudo" value={reg.pseudo} highlight />
            <InfoRow label="Email" value={reg.email} />
            <InfoRow label="Téléphone" value={reg.phone} />
          </Section>
          <Section title="Inscription">
            <InfoRow label="N°" value={`#${reg.id}`} />
            <InfoRow label="Date" value={date} />
            <InfoRow label="Heure" value={time} />
          </Section>
        </div>
      </AdminModal>
    </AnimatePresence>
  );
}

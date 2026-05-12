import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { adminTeam, playerPhotoFallback } from "../../data/GamesData";

const toRgba = (hex, alpha) => {
  const value = hex.replace("#", "");
  const safe =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const number = parseInt(safe, 16);
  return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
};

const ROLE_COLORS = {
  CEO: "#E50914",
  "VICE-CEO": "#DC2626",
  "D.A": "#7C3AED",
  ADMIN: "#6B7280",
};

export default function AdminTeamPage() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent px-4 py-16 md:px-8 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#E50914]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#6B7280]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/team")}
          className="group mb-12 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-white"
        >
          <FaArrowLeft
            size={12}
            className="transition-transform group-hover:-translate-x-1"
          />
          Retour
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-[#E50914]" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#E50914]">
              Gascom Esports
            </span>
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[0.9] text-white md:text-7xl">
            Équipe <br />
            <span className="text-[#E50914]">Administrative</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminTeam.map((member, index) => (
            <AdminCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminCard({ member, index }) {
  const roleColor = ROLE_COLORS[member.role] || "#6B7280";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative min-h-[420px] overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e0e] transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: roleColor }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${toRgba(roleColor, 0.15)} 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex h-full flex-col p-8">
        <div className="mb-6">
          <span
            className="inline-block rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.35em]"
            style={{
              color: roleColor,
              borderColor: toRgba(roleColor, 0.3),
              background: toRgba(roleColor, 0.08),
            }}
          >
            {member.role}
          </span>
        </div>

        <div className="relative mb-6 flex flex-1 items-center justify-center py-6">
          <div
            className="absolute h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
            style={{ background: roleColor }}
          />

          {member.photo ? (
            <img
              src={member.photo}
              alt={member.pseudo}
              className="relative h-40 w-40 rounded-xl border-2 object-cover"
              style={{ borderColor: roleColor }}
            />
          ) : (
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed"
              style={{ borderColor: toRgba(roleColor, 0.4) }}
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={playerPhotoFallback}
                  alt="GeS"
                  className="h-20 w-20 object-contain opacity-40"
                />
                <p className="text-center text-[10px] text-gray-600">
                  Photo
                  <br />à ajouter
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/8 pt-4 text-center">
          <h3 className="mb-1 text-lg font-black leading-none text-white">
            {member.pseudo}
          </h3>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: roleColor }}
          >
            {member.title}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

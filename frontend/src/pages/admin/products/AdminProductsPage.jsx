/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStore,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaBoxOpen,
  FaTag,
  FaSortAmountDown,
  FaExclamationTriangle,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import api from "../../../api/api";
import AdminProductForm from "./AdminProductForm";

const CATEGORIES = [
  "Tous",
  "Jersey",
  "Accessoire",
  "Périphérique",
  "Goodies",
  "Autre",
];

const CATEGORY_COLORS = {
  Jersey: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Accessoire: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Périphérique: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Goodies: "bg-green-500/20 text-green-400 border-green-500/30",
  Autre: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const formatPrice = (p) => new Intl.NumberFormat("fr-MG").format(p) + " Ar";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Tous");
  const [sortBy, setSortBy] = useState("newest");

  // Formulaire
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Suppression
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────
  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products")
      .then((r) => setProducts(r.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Supprimer ──────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteId}`);
      setProducts((p) => p.filter((pr) => pr.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ── Filtrage + tri ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "Tous" || p.category === filterCat;
      return matchSearch && matchCat;
    });
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        list.sort((a, b) => a.stock - b.stock);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, search, filterCat, sortBy]);

  // Stats
  const totalStock = products.reduce((a, p) => a + (p.stock || 0), 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-white
                         flex items-center gap-3"
          >
            <FaStore className="text-[#E50914]" /> Produits
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez votre catalogue de produits Gascom
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914]
                     hover:bg-[#FF1E56] text-white font-bold text-sm rounded-xl
                     transition flex-shrink-0
                     hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
        >
          <FaPlus size={12} /> Nouveau produit
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total produits",
            value: products.length,
            color: "text-white",
            bg: "bg-white/5",
          },
          {
            label: "Stock total",
            value: totalStock,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Stock faible (≤5)",
            value: lowStock,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
          },
          {
            label: "Rupture de stock",
            value: outOfStock,
            color: "text-red-400",
            bg: "bg-red-500/10",
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

      {/* ── Filtres ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-500 pointer-events-none text-sm"
          />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       focus:ring-2 focus:ring-[#E50914]/30 transition-all text-sm"
          />
        </div>

        {/* Tri */}
        <div className="relative w-full md:w-52">
          <FaSortAmountDown
            className="absolute left-4 top-1/2 -translate-y-1/2
                                       text-gray-500 pointer-events-none text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] text-white rounded-xl
                       border border-white/10 focus:border-[#E50914] focus:outline-none
                       appearance-none transition-all text-sm"
          >
            <option value="newest">Plus récents</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="stock-asc">Stock faible en premier</option>
          </select>
        </div>
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
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

      {/* ── Contenu ── */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FaBoxOpen className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="mb-4">Aucun produit trouvé.</p>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-sm font-bold"
          >
            Créer le premier produit
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-xs mb-4">
            {filtered.length} produit(s)
          </p>

          {/* Grille produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onEdit={() => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}
                onDelete={() => setDeleteId(product.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Formulaire panneau latéral ── */}
      <AnimatePresence>
        {showForm && (
          <AdminProductForm
            product={editingProduct}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSaved={() => {
              setShowForm(false);
              setEditingProduct(null);
              fetchProducts();
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
              <div
                className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center
                              justify-center mx-auto mb-4"
              >
                <FaTrash className="text-red-400 text-xl" />
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-2">
                Supprimer le produit
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                Voulez-vous supprimer le produit{" "}
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

// ── Card produit ──────────────────────────────────────────
function ProductCard({ product, index, onEdit, onDelete }) {
  const stockStatus =
    product.stock === 0
      ? {
          label: "Rupture",
          cls: "text-red-400 bg-red-500/10 border-red-500/20",
        }
      : product.stock <= 5
        ? {
            label: "Stock faible",
            cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
          }
        : {
            label: `${product.stock} en stock`,
            cls: "text-green-400 bg-green-500/10 border-green-500/20",
          };

  const CATEGORY_COLORS = {
    Jersey: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Accessoire: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Périphérique: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Goodies: "bg-green-500/20 text-green-400 border-green-500/30",
    Autre: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-[#1A1A1A] rounded-2xl border border-white/5
                 hover:border-white/10 transition-all duration-300
                 overflow-hidden flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-44 bg-[#0D0D0D] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105
                          transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBoxOpen className="text-gray-700 text-5xl" />
          </div>
        )}

        {/* Badge catégorie */}
        <span
          className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full
                         border font-semibold
                         ${CATEGORY_COLORS[product.category] || CATEGORY_COLORS.Autre}`}
        >
          {product.category}
        </span>

        {/* Badge stock faible */}
        {product.stock <= 5 && (
          <span
            className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full
                           border font-semibold flex items-center gap-1
                           ${
                             product.stock === 0
                               ? "bg-red-500/20 text-red-400 border-red-500/30"
                               : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                           }`}
          >
            <FaExclamationTriangle size={9} />
            {product.stock === 0 ? "Rupture" : "Faible"}
          </span>
        )}

        {/* Actions overlay */}
        <div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                        transition-all duration-300 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={onEdit}
            className="w-10 h-10 rounded-xl bg-blue-500/20 hover:bg-blue-500/40
                       text-blue-400 border border-blue-500/30 transition
                       flex items-center justify-center"
          >
            <FaEdit size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/40
                       text-red-400 border border-red-500/30 transition
                       flex items-center justify-center"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed flex-1">
            {product.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {/* Prix */}
          <div className="flex items-center justify-between">
            <span className="text-[#E50914] font-extrabold text-base">
              {new Intl.NumberFormat("fr-MG").format(product.price)} Ar
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full border font-semibold
                             ${stockStatus.cls}`}
            >
              {stockStatus.label}
            </span>
          </div>

          {/* Boutons visibles en bas */}
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20
                         text-blue-400 text-xs font-semibold transition
                         flex items-center justify-center gap-1.5"
            >
              <FaEdit size={10} /> Modifier
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20
                         text-red-400 text-xs font-semibold transition
                         flex items-center justify-center gap-1.5"
            >
              <FaTrash size={10} /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

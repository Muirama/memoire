/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaTag,
  FaBox,
  FaSpinner,
  FaCheck,
  FaEye,
} from "react-icons/fa";
import api from "../../api/api";
import { useCart } from "../../context/CartContext";

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isInCart = items.some((item) => item.id === product?.id);
  const cartItem = items.find((item) => item.id === product?.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MG").format(price) + " Ar";

  // ── Fetch produit ─────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/shop/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Erreur fetch produit :", err);
        setError("Produit introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleViewCart = () => {
    openCart();
  };

  // ── Chargement ────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Chargement du produit...</p>
        </div>
      </section>
    );
  }

  // ── Erreur ────────────────────────────────────────────
  if (error || !product) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl mb-6">
            {error || "Produit introuvable."}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg
                       hover:bg-[#FF1E56] transition font-semibold
                       flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour à la boutique
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-transparent min-h-screen py-12 md:py-20 px-4 md:px-6 z-10">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914]
                     transition mb-8 font-semibold group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour à la boutique
        </motion.button>

        {/* Carte produit */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#E50914]/20
                     shadow-[0_0_40px_rgba(229,9,20,0.1)] grid grid-cols-1 md:grid-cols-2"
        >
          {/* ── Image ── */}
          <div className="relative h-64 md:h-full min-h-[300px] bg-[#0D0D0D] overflow-hidden">
            {!imgLoaded && !imgError && product.image && (
              <div
                className="absolute inset-0 bg-[#1A1A1A] animate-pulse
                              flex items-center justify-center"
              >
                <FaBox className="text-gray-700 text-5xl" />
              </div>
            )}

            {product.image && !imgError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500
                            ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center
                              justify-center gap-3"
              >
                <FaBox className="text-gray-600 text-6xl" />
                <span className="text-gray-600 text-sm">
                  Image non disponible
                </span>
              </div>
            )}

            {/* Badge catégorie */}
            <span
              className="absolute top-4 left-4 bg-[#E50914] text-white text-xs
                             px-3 py-1 rounded-full font-semibold shadow-lg z-10"
            >
              {product.category}
            </span>

            {/* Badge dans le panier */}
            {isInCart && (
              <div
                className="absolute top-4 right-4 bg-green-600 text-white text-xs
                              px-3 py-1 rounded-full font-semibold shadow-lg z-10
                              flex items-center gap-1"
              >
                <FaCheck size={10} /> Dans le panier
              </div>
            )}
          </div>

          {/* ── Infos ── */}
          <div className="p-6 md:p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-4">
                <FaBox className="text-[#E50914]" />
                <span
                  className={`text-sm font-semibold
                  ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {product.stock > 0
                    ? `${product.stock} en stock`
                    : "Rupture de stock"}
                </span>
              </div>

              {/* Si déjà dans le panier → afficher la quantité actuelle */}
              {isInCart && (
                <div
                  className="bg-green-600/10 border border-green-600/30 rounded-lg
                                px-4 py-2 mb-4 flex items-center gap-2"
                >
                  <FaCheck className="text-green-400" size={12} />
                  <span className="text-green-400 text-sm font-semibold">
                    {cartItem?.quantity} × dans votre panier
                  </span>
                </div>
              )}

              {/* Prix */}
              <div className="flex items-center gap-2 mb-8">
                <FaTag className="text-[#E50914]" />
                <span className="text-3xl md:text-4xl font-extrabold text-[#E50914]">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* ── Quantité + Boutons ── */}
            <div className="space-y-4">
              {/* Sélecteur quantité */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm font-semibold">
                  Quantité :
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-[#0D0D0D] border border-[#E50914]/30 text-white
                               rounded-lg hover:border-[#E50914] hover:bg-[#E50914]/10
                               transition flex items-center justify-center font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-white font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={product.stock === 0}
                    className="w-9 h-9 bg-[#0D0D0D] border border-[#E50914]/30 text-white
                               rounded-lg hover:border-[#E50914] hover:bg-[#E50914]/10
                               transition flex items-center justify-center font-bold text-lg
                               disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <p className="text-gray-500 text-sm">
                Total :{" "}
                <span className="text-white font-bold">
                  {formatPrice(product.price * quantity)}
                </span>
              </p>

              {/* Boutons */}
              <div className="flex gap-3">
                {/* Ajouter au panier */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-xl font-bold text-white text-sm
                              flex items-center justify-center gap-2 transition-all duration-300
                              ${
                                product.stock === 0
                                  ? "bg-gray-700 cursor-not-allowed opacity-50"
                                  : isInCart
                                    ? "bg-green-600 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                    : "bg-[#E50914] hover:bg-[#FF1E56] hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
                              }`}
                >
                  {product.stock === 0 ? (
                    "Rupture de stock"
                  ) : isInCart ? (
                    <>
                      <FaCheck /> Ajouter encore
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Ajouter au panier
                    </>
                  )}
                </motion.button>

                {/* Voir le panier si produit dedans */}
                {isInCart && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleViewCart}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm
                               border border-[#E50914] hover:bg-[#E50914]/10
                               flex items-center justify-center gap-2 transition-all"
                  >
                    <FaEye /> Voir le panier
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

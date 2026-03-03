/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye, FaCheck, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Vérifie si le produit est déjà dans le panier
  const isInCart = items.some((item) => item.id === product.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MG").format(price) + " Ar";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const goToDetail = () => navigate(`/shop/${product.id}`);

  const isExternalUrl = (src) =>
    src && (src.startsWith("http://") || src.startsWith("https://"));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20
                 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)]
                 transition-all duration-300 flex flex-col"
    >
      {/* ── Image ── */}
      <div
        className="relative h-40 md:h-48 overflow-hidden cursor-pointer bg-[#0D0D0D]"
        onClick={goToDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && goToDetail()}
        aria-label={`Voir les détails de ${product.name}`}
      >
        {/* Skeleton */}
        {!imgLoaded && !imgError && product.image && (
          <div
            className="absolute inset-0 bg-[#1A1A1A] animate-pulse
                          flex items-center justify-center"
          >
            <FaImage className="text-gray-700 text-4xl" />
          </div>
        )}

        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy={
              isExternalUrl(product.image) ? "no-referrer" : undefined
            }
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover hover:scale-110 transition
                        duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center
                          justify-center bg-[#111111] gap-2"
          >
            <FaImage className="text-gray-600 text-4xl" />
            <span className="text-gray-600 text-xs">Image non disponible</span>
          </div>
        )}

        {/* Badge catégorie */}
        <span
          className="absolute top-2 right-2 bg-[#E50914] text-white text-xs
                         px-2 py-1 rounded-full font-semibold z-10 shadow-lg"
        >
          {product.category}
        </span>

        {/* Badge "Dans le panier" */}
        {isInCart && (
          <div
            className="absolute top-2 left-2 bg-green-600 text-white text-xs
                          px-2 py-1 rounded-full font-semibold z-10
                          flex items-center gap-1 shadow-lg"
          >
            <FaCheck size={9} /> Panier
          </div>
        )}
      </div>

      {/* ── Infos ── */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3
          className="text-base md:text-lg font-bold text-white mb-2
                     line-clamp-1 cursor-pointer hover:text-[#E50914] transition"
          onClick={goToDetail}
        >
          {product.name}
        </h3>

        <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <p className="text-xl md:text-2xl font-extrabold text-[#E50914] mb-3 md:mb-4">
          {formatPrice(product.price)}
        </p>

        {/* ── Actions ── */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToDetail}
            className="flex-1 bg-transparent border border-[#E50914] text-white
                       font-semibold py-2 rounded-lg hover:bg-[#E50914]/10
                       transition-all flex items-center justify-center gap-2 text-sm"
          >
            <FaEye /> Détails
          </button>

          {isInCart ? (
            // Déjà dans le panier → bouton vert "Ajouté"
            // Un clic supplémentaire ajoute +1 à la quantité
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white
                         font-semibold py-2 rounded-lg transition-all
                         flex items-center justify-center gap-2 text-sm
                         hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] active:scale-95"
            >
              <FaCheck /> Ajouté
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[#E50914] hover:bg-[#FF1E56] text-white
                         font-semibold py-2 rounded-lg transition-all
                         flex items-center justify-center gap-2 text-sm
                         hover:shadow-[0_0_15px_rgba(229,9,20,0.6)] active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              {product.stock === 0 ? "Rupture" : "Panier"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

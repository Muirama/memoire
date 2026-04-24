/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaEye,
  FaCheck,
  FaImage,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { isUserLoggedIn, buildLoginRedirect } from "../utils/auth";

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isInCart = items.some((item) => item.id === product.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MG").format(price) + " Ar";

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // ── Vérification connexion ────────────────────────
    if (!isUserLoggedIn()) {
      navigate(buildLoginRedirect("/shop"));
      return;
    }

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
      className="w-full h-full bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#E50914]/20
                 hover:border-[#E50914] hover:shadow-[0_0_25px_rgba(229,9,20,0.4)]
                 transition-all duration-300 flex flex-col"
    >
      {/* ── Image ── */}
      <div
        className="relative h-40 md:h-48 overflow-hidden cursor-pointer bg-[#0D0D0D] shrink-0"
        onClick={goToDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && goToDetail()}
        aria-label={`Voir les détails de ${product.name}`}
      >
        {/* Skeleton */}
        {!imgLoaded && !imgError && product.image && (
          <div className="absolute inset-0 bg-[#1A1A1A] animate-pulse flex items-center justify-center">
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#111111] gap-2">
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

        <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2 h-10 shrink-0">
          {product.description}
        </p>

        {/* ── Stock ── */}
        <div className="mb-4 shrink-0">
          {product.stock > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-green-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  En stock
                </span>
                <span className="text-gray-500">
                  {product.stock} disponibles
                </span>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    product.stock <= 5 ? "bg-orange-500" : "bg-green-600/50"
                  }`}
                  style={{
                    width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Rupture de stock
            </div>
          )}
        </div>

        {/* Prix */}
        <p className="text-xl md:text-2xl font-extrabold text-[#E50914] mb-3 md:mb-4 mt-auto">
          {formatPrice(product.price)}
        </p>

        {/* ── Actions ── */}
        <div className="flex gap-2 shrink-0">
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
              {/* Icône cadenas si non connecté */}
              {!isUserLoggedIn() ? (
                <>
                  <FaLock size={11} /> Connexion
                </>
              ) : product.stock === 0 ? (
                <>
                  <FaShoppingCart /> Rupture
                </>
              ) : (
                <>
                  <FaShoppingCart /> Panier
                </>
              )}
            </button>
          )}
        </div>

        {/* Message connexion requis */}
        {!isUserLoggedIn() && (
          <p className="text-center text-gray-600 text-xs mt-2">
            <span className="text-[#E50914]">Connectez-vous</span> pour acheter
          </p>
        )}
      </div>
    </motion.div>
  );
}

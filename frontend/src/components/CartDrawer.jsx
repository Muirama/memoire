/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaCheck,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-MG").format(price) + " Ar";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    totalAmount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay semi-transparent ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />

          {/* ── Drawer ── */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md
                       bg-[#111111] border-l border-[#E50914]/20
                       z-[80] flex flex-col shadow-2xl"
          >
            {/* ══ HEADER ══ */}
            <div
              className="flex items-center justify-between px-6 py-5
                            border-b border-white/5 flex-shrink-0"
            >
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-[#E50914] text-xl" />
                <h2 className="text-white font-extrabold text-lg">
                  Mon Panier
                </h2>
                {totalItems > 0 && (
                  <span
                    className="bg-[#E50914] text-white text-xs
                                   w-6 h-6 rounded-full font-bold
                                   flex items-center justify-center"
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Vider tout */}
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-400 text-xs
                               flex items-center gap-1.5 transition-colors
                               px-3 py-1.5 rounded-lg hover:bg-red-400/10
                               border border-transparent hover:border-red-400/20"
                  >
                    <FaTrash size={11} /> Tout vider
                  </button>
                )}

                {/* Fermer */}
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-gray-400 hover:text-white transition
                             w-8 h-8 flex items-center justify-center
                             rounded-lg hover:bg-white/5"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* ══ LISTE ARTICLES ══ */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                /* Panier vide */
                <div
                  className="flex flex-col items-center justify-center
                                h-full gap-4 text-center pb-10"
                >
                  <div
                    className="w-20 h-20 rounded-full bg-[#1A1A1A]
                                  flex items-center justify-center"
                  >
                    <FaShoppingCart className="text-gray-600 text-3xl" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">
                      Votre panier est vide
                    </p>
                    <p className="text-gray-500 text-sm">
                      Ajoutez des produits depuis la boutique
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      navigate("/shop");
                    }}
                    className="mt-2 px-6 py-2.5 bg-[#E50914] text-white rounded-lg
                               hover:bg-[#FF1E56] transition font-semibold text-sm
                               hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                  >
                    Voir la boutique
                  </button>
                </div>
              ) : (
                /* Articles */
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5
                                 hover:border-[#E50914]/20 transition-colors"
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        <div
                          className="w-16 h-16 rounded-lg overflow-hidden
                                        bg-[#0D0D0D] flex-shrink-0"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center
                                            justify-center text-2xl"
                            >
                              🎮
                            </div>
                          )}
                        </div>

                        {/* Infos produit */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="text-white font-semibold text-sm
                                          leading-tight line-clamp-2 flex-1"
                            >
                              {item.name}
                            </p>
                            {/* Supprimer */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-600 hover:text-red-400
                                         transition flex-shrink-0 mt-0.5"
                              aria-label={`Retirer ${item.name}`}
                            >
                              <FaTimes size={13} />
                            </button>
                          </div>

                          {/* Prix unitaire */}
                          <p className="text-[#E50914] font-bold text-sm mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantité + Sous-total */}
                      <div
                        className="flex items-center justify-between mt-3 pt-3
                                      border-t border-white/5"
                      >
                        {/* Contrôles quantité */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 bg-[#0D0D0D] border border-white/10
                                       rounded-lg flex items-center justify-center
                                       text-white hover:border-[#E50914]
                                       hover:bg-[#E50914]/10 transition"
                            aria-label="Réduire la quantité"
                          >
                            <FaMinus size={9} />
                          </button>

                          <span
                            className="text-white font-bold text-sm
                                           w-8 text-center"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="w-7 h-7 bg-[#0D0D0D] border border-white/10
                                       rounded-lg flex items-center justify-center
                                       text-white hover:border-[#E50914]
                                       hover:bg-[#E50914]/10 transition
                                       disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Augmenter la quantité"
                          >
                            <FaPlus size={9} />
                          </button>
                        </div>

                        {/* Sous-total ligne */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Sous-total</p>
                          <p className="text-white font-bold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* ══ FOOTER ══ */}
            {items.length > 0 && (
              <div
                className="border-t border-white/5 px-6 py-5
                              space-y-4 flex-shrink-0 bg-[#0D0D0D]/50"
              >
                {/* Récapitulatif */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      {totalItems} article{totalItems > 1 ? "s" : ""}
                    </span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-base">
                      Total
                    </span>
                    <span className="text-[#E50914] font-extrabold text-2xl">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Boutons */}
                <div className="space-y-2">
                  {/* Commander */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#E50914] hover:bg-[#FF1E56]
                               text-white font-bold rounded-xl transition-all
                               duration-300 hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]
                               flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    Commander — {formatPrice(totalAmount)}
                  </motion.button>

                  {/* Continuer les achats */}
                  <button
                    type="button"
                    onClick={closeCart}
                    className="w-full py-3 text-gray-400 hover:text-white
                               text-sm font-semibold transition-colors
                               hover:bg-white/5 rounded-xl"
                  >
                    Continuer mes achats →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

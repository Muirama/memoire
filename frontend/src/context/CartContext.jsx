/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

// ── Création du contexte ──────────────────────────────────
const CartContext = createContext(null);

// ── Hook personnalisé ─────────────────────────────────────
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};

// ── Provider ──────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ── Ouvrir / fermer le panier ─────────────────────────
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  // ── Ajouter un produit ────────────────────────────────
  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Produit déjà dans le panier → augmenter la quantité
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );
      }
      // Nouveau produit
      return [...prev, { ...product, quantity }];
    });
    setIsOpen(true); // Ouvrir le panier automatiquement
  }, []);

  // ── Retirer un produit ────────────────────────────────
  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // ── Modifier la quantité ──────────────────────────────
  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  // ── Vider le panier ───────────────────────────────────
  const clearCart = useCallback(() => setItems([]), []);

  // ── Calculs ───────────────────────────────────────────
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalAmount,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

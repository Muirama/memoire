/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBox,
  FaCheck,
  FaChevronRight,
  FaEye,
  FaShoppingCart,
  FaSpinner,
  FaTag,
} from "react-icons/fa";
import api from "../../api/api";
import { useCart } from "../../context/CartContext";

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isInCart = items.some((item) => item.id === product?.id);
  const cartItem = items.find((item) => item.id === product?.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-MG").format(price) + " Ar";

  const isExternalUrl = (src) =>
    src && (src.startsWith("http://") || src.startsWith("https://"));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setImgError(false);
    setImgLoaded(false);
    setQuantity(1);

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productRes, productsRes] = await Promise.all([
          api.get(`/shop/${id}`),
          api.get("/shop"),
        ]);
        setProduct(productRes.data.product);
        setOtherProducts(productsRes.data.products || []);
      } catch (err) {
        setError("Produit introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => addToCart(product, quantity);
  const handleViewCart = () => openCart();

  const relatedProducts = otherProducts
    .filter((item) => item.id !== Number(id))
    .sort((a, b) => (a.category === product?.category ? -1 : 1))
    .slice(0, 4);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-[#E50914] text-4xl animate-spin" />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-[#E50914] text-white rounded-lg"
        >
          Retour boutique
        </button>
      </section>
    );
  }

  return (
    <section className="relative bg-transparent min-h-screen py-8 md:py-12 px-4 z-10">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914] transition mb-5 text-sm"
        >
          <FaArrowLeft /> Boutique
        </motion.button>

        {/* CARTE PRODUIT RÉDUITE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111]/95 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]"
        >
          {/* Section Image plus courte */}
          <div className="relative min-h-[300px] lg:min-h-[420px] bg-[#0D0D0D]">
            {product.image && !imgError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy={
                  isExternalUrl(product.image) ? "no-referrer" : undefined
                }
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaBox className="text-gray-700 text-4xl" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="bg-[#E50914] text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Section Infos plus compacte */}
          <div className="p-5 md:p-8 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff6b72] font-bold mb-1">
              Gascom Edition
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {product.description ||
                "Produit officiel Gascom sélectionné pour sa qualité."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Prix</p>
                <p className="text-xl font-black text-[#E50914]">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase mb-1">
                  Disponibilité
                </p>
                <p
                  className={`text-sm font-bold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                </p>
              </div>
            </div>

            {/* Actions resserrées */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="text-xs text-gray-400 ml-2">Quantité</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-[#E50914] transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-white hover:bg-[#E50914] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    product.stock === 0
                      ? "bg-gray-800 text-gray-500"
                      : isInCart
                        ? "bg-green-600 text-white"
                        : "bg-[#E50914] text-white hover:scale-[1.02]"
                  }`}
                >
                  {product.stock === 0 ? (
                    "Rupture"
                  ) : isInCart ? (
                    <>
                      <FaCheck /> Ajouter
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Panier
                    </>
                  )}
                </button>
                {isInCart && (
                  <button
                    onClick={handleViewCart}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                  >
                    <FaEye />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* PRODUITS SIMILAIRES PLUS PETITS */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-white mb-4">
              Produits suggérés
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/shop/${item.id}`)}
                  className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-[#E50914]/50 transition-all text-left"
                >
                  <div className="h-24 bg-black">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-white text-[11px] font-bold truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#E50914] text-xs font-black mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

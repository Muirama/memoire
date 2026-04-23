/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaFilePdf,
  FaLock,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import api from "../../api/api";
import { generateReceipt } from "../../utils/generateReceipt";
import { buildLoginRedirect, isUserLoggedIn } from "../../utils/auth";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-MG").format(price) + " Ar";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [savedOrder, setSavedOrder] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [savedCustomer, setSavedCustomer] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate(buildLoginRedirect("/checkout"), { replace: true });
      return;
    }

    let active = true;

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await api.get("/auth/me");
        if (active) {
          setProfile(res.data.user);
        }
      } catch (err) {
        if (active) {
          setErrors({
            global:
              err.response?.data?.message ||
              "Impossible de charger votre profil.",
          });
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (items.length === 0 && !success) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaShoppingCart className="text-gray-700 text-6xl mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-6">Votre panier est vide.</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-[#E50914] text-white rounded-lg
                       hover:bg-[#FF1E56] transition font-semibold"
          >
            Retour a la boutique
          </button>
        </div>
      </section>
    );
  }

  const profileIncomplete =
    profile && (!profile.name || !profile.email || !profile.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileIncomplete) {
      setErrors({
        global:
          "Votre profil est incomplet. Nom, email et telephone sont requis.",
      });
      return;
    }

    const itemsSnapshot = [...items];
    const customerSnapshot = {
      customerName: profile.name,
      customerEmail: profile.email,
      customerPhone: profile.phone,
      customerAddress: profile.address || "",
      notes,
    };

    try {
      setLoading(true);
      setErrors({});

      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        notes: notes.trim() || null,
      };

      const res = await api.post("/orders", orderPayload);
      const order = res.data.order;

      setSavedOrder(order);
      setSavedItems(itemsSnapshot);
      setSavedCustomer(customerSnapshot);
      setOrderId(order.id);

      clearCart();

      generateReceipt({
        order,
        items: itemsSnapshot,
        customer: customerSnapshot,
      });

      setSuccess(true);
    } catch (err) {
      setErrors({
        global:
          err.response?.data?.message ||
          "Une erreur est survenue. Veuillez reessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedownload = () => {
    if (savedOrder && savedItems && savedCustomer) {
      generateReceipt({
        order: savedOrder,
        items: savedItems,
        customer: savedCustomer,
      });
    }
  };

  if (profileLoading) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <FaSpinner className="text-[#E50914] text-5xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            Chargement de votre profil...
          </p>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="relative bg-transparent min-h-screen flex items-center justify-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1A1A1A] rounded-2xl p-10 text-center max-w-md w-full
                     border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaCheckCircle className="text-green-400 text-7xl mx-auto mb-6" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-white mb-3">
            Commande confirmee !
          </h2>
          <p className="text-gray-400 mb-2">Merci pour votre commande.</p>
          <p className="text-gray-500 text-sm mb-2">
            Commande n° <span className="text-[#E50914] font-bold">#{orderId}</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Vous serez contacte prochainement.
          </p>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <FaFilePdf className="text-green-400 text-2xl flex-shrink-0" />
            <div className="text-left">
              <p className="text-green-400 font-semibold text-sm">
                Recu telecharge !
              </p>
              <p className="text-gray-500 text-xs">Recu_Gascom_{orderId}.pdf</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleRedownload}
              className="w-full py-3 border border-[#E50914] text-[#E50914]
                         hover:bg-[#E50914]/10 font-bold rounded-xl transition-all
                         flex items-center justify-center gap-2"
            >
              <FaFilePdf /> Retelecharger le recu
            </button>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="w-full py-3 bg-[#E50914] hover:bg-[#FF1E56] text-white
                         font-bold rounded-xl transition-all"
            >
              Continuer mes achats
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      className="relative bg-transparent min-h-screen py-12 md:py-20
                        px-4 md:px-6 z-10"
    >
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914]
                     transition mb-8 font-semibold group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour a la boutique
        </motion.button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10">
          Finaliser la <span className="text-[#E50914]">commande</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-white/5"
          >
            <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <FaLock className="text-[#E50914]" /> Informations du compte
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.global && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{errors.global}</p>
                </div>
              )}

              <ReadOnlyField
                label="Nom complet"
                value={profile?.name || "Non renseigne"}
                icon={<FaUser />}
              />
              <ReadOnlyField
                label="Email"
                value={profile?.email || "Non renseigne"}
                icon={<FaEnvelope />}
              />
              <ReadOnlyField
                label="Telephone"
                value={profile?.phone || "Non renseigne"}
                icon={<FaPhone />}
              />
              <ReadOnlyField
                label="Adresse de livraison"
                value={profile?.address || "Aucune adresse enregistree"}
                icon={<FaMapMarkerAlt />}
                multiline
              />

              <div>
                <label className="text-gray-400 text-sm font-semibold mb-1 block">
                  Notes (optionnel)
                </label>
                <textarea
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Instructions speciales, heure de livraison..."
                  className="w-full px-4 py-3 bg-[#0D0D0D] text-white rounded-lg
                             border border-white/10 focus:border-[#E50914]
                             focus:ring-2 focus:ring-[#E50914]/30 focus:outline-none
                             transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-xs bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                <FaFilePdf className="text-[#E50914]" />
                Un recu PDF sera telecharge automatiquement apres confirmation.
              </div>

              <motion.button
                type="submit"
                disabled={loading || profileIncomplete}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-[#E50914] hover:bg-[#FF1E56] text-white
                           font-bold rounded-xl transition-all duration-300
                           hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-3 text-base"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Traitement...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Confirmer - {formatPrice(totalAmount)}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-white/5 h-fit"
          >
            <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <FaShoppingCart className="text-[#E50914]" />
              Recapitulatif ({items.length} article{items.length > 1 ? "s" : ""})
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center pb-4 border-b border-white/5 last:border-0"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0D0D0D] flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🎮
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-[#E50914] font-bold text-sm flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#0D0D0D] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">
                  Total a payer
                </span>
                <span className="text-[#E50914] font-extrabold text-2xl">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReadOnlyField({ label, value, icon, multiline = false }) {
  return (
    <div>
      <label className="text-gray-400 text-sm font-semibold mb-1 block">
        {label}
      </label>
      <div
        className={`relative w-full pl-11 pr-4 py-3 bg-[#0D0D0D] text-white rounded-lg border border-white/10 ${
          multiline ? "min-h-[76px]" : ""
        }`}
      >
        <span className="absolute left-4 top-4 text-gray-500 text-sm">
          {icon}
        </span>
        <span className={`block ${multiline ? "whitespace-pre-line" : ""}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

import axios from "axios";
import { clearAuthSession } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Intercepteur requête ──────────────────────────────────
// Ajoute automatiquement le token JWT si présent (pour les admins)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Intercepteur réponse ──────────────────────────────────
// Gère les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → déconnecter l'admin
      clearAuthSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

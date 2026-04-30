/* eslint-disable no-useless-escape */
const VALID_PREFIXES = ["032", "033", "034", "037", "038"];

export const cleanPhone = (phone) => phone.replace(/[\s\-\.]/g, "");

/**
 * Formate automatiquement en "034 23 456 78" pendant la saisie
 */
export const formatPhone = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 5),
    digits.slice(5, 8),
    digits.slice(8, 10),
  ].filter(Boolean);
  return parts.join(" ");
};

/**
 * Valide le numéro complet
 * Retourne null si valide, sinon un message d'erreur string
 */
export const validatePhone = (phone) => {
  const cleaned = cleanPhone(phone);

  if (!cleaned) return "Le numéro de téléphone est requis.";

  if (cleaned.length !== 10)
    return `Le numéro doit contenir 10 chiffres (actuellement ${cleaned.length}).`;

  const prefix = cleaned.slice(0, 3);
  if (!VALID_PREFIXES.includes(prefix))
    return `Opérateur invalide. Utilisez : ${VALID_PREFIXES.join(", ")}.`;

  return null;
};

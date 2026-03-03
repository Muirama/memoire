export const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (d) => {
  const date = new Date(d);
  return {
    date: date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const formatPrice = (p) =>
  p ? new Intl.NumberFormat("fr-MG").format(p) + " Ar" : "—";

export const STATUS_REG = {
  "En attente": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Confirmée: "bg-green-500/20  text-green-400  border-green-500/30",
  Annulée: "bg-gray-500/20   text-gray-400   border-gray-500/30",
};

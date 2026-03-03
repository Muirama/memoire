const { Registration, Event } = require("../models");

// ── POST s'inscrire à un événement (public) ───────────────
const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone, pseudo } = req.body;

    // Validation champs
    if (!name || !email || !phone || !pseudo)
      return res.status(400).json({
        message: "Nom, email, téléphone et pseudo sont requis.",
      });

    // Vérifier que l'événement existe
    const event = await Event.findByPk(eventId);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });

    // Seule vérification : est-ce que l'admin a fermé les inscriptions ?
    if (!event.registrationOpen)
      return res.status(400).json({
        message: "Les inscriptions pour cet événement sont fermées.",
      });

    // Vérifier si déjà inscrit avec cet email
    const already = await Registration.findOne({
      where: { eventId: parseInt(eventId), email: email.trim().toLowerCase() },
    });
    if (already)
      return res.status(409).json({
        message: "Vous êtes déjà inscrit à cet événement avec cet email.",
      });

    // Créer l'inscription
    const registration = await Registration.create({
      eventId: parseInt(eventId),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      pseudo: pseudo.trim(),
      status: "En attente",
    });

    // Incrémenter le compteur de participants
    await event.update({ registered: (event.registered || 0) + 1 });

    return res.status(201).json({
      message: "Inscription réussie !",
      registration: {
        id: registration.id,
        name: registration.name,
        pseudo: registration.pseudo,
        eventName: event.title,
        eventDate: event.date,
        status: registration.status,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur createRegistration :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur.", detail: error.message });
  }
};

// ── GET toutes les inscriptions (admin) ───────────────────
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [{ model: Event, attributes: ["id", "title", "date", "game"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ registrations });
  } catch (error) {
    console.error("Erreur getAllRegistrations :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET inscriptions d'un événement (admin) ───────────────
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });

    const registrations = await Registration.findAll({
      where: { eventId: parseInt(eventId) },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      event: { id: event.id, title: event.title, date: event.date },
      registrations,
      total: registrations.length,
    });
  } catch (error) {
    console.error("Erreur getEventRegistrations :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH modifier le statut d'une inscription (admin) ────
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["En attente", "Confirmée", "Annulée"];
    if (!status || !validStatuses.includes(status))
      return res.status(400).json({
        message: `Statut invalide. Valeurs : ${validStatuses.join(", ")}`,
      });

    const registration = await Registration.findByPk(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Inscription introuvable." });

    await registration.update({ status });
    return res.status(200).json({
      message: "Statut mis à jour.",
      registration: { id: registration.id, status: registration.status },
    });
  } catch (error) {
    console.error("Erreur updateRegistrationStatus :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer une inscription (admin) ──────────────
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Inscription introuvable." });
    await registration.destroy();
    return res.status(200).json({ message: "Inscription supprimée." });
  } catch (error) {
    console.error("Erreur deleteRegistration :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createRegistration,
  getEventRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
};

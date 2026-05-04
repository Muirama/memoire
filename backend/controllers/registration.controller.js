const { Registration, Event, User } = require("../models");

// POST s'inscrire a un evenement (user connecte)
const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.user?.id || req.user.role !== "user") {
      return res.status(403).json({
        message: "Connexion utilisateur requise pour s'inscrire.",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (!user.name || !user.email || !user.phone || !user.pseudo) {
      return res.status(400).json({
        message:
          "Profil incomplet. Nom, email, telephone et pseudo sont requis.",
      });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evenement introuvable." });
    }

    if (!event.registrationOpen) {
      return res.status(400).json({
        message: "Les inscriptions pour cet evenement sont fermees.",
      });
    }

    const already = await Registration.findOne({
      where: { eventId: parseInt(eventId, 10), userId: user.id },
    });
    if (already) {
      return res.status(409).json({
        message: "Vous etes deja inscrit a cet evenement.",
      });
    }

    const registration = await Registration.create({
      eventId: parseInt(eventId, 10),
      userId: user.id,
      name: user.name.trim(),
      email: user.email.trim().toLowerCase(),
      phone: user.phone.trim(),
      pseudo: user.pseudo.trim(),
      status: "En attente",
    });

    await event.update({ registered: (event.registered || 0) + 1 });

    return res.status(201).json({
      message: "Inscription reussie !",
      registration: {
        id: registration.id,
        userId: registration.userId,
        name: registration.name,
        pseudo: registration.pseudo,
        email: registration.email,
        phone: registration.phone,
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

// ── GET vérifier si l'user connecté est inscrit à un event ──
// GET /api/registrations/check/:eventId
const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.user?.id) {
      return res.status(200).json({ registered: false });
    }

    const existing = await Registration.findOne({
      where: {
        eventId: parseInt(eventId, 10),
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      registered: Boolean(existing),
      registration: existing
        ? {
            id: existing.id,
            status: existing.status,
            createdAt: existing.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Erreur checkRegistration :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET toutes les inscriptions (admin)
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

// GET inscriptions d'un evenement (admin)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evenement introuvable." });
    }

    const registrations = await Registration.findAll({
      where: { eventId: parseInt(eventId, 10) },
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

// PATCH modifier le statut d'une inscription (admin)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["En attente", "Confirmée", "Annulée"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Statut invalide. Valeurs : ${validStatuses.join(", ")}`,
      });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Inscription introuvable." });
    }

    await registration.update({ status });
    return res.status(200).json({
      message: "Statut mis a jour.",
      registration: { id: registration.id, status: registration.status },
    });
  } catch (error) {
    console.error("Erreur updateRegistrationStatus :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE supprimer une inscription (admin)
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Inscription introuvable." });
    }
    await registration.destroy();
    return res.status(200).json({ message: "Inscription supprimee." });
  } catch (error) {
    console.error("Erreur deleteRegistration :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createRegistration,
  checkRegistration,
  getEventRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
};

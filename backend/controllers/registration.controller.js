const { Registration, Event, User } = require("../models");

const SQUAD_MIN = 5; // capitaine inclus
const SQUAD_MAX = 7; // capitaine inclus

const REG_STATUS_VALUES =
  Registration.rawAttributes?.status?.values ||
  Registration.getAttributes?.().status?.values || [
    "En attente",
    "Confirmee",
    "Annulee",
  ];
const [STATUS_PENDING, STATUS_CONFIRMED] = REG_STATUS_VALUES;

const isCapacityLimited = (event) =>
  Number.isInteger(event?.maxParticipants) && event.maxParticipants > 0;

const fillWaitlistIfPossible = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event || !isCapacityLimited(event)) return [];

  const confirmedCount = await Registration.count({
    where: { eventId, status: STATUS_CONFIRMED },
  });
  const freeSpots = event.maxParticipants - confirmedCount;
  if (freeSpots <= 0) return [];

  const waitingRegs = await Registration.findAll({
    where: { eventId, status: STATUS_PENDING },
    order: [["createdAt", "ASC"]],
    limit: freeSpots,
  });
  if (waitingRegs.length === 0) return [];

  const ids = waitingRegs.map((r) => r.id);
  await Registration.update(
    { status: STATUS_CONFIRMED },
    { where: { id: ids } },
  );
  return ids;
};

// POST s'inscrire a un evenement
const createRegistration = async (req, res) => {
  try {
    const eventId = Number.parseInt(req.params.eventId, 10);

    if (!Number.isInteger(eventId)) {
      return res.status(400).json({ message: "ID evenement invalide." });
    }

    if (!req.user?.id || req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Connexion utilisateur requise pour s'inscrire." });
    }

    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    if (!user.name || !user.email || !user.phone || !user.pseudo) {
      return res.status(400).json({
        message:
          "Profil incomplet. Nom, email, telephone et pseudo sont requis.",
      });
    }

    const already = await Registration.findOne({
      where: { eventId, userId: user.id },
    });
    if (already) {
      return res
        .status(409)
        .json({ message: "Vous etes deja inscrit a cet evenement." });
    }

    let teammates = null;
    let created = null;
    let eventInfo = null;

    await Event.sequelize.transaction(async (transaction) => {
      const event = await Event.findByPk(eventId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!event) {
        const err = new Error("EVT_NOT_FOUND");
        err.code = "EVT_NOT_FOUND";
        throw err;
      }

      if (!event.registrationOpen) {
        const err = new Error("REG_CLOSED");
        err.code = "REG_CLOSED";
        throw err;
      }

      if (event.category === "Squad") {
        const raw = req.body.teammates;

        if (!Array.isArray(raw) || raw.length === 0) {
          const err = new Error(
            `Un evenement squad necessite ${SQUAD_MIN - 1} a ${SQUAD_MAX - 1} coequipiers en plus de vous.`,
          );
          err.code = "SQUAD_INVALID";
          throw err;
        }

        const total = raw.length + 1; // +1 capitaine
        if (total < SQUAD_MIN || total > SQUAD_MAX) {
          const err = new Error(
            `L'equipe doit avoir entre ${SQUAD_MIN} et ${SQUAD_MAX} membres (vous inclus). Actuellement : ${total}.`,
          );
          err.code = "SQUAD_INVALID";
          throw err;
        }

        for (let i = 0; i < raw.length; i += 1) {
          const tm = raw[i];
          if (!tm.pseudo?.trim()) {
            const err = new Error(`Pseudo requis pour le coequipier ${i + 1}.`);
            err.code = "SQUAD_INVALID";
            throw err;
          }
          if (!tm.phone?.trim()) {
            const err = new Error(
              `Telephone requis pour le coequipier ${i + 1}.`,
            );
            err.code = "SQUAD_INVALID";
            throw err;
          }
        }

        teammates = raw.map((tm) => ({
          pseudo: tm.pseudo.trim(),
          name: tm.name?.trim() || null,
          phone: tm.phone.trim(),
        }));
      }

      const confirmedCount = await Registration.count({
        where: { eventId, status: STATUS_CONFIRMED },
        transaction,
      });
      const autoConfirm =
        !isCapacityLimited(event) || confirmedCount < event.maxParticipants;
      const status = autoConfirm ? STATUS_CONFIRMED : STATUS_PENDING;

      created = await Registration.create(
        {
          eventId,
          userId: user.id,
          name: user.name.trim(),
          email: user.email.trim().toLowerCase(),
          phone: user.phone.trim(),
          pseudo: user.pseudo.trim(),
          teammates,
          status,
        },
        { transaction },
      );

      await event.update(
        { registered: (event.registered || 0) + 1 },
        { transaction },
      );

      eventInfo = {
        title: event.title,
        date: event.date,
        category: event.category,
      };
    });

    return res.status(201).json({
      message:
        created.status === STATUS_CONFIRMED
          ? "Inscription confirmee automatiquement."
          : "Inscription en liste d'attente.",
      registration: {
        id: created.id,
        userId: created.userId,
        name: created.name,
        pseudo: created.pseudo,
        email: created.email,
        phone: created.phone,
        teammates: created.teammates,
        eventName: eventInfo.title,
        eventDate: eventInfo.date,
        eventType: eventInfo.category,
        status: created.status,
        createdAt: created.createdAt,
      },
    });
  } catch (error) {
    if (error.code === "EVT_NOT_FOUND") {
      return res.status(404).json({ message: "Evenement introuvable." });
    }
    if (error.code === "REG_CLOSED") {
      return res
        .status(400)
        .json({ message: "Les inscriptions pour cet evenement sont fermees." });
    }
    if (error.code === "SQUAD_INVALID") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Erreur createRegistration :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur.", detail: error.message });
  }
};

// GET verifier si l'user est inscrit
const checkRegistration = async (req, res) => {
  try {
    const eventId = Number.parseInt(req.params.eventId, 10);
    if (!req.user?.id || !Number.isInteger(eventId)) {
      return res.status(200).json({ registered: false });
    }

    const existing = await Registration.findOne({
      where: { eventId, userId: req.user.id },
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
      include: [
        {
          model: Event,
          attributes: [
            "id",
            "title",
            "date",
            "game",
            "category",
            "maxParticipants",
          ],
        },
      ],
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
    const eventId = Number.parseInt(req.params.eventId, 10);
    if (!Number.isInteger(eventId)) {
      return res.status(400).json({ message: "ID evenement invalide." });
    }

    const event = await Event.findByPk(eventId);
    if (!event)
      return res.status(404).json({ message: "Evenement introuvable." });

    const registrations = await Registration.findAll({
      where: { eventId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        category: event.category,
        maxParticipants: event.maxParticipants,
      },
      registrations,
      total: registrations.length,
    });
  } catch (error) {
    console.error("Erreur getEventRegistrations :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// PATCH modifier statut (admin)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = REG_STATUS_VALUES;

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Statut invalide. Valeurs : ${validStatuses.join(", ")}`,
      });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Inscription introuvable." });

    const previousStatus = registration.status;

    if (status === STATUS_CONFIRMED && previousStatus !== STATUS_CONFIRMED) {
      const event = await Event.findByPk(registration.eventId);
      if (!event) {
        return res.status(404).json({ message: "Evenement introuvable." });
      }

      if (isCapacityLimited(event)) {
        const confirmedCount = await Registration.count({
          where: { eventId: event.id, status: STATUS_CONFIRMED },
        });
        if (confirmedCount >= event.maxParticipants) {
          return res.status(409).json({
            message:
              "Limite atteinte pour cet evenement. Impossible de confirmer cette inscription.",
          });
        }
      }
    }

    await registration.update({ status });

    if (previousStatus === STATUS_CONFIRMED && status !== STATUS_CONFIRMED) {
      await fillWaitlistIfPossible(registration.eventId);
    }

    return res.status(200).json({
      message: "Statut mis a jour.",
      registration: { id: registration.id, status: registration.status },
    });
  } catch (error) {
    console.error("Erreur updateRegistrationStatus :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE supprimer inscription (admin)
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Inscription introuvable." });

    const wasConfirmed = registration.status === STATUS_CONFIRMED;
    const event = await Event.findByPk(registration.eventId);

    await registration.destroy();

    if (event) {
      await event.update({
        registered: Math.max(0, (event.registered || 0) - 1),
      });
    }

    if (wasConfirmed) {
      await fillWaitlistIfPossible(registration.eventId);
    }

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

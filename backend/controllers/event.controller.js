const { Event, Registration } = require("../models");
const { Op } = require("sequelize");

const parsePositiveInt = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return NaN;
  return parsed;
};

// GET tous les evenements
const getAllEvents = async (req, res) => {
  try {
    const { search, category, game, sortBy } = req.query;
    const where = {};

    if (search) where.title = { [Op.like]: `%${search}%` };
    if (category && category !== "Tous") where.category = category;
    if (game && game !== "Tous les jeux") where.game = game;

    let order = [["date", "ASC"]];
    switch (sortBy) {
      case "date-asc":
        order = [["date", "ASC"]];
        break;
      case "date-desc":
        order = [["date", "DESC"]];
        break;
      case "title-asc":
        order = [["title", "ASC"]];
        break;
      case "prize-desc":
        order = [["prizePool", "DESC"]];
        break;
      default:
        break;
    }

    const events = await Event.findAll({ where, order });
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Erreur getAllEvents :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET un evenement par ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evenement introuvable." });
    return res.status(200).json({ event });
  } catch (error) {
    console.error("Erreur getEventById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// POST creer un evenement (admin)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      game,
      image,
      date,
      time,
      location,
      prizePool,
      description,
      rules,
      maxParticipants,
    } = req.body;

    if (!title || !category || !game || !date) {
      return res.status(400).json({
        message: "Titre, categorie, jeu et date sont requis.",
      });
    }

    const parsedMax = parsePositiveInt(maxParticipants);
    if (!Number.isInteger(parsedMax)) {
      return res.status(400).json({
        message:
          "Le nombre maximum de participants est requis et doit etre superieur a 0.",
      });
    }

    const event = await Event.create({
      title,
      category,
      game,
      image: image || null,
      date,
      time: time || null,
      location: location || null,
      prizePool: prizePool || null,
      description: description || null,
      rules: rules || null,
      maxParticipants: parsedMax,
      registered: 0,
      registrationOpen: true,
    });

    return res.status(201).json({ message: "Evenement cree.", event });
  } catch (error) {
    console.error("Erreur createEvent :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// PUT modifier un evenement (admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evenement introuvable." });

    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, "maxParticipants")) {
      const parsedMax = parsePositiveInt(payload.maxParticipants);
      if (!Number.isInteger(parsedMax)) {
        return res.status(400).json({
          message:
            "Le nombre maximum de participants doit etre un entier superieur a 0.",
        });
      }

      const regStatusValues =
        Registration.rawAttributes?.status?.values ||
        Registration.getAttributes?.().status?.values || [
          "En attente",
          "Confirmee",
          "Annulee",
        ];
      const statusConfirmed = regStatusValues[1];
      const confirmedCount = await Registration.count({
        where: { eventId: event.id, status: statusConfirmed },
      });

      if (parsedMax < confirmedCount) {
        return res.status(400).json({
          message: `Impossible de definir ${parsedMax} places: ${confirmedCount} inscription(s) deja confirmee(s).`,
        });
      }

      payload.maxParticipants = parsedMax;
    }

    await event.update(payload);
    return res.status(200).json({ message: "Evenement mis a jour.", event });
  } catch (error) {
    console.error("Erreur updateEvent :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// PATCH ouvrir/fermer les inscriptions (admin)
const toggleRegistration = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evenement introuvable." });

    const { registrationOpen } = req.body;
    if (typeof registrationOpen !== "boolean")
      return res
        .status(400)
        .json({ message: "registrationOpen doit etre true ou false." });

    await event.update({ registrationOpen });
    return res.status(200).json({
      message: registrationOpen
        ? "Inscriptions ouvertes."
        : "Inscriptions fermees.",
      event,
    });
  } catch (error) {
    console.error("Erreur toggleRegistration :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// DELETE supprimer un evenement (admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evenement introuvable." });
    await event.destroy();
    return res.status(200).json({ message: "Evenement supprime." });
  } catch (error) {
    console.error("Erreur deleteEvent :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  toggleRegistration,
  deleteEvent,
};

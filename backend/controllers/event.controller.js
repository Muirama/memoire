const { Event, Registration } = require("../models");
const { Op } = require("sequelize");

// ── GET tous les événements ───────────────────────────────
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
    }

    const events = await Event.findAll({ where, order });
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Erreur getAllEvents :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── GET un événement par ID ───────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });
    return res.status(200).json({ event });
  } catch (error) {
    console.error("Erreur getEventById :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── POST créer un événement (admin) ───────────────────────
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
    } = req.body;

    if (!title || !category || !game || !date)
      return res.status(400).json({
        message: "Titre, catégorie, jeu et date sont requis.",
      });

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
      registered: 0,
      registrationOpen: true,
    });

    return res.status(201).json({ message: "Événement créé.", event });
  } catch (error) {
    console.error("Erreur createEvent :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PUT modifier un événement (admin) ─────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });
    await event.update(req.body);
    return res.status(200).json({ message: "Événement mis à jour.", event });
  } catch (error) {
    console.error("Erreur updateEvent :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── PATCH ouvrir/fermer les inscriptions (admin) ──────────
const toggleRegistration = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });

    const { registrationOpen } = req.body;
    if (typeof registrationOpen !== "boolean")
      return res
        .status(400)
        .json({ message: "registrationOpen doit être true ou false." });

    await event.update({ registrationOpen });
    return res.status(200).json({
      message: registrationOpen
        ? "Inscriptions ouvertes."
        : "Inscriptions fermées.",
      event,
    });
  } catch (error) {
    console.error("Erreur toggleRegistration :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── DELETE supprimer un événement (admin) ─────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Événement introuvable." });
    await event.destroy();
    return res.status(200).json({ message: "Événement supprimé." });
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

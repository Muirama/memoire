const adminMiddleware = (req, res, next) => {
  // Ce middleware s'utilise TOUJOURS après authMiddleware
  // car il a besoin de req.user
  if (!req.user) {
    return res.status(401).json({ message: "Accès refusé. Non authentifié." });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès refusé. Réservé aux administrateurs." });
  }

  next();
};

module.exports = adminMiddleware;

const userMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "AccÃ¨s refusÃ©. Non authentifiÃ©." });
  }

  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "AccÃ¨s refusÃ©. RÃ©servÃ© aux utilisateurs." });
  }

  next();
};

module.exports = userMiddleware;

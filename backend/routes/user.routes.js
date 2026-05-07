const express = require("express");
const router  = express.Router();
const { getAllUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { deleteUser } = require("../controllers/user.controller");

router.get("/", authMiddleware, adminMiddleware, getAllUsers);

router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;

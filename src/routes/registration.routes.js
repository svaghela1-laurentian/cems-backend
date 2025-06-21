const express = require("express");
const router = express.Router();
const { registerForEvent, getEventsByUserId } = require("../controllers/registration.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", authMiddleware, registerForEvent);
router.get("/get-my-events", authMiddleware, getEventsByUserId);


module.exports = router;

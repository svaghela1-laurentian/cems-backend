const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/feedback.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/submit", authMiddleware, submitFeedback);

module.exports = router;

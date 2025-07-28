const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { history, message, deletehistory } = require("../controllers/chatbotController");

// Get chat history for a user
router.get("/history", auth, history);

// Send message to AI chatbot
router.post("/message", message);

// Clear chat history for a user
router.delete("/history", auth, deletehistory);
module.exports = router;

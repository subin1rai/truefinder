const express = require("express");
const { createMessage, getMessages } = require("../controllers/MessageController");
const router = express.Router();


router.post("/createMessage",createMessage);
router.post("/getMessages",getMessages);
module.exports = router;

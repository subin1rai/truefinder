const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const auth = require('../middleware/authMiddleware'); // Authentication middleware
const { getUser, updateProfile, getAllUsers, getallUser } = require("../controllers/userController");

// Existing routes
router.put('/user/profile/:userId', updateProfile);
router.post("/getUser", getAllUsers);
router.get("/getallUser", getallUser);
router.get("/user/:id", getUser);
module.exports = router;

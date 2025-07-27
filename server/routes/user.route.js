const express = require("express");
const router = express.Router();
const { getUser, updateProfile } = require("../controllers/userController");


router.put('/user/profile/:userId', updateProfile);

router.get("/user/:id", getUser);

module.exports = router;

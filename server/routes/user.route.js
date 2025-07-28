const express = require("express");
const router = express.Router();
const { getUser, updateProfile, getAllUsers } = require("../controllers/userController");


router.put('/user/profile/:userId', updateProfile);
router.post("/getUser",getAllUsers)
router.get("/user/:id", getUser);

module.exports = router;

const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const User = require("../models/user") // Changed from 'users' to 'User' (capital U)

// Get all users for admin dashboard
router.get("/users", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = {}

    // Filter by verification status
    if (status === "verified") query.isVerified = true
    if (status === "unverified") query.isVerified = false
    if (status === "pending") {
      query.profileCompleted = true
      query.isVerified = false
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { profession: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query) // Changed from users.find to User.find
      .select("-password")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await User.countDocuments(query) // Changed from users.countDocuments to User.countDocuments

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user details for verification
router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password") // Changed from users.findById to User.findById
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Get user details error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Verify user
router.put("/users/:id/verify", auth, async (req, res) => {
  try {
    const { verified, reason } = req.body

    const user = await User.findByIdAndUpdate( // Changed from users.findByIdAndUpdate to User.findByIdAndUpdate
      req.params.id,
      {
        isVerified: verified,
        verificationReason: reason,
        verifiedAt: verified ? new Date() : null,
        verifiedBy: req.user.id,
      },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: `User ${verified ? "verified" : "rejected"} successfully`, user })
  } catch (error) {
    console.error("Verify user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get admin dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments() // Changed from users.countDocuments to User.countDocuments
    const verifiedUsers = await User.countDocuments({ isVerified: true })
    const pendingVerification = await User.countDocuments({
      profileCompleted: true,
      isVerified: false,
    })
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    })

    res.json({
      totalUsers,
      verifiedUsers,
      pendingVerification,
      newUsersToday,
      verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
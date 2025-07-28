const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous chats
    },
    sessionId: {
      type: String,
      required: false, // For anonymous users
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
chatSchema.index({ userId: 1, timestamp: -1 })
chatSchema.index({ sessionId: 1, timestamp: -1 })

// Auto-delete old chats after 30 days
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

module.exports = mongoose.model("Chat", chatSchema)

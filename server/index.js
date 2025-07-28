const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");
const messageRoutes = require("./routes/message.route");
const { createServer } = require("http");
const { Server } = require("socket.io");
const user = require("./models/user");

dotenv.config();
const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

//socket.io connection
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Be more specific with CORS
    methods: ["GET", "POST"],
    credentials: true
  },
});

let users = [];

const addUsers = (userId, socketId) => {
  // Remove existing user if they reconnect
  users = users.filter(user => user.userId !== userId);
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((u) => u.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("AddUserSocket", (userId) => {
    console.log("Adding user to socket:", userId);
    addUsers(userId, socket.id);
    io.emit("getUsers", users);
    console.log("Current users:", users);
  });

  // Handle sending messages between users
  socket.on("sendMessages", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      console.log("Message data received:", data);
      
      const receiverUser = getUser(receiverId);
      console.log("Receiver user found:", receiverUser);
      
      if (receiverUser?.socketId) {
        // Send to specific receiver
        io.to(receiverUser.socketId).emit("receiveMessage", {
          userId: senderId,
          message: message,
          time: Date.now(),
          receiverId: receiverId
        });
        console.log("Message sent to receiver:", receiverId);
      } else {
        console.log("Receiver not connected or not found");
      }
      
      // Also send back to sender for confirmation (optional)
      socket.emit("messageSent", {
        success: true,
        receiverId: receiverId
      });
      
    } catch (error) {
      console.error("Error handling sendMessages:", error);
      socket.emit("messageError", {
        error: "Failed to send message"
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
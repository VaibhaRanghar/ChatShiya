const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // Import http to create a server
const { Server } = require("socket.io");
const userRouter = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRoute");
const messageRouter = require("./Routes/messageRoute");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO with the HTTP server
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Online users array
let onlineUsers = [];

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);

  socket.on("addNewUser", (userId) => {
    if (userId) {
      const existingUser = onlineUsers.find((user) => user.userId === userId);
      if (existingUser) {
        existingUser.socketId = socket.id;
      } else {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      }
      io.emit("getOnlineUsers", onlineUsers);
    }
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      // Emitting for the other user.
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
      // Emitting for ourselves.
      io.to(socket.id).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to ChatShia!");
});
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start the server
const port = process.env.PORT || 5001;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connection established!");
    // Start the HTTP server after successful MongoDB connection
    server.listen(port, () => {
      console.log(`Server running on PORT ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error on MongoDB connection:", err.message);
  });

const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });

let onlineUsers = [];

io.on("connection", (socket) => {
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
      //emitting for other user.
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
      //emitting for ourself.
      io.to(socket.id).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((users) => {
      return users.socketId != socket.id;
    });

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);

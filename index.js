const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

io.on("connection", (socket) => {

  socket.on("join", (userData) => {
    onlineUsers.set(socket.id, {
      socketId: socket.id,
      avatarId: userData.avatarId
    });

    // Send filtered list to each user
    for (const [id, user] of onlineUsers.entries()) {
      const others = Array.from(onlineUsers.values())
        .filter(u => u.socketId !== id);

      io.to(id).emit("update_users", others);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);

    for (const [id, user] of onlineUsers.entries()) {
      const others = Array.from(onlineUsers.values())
        .filter(u => u.socketId !== id);

      io.to(id).emit("update_users", others);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("MetBox backend running on port", PORT);
});

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
  console.log("User connected:", socket.id);

  users.push(socket.id);
  io.emit("update_users", users);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    users = users.filter((id) => id !== socket.id);
    io.emit("update_users", users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("MetBox backend running on port", PORT);
});

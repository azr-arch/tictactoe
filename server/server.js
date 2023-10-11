import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import { sessionMiddleware } from "./middlewares/socket.middleware.js";

let roomMap = {};

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("hello ");
});

//Event handlers

io.on("connection", (socket) => {
  console.log("a user is connected : ", socket.id);

  socket.on("disconnect", (socket) => {
    console.log("user disconnect: ", socket.id);
  });

  socket.on("newgame", (data) => {
    console.log("a new game has been created with roomId: ", data.room);
    socket.join(data.room);
    roomMap[data.room] = { users: [socket.id] };

    // Wait for another user to join
    socket.emit("joined", {
      success: false,
      message: "Waiting for another user to join...",
    });
  });

  socket.on("joingame", (roomId) => {
    if (roomMap[roomId] && roomMap[roomId].users.length < 2) {
      socket.join(roomId);
      roomMap[roomId].users.push(socket.id);
      console.log(`${socket.username} wants to join room: ${roomId}`);
      socket.broadcast.emit("user-joined", socket.username);

      io.to(roomId).emit("joined", {
        success: true,
        message: "Game Started",
        roomId,
      });
    } else {
      socket.emit("joined", {
        success: false,
        error: true,
        message: "Room is full or does not exists.",
      });
    }
  });

  socket.on("move", (data) => {
    const board = data.board;
    const roomId = data.roomId;
    const player = data.player;

    if (roomMap[roomId] && roomMap[roomId].users.includes(socket.id)) {
      socket.to(roomId).emit("move", { board, player });
    }
  });
});

httpServer.listen(8080, () => {
  console.log("listening on port 8080");
});

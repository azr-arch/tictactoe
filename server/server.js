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
    roomMap[data.room] = { usersId: [socket.id], usersInfo: [data.userData] };

    // Wait for another user to join
    socket.emit("joined", {
      success: false,
      message: "Waiting for another user to join...",
    });
  });

  // Joining a Room
  socket.on("joingame", (data) => {
    if (roomMap[data.room] && roomMap[data.room].users.length < 2) {
      socket.join(data.room);
      roomMap[data.room].usersId.push(socket.id);
      roomMap[data.room].usersInfo.push(data.userData);

      console.log(`${socket.username} wants to join room: ${data.room}`);

      io.to(roomId).emit("joined", {
        success: true,
        message: "Game Started",
        roomId,
        userData: data.userData,
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

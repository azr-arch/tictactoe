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
  socket.on("disconnect", (socket) => {});

  socket.on("newgame", (data) => {
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
    if (roomMap[data.room] && roomMap[data.room].usersId.length < 2) {
      socket.join(data.room);
      roomMap[data.room].usersId.push(socket.id);
      roomMap[data.room].usersInfo.push(data.userData);

      io.to(data.room).emit("joined", {
        success: true,
        message: "Game Started",
        roomId: data.room,
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

  socket.on("start", (data) => {
    console.log("Received start event", data);
    socket.to(data.roomId).emit("start", data.youStart);
  });

  socket.on("restart", (data) => {
    console.log("Received restart event", data);
    socket.to(data.roomId).emit("restart");
  });

  socket.on("move", (data) => {
    console.log("Received move event", data);
    const board = data.board;
    const roomId = data.roomId;
    const player = data.player;
    if (roomMap[roomId] && roomMap[roomId].usersId.includes(socket.id)) {
      socket.to(roomId).emit("move", { board, player });
    }
  });

  socket.on("winner", (data) => {
    console.log("Received winner event", data);
    socket.to(data.roomId).emit("winner", data);
  });

  socket.on("logout", () => {});
});

httpServer.listen(8080, () => {
  console.log("listening on port 8080");
});

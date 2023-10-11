import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

import { motion } from "framer-motion";

const StartGame = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const { socket } = useSocket();
  // console.log(socket)
  const [modalOpen, setModalOpen] = useState({
    start: false,
    join: false,
  });

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleModal = (e) => {
    const btnType = e.target.dataset.type; // Button Type Start Game or Join Game

    if (btnType === "start") {
      setModalOpen({ join: false, start: true });
    } else {
      setModalOpen({ join: true, start: false });
    }
  };

  const handleCloseModal = (e) => {
    const btnType = e.target.dataset.type; // Button Type Start Game or Join Game

    setModalOpen((prev) => ({ ...prev, [btnType]: false }));
  };

  const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleCreateRoom = () => {
    if (!userName) return;
    localStorage.setItem("username", userName);
    const room = uid();
    alert(`Copy this room id and share it to your friends: ${room}`);

    socket.emit("newgame", {
      userId: socket.id,
      username: userName,
      room,
    });
  };

  const handleJoinRoom = () => {
    if (!roomId) return;
    socket.emit("joingame", roomId);
  };

  socket.on("joined", (data) => {
    if (data.success) {
      setLoading(false);
      navigate(`/play/${data.roomId}`);
    }
    if (data.error) {
      setLoading(false);
      alert(data.message);
      navigate("/");
    }
    setLoading(true);
  });

  return (
    <motion.div
      initial={{ x: -1000 }}
      animate={{ x: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.2,
      }}
      className="w-96 flex flex-col items-center gap-4 py-8 text-white bg-black_2 shadow-2xl"
    >
      <motion.div className="text-lg ">Tic Tac Toe</motion.div>
      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 rounded-md bg-blue_1 text-white focus:outline-none focus:ring focus:ring-white  hover:bg-opacity-60 transition-colors duration-150 ease-in"
          data-type="start"
          onClick={handleModal}
        >
          Start Game
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue_1 text-white  focus:outline-none focus:ring focus:ring-white hover:bg-opacity-60 transition-colors duration-150 ease-in"
          data-type="join"
          onClick={handleModal}
        >
          Join Game
        </button>
      </div>

      {/* Start Game Modal  */}
      {modalOpen.start && (
        <div className="p-5 bg-black_2 text-gray gap-4 flex flex-col min-w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md shadow-lg">
          <p className="text-lg font-bold mb-2 text-white">
            Enter your username
          </p>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={handleUsernameChange}
            className="p-2 rounded-md bg-gray placeholder-white placeholder:opacity-60 text-white mb-4"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleCreateRoom}
              className="px-4 py-2 rounded-md bg-blue_1 text-white hover:bg-opacity-60 transition-colors duration-150 ease-in"
            >
              Create Room
            </button>
            <button
              data-type="start"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-md bg-blue_1 text-white hover:bg-opacity-60 transition-colors duration-150 ease-in"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Join Game Modal  */}
      {modalOpen.join && (
        <div className="p-5 bg-black_2 text-gray gap-4 min-w-[400px] flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md shadow-lg">
          <p className="text-lg font-bold mb-2 text-white">Enter Room Id</p>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={handleRoomIdChange}
            className="p-2 rounded-md bg-gray placeholder-white placeholder:opacity-60 text-white mb-4"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleJoinRoom}
              className="px-4 py-2 rounded-md bg-blue_1 text-white hover:bg-opacity-60 transition-colors duration-150 ease-in"
            >
              Join Room
            </button>
            <button
              data-type="join"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-md bg-blue_1 text-white hover:bg-opacity-60 transition-colors duration-150 ease-in"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="w-screen flex items-center z-50 justify-center h-screen fixed top-0 left-0 bg-black_2 bg-opacity-30">
          <div className="bg-gray rounde-md p-4 text-white">
            Please wait for other players to join
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StartGame;

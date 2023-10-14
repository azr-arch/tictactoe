import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

import { motion } from "framer-motion";

import { X, O } from "../assets/icon";
import { LocalStorage } from "../utils";

const StartGame = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false); // False  -->  O , True --> X
  const [createdRoom, setCreatedRoom] = useState();

  const [currPlayer, setCurrPlayer] = useState(
    LocalStorage.get("user") || null
  );

  const { socket } = useSocket();

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
    if (!currPlayer) return alert("please login");

    const room = uid();
    const selectedSymbol = selected ? "x" : "o";

    setLoading(true);
    // Show the modal with room Id
    setCreatedRoom(room);

    LocalStorage.set("symbols", {
      you: selectedSymbol,
      other: selectedSymbol === "x" ? "o" : "x",
    });

    socket.emit("newgame", {
      userData: {
        userId: socket.id,
        username: currPlayer?.name,
        profile: currPlayer?.profile,
      },
      room,
    });
  };

  const handleJoinRoom = () => {
    if (!roomId) return;
    if (!currPlayer) return alert("please login");

    const data = {
      name: currPlayer?.userName,
      profile: currPlayer?.profile,
    };

    socket.emit("joingame", { room: roomId, userData: data });
  };

  socket.on("joined", (data) => {
    if (data.success) {
      setLoading(false);

      LocalStorage.set("otherPlayer", data.userData);

      navigate(`/play/${data.roomId}`);
    }
    if (data.error) {
      setLoading(false);
      alert(data.message);
      navigate("/");
    }
  });

  const handlesymbolSelection = (e) => {
    setSelected((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ x: -1000 }}
      animate={{ x: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="px-8 md:w-96 flex flex-col items-center gap-4 py-8 text-white bg-black_2 shadow-2xl"
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
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 bg-black_2 text-gray gap-4 flex flex-col min-w-[80vw] md:min-w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md shadow-lg"
        >
          <p className="text-lg font-bold mb-2 text-white">Choose</p>

          <div className="flex items-center w-full justify-around gap-4 p-2 my-8">
            <div
              data-value="o"
              onClick={handlesymbolSelection}
              className={`h-[80px] aspect-square bg-black_1   flex items-center justify-center rounded-sm transition-colors duration-150 ease-out ${
                !selected ? "outline-white outline" : ""
              } `}
            >
              <O />
            </div>
            <div
              data-value="x"
              onClick={handlesymbolSelection}
              className={`h-[80px] aspect-square bg-black_1   flex items-center justify-center rounded-sm  transition-colors duration-150 ease-out${
                selected ? "outline-white outline" : ""
              } `}
            >
              <X />
            </div>
          </div>

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
        </motion.div>
      )}

      {/* Join Game Modal  */}
      {modalOpen.join && (
        <div className="p-5 bg-black_2 text-gray gap-4 min-w-[80vw] md:min-w-[400px] flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md shadow-lg">
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
        <div className="w-screen flex items-center z-50 justify-center h-screen  fixed top-0 left-0 bg-black bg-opacity-50">
          <div className="bg-black_1 rounde-md p-4 text-white text-center">
            <h2 className="text-xl"> Please wait for other players to join</h2>
            <p className=" font-medium text-sm mt-4">
              <span className="mr-2">`{createdRoom}`</span> Share this Room Id,
              to another player
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StartGame;

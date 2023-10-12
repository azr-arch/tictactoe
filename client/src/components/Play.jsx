import React, { useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { signOut } from "firebase/auth";
import { LocalStorage } from "../utils";
import { auth } from "../config/firebase";

import { motion } from "framer-motion";

import { X, O } from "../assets/icon"; // Game symbold

const initialBoardState = ["", "", "", "", "", "", "", "", ""]; // TODO - use reducer for this component
const Play = () => {
  const [board, setBoard] = useState(initialBoardState);
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  // const[currentPlayer, SetCurrentPlayer]
  const { roomId } = useParams();

  const { socket } = useSocket();
  // const navigate = useNavigate();
  // let winner = calculateWinner(board);
  const boardRef = useRef();

  socket.on("user-joined", (data) => {
    console.log("a user has joined your room ", socket.username);
  });

  function handleCellClick(e) {
    const newBoard = [...board];
    const currPos = e.target.dataset.position;

    if (!newBoard[currPos]) {
      const currentPlayer = isX ? "x" : "o";
      newBoard[currPos] = currentPlayer;
      setBoard(newBoard);
      setIsX(!isX);
      const won = calculateWinner(newBoard);

      if (won) {
        addWinningEffect(won);

        socket.emit("winner", { board: newBoard, playerWon: currentPlayer });
        console.log("winner is declared!: ", currentPlayer);
        setTimeout(() => {
          setWinner(true);
        }, 100);
        return;
      } else {
        socket.emit("move", { board: newBoard, player: currentPlayer, roomId });
        return;
      }
    }
  }

  function calculateWinner(board) {
    // Possible winning combinations
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      // Check if the elements in the line are the same (and not null)
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return lines[i];
      }
    }

    return null;
  }

  socket.on("move", (data) => {
    setBoard(data.board);
    setIsX(data.player !== "X");
  });

  const player = {
    player1: {
      profile:
        "https://lh3.googleusercontent.com/a/ACg8ocI62jNMR7YYifLLbDg7uLP94ZqblCNfX388hoblxDcK=s96-c",
      name: "Azar Malik",
      score: 0,
    },
    player2: {
      profile:
        "https://lh3.googleusercontent.com/a/ACg8ocI62jNMR7YYifLLbDg7uLP94ZqblCNfX388hoblxDcK=s96-c",
      name: "Azar Malik",
      score: 0,
    },
  };

  const handleLogout = () => {
    LocalStorage.clear();
    console.log("loggin out!");
    signOut(auth);
  };

  const handleRestart = () => {
    setWinner(null);
    setIsX(true);
    setBoard(initialBoardState);
  };

  function addWinningEffect(indexArr) {
    // Function to add winning effects when a player has won
    let cells = Array.from(
      boardRef.current.querySelectorAll("[data-position]")
    ); // Coverting to array because NodeList doesnt have .find
    console.log(cells);
    indexArr.forEach((position, idx) => {
      console.log(position);
      let item = cells.find((cell) => cell.dataset.position == position);
      if (item) {
        item.setAttribute("data-won-block", true);
      }
    });
  }

  return (
    // <div className="flex flex-col items-center">
    //   <p className="mb-5">{isX ? "X's Turn" : "O's Turn"}</p>
    //   {winner && alert(`${winner} won the game`)}

    //   {!winner && (
    //     <>
    //       <p className="mb-5">{isX ? "X's Turn" : "O's Turn"}</p>
    //       <div className="grid grid-cols-3 gap-2">
    //         {board.map((cell, idx) => {
    //           return (
    //             <button
    //               key={idx}
    //               onClick={handleCellClick}
    //               data-position={idx}
    //               className="w-12 aspect-square rounded-sm bg-black text-white flex items-center justify-center  shadow-sm"
    //             >
    //               {cell}
    //             </button>
    //           );
    //         })}
    //       </div>
    //     </>
    //   )}
    // </div>
    <>
      <button
        className="fixed top-8 right-10 px-4 py-2 rounded-md bg-blue_1 text-white bg-opacity-50"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="flex flex-col items-center">
        {/* Game Board  */}
        {!winner ? (
          <div
            className="grid grid-cols-3 gap-4 place-items-center justify-center bg-black_2 p-4 rounded-md"
            ref={boardRef}
          >
            {board.map((cell, idx) => (
              <div
                key={idx}
                data-position={idx}
                onClick={handleCellClick}
                className="p-2 rounded-sm bg-black_1 flex items-center justify-center h-20 w-20"
              >
                {cell === "x" ? <X /> : cell === "o" ? <O /> : ""}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 flex flex-col">
            <p className="text-white mb-4">
              Player {isX ? "X" : "O"} has won the game
            </p>
            <button
              onClick={handleRestart}
              className="rounded-sm bg-blue_1 px-4 py-2 text-white"
            >
              Restart the game
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Play;

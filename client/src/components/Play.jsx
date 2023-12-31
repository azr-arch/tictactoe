import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { signOut } from "firebase/auth";
import { LocalStorage } from "../utils";
import { auth } from "../config/firebase";

import { motion } from "framer-motion";

import { X, O } from "../assets/icon"; // Game symbold

const initialBoardState = Array(9).fill(null); // TODO - use reducer for this component
const Play = () => {
    const [board, setBoard] = useState(initialBoardState);
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [yourTurn, setYourTurn] = useState(false);

    const { roomId } = useParams();
    const { socket } = useSocket();
    const symbols = LocalStorage.get("symbols");

    useEffect(() => {
        if (winner || isDraw) {
            setGameOver(true);
        }
    }, [winner, isDraw]);

    useEffect(() => {
        console.log(symbols);

        if (symbols.you === "x") {
            setYourTurn(true);
        }

        socket.emit("start", { youStart: !yourTurn, roomId });
    }, []);

    const boardRef = useRef(null);

    function handleCellClick(e) {
        if (gameOver) return;
        if (!yourTurn) return;

        console.log("click");
        const newBoard = [...board];
        const currPos = e.target.dataset.position;

        if (!newBoard[currPos]) {
            newBoard[currPos] = symbols.you;
            setBoard(newBoard);
            setYourTurn(false);

            socket.emit("move", { board: newBoard, player: symbols.you, roomId });

            const won = calculateWinner(newBoard);
            const draw = checkDraw(newBoard);
            console.log(draw);
            if (won) {
                setGameOver(true);
                addWinningEffect(won);
                console.log("emittign winenr event");
                socket.emit("winner", {
                    board: newBoard,
                    playerWon: symbols.you,
                    roomId,
                    wonArray: won,
                });
                console.log("winner is declared!: ", symbols.you);
                setTimeout(() => {
                    setWinner(true);
                }, 1000);
                return;
            } else if (draw) {
                setIsDraw(true);
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

    function checkDraw(board) {
        return board.every((cell) => cell !== null);
    }
    socket.on("move", (data) => {
        setBoard(data.board);
        setYourTurn(true);
    });

    const handleLogout = () => {
        // LocalStorage.clear();
        // console.log("loggin out!");
        // signOut(auth);
        console.log("logout");
        socket.emit("logout", { roomId });
    };

    const handleRestart = () => {
        setBoard(initialBoardState);
        setGameOver(false);
        setWinner(null);
        setIsDraw(false);

        // Emit a 'restart' event to the server
        socket.emit("restart", { roomId });
    };

    function addWinningEffect(indexArr, givenBoard = null) {
        console.log(boardRef);
        // Function to add winning effects when a player has won
        let cells;
        if (boardRef.current) {
            cells = Array.from(boardRef.current.querySelectorAll("[data-position]")); // Coverting to array because NodeList doesnt have .find
        } else {
            cells = Array.from(givenBoard.querySelectorAll("[data-position]"));
        }
        indexArr.forEach((position, idx) => {
            let item = cells.find((cell) => cell.dataset.position == position);
            if (item) {
                item.setAttribute("data-won-block", true); // In index.css animation is added using data-won-block attribute
            }
        });
    }
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

    socket.on("restart", () => {
        console.log("restart event");
        setBoard(initialBoardState);
        setGameOver(false);
        setWinner(null);
        setIsDraw(false);
    });

    socket.on("winner", (data) => {
        console.log("winner event ", data);
        setGameOver(true);
        console.log("insdie witnner event", data.playerWon === symbols.you);
        setWinner(data.playerWon === symbols.you);
    });

    return (
        <>
            <button
                className="fixed top-8 right-10 px-4 py-2 rounded-md bg-blue_1 text-white bg-opacity-50"
                onClick={handleLogout}
            >
                Logout
            </button>

            <button
                className="fixed top-28 right-10 px-4 py-2 rounded-md bg-blue_1 text-white bg-opacity-50"
                onClick={handleRestart}
            >
                Restart
            </button>
            <Link
                className="fixed top-38 right-10 px-4 py-2 rounded-md bg-blue_1 text-white bg-opacity-50"
                to={"/"}
            >
                Home
            </Link>

            <motion.div className="flex flex-col items-center gap-8">
                <motion.div
                    initial={{ y: -1000, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative flex items-center p-2 justify-between w-full bg-black_2"
                >
                    <div className="grid grid-cols-2 p-3 gap-2 rounded-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                                    alt="profile"
                                    className="object-contain w-11 aspect-square rounded-md"
                                />
                                <X size="small" />
                            </div>
                            <p className="text-blue_1 text-sm font-medium">{player.player1.name}</p>
                        </div>
                        <div className=" text-white w-12 aspect-square p-2 flex items-center justify-center">
                            <span className="text-4xl  ">0</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="absolute w-[1px] h-5/6 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white"></div>

                    <div className="grid grid-cols-2  place-content-center  p-3 gap-2 rounded-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-3 flex-row-reverse ">
                                <img
                                    src="https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                                    alt="profile"
                                    className="object-contain w-11 aspect-square rounded-md"
                                />
                                <O size="small" />
                            </div>
                            <p className="text-blue_1 text-sm font-medium">{player.player1.name}</p>
                        </div>
                        <div className="relative text-white w-12 aspect-square p-2 flex items-center justify-center">
                            <span className="text-4xl absolute top-1/2 -translate-y-1/2">0</span>
                        </div>
                    </div>
                </motion.div>

                {/* Game Board  */}
                {!winner && !isDraw ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.5 }}
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
                    </motion.div>
                ) : null}

                {winner ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 flex flex-col"
                    >
                        <p className="text-white mb-4">
                            {winner ? symbols.you : symbols.other} has won the game
                        </p>
                        <button
                            onClick={handleRestart}
                            className="rounded-sm bg-blue_1 px-4 py-2 text-white"
                        >
                            Restart the game
                        </button>
                    </motion.div>
                ) : null}

                {isDraw ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 flex flex-col"
                    >
                        <p className="text-white mb-4 text-center">Darn it!, Its a Draw</p>
                        <button
                            onClick={handleRestart}
                            className="rounded-sm bg-blue_1 px-4 py-2 text-white"
                        >
                            Restart the game
                        </button>
                    </motion.div>
                ) : null}
            </motion.div>
        </>
    );
};

export default Play;

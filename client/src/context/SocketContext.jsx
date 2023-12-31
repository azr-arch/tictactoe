import { useState, useContext, createContext, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({});

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io("http://localhost:8080", {
            transports: ["websocket"],
            reconnectionAttempts: 3,
            protocols: ["echo-protocol"],
        }).connect();

        newSocket.on("connect", () => setIsConnected(true));
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, []);

    if (!socket) {
        return null;
    }

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
    );
};

export { SocketProvider, useSocket };

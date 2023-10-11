import { useState, useContext, createContext, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({});

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      reconnectionAttempts: 3,
    }).connect();
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  if (!socket) {
    return <p>Loading...</p>;
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };

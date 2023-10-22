import React from "react";
import { useSocket } from "../context/SocketContext";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();
    console.log(isConnected);
    return (
        <div
            className={`w-4 h-4 rounded-full absolute top-4 left-4 ${
                isConnected ? "bg-green-500" : "bg-red-500"
            }`}
        />
    );
};

import { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, redirect } from "react-router-dom";
import Layout from "./components/Layout";
import StartGame from "./components/StartGame";
import Play from "./components/Play";
import { SocketProvider } from "./context/SocketContext";

import Login from "./pages/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

import { UserProvider, useUser } from "./context/UserContext";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { LocalStorage } from "./utils";

function App() {
  const token = LocalStorage.get("token") || null;
  const navigate = useNavigate();

  // onAuthStateChanged(auth, (user) => {
  //   console.log(user);
  //   if (!user) {
  //     // User has been logged out!
  //     return <Navigate to={"/login"} />;
  //   }
  // });

  return (
    <Layout>
      <SocketProvider>
        <UserProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <StartGame />
                </PrivateRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/play/:roomId"
              element={
                <PrivateRoute>
                  <Play />
                </PrivateRoute>
              }
            />
            {/* <Route path="/game/:roomId" /> */}
          </Routes>
        </UserProvider>
      </SocketProvider>
    </Layout>
  );
}

export default App;

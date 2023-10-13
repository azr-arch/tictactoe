import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import { LocalStorage } from "../utils";
import { motion } from "framer-motion";

const Login = () => {
  const provider = new GoogleAuthProvider();
  const { handleSet } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const { accessToken: token } =
          GoogleAuthProvider.credentialFromResult(result);
        // The signed-in user info.
        const _user = result.user;
        const userObj = {
          _id: _user.uid,
          name: _user.displayName,
          profile: _user.photoURL,
          email: _user.email,
        };

        LocalStorage.set("user", userObj);
        LocalStorage.set("token", token);

        handleSet(token, userObj);

        return <Navigate to={"/"} replace />;
      })
      .catch((error) => {
        // Handle Errors here.
        setError(error.message);
      });
    setLoading(false);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="rounded-md p-6 bg-black_2 flex items-center justify-center"
      >
        <button
          onClick={handleLogin}
          disabled={loading}
          className="rounded-md bg-black_1 text-white py-3 px-5 hover:ring  ring-blue_1 active:scale-95 transition-transform duration-100 ease-in-out"
        >
          Log in with Google
        </button>
      </motion.div>

      {/* If any error occured  */}
      {error && (
        <p className="text-red-500 text-sm text-center block mt-3">{error}</p>
      )}
    </>
  );
};

export default Login;

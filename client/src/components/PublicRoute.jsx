// Import necessary libraries and types
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
// Define the PublicRoute component which takes in children as its prop
const PublicRoute = ({ children }) => {
  // Destructure token and user from the authentication context
  const { token, currUser } = useUser();
  // console.log(token, currUser["_id"]);
  // If there is a valid token and user ID, navigate the user to the chat page
  if (token && currUser?._id) {
    <Navigate to="/" replace />;
  }
  // If no token or user ID exists, render the child components as they are
  return children;
};

// Export the PublicRoute component for use in other parts of the application
export default PublicRoute;

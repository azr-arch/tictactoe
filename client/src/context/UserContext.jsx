import { createContext, useContext, useEffect, useState } from "react";
import { LocalStorage } from "../utils";

const UserContext = createContext({});

const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleSet = (tokenValue, userValue) => {
    // this function lets us not to expost setCurr and setToken
    if (tokenValue) setToken(tokenValue);
    if (userValue) setToken(userValue);
  };

  useEffect(() => {
    setCurrUser(LocalStorage.get("user"));
    setToken(LocalStorage.get("token"));
  }, []);
  return (
    <UserContext.Provider value={{ currUser, token, handleSet }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUser };

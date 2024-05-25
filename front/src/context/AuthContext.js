import React, { createContext, useContext,  useState } from "react";
import { deleteCookie, readObjectFromCookie, saveObjectToCookie } from "../utils/cookies";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const userFromCookie = readObjectFromCookie("user");
  const [user, setUser] = useState(userFromCookie || null);
  const [isLoggedIn, setIsLoggedIn] = useState(userFromCookie ? true : false);



  const saveUser = (user, days = 18) => {
    setUser(user);
    saveObjectToCookie("user", user, days);
    setIsLoggedIn(true);
  };
  
  const removeUser = () => {
    deleteCookie("user");
    setUser(null);
    setIsLoggedIn(false);
  };
  

  const value = {
    user,
    isLoggedIn,
    saveUser,
    removeUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
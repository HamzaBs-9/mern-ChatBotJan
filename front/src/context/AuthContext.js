import React, { createContext, useContext,  useState } from "react";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser({ email: data.email, name: data.name , role: data.role});
      setIsLoggedIn(true);
    }
  };
  
  const signup = async (name, email, password, role) => {
    const data = await signupUser(name, email, password, role);
    if (data) {
      setUser({ email: data.email, name: data.name, role: data.role });
      setIsLoggedIn(true);
    }
  };
  
  const logout = async () => {
    try{
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  } catch (error) {
    console.error("Logout failed:", error);
    // Handle logout failure here, such as displaying an error message to the user
  }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

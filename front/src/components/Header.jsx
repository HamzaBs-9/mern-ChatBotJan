import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";
import { logoutUser } from "../helpers/api-communicator";

const Header = () => {
  const auth = useAuth();
  const handleLogout = async () => {
    logoutUser().then(()=> {
      auth.removeUser();
    })
  };
  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
            {
              auth.user.role === "admin" ? (
                <NavigationLink
                  bg="#70b8ff"
                  to="/dashboard"
                  text="Dashboard"
                  textColor="black"
                />
              ) : null
            }
              <NavigationLink
                bg="#70b8ff"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="rgb(24, 119, 204)"
                textColor="white"
                to="/"
                text="logout"
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="#70b8ff"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="rgb(24, 119, 204)"
                textColor="white"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
/*import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js"; // Assuming App.js is JavaScript
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js"; // Assuming AuthContext.js is JavaScript
import { Toaster } from "react-hot-toast";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5005/api/v1";
axios.defaults.withCredentials = true;
const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab,serif",
    allVariants: { color: "white" },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(
          ThemeProvider,
          { theme: theme },
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Toaster, { position: "top-right" }),
            React.createElement(App, null)
          )
        )
      )
    )
  )
);*/

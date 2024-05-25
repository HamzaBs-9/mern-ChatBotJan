import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import GestionC from "./scenes/GestionClients";
import ListeClient from "./scenes/Clients";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./DashboardA.css";
import ConsulterDiscussion from "./scenes/ConsulterDiscussion";
import { useAuth } from "../../context/AuthContext";

function DashboardA() {
  const auth = useAuth();
  const [theme, colorMode] = useMode();
  const [isSidebar] = useState(true);
  const dashboardStyles = {
    background:
      "linear-gradient(to bottom, rgba(238, 247, 255, 0.5), rgba(255, 255, 255, 0.5))",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  };

  if (!auth.user) return (window.location.href = "/login");
  if (auth.user.role !== "admin") window.location.href = "/";

  return (
    <>
      {auth.user && auth.user.role === "admin" ? (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app" style={dashboardStyles}>
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/GestionClients" element={<GestionC />} />
                  <Route path="ListeClient" element={<ListeClient />} />
                  <Route path="form/:id" element={<Form />} />
                  <Route
                    path="Consulterdiscussion"
                    element={<ConsulterDiscussion />}
                  />
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      ) : null}
    </>
  );
}

export default DashboardA;
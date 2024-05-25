import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
//import { useAuth } from "./context/AuthContext";
// eslint-disable-next-line no-unused-vars
import Footer from "./components/footer/Footer";
import DashboardA from "./pages/Dashboard/DashboardA";

function App() {
  //const auth = useAuth();

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
        <Route path="dashboard/*" element={<DashboardA/>} />
      </Routes>
    </main>
  );
}

export default App;

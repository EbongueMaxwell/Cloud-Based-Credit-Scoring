import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // create this file
import Dashboard from "./components/Dashboard";

function App() {
  const handleLogin = () => {
    // Example: redirect or set a login state
    console.log("User logged in");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

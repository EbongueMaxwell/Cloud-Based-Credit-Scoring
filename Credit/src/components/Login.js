// Login.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // <== Add this

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", form.email);
      formData.append("password", form.password);

      const response = await axios.post(
        "http://localhost:8000/login",
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      if (onLogin) onLogin(); // Call it safely
      navigate("/dashboard"); // Redirect here// 👈 redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check your credentials.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f7fa",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    padding: "30px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "350px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "10px",
    marginBottom: "16px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "10px",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  const linkStyle = {
    color: "#007BFF",
    textDecoration: "none",
  };

  const textCenterStyle = {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={headingStyle}>Credit Score</h2>
        <h3 style={headingStyle}>Login</h3>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Login
        </button>
        <div style={textCenterStyle}>
          Don’t have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

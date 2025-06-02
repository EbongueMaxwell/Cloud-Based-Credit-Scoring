import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.email); // Use "username" as required by FastAPI's OAuth2
      formData.append("password", form.password);

      const response = await axios.post(
        "http://localhost:8000/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Store token and redirect
      localStorage.setItem("token", response.data.access_token);
      if (onLogin) onLogin(); // Call onLogin callback if provided
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        setError(error.response.data.detail || "Invalid email or password");
      } else if (error.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  // Styles
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
    opacity: isLoading ? 0.7 : 1,
    pointerEvents: isLoading ? "none" : "auto",
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

  const errorStyle = {
    color: "red",
    marginBottom: "16px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={headingStyle}>Credit Score</h2>
        <h3 style={headingStyle}>Login</h3>

        {error && <div style={errorStyle}>{error}</div>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div style={textCenterStyle}>
          Don't have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

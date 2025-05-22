import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", form);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Try again.");
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
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "350px",
  };

  const tableStyle = {
    width: "100%",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "4px",
    marginBottom: "12px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
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

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={headingStyle}>Create Account</h2>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td>
                <label htmlFor="username">Username:</label>
              </td>
              <td>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Password:</label>
              </td>
              <td>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit" style={buttonStyle}>
                  Register
                </button>
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{ textAlign: "center", paddingTop: "12px" }}
              >
                <p>
                  Already have an account?{" "}
                  <Link to="/" style={linkStyle}>
                    Login here
                  </Link>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Register;

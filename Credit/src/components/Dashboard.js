import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // adjust as needed
  };

  const summaryData = {
    totalClients: 120,
    averageScore: 680,
    highRiskClients: 14,
    activeAccounts: 95,
    inactiveAccounts: 25,
    portfolioRisk: "Medium",
  };

  const clientList = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      creditScore: 720,
      riskRating: "Low",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      creditScore: 610,
      riskRating: "Medium",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      creditScore: 540,
      riskRating: "High",
      status: "Active",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 transition-all d-flex flex-column justify-content-between ${
          sidebarOpen ? "d-block" : "d-none"
        } d-md-flex`}
        style={{ width: "250px" }}
      >
        <div>
          {/* User Profile */}
          <div className="text-center mb-4">
            <div className="mb-2">
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "2rem" }}
              ></i>
            </div>
            <p className="mb-1 fw-bold">{userEmail || "User"}</p>
          </div>

          {/* Navigation */}
          <h5 className="text-white mt-4">Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                Clients
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                Reports
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Logout at bottom */}
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-light btn-sm w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <button
            className="btn btn-outline-primary d-md-none"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <h5 className="m-0">Credit Dashboard</h5>
        </div>

        {/* Welcome Message */}
        <div className="container py-4">
          <div className="text-center mb-4">
            <h2>Welcome to the Dashboard!</h2>
            {userEmail && (
              <p className="fs-5 text-primary">
                Hello, <strong>{userEmail}</strong> 👋
              </p>
            )}
          </div>

          {/* Summary Widgets */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>Total Clients Analyzed</h5>
                <h3>{summaryData.totalClients}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>Average Credit Score</h5>
                <h3>{summaryData.averageScore}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>High Risk Clients</h5>
                <h3>{summaryData.highRiskClients}</h3>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>Active Accounts</h5>
                <h3>{summaryData.activeAccounts}</h3>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>Inactive Accounts</h5>
                <h3>{summaryData.inactiveAccounts}</h3>
              </div>
            </div>

            <div className="col-12">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <h5>Portfolio Risk Level</h5>
                <h3
                  className={`fw-bold ${
                    summaryData.portfolioRisk === "High"
                      ? "text-danger"
                      : summaryData.portfolioRisk === "Medium"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {summaryData.portfolioRisk}
                </h3>
              </div>
            </div>
          </div>

          {/* Client List Table */}
          <div className="bg-white rounded shadow-sm p-4">
            <h4 className="mb-3">Client List</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Credit Score</th>
                    <th>Risk Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientList.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.creditScore}</td>
                      <td
                        className={
                          client.riskRating === "High"
                            ? "text-danger"
                            : client.riskRating === "Medium"
                            ? "text-warning"
                            : "text-success"
                        }
                      >
                        {client.riskRating}
                      </td>
                      <td>{client.status}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2">
                          View
                        </button>
                        <button className="btn btn-sm btn-warning me-2">
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

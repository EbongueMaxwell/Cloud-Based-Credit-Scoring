import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

  const scoreDistribution = [
    {
      range: "300-579",
      count: clientList.filter(
        (client) => client.creditScore >= 300 && client.creditScore <= 579
      ).length,
    },
    {
      range: "580-667",
      count: clientList.filter(
        (client) => client.creditScore >= 580 && client.creditScore <= 667
      ).length,
    },
    {
      range: "668-739",
      count: clientList.filter(
        (client) => client.creditScore >= 668 && client.creditScore <= 739
      ).length,
    },
    {
      range: "740+",
      count: clientList.filter((client) => client.creditScore >= 740).length,
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
      {sidebarOpen && (
        <div
          className="bg-dark text-white p-3 transition-all d-flex flex-column justify-content-between"
          style={{ width: "300px" }}
        >
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white mb-0">Credit Score App</h4>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={toggleSidebar}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <h6 className="text-white mt-3">Menu</h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a
                  className="nav-link text-white d-flex align-items-center"
                  href="/dashboard"
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </a>
              </li>
              <li className="nav-item mb-2">
                <button
                  className="nav-link text-white d-flex align-items-center bg-transparent border-0 w-100 text-start"
                  onClick={() => console.log("Clients clicked")}
                >
                  <i className="bi bi-people-fill me-2"></i> Clients
                </button>
              </li>
              <li className="nav-item mb-2">
                <button
                  className="nav-link text-white d-flex align-items-center bg-transparent border-0 w-100 text-start"
                  onClick={() => console.log("Reports clicked")}
                >
                  <i className="bi bi-bar-chart-line-fill me-2"></i> Reports
                </button>
              </li>
              <li className="nav-item mb-2">
                <button
                  className="nav-link text-white d-flex align-items-center bg-transparent border-0 w-100 text-start"
                  onClick={() => console.log("Settings clicked")}
                >
                  <i className="bi bi-gear-fill me-2"></i> Settings
                </button>
              </li>
            </ul>

            <div className="text-center mt-4 pt-4 border-top border-secondary">
              <div className="mb-2">
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
              <div>
                <small className="text-muted">Logged in as</small>
                <p className="mb-0 fw-semibold text-white">
                  {userEmail || "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <div className="d-flex align-items-center flex-grow-1 me-3">
            {!sidebarOpen && (
              <button
                className="btn btn-sm btn-outline-primary me-3"
                onClick={toggleSidebar}
              >
                <i className="bi bi-list"></i>
              </button>
            )}
            <div className="input-group w-100" style={{ maxWidth: "700px" }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search clients, reports..."
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {userEmail && (
              <span className="fw-semibold text-primary d-none d-md-inline">
                Welcome, {userEmail.split("@")[0]} 👋
              </span>
            )}

            <button className="btn btn-sm btn-outline-secondary position-relative">
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="container py-4">
          <div className="text-center mb-4">
            <h2>Your Dashboard!</h2>
          </div>

          {/* Summary Widgets */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-people-fill fs-1 text-primary mb-2"></i>
                <h5>Total Clients Analyzed</h5>
                <h3>{summaryData.totalClients}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-speedometer2 fs-1 text-success mb-2"></i>
                <h5>Average Credit Score</h5>
                <h3>{summaryData.averageScore}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-exclamation-triangle-fill fs-1 text-danger mb-2"></i>
                <h5>High Risk Clients</h5>
                <h3>{summaryData.highRiskClients}</h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-check-circle-fill fs-1 text-success mb-2"></i>
                <h5>Active Accounts</h5>
                <h3>{summaryData.activeAccounts}</h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-slash-circle-fill fs-1 text-secondary mb-2"></i>
                <h5>Inactive Accounts</h5>
                <h3>{summaryData.inactiveAccounts}</h3>
              </div>
            </div>
            <div className="col-12">
              <div className="p-4 bg-white rounded shadow-sm text-center">
                <i className="bi bi-graph-up-arrow fs-1 text-warning mb-2"></i>
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

          {/* Score Distribution + Classification Factors */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="p-4 bg-white rounded shadow-sm text-center h-100">
                <h4 className="mb-4">Credit Score Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      dataKey="count"
                      nameKey="range"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell
                          key={`score-cell-${index}`}
                          fill={
                            ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm text-center h-100">
                <h4 className="mb-4">Classification Factors (%)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Credit Score", value: 30 },
                        { name: "Payment History", value: 25 },
                        { name: "Debt-to-Income Ratio", value: 20 },
                        { name: "Credit Utilization", value: 15 },
                        { name: "Credit History Length", value: 10 },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {[
                        "#4D96FF",
                        "#6BCB77",
                        "#FFD93D",
                        "#FF6B6B",
                        "#A66DD4",
                      ].map((color, index) => (
                        <Cell key={`factor-cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
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

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import QuickActionsCard from "./QuickActionsCard"; // Adjust path as needed
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import Layout from "./Layout"; // Import the Layout component

const Card = ({ title, value, change, Icon }) => (
  <div className="card shadow-sm h-100">
    <div className="card-header d-flex justify-content-between align-items-center bg-white">
      <h5 className="card-title mb-0">{title}</h5>
      <Icon className="icon text-primary" />
    </div>
    <div className="card-body">
      <div className="value fs-3 fw-bold">{value}</div>
      <p className="change text-muted mb-0">{change}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
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
      name: "High (300-579)",
      range: "300-579",
      count: clientList.filter(
        (c) => c.creditScore >= 300 && c.creditScore <= 579
      ).length,
    },
    {
      name: "Medium (580-667)",
      range: "580-667",
      count: clientList.filter(
        (c) => c.creditScore >= 580 && c.creditScore <= 667
      ).length,
    },
    {
      name: "Low (668-850)",
      range: "668-850",
      count: clientList.filter(
        (c) => c.creditScore >= 668 && c.creditScore <= 739
      ).length,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (err) {
        console.error("Token decode failed", err);
      }
    }
  }, []);

  return (
    <Layout
      userEmail={userEmail}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      handleLogout={handleLogout}
    >
      <div className="container py-4">
        <div className="text-center mb-4">
          <h2>Welcome Dashboard</h2>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <Card
              title="Approval Rate"
              value="73.2%"
              change="+2.1% from last month"
              Icon={TrendingUp}
            />
          </div>
          <div className="col-md-4">
            <Card
              title="Default Rate"
              value="2.8%"
              change="-0.5% from last month"
              Icon={AlertTriangle}
            />
          </div>
          <div className="col-md-4">
            <Card
              title="Model Accuracy"
              value="94.7%"
              change="+1.2% from last month"
              Icon={CheckCircle}
            />
          </div>
        </div>

        {/* Summary Widgets */}
        <div className="row g-4 mb-4">
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

        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm text-center">
              <h4>Credit Score Distribution</h4>
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
                    {["#FF6B6B", "#FFD93D", "#6BCB77"].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm text-center">
              <h4>Classification Factors (%)</h4>
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
                    ].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Client Table */}
        <div className="bg-white rounded shadow-sm p-4">
          <h4 className="mb-3">Recent Analysis Of Clients</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Credit Score</th>
                  <th>Risk Rating</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="row mt-2">
          <div className="col-md-6 offset-md-3">
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

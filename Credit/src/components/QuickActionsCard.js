import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const QuickActionsCard = () => (
  <div className="card shadow-lg rounded-4 p-4">
    <div className="card-header bg-transparent border-bottom-0 pb-2">
      <h5 className="card-title fw-bold mb-1">
        <i className="bi bi-clipboard-pulse" style={{ color: "blue" }}></i>{" "}
        Quick Actions
      </h5>
      <p className="card-text text-muted small">
        Easily access common credit tasks
      </p>
    </div>
    <div className="card-body px-0 pt-3">
      <div className="d-grid gap-3">
        <Link
          to="/scoring"
          className="btn btn-primary d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-plus-circle me-2" style={{ color: "azur" }}></i>
          New Credit Assessment
        </Link>
        <Link
          to="/analytics"
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
        >
          <i
            className="bi bi-bar-chart-line me-2"
            style={{ color: "blue" }}
          ></i>
          View Analytics
        </Link>
        <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
          <i
            className="bi bi-file-earmark-bar-graph me-2"
            style={{ color: "blue" }}
          ></i>
          Generate Report
        </button>
        <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
          <i className="bi bi-cpu me-2" style={{ color: "blue" }}></i>
          Model Retraining
        </button>
      </div>
    </div>
  </div>
);

export default QuickActionsCard;

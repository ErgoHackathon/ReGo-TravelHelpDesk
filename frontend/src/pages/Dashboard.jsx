import React from "react";
import Header from "../components/Header";
import "./../styles/ManagerDashboard.css";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="manager-container">
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <button className="raise-request-btn">
            <FlightTakeoffIcon fontSize="small" sx={{ marginRight: 0.5 }} />
            Raise Travel Request
          </button>
        </div>

        <section className="stats-cards">
          <div className="stat-card red-card">
            <div className="stat-header">
              <span>Requests Raised (Last 30 Days)</span>
              <CalendarTodayIcon sx={{ color: "#d97d7d" }} />
            </div>
            <h2>12</h2>
          </div>

          <div className="stat-card yellow-card">
            <div className="stat-header">
              <span>Pending Approvals</span>
              <HourglassBottomIcon sx={{ color: "#d1a72a" }} />
            </div>
            <h2>3</h2>
          </div>

          <div className="stat-card gray-card">
            <div className="stat-header">
              <span>Total Reports</span>
              <GroupsIcon sx={{ color: "#8a919d" }} />
            </div>
            <h2>25</h2>
          </div>
        </section>

        <section className="recent-status">
          <h2>Recent Application Status</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employees</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>RG-2001</td>
                <td>Alex J., Ben K.</td>
                <td>New York, USA</td>
                <td>
                  <span className="status pending">Pending Manager Approval</span>
                </td>
                <td>
                  <a href="#" className="action-link red-link">
                    View Details
                  </a>
                </td>
              </tr>

              <tr>
                <td>RG-1998</td>
                <td>Sarah M.</td>
                <td>London, UK</td>
                <td>
                  <span className="status approved">Travel Desk Approved</span>
                </td>
                <td>
                  <a href="#" className="action-link green-link">
                    Send Doc Request
                  </a>{" "}
                  <a href="#" className="action-link red-link">
                    View Details
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <footer className="footer">
        © 2024 Re-Go. All rights reserved.{" "}
        <span className="partner-text">| Your travel partner.</span>
      </footer>
    </>
  );
}

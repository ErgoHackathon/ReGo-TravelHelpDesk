import React from "react";
import "./Header.css";
import Logo from "./../assets/ReGO_Logo.png";

export default function Header() {
  return (
    <header className="header-container">
      <div className="logo-section">
        <img
          src={Logo}
          alt="Re-Go Logo"
          className="logo-img"
        />
        <span className="logo-text">Re-Go</span>
      </div>
      <div className="user-section">
        <div className="avatar-circle">U</div>
        <div className="user-info">
          <div className="user-name">Jane Doe (Manager)</div>
          <a href="#" className="logout-link">
            Logout
          </a>
        </div>
      </div>
    </header>
  );
}

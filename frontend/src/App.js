import React, { useState } from "react";
import LoginPage from "./pages/Login";
import FlightTransition from "./pages/FlightTransition";
import ManagerDashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogin = () => {
    setIsAnimating(true);

    // Play animation for 1.8 seconds, then load homepage
    setTimeout(() => {
      setIsAnimating(false);
      setIsLoggedIn(true);
    }, 1800);
  };

  return (
    <>
      {isAnimating && <FlightTransition />}
      {!isLoggedIn && !isAnimating && <LoginPage onLogin={handleLogin} />}
      {isLoggedIn && !isAnimating && <ManagerDashboard />}
    </>
  );
}

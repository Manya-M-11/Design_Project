import React from "react";
import { Link } from "react-router-dom";
import VoiceButton from "../components/VoiceButton";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#2e7d32",
        padding: "10px 20px",
        color: "white"
      }}
    >
      <h2>Krishi Siri</h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        {/* Voice Button in Middle */}
        <VoiceButton />

        <Link to="/pest" style={{ color: "white", textDecoration: "none" }}>
          Pest Detection
        </Link>

        <Link to="/market" style={{ color: "white", textDecoration: "none" }}>
          Market Prices
        </Link>

        <Link to="/soil" style={{ color: "white", textDecoration: "none" }}>
          Soil Advisory
        </Link>

        <Link to="/weather" style={{ color: "white", textDecoration: "none" }}>
          Weather Alerts
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";

const VoiceButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/voice")}
      style={{
        background: "#2e7d32",
        border: "none",
        color: "white",
        padding: "8px 14px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      <Mic size={18} />
      Voice
    </button>
  );
};

export default VoiceButton;
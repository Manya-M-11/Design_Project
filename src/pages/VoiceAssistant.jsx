import React, { useState } from "react";

const Voice = () => {
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    setListening(!listening);

    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.onresult = function (event) {
      const text = event.results[0][0].transcript;
      alert("You said: " + text);
    };

    recognition.start();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "80px"
      }}
    >
      <h2>Voice Assistant</h2>
      <p>Ask me anything about farming</p>

      <button
        onClick={handleVoice}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "none",
          background: "#4CAF50",
          color: "white",
          fontSize: "30px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        🎤
      </button>

      <p style={{ marginTop: "15px" }}>
        {listening ? "Listening..." : "Tap to Speak"}
      </p>
    </div>
  );
};

export default Voice;
import React, { useEffect, useState } from "react";

export default function MarketPrices() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_Market_API; // your API key
  const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?format=json&limit=5000&api-key=${API_KEY}`;

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json.records || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, [API_URL]);

  // Extract unique states for dropdown
  const states = ["All States", ...new Set(data.map((item) => item.state))];

  // Filter by commodity and state
  const filtered = data.filter(
    (item) =>
      item.commodity?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedState === "All States" || item.state === selectedState)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#0d6f3c" }}>Crop Market Prices</h2>
      <p style={{ color: "#3c3c3c" }}>
        Get daily market prices of crops from various mandis across India
      </p>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search crop (Tomato, Onion, Rice)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #0d6f3c",
          }}
        />

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #0d6f3c",
            backgroundColor: "#e6f4ea",
          }}
        >
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "#0d6f3c" }}>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filtered.slice(0, 50).map((item, index) => (
            <div
              key={index}
              style={{
                background: "#e6f4ea",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#0d6f3c", marginBottom: "5px" }}>
                {item.commodity}
              </h3>
              <p style={{ margin: "2px 0" }}>
                <strong>Market:</strong> {item.market}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>State:</strong> {item.state}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Min Price:</strong> ₹{item.min_price}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Max Price:</strong> ₹{item.max_price}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Modal Price:</strong> ₹{item.modal_price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
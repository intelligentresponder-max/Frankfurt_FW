import React, { useState } from "react";
import { freieWaehlerPipelines } from "./data/freieWaehlerPipelines";

function App() {
  const [modus, setModus] = useState("kantig"); // "kantig" oder "gemaessigt"
  const wohnen = freieWaehlerPipelines.wohnen;
  const current = wohnen[modus];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>FREIE WÄHLER Frankfurt – Kommunalwahl 2026</h1>
      <p>Wahl-Content für junge Leute und alle, die Frankfurt mitgestalten wollen.</p>

      {/* FREIE WÄHLER – TikTok Tool: Wohnen */}
      <section style={{ marginTop: 32, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Wohnen & Stadtteile – TikTok-Text</h2>

        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setModus("kantig")}
            style={{
              marginRight: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: modus === "kantig" ? "#ff8800" : "#eee",
              color: modus === "kantig" ? "#fff" : "#333"
            }}
          >
            Kantig
          </button>
          <button
            onClick={() => setModus("gemaessigt")}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: modus === "gemaessigt" ? "#0077cc" : "#eee",
              color: modus === "gemaessigt" ? "#fff" : "#333"
            }}
          >
            Gemäßigt
          </button>
        </div>

        <p><strong>Hook:</strong> {current.hook}</p>
        <p>{current.text}</p>
        <p style={{ fontSize: 14, color: "#555" }}>{current.fakt}</p>
        <p style={{ fontSize: 13, color: "#777" }}>
          Hashtags: {current.hashtags.join(" ")}
        </p>
      </section>
    </div>
  );
}

export default App;

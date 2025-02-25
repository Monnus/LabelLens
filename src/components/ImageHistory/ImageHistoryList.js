import { useState, useEffect } from "react";
import ImageHistoryItem from "./ImageHistoryItem";

export default function ImageHistoryList({ selectedFile, setResults }) {
  const [history, setHistory] = useState([
    "camera.jpg",
    "laptop.jpg",
    "1740046540419-coffee.jpg",
  ]);

  useEffect(() => {
    if (selectedFile) {
      setHistory((prevHistory) => [...prevHistory, selectedFile]);
    }
  }, [selectedFile]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "100%",
          background: "linear-gradient(to bottom, #2d3748, #1a202c)",
          color: "#fff",
          padding: "24px",
          boxShadow: "4px 0 15px rgba(0, 0, 0, 0.3)",
          borderRadius: "0 10px 10px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
            borderBottom: "1px solid #4a5568",
            paddingBottom: "8px",
          }}
        >
          📁 Upload History
        </h2>

        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {history.map((item, index) => (
            <ImageHistoryItem key={index} item={item} setResults={setResults} />
          ))}
        </ul>

        {/* Footer */}
        <div style={{ marginTop: "16px", fontSize: "0.9rem", color: "#a0aec0" }}>
          💾 Total uploads: {history.length}
        </div>
      </aside>
    </div>
  );
}

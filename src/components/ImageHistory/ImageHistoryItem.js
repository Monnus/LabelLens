import React, { useState } from "react";

function ImageHistoryItem({ item, setResults }) {
  const [isHovered, setIsHovered] = useState(false);

  const onClickRecord = async () => {
    const apiGatewayUrl = `https://v4gxql7uyk.execute-api.us-east-1.amazonaws.com/Dev/images/${item}`;
    const response = await fetch(apiGatewayUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setResults(data);
    console.log("API Retrieval", data);
  };

  return (
    <li
      onClick={() => onClickRecord(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        backgroundColor: isHovered ? "#4a5568" : "#2d3748",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <div style={{ fontSize: "0.9rem", color: "#e2e8f0" }}>{item}</div>
    </li>
  );
}

export default ImageHistoryItem;

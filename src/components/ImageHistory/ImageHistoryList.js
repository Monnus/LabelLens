import { useState, useEffect } from "react";
import ImageHistoryItem from "./ImageHistoryItem";

export default function ImageHistoryList({ selectedFile }) {
  const [history, setHistory] = useState([
    "camera.jpg",
    "laptop.jpg",
    "headphones.jpg",
  ]);

  useEffect(() => {
    if (selectedFile) {
      setHistory((prevHistory) => [...prevHistory, selectedFile]);
    }
  }, [selectedFile]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <aside className="w-1/4 bg-gray-800 text-white p-6 h-full shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Upload History</h2>
        <ul className="space-y-4 overflow-y-auto">
          {history.map((item, index) => (
            <ImageHistoryItem key={index} item={item} />
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {/* Main content */}
      </main>
    </div>
  );
}

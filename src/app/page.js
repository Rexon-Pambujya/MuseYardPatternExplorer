"use client";
import { useState } from "react";
import FileUpload from "./component/FileUpload";
import InsightsDisplay from "./component/InsightsDisplay.jsx";

export default function Home() {
  const [parsedData, setParsedData] = useState(null); // Stores parsed WhatsApp data
  const [insights, setInsights] = useState([]); // Stores insights from the analysis API

  const fetchAnalysis = async () => {
    if (!parsedData) return;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(parsedData) }),
      });

      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`);
        throw new Error("Failed to fetch analysis");
      }

      const data = await response.json();
      setInsights(data); // Set structured insights
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Pattern Explorer</h1>
      <FileUpload onParsedData={setParsedData} />

      {parsedData && (
        <div className="mt-4">
          <button
            onClick={fetchAnalysis}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Analyze Content
          </button>
        </div>
      )}

      <InsightsDisplay insights={insights} />
    </div>
  );
}

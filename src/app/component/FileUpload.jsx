import React, { useState } from "react";
import { parseWhatsAppChat } from "../../utils/parser";

const FileUpload = ({ onParsedData }) => {
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".txt")) {
      setError("Please upload a valid .txt file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const parsedData = parseWhatsAppChat(reader.result);
      onParsedData(parsedData);
    };
    reader.readAsText(file);
    setError("");
  };

  return (
    <div className="p-4 border rounded-md shadow">
      <h2 className="text-lg font-semibold mb-2">
        Upload WhatsApp Chat Export
      </h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;

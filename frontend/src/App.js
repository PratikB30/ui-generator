import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [requirement, setRequirement] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/generate-ui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requirement })
      });
      const data = await response.json();
      if (data.status === "success") {
        setMarkdown(data.markdown);
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setRequirement(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <h1>AI UI Generator</h1>
      <textarea
        rows="10"
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        placeholder="Paste your requirement document here..."
      />
      <div>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate UI"}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="output">
        <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
}

export default App;

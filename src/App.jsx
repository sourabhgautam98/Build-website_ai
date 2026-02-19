import { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import CodePanel from "./components/CodePanel";
import PreviewPanel from "./components/PreviewPanel";
import { generateWebsite, clearHistory } from "./services/ai";
import { FiCode, FiEye } from "react-icons/fi";
import "./App.css";

function App() {
  const [code, setCode] = useState({ html: "", css: "", js: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [rightTab, setRightTab] = useState("preview"); 

  const handleGenerate = async (prompt) => {
    setIsLoading(true);
    try {
      const result = await generateWebsite(prompt);
      setCode(result);
      setRightTab("preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode({ html: "", css: "", js: "" });
    clearHistory();
  };

  const hasCode = code.html || code.css || code.js;

  return (
    <div className="app-container">
      {/* Left Panel — Chat */}
      <aside className="left-panel">
        <ChatPanel
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onClear={handleClear}
        />
      </aside>

      {/* Right Panel — Code + Preview */}
      <main className="right-panel">
        {/* Toggle Tabs */}
        <div className="right-panel-tabs">
          <button
            className={`rp-tab ${rightTab === "code" ? "active" : ""}`}
            onClick={() => setRightTab("code")}
          >
            <FiCode />
            <span>Code</span>
          </button>
          <button
            className={`rp-tab ${rightTab === "preview" ? "active" : ""}`}
            onClick={() => setRightTab("preview")}
          >
            <FiEye />
            <span>Preview</span>
          </button>
        </div>

        {/* Content */}
        <div className="right-panel-content">
          {rightTab === "code" ? (
            <CodePanel code={code} />
          ) : (
            <PreviewPanel code={code} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";
import { FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";

const TABS = [
  { id: "html", label: "HTML", icon: FaHtml5, lang: "html", color: "#e44d26" },
  { id: "css", label: "CSS", icon: FaCss3Alt, lang: "css", color: "#264de4" },
  { id: "js", label: "JS", icon: FaJs, lang: "javascript", color: "#f7df1e" },
];

export default function CodePanel({ code }) {
  const [activeTab, setActiveTab] = useState("html");
  const [copied, setCopied] = useState(false);

  const currentTab = TABS.find((t) => t.id === activeTab);
  const currentCode = code[activeTab] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-panel">
      <div className="code-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`code-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCopied(false);
              }}
            >
              <Icon style={{ color: tab.color }} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          className="copy-btn"
          onClick={handleCopy}
          disabled={!currentCode}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <FiCheck /> Copied!
            </>
          ) : (
            <>
              <FiCopy /> Copy
            </>
          )}
        </button>
      </div>

      <div className="code-content">
        {currentCode ? (
          <SyntaxHighlighter
            language={currentTab.lang}
            style={oneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: "transparent",
              fontSize: "0.85rem",
              height: "100%",
            }}
          >
            {currentCode}
          </SyntaxHighlighter>
        ) : (
          <div className="code-empty">
            <span>✨</span>
            <p>Generated {currentTab.label} code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function ChatPanel({ onGenerate, isLoading, onClear }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMsg = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setPrompt("");

    try {
      await onGenerate(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "✅ Website generated! Check the preview →" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `❌ Error: ${err.message}` },
      ]);
    }
  };

  const handleClear = () => {
    setMessages([]);
    onClear?.();
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-title">
          <HiSparkles className="sparkle-icon" />
          <h2>AI Website Builder</h2>
        </div>
        {messages.length > 0 && (
          <button
            className="clear-btn"
            onClick={handleClear}
            title="Clear chat"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <h3>Describe your dream website</h3>
            <p>
              Tell me what you want to build and I'll generate the HTML, CSS &
              JS for you instantly.
            </p>
            <div className="suggestions">
              {[
                "Build a modern calculator",
                "Create a portfolio landing page",
                "Make a to-do list app",
                "Design a weather dashboard",
              ].map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => setPrompt(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            <div className="msg-bubble">
              {msg.role === "ai" && <HiSparkles className="msg-ai-icon" />}
              <span>{msg.text}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-msg ai">
            <div className="msg-bubble loading-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Generating your website...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe the website you want to build..."
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!prompt.trim() || isLoading}
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}

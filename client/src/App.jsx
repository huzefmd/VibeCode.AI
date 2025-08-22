import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://vibecode-ai-82hy.onrender.com/api/generate",
        {
          prompt,
        }
      );

      const botMessage = { role: "bot", text: res.data.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error fetching response" },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="min-h-screen flex flex-col bg-[#343541] text-white">
      {/* Header */}
      <header className="p-4 bg-[#202123] text-center font-semibold text-lg border-b border-gray-700">
        VibeCode.AI
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-lg whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#10a37f] text-white self-end"
                  : "bg-[#444654] text-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#444654] px-4 py-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-[#202123] border-t border-gray-700">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            rows="1"
            className="flex-1 resize-none p-3 rounded-md bg-[#40414f] text-white border border-gray-600 focus:ring-2 focus:ring-[#10a37f] focus:outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-3 bg-[#10a37f] rounded-md hover:bg-[#0e8f6e] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;

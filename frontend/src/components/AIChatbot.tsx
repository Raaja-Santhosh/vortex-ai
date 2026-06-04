"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Sparkles, X, Send, Trash, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export const AIChatbot: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatHistory,
    sendChatMessage,
    clearChatHistory,
    addToast
  } = useDashboard();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isChatOpen]);

  if (!isChatOpen) {
    // Floating badge trigger if closed
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-white text-black p-3.5 border border-white hover:bg-white/85 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 hover:scale-105 cursor-pointer font-mono text-[10px] tracking-widest uppercase font-semibold"
      >
        <Sparkles className="w-4 h-4 fill-black" />
        <span>Vortex AI</span>
      </button>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input;
    setInput("");
    setLoading(true);
    await sendChatMessage(query);
    setLoading(false);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (loading) return;
    setLoading(true);
    await sendChatMessage(suggestion);
    setLoading(false);
  };

  const suggestions = [
    "Show me our CRM table",
    "What are Vortex's pricing retainers?",
    "Start timer for ACME PLATFORM",
    "Open Document Vault",
    "Support needed for refund"
  ];

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-[#111111] border-l border-white/10 z-50 flex flex-col text-white shadow-2xl animate-slideIn">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4.5 h-4.5 text-white/80 fill-white" />
          <div>
            <h3 className="text-xs font-mono tracking-widest uppercase">Vortex AI Assistant</h3>
            <span className="text-[9px] font-mono text-green-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Systems Synchronized
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={clearChatHistory}
            className="p-1.5 opacity-40 hover:opacity-100 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            title="Clear Chat Logs"
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 opacity-40 hover:opacity-100 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 font-mono text-xs">
        {chatHistory.map((m, idx) => {
          const isUser = m.sender === "user";
          const isSystem = m.sender === "system";

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center">
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 text-[9px] uppercase tracking-widest text-center max-w-[85%] leading-relaxed flex gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {m.text}
                </span>
              </div>
            );
          }

          return (
            <div key={idx} className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}>
              {/* Message block */}
              <div className={`p-3 border leading-relaxed ${
                isUser 
                  ? "bg-white/5 text-white/90 border-white/10" 
                  : "bg-white text-black border-white"
              }`}>
                {m.text}
              </div>

              {/* Timestamp */}
              <span className="text-[8px] text-white/30 mt-1 uppercase tracking-wider">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>

              {/* Action Trigger Badge */}
              {!isUser && m.intent && m.intent !== "general" && m.intent !== "faq" && (
                <div className="mt-2 border border-white/20 bg-white/5 p-2 text-[9px] uppercase tracking-widest text-white/60 flex items-center gap-1.5 w-full">
                  <CheckCircle className="w-3 h-3 text-white" />
                  <span>Command: {m.intent.replace("_", " ")} executed</span>
                </div>
              )}

              {/* Support Ticket Badge */}
              {!isUser && m.ticket_created && m.ticket_id && (
                <div className="mt-2 border border-red-500/20 bg-red-500/10 p-2 text-[9px] uppercase tracking-widest text-red-400 flex flex-col gap-1 w-full leading-normal">
                  <span className="font-semibold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> Support Ticket Active</span>
                  <span>ID: {m.ticket_id}</span>
                  <span>Agent: Sarah J.</span>
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2 items-center mr-auto text-white/40 uppercase tracking-widest text-[9px]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts (only if chat history has 1 message) */}
      {chatHistory.length <= 2 && (
        <div className="p-3 border-t border-white/10 flex flex-col gap-2 bg-white/[0.005]">
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/30">System Short Commands</span>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="text-[9px] font-mono px-2 py-1 border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all text-white/50 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
        <input
          required
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI or control dashboard..."
          className="flex-grow bg-transparent border border-white/10 px-3 py-2 text-xs font-mono outline-none text-white focus:border-white/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 border border-white bg-white text-black hover:bg-white/80 disabled:opacity-50 transition-all flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>
    </div>
  );
};

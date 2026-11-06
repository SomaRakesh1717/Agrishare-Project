"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

interface MessageItem {
  role: "user" | "assistant";
  content: string;
  source?: string;
  suggestions?: string[];
}

export default function AiAssistantView({ onBookMachinery }: { onBookMachinery?: () => void }) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      role: "assistant",
      content:
        "Namaskaram! I am AgriRent's AI Crop & Agronomic Assistant. How can I assist your farming today? Ask me about pest diagnosis, fertilizer dosages, sowing schedules, or machinery selection.",
      suggestions: [
        "My tomato leaves are turning yellow. What should I do?",
        "Which fertilizer is suitable for rice?",
        "When should I sow maize?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: MessageItem = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.ai.chat(textToSend, history);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          source: response.source,
          suggestions: response.suggestions,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Notice: The live AI service encountered a temporary error. However, our agronomy rules recommend inspecting for leaf fungal blight or nitrogen deficiency, and applying balanced foliar spray.",
          suggestions: ["My tomato leaves are turning yellow. What should I do?", "Which fertilizer is suitable for rice?"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Editorial Header from Stitch */}
      <div className="bg-gradient-to-r from-primary-container to-primary text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-fixed text-xs font-bold self-start">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              AI Agronomy Companion
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
              Crop Diagnostics & Mechanization Advisor
            </h1>
            <p className="text-xs sm:text-sm text-primary-fixed/90 max-w-xl">
              Get immediate science-backed guidance for pest attacks, nutrient deficiencies, weather windows, and matched machinery.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-center">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">sunny</span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Cluster Soil Moisture: 64%</span>
              <span className="text-secondary-fixed font-semibold">28°C Nizamabad Agro-Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container overflow-hidden flex flex-col h-[650px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${
                m.role === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <div
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-surface-container-low text-on-surface rounded-bl-none border border-surface-container"
                }`}
              >
                {/* Assistant formatted text */}
                <div className="whitespace-pre-line prose prose-sm max-w-none">
                  {m.content}
                </div>

                {m.source && (
                  <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center gap-1.5 text-[10px] text-outline font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>Verified via {m.source === "GEMINI_LIVE" ? "Live Gemini AI" : "Agronomic Science Engine"}</span>
                  </div>
                )}
              </div>

              {/* Suggestions / Prompt Chips */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {m.suggestions.map((sugg, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => sendMessage(sugg)}
                      className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-medium text-xs border border-primary/20 transition-all flex items-center gap-1 text-left"
                    >
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>{sugg}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start flex items-center gap-2 p-4 rounded-2xl bg-surface-container-low text-on-surface-variant text-xs">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span>Analyzing agronomic query & consulting regional soil databases...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-2xl border border-surface-container shadow-inner focus-within:ring-2 focus-within:ring-primary"
          >
            <div className="pl-3 text-outline">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: e.g. 'My tomato leaves are turning yellow', 'Rice fertilizer schedule'..."
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container disabled:opacity-50 transition-colors font-bold text-xs flex items-center gap-1 shadow"
            >
              <span>Ask AI</span>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </form>

          {/* Quick Starter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2.5">
            <span className="text-[11px] text-outline uppercase font-semibold shrink-0">Try Asking:</span>
            <button
              onClick={() => sendMessage("My tomato leaves are turning yellow. What should I do?")}
              className="px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface whitespace-nowrap"
            >
              🍅 Yellow Tomato Leaves
            </button>
            <button
              onClick={() => sendMessage("Which fertilizer is suitable for rice?")}
              className="px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface whitespace-nowrap"
            >
              🌾 Rice Fertilizer Schedule
            </button>
            <button
              onClick={() => sendMessage("When should I sow maize?")}
              className="px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface whitespace-nowrap"
            >
              🌽 Maize Sowing Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

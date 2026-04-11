"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatWidgetProps {
  businessName: string;
  agentTone?: string;
  /** Allow parent to control open state (e.g. from a CTA button) */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AIChatWidget({
  businessName,
  agentTone = "Pro",
  isOpen: controlledIsOpen,
  onOpenChange,
}: AIChatWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: `¡Hola! 👋 Soy el asistente de ${businessName}. ¿En qué puedo ayudarte hoy?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Support both controlled (from parent) and uncontrolled (internal) open state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const setIsOpen = (val: boolean) => {
    setInternalOpen(val);
    onOpenChange?.(val);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, tone: agentTone }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Lo siento, tengo problemas para conectar. Inténtalo de nuevo más tarde." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Floating Button — only show when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden relative"
        >
          <MessageCircle className="w-8 h-8 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      <div
        className={cn(
          "absolute bottom-0 right-0 w-[min(400px,calc(100vw-2rem))] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 origin-bottom-right transform flex flex-col h-[500px]",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight leading-none mb-1">Asistente IA · {businessName}</div>
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">En línea ahora</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50"
        >
          {messages.map((m, i) => (
            <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm",
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none font-medium"
                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-none font-semibold"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col items-start">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-90 transition-all disabled:bg-slate-300 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3 opacity-30 select-none">
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Powered by AtendIA</span>
            <Zap className="w-2.5 h-2.5 text-blue-600 fill-current" />
          </div>
        </form>
      </div>
    </div>
  );
}

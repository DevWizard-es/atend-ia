"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  CheckCheck,
  Phone,
  Video,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo Org ID (In real app, from Auth Context)
const ORG_ID = "pizzeria-id-demo"; 

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Load Conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch(`/api/conversations?orgId=pizzeria-id-demo`); // Standardized to demo id
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) setActiveChat(data[0]);
      } catch (e) {}
      setLoading(false);
    }
    loadConversations();
  }, []);

  // Load Messages for Active Chat
  useEffect(() => {
    async function loadMessages() {
      if (!activeChat) return;
      try {
        const res = await fetch(`/api/conversations/${activeChat.id}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (e) {}
    }
    loadMessages();
  }, [activeChat]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const tempMsg = { content: input, direction: 'outbound', created_at: new Date().toISOString() };
    setMessages([...messages, tempMsg]);
    setInput("");

    try {
      await fetch(`/api/conversations/${activeChat.id}/messages/send`, {
        method: "POST",
        body: JSON.stringify({ content: input })
      });
      // En un app real, dispararíamos un trigger de WhatsApp aquí
    } catch (e) {}
  };

  if (loading) return <div className="p-10 font-bold text-slate-300">Conectando con el Inbox...</div>;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Chat List */}
      <div className="w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inbox</h1>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar conversaciones..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "p-4 mx-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all mb-1",
                activeChat?.id === chat.id 
                  ? "bg-white shadow-md border border-slate-100" 
                  : "hover:bg-slate-100/50"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {chat.contact_name?.charAt(0) || 'L'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900 truncate">{chat.contact_name || 'Anónimo'}</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hoy</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 truncate leading-relaxed">{chat.last_message || 'Inicia chat'}</p>
                  {chat.status === 'open' && (
                    <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                      1
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {activeChat.contact_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 leading-none mb-1">{activeChat.contact_name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 tracking-wide uppercase">
                    WhatsApp Web
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2.5 hover:bg-slate-50 text-slate-500 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-2.5 hover:bg-slate-50 text-slate-500 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <button className="p-2.5 hover:bg-slate-50 text-slate-500 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex items-end gap-3", m.direction === 'outbound' ? "justify-end" : "justify-start")}>
                  {m.direction !== 'outbound' && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                       {activeChat.contact_name?.charAt(0)}
                    </div>
                  )}
                  <div className={cn(
                    "p-4 rounded-2xl shadow-sm max-w-md text-sm leading-relaxed",
                    m.direction === 'outbound' 
                      ? "bg-[#0052FF] text-white rounded-br-none" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                  )}>
                    <p>{m.content}</p>
                  <div className={cn("text-[9px] font-bold mt-2", m.direction === 'outbound' ? "text-blue-100 text-right" : "text-slate-400")}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {m.direction === 'outbound' && (
                    <div className={cn("w-8 h-8 rounded-full bg-blue-100 text-[#0052FF] flex-shrink-0 flex items-center justify-center text-[10px] font-bold")}>A</div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-6 border-t border-slate-100 flex items-center gap-4 bg-white/80 backdrop-blur">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="w-full pl-5 pr-14 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0052FF] text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            Selecciona una conversación para empezar.
          </div>
        )}
      </div>
    </div>
  );
}

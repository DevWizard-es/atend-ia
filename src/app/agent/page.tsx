"use client";

import { useState, useEffect } from "react";
import { 
  Bot, 
  Settings2, 
  MessageSquare, 
  Send, 
  Zap, 
  Shield, 
  Sparkles,
  ChevronRight,
  Smile,
  Mic,
  Paperclip,
  CheckCircle2,
  Phone,
  Link as LinkIcon,
  ScanLine
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¡Hola! Soy tu asistente de IA. Puedes configurarme a la izquierda y probar cómo respondo aquí mismo.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [tone, setTone] = useState("Pro");
  const [instructions, setInstructions] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/agent/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.agent_tone) setTone(data.agent_tone);
          if (data.agent_instructions) setInstructions(data.agent_instructions);
          if (data.whatsapp_phone) setWhatsapp(data.whatsapp_phone);
          if (data.google_maps_url) setMapsUrl(data.google_maps_url);
        }
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/agent/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp_phone: whatsapp,
          google_maps_url: mapsUrl,
          agent_tone: tone,
          agent_instructions: instructions
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {}
    setIsSaving(false);
  };

  const sendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        body: JSON.stringify({ message: input, tone })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Lo siento, ha habido un error conectando con mi cerebro local. 🧠🔋' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col gap-8 transform-gpu">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0 bg-white/80 backdrop-blur sticky top-8 z-10 py-4 -my-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-600" /> Agente y Canales
          </h1>
          <p className="text-slate-500 font-medium">Configura el comportamiento de tu IA y vincula tus redes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-xs uppercase tracking-widest animate-pulse">
             ● Activo
          </div>
          <button 
            onClick={saveSettings}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
            {saveSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Channels Configuration */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-black text-slate-800 tracking-tight">Canales Vinculados</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Business
                </label>
                <input 
                  type="tel"
                  placeholder="Ej: +34 600 123 456"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ScanLine className="w-3.5 h-3.5 text-red-500" /> Ubicación (Google Maps)
                </label>
                <input 
                  type="url"
                  placeholder="Añade el enlace de Google Maps a tu local"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Tone Selector */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-slate-800 tracking-tight">Personalidad del Agente</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Pro', name: 'Profesional', desc: 'Serio y directo', icon: Shield },
                { id: 'Fun', name: 'Amigable', desc: 'Cercano y entusiasta', icon: Smile },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all",
                    tone === t.id 
                      ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <t.icon className={cn("w-5 h-5 mb-2", tone === t.id ? "text-blue-600" : "text-slate-400")} />
                  <div className="font-bold text-sm text-slate-900">{t.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{t.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Core Instructions */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-800 tracking-tight">Instrucciones Base</h3>
            </div>
            <textarea 
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Ej: 'Eres el asistente de Pizzería Roma...'"
            />
          </section>
        </div>

        {/* Chat Playground Column */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-slate-900 leading-none">Test de Agente</div>
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-current" /> Modo Playground
                </div>
              </div>
            </div>
            <button 
              onClick={() => setMessages([{ role: 'bot', content: '¡Hola de nuevo! Reinicio de memoria efectuado.' }])}
              className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Reiniciar charla
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/10 z-10 relative">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn(
                  "p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm",
                  m.role === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none w-fit shadow-sm">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            )}
          </div>

          <form onSubmit={sendTestMessage} className="p-6 shrink-0 bg-white border-t border-slate-100 z-10 relative">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje de prueba..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, transparent 80%)'}}></div>
        </div>
      </div>
    </div>
  );
}

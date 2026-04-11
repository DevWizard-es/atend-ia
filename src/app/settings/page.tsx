"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Link2, MapPin, Phone, Building2, Smile } from "lucide-react";
import { cn } from "@/lib/utils";


const BUSINESS_EMOJIS = [
  "", "🏪", "🍕", "☕", "🍔", "🥗", "🍰", "🍣", "🌮", "🍜",
  "💈", "🏋️", "🌿", "🐾", "🔧", "🎨", "📚", "🏥", "💊", "🎵",
  "✂️", "🧴", "👗", "👟", "💻", "🚗", "🏠", "🎯", "🔑", "🌟",
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    whatsapp_phone: "",
    google_maps_url: "",
    google_review_url: "",
    google_questions_url: "",
    inbox_mode: "internal",
    profile_emoji: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/agent/settings");
        const data = await res.json();
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          whatsapp_phone: data.whatsapp_phone || "",
          google_maps_url: data.google_maps_url || "",
          google_review_url: data.google_review_url || "",
          google_questions_url: data.google_questions_url || "",
          inbox_mode: data.inbox_mode || "internal",
          profile_emoji: data.profile_emoji || "",
        });
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/agent/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMessage({ text: "Perfil actualizado correctamente.", type: "success" });
      } else {
        setMessage({ text: "Hubo un error al actualizar.", type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Error de red.", type: "error" });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const initials = form.name?.substring(0, 2)?.toUpperCase() || "MI";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" /> Perfil Comercial
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mt-1">
            Configura el nombre, icono, Bio-link y canales de contacto.
          </p>
        </div>
      </header>

      {/* Main Settings Panel */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
        <form onSubmit={handleSave}>
          <div className="p-8 lg:p-10 space-y-10">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Profile Icon Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                      <Smile className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">Icono del Negocio</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Aparece en tu BioLink público</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-3xl border-4 border-slate-50 shrink-0">
                      {form.profile_emoji || initials}
                    </div>

                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all border border-slate-200"
                      >
                        {showEmojiPicker ? "Cerrar selector" : "Cambiar icono"} ✏️
                      </button>
                      <p className="text-xs text-slate-400 font-medium mt-2">
                        {form.profile_emoji ? `Icono actual: ${form.profile_emoji}` : "Usando las iniciales del negocio"}
                      </p>
                    </div>
                  </div>

                  {/* Emoji Grid */}
                  {showEmojiPicker && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Elige un icono:</p>
                      <div className="grid grid-cols-10 gap-2">
                        {BUSINESS_EMOJIS.map((emoji, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setForm({ ...form, profile_emoji: emoji }); setShowEmojiPicker(false); }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-white transition-all hover:scale-110 hover:shadow-md ${form.profile_emoji === emoji ? "bg-blue-100 border-2 border-blue-500" : "border-2 border-transparent"}`}
                            title={emoji || "Usar iniciales"}
                          >
                            {emoji || <span className="text-[9px] font-black text-slate-400">AB</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <hr className="border-slate-100" />

                {/* Branding Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">Identidad y Enlace</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cómo te ven tus clientes</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700">Nombre del Negocio</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ej. Pizzería Roma"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700">Identificador Bio-Link (Slug)</label>
                      <div className="relative flex items-center group">
                        <span className="absolute left-4 text-slate-400 font-medium text-sm group-focus-within:text-blue-500 transition-colors">
                          /b/
                        </span>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                          placeholder="pizzeria-roma"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Solo letras minúsculas, números y guiones.</p>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* Contact Channels Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">Canales Vinculados</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Captación de Leads</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" /> WhatsApp
                      </label>
                      <input
                        type="text"
                        value={form.whatsapp_phone}
                        onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
                        placeholder="+34 600 000 000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" /> Enlace Google Maps
                      </label>
                      <input
                        type="url"
                        value={form.google_maps_url}
                        onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Smile className="w-4 h-4 text-amber-500" /> Enlace de Reseñas Google
                      </label>
                      <input
                        type="url"
                        value={form.google_review_url}
                        onChange={(e) => setForm({ ...form, google_review_url: e.target.value })}
                        placeholder="https://search.google.com/local/writereview?placeid=..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* Inbox Configuration Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">Canal de Mensajes (Inbox)</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Configura a dónde llegan los mensajes</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "internal", label: "Interno (AtendIA)", desc: "Usa la bandeja de mensajes propia." },
                        { id: "whatsapp", label: "WhatsApp", desc: "Redirige los mensajes a tu WhatsApp." },
                        { id: "google", label: "Google Questions", desc: "Enlaza a las preguntas de Google Maps." },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setForm({ ...form, inbox_mode: mode.id })}
                          className={cn(
                            "p-4 rounded-2xl border-2 text-left transition-all",
                            form.inbox_mode === mode.id
                              ? "border-blue-500 bg-blue-50/50 shadow-md"
                              : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                          )}
                        >
                          <div className={cn("text-sm font-black mb-1", form.inbox_mode === mode.id ? "text-blue-600" : "text-slate-900")}>
                            {mode.label}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 leading-tight">{mode.desc}</p>
                        </button>
                      ))}
                    </div>

                    {form.inbox_mode === "google" && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-bold text-slate-700">Enlace de Preguntas Google</label>
                        <input
                          type="url"
                          value={form.google_questions_url || ""}
                          onChange={(e) => setForm({ ...form, google_questions_url: e.target.value })}
                          placeholder="https://www.google.com/maps/questions/..."
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1">
              {message && (
                <div className={`text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || saving}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Guardando..." : "Guardar Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

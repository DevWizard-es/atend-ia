"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Link2, MapPin, Phone, Building2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    whatsapp_phone: "",
    google_maps_url: ""
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
          google_maps_url: data.google_maps_url || ""
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
        setMessage({ text: "Ajustes del perfil actualizados correctamente.", type: "success" });
      } else {
        setMessage({ text: "Hubo un error al actualizar.", type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Error de red.", type: "error" });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" /> Perfil Comercial
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mt-1">Configura el nombre, el Bio-link y los canales de contacto de tu negocio que tus clientes verán públicamente.</p>
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
                      <p className="text-xs text-slate-400 font-medium">Este será tu enlace público. Solo se permiten letras, números y guiones.</p>
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

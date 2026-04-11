"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Star, MapPin, Menu as MenuIcon, ChevronRight, Check, Phone } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import AIChatWidget from "@/components/AIChatWidget";

export default function PublicLanding({ params }: { params: { slug: string } }) {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadSent, setLeadSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/business/${params.slug}`);
        const data = await res.json();
        setBusiness(data);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [params.slug]);

  const handleAction = async (type: string) => {
    if (!business) return;
    await fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_id: business.id, type }),
    }).catch(() => {});

    if (type === "whatsapp") {
      const phone = business.whatsapp_phone || "34600000000";
      window.open(
        `https://wa.me/${phone.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(business.name)}%2C%20vengo%20de%20vuestra%20p%C3%A1gina%20y%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n.`,
        "_blank"
      );
    } else if (type === "review") {
      window.open("https://search.google.com/local/writereview?placeid=demo_id", "_blank");
    } else if (type === "location") {
      if (business.google_maps_url) {
        window.open(business.google_maps_url, "_blank");
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}`, "_blank");
      }
    }
  };

  const submitLead = async (e: any) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLeadSent(true);
    await handleAction("lead_form");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Negocio no encontrado</h1>
          <p className="text-slate-500">Comprueba que la URL es correcta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── SLOT 1: Banner superior (alta visibilidad) ── */}
      <div className="max-w-md mx-auto px-5 pt-6">
        <AdSlot
          adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || "0000000001"}
          format="banner"
          className="rounded-xl overflow-hidden"
        />
      </div>

      <div className="max-w-md mx-auto px-5 pt-4 pb-16 space-y-6 relative z-10">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mx-auto flex items-center justify-center text-3xl mb-4 border-4 border-slate-50">
            {business.profile_emoji || business.name?.charAt(0)?.toUpperCase() || "🏪"}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{business.name}</h1>
          {business.google_maps_url && (
            <p className="text-slate-500 text-sm font-medium mt-1">📍 {business.name}</p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          
          {/* WhatsApp - Primary CTA */}
          <button
            onClick={() => handleAction("whatsapp")}
            className="w-full group flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 overflow-hidden relative"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-widest opacity-70">Contactar ahora</div>
                <div className="text-lg font-bold">Escríbenos por WhatsApp</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-50 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
          </button>

          {/* AI Chat CTA */}
          <button
            onClick={() => setChatOpen(true)}
            className="w-full group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-xl">🤖</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Respuesta inmediata</div>
                <div className="text-base font-bold text-slate-800">Habla con nuestro Asistente IA</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Review */}
          <button
            onClick={() => handleAction("review")}
            className="w-full group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Tu opinión importa</div>
                <div className="text-base font-bold text-slate-800">Déjanos una reseña en Google</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Grid buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById("menu-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <MenuIcon className="w-5 h-5 text-slate-400 mb-3 group-hover:text-blue-600 transition-colors" />
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Carta</div>
              <div className="text-sm font-bold text-slate-800">Ver Menú</div>
            </button>
            <button 
              onClick={() => handleAction("location")}
              className="group p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <MapPin className="w-5 h-5 text-slate-400 mb-3 group-hover:text-blue-600 transition-colors" />
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Ubicación</div>
              <div className="text-sm font-bold text-slate-800">Cómo llegar</div>
            </button>
          </div>
        </div>

        {/* Lead Magnet */}
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl" />

          <div className="relative z-10 p-8">
            {!leadSent ? (
              <div className="space-y-5">
                <div>
                  <div className="text-2xl mb-2">{business.promo_emoji || "🎁"}</div>
                  <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                    {business.promo_title || "¡10% de descuento en tu próxima visita!"}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 font-medium">
                    {business.promo_description || "Déjanos tu WhatsApp y te enviamos el cupón al instante."}
                  </p>
                </div>
                <form onSubmit={submitLead} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Tu número de WhatsApp"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:bg-blue-700 transition-all"
                  >
                    Recibir cupón ahora →
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">¡Listo{name ? `, ${name}` : ""}!</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Te enviaremos el cupón por WhatsApp en unos segundos.
                  </p>
                </div>
                <button
                  onClick={() => handleAction("whatsapp")}
                  className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Catalog */}
        {business.products && business.products.length > 0 && (
          <div id="menu-section" className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden scroll-mt-6">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                Nuestros Productos
              </h2>
            </div>
            <div className="p-2 space-y-2">
              {business.products.map((p: any) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 tracking-tight leading-tight mb-1 truncate">{p.name}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{p.description}</p>
                  </div>
                  <div className="font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm shrink-0 shadow-sm border border-emerald-100/50">
                    {p.price.toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SLOT 2: Rectangle intermedio (alto RPM) ── */}
        <AdSlot
          adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECT || "0000000002"}
          format="rectangle"
          className="py-2"
        />

        {/* Footer */}
        <div className="text-center pt-4 pb-4">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.25em]">
            ⚡ Powered by AtendIA
          </p>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget 
        businessName={business.name} 
        businessSlug={business.slug}
        agentTone={business.agent_tone}
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
}

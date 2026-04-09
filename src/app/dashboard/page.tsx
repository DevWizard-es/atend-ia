"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  MessageCircle,
  Star,
  Users,
  Bell,
  Search,
  ExternalLink,
  QrCode,
  X
} from "lucide-react";

import QRCode from "react-qr-code";

export default function Dashboard() {
  const [showQR, setShowQR] = useState(false);
  const [slug, setSlug] = useState("pizzeria-roma");
  const bioLinkUrl = `http://localhost:3000/b/${slug}`;

  useEffect(() => {
    fetch("/api/agent/settings").then(r => r.json()).then(d => d.slug && setSlug(d.slug)).catch(() => {});
  }, []);

  const handleDownloadQR = () => {
    const svg = document.getElementById("BusinessQRCode");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white"; // Add white background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "Pizzeria-Roma-QR.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur sticky top-8 z-10 py-4 -my-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Gestiona tu negocio como un pro el día de hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar contactos o reseñas..."
              className="pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Leads Totales", value: "1,280", trend: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Conversaciones", value: "482", trend: "+8.2%", icon: MessageCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Google Rating", value: "4.9", trend: "+0.1", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Conversion Rate", value: "18.4%", trend: "+2.3%", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{kpi.value}</div>
            <div className="text-sm font-semibold text-slate-500 tracking-wide">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inbox Preview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recientes</h3>
            <a href="/inbox" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
              Ver todo el Inbox <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex-1">
            {[
              { author: "Maria Garcia", msg: "Hola, quisiera reservar una mesa para 4 personas hoy a las 20:30.", time: "Hace 5 min", status: "unread" },
              { author: "Juan Perez", msg: "¿Tenéis opciones sin gluten en el menú?", time: "Hace 12 min", status: "read" },
              { author: "Elena Rodriguez", msg: "Gracias por la atención, el servicio fue impecable.", time: "Hace 1 hora", status: "read" },
            ].map((msg, i) => (
              <div key={i} className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 ${msg.status === 'unread' ? 'bg-blue-50/20' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold shadow-sm ${msg.status === 'unread' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {msg.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm truncate">{msg.author}</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1 leading-relaxed">{msg.msg}</p>
                </div>
                {msg.status === 'unread' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse mt-1.5 shadow-[0_0_10px_rgba(0,82,255,0.4)]"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Reputation Tool */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative group">
            <div className="relative z-10">
              <Star className="w-8 h-8 opacity-50 mb-4" />
              <h3 className="text-xl font-black mb-2 leading-tight tracking-tight">Eleva tu reputación</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">Incrementa tus reseñas positivas en Google Maps automáticamente mediante tu enlace de reservas QR.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowQR(true)}
                  className="flex-1 bg-white text-blue-600 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Ver Mi QR
                </button>
                <button 
                  onClick={() => window.open(bioLinkUrl, "_blank")}
                  className="flex-1 bg-white/20 backdrop-blur-md text-white py-3 rounded-2xl font-bold text-sm hover:bg-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Enviar Link
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Sugerencia de IA</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-2">Para: Reseña de Maria L.</p>
              <p className="text-sm text-slate-600 italic leading-relaxed">"Muchas gracias por tu visita Maria, nos alegra que disfrutaras de la cena. ¡Esperamos verte pronto!"</p>
            </div>
            <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
              Aprobar y Responder
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowQR(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-auto flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">QR de tu negocio</h2>
              <p className="text-sm font-medium text-slate-500">Imprime este código y colócalo en tus mesas o escaparate.</p>
            </div>
            <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-inner flex items-center justify-center">
               <QRCode 
                 id="BusinessQRCode"
                 value={bioLinkUrl} 
                 size={220} 
                 level="H"
               />
            </div>
            <button 
               onClick={handleDownloadQR}
               className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" /> Descargar QR Listo para Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

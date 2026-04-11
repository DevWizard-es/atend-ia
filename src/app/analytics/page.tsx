"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  MousePointer2,
  Clock,
  BarChart3,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    leads: 0,
    conversations: 0,
    rating: "0.0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setStats({
            leads: d.leads || 0,
            conversations: d.conversations || 0,
            rating: d.rating || "0.0",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const kpis = [
    { label: "Leads Totales", value: loading ? "..." : String(stats.leads), change: null, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversaciones", value: loading ? "..." : String(stats.conversations), change: null, icon: MessageCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Rating Google", value: loading ? "..." : stats.rating, change: null, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 font-medium">Métricas de rendimiento de tu negocio en tiempo real.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4" /> Últimos 30 días <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Reporte PDF
          </button>
        </div>
      </header>

      {/* Real KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full bg-slate-50 text-slate-400">
                REAL
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Captación de Leads</h3>
            <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100">Próximamente</div>
          </div>
          <div className="h-64 flex items-center justify-center flex-col gap-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <BarChart3 className="w-12 h-12 text-slate-300" />
            <div>
              <p className="font-black text-slate-500">Gráfico de evolución de leads</p>
              <p className="text-sm text-slate-400 mt-1">Disponible en breve. ¡Sigue acumulando datos!</p>
            </div>
          </div>
        </div>

        {/* Response Efficiency */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Eficiencia de Respuesta</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">IA 24/7</div>
                <div className="text-sm font-bold text-slate-500 mt-1">Asistente IA siempre disponible</div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Respuesta Inmediata ⭐</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">Conversaciones activas</span>
                <span className="font-black text-slate-900">{loading ? "..." : stats.conversations}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: stats.conversations > 0 ? "100%" : "0%" }} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">Leads captados</span>
                <span className="font-black text-slate-900">{loading ? "..." : stats.leads}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: stats.leads > 0 ? "100%" : "0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-blue-400" /> Fuentes de Tráfico
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">QR (mesas / escaparate)</span>
                <span className="text-sm font-black text-blue-300">Activo</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">BioLink compartido</span>
                <span className="text-sm font-black text-blue-300">Activo</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Buscadores (SEO)</span>
                <span className="text-sm font-black text-amber-300">Próximamente</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
          <div className="p-4 bg-blue-50 w-fit mx-auto rounded-full mb-6">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Tu Negocio Crece con AtendIA</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Cada lead captado, cada conversación respondida y cada reseña conseguida incrementa tu visibilidad local.
          </p>
          <a href="/agent" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all inline-block">
            Configurar Agente IA
          </a>
        </div>
      </div>
    </div>
  );
}

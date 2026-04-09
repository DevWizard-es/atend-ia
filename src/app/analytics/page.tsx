"use client";

import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MousePointer2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Leads Totales", value: "1,284", change: "+12.5%", isUp: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Clics WhatsApp", value: "856", change: "+8.2%", isUp: true, icon: MessageCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Rating Google", value: "4.9", change: "+0.1", isUp: true, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Reseñas Nuevas", value: "42", change: "+18%", isUp: true, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 font-medium">Métricas de rendimiento para dueños y agencias.</p>
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

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full", stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts & Main Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Generation Chart Mockup */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Captación de Leads</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 bg-primary-DEFAULT rounded-full"></span> WhatsApp
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 bg-slate-200 rounded-full"></span> Web Widget
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 60, 40, 80, 55, 90, 70, 95, 65, 85, 50, 75].map((val, i) => (
              <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                <div 
                  className="bg-blue-500/30 rounded-t-lg group-hover:bg-blue-500/50 transition-all cursor-pointer w-full" 
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val} leads
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-tighter mt-2">
                  {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency & Response Time */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Eficiencia de Respuesta</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Clock className="w-8 h-8 text-primary-DEFAULT" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">12 min</div>
                <div className="text-sm font-bold text-slate-500 mt-1">Tiempo de Respuesta Promedio</div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Velocidad Ideal ⭐</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">Mensajes Contestados</span>
                <span className="font-black text-slate-900">98%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-DEFAULT h-full w-[98%] shadow-[0_0_10px_rgba(0,82,255,0.3)]"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">Leads Convertidos</span>
                <span className="font-black text-slate-900">24%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[24%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-primary-light" /> Fuente de Tráfico
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Google Maps QR</span>
                <span className="text-sm font-black text-primary-light">65% del tráfico</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Widget Web</span>
                <span className="text-sm font-black text-blue-200">25% del tráfico</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Instagram Direct</span>
                <span className="text-sm font-black text-indigo-200">10% del tráfico</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-primary-DEFAULT/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
            <div className="p-4 bg-primary-DEFAULT/5 w-fit mx-auto rounded-full mb-6">
                <TrendingUp className="w-8 h-8 text-primary-DEFAULT" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Salud del Negocio: Excelente</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">Tu reputación y captación están en el top 5% de tu sector. Sigue así para dominar tu área local.</p>
            <button className="px-6 py-3 bg-primary-DEFAULT text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-DEFAULT/25 hover:bg-primary-dark transition-all">
                Ver Recomendaciones Estratégicas
            </button>
        </div>
      </div>
    </div>
  );
}

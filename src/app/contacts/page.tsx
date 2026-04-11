"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  Star,
  MoreVertical,
  UserCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  hot: { label: "Caliente", color: "text-rose-600 bg-rose-50 border-rose-100" },
  warm: { label: "Tibio", color: "text-amber-600 bg-amber-50 border-amber-100" },
  cold: { label: "Frío", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setContacts(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Contactos & Leads</h1>
          <p className="text-slate-500 font-medium">Base de datos de clientes y prospectos.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Contacto
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Contactos", value: "1,280", icon: Users, color: "text-blue-600", bg: "bg-blue-50", change: "+12 esta semana" },
          { label: "Leads Activos", value: "384", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", change: "+8 nuevos hoy" },
          { label: "Tasa de Conversión", value: "18.4%", icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50", change: "+2.1% este mes" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500">{stat.label}</div>
              <div className="text-xs text-emerald-600 font-bold mt-0.5">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Todos los Contactos</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-72 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="text-left p-4 pl-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                <th className="text-left p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Teléfono</th>
                <th className="text-left p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Origen</th>
                <th className="text-left p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Visitas</th>
                <th className="text-left p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="text-left p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Última Interacción</th>
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(contact => (
                <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{contact.name}</div>
                        <div className="flex gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < contact.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{contact.phone}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {contact.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-black text-slate-900">{contact.visits}</span>
                    <span className="text-xs text-slate-400 ml-1">visitas</span>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", statusConfig[contact.status as keyof typeof statusConfig].color)}>
                      {statusConfig[contact.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wide">{contact.lastInteraction}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all" title="Llamar">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Mostrando {filtered.length} de {contacts.length} contactos</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={cn("w-8 h-8 rounded-lg font-bold transition-all", n === 1 ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-600")}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setReviews(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Reviews & Reputation</h1>
          <p className="text-slate-500 font-medium">Gestiona lo que el mundo dice de tu negocio.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-100 text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button className="px-5 py-2.5 bg-primary-DEFAULT text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-DEFAULT/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Solicitar Reseña
          </button>
        </div>
      </header>

      {/* Stats Grid — computed from real reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-500">Rating Promedio</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {loading ? "..." : reviews.length > 0
              ? `${(reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)} / 5`
              : "— / 5"
            }
          </div>
          <p className="text-xs text-slate-400 font-bold mt-2">
            {reviews.length > 0 ? `Basado en ${reviews.length} reseña${reviews.length > 1 ? "s" : ""}` : "Sin reseñas aún"}
          </p>
        </div>

        {/* Response rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-500">Reseñas Respondidas</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {loading ? "..." : reviews.length > 0
              ? `${reviews.filter((r: any) => r.status === "replied" || r.status === "responded").length} / ${reviews.length}`
              : "0 / 0"
            }
          </div>
          <p className="text-xs text-slate-400 font-bold mt-2">
            {reviews.length > 0
              ? `${Math.round((reviews.filter((r: any) => r.status === "replied" || r.status === "responded").length / reviews.length) * 100)}% de respuesta`
              : "Objetivo: responder todas"
            }
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-500">Pendientes de Respuesta</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {loading ? "..." : reviews.filter((r: any) => r.status === "pending" || !r.status || r.status === "").length}
          </div>
          <p className="text-xs text-slate-400 font-bold mt-2">
            {reviews.filter((r: any) => r.status === "pending" || !r.status || r.status === "").length > 0
              ? "¡Respóndelas para mejorar tu reputación!"
              : "¡Todas respondidas! 🎉"
            }
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="text-sm font-black text-slate-900 border-b-2 border-primary-DEFAULT pb-1">Todas</button>
            <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Pendientes</button>
            <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Respondidas</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar reseña..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-64 focus:bg-white focus:border-primary-DEFAULT outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 divide-y divide-slate-50">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-all flex gap-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                {(review.author_name || "U").charAt(0)}
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{review.author_name || "Cliente Anónimo"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{review.source || "Google Maps"}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : "Reciente"}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                  {review.comment}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  {review.status === "pending" ? (
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                         Responder con IA
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
                        Escribir manual
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-extrabold uppercase tracking-wide">Respondida</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors h-fit">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

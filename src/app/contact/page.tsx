"use client";

import Link from "next/link";
import { Mail, Code2, Linkedin, ArrowLeft, Zap } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
          {/* Top gradient banner */}
          <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
            {/* AtendIA badge */}
            <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full border border-white/20">
              <Zap className="w-3 h-3 text-yellow-300 fill-current" />
              <span className="text-white text-[10px] font-black tracking-widest uppercase">AtendIA</span>
            </div>
          </div>

          {/* Avatar */}
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/30 border-4 border-white">
                YA
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yordan de Armas</h1>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Backend Engineer</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Creador y desarrollador de <strong className="text-slate-700">AtendIA</strong> — la plataforma que ayuda a los negocios locales a crecer, captar leads y gestionar su reputación online de forma automática.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-6" />

            {/* Contact options */}
            <div className="space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contactar</p>

              <a
                href="mailto:yordandearmas@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Email</div>
                  <div className="text-sm font-bold text-slate-800">yordandearmas@gmail.com</div>
                </div>
              </a>
            </div>

            {/* Footer note */}
            <p className="text-xs text-slate-400 text-center mt-8 font-medium">
              ⚡ Hecho con pasión · AtendIA © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

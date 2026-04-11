"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Email enviado</h1>
            <p className="text-slate-500 font-medium mt-2 leading-relaxed">
              Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña en unos minutos.
            </p>
          </div>
          <Link 
            href="/login" 
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold block transition-all hover:bg-slate-800"
          >
            Volver al inicio de sesión
          </Link>
          <p className="text-xs text-slate-400 font-medium">
            ¿No recibiste nada? Revisa tu carpeta de spam o intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al login
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="text-2xl font-black mb-8">
            Atend<span className="text-blue-600">IA</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Introduce tu email y te enviaremos un enlace para que puedas crear una nueva.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email de tu cuenta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="hola@minegocio.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar enlace →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

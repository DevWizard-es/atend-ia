"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, XCircle, RefreshCw, ArrowRight } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const error = params.get("error");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", { method: "POST" });
      setResent(true);
    } catch (_) {}
    setResending(false);
  };

  if (error === "invalid" || error === "expired") {
    return (
      <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-xl p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <XCircle className="w-9 h-9 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {error === "expired" ? "Enlace caducado" : "Enlace inválido"}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {error === "expired"
              ? "Este enlace de verificación ha caducado (24h). Solicita uno nuevo."
              : "El enlace no es válido o ya fue utilizado."}
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={resending || resent}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
          {resent ? "¡Email enviado!" : resending ? "Enviando..." : "Reenviar email de verificación"}
        </button>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors block">
          Volver al dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Verifica tu correo</h1>
        <p className="text-blue-100 font-medium mt-1 text-sm">Un paso más para activar tu cuenta</p>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-slate-700 font-medium text-sm leading-relaxed">
            Te hemos enviado un email de verificación. Ábrelo y pulsa <strong>"Verificar mi cuenta"</strong> para activar tu perfil.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">¿No te llegó?</p>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">·</span>Revisa tu carpeta de <strong>Spam o Promociones</strong></li>
            <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">·</span>El enlace caduca en <strong>24 horas</strong></li>
          </ul>
        </div>

        <button
          onClick={handleResend}
          disabled={resending || resent}
          className="w-full py-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
          {resent ? "✅ ¡Email reenviado!" : resending ? "Enviando..." : "Reenviar email de verificación"}
        </button>

        <Link href="/dashboard" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          Ir al dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-9 h-9 text-blue-500" />
          </div>
          <p className="text-slate-500 font-medium">Cargando...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}

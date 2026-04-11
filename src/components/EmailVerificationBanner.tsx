"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, X, RefreshCw, CheckCircle2 } from "lucide-react";

export default function EmailVerificationBanner({ email }: { email: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  if (dismissed) return null;

  const handleResend = async () => {
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", { method: "POST" });
      setResent(true);
    } catch (_) {}
    setResending(false);
  };

  return (
    <div className="mx-4 mt-4 mb-0 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-4">
      <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        <Mail className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-800">Verifica tu correo electrónico</p>
        <p className="text-xs text-amber-600 font-medium mt-0.5 leading-relaxed">
          Hemos enviado un enlace a <strong>{email}</strong>. Verifica tu cuenta para desbloquear todas las funciones.
        </p>
        <div className="flex items-center gap-3 mt-3">
          {resent ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Email reenviado!
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-70"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Enviando..." : "Reenviar email"}
            </button>
          )}
          <Link
            href="/verify-email"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Más información →
          </Link>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

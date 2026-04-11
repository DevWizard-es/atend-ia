"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token de restablecimiento no encontrado.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer la contraseña.");

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-xl p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-9 h-9 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Token inválido</h1>
        <p className="text-slate-500 font-medium">Falta el token de seguridad o ha caducado.</p>
        <Link href="/forgot-password" title="Solicitar enlace" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold block transition-all hover:bg-slate-800">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-100 shadow-xl p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contraseña restablecida</h1>
          <p className="text-slate-500 font-medium mt-2">Tu contraseña se ha cambiado correctamente. Redirigiendo al login...</p>
        </div>
        <Link href="/login" className="flex items-center justify-center gap-2 text-blue-600 font-bold hover:underline">
          Ir al login ahora <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
      <div className="text-2xl font-black mb-8">
        Atend<span className="text-blue-600">IA</span>
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-2">Nueva contraseña</h1>
      <p className="text-slate-500 font-medium mb-8 leading-relaxed">Crea una contraseña segura para tu cuenta.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Contraseña nueva</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
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
              Restableciendo...
            </>
          ) : (
            "Actualizar contraseña →"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-slate-400 font-bold">Cargando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

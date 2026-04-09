"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Check, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const planDetails: Record<string, { name: string; price: string; color: string }> = {
  básico: { name: "Plan Básico", price: "49€/mes", color: "bg-slate-100 text-slate-700 border-slate-200" },
  premium: { name: "Plan Premium", price: "99€/mes", color: "bg-blue-50 text-blue-700 border-blue-200" },
  agencia: { name: "Plan Agencia", price: "249€/mes", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
};

const STRIPE_LINKS: Record<string, string> = {
  básico: "https://buy.stripe.com/test_aFaeVd2sX0Pte7R2ndbII00",
  premium: "https://buy.stripe.com/test_aFa6oH0kP2XB9RB7HxbII01",
  agencia: "https://buy.stripe.com/test_dRm4gz1oT69NfbV1j9bII03", // placeholder logic
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "premium";
  const plan = planDetails[planKey] || planDetails["premium"];

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", business: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth registration
    await new Promise(r => setTimeout(r, 1000));
    
    // Get Stripe Link
    // Open Stripe in new tab for the MVP payment flow
    const stripeUrl = STRIPE_LINKS[planKey] || STRIPE_LINKS["premium"];
    const finalUrl = `${stripeUrl}?prefilled_email=${encodeURIComponent(form.email || "")}`;
    window.open(finalUrl, "_blank");

    // Redirect to Dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200 p-8">
          {/* Logo */}
          <div className="text-2xl font-black mb-6">
            Atend<span className="text-blue-600">IA</span>
          </div>

          {/* Plan badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-6 ${plan.color}`}>
            <Zap className="w-3.5 h-3.5" />
            {plan.name} — {plan.price}
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-2">Crea tu cuenta</h1>
          <p className="text-slate-500 font-medium mb-8">14 días gratis, sin tarjeta de crédito.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Tu nombre</label>
              <input
                type="text"
                required
                placeholder="María García"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nombre del negocio</label>
              <input
                type="text"
                required
                placeholder="Pizzería Roma"
                value={form.business}
                onChange={e => setForm({ ...form, business: e.target.value })}
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="hola@minegocio.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta gratis →"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Sin tarjeta de crédito requerida
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> 14 días gratis incluidos
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Cancela cuando quieras
            </div>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

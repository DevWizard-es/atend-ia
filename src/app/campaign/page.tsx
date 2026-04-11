"use client";

import { useState, useEffect } from "react";
import { Megaphone, Save, CheckCircle2, Eye, Gift, MessageSquare, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const EMOJI_OPTIONS = ["🎁", "🔥", "💥", "🎉", "⚡", "🌟", "🏷️", "🎯", "💰", "🤩", "🥳", "🛍️"];

export default function CampaignPage() {
  const [promoEmoji, setPromoEmoji] = useState("🎁");
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/agent/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.promo_emoji) setPromoEmoji(d.promo_emoji);
        if (d.promo_title) setPromoTitle(d.promo_title);
        if (d.promo_description) setPromoDescription(d.promo_description);
        if (d.slug) setSlug(d.slug);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/agent/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promo_emoji: promoEmoji,
          promo_title: promoTitle || "¡10% de descuento en tu próxima visita!",
          promo_description: promoDescription || "Déjanos tu WhatsApp y te enviamos el cupón al instante.",
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (_) {}
    setIsSaving(false);
  };

  const bioLinkUrl = origin && slug ? `${origin}/b/${slug}` : "";
  const previewTitle = promoTitle || "¡10% de descuento en tu próxima visita!";
  const previewDesc = promoDescription || "Déjanos tu WhatsApp y te enviamos el cupón al instante.";

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur sticky top-8 z-10 py-4 -my-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-600" /> Campaña Activa
          </h1>
          <p className="text-slate-500 font-medium">Edita la promoción que ven tus clientes en el BioLink.</p>
        </div>
        <div className="flex items-center gap-3">
          {bioLinkUrl && (
            <Link
              href={bioLinkUrl}
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" /> Ver BioLink
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar Campaña"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          {/* Emoji Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" /> Emoji / Icono
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setPromoEmoji(e)}
                  className={`text-2xl p-3 rounded-2xl transition-all hover:scale-110 ${
                    promoEmoji === e
                      ? "bg-blue-50 border-2 border-blue-500 shadow-md shadow-blue-100"
                      : "bg-slate-50 border-2 border-transparent hover:border-slate-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" /> Título de la Oferta
            </h3>
            <input
              type="text"
              value={promoTitle}
              onChange={(e) => setPromoTitle(e.target.value)}
              maxLength={80}
              placeholder="¡10% de descuento en tu próxima visita!"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 font-medium">{promoTitle.length}/80 caracteres</p>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Descripción / CTA
            </h3>
            <textarea
              rows={3}
              value={promoDescription}
              onChange={(e) => setPromoDescription(e.target.value)}
              maxLength={150}
              placeholder="Déjanos tu WhatsApp y te enviamos el cupón al instante."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
            />
            <p className="text-xs text-slate-400 font-medium">{promoDescription.length}/150 caracteres</p>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 space-y-3">
            <h3 className="font-black text-slate-700 text-sm">💡 Consejos para más conversiones</h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" /> Usa descuentos concretos (10%, 2x1, envío gratis)</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" /> Añade urgencia: "Solo este fin de semana" o "Últimas plazas"</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" /> El emoji capta la atención antes de leer el texto</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" /> Cambia la campaña cada semana para mantener el interés</li>
            </ul>
          </div>
        </div>

        {/* Live Preview */}
        <div className="sticky top-28 space-y-4">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Vista previa en vivo</div>
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl" />

            <div className="relative z-10 p-8 space-y-5">
              <div>
                <div className="text-3xl mb-3">{promoEmoji}</div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                  {previewTitle}
                </h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">{previewDesc}</p>
              </div>
              <div className="space-y-3">
                <input
                  disabled
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                />
                <input
                  disabled
                  placeholder="Tu número de WhatsApp"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                />
                <div className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest text-center shadow-lg shadow-blue-600/30">
                  Recibir cupón ahora →
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">Así se ve en el BioLink de tus clientes</p>
        </div>
      </div>
    </div>
  );
}

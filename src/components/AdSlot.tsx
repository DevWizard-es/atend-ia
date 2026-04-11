"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  /** Slot ID de Google AdSense (lo obtienes en tu panel de AdSense) */
  adSlot: string;
  /** ID único del pub de AdSense: "ca-pub-XXXXXXXXXXXXXXXXX" */
  adClient?: string;
  /** Formato del anuncio */
  format?: "banner" | "rectangle" | "auto";
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

// ─────────────────────────────────────────────
// INSTRUCCIONES PARA ACTIVAR ADSENSE:
//
// 1. Crea una cuenta en https://adsense.google.com
// 2. Añade tu sitio (tu URL de Render, ej: atend-ia.onrender.com)
// 3. Google revisará tu sitio (~1-3 días)
// 4. Una vez aprobado, ve a "Anuncios" → "Por unidad de anuncio"
// 5. Crea unidades de tipo "Anuncio de display"
// 6. Copia tu Publisher ID (ca-pub-XXXX) y el Slot ID
// 7. Pégalos en la variable de entorno NEXT_PUBLIC_ADSENSE_CLIENT
//    y en la prop adSlot de cada <AdSlot /> en la bio-link
// ─────────────────────────────────────────────

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5634358982750683";

const FORMAT_STYLES: Record<string, React.CSSProperties> = {
  banner: { display: "block", width: "100%", height: "60px" },
  rectangle: { display: "block", width: "300px", height: "250px", margin: "0 auto" },
  auto: { display: "block" },
};

export default function AdSlot({ adSlot, adClient, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  const client = adClient || ADSENSE_CLIENT;

  // No mostrar en desarrollo o si no hay publisher ID real
  const isDemo = client.includes("XXXXXXXX");

  useEffect(() => {
    if (isDemo || initialized.current) return;
    initialized.current = true;

    try {
      // Pushea el ad slot al array de AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      // AdSense aún no cargado — ignorar
    }
  }, [isDemo]);

  // ── PLACEHOLDER en desarrollo / sin AdSense configurado ──
  if (isDemo) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-slate-100/60 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest select-none ${className}`}
        style={{ minHeight: format === "rectangle" ? "120px" : "56px" }}
      >
        <span>🎯 Espacio publicitario · Configurar AdSense</span>
      </div>
    );
  }

  // ── SLOT DE ADSENSE REAL ──
  return (
    <div className={`overflow-hidden ${className}`}>
      <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest text-center mb-1">
        Publicidad
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={FORMAT_STYLES[format]}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}

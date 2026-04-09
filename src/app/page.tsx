"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MessageCircle, Star, BarChart3, Users, Shield, Zap, Check,
  ArrowRight, ChevronRight, Menu, X, Globe, QrCode, Inbox, TrendingUp
} from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "49",
    period: "/mes",
    description: "Ideal para negocios que empiezan a crecer online.",
    color: "border-slate-200",
    badge: null,
    features: [
      "1 negocio / ubicación",
      "Página bio-link personalizada",
      "Captación de leads por WhatsApp",
      "Bandeja de mensajes básica",
      "Gestión de reseñas Google",
      "Analytics básico",
      "Soporte por email",
    ],
    cta: "Empezar gratis 14 días",
    ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    name: "Premium",
    price: "99",
    period: "/mes",
    description: "Para negocios que quieren dominar su área local.",
    color: "border-blue-500 ring-2 ring-blue-500 ring-offset-2",
    badge: "Más popular",
    features: [
      "Hasta 3 negocios / ubicaciones",
      "Página bio-link con QR personalizado",
      "Captación ilimitada de leads",
      "Inbox completo estilo WhatsApp",
      "Respuestas automáticas con IA",
      "Analytics avanzado + exportación PDF",
      "Campañas de fidelización",
      "Soporte prioritario 24/7",
    ],
    cta: "Empezar gratis 14 días",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30",
  },
  {
    name: "Agencia",
    price: "249",
    period: "/mes",
    description: "Gestiona múltiples clientes desde un panel centralizado.",
    color: "border-slate-200",
    badge: null,
    features: [
      "Negocios ilimitados",
      "Panel multi-cliente centralizado",
      "Marca blanca (white-label)",
      "API de integración",
      "Reportes automáticos para clientes",
      "IA entrenada por vertical",
      "Gestor de cuenta dedicado",
      "SLA garantizado 99.9%",
    ],
    cta: "Hablar con ventas",
    ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
  },
];

const features = [
  { icon: Globe, title: "Bio-Link Profesional", desc: "Una página pública con QR para que tus clientes te contacten, te dejen reseñas o vean tu menú. Todo desde un solo link.", color: "bg-blue-50 text-blue-600" },
  { icon: Inbox, title: "Inbox Unificado", desc: "Todas las conversaciones de WhatsApp y web en un solo lugar. Responde rápido y nunca pierdas un lead.", color: "bg-indigo-50 text-indigo-600" },
  { icon: Star, title: "Gestión de Reseñas", desc: "Solicita reseñas en Google automáticamente. Responde con IA. Eleva tu rating y atrae más clientes.", color: "bg-amber-50 text-amber-600" },
  { icon: TrendingUp, title: "Analytics & Reportes", desc: "Métricas claras de captación, conversión y reputación. Exporta informes PDF para tus clientes.", color: "bg-emerald-50 text-emerald-600" },
  { icon: QrCode, title: "Campañas QR", desc: "Genera QRs únicos para mesas, tarjetas y escaparates. Rastreo de clics en tiempo real.", color: "bg-purple-50 text-purple-600" },
  { icon: Zap, title: "Respuestas con IA", desc: "La IA aprende de tu negocio y responde preguntas frecuentes automáticamente, 24/7.", color: "bg-rose-50 text-rose-600" },
];

const testimonials = [
  { name: "Laura Gómez", role: "Dueña · Cafetería El Rincón", avatar: "L", quote: "En 2 semanas pasé de 3.8 a 4.7 en Google. Los clientes ahora me escriben directamente por WhatsApp gracias al QR en las mesas.", stars: 5 },
  { name: "Carlos Mendoza", role: "Propietario · Taller AutoPro", avatar: "C", quote: "La bandeja unificada me cambió la vida. Antes perdía leads porque no me enteraba. Ahora respondo en minutos y mi conversión subió un 30%.", stars: 5 },
  { name: "Ana Ruiz", role: "Directora · Clínica DentalPlus", avatar: "A", quote: "Como agencia gestionamos 8 clientes. El panel multi-cuenta es perfecto y los reportes PDF nos ahorran horas cada mes.", stars: 5 },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Atend<span className="text-blue-600">IA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Funcionalidades</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Precios</a>
            <a href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Testimonios</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/signup" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Prueba gratis 14 días →
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2 border-t border-slate-100 pt-4">
            <Link href="/login" className="block py-2 text-sm font-bold text-slate-700">Iniciar sesión</Link>
            <Link href="/signup" className="block py-2 px-4 bg-blue-600 text-white rounded-xl text-sm font-bold text-center">Prueba gratis 14 días</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl -mr-64 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl -ml-40" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-bold mb-8">
            <Zap className="w-4 h-4" />
            Más de 500 negocios ya usan AtendIA
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Consigue más clientes.<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestiona tu reputación.
            </span>
          </h1>

          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            La plataforma all-in-one para negocios locales. Captura leads por WhatsApp,
            mejora tus reseñas en Google y gestiona todos tus mensajes desde un único lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]">
              Empieza gratis 14 días <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/b/pizzeria-roma" target="_blank" className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all">
              Ver demo en vivo <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-400 font-medium">
            Sin tarjeta de crédito · Configuración en 5 minutos · Cancela cuando quieras
          </p>

          {/* Hero Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-200 bg-slate-50">
              <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 bg-white rounded-md h-4 max-w-xs" />
              </div>
              <div className="grid grid-cols-4 h-[360px]">
                <div className="col-span-1 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                  <div className="text-lg font-black mb-4">Atend<span className="text-blue-600">IA</span></div>
                  {["Dashboard", "Inbox", "Reviews", "Contacts", "Analytics"].map(item => (
                    <div key={item} className={`px-3 py-2 rounded-xl text-sm font-semibold ${item === "Dashboard" ? "bg-blue-50 text-blue-600" : "text-slate-500"}`}>{item}</div>
                  ))}
                </div>
                <div className="col-span-3 p-6 bg-white">
                  <div className="text-2xl font-black mb-4">Dashboard</div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[["1,280", "Leads Totales"], ["4.9★", "Google Rating"], ["482", "Mensajes"], ["18.4%", "Conversión"]].map(([v, l]) => (
                      <div key={l} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xl font-black text-slate-900">{v}</div>
                        <div className="text-xs text-slate-500 font-semibold">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-black mb-2">Conversaciones recientes</div>
                    {["María García", "Juan Pérez", "Elena Rodríguez"].map((name) => (
                      <div key={name} className="flex items-center gap-2 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{name[0]}</div>
                        <div className="text-xs text-slate-600 font-medium">{name}</div>
                        <div className="ml-auto text-xs text-slate-400">Hoy</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-8 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span>🍕 Restaurantes</span>
          <span>🦷 Clínicas Dentales</span>
          <span>🔧 Talleres</span>
          <span>💅 Peluquerías</span>
          <span>🏋️ Gimnasios</span>
          <span>🛁 Spas & Estética</span>
          <span>🏡 Inmobiliarias</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Todo lo que necesita tu negocio</h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
              Herramientas pensadas para dueños de negocios locales que quieren crecer sin complicaciones.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-slate-50/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-3">Lo que dicen nuestros clientes</h2>
            <p className="text-slate-500 font-medium">Negocios reales, resultados reales.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-7 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Precios simples y transparentes</h2>
            <p className="text-lg text-slate-500 font-medium">14 días gratis. Sin tarjeta de crédito.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative p-8 bg-white rounded-3xl border-2 ${plan.color} flex flex-col`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/30">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-lg font-black text-slate-900 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-black tracking-tight">{plan.price}€</span>
                    <span className="text-slate-500 font-bold pb-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Agencia" ? "/signup?plan=agencia" : `/signup?plan=${plan.name.toLowerCase()}`}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-3">¿Listo para crecer?</h2>
              <p className="text-blue-100 font-medium mb-8 max-w-lg mx-auto">
                Únete a más de 500 negocios locales que ya gestionan su captación y reputación con AtendIA.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl">
                Empezar gratis ahora <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-blue-200 text-sm mt-4 font-medium">Sin tarjeta de crédito · 14 días gratis · Cancela cuando quieras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-black">Atend<span className="text-blue-600">IA</span></div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contacto</a>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2026 AtendIA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

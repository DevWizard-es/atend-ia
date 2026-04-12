"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Star, BarChart3, Users, Shield, Zap, Check,
  ArrowRight, ChevronRight, Menu, X, Globe, QrCode, Inbox, TrendingUp
} from "lucide-react";
import AdBanner from "@/components/AdBanner";

const features = [
  { icon: Globe, title: "Bio-Link Profesional", desc: "Una página pública con QR para que tus clientes te contacten, te dejen reseñas o vean tu menú. Todo desde un solo link.", color: "bg-emerald-50 text-emerald-600" },
  { icon: Inbox, title: "Inbox Unificado", desc: "Todas las conversaciones de WhatsApp y web en un solo lugar. Responde rápido y nunca pierdas un lead.", color: "bg-teal-50 text-teal-600" },
  { icon: Star, title: "Gestión de Reseñas", desc: "Solicita reseñas en Google automáticamente. Responde con IA. Eleva tu rating y atrae más clientes.", color: "bg-amber-50 text-amber-600" },
  { icon: TrendingUp, title: "Analytics & Reportes", desc: "Métricas claras de captación, conversión y reputación. Exporta informes PDF para tus clientes.", color: "bg-green-50 text-green-600" },
  { icon: QrCode, title: "Campañas QR", desc: "Genera QRs únicos para mesas, tarjetas y escaparates. Rastreo de clics en tiempo real.", color: "bg-emerald-50 text-emerald-600" },
  { icon: Zap, title: "Respuestas con IA", desc: "La IA aprende de tu negocio y responde preguntas frecuentes automáticamente, 24/7.", color: "bg-lime-50 text-lime-600" },
];

const testimonials = [
  { name: "Laura Gómez", role: "Dueña · Cafetería El Rincón", avatar: "L", quote: "En 2 semanas pasé de 3.8 a 4.7 en Google. Los clientes ahora me escriben directamente por WhatsApp gracias al QR en las mesas.", stars: 5 },
  { name: "Carlos Mendoza", role: "Propietario · Taller AutoPro", avatar: "C", quote: "La bandeja unificada me cambió la vida. Antes perdía leads porque no me enteraba. Ahora respondo en minutos y mi conversión subió un 30%.", stars: 5 },
  { name: "Ana Ruiz", role: "Directora · Clínica DentalPlus", avatar: "A", quote: "Pensé que algo así costaría una fortuna. Que sea completamente gratis y funcione tan bien es increíble. Lo recomiendo a todos mis contactos.", stars: 5 },
];

const howItWorks = [
  { step: "01", title: "Crea tu cuenta gratis", desc: "Regístrate en menos de 2 minutos. Sin tarjeta. Sin letra pequeña. Gratis para siempre.", icon: "🚀" },
  { step: "02", title: "Configura tu negocio", desc: "Añade tu menú, foto, número de WhatsApp y enlace a Google Maps. Listo en 5 minutos.", icon: "⚙️" },
  { step: "03", title: "Comparte tu Bio-Link", desc: "Imprime el QR para tus mesas o comparte el link en redes. Tus clientes te encontrarán al instante.", icon: "🔗" },
  { step: "04", title: "Crece sin límites", desc: "Gestiona tu reputación, responde mensajes y analiza el crecimiento de tu negocio. Todo gratis.", icon: "📈" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<{authenticated: boolean; businessName?: string; email?: string; slug?: string; profileEmoji?: string;} | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(setAuthState)
      .catch(() => setAuthState({ authenticated: false }));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    setAuthState({ authenticated: false });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-1">
            Guarapo<span className="text-emerald-600">IA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cómo funciona</a>
            <a href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Testimonios</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {authState === null ? null : authState.authenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black">
                    {authState.profileEmoji || (authState.businessName?.substring(0, 2).toUpperCase() ?? "MI")}
                  </div>
                  <span className="text-sm font-bold text-slate-800">{authState.businessName || "Mi Negocio"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/signup" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                  Empezar gratis →
                </Link>
              </>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-6 pb-6 space-y-4 border-t border-slate-100 pt-4 overflow-hidden bg-white"
            >
              <div className="flex flex-col gap-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-600">Funcionalidades</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-600">Cómo funciona</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-600">Testimonios</a>
              </div>
              <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                {authState?.authenticated ? (
                  <>
                    <Link href="/dashboard" className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl text-center font-bold">Panel de Control</Link>
                    <button onClick={handleLogout} className="w-full py-3 text-red-500 font-bold">Cerrar sesión</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full py-3 text-slate-900 rounded-xl text-center font-bold border border-slate-200">Iniciar sesión</Link>
                    <Link href="/signup" className="w-full py-3 bg-emerald-600 text-white rounded-xl text-center font-bold shadow-lg">Empezar gratis</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-50/50 to-transparent rounded-full blur-3xl -z-10" />
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-black mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              100% Gratis — Sin tarjeta de crédito, para siempre
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">
              Consigue más clientes.<br />
              <span className="text-emerald-600">Gestiona tu reputación.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              La plataforma todo-en-uno que conecta tu negocio con clientes locales,
              mejora tus reseñas en Google y gestiona todos tus mensajes desde un único lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/40 hover:bg-emerald-700 hover:scale-105 transition-all">
                Empezar gratis ahora
              </Link>
              <Link href="/b/guarapo-demo" target="_blank" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-emerald-500 transition-all flex items-center justify-center gap-2">
                Ver demo en vivo <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400 font-medium">
              Sin tarjeta de crédito · Configuración en 5 minutos · Gratis para siempre
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
                    <div className="text-xl font-black mb-4">Guarapo<span className="text-emerald-600">IA</span></div>
                    {["Dashboard", "Inbox", "Reviews", "Contacts", "Analytics"].map(item => (
                      <div key={item} className={`px-3 py-2 rounded-xl text-sm font-semibold ${item === "Dashboard" ? "bg-emerald-50 text-emerald-600" : "text-slate-500"}`}>{item}</div>
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
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">{name[0]}</div>
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
          </motion.div>
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
              Herramientas pensadas para dueños de negocios locales que quieren crecer. <strong className="text-slate-700">Sin pagar nada.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Ad Sense */}
      <div className="max-w-5xl mx-auto px-6">
        <AdBanner slot="0000000003" />
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-black mb-6">
              ✅ Gratis para siempre — ¿Cómo es posible?
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Fácil de usar. Gratis de verdad.</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              GuarapoIA es gratuito para negocios. Nos financiamos mediante anuncios discretos en las páginas públicas de tus clientes,
              como hace Google o Instagram. Tú creces, nosotros crecemos contigo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <motion.div 
                key={step.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Paso {step.step}</div>
                <h3 className="text-base font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Free callout */}
          <div className="mt-12 p-8 bg-white rounded-3xl border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🎁</div>
              <div>
                <p className="font-black text-slate-900 text-lg">¿Cuánto cuesta?</p>
                <p className="text-slate-500 font-medium text-sm">Para tu negocio: absolutamente nada. Sin planes, sin límites, sin sorpresas.</p>
              </div>
            </div>
            <Link href="/signup" className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap">
              Empezar ahora — Es gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-3">Lo que dicen nuestros negocios</h2>
            <p className="text-slate-500 font-medium">Negocios reales, resultados reales. Sin coste.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-7 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
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

      {/* Banner Ad Sense */}
      <div className="max-w-5xl mx-auto px-6">
        <AdBanner slot="0000000004" />
      </div>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-teal-600/10" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-3">¿Listo para crecer gratis?</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                Únete a más de 500 negocios locales que ya gestionan su captación y reputación con GuarapoIA. Sin pagar un euro.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-emerald-50 transition-all">
                  Crear mi cuenta gratis ahora
                </Link>
                <a href="mailto:hola@guarapoia.com" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black hover:bg-white/20 transition-all">
                  Contactar con ventas
                </a>
              </div>
              <p className="text-emerald-200 text-sm mt-4 font-medium">Sin tarjeta de crédito · Gratis para siempre · Configúrate en 5 min</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-black flex items-center gap-1">Guarapo<span className="text-emerald-600">IA</span></div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Términos</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contacto</Link>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2026 GuarapoIA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

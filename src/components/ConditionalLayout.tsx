"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import EmailVerificationBanner from "./EmailVerificationBanner";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Rutas que NO muestran el sidebar de administración
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/privacy", "/terms", "/contact", "/verify-email", "/forgot-password", "/reset-password"];

function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith("/b/")) return true;
  return false;
}

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authInfo, setAuthInfo] = useState<{ email: string; emailVerified: boolean } | null>(null);

  useEffect(() => {
    if (!isPublicRoute(pathname)) {
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.authenticated) {
            setAuthInfo({ email: d.email, emailVerified: !!d.emailVerified });
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Sidebar Mobile Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Mobile Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40">
          <div className="text-xl font-black flex items-center gap-1">
            Guarapo<span className="text-emerald-600">IA</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Email verification banner */}
        {authInfo && !authInfo.emailVerified && (
          <EmailVerificationBanner email={authInfo.email} />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

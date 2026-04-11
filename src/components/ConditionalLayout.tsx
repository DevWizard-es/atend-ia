"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import EmailVerificationBanner from "./EmailVerificationBanner";
import { Menu } from "lucide-react";

// Rutas que NO muestran el sidebar de administración
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/privacy", "/terms", "/contact", "/verify-email"];

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

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-xl font-black">
            Atend<span className="text-blue-600">IA</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Email verification banner */}
        {authInfo && !authInfo.emailVerified && (
          <EmailVerificationBanner email={authInfo.email} />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  MessageSquare,
  Users,
  LayoutDashboard,
  LogOut,
  Bot,
  Star,
  PlusCircle,
  Home,
  Package,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: MessageSquare },
  { name: "Agente IA", href: "/agent", icon: Bot },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Catálogo", href: "/catalog", icon: Package },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen flex flex-col sticky top-0">
      {/* Logo + Back to Landing */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 block mb-4">
          Atend<span className="text-blue-600">IA</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors group"
        >
          <Home className="w-3.5 h-3.5 group-hover:text-blue-600 transition-colors" />
          Volver al inicio
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-3">
        {/* Business card */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              PR
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Pizzería Roma</div>
              <div className="text-[10px] text-blue-600 uppercase tracking-wider font-black">Plan Premium</div>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
            <PlusCircle className="w-3.5 h-3.5" />
            Nueva Campaña
          </button>
        </div>

        {/* Logout */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 w-full text-sm font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Link>
      </div>
    </aside>
  );
}

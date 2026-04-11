"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
  Pencil,
  Check,
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

const PROFILE_EMOJIS = ["", "🏪", "☕", "🍕", "💈", "🏋️", "🌿", "🐾", "🔧", "🎨", "🍰", "🎵", "🏥", "📚"];
const PROFILE_COLORS = [
  { label: "Azul", value: "from-blue-500 to-indigo-600" },
  { label: "Verde", value: "from-emerald-500 to-teal-600" },
  { label: "Naranja", value: "from-orange-500 to-red-600" },
  { label: "Violeta", value: "from-purple-500 to-pink-600" },
  { label: "Noche", value: "from-slate-700 to-slate-900" },
  { label: "Dorado", value: "from-amber-500 to-orange-600" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Mi Negocio");
  const [profileEmoji, setProfileEmoji] = useState("");
  const [profileColor, setProfileColor] = useState("from-blue-500 to-indigo-600");
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/agent/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.name) setBusinessName(d.name);
        if (d.profile_emoji !== undefined) setProfileEmoji(d.profile_emoji || "");
        if (d.profile_color) setProfileColor(d.profile_color);
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/agent/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_emoji: profileEmoji, profile_color: profileColor }),
    }).catch(() => {});
    setSaving(false);
    setEditingProfile(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/");
  };

  const initials = businessName.substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen flex flex-col sticky top-0">
      {/* Logo + Back to Landing */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
            Atend<span className="text-blue-600">IA</span>
          </Link>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
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
              onClick={() => onClose?.()}
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
            {/* Avatar — clickable to edit */}
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className={cn(
                "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shadow-sm relative group shrink-0",
                profileColor
              )}
              title="Cambiar icono del perfil"
            >
              {profileEmoji || initials}
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Pencil className="w-3 h-3 text-white" />
              </div>
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{businessName}</div>
              <div className="text-[10px] text-blue-600 uppercase tracking-wider font-black">Plan Premium</div>
            </div>
          </div>

          {/* Profile editor panel */}
          {editingProfile && (
            <div className="mb-3 space-y-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icono</p>
              <div className="grid grid-cols-7 gap-1">
                {PROFILE_EMOJIS.map((e) => (
                  <button
                    key={e || "none"}
                    onClick={() => setProfileEmoji(e)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all",
                      profileEmoji === e ? "bg-blue-100 border-2 border-blue-500" : "hover:bg-slate-100 border-2 border-transparent"
                    )}
                    title={e || "Iniciales"}
                  >
                    {e || <span className="text-[9px] font-black text-slate-400">AB</span>}
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color</p>
              <div className="flex flex-wrap gap-2">
                {PROFILE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setProfileColor(c.value)}
                    className={cn(
                      "w-7 h-7 rounded-full bg-gradient-to-br transition-all",
                      c.value,
                      profileColor === c.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"
                    )}
                    title={c.label}
                  />
                ))}
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
              >
                <Check className="w-3 h-3" /> {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )}

          <Link 
            href="/campaign"
            onClick={() => onClose?.()}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nueva Campaña
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// Rutas que NO muestran el sidebar de administración
const PUBLIC_ROUTES = ["/", "/login", "/signup"];

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

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}

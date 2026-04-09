import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AtendIA - Plataforma All-in-One para Negocios Locales",
  description: "Captación, Mensajería y Reputación para Negocios Locales. Gestiona tu negocio como un pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

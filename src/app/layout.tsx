import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Publisher ID de AdSense
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5634358982750683";

export const metadata: Metadata = {
  title: "GuarapoIA - Plataforma Gratuita para Negocios Locales",
  description: "Captación, Mensasjería y Reputación para Negocios Locales. 100% gratis. Sin tarjeta de crédito. La solución definitiva de Guarapo.",
  other: {
    "google-adsense-account": "ca-pub-5634358982750683",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-white`}>
        {/* Google AdSense — solo carga si hay un publisher ID real configurado */}
        {ADSENSE_CLIENT && !ADSENSE_CLIENT.includes("XXXXXXXX") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}


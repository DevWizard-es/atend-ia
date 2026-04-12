import { Metadata } from "next";
import { getDb } from "@/lib/db";
import BioLinkClient from "./BioLinkClient";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = await getDb();
  const business = await db.get("SELECT * FROM organizations WHERE slug = ?", [params.slug]);

  if (!business) {
    return {
      title: "Negocio no encontrado | GuarapoIA",
    };
  }

  const title = `${business.name} | GuarapoIA`;
  const description = `Visita el perfil oficial de ${business.name} en GuarapoIA. Contacta por WhatsApp, reserva, deja reseñas y descubre nuestras promociones.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://guarapoia.com/b/${params.slug}`,
      siteName: "GuarapoIA",
      images: [
        {
          url: "https://guarapoia.com/og-image.png", // TODO: Configurar imagen dinámica si se desea
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://guarapoia.com/og-image.png"],
    },
  };
}

async function getBusinessData(slug: string) {
  const db = await getDb();
  const business = await db.get("SELECT * FROM organizations WHERE slug = ?", [slug]);
  if (!business) return null;

  // Cargar productos también si existen (para pasarlos hidratados)
  const products = await db.all("SELECT * FROM products WHERE org_id = ?", [business.id]);
  
  return { ...business, products };
}

export default async function PublicLandingPage({ params }: { params: { slug: string } }) {
  const business = await getBusinessData(params.slug);
  
  return <BioLinkClient slug={params.slug} initialData={business} />;
}

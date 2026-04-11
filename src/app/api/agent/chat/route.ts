import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { message, tone, businessName, businessSlug } = await request.json();
    const msg = message.toLowerCase();

    // Fetch business info from DB if slug provided
    let biz = { 
      name: businessName || "nuestro negocio",
      agent_instructions: "",
      whatsapp_phone: "",
    };

    if (businessSlug) {
      try {
        const db = await getDb();
        const org = await db.get(
          "SELECT name, agent_instructions, whatsapp_phone, agent_tone FROM organizations WHERE slug = ?",
          [businessSlug]
        );
        if (org) {
          biz.name = String(org.name || biz.name);
          biz.agent_instructions = String(org.agent_instructions || "");
          biz.whatsapp_phone = String(org.whatsapp_phone || "");
        }
      } catch (_) {}
    }

    const name = biz.name;
    const isPro = tone === "Pro" || tone === "Profesional";

    let reply = "";

    if (msg.includes("hola") || msg.includes("buenos días") || msg.includes("buenas tardes") || msg.includes("buenas") || msg.includes("hey")) {
      reply = isPro
        ? `¡Hola! Bienvenido a ${name}. Soy el asistente virtual. ¿En qué puedo ayudarle hoy?`
        : `¡Ey! Hola 👋 ¡Qué bueno verte por aquí! Soy el asistente de ${name}. ¿En qué te puedo ayudar?`;
    } else if (msg.includes("precio") || msg.includes("cuánto cuesta") || msg.includes("cuanto cuesta") || msg.includes("carta") || msg.includes("menú") || msg.includes("menu")) {
      reply = isPro
        ? `Puede consultar nuestra carta y precios directamente en la sección de productos de nuestra página. ¿Desea que le indique cómo llegar hasta nosotros?`
        : `¡Tenemos de todo! 🎉 Puedes ver nuestra carta completa con precios justo arriba en esta página. ¿Te llama algo la atención?`;
    } else if (msg.includes("reserva") || msg.includes("mesa") || msg.includes("cita") || msg.includes("visita")) {
      reply = isPro
        ? `Por supuesto. Para gestionar su reserva o cita, indíquenos el número de personas, fecha y hora deseada y le confirmamos disponibilidad.`
        : `¡Claro que sí! 🗓️ Cuéntame: ¿para cuántos sois y cuándo queréis venir? ¡Te buscamos un hueco!`;
    } else if (msg.includes("horario") || msg.includes("abierto") || msg.includes("cierra") || msg.includes("abre")) {
      reply = isPro
        ? biz.agent_instructions?.toLowerCase().includes("horario")
          ? `Sobre el horario: ${biz.agent_instructions.split("\n").find((l: string) => l.toLowerCase().includes("horario")) || "Consulte nuestra página para ver el horario actualizado."}`
          : `Nuestro horario puede variar. Le recomendamos consultar nuestra página o escribirnos directamente para confirmar disponibilidad.`
        : `¡Buena pregunta! 🕐 Consulta los horarios actualizados en nuestra página o escríbenos y te decimos al momento.`;
    } else if (msg.includes("whatsapp") || msg.includes("teléfono") || msg.includes("telefono") || msg.includes("llamar") || msg.includes("contacto")) {
      reply = isPro
        ? biz.whatsapp_phone
          ? `Puede contactarnos directamente en el botón de WhatsApp que encontrará en esta página. Estaremos encantados de atenderle.`
          : `Puede usar el botón de contacto en nuestra página para comunicarse con nosotros directamente.`
        : biz.whatsapp_phone
          ? `¡Claro! Puedes escribirnos en el botón de WhatsApp de arriba. Respondemos rapidísimo 💬`
          : `¡Sin problema! Usa el botón de contacto en esta página y te respondemos enseguida 🚀`;
    } else if (msg.includes("dirección") || msg.includes("donde") || msg.includes("ubicación") || msg.includes("maps") || msg.includes("como llegar")) {
      reply = isPro
        ? `Puede encontrar nuestra ubicación exacta en el botón "Cómo llegar" de nuestra página. Le llevará directamente a Google Maps.`
        : `¡Paso a paso! 📍 Pulsa el botón "Cómo llegar" aquí arriba y te llevará directo en Google Maps. ¡Nos vemos!`;
    } else if (msg.includes("gracias") || msg.includes("adiós") || msg.includes("adios") || msg.includes("hasta luego") || msg.includes("ciao")) {
      reply = isPro
        ? `De nada, ha sido un placer atenderle. ¡Que tenga un excelente día!`
        : `¡A ti! Ha sido un placer charlar 😊 ¡Te esperamos pronto en ${name}! ¡Ciao!`;
    } else if (biz.agent_instructions && biz.agent_instructions.length > 10) {
      // If the business has custom instructions, reference them
      reply = isPro
        ? `Entendido. ${biz.agent_instructions.split("\n")[0] || "Estamos aquí para ayudarle. ¿Puede darme más detalles?"}`
        : `¡Mmm! No estoy del todo seguro de lo que necesitas 😅. Cuéntame más o echa un vistazo a nuestra carta / opciones aquí en la página.`;
    } else {
      reply = isPro
        ? `Entendido. No estoy seguro de haber captado su pregunta. ¿Podría darme más detalles o prefiere escribirnos directamente?`
        : `Ufff, no lo tengo del todo claro... 😂 Pero puedo ayudarte con el menú, horarios, reservas o cómo llegar. ¿Qué necesitas?`;
    }

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Error procesando el mensaje" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, tone } = await request.json();
    const msg = message.toLowerCase();

    let reply = "";

    // Professional Tone vs Friendly Tone
    const isPro = tone === "Pro";

    if (msg.includes("hola") || msg.includes("buenos días") || msg.includes("buenas tardes")) {
      reply = isPro 
        ? "¡Hola! Buenos días. Soy el asistente virtual de Pizzería Roma. ¿En qué puedo ayudarle hoy?" 
        : "¡Ey! Hola 👋 ¡Qué bueno verte por aquí! Soy el asistente de Pizzería Roma, ¿qué te apetece hoy?";
    } else if (msg.includes("precio") || msg.includes("cuánto cuesta") || msg.includes("carta") || msg.includes("menú")) {
      reply = isPro 
        ? "Nuestros precios varían según el plato. Puede consultar nuestra carta completa en el enlace de Mi Mini Web. Las pizzas básicas empiezan desde 9€." 
        : "¡Tenemos de todo! 🍕 Nuestras pizzas artesanas empiezan desde los 9€. Puedes ver la carta completa con fotos increíbles en nuestra Mini Web. ¡Te va a encantar!";
    } else if (msg.includes("reserva") || msg.includes("mesa")) {
      reply = isPro 
        ? "Por supuesto. Para gestionar su reserva, necesito que me indique el número de personas, fecha y hora deseada. O si prefiere, puede hacerlo directamente desde nuestro enlace de reservas." 
        : "¡Claro que sí! Estaremos encantados de recibirte. 🏠 ¿Para cuántos seríais y en qué momento os viene mejor? También puedes reservar en un clic desde nuestra web.";
    } else if (msg.includes("horario") || msg.includes("abierto")) {
      reply = isPro 
        ? "Nuestro horario de atención es de lunes a domingo, de 13:00 a 16:00 y de 20:00 a 23:30. ¿Desea consultar la disponibilidad para hoy?" 
        : "¡Estamos a tope! 🔥 Abrimos todos los días de 13:00 a 16:00 y cenas de 20:00 a 23:30. ¡Te esperamos!";
    } else if (msg.includes("gracias") || msg.includes("adiós") || msg.includes("luego")) {
        reply = isPro 
          ? "De nada. Ha sido un placer ayudarle. ¡Que tenga un excelente día!" 
          : "¡A ti! Un placer charlar contigo. 😊 ¡Nos vemos pronto por la pizzería! ¡Ciao!";
    } else {
      reply = isPro 
        ? "Entiendo. No estoy seguro de haber comprendido su solicitud. ¿Podría darme más detalles o prefiere que le pase con un agente humano?" 
        : "Ufff, no estoy muy seguro de a qué te refieres con eso... 😂 Pero si quieres saber algo sobre el menú, horarios o reservar mesa, ¡soy tu robot!";
    }

    // Artificial delay to simulate "thinking"
    await new Promise(r => setTimeout(r, 800));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Error procesando el mensaje" }, { status: 500 });
  }
}

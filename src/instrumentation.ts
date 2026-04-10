/**
 * Next.js Instrumentation Hook
 * Se ejecuta una vez al arrancar el servidor.
 * Implementa un auto-ping para evitar que Render Free duerma la instancia.
 */
export async function register() {
  // Solo en el runtime de Node.js (no en Edge) y en producción
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV === 'production'
  ) {
    // Render expone la URL pública en RENDER_EXTERNAL_URL
    // También podemos usar NEXT_PUBLIC_APP_URL si lo configuramos manualmente
    const appUrl =
      process.env.RENDER_EXTERNAL_URL ||
      (process.env.NEXT_PUBLIC_APP_URL
        ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
        : null);

    if (!appUrl) {
      console.warn('[Keep-alive] No APP_URL found — auto-ping disabled.');
      return;
    }

    const pingUrl = `${appUrl}/api/ping`;
    const INTERVAL_MS = 9 * 60 * 1000; // cada 9 minutos (Render duerme tras 15 min)

    console.log(`[Keep-alive] Auto-ping activado → ${pingUrl} (cada 9 min)`);

    // Pequeño retraso inicial para que el servidor esté completamente listo
    await new Promise((resolve) => setTimeout(resolve, 30_000));

    setInterval(async () => {
      try {
        const res = await fetch(pingUrl, { cache: 'no-store' });
        console.log(`[Keep-alive] Ping OK — ${new Date().toISOString()} (${res.status})`);
      } catch (err) {
        console.error(`[Keep-alive] Ping fallido — ${new Date().toISOString()}`, err);
      }
    }, INTERVAL_MS);
  }
}

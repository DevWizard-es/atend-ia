import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | AtendIA',
  description: 'Política de privacidad de AtendIA. Cómo recopilamos, usamos y protegemos tus datos.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="text-white font-bold text-xl no-underline">AtendIA</Link>
        <Link href="/" className="text-gray-400 text-sm no-underline">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-2 uppercase tracking-widest font-semibold font-sans">Última actualización: 1 de enero de 2026</p>
        <h1 className="text-4xl font-extrabold text-white mb-4">Política de Privacidad</h1>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          En <strong className="text-white">AtendIA</strong> nos tomamos muy en serio la privacidad.
          Esta política explica qué datos recopilamos, cómo los usamos y tus derechos.
        </p>

        {sections.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-gray-800">{s.title}</h2>
            <div className="text-gray-400 leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: s.content }} />
          </section>
        ))}

        <div className="mt-12 p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400 m-0 leading-relaxed font-sans">
            ¿Preguntas? Escríbenos a{' '}
            <a href="mailto:privacidad@atendia.app" className="text-blue-400 font-semibold underline decoration-blue-400/30">privacidad@atendia.app</a>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-6 text-center">
        <p className="text-gray-600 text-sm m-0 leading-relaxed font-sans">
          © 2026 AtendIA. ·{' '}
          <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Términos de Uso</Link>
        </p>
      </footer>
    </div>
  )
}

const sections = [
  {
    title: '1. Responsable del tratamiento',
    content: 'AtendIA es el responsable del tratamiento de los datos personales recogidos a través de esta plataforma. Contacto: <a href="mailto:privacidad@atendia.app" class="text-blue-400">privacidad@atendia.app</a>.',
  },
  {
    title: '2. Datos que recopilamos',
    content: `Recopilamos los siguientes tipos de datos:
      <ul class="mt-4 pl-5 flex flex-col gap-3 list-disc">
        <li><strong class="text-gray-200">Datos de registro:</strong> nombre, email y teléfono al crear tu cuenta.</li>
        <li><strong class="text-gray-200">Datos del negocio:</strong> nombre, dirección, categoría, fotos y enlaces de tu perfil.</li>
        <li><strong class="text-gray-200">Datos de uso:</strong> páginas visitadas, clics y métricas de rendimiento.</li>
        <li><strong class="text-gray-200">Datos de comunicación:</strong> mensajes gestionados a través del Inbox.</li>
        <li><strong class="text-gray-200">Datos técnicos:</strong> dirección IP, navegador, sistema operativo y cookies de sesión.</li>
      </ul>`,
  },
  {
    title: '3. Finalidad del tratamiento',
    content: `Utilizamos tus datos para:
      <ul class="mt-4 pl-5 flex flex-col gap-3 list-disc">
        <li>Prestarte el servicio AtendIA y mantener tu cuenta activa.</li>
        <li>Enviarte notificaciones relevantes y actualizaciones.</li>
        <li>Mejorar la plataforma mediante análisis de comportamiento de uso.</li>
        <li>Mostrar publicidad contextual (Google AdSense) en páginas públicas para financiar el servicio gratuito.</li>
        <li>Cumplir con nuestras obligaciones legales.</li>
      </ul>`,
  },
  {
    title: '4. Publicidad (Google AdSense)',
    content: 'AtendIA utiliza Google AdSense para mostrar anuncios en páginas públicas de negocios. Google puede usar cookies para servir anuncios basados en visitas previas de un usuario. Puedes desactivar la publicidad personalizada visitando <a href="https://www.google.com/settings/ads" target="_blank" class="text-blue-400">Configuración de anuncios de Google</a>.',
  },
  {
    title: '5. Compartir datos con terceros',
    content: `No vendemos tus datos personales. Solo los compartimos con:
      <ul class="mt-4 pl-5 flex flex-col gap-3 list-disc">
        <li>Proveedores de servicios cloud bajo estrictos acuerdos de confidencialidad.</li>
        <li>Google LLC para la prestación de servicios de publicidad y analítica.</li>
        <li>Autoridades competentes únicamente cuando lo exija la ley.</li>
      </ul>`,
  },
  {
    title: '6. Tus derechos',
    content: `Tienes derecho a acceder, rectificar, suprimir, oponerte, limitar el tratamiento y solicitar la portabilidad de tus datos.
      Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:privacidad@atendia.app" class="text-blue-400">privacidad@atendia.app</a>.`,
  },
  {
    title: '7. Cookies',
    content: 'Utilizamos cookies esenciales para el funcionamiento y opcionales para analítica y publicidad. Al acceder, verás un panel para gestionar tus preferencias, o puedes configurarlas directamente desde tu navegador.',
  },
  {
    title: '8. Seguridad',
    content: 'Implementamos protocolos de seguridad estándar como cifrado SSL/TLS en todas las comunicaciones y restringimos el acceso a la base de datos para proteger tu información.',
  },
  {
    title: '9. Cambios en esta política',
    content: 'Nos reservamos el derecho de actualizar esta política. Notificaremos cambios significativos por email. La fecha de actualización al inicio siempre refleja la versión vigente.',
  },
]

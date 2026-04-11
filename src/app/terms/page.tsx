import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso | AtendIA',
  description: 'Términos y condiciones de uso de la plataforma AtendIA.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="text-white font-bold text-xl no-underline">AtendIA</Link>
        <Link href="/" className="text-gray-400 text-sm no-underline">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-2 uppercase tracking-widest font-semibold font-sans">Última actualización: 1 de enero de 2026</p>
        <h1 className="text-4xl font-extrabold text-white mb-4">Términos de Uso</h1>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          Al registrarte y usar <strong className="text-white">AtendIA</strong>, aceptas estos términos en su totalidad.
        </p>

        {sections.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3 pb-2 border-b border-gray-800">{s.title}</h2>
            <div className="text-gray-400 leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: s.content }} />
          </section>
        ))}

        <div className="mt-12 p-6 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400 m-0 leading-relaxed font-sans">
            ¿Dudas legales? Escríbenos a{' '}
            <a href="mailto:legal@atendia.app" className="text-blue-400 font-semibold underline decoration-blue-400/30">legal@atendia.app</a>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-6 text-center">
        <p className="text-gray-600 text-sm m-0 leading-relaxed font-sans">
          © 2026 AtendIA. ·{' '}
          <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Política de Privacidad</Link>
        </p>
      </footer>
    </div>
  )
}

const sections = [
  {
    title: '1. Descripción del servicio',
    content: 'AtendIA es una plataforma gratuita para negocios locales financiada mediante publicidad no intrusiva (Google AdSense) en las páginas públicas de los perfiles de negocio.',
  },
  {
    title: '2. Aceptación de los términos',
    content: `Al crear una cuenta confirmas que:
      <ul class="mt-4 pl-5 flex flex-col gap-3 list-disc">
        <li>Tienes al menos 18 años o la mayoría de edad en tu país de residencia.</li>
        <li>Tienes autoridad legal para aceptar estos términos en nombre de tu negocio.</li>
        <li>La información que proporcionas es veraz, exacta y actualizada.</li>
        <li>Has leído y aceptado nuestra <a href="/privacy" class="text-blue-400">Política de Privacidad</a>.</li>
      </ul>`,
  },
  {
    title: '3. Uso permitido',
    content: `Está expresamente prohibido:
      <ul class="mt-4 pl-5 flex flex-col gap-3 list-disc">
        <li>Usar la plataforma para cualquier actividad ilegal, engañosa o fraudulenta.</li>
        <li>Publicar contenido falso, difamatorio, de odio u ofensivo.</li>
        <li>Intentar acceder a cuentas de otros usuarios sin autorización explícita.</li>
        <li>Emplear bots o scrapers para interactuar con la plataforma o extraer datos.</li>
        <li><strong class="text-gray-200">Realizar fraude de clics</strong> en los anuncios de tu propia página. Esto conlleva la suspensión inmediata y permanente de la cuenta.</li>
      </ul>`,
  },
  {
    title: '4. Propiedad del contenido',
    content: 'Tú eres el propietario del contenido que publicas (fotos, textos, menús). Al publicarlo, nos otorgas una licencia mundial, no exclusiva y gratuita para mostrarlo en la plataforma con el fin de prestar el servicio.',
  },
  {
    title: '5. Publicidad y modelo de negocio',
    content: 'AtendIA se ofrece gratuitamente a los negocios. A cambio, mostramos anuncios de terceros (Google AdSense) en tus páginas públicas. Aceptas que dichas páginas incluyan publicidad contextual relevante para financiar el mantenimiento del servicio.',
  },
  {
    title: '6. Disponibilidad y garantías',
    content: 'AtendIA se proporciona "tal cual" y según disponibilidad. Aunque nos esforzamos por mantener el servicio operativo 24/7, no garantizamos la ausencia de interrupciones técnicas o errores.',
  },
  {
    title: '7. Limitación de responsabilidad',
    content: 'AtendIA no será responsable de daños indirectos, pérdida de datos, ingresos o beneficios que puedan derivarse del uso de la herramienta.',
  },
  {
    title: '8. Terminación',
    content: 'Puedes cancelar tu cuenta en cualquier momento desde los ajustes. Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos, sin previo aviso.',
  },
  {
    title: '9. Ley aplicable',
    content: 'Estos términos se rigen por la legislación del territorio correspondiente y la normativa europea de aplicación directa.',
  },
]

#!/bin/bash
# ============================================================
#  AtendIA — Script de instalación automática de AdSense
#  Ejecuta esto en la raíz de tu proyecto clonado localmente
# ============================================================

set -e  # Para si algo falla

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
echo "📁 Raíz del proyecto: $REPO_ROOT"
cd "$REPO_ROOT"

# ────────────────────────────────────────────────────────────
# 1. ads.txt en /public
# ────────────────────────────────────────────────────────────
echo "✅ Creando public/ads.txt..."
mkdir -p public
cat > public/ads.txt << 'EOF'
google.com, pub-5634358982750683, DIRECT, f08c47fec0942fa0
EOF

# ────────────────────────────────────────────────────────────
# 2. Componente AdBanner
# ────────────────────────────────────────────────────────────
echo "✅ Creando src/components/AdBanner.tsx..."
mkdir -p src/components
cat > src/components/AdBanner.tsx << 'EOF'
'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  format?: string
  responsive?: boolean
  className?: string
}

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // silencioso en desarrollo
    }
  }, [])

  return (
    <div className={`text-center my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5634358982750683"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={String(responsive)}
      />
    </div>
  )
}
EOF

# ────────────────────────────────────────────────────────────
# 3. Modificar layout.tsx — agregar script AdSense
# ────────────────────────────────────────────────────────────
LAYOUT_FILE="src/app/layout.tsx"
echo "✅ Modificando $LAYOUT_FILE para agregar AdSense..."

if grep -q "pagead2.googlesyndication.com" "$LAYOUT_FILE" 2>/dev/null; then
  echo "   ⚠️  AdSense ya estaba en layout.tsx, saltando..."
else
  # Inserta el script justo antes del cierre de </head> o antes de <body>
  python3 << PYTHON
import re

with open("$LAYOUT_FILE", "r") as f:
    content = f.read()

adsense_script = '''        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5634358982750683"
          crossOrigin="anonymous"
        />'''

# Estrategia 1: insertar antes de </head>
if '</head>' in content:
    content = content.replace('</head>', adsense_script + '\n      </head>', 1)
# Estrategia 2: insertar dentro de <Head> de next/head
elif '<Head>' in content:
    content = content.replace('</Head>', adsense_script + '\n      </Head>', 1)
# Estrategia 3: insertar el <head> explícito en el return del layout
elif '<body' in content and '<head>' not in content.lower():
    content = content.replace('<body', '<head>\n' + adsense_script + '\n      </head>\n      <body', 1)

with open("$LAYOUT_FILE", "w") as f:
    f.write(content)

print("   Script AdSense insertado correctamente")
PYTHON
fi

# ────────────────────────────────────────────────────────────
# 4. Página de Privacidad
# ────────────────────────────────────────────────────────────
echo "✅ Creando src/app/privacy/page.tsx..."
mkdir -p src/app/privacy
cat > src/app/privacy/page.tsx << 'PRIVACYEOF'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | AtendIA',
  description: 'Política de privacidad de AtendIA. Cómo recopilamos, usamos y protegemos tus datos.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl no-underline">AtendIA</Link>
        <Link href="/" className="text-gray-400 text-sm no-underline">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-2">Última actualización: 1 de enero de 2026</p>
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
          <p className="text-gray-400 m-0">
            ¿Preguntas? Escríbenos a{' '}
            <a href="mailto:privacidad@atendia.app" className="text-blue-400">privacidad@atendia.app</a>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-6 text-center">
        <p className="text-gray-600 text-sm m-0">
          © 2026 AtendIA. ·{' '}
          <Link href="/terms" className="text-gray-500">Términos de Uso</Link>
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
      <ul class="mt-2 pl-5 flex flex-col gap-2 list-disc">
        <li><strong class="text-gray-200">Datos de registro:</strong> nombre, email y teléfono al crear tu cuenta.</li>
        <li><strong class="text-gray-200">Datos del negocio:</strong> nombre, dirección, categoría, fotos y enlaces de tu perfil.</li>
        <li><strong class="text-gray-200">Datos de uso:</strong> páginas visitadas, clics y métricas de rendimiento.</li>
        <li><strong class="text-gray-200">Datos de comunicación:</strong> mensajes gestionados a través del Inbox.</li>
        <li><strong class="text-gray-200">Datos técnicos:</strong> dirección IP, navegador, SO y cookies de sesión.</li>
      </ul>`,
  },
  {
    title: '3. Finalidad del tratamiento',
    content: `Utilizamos tus datos para:
      <ul class="mt-2 pl-5 flex flex-col gap-2 list-disc">
        <li>Prestarte el servicio AtendIA y mantener tu cuenta activa.</li>
        <li>Enviarte notificaciones y actualizaciones.</li>
        <li>Mejorar la plataforma mediante análisis de uso.</li>
        <li>Mostrar publicidad contextual (Google AdSense) en páginas públicas para financiar el servicio gratuito.</li>
        <li>Cumplir con obligaciones legales.</li>
      </ul>`,
  },
  {
    title: '4. Publicidad (Google AdSense)',
    content: 'AtendIA utiliza Google AdSense para mostrar anuncios en páginas públicas de negocios. Google puede usar cookies para anuncios basados en visitas previas. Puedes desactivarlo en <a href="https://www.google.com/settings/ads" target="_blank" class="text-blue-400">Configuración de anuncios de Google</a>.',
  },
  {
    title: '5. Compartir datos con terceros',
    content: `No vendemos tus datos. Solo los compartimos con:
      <ul class="mt-2 pl-5 flex flex-col gap-2 list-disc">
        <li>Proveedores de servicios cloud bajo contratos de confidencialidad.</li>
        <li>Google LLC para servicios de publicidad y analítica.</li>
        <li>Autoridades competentes cuando lo exija la ley.</li>
      </ul>`,
  },
  {
    title: '6. Tus derechos',
    content: `Tienes derecho a acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos.
      Escríbenos a <a href="mailto:privacidad@atendia.app" class="text-blue-400">privacidad@atendia.app</a> para ejercerlos.`,
  },
  {
    title: '7. Cookies',
    content: 'Usamos cookies esenciales y opcionales (analítica y publicidad). Al acceder verás un banner para gestionar tus preferencias. También puedes configurarlas desde tu navegador.',
  },
  {
    title: '8. Seguridad',
    content: 'Aplicamos cifrado SSL/TLS en todas las comunicaciones y acceso restringido a los datos para proteger tu información.',
  },
  {
    title: '9. Cambios en esta política',
    content: 'Podemos actualizar esta política. Te notificaremos por email si los cambios son significativos. La fecha de actualización al inicio siempre refleja la versión vigente.',
  },
]
PRIVACYEOF

# ────────────────────────────────────────────────────────────
# 5. Página de Términos de Uso
# ────────────────────────────────────────────────────────────
echo "✅ Creando src/app/terms/page.tsx..."
mkdir -p src/app/terms
cat > src/app/terms/page.tsx << 'TERMSEOF'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso | AtendIA',
  description: 'Términos y condiciones de uso de la plataforma AtendIA.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl no-underline">AtendIA</Link>
        <Link href="/" className="text-gray-400 text-sm no-underline">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-2">Última actualización: 1 de enero de 2026</p>
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
          <p className="text-gray-400 m-0">
            ¿Dudas legales? Escríbenos a{' '}
            <a href="mailto:legal@atendia.app" className="text-blue-400">legal@atendia.app</a>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-6 text-center">
        <p className="text-gray-600 text-sm m-0">
          © 2026 AtendIA. ·{' '}
          <Link href="/privacy" className="text-gray-500">Política de Privacidad</Link>
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
      <ul class="mt-2 pl-5 flex flex-col gap-2 list-disc">
        <li>Tienes al menos 18 años o la mayoría de edad en tu país.</li>
        <li>Tienes autoridad para aceptar estos términos en nombre de tu negocio.</li>
        <li>La información que proporcionas es veraz y actualizada.</li>
        <li>Has leído y aceptado nuestra <a href="/privacy" class="text-blue-400">Política de Privacidad</a>.</li>
      </ul>`,
  },
  {
    title: '3. Uso permitido',
    content: `Está expresamente prohibido:
      <ul class="mt-2 pl-5 flex flex-col gap-2 list-disc">
        <li>Usar la plataforma para actividades ilegales o fraudulentas.</li>
        <li>Publicar contenido falso, difamatorio u ofensivo.</li>
        <li>Intentar acceder a cuentas de otros usuarios sin autorización.</li>
        <li>Usar bots o scrapers para interactuar con la plataforma.</li>
        <li><strong class="text-gray-200">Hacer clic fraudulento en los anuncios</strong> de tu propia página (fraude de clics). Esto resulta en suspensión inmediata.</li>
      </ul>`,
  },
  {
    title: '4. Contenido del usuario',
    content: 'Tú eres propietario del contenido que publicas. Al publicarlo, nos otorgas una licencia no exclusiva y gratuita para mostrarlo en la plataforma. Garantizas que tienes los derechos necesarios sobre dicho contenido.',
  },
  {
    title: '5. Publicidad y modelo de negocio',
    content: 'AtendIA es gratuita para los negocios. Mostramos anuncios de terceros (Google AdSense) en las páginas públicas. Al usar AtendIA, aceptas que tus páginas públicas puedan incluir publicidad discreta y contextual.',
  },
  {
    title: '6. Disponibilidad del servicio',
    content: 'AtendIA se proporciona "tal cual". Nos esforzamos por mantener una alta disponibilidad pero no garantizamos que el servicio esté libre de interrupciones. Podemos realizar mantenimientos con o sin previo aviso.',
  },
  {
    title: '7. Limitación de responsabilidad',
    content: 'AtendIA no será responsable de daños indirectos, pérdida de datos, ingresos o beneficios derivados del uso o imposibilidad de uso del servicio.',
  },
  {
    title: '8. Terminación',
    content: 'Puedes cancelar tu cuenta en cualquier momento desde la configuración. Nos reservamos el derecho de suspender cuentas que incumplan estos términos sin previo aviso.',
  },
  {
    title: '9. Legislación aplicable',
    content: 'Estos términos se rigen por la legislación española y la normativa aplicable de la Unión Europea.',
  },
]
TERMSEOF

# ────────────────────────────────────────────────────────────
# 6. Actualizar enlaces del footer en page.tsx principal
# ────────────────────────────────────────────────────────────
MAIN_PAGE="src/app/page.tsx"
if [ -f "$MAIN_PAGE" ]; then
  echo "✅ Actualizando enlaces de Privacidad y Términos en $MAIN_PAGE..."
  python3 << PYTHON
with open("$MAIN_PAGE", "r") as f:
    content = f.read()

import re

# Reemplaza href="#" de Privacidad y Términos en el footer
content = re.sub(r'href="#"([^>]*>[^<]*[Pp]rivacidad)', r'href="/privacy"\1', content)
content = re.sub(r'href="#"([^>]*>[^<]*[Tt][eé]rminos)', r'href="/terms"\1', content)

# También busca patrones con texto primero
content = re.sub(r'(<[^>]*>Privacidad</[^>]+>)', 
    lambda m: m.group(0).replace('href="#"', 'href="/privacy"'), content)
content = re.sub(r'(<[^>]*>Términos</[^>]+>)', 
    lambda m: m.group(0).replace('href="#"', 'href="/terms"'), content)

with open("$MAIN_PAGE", "w") as f:
    f.write(content)
print("   Enlaces actualizados")
PYTHON
else
  echo "   ⚠️  No encontré src/app/page.tsx — actualiza los enlaces de footer manualmente"
fi

# ────────────────────────────────────────────────────────────
# 7. Git commit y push
# ────────────────────────────────────────────────────────────
echo ""
echo "📦 Haciendo commit y push..."
git add \
  public/ads.txt \
  src/components/AdBanner.tsx \
  src/app/layout.tsx \
  src/app/privacy/page.tsx \
  src/app/terms/page.tsx \
  src/app/page.tsx 2>/dev/null || true

git commit -m "feat: add Google AdSense, privacy policy, terms of use, ads.txt

- Add AdSense script to layout.tsx <head>
- Add AdBanner reusable component
- Add /privacy and /terms pages (required by Google AdSense)
- Add public/ads.txt for publisher verification
- Update footer links to /privacy and /terms"

git push origin main

echo ""
echo "════════════════════════════════════════════════════════"
echo " ✅  ¡LISTO! Todos los cambios están en GitHub."
echo "     Vercel desplegará automáticamente en ~1 minuto."
echo ""
echo " 🚨 SIGUIENTE PASO IMPORTANTE:"
echo "     Ve a https://adsense.google.com → Anuncios"
echo "     → Por unidad de anuncio → Crea anuncios tipo Display"
echo "     → Copia el data-ad-slot='XXXXXXXXXX'"
echo "     → Úsalo en: <AdBanner slot='XXXXXXXXXX' />"
echo ""
echo " 📍 Añade <AdBanner> en:"
echo "     - Entre Features y 'Cómo funciona' en src/app/page.tsx"
echo "     - Entre Testimonios y CTA en src/app/page.tsx"
echo "     - En src/app/b/[slug]/page.tsx (más tráfico = más dinero)"
echo "════════════════════════════════════════════════════════"

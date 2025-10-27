import './globals.css'
import { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Relational Insight - Análisis de Correlaciones Estadísticas',
  description: 'Herramienta gratuita para calcular correlaciones Pearson, Spearman y Kendall entre tus datos. Análisis estadístico seguro y privado en el navegador. Basada en referencias académicas de Scribbr, Wikipedia y universidades.',
  keywords: ['correlación', 'estadística', 'análisis', 'pearson', 'spearman', 'kendall', 'CSV', 'XLSX', 'datos', 'correlación estadística', 'análisis de datos'],
  authors: [{ name: 'Relational Insight' }],
  creator: 'Relational Insight',
  publisher: 'Relational Insight',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://relational-insight.vercel.app',
    title: 'Relational Insight',
    description: 'Análisis de correlaciones estadísticas seguro y privado. Utiliza métodos reconocidos internacionalmente respaldados por recursos académicos.',
    siteName: 'Relational Insight',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relational Insight',
    description: 'Análisis de correlaciones estadísticas con referencias académicas',
  },
  alternates: {
    canonical: 'https://relational-insight.vercel.app',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Relational Insight",
    "description": "Herramienta gratuita para calcular correlaciones Pearson, Spearman y Kendall entre tus datos. Análisis estadístico seguro y privado en el navegador.",
    "url": "https://relational-insight.vercel.app",
    "applicationCategory": "DataVisualization",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Pablo Cubides"
    },
    "isAccessibleForFree": true,
    "inLanguage": "es-ES",
    "author": {
      "@type": "Organization",
      "name": "Relational Insight"
    }
  }

  return (
    <html lang="es">
      <head>
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="bg-default font-sans min-h-screen flex flex-col">
        <header className="flex items-center h-16 px-4 border-b border-gray-100 justify-between">
          <div className="font-bold text-primary text-xl">Relational Insight</div>
          <nav className="flex items-center gap-6">
            <a href="/resources" className="text-primary hover:underline text-sm font-medium">📚 Recursos</a>
            <a href="/about" className="text-primary hover:underline text-sm font-medium">Acerca de</a>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-xs text-gray-400 py-4 text-center border-t border-gray-100">
          © 2025 Relational Insight — Desarrollado con Next.js | <a href="/about" className="hover:text-primary">Privacidad</a>
        </footer>
      </body>
    </html>
  )
}

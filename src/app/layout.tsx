import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import SplashScreen from '@/components/SplashScreen';
import IOSInstallBanner from '@/components/IOSInstallBanner';
import AndroidInstallBanner from '@/components/AndroidInstallBanner';
import ScrollToTop from '@/components/ScrollToTop';
import { Analytics } from '@vercel/analytics/next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import VisitorTracker from '@/components/VisitorTracker';
import { SITE_URL } from '@/lib/seo';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cemilan Teh Risma — Keripik Kimpul & Mie Kremes Bogor',
    template: '%s | Cemilan Teh Risma',
  },
  description:
    'Toko cemilan khas Bogor: Keripik Kimpul Talas Balitung renyah (3 rasa) & Mie Kremes crispy. Halal, tanpa pengawet. Pesan langsung via WhatsApp, pengiriman ke seluruh Indonesia.',
  keywords: [
    'keripik kimpul', 'keripik talas', 'keripik bogor', 'cemilan teh risma',
    'keripik kimpul original', 'keripik kimpul bbq pedas', 'keripik kimpul jagung',
    'mie kremes', 'mie kremes bogor', 'mie kremes crispy', 'cemilan halal',
    'oleh oleh bogor', 'snack bogor', 'cemilan renyah', 'jual keripik kimpul',
    'beli keripik kimpul', 'cemilan tanpa pengawet', 'warung teh risma',
  ],
  authors: [{ name: 'Warung Teh Risma' }],
  creator: 'Warung Teh Risma',
  publisher: 'Warung Teh Risma',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Cemilan Teh Risma — Keripik Kimpul & Mie Kremes Bogor',
    description: 'Keripik Kimpul renyah & Mie Kremes crispy khas Bogor. Halal, tanpa pengawet. Pesan via WhatsApp!',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Cemilan Teh Risma',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cemilan Teh Risma — Keripik Kimpul & Mie Kremes Bogor',
    description: 'Keripik Kimpul renyah & Mie Kremes crispy khas Bogor. Halal, tanpa pengawet.',
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Cemilan Teh Risma',
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#D97706',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cemilan Teh Risma" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
        <SplashScreen />
        <IOSInstallBanner />
        <AndroidInstallBanner />
        <ScrollToTop />
        <VisitorTracker />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: 'rgba(30, 13, 0, 0.95)',
              color: '#FFF8F0',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#D4A017', secondary: '#050200' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#050200' },
            },
          }}
        />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

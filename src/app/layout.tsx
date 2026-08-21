import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import SplashScreen from '@/components/SplashScreen';
import IOSInstallBanner from '@/components/IOSInstallBanner';
import AndroidInstallBanner from '@/components/AndroidInstallBanner';
import ScrollToTop from '@/components/ScrollToTop';
import { Analytics } from '@vercel/analytics/next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import VisitorTracker from '@/components/VisitorTracker';
import { SITE_URL } from '@/lib/branding';
import { getCachedBranding } from '@/lib/server/branding';
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

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${branding.brandName} — Keripik Kimpul & Mie Kremes Bogor`,
      template: `%s | ${branding.brandName}`,
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
    authors: [{ name: branding.legalName }],
    creator: branding.legalName,
    publisher: branding.legalName,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: `${branding.brandName} — Keripik Kimpul & Mie Kremes Bogor`,
      description: 'Keripik Kimpul renyah & Mie Kremes crispy khas Bogor. Halal, tanpa pengawet. Pesan via WhatsApp!',
      type: 'website',
      locale: 'id_ID',
      siteName: branding.brandName,
      url: SITE_URL,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${branding.brandName} — Keripik Kimpul & Mie Kremes Bogor`,
      description: 'Keripik Kimpul renyah & Mie Kremes crispy khas Bogor. Halal, tanpa pengawet.',
    },
    alternates: {
      canonical: SITE_URL,
    },
    verification: {
      google: 'XpJPL5HFJcMPdsWjv7vkn6AOzO06qdM3PeFWO1GckYM',
    },
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: branding.brandName,
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
}

export async function generateViewport(): Promise<Viewport> {
  const branding = await getCachedBranding();
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: branding.themeColor,
    viewportFit: 'cover',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const branding = await getCachedBranding();
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={branding.brandName} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
        <AuthProvider>
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
        </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

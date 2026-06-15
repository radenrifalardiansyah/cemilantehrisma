import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin — Cemilan Teh Risma',
  robots: { index: false, follow: false },
  manifest: undefined,
  appleWebApp: false,
  other: {
    'mobile-web-app-capable': 'no',
    'apple-mobile-web-app-capable': 'no',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

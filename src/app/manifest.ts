import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cemilan Teh Risma',
    short_name: 'Cemilan Teh Risma',
    description: 'Keripik Kimpul & Mie Kremes khas Bogor. Halal, renyah, tanpa pengawet.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF5',
    theme_color: '#D97706',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

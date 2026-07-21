import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import FeaturedSection from '@/components/FeaturedSection';
import CategoriesSection from '@/components/CategoriesSection';
import BottomNav from '@/components/BottomNav';
import { SITE_URL, BUSINESS } from '@/lib/seo';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BUSINESS.name,
  alternateName: BUSINESS.legalName,
  description: 'Toko cemilan khas Bogor: Keripik Kimpul Talas Balitung renyah dan Mie Kremes crispy. Halal, tanpa pengawet.',
  url: SITE_URL,
  telephone: BUSINESS.telephone,
  image: `${SITE_URL}/icon-512.png`,
  address: {
    '@type': 'PostalAddress',
    ...BUSINESS.address,
  },
  sameAs: BUSINESS.sameAs,
  servesCuisine: 'Snack',
  priceRange: 'Rp 13.000 – Rp 65.000',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cemilan Teh Risma',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Keripik Kimpul Original',
          description: 'Keripik kimpul / talas balitung super renyah rasa original gurih alami dari Bogor.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Keripik Kimpul BBQ Pedas',
          description: 'Keripik kimpul rasa BBQ smoky dengan sensasi pedas yang nagih.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Mie Kremes Original',
          description: 'Mie kremes renyah dengan bumbu original gurih, crispy dan tanpa pengawet.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Mie Kremes Pedas',
          description: 'Mie kremes dengan bubuk cabai asli dan bumbu pedas khas, renyah dan nagih.',
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ background: '#FFFBF5' }}>
        <Navbar />
        <Cart />
        <Hero />
        <CategoriesSection />
        <div className="pb-24 md:pb-0">
          <FeaturedSection />
        </div>
        <Footer />
        <BottomNav />
      </main>
    </>
  );
}

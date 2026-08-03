import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import FeaturedSection from '@/components/FeaturedSection';
import CategoriesSection from '@/components/CategoriesSection';
import BottomNav from '@/components/BottomNav';
import { SITE_URL, BUSINESS } from '@/lib/seo';
import { products } from '@/lib/products';
import { imageSrc } from '@/lib/liveProducts';
import { getMergedProduct } from '@/lib/server/getProduct';

// Refreshes the featured-product JSON-LD against Firestore periodically, so admin
// edits (name/price/stock/images/...) show up without a full redeploy.
export const revalidate = 300;

const availabilityMap: Record<string, string> = {
  ready: 'https://schema.org/InStock',
  habis: 'https://schema.org/OutOfStock',
  open_po: 'https://schema.org/PreOrder',
};

const featuredProductIds = ['mk-ori-150', 'mk-pdas-150', 'kk-ori-100', 'kk-bbq-100'];

export default async function HomePage() {
  const featuredProducts = (
    await Promise.all(featuredProductIds.map(id => getMergedProduct(id, products)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const featuredOffers = featuredProducts.map(product => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.[0] ? `${SITE_URL}${imageSrc(product.images[0])}` : undefined,
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/products/${product.id}`,
        priceCurrency: 'IDR',
        price: product.price,
        availability: availabilityMap[product.stock] ?? 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    },
  }));

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
      itemListElement: featuredOffers,
    },
  };

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

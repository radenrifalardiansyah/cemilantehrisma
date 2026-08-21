import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import FeaturedSection from '@/components/FeaturedSection';
import CategoriesSection from '@/components/CategoriesSection';
import BottomNav from '@/components/BottomNav';
import { SITE_URL } from '@/lib/branding';
import { getCachedBranding } from '@/lib/server/branding';
import { products } from '@/lib/products';
import { imageSrc } from '@/lib/liveProducts';
import { getAllMergedProducts, getMergedProduct } from '@/lib/server/getProduct';

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
  const branding = await getCachedBranding();
  const featuredProducts = (
    await Promise.all(featuredProductIds.map(id => getMergedProduct(id, products)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const allProducts = await getAllMergedProducts(products);
  const prices = allProducts.map(p => p.price).filter(p => p > 0);
  const priceRange = prices.length
    ? `Rp ${Math.min(...prices).toLocaleString('id-ID')} – Rp ${Math.max(...prices).toLocaleString('id-ID')}`
    : undefined;

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
    name: branding.brandName,
    alternateName: branding.legalName,
    description: 'Toko cemilan khas Bogor: Keripik Kimpul Talas Balitung renyah dan Mie Kremes crispy. Halal, tanpa pengawet.',
    url: SITE_URL,
    telephone: `+${branding.whatsappNumber}`,
    image: `${SITE_URL}/icon-512.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: branding.address,
      addressLocality: branding.city,
      addressCountry: 'ID',
    },
    sameAs: [branding.instagramUrl, branding.shopeeUrl, branding.whatsappUrl],
    servesCuisine: 'Snack',
    priceRange,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: branding.brandName,
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

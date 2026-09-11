import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { SITE_URL } from '@/lib/branding';
import { getCachedBranding } from '@/lib/server/branding';
import { imageSrc } from '@/lib/liveProducts';
import { getMergedProduct } from '@/lib/server/getProduct';
import { stripFormatting } from '@/lib/formatted-text';
import ProductDetailClient from './ProductDetailClient';

// Refreshes prerendered metadata/JSON-LD against Postgres periodically, so admin
// edits (name/price/stock/images/...) show up without a full redeploy.
export const revalidate = 300;

const availabilityMap: Record<string, string> = {
  ready: 'https://schema.org/InStock',
  habis: 'https://schema.org/OutOfStock',
  open_po: 'https://schema.org/PreOrder',
};

export function generateStaticParams() {
  return products.map(product => ({ id: product.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const [product, branding] = await Promise.all([
    getMergedProduct(id, products),
    getCachedBranding(),
  ]);
  if (!product) return {};

  const title = `${product.name} (${product.weight})`;
  const imagePath = product.images?.[0] ? imageSrc(product.images[0]) : undefined;
  const plainDescription = stripFormatting(product.description);

  return {
    title,
    description: plainDescription,
    keywords: [product.name, `beli ${product.name.toLowerCase()}`, `${product.name.toLowerCase()} bogor`, product.category],
    openGraph: {
      title: `${title} | ${branding.brandName}`,
      description: plainDescription,
      url: `${SITE_URL}/products/${product.id}`,
      images: imagePath ? [{ url: imagePath }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${branding.brandName}`,
      description: plainDescription,
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.id}`,
    },
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [product, branding] = await Promise.all([
    getMergedProduct(id, products),
    getCachedBranding(),
  ]);
  if (!product) notFound();

  const imagePath = product.images?.[0] ? imageSrc(product.images[0]) : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripFormatting(product.description),
    category: product.category,
    image: imagePath ? `${SITE_URL}${imagePath}` : undefined,
    brand: { '@type': 'Brand', name: branding.brandName },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'IDR',
      price: product.price,
      availability: availabilityMap[product.stock] ?? 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient />
    </>
  );
}

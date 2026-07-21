import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';
import ProductDetailClient from './ProductDetailClient';

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
  const product = products.find(p => p.id === id);
  if (!product) return {};

  const title = `${product.name} (${product.weight})`;
  const imagePath = product.images?.[0]?.src;

  return {
    title,
    description: product.description,
    keywords: [product.name, `beli ${product.name.toLowerCase()}`, `${product.name.toLowerCase()} bogor`, product.category],
    openGraph: {
      title: `${title} | Cemilan Teh Risma`,
      description: product.description,
      url: `${SITE_URL}/products/${product.id}`,
      images: imagePath ? [{ url: imagePath }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Cemilan Teh Risma`,
      description: product.description,
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
  const product = products.find(p => p.id === id);
  if (!product) notFound();

  const imagePath = product.images?.[0]?.src;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: imagePath ? `${SITE_URL}${imagePath}` : undefined,
    brand: { '@type': 'Brand', name: 'Cemilan Teh Risma' },
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

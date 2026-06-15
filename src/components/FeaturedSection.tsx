'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/products';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from './ProductCard';

export default function FeaturedSection() {
  const featured = getFeaturedProducts();
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-14"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-amber-500" />
            <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase">
              {t.featured.badge}
            </p>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-amber-950">{t.featured.title1} </span>
            <span className="gradient-text">{t.featured.title2}</span>
          </h2>
          <p className="text-amber-800/55 text-sm sm:text-base mt-1.5 max-w-md">
            {t.featured.subtitle}
          </p>
        </div>

        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-outline flex items-center gap-2 px-5 py-2.5 text-sm font-semibold flex-shrink-0"
          >
            {t.featured.seeAll} <ArrowRight size={14} />
          </motion.button>
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8ED 50%, #FFF3E0 100%)',
          border: '1.5px solid rgba(217,119,6,0.2)',
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-6 opacity-10 pointer-events-none">
          <span className="text-9xl sm:text-[10rem]">🥔</span>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-amber-950 mb-2">
              {t.featured.ctaTitle.split('WhatsApp')[0]}
              <span className="gradient-text">WhatsApp</span>
              {t.featured.ctaTitle.split('WhatsApp')[1] ?? ''}
            </h3>
            <p className="text-amber-800/60 text-sm sm:text-base max-w-sm">
              {t.featured.ctaDesc}
            </p>
          </div>
          <Link href="/products" className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-6 py-3 text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              {t.featured.ctaBtn} <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

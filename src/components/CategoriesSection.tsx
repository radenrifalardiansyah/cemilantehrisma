'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoryData } from '@/lib/products';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CategoriesSection() {
  const { t } = useLanguage();

  const catNames = t.footer.categories;
  const catDescs: Record<string, string> = {
    mie: t.categories.descMie,
    keripik: t.categories.descKeripik,
    snack: t.categories.descSnack,
    paket: t.categories.descPaket,
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-14"
      >
        <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-3">
          {t.categories.badge}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className="text-amber-950">{t.categories.title1} </span>
          <span className="gradient-text">{t.categories.title2}</span>
        </h2>
        <p className="text-amber-800/55 text-sm sm:text-base mt-3 max-w-md mx-auto">
          {t.categories.subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categoryData.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.09 }}
          >
            <Link href={`/products?category=${cat.id}`}>
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 cursor-pointer h-36 sm:h-44 flex flex-col justify-between bg-white border border-amber-100 transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/60 hover:border-amber-200"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} opacity-70`} />

                <motion.span
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }}
                  className="text-4xl sm:text-5xl"
                >
                  {cat.emoji}
                </motion.span>

                <div>
                  <h3 className="font-display font-bold text-amber-950 text-base sm:text-lg leading-tight">
                    {catNames[cat.id as keyof typeof catNames] ?? cat.name}
                  </h3>
                  <p className="text-amber-700/55 text-xs sm:text-sm mt-0.5">
                    {catDescs[cat.id] ?? cat.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-600/55 text-xs">{cat.count} {t.categories.menuCount}</span>
                    <motion.div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={13} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

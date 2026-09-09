'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight, Package, MapPin } from 'lucide-react';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductLocale } from '@/lib/product-translations';
import { useLiveProducts } from '@/lib/useLiveProducts';
import { useReviewStats } from '@/lib/useReviewStats';
import { useLiveBranding } from '@/lib/useLiveBranding';

import imgOriOri100  from '@/assets/images/Keripik Kimpul 100g Original.png';
import imgOriBBQ100  from '@/assets/images/Keripik Kimpul 100g BBQ Pedas.png';
import imgOriJgn100  from '@/assets/images/Keripik Kimpul 100g Jagung.png';
import imgMieOri150  from '@/assets/images/Mie Kremes 150g Original.png';
import imgMiePdas150 from '@/assets/images/Mie Kremes 150g Pedas.png';

// Presentational-only styling per slide (not admin-editable). Name/price/weight/badge
// are pulled live from the product catalog below so the hero always matches the admin.
const slideMeta = [
  { productId: 'mk-ori-150', image: imgMieOri150, badgeColor: '#16A34A', glow: 'rgba(194,65,12,0.28)', bg: 'from-green-100 to-green-50', group: 'mie' as const },
  { productId: 'mk-pdas-150', image: imgMiePdas150, badgeColor: '#BE123C', glow: 'rgba(190,18,60,0.25)', bg: 'from-rose-100 to-pink-50', group: 'mie' as const },
  { productId: 'kk-ori-100', image: imgOriOri100, badgeColor: '#16A34A', glow: 'rgba(22,163,74,0.35)', bg: 'from-green-100 to-green-50', group: 'keripik' as const },
  { productId: 'kk-bbq-100', image: imgOriBBQ100, badgeColor: '#B91C1C', glow: 'rgba(185,28,28,0.25)', bg: 'from-red-100 to-green-50', group: 'keripik' as const },
  { productId: 'kk-jgn-100', image: imgOriJgn100, badgeColor: '#CA8A04', glow: 'rgba(202,138,4,0.3)', bg: 'from-yellow-100 to-green-50', group: 'keripik' as const },
  // Basreng is Firestore-only (admin-added, no bundled static entry), so the fallback
  // image points at its live Cloudinary photo instead of a local static import.
  { productId: 'Fj3ix8FZucBIdiwMIiLh', image: 'https://res.cloudinary.com/jygooie9/image/upload/v1787195035/uploads/ddm0pomh7zj4smplx51q.jpg', badgeColor: '#0369A1', glow: 'rgba(3,105,161,0.25)', bg: 'from-sky-100 to-cyan-50', group: 'basreng' as const },
  { productId: 'NrLK4gFF0gQr81Yt3KjF', image: 'https://res.cloudinary.com/jygooie9/image/upload/v1787193959/uploads/syst2uyvzznjxqroywal.jpg', badgeColor: '#0F766E', glow: 'rgba(15,118,110,0.25)', bg: 'from-teal-100 to-emerald-50', group: 'basreng' as const },
];

const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;


export default function Hero() {
  const { t, locale } = useLanguage();
  const branding = useLiveBranding();
  const liveProducts = useLiveProducts();
  const { soldCount, reviewCount, rating } = useReviewStats();

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const slides = slideMeta
    .map(meta => {
      const product = liveProducts.find(p => p.id === meta.productId);
      if (!product) return null;
      return {
        ...meta,
        image: product.images?.[0] ?? meta.image,
        name: product.name,
        weight: product.weight,
        price: formatPrice(product.price),
        badge: product.badge ?? 'New',
      };
    })
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const slide = slides[current] ?? slides[0];
  const slideDisplayName = getProductLocale(slide.productId, locale, { name: slide.name, description: '', details: [] }).name;

  const cheapestPriceIn = (group: 'mie' | 'keripik' | 'basreng') => {
    const prices = slides.filter(s => s.group === group).map(s =>
      liveProducts.find(p => p.id === s.productId)?.price ?? 0
    );
    return prices.length ? formatPrice(Math.min(...prices)) : '';
  };
  const cheapestPriceOverall = () => {
    const prices = liveProducts.map(p => p.price).filter(p => p > 0);
    return prices.length ? formatPrice(Math.min(...prices)) : '';
  };

  const groupContent = {
    keripik: {
      title1: t.hero.keripik.title1, title2: t.hero.keripik.title2,
      sub1: t.hero.keripik.sub1, sub2: t.hero.keripik.sub2,
      flavors: [
        { emoji: '🥔', label: t.hero.keripik.flavors[0], dot: '#16A34A' },
        { emoji: '🌶️', label: t.hero.keripik.flavors[1], dot: '#DC2626' },
        { emoji: '🌽', label: t.hero.keripik.flavors[2], dot: '#CA8A04' },
      ],
      desc: t.hero.keripik.desc, price: cheapestPriceIn('keripik'),
    },
    mie: {
      title1: t.hero.mie.title1, title2: t.hero.mie.title2,
      sub1: t.hero.mie.sub1, sub2: t.hero.mie.sub2,
      flavors: [
        { emoji: '🍝', label: t.hero.mie.flavors[0], dot: '#16A34A' },
        { emoji: '🌶️', label: t.hero.mie.flavors[1], dot: '#DC2626' },
      ],
      desc: t.hero.mie.desc, price: cheapestPriceIn('mie'),
    },
    basreng: {
      title1: t.hero.basreng.title1, title2: t.hero.basreng.title2,
      sub1: t.hero.basreng.sub1, sub2: t.hero.basreng.sub2,
      flavors: [
        { emoji: '🥩', label: t.hero.basreng.flavors[0], dot: '#16A34A' },
        { emoji: '🌶️', label: t.hero.basreng.flavors[1], dot: '#DC2626' },
      ],
      desc: t.hero.basreng.desc, price: cheapestPriceIn('basreng'),
    },
  };

  const stats = [
    { value: `${soldCount}`, label: t.hero.stats.sold, Icon: Package },
    ...(reviewCount > 0 ? [{ value: `${rating?.toFixed(1)}★`, label: t.hero.stats.rating, Icon: Star }] : []),
    { value: `${liveProducts.length}`, label: t.hero.stats.variants, Icon: ShoppingBag },
    { value: 'Bogor', label: t.hero.stats.location, Icon: MapPin },
  ];

  const content = groupContent[slide.group as keyof typeof groupContent];

  const next = useCallback(() => {
    setDir(1);
    setCurrent(i => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setDir(-1);
    setCurrent(i => (i - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, scale: 0.92 }),
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 85% 20%, rgba(22,163,74,0.08) 0%, transparent 60%), #FFFFFF',
      }}
    >
      {/* Decorative blob — satu titik hijau lembut, bukan campuran warna */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.14) 0%, transparent 70%)' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #16A34A 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── LEFT ─────────────────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-green-100 border border-green-300/60 text-neutral-700 text-sm font-semibold mb-5"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-green-300/60 flex-shrink-0">
                <Image src={logo} alt="Karya Putra" fill className="object-cover" />
              </div>
              {t.hero.brand(branding.brandName)}
            </motion.div>

            {/* Headline — berubah sesuai group produk */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${slide.group}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-3"
              >
                <span className="text-neutral-950">{content.title1} </span>
                <span className="gradient-text">{content.title2}</span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl text-neutral-800">{content.sub1} </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl text-neutral-600">{content.sub2}</span>
              </motion.h1>
            </AnimatePresence>

            {/* Flavor chips — berubah sesuai group produk */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`chips-${slide.group}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-5"
              >
                {content.flavors.map((f, i) => (
                  <motion.span
                    key={f.label}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, type: 'spring' }}
                    className="chip px-3 py-1.5 text-xs"
                  >
                    <span className="chip-dot" style={{ background: f.dot }} />
                    <span>{f.emoji}</span>
                    {f.label}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-neutral-600/60 text-xs font-medium"
                >
                  {t.hero.savingsAvailable}
                </motion.span>
              </motion.div>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${slide.group}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-neutral-800/65 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                {content.desc} <strong className="text-neutral-700">{content.price}</strong>.
              </motion.p>
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-7"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold shadow-lg w-full sm:w-auto"
                >
                  <ShoppingBag size={17} />
                  {t.hero.orderNow}
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold w-full sm:w-auto"
                >
                  {t.hero.seeAll}
                </motion.button>
              </Link>
            </motion.div>

            {/* Rating — hanya tampil kalau sudah ada ulasan asli dari customer */}
            {reviewCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-2"
              >
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i} size={14}
                      className={i <= Math.round(rating ?? 0) ? 'text-neutral-400 fill-green-400' : 'text-neutral-200 fill-green-200'}
                    />
                  ))}
                </div>
                <span className="text-neutral-700/60 text-sm font-medium">
                  {rating?.toFixed(1)}/5 · {reviewCount} {t.hero.reviewsLabel}
                </span>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT — Product Slider ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative w-full max-w-sm">

              {/* Glow blob behind card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${current}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-3xl pointer-events-none blur-2xl scale-90"
                  style={{ background: `radial-gradient(circle, ${slide.glow} 0%, transparent 70%)` }}
                />
              </AnimatePresence>

              {/* Main card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/10 border border-green-100 overflow-hidden">

                {/* Image area */}
                <div className={`relative h-64 sm:h-72 bg-gradient-to-br ${slide.bg} overflow-hidden`}>
                  <AnimatePresence custom={dir} mode="wait">
                    <motion.div
                      key={current}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-8"
                    >
                      <Image
                        src={slide.image}
                        alt={slideDisplayName}
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 640px) 100vw, 400px"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Badge */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`badge-${current}`}
                      initial={{ opacity: 0, scale: 0.7, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                      style={{ background: slide.badgeColor }}
                    >
                      {slide.badge === 'Best Seller' ? t.badge.bestSeller : slide.badge === 'Popular' ? t.badge.popular : t.badge.new}
                    </motion.div>
                  </AnimatePresence>

                  {/* Prev / Next */}
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-neutral-700 transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-neutral-700 transition-all backdrop-blur-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Info area */}
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${current}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-display text-base font-bold text-neutral-950 leading-tight">
                          {slideDisplayName}
                        </h3>
                        <span className="text-xs text-neutral-600/70 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                          {slide.weight}
                        </span>
                      </div>
                      <p className="font-display text-xl font-bold gradient-text">{slide.price}</p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dot indicators */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === current ? 20 : 6,
                            height: 6,
                            background: i === current ? slide.badgeColor : 'rgba(22,163,74,0.2)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-600/50">{current + 1} / {slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Floating price card */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -left-6 top-8 bg-white rounded-2xl p-3 border border-green-200 shadow-lg z-10"
              >
                <p className="text-[10px] text-neutral-600/60">{t.hero.priceFrom}</p>
                <p className="font-display text-sm font-bold text-neutral-800">{cheapestPriceOverall()}</p>
              </motion.div>

              {/* Floating rating card — hanya tampil kalau sudah ada ulasan asli */}
              {reviewCount > 0 && (
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [1, -1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                  className="absolute -right-6 bottom-20 bg-white rounded-2xl p-3 border border-green-200 shadow-lg z-10"
                >
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={8} className={s <= Math.round(rating ?? 0) ? 'text-neutral-400 fill-green-400' : 'text-neutral-200 fill-green-200'} />
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-800/70 font-semibold">
                    {soldCount} {t.hero.soldSuffix}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={`mt-16 grid gap-4 ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-green-100 shadow-sm hover:shadow-md hover:shadow-black/5 transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-2">
                <s.Icon size={18} className="text-green-700" strokeWidth={2.2} />
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-neutral-700/55 text-xs sm:text-sm mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-500/50"
      >
        <span className="text-xs">{t.hero.scroll}</span>
        <div className="w-px h-8 bg-gradient-to-b from-green-400/50 to-transparent" />
      </motion.div>
    </section>
  );
}

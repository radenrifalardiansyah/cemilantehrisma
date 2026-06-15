'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductLocale } from '@/lib/product-translations';

import imgOriOri100  from '@/assets/images/Keripik Kimpul 100g Original.png';
import imgOriBBQ100  from '@/assets/images/Keripik Kimpul 100g BBQ Pedas.png';
import imgOriJgn100  from '@/assets/images/Keripik Kimpul 100g Jagung.png';
import imgMieOri150  from '@/assets/images/Mie Kremes 150g Original.png';
import imgMiePdas150 from '@/assets/images/Mie Kremes 150g Pedas.png';

const slides = [
  {
    productId: 'mk-ori-150',
    image: imgMieOri150,
    name: 'Mie Kremes Original',
    weight: '150g',
    price: 'Rp 10.000',
    badge: 'Best Seller',
    badgeColor: '#C2410C',
    glow: 'rgba(194,65,12,0.28)',
    bg: 'from-orange-100 to-amber-50',
    group: 'mie',
  },
  {
    productId: 'mk-pdas-150',
    image: imgMiePdas150,
    name: 'Mie Kremes Pedas',
    weight: '150g',
    price: 'Rp 10.000',
    badge: 'Popular',
    badgeColor: '#BE123C',
    glow: 'rgba(190,18,60,0.25)',
    bg: 'from-rose-100 to-pink-50',
    group: 'mie',
  },
  {
    productId: 'kk-ori-100',
    image: imgOriOri100,
    name: 'Keripik Kimpul Original',
    weight: '100g',
    price: 'Rp 15.000',
    badge: 'Best Seller',
    badgeColor: '#D97706',
    glow: 'rgba(217,119,6,0.35)',
    bg: 'from-amber-100 to-amber-50',
    group: 'keripik',
  },
  {
    productId: 'kk-bbq-100',
    image: imgOriBBQ100,
    name: 'Keripik Kimpul BBQ Pedas',
    weight: '100g',
    price: 'Rp 15.000',
    badge: 'Popular',
    badgeColor: '#B91C1C',
    glow: 'rgba(185,28,28,0.25)',
    bg: 'from-red-100 to-orange-50',
    group: 'keripik',
  },
  {
    productId: 'kk-jgn-100',
    image: imgOriJgn100,
    name: 'Keripik Kimpul Jagung',
    weight: '100g',
    price: 'Rp 15.000',
    badge: 'New',
    badgeColor: '#CA8A04',
    glow: 'rgba(202,138,4,0.3)',
    bg: 'from-yellow-100 to-amber-50',
    group: 'keripik',
  },
];

const particles = ['🥔', '🌶️', '🌽', '✨', '⭐', '🌿', '💫'];

function Particle({ index }: { index: number }) {
  const emoji = particles[index % particles.length];
  const delay = (index * 1.1) % 8;
  const duration = 9 + (index % 5);
  const left = (index * 13.7) % 100;
  const size = 12 + (index % 3) * 5;
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${left}%`, bottom: '-30px', fontSize: size, opacity: 0 }}
      animate={{ y: [0, -900], opacity: [0, 0.4, 0.4, 0], rotate: [0, index % 2 === 0 ? 270 : -270] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      {emoji}
    </motion.div>
  );
}


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const { t, locale } = useLanguage();

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const slide = slides[current];
  const slideDisplayName = getProductLocale(slide.productId, locale, { name: slide.name, description: '', details: [] }).name;

  const groupContent = {
    keripik: {
      title1: t.hero.keripik.title1, title2: t.hero.keripik.title2,
      sub1: t.hero.keripik.sub1, sub2: t.hero.keripik.sub2,
      flavors: [
        { emoji: '🥔', label: t.hero.keripik.flavors[0], bg: 'bg-amber-100', text: 'text-amber-800' },
        { emoji: '🌶️', label: t.hero.keripik.flavors[1], bg: 'bg-red-100',   text: 'text-red-700'   },
        { emoji: '🌽', label: t.hero.keripik.flavors[2], bg: 'bg-yellow-100', text: 'text-yellow-700' },
      ],
      desc: t.hero.keripik.desc, price: 'Rp 15.000',
    },
    mie: {
      title1: t.hero.mie.title1, title2: t.hero.mie.title2,
      sub1: t.hero.mie.sub1, sub2: t.hero.mie.sub2,
      flavors: [
        { emoji: '🍜', label: t.hero.mie.flavors[0], bg: 'bg-orange-100', text: 'text-orange-800' },
        { emoji: '🌶️', label: t.hero.mie.flavors[1], bg: 'bg-red-100',   text: 'text-red-700'    },
      ],
      desc: t.hero.mie.desc, price: 'Rp 10.000',
    },
  };

  const stats = [
    { value: '23+', label: t.hero.stats.sold, icon: '📦' },
    { value: '4.9★', label: t.hero.stats.rating, icon: '⭐' },
    { value: '5', label: t.hero.stats.variants, icon: '🛒' },
    { value: 'Bogor', label: t.hero.stats.location, icon: '📍' },
  ];

  const content = groupContent[slide.group as keyof typeof groupContent];

  const next = useCallback(() => {
    setDir(1);
    setCurrent(i => (i + 1) % slides.length);
  }, []);

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
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 15% 60%, rgba(251,191,36,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 85% 25%, rgba(217,119,6,0.09) 0%, transparent 60%), #FFFBF5',
      }}
    >
      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.1) 0%, transparent 70%)' }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }, (_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <motion.div
        style={{ y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── LEFT ─────────────────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 text-amber-700 text-sm font-semibold mb-5"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-300/60 flex-shrink-0">
                <Image src={logo} alt="Teh Risma" fill className="object-cover" />
              </div>
              {t.hero.brand}
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
                <span className="text-amber-950">{content.title1} </span>
                <span className="gradient-text">{content.title2}</span>
                <br />
                <span className="text-amber-800">{content.sub1} </span>
                <span className="text-amber-600">{content.sub2}</span>
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${f.bg} ${f.text} border border-current/20`}
                  >
                    <span>{f.emoji}</span>
                    {f.label}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-amber-600/60 text-xs font-medium"
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
                className="text-amber-800/65 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                {content.desc} <strong className="text-amber-700">{content.price}</strong>.
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

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-2"
            >
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-amber-700/60 text-sm font-medium">
                {t.hero.ratingText}
              </span>
            </motion.div>
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
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-amber-200/50 border border-amber-100 overflow-hidden">

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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-amber-700 transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-amber-700 transition-all backdrop-blur-sm"
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
                        <h3 className="font-display text-base font-bold text-amber-950 leading-tight">
                          {slideDisplayName}
                        </h3>
                        <span className="text-xs text-amber-600/70 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
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
                            background: i === current ? slide.badgeColor : 'rgba(217,119,6,0.2)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-amber-600/50">{current + 1} / {slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Floating price card */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -left-6 top-8 bg-white rounded-2xl p-3 border border-amber-200 shadow-lg z-10"
              >
                <p className="text-[10px] text-amber-600/60">{t.hero.priceFrom}</p>
                <p className="font-display text-sm font-bold text-amber-800">Rp 10.000</p>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [1, -1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                className="absolute -right-6 bottom-20 bg-white rounded-2xl p-3 border border-amber-200 shadow-lg z-10"
              >
                <div className="flex gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={8} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[10px] text-amber-800/70 font-semibold">{t.hero.sold}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-amber-100 shadow-sm hover:shadow-md hover:shadow-amber-100 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl mb-1.5">{s.icon}</div>
              <div className="font-display text-xl sm:text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-amber-700/55 text-xs sm:text-sm mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-amber-500/50"
      >
        <span className="text-xs">{t.hero.scroll}</span>
        <div className="w-px h-8 bg-gradient-to-b from-amber-400/50 to-transparent" />
      </motion.div>
    </section>
  );
}

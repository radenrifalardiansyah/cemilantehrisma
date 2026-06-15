'use client';

import { useParams, useRouter } from 'next/navigation';
import { products } from '@/lib/products';
import { getProductLocale } from '@/lib/product-translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, ShoppingCart, Plus, Weight,
  CheckCircle2, CheckCircle, XCircle, Clock3,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/whatsapp';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

function translateBadge(badge: string, t: import('@/lib/i18n').Translation): string {
  if (badge === 'Best Seller') return t.badge.bestSeller;
  if (badge === 'Popular') return t.badge.popular;
  if (badge === 'New') return t.badge.new;
  return badge;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { addItem, openCart } = useCartStore();

  const product = products.find(p => p.id === params.id);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgDir, setImgDir] = useState(1);
  const dragX = useMotionValue(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-amber-50">
        <span className="text-6xl">😕</span>
        <p className="text-amber-800 font-semibold">{t.product.notFound}</p>
        <button
          onClick={() => router.push('/products')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white font-semibold text-sm"
        >
          <ArrowLeft size={16} /> {t.product.back}
        </button>
      </div>
    );
  }

  const lp = getProductLocale(product.id, locale, product);
  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  const stockConfig = {
    ready:   { label: t.product.available,  Icon: CheckCircle, color: '#16A34A', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.25)'  },
    habis:   { label: t.product.outOfStock, Icon: XCircle,     color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.22)'  },
    open_po: { label: t.product.openPO,     Icon: Clock3,      color: '#D97706', bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.25)'  },
  };
  const stock = stockConfig[product.stock];
  const isAvailable = product.stock === 'ready' || product.stock === 'open_po';

  const goTo = (index: number, dir: number) => { setImgDir(dir); setImgIndex(index); };
  const prev = () => goTo((imgIndex - 1 + images.length) % images.length, -1);
  const next = () => goTo((imgIndex + 1) % images.length, 1);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
    dragX.set(0);
  };

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem(product);
    toast.success(`${lp.name} (${product.weight}) ${t.product.added}!`, { icon: product.emoji });
    openCart();
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const Carousel = (
    <div>
      {/* Main image */}
      <div
        className="relative bg-white overflow-hidden rounded-none md:rounded-2xl md:border md:border-amber-100 md:shadow-sm"
        style={{ height: 'clamp(280px, 55vw, 460px)' }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient} z-10 md:rounded-t-2xl`} />

        {images.length > 0 ? (
          <>
            <AnimatePresence initial={false} custom={imgDir}>
              <motion.div
                key={imgIndex}
                custom={imgDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                drag={hasMultiple ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
              >
                <Image
                  src={images[imgIndex]}
                  alt={`${lp.name} — ${t.product.imageOf} ${imgIndex + 1}`}
                  fill
                  className="object-contain p-6"
                  style={product.stock === 'habis' ? { filter: 'grayscale(40%)' } : {}}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {hasMultiple && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm">
                  <ChevronRight size={18} />
                </button>
                <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {imgIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.span
              animate={{ rotate: [0, 4, -4, 0], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-8xl select-none"
              style={{ filter: `drop-shadow(0 6px 16px ${product.bgColor}60)` }}
            >
              {product.emoji}
            </motion.span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="bg-white md:bg-transparent border-b border-amber-100 md:border-0 py-3 px-4 flex items-center justify-center gap-3 md:mt-3 md:justify-start">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > imgIndex ? 1 : -1)}
              className="relative rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
              style={{
                width: i === imgIndex ? 58 : 48,
                height: i === imgIndex ? 58 : 48,
                borderColor: i === imgIndex ? product.bgColor : 'rgba(0,0,0,0.1)',
                opacity: i === imgIndex ? 1 : 0.5,
              }}
            >
              <Image src={img} alt={`thumb ${i + 1}`} fill className="object-contain p-1 bg-white" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const Info = (
    <div className="px-4 pt-5 pb-4 md:px-0 md:pt-0">
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {product.badge && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
            product.badge === 'Best Seller' ? 'badge-best' :
            product.badge === 'Popular' ? 'badge-popular' : 'badge-new'
          }`}>
            {translateBadge(product.badge, t)}
          </span>
        )}
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
          <Weight size={10} /> {product.weight}
        </span>
        <span className="text-xs text-amber-500 capitalize bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
          {product.category}
        </span>
        <span
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ background: stock.bg, border: `1px solid ${stock.border}`, color: stock.color }}
        >
          <stock.Icon size={10} /> {stock.label}
        </span>
      </div>

      {/* Name */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-amber-950 leading-tight mb-3">
        {lp.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-5">
        <span className="font-display text-3xl md:text-4xl font-bold gradient-text">
          {formatCurrency(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-amber-400 text-base line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Hemat {formatCurrency(product.originalPrice - product.price)}
            </span>
          </>
        )}
      </div>

      <div className="h-px bg-amber-100 mb-4" />

      {/* Description */}
      <p className="text-amber-800/75 text-sm leading-relaxed mb-5">
        {lp.description}
      </p>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4 mb-6">
        <h3 className="font-display font-bold text-amber-900 text-sm mb-3">{t.product.detailProduct}</h3>
        <ul className="space-y-2.5">
          {lp.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: product.bgColor }} />
              <span className="text-amber-800/70 text-sm leading-snug">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop CTA */}
      <motion.button
        whileHover={isAvailable ? { scale: 1.02 } : {}}
        whileTap={isAvailable ? { scale: 0.97 } : {}}
        onClick={handleAdd}
        disabled={!isAvailable}
        className={`hidden md:flex w-full items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold shadow-lg transition-all ${
          isAvailable ? 'btn-primary' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
        }`}
      >
        <Plus size={17} />
        <ShoppingCart size={17} />
        <span>{t.product.addToCart}</span>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <Cart />

      {/* Mobile sticky top bar */}
      <div className="sticky top-16 z-30 bg-amber-50/90 backdrop-blur-md border-b border-amber-100 md:hidden">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-amber-200 text-amber-700 flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-bold text-amber-900 text-sm line-clamp-1 flex-1">
            {lp.name}
          </h2>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        className="pt-16 md:pt-20 pb-36 md:pb-16"
      >
        {/* Desktop breadcrumb */}
        <div className="hidden md:block max-w-5xl mx-auto px-8 pt-6 pb-4">
          <nav className="flex items-center gap-2 text-sm text-amber-500">
            <Link href="/" className="hover:text-amber-800 transition-colors">{t.nav.home}</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-amber-800 transition-colors">{t.nav.menu}</Link>
            <ChevronRight size={14} />
            <span className="text-amber-900 font-medium line-clamp-1">{lp.name}</span>
          </nav>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden">
          {Carousel}
          {Info}
        </div>

        {/* Desktop: two columns */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-10 md:items-start max-w-5xl mx-auto px-8 pb-8">
          <div className="sticky top-24">{Carousel}</div>
          <div>{Info}</div>
        </div>
      </motion.main>

      {/* Mobile sticky bottom CTA */}
      <div className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100 shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            {product.originalPrice && (
              <p className="text-amber-400 text-xs line-through leading-none">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
            <p className="font-display text-xl font-bold gradient-text leading-tight">
              {formatCurrency(product.price)}
            </p>
          </div>
          <motion.button
            whileHover={isAvailable ? { scale: 1.03 } : {}}
            whileTap={isAvailable ? { scale: 0.96 } : {}}
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all ${
              isAvailable ? 'btn-primary' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <Plus size={15} />
            <ShoppingCart size={15} />
            <span>{t.product.addToCart}</span>
          </motion.button>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}

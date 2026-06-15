'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Weight, CheckCircle2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/whatsapp';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductLocale } from '@/lib/product-translations';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  index?: number;
}

const badgeClass: Record<string, string> = {
  Popular: 'badge-popular',
  New: 'badge-new',
  'Best Seller': 'badge-best',
};

function translateBadge(badge: string, t: import('@/lib/i18n').Translation): string {
  if (badge === 'Best Seller') return t.badge.bestSeller;
  if (badge === 'Popular') return t.badge.popular;
  if (badge === 'New') return t.badge.new;
  return badge;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCartStore();
  const { t, locale } = useLanguage();
  const lp = getProductLocale(product.id, locale, product);

  const stockConfig = {
    ready:   { label: t.product.available,  Icon: CheckCircle, color: '#16A34A', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.25)'  },
    habis:   { label: t.product.outOfStock, Icon: XCircle,    color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.22)'  },
    open_po: { label: t.product.openPO,    Icon: Clock3,      color: '#ffffff', bg: 'linear-gradient(135deg, #D97706, #EA580C)', border: 'transparent' },
  };
  const [imgIndex, setImgIndex] = useState(0);
  const [imgDir, setImgDir] = useState(1);

  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [7, -7]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-7, 7]), { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const isAvailable = product.stock === 'ready' || product.stock === 'open_po';
  const stock = stockConfig[product.stock];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    addItem(product);
    toast.success(`${lp.name} (${product.weight}) ${t.product.added}!`, { icon: product.emoji });
    openCart();
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgDir(-1);
    setImgIndex(i => (i - 1 + images.length) % images.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgDir(1);
    setImgIndex(i => (i + 1) % images.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-amber-100 overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-200/60 hover:border-amber-200 flex flex-col"
    >
      {/* Color top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient} z-10`} />

      {/* Badges */}
      <div className="absolute top-4 right-3 flex flex-col gap-1.5 items-end z-10">
        {product.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.25, type: 'spring' }}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow ${badgeClass[product.badge]}`}
          >
            {translateBadge(product.badge, t)}
          </motion.span>
        )}
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-amber-700 border border-amber-200 shadow-sm">
          <Weight size={9} />
          {product.weight}
        </span>
      </div>

      {/* Image area */}
      <div
        className="relative w-full h-44 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.bgColor}12, ${product.bgColor}06)` }}
      >
        {/* Stock badge — top-left inside image */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-sm"
            style={{ background: stock.bg, border: `1px solid ${stock.border}`, color: stock.color, backdropFilter: 'blur(4px)' }}
          >
            <stock.Icon size={10} />
            {stock.label}
          </span>
        </div>
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
                className="absolute inset-0"
              >
                <Image
                  src={images[imgIndex]}
                  alt={lp.name}
                  fill
                  className="object-contain p-3 transition-all duration-300"
                  style={product.stock === 'habis' ? { filter: 'grayscale(60%) opacity(0.75)' } : {}}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows — hanya muncul saat hover dan ada multiple */}
            {hasMultiple && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {hasMultiple && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setImgDir(i > imgIndex ? 1 : -1); setImgIndex(i); }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === imgIndex ? 16 : 6,
                      height: 6,
                      background: i === imgIndex ? product.bgColor : 'rgba(0,0,0,0.25)',
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.span
              animate={{ rotate: [0, 4, -4, 0], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: index * 0.3 }}
              className="text-6xl sm:text-7xl select-none"
              style={{ filter: `drop-shadow(0 4px 12px ${product.bgColor}60)` }}
            >
              {product.emoji}
            </motion.span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-display text-base font-bold text-amber-950 leading-tight line-clamp-2 mb-1">
          {lp.name}
        </h3>

        {/* Description */}
        <p className="text-amber-800/50 text-xs leading-relaxed line-clamp-2 mb-3">
          {lp.description}
        </p>

        {/* Details */}
        <ul className="space-y-1 mb-4 flex-1">
          {lp.details.slice(0, 3).map((detail, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <CheckCircle2
                size={11}
                className="flex-shrink-0 mt-0.5"
                style={{ color: product.bgColor }}
              />
              <span className="text-amber-800/60 text-[11px] leading-snug">{detail}</span>
            </li>
          ))}
        </ul>

        {/* Price + Add */}
        <div className="flex items-end justify-between gap-2 pt-3 border-t border-amber-100">
          <div>
            {product.originalPrice && (
              <p className="text-amber-500/60 text-xs line-through leading-none mb-0.5">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
            <p className="font-display text-lg font-bold gradient-text leading-none">
              {formatCurrency(product.price)}
            </p>
          </div>
          <motion.button
            whileHover={isAvailable ? { scale: 1.08 } : {}}
            whileTap={isAvailable ? { scale: 0.92 } : {}}
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold shadow-md flex-shrink-0 rounded-xl transition-all ${
              isAvailable
                ? 'btn-primary'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <Plus size={14} />
            <ShoppingCart size={13} />
          </motion.button>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

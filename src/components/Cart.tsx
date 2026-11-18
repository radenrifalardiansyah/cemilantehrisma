'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/whatsapp';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductLocale } from '@/lib/product-translations';
import { useDialogA11y } from '@/lib/useDialogA11y';

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalItems, getTotalPrice } =
    useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const { t, locale } = useLanguage();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Escape, focus trap, scroll lock, fokus awal ke tombol tutup, dan fokus kembali ke pemicu.
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  useDialogA11y(isOpen, closeCart, drawerRef, closeBtnRef);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-amber-950/25 backdrop-blur-sm"
          />

          <motion.aside
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-full max-w-sm sm:max-w-md flex flex-col shadow-2xl shadow-amber-200 cart-surface"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={19} className="text-amber-600" />
                <h2 id="cart-title" className="font-display text-lg font-bold text-amber-950">{t.cart.title}</h2>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeCart}
                aria-label="Tutup keranjang"
                className="p-2 rounded-xl hover:bg-amber-100 text-amber-600/70 hover:text-amber-700 transition-colors"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-3" aria-hidden="true">
                      <ShoppingCart size={34} className="text-amber-600" />
                    </div>
                    <p className="font-display text-lg font-semibold text-amber-800/60 mb-1">
                      {t.cart.empty}
                    </p>
                    <p className="text-amber-700/40 text-sm mb-4">{t.cart.emptyDesc}</p>
                    <Link href="/products" onClick={closeCart} className="btn-primary px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2">
                      {t.cart.seeMenu} <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </motion.div>
                ) : (
                  items.map(item => {
                    const lp = getProductLocale(item.product.id, locale, item.product);
                    return (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ type: 'spring', damping: 22 }}
                      className="bg-white rounded-2xl p-3.5 border border-amber-100 hover:border-amber-200 transition-colors shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-100">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={lp.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-2xl"
                              style={{ background: `radial-gradient(circle, ${item.product.bgColor}18, transparent)` }}
                            >
                              {item.product.emoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-display text-sm font-semibold text-amber-950 leading-tight line-clamp-2">
                              {lp.name}
                            </p>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Hapus ${lp.name} dari keranjang`}
                              className="relative before:absolute before:-inset-3 before:content-[''] p-1 rounded-lg text-red-400/60 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={13} aria-hidden="true" />
                            </button>
                          </div>
                          <p className="text-amber-600 text-sm font-bold mt-0.5">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label={`Kurangi jumlah ${lp.name}`}
                              className="relative before:absolute before:-inset-2 before:content-[''] w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200 transition-colors"
                            >
                              <Minus size={11} aria-hidden="true" />
                            </motion.button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.7 }}
                              animate={{ scale: 1 }}
                              className="min-w-[24px] text-center text-amber-950 text-sm font-bold"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label={`Tambah jumlah ${lp.name}`}
                              className="relative before:absolute before:-inset-2 before:content-[''] w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white border border-amber-500 transition-colors"
                            >
                              <Plus size={11} aria-hidden="true" />
                            </motion.button>
                            <span className="text-amber-600/40 text-xs ml-1">
                              × {formatCurrency(item.product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );})
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-4 border-t border-amber-100 space-y-3"
                >
                  <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                    <div className="flex justify-between text-sm text-amber-700/60 mb-1.5">
                      <span>{totalItems} {t.cart.item}</span>
                      <span>{t.cart.subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800/70 text-sm">{t.cart.total}</span>
                      <motion.span
                        key={totalPrice}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="font-display text-xl font-bold gradient-text"
                      >
                        {formatCurrency(totalPrice)}
                      </motion.span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                  >
                    <ShoppingBag size={17} aria-hidden="true" />
                    {t.cart.checkout}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

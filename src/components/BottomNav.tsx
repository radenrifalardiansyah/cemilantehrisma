'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, ShoppingCart, MapPin, Users } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { t } = useLanguage();

  const allItems = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/products', label: t.nav.menu, icon: LayoutGrid },
    { href: '/reseller', label: t.nav.reseller, icon: Users },
    { href: '__cart__', label: t.nav.cart, icon: ShoppingCart },
    { href: '/kontak', label: t.nav.kontak, icon: MapPin },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="border-t border-amber-200"
        style={{ background: '#FFFBF5', boxShadow: '0 -4px 20px rgba(146,64,14,0.12)' }}
      >
        <div className="flex items-stretch">
          {allItems.map(item => {
            const isCart = item.href === '__cart__';
            const isActive = !isCart && pathname === item.href;
            const Icon = item.icon;

            if (isCart) {
              return (
                <motion.button
                  key="cart"
                  whileTap={{ scale: 0.88 }}
                  onClick={toggleCart}
                  className="relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[60px]"
                >
                  <div className="relative">
                    <Icon
                      size={22}
                      className={totalItems > 0 ? 'text-amber-600' : 'text-amber-400'}
                      strokeWidth={totalItems > 0 ? 2.2 : 2}
                    />
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow"
                        >
                          {totalItems > 9 ? '9+' : totalItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-tight ${
                      totalItems > 0 ? 'text-amber-600' : 'text-amber-400'
                    }`}
                  >
                    {t.nav.cart}
                  </span>
                </motion.button>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="relative flex flex-col items-center justify-center py-3 gap-0.5 min-h-[60px]"
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-pill"
                      className="absolute inset-x-3 top-1.5 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D)' }}
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.45 }}
                    />
                  )}

                  <Icon
                    size={22}
                    className={isActive ? 'text-amber-600' : 'text-amber-800/50'}
                    strokeWidth={isActive ? 2.3 : 2}
                  />
                  <span
                    className={`text-[10px] font-semibold tracking-tight transition-colors ${
                      isActive ? 'text-amber-600' : 'text-amber-800/50'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

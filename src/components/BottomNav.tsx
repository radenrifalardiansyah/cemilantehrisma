'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Users kept for the hidden reseller nav item
import { Home, LayoutGrid, ShoppingCart, Users, BookOpen, Award, MapPin, MoreHorizontal, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { t, locale } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [showCredit, setShowCredit] = useState(false);

  const mainItems = [
    { href: '/',         label: t.nav.home,     icon: Home },
    { href: '/products', label: t.nav.menu,     icon: LayoutGrid },
    // { href: '/reseller', label: t.nav.reseller, icon: Users }, // hidden for now
  ];

  const moreItems = [
    { href: '/panduan', label: t.nav.guide,  icon: BookOpen },
    { href: '/kontak',  label: t.nav.kontak, icon: MapPin },
  ];

  const closeAll = () => setShowAll(false);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-amber-200"
        style={{ background: '#FFFBF5', paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 20px rgba(146,64,14,0.12)' }}
      >
        <div>
          <div className="flex items-stretch">

            {/* Main links */}
            {mainItems.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
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
                    <Icon size={22} className={isActive ? 'text-amber-600' : 'text-amber-800/50'} strokeWidth={isActive ? 2.3 : 2} />
                    <span className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-amber-600' : 'text-amber-800/50'}`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={toggleCart}
              className="relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[60px]"
            >
              <div className="relative">
                <ShoppingCart size={22} className={totalItems > 0 ? 'text-amber-600' : 'text-amber-800/50'} strokeWidth={totalItems > 0 ? 2.2 : 2} />
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
              <span className={`text-[10px] font-semibold tracking-tight ${totalItems > 0 ? 'text-amber-600' : 'text-amber-800/50'}`}>
                {t.nav.cart}
              </span>
            </motion.button>

            {/* Semua / More */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowAll(true)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[60px]"
            >
              <MoreHorizontal size={22} className="text-amber-800/50" strokeWidth={2} />
              <span className="text-[10px] font-semibold tracking-tight text-amber-800/50">{t.nav.all}</span>
            </motion.button>

          </div>
        </div>
      </nav>

      {/* "Semua" sheet */}
      <AnimatePresence>
        {showAll && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
              onClick={closeAll}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden rounded-t-2xl bg-white shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-amber-200" />
              </div>
              <button onClick={closeAll} className="absolute top-3 right-4 p-1.5 rounded-full bg-amber-50 text-amber-600">
                <X size={16} />
              </button>

              <div className="px-5 pt-2 pb-6">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">{t.nav.all}</p>

                {/* More nav items */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {moreItems.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                          isActive ? 'bg-amber-50 border-amber-300' : 'bg-amber-50/50 border-amber-100 hover:border-amber-200'
                        }`}
                      >
                        <Icon size={22} className={isActive ? 'text-amber-600' : 'text-amber-700/60'} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-amber-700' : 'text-amber-700/60'}`}>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Credit button */}
                  <button
                    onClick={() => { setShowAll(false); setShowCredit(true); }}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl border bg-amber-50/50 border-amber-100 hover:border-amber-200 transition-all"
                  >
                    <Award size={22} className="text-amber-700/60" />
                    <span className="text-xs font-semibold text-amber-700/60">{t.nav.credit}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Credit sheet */}
      <AnimatePresence>
        {showCredit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
              onClick={() => setShowCredit(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden rounded-t-2xl bg-white shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-amber-200" />
              </div>
              <button onClick={() => setShowCredit(false)} className="absolute top-3 right-4 p-1.5 rounded-full bg-amber-50 text-amber-600">
                <X size={16} />
              </button>

              <div className="px-5 pt-2 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-amber-600" />
                  <h3 className="font-display font-bold text-amber-900 text-base">
                    {locale === 'en' ? 'About This App' : 'Tentang Aplikasi'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                    <p className="text-[11px] text-amber-600 font-semibold mb-0.5 uppercase tracking-wide">
                      {locale === 'en' ? 'Developed by' : 'Dikembangkan oleh'}
                    </p>
                    <a href="https://eleven-digital.id" target="_blank" rel="noopener noreferrer"
                      className="text-amber-800 font-bold text-sm underline underline-offset-2"
                    >
                      PT. Eleven Digital Indonesia
                    </a>
                    <p className="text-amber-600/70 text-xs mt-0.5">eleven-digital.id</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                    <p className="text-[11px] text-amber-600 font-semibold mb-0.5 uppercase tracking-wide">
                      {locale === 'en' ? 'Supported by' : 'Didukung oleh'}
                    </p>
                    <p className="text-amber-800 font-bold text-sm">PT. RMedia Production</p>
                  </div>
                  <p className="text-center text-amber-400/70 text-[10px] pt-1">© 2026 Cemilan Teh Risma</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

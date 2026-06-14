'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/i18n';
import logo from '@/assets/images/logo-tehrisma.jpeg';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { t, locale, setLocale } = useLanguage();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.menu },
    { href: '/reseller', label: t.nav.reseller },
    { href: '/checkout', label: t.nav.checkout },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-300/60 shadow-md flex-shrink-0"
            >
              <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" />
            </motion.div>
            <div className="leading-none">
              <p className="font-display text-base sm:text-lg font-bold text-amber-800 leading-none">Cemilan</p>
              <p className="font-display text-sm sm:text-base font-bold gradient-text leading-none">Teh Risma</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-amber-700'
                    : 'text-amber-900/60 hover:text-amber-800'
                }`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-amber-100 border border-amber-200"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Language toggle */}
            <div className="flex items-center rounded-xl border border-amber-200 bg-white overflow-hidden shadow-sm">
              {LOCALES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                    locale === l.code
                      ? 'text-white'
                      : 'text-amber-700/60 hover:text-amber-800'
                  }`}
                  style={locale === l.code ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Cart button — desktop only */}
            <div className="relative hidden md:flex">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={toggleCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-bold shadow-md"
              >
                <ShoppingCart size={17} />
                <span>{t.nav.cart}</span>
              </motion.button>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1 shadow pointer-events-none"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile: small cart icon */}
            <div className="relative md:hidden">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={toggleCart}
                className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-sm"
              >
                <ShoppingCart size={18} className="text-amber-700" />
              </motion.button>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge-mobile"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow pointer-events-none"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SplashScreen() {
  // null = belum dicek (cover layar), true = tampilkan, false = sembunyikan
  const [visible, setVisible] = useState<boolean | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);

    const shown = sessionStorage.getItem('splash_shown');
    if (isStandalone && !shown) {
      setVisible(true);
      sessionStorage.setItem('splash_shown', '1');
      setTimeout(() => setVisible(false), 2400);
    } else {
      setVisible(false);
    }
  }, []);

  // Cover layar sebelum useEffect selesai — mencegah konten halaman terlihat sekilas
  if (visible === null) {
    return <div className="fixed inset-0 z-[999]" style={{ background: '#FFFBF5' }} />;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ background: '#FFFBF5' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl mb-6"
            style={{ border: '4px solid #F59E0B' }}
          >
            <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" priority />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="text-center"
          >
            <p
              className="font-display text-3xl font-bold leading-tight"
              style={{ color: '#78350F' }}
            >
              Cemilan
            </p>
            <p
              className="font-display text-3xl font-bold leading-tight"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Teh Risma
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="text-sm mt-3"
            style={{ color: '#B45309' }}
          >
            {t.splash.tagline}
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-1.5 mt-10"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: '#F59E0B' }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

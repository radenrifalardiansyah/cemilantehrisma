'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share } from 'lucide-react';
import logo from '@/assets/images/logo-tehrisma.jpeg';

export default function IOSInstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
    const dismissed = sessionStorage.getItem('ios_banner_dismissed');

    if (isIOS && !isStandalone && !dismissed) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('ios_banner_dismissed', '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="fixed bottom-20 left-3 right-3 z-[70] rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: '#FFFBF5', border: '1.5px solid rgba(217,119,6,0.25)' }}
        >
          {/* Top accent */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D97706, #F59E0B)' }} />

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200">
                <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-amber-950 text-sm leading-tight">
                  Pasang di iPhone kamu!
                </p>
                <p className="text-amber-700/65 text-xs mt-0.5 leading-snug">
                  Akses Cemilan Teh Risma seperti aplikasi, lebih cepat & mudah.
                </p>
              </div>

              {/* Close */}
              <button
                onClick={dismiss}
                className="p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Steps */}
            <div className="mt-3 pt-3 border-t border-amber-100">
              <p className="text-amber-700/55 text-[11px] font-semibold uppercase tracking-wider mb-2">
                Cara pasang:
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Step number={1} text="Tap ikon" icon={<Share size={11} />} />
                <Arrow />
                <Step number={2} text="Tambahkan ke Layar Utama" />
                <Arrow />
                <Step number={3} text="Tap Tambahkan" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Step({ number, text, icon }: { number: number; text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
        style={{ background: '#D97706' }}
      >
        {number}
      </span>
      <span className="text-amber-900 text-[11px] font-medium flex items-center gap-0.5">
        {text} {icon}
      </span>
    </div>
  );
}

function Arrow() {
  return <span className="text-amber-300 text-xs">→</span>;
}

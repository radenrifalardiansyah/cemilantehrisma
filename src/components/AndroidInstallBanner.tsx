'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveBranding } from '@/lib/useLiveBranding';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AndroidInstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { t } = useLanguage();
  const branding = useLiveBranding();

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true);

    if (isStandalone) return;

    const dismissed = sessionStorage.getItem('android_banner_dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('android_banner_dismissed', '1');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
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
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D97706, #F59E0B)' }} />

          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200">
                <Image src={logo} alt={branding.brandName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-amber-950 text-sm leading-tight">
                  {t.pwaAndroid.title}
                </p>
                <p className="text-amber-700/65 text-xs mt-0.5 leading-snug">
                  {t.pwaAndroid.desc(branding.brandName)}
                </p>
              </div>
              <button
                onClick={dismiss}
                className="p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={dismiss}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold border border-amber-200 text-amber-700 transition-colors hover:bg-amber-50"
              >
                {t.pwaAndroid.later}
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-colors"
                style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              >
                <Download size={13} />
                {t.pwaAndroid.install}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

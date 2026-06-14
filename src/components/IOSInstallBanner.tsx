'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, ChevronLeft, ChevronRight, BookOpen, Square, AlertCircle, Copy, Check } from 'lucide-react';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';
import { Translation } from '@/lib/i18n';

type BannerMode = 'safari' | 'other-browser';

export default function IOSInstallBanner() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<BannerMode>('safari');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
    const dismissed = sessionStorage.getItem('ios_banner_dismissed');

    if (!isIOS || isStandalone || dismissed) return;

    const isNotSafari = /CriOS|FxiOS|OPiOS|EdgiOS|DuckDuckGo/.test(ua);
    setMode(isNotSafari ? 'other-browser' : 'safari');
    setTimeout(() => setShow(true), 2000);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('ios_banner_dismissed', '1');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
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
                <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-amber-950 text-sm leading-tight">
                  {t.pwa.title}
                </p>
                <p className="text-amber-700/65 text-xs mt-0.5 leading-snug">
                  {t.pwa.desc}
                </p>
              </div>
              <button
                onClick={dismiss}
                className="p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {mode === 'other-browser' ? (
              <OtherBrowserGuide t={t} onCopy={copyLink} copied={copied} />
            ) : (
              <SafariGuide t={t} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OtherBrowserGuide({ t, onCopy, copied }: { t: Translation; onCopy: () => void; copied: boolean }) {
  return (
    <div className="mt-3 pt-3 border-t border-amber-100">
      <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-200">
        <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-900 text-[11px] font-semibold leading-snug">
            {t.pwa.otherTitle} <span className="text-amber-700">{t.pwa.otherSafari}</span>
          </p>
          <p className="text-amber-700/70 text-[11px] mt-0.5 leading-snug">
            {t.pwa.otherDesc}
          </p>
        </div>
      </div>
      <button
        onClick={onCopy}
        className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold transition-colors"
        style={{ background: copied ? '#16a34a' : '#D97706', color: '#fff' }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? t.pwa.copied : t.pwa.copyLink}
      </button>
    </div>
  );
}

function SafariGuide({ t }: { t: Translation }) {
  return (
    <div className="mt-3 pt-3 border-t border-amber-100">
      <p className="text-amber-700/55 text-[11px] font-semibold uppercase tracking-wider mb-2.5">
        {t.pwa.safariStepsTitle}
      </p>

      <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-200 bg-white">
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <span className="text-[9px] text-gray-400 truncate">warungtehrisma-one.vercel.app</span>
          </div>
        </div>
        <div className="flex items-center justify-around px-4 py-2 bg-white">
          <ChevronLeft size={18} className="text-gray-300" />
          <ChevronRight size={18} className="text-gray-300" />
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <div className="absolute w-8 h-8 rounded-full bg-amber-400/25" />
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-md relative z-10">
              <Share size={14} className="text-white" />
            </div>
          </motion.div>
          <BookOpen size={18} className="text-gray-300" />
          <Square size={18} className="text-gray-300" />
        </div>
        <div className="bg-amber-50 py-1.5 flex items-center justify-center gap-1 border-t border-amber-100">
          <span className="text-[10px] font-semibold text-amber-700">{t.pwa.toolbarLabel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <StepRow number={1}>
          {t.pwa.step1}{' '}
          <span className="font-bold text-amber-700">{t.pwa.step1Share}</span>{' '}
          <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-amber-500 mx-0.5">
            <Share size={9} className="text-white" />
          </span>{' '}
          {t.pwa.step1Suf}
        </StepRow>
        <StepRow number={2}>
          {t.pwa.step2}{' '}
          <span className="font-bold text-amber-700">{t.pwa.step2Add}</span>
        </StepRow>
        <StepRow number={3}>
          {t.pwa.step3}{' '}
          <span className="font-bold text-amber-700">{t.pwa.step3Add}</span>{' '}
          {t.pwa.step3Done}
        </StepRow>
      </div>
    </div>
  );
}

function StepRow({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: '#D97706' }}
      >
        {number}
      </span>
      <span className="text-amber-900 text-[11px] leading-snug flex items-center gap-0.5 flex-wrap">
        {children}
      </span>
    </div>
  );
}

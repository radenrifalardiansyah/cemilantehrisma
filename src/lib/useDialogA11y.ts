'use client';

import { useEffect, useRef, type RefObject } from 'react';

// Scroll lock berbasis counter (level modul): dialog bertumpuk/bergantian tidak saling menimpa overflow body.
let lockCount = 0;
let savedOverflow = '';
function lockScroll() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}
function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = savedOverflow;
}

// Tumpukan dialog terbuka: hanya dialog paling atas yang menangani Escape dan Tab.
const stack: symbol[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    el => !el.hasAttribute('inert') && el.getClientRects().length > 0,
  );
}

interface DialogA11yOptions {
  /** Pemicu eksplisit untuk fokus kembali (default: elemen yang fokus saat dialog dibuka). */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Fallback fokus bila pemicu sudah tidak ada di dokumen (mis. tombol pembuka sheet lain). */
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Perilaku dialog modal: Escape menutup, Tab/Shift+Tab terjebak di dalam kontainer,
 * fokus awal ke tombol tutup, fokus kembali ke pemicu, scroll body terkunci (counter bersama).
 * Panggil tanpa kondisional; kendalikan lewat `open`. Kontainer harus ter-render saat `open` true.
 */
export function useDialogA11y(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
  closeBtnRef: RefObject<HTMLElement | null>,
  { returnFocusRef, fallbackFocusRef }: DialogA11yOptions = {},
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const id = Symbol('dialog');
    stack.push(id);
    const trigger = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    lockScroll();
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;
      const items = getFocusable(container);
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !container.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      const i = stack.indexOf(id);
      if (i >= 0) stack.splice(i, 1);
      unlockScroll();
      if (trigger && trigger !== document.body && document.contains(trigger)) trigger.focus();
      // Sengaja dibaca saat cleanup: node fallback harus yang terpasang pada saat dialog ditutup.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      else fallbackFocusRef?.current?.focus();
    };
    // returnFocusRef/fallbackFocusRef/containerRef/closeBtnRef adalah ref stabil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

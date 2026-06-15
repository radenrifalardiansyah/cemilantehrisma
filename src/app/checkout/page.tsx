'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ShoppingBag, MessageCircle, ArrowLeft, User, Phone, MapPin,
  FileText, Package, Truck, Check, ChevronRight, Trash2, Plus, Minus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useCartStore } from '@/lib/store';
import { formatCurrency, openWhatsApp } from '@/lib/whatsapp';
import { CustomerInfo } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductLocale } from '@/lib/product-translations';
import toast from 'react-hot-toast';

const defaultCustomer: CustomerInfo = {
  name: '', phone: '', address: '', note: '', deliveryMethod: 'pickup',
};

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart, updateQuantity, removeItem } = useCartStore();
  const [customer, setCustomer] = useState<CustomerInfo>(defaultCustomer);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'cart' | 'info' | 'confirm'>('cart');
  const { t, locale } = useLanguage();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const updateField = (field: keyof CustomerInfo, value: string) =>
    setCustomer(prev => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (items.length === 0) { toast.error(t.checkout.toast.emptyCart); return false; }
    return true;
  };
  const validateStep2 = () => {
    if (!customer.name.trim()) { toast.error(t.checkout.toast.nameRequired); return false; }
    if (!customer.phone.trim() || customer.phone.length < 8) { toast.error(t.checkout.toast.phoneInvalid); return false; }
    if (customer.deliveryMethod === 'delivery' && !customer.address.trim()) {
      toast.error(t.checkout.toast.addressRequired); return false;
    }
    return true;
  };

  const handleWhatsApp = () => {
    setLoading(true);
    try {
      openWhatsApp(items, customer, totalPrice);
      toast.success(t.checkout.toast.sent);
      setTimeout(() => {
        clearCart(); setStep('cart'); setCustomer(defaultCustomer); setLoading(false);
      }, 1500);
    } catch { toast.error(t.checkout.toast.failed); setLoading(false); }
  };

  const stepInfo = [
    { id: 'cart', label: t.checkout.steps.cart, icon: ShoppingBag },
    { id: 'info', label: t.checkout.steps.info, icon: User },
    { id: 'confirm', label: t.checkout.steps.confirm, icon: Check },
  ];

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-40 md:pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-amber-600/70 hover:text-amber-700 text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> {t.checkout.backToMenu}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1">
            <span className="text-amber-950">{t.checkout.title1} </span>
            <span className="gradient-text">{t.checkout.title2}</span>
          </h1>
          <p className="text-amber-800/55 text-sm">{t.checkout.subtitle}</p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-0 mb-8"
        >
          {stepInfo.map((s, i) => {
            const currentIdx = stepInfo.findIndex(x => x.id === step);
            const isActive = s.id === step;
            const isDone = i < currentIdx;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive ? 'text-white shadow-md' : isDone ? 'text-amber-600 bg-amber-100' : 'text-amber-800/40 bg-transparent'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < stepInfo.length - 1 && (
                  <ChevronRight
                    size={13}
                    className={`mx-1 ${i < currentIdx ? 'text-amber-500' : 'text-amber-300'}`}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Cart review */}
          {step === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden mb-4 shadow-sm">
                <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between">
                  <h2 className="font-display font-bold text-amber-950 flex items-center gap-2 text-base">
                    <ShoppingBag size={16} className="text-amber-600" /> {t.checkout.orderSummary}
                  </h2>
                  <span className="text-amber-600/60 text-sm">{totalItems} {t.cart.item}</span>
                </div>

                {items.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="text-5xl mb-3">🛒</div>
                    <p className="text-amber-800/50 text-sm mb-4">{t.checkout.emptyCart}</p>
                    <Link href="/products">
                      <button className="btn-primary px-5 py-2.5 text-sm font-bold">{t.cart.seeMenu}</button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-50">
                    {items.map(item => {
                    const lp = getProductLocale(item.product.id, locale, item.product);
                    return (
                      <motion.div key={item.product.id} layout className="flex items-center gap-3 px-5 py-3.5">
                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-amber-100">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={lp.name}
                              width={44}
                              height={44}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-xl"
                              style={{ background: `radial-gradient(circle, ${item.product.bgColor}15, transparent)` }}
                            >
                              {item.product.emoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-amber-950 text-sm truncate">{lp.name}</p>
                          <p className="text-amber-600 text-sm font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200">
                            <Minus size={10} />
                          </button>
                          <span className="text-amber-950 text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white border border-amber-500">
                            <Plus size={10} />
                          </button>
                          <button onClick={() => removeItem(item.product.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-500 hover:bg-red-50 ml-1">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </motion.div>
                    );})}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-4">
                  <div className="flex justify-between text-sm text-amber-700/60 mb-1.5">
                    <span>{t.checkout.subtotal} ({totalItems} {t.cart.item})</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-amber-200/50">
                    <span className="font-display font-bold text-amber-950">{t.checkout.total}</span>
                    <span className="font-display text-xl font-bold gradient-text">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => validateStep1() && setStep('info')}
                disabled={items.length === 0}
                className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {t.checkout.continueToInfo} <ChevronRight size={15} />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Info */}
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl border border-amber-100 p-5 sm:p-6 space-y-5 shadow-sm">
                <h2 className="font-display font-bold text-amber-950 flex items-center gap-2">
                  <User size={16} className="text-amber-600" /> {t.checkout.formTitle}
                </h2>

                {/* Name */}
                <div>
                  <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{t.checkout.name}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
                    <input
                      type="text" value={customer.name} onChange={e => updateField('name', e.target.value)}
                      placeholder={t.checkout.namePlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{t.checkout.phone}</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
                    <input
                      type="tel" value={customer.phone} onChange={e => updateField('phone', e.target.value)}
                      placeholder={t.checkout.phonePlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm"
                    />
                  </div>
                </div>

                {/* Delivery method */}
                <div>
                  <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-2 block">{t.checkout.method}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['pickup', 'delivery'] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => updateField('deliveryMethod', method)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          customer.deliveryMethod === method
                            ? 'text-white border-transparent shadow-md'
                            : 'bg-white border-amber-200 text-amber-700/70 hover:border-amber-300'
                        }`}
                        style={customer.deliveryMethod === method ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}
                      >
                        {method === 'pickup' ? <><Package size={14} /> {t.checkout.pickup}</> : <><Truck size={14} /> {t.checkout.delivery}</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <AnimatePresence>
                  {customer.deliveryMethod === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{t.checkout.address}</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                        <textarea
                          value={customer.address} onChange={e => updateField('address', e.target.value)}
                          placeholder={t.checkout.addressPlaceholder}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Note */}
                <div>
                  <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{t.checkout.note}</label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                    <textarea
                      value={customer.note} onChange={e => updateField('note', e.target.value)}
                      placeholder={t.checkout.notePlaceholder}
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('cart')} className="btn-outline flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold">
                  <ArrowLeft size={13} /> {t.checkout.back}
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => validateStep2() && setStep('confirm')}
                  className="flex-1 btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md text-sm"
                >
                  {t.checkout.viewSummary} <ChevronRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Order summary */}
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-amber-50">
                  <h2 className="font-display font-bold text-amber-950 flex items-center gap-2 text-base">
                    <ShoppingBag size={16} className="text-amber-600" /> {t.checkout.yourOrder}
                  </h2>
                </div>
                <div className="divide-y divide-amber-50">
                  {items.map(item => {
                    const lp = getProductLocale(item.product.id, locale, item.product);
                    return (
                    <div key={item.product.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-amber-100">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={lp.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            {item.product.emoji}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-950 text-sm font-semibold truncate">{lp.name}</p>
                        <p className="text-amber-700/55 text-xs">{formatCurrency(item.product.price)} × {item.quantity}</p>
                      </div>
                      <p className="text-amber-600 text-sm font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  );})}
                </div>
                <div className="px-5 py-4 border-t border-amber-100 bg-amber-50 flex justify-between items-center">
                  <span className="font-display font-bold text-amber-950">{t.checkout.total}</span>
                  <span className="font-display text-xl font-bold gradient-text">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-3 shadow-sm">
                <h2 className="font-display font-bold text-amber-950 flex items-center gap-2 text-base">
                  <User size={16} className="text-amber-600" /> {t.checkout.orderInfo}
                </h2>
                {[
                  { icon: User, label: t.checkout.infoName, value: customer.name },
                  { icon: Phone, label: t.checkout.infoPhone, value: customer.phone },
                  { icon: customer.deliveryMethod === 'pickup' ? Package : Truck, label: t.checkout.infoMethod, value: customer.deliveryMethod === 'pickup' ? t.checkout.pickupLabel : t.checkout.delivery },
                  ...(customer.deliveryMethod === 'delivery' && customer.address ? [{ icon: MapPin, label: t.checkout.infoAddress, value: customer.address }] : []),
                  ...(customer.note ? [{ icon: FileText, label: t.checkout.infoNote, value: customer.note }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-amber-700/50 text-xs">{label}</p>
                      <p className="text-amber-950 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WA notice */}
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(22,163,74,0.07)', border: '1.5px solid rgba(22,163,74,0.2)' }}>
                <MessageCircle size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800/80 text-sm leading-relaxed">
                  {t.checkout.waNotice}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('info')} className="btn-outline flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold">
                  <ArrowLeft size={13} /> {t.checkout.back}
                </button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsApp}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all disabled:opacity-60"
                  style={{ background: loading ? 'rgba(22,163,74,0.5)' : 'linear-gradient(135deg, #16A34A, #15803D)', boxShadow: loading ? 'none' : '0 6px 20px rgba(22,163,74,0.3)' }}
                >
                  <MessageCircle size={16} />
                  {loading ? t.checkout.sending : t.checkout.sendWA}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}

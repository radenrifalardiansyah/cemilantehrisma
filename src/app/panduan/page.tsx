'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, ShoppingCart, ClipboardList, UserCheck,
  Truck, CheckCircle2, MessageCircle, Users,
  FileText, Clock, Gift, BookOpen, Tag,
  CheckCircle, XCircle, Clock3, Flame, Star, Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/contexts/LanguageContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

const orderSteps = {
  id: [
    { icon: Search,        title: 'Pilih Produk',          desc: 'Buka halaman Menu dan jelajahi semua produk kami. Klik kartu produk untuk melihat detail lengkap, gambar, dan spesifikasi.' },
    { icon: ShoppingCart,  title: 'Tambah ke Keranjang',   desc: 'Klik tombol "+" di kartu produk untuk menambahkannya ke keranjang. Kamu bisa tambah beberapa produk sekaligus.' },
    { icon: ClipboardList, title: 'Periksa Keranjang',      desc: 'Klik ikon keranjang di pojok kanan atas untuk melihat daftar pesananmu. Sesuaikan jumlah atau hapus produk jika perlu.' },
    { icon: FileText,      title: 'Mulai Pembayaran',      desc: 'Klik tombol "Checkout Sekarang" di keranjang untuk melanjutkan ke halaman konfirmasi pesanan.' },
    { icon: UserCheck,     title: 'Isi Data Diri',         desc: 'Masukkan nama lengkap, nomor HP aktif, dan alamat pengiriman. Pastikan nomor HP terhubung ke WhatsApp.' },
    { icon: Truck,         title: 'Pilih Pengiriman',      desc: 'Pilih metode pengiriman: Pickup (ambil langsung di Bogor) atau Delivery (kami atur pengiriman ke alamatmu).' },
    { icon: CheckCircle2,  title: 'Konfirmasi & Kirim',    desc: 'Review pesananmu, lalu klik "Konfirmasi via WhatsApp". Pesanan otomatis terkirim ke kami dan kami segera proses!' },
  ],
  en: [
    { icon: Search,        title: 'Browse Products',       desc: 'Open the Menu page and explore all our products. Click on a product card to view full details, photos, and specifications.' },
    { icon: ShoppingCart,  title: 'Add to Cart',           desc: 'Click the "+" button on any product card to add it to your cart. You can add multiple products at once.' },
    { icon: ClipboardList, title: 'Review Cart',           desc: 'Click the cart icon in the top-right corner to see your order list. Adjust quantities or remove items as needed.' },
    { icon: FileText,      title: 'Start Checkout',        desc: 'Click "Checkout Now" in the cart to proceed to the order confirmation page.' },
    { icon: UserCheck,     title: 'Fill in Your Details',  desc: 'Enter your full name, active phone number, and shipping address. Make sure the number is linked to WhatsApp.' },
    { icon: Truck,         title: 'Choose Delivery',       desc: 'Choose a delivery method: Pickup (collect directly in Bogor) or Delivery (we arrange shipping to your address).' },
    { icon: CheckCircle2,  title: 'Confirm & Send',        desc: 'Review your order, then click "Confirm via WhatsApp". Your order is automatically sent to us and we process it right away!' },
  ],
};

const resellerSteps = {
  id: [
    { icon: BookOpen,      title: 'Buka Halaman Reseller', desc: 'Klik menu "Reseller" di navigasi atas atau bawah untuk membuka halaman pendaftaran reseller kami.' },
    { icon: FileText,      title: 'Isi Formulir',          desc: 'Lengkapi data diri: nama, kota, nomor HP WhatsApp, dan platform jualan yang kamu gunakan (Shopee, Instagram, dll).' },
    { icon: MessageCircle, title: 'Kirim via WhatsApp',    desc: 'Setelah formulir diisi, klik tombol "Daftar Reseller". Data kamu otomatis terkirim ke WhatsApp tim kami.' },
    { icon: Clock,         title: 'Tunggu Konfirmasi',     desc: 'Tim kami akan membalas dan memverifikasi data dalam 1×24 jam. Pastikan WhatsApp kamu aktif.' },
    { icon: Gift,          title: 'Mulai Berjualan',       desc: 'Setelah disetujui, kamu langsung dapat harga spesial reseller, materi foto produk, dan teks promosi siap pakai!' },
  ],
  en: [
    { icon: BookOpen,      title: 'Open Reseller Page',    desc: 'Click the "Reseller" menu in the top or bottom navigation to open our reseller registration page.' },
    { icon: FileText,      title: 'Fill in the Form',      desc: 'Complete your details: name, city, WhatsApp number, and selling platforms you use (Shopee, Instagram, etc.).' },
    { icon: MessageCircle, title: 'Send via WhatsApp',     desc: 'Once the form is filled, click "Register as Reseller". Your data is automatically sent to our WhatsApp team.' },
    { icon: Clock,         title: 'Wait for Confirmation', desc: 'Our team will reply and verify your data within 24 hours. Make sure your WhatsApp is active.' },
    { icon: Gift,          title: 'Start Selling',         desc: 'Once approved, you instantly get special reseller pricing, product photos, and ready-to-use captions!' },
  ],
};

export default function PanduanPage() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'order' | 'reseller' | 'status'>('order');

  const oSteps = orderSteps[locale] ?? orderSteps.id;
  const rSteps = resellerSteps[locale] ?? resellerSteps.id;

  const tabs = [
    { key: 'order',    label: locale === 'en' ? 'How to Order'   : 'Cara Memesan',   emoji: '🛒' },
    { key: 'reseller', label: locale === 'en' ? 'Join Reseller'  : 'Daftar Reseller', emoji: '🤝' },
    { key: 'status',   label: locale === 'en' ? 'Product Status' : 'Status Produk',   emoji: '🏷️' },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />

      {/* Hero */}
      <section className="relative pt-28 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(251,191,36,0.13) 0%, transparent 60%), #FFFBF5',
        }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 text-amber-700 text-sm font-semibold mb-5"
          >
            <BookOpen size={14} />
            {locale === 'en' ? 'Complete Guide' : 'Panduan Lengkap'}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-amber-950">{locale === 'en' ? 'How to ' : 'Cara '}</span>
            <span className="gradient-text">{locale === 'en' ? 'Order' : 'Pesan'}</span>
            <span className="text-amber-950"> & </span>
            <span className="text-amber-800">{locale === 'en' ? 'Join Reseller' : 'Daftar Reseller'}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-amber-800/60 text-sm sm:text-base max-w-xl mx-auto"
          >
            {locale === 'en'
              ? 'Step-by-step guide on how to order and how to join as a reseller.'
              : 'Panduan langkah demi langkah cara memesan produk dan cara bergabung sebagai reseller.'}
          </motion.p>
        </div>
      </section>

      {/* Sticky tab switcher */}
      <div className="sticky top-16 sm:top-20 z-20 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 ${
                  activeTab === tab.key ? 'text-amber-800' : 'text-amber-500 hover:text-amber-700'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="guide-tab"
                    className="absolute inset-0 bg-white rounded-xl border border-amber-200 shadow-sm"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab.emoji}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps content */}
      <main className="max-w-3xl mx-auto px-4 py-8 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'order' ? (
            <motion.div
              key="order"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.28 }}
            >
              <StepList steps={oSteps} color="#D97706" />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 bg-gradient-to-br from-amber-700 to-orange-600 rounded-2xl p-6 text-center shadow-lg"
              >
                <p className="text-white font-display font-bold text-lg mb-1">
                  {locale === 'en' ? 'Ready to order?' : 'Siap memesan?'}
                </p>
                <p className="text-amber-200 text-sm mb-4">
                  {locale === 'en' ? 'Browse our products and add to cart now.' : 'Lihat produk kami dan mulai belanja sekarang.'}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-bold rounded-xl text-sm shadow hover:bg-amber-50 transition-colors"
                >
                  <ShoppingCart size={16} />
                  {locale === 'en' ? 'Shop Now' : 'Belanja Sekarang'}
                </Link>
              </motion.div>
            </motion.div>
          ) : activeTab === 'reseller' ? (
            <motion.div
              key="reseller"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
            >
              {/* Benefit chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {(locale === 'en'
                  ? ['Special reseller price', 'Ready product photos', 'WhatsApp support', 'No minimum order']
                  : ['Harga reseller khusus', 'Foto produk siap pakai', 'Dukungan via WhatsApp', 'Tanpa minimal pemesanan']
                ).map(b => (
                  <span key={b} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-full text-xs font-semibold text-amber-700 shadow-sm">
                    <CheckCircle2 size={11} className="text-green-500" /> {b}
                  </span>
                ))}
              </div>

              <StepList steps={rSteps} color="#7C3AED" />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 bg-gradient-to-br from-violet-700 to-purple-600 rounded-2xl p-6 text-center shadow-lg"
              >
                <p className="text-white font-display font-bold text-lg mb-1">
                  {locale === 'en' ? 'Ready to join?' : 'Siap bergabung?'}
                </p>
                <p className="text-violet-200 text-sm mb-4">
                  {locale === 'en' ? 'Register now and start earning.' : 'Daftar sekarang dan mulai berjualan bersama kami.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/reseller"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-violet-700 font-bold rounded-xl text-sm shadow hover:bg-violet-50 transition-colors"
                  >
                    <Users size={16} />
                    {locale === 'en' ? 'Register as Reseller' : 'Daftar Reseller'}
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(locale === 'en' ? 'Hi, I want to join as a reseller for Cemilan Teh Risma.' : 'Halo, saya ingin mendaftar sebagai reseller Cemilan Teh Risma.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl text-sm shadow hover:bg-green-400 transition-colors"
                  >
                    <MessageCircle size={16} />
                    {locale === 'en' ? 'Chat via WhatsApp' : 'Chat via WhatsApp'}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              {/* Stock statuses */}
              <StatusGroup
                title={locale === 'en' ? 'Stock Status' : 'Status Stok'}
                desc={locale === 'en'
                  ? 'Each product card shows a small badge indicating its current availability.'
                  : 'Setiap kartu produk menampilkan label kecil yang menunjukkan ketersediaan produk saat ini.'}
                items={[
                  {
                    icon: CheckCircle,
                    color: '#16A34A',
                    bg: 'rgba(22,163,74,0.1)',
                    border: 'rgba(22,163,74,0.25)',
                    label: locale === 'en' ? 'In Stock' : 'Tersedia',
                    desc: locale === 'en'
                      ? 'Product is ready and can be ordered right now.'
                      : 'Produk siap dan langsung bisa dipesan sekarang.',
                  },
                  {
                    icon: Clock3,
                    color: '#D97706',
                    bg: 'rgba(217,119,6,0.1)',
                    border: 'rgba(217,119,6,0.25)',
                    label: 'Purchase Order (PO)',
                    desc: locale === 'en'
                      ? 'Product is available via pre-order. Order now and we will process your request.'
                      : 'Produk tersedia via pre-order. Pesan sekarang dan kami akan proses permintaanmu.',
                  },
                  {
                    icon: XCircle,
                    color: '#DC2626',
                    bg: 'rgba(220,38,38,0.08)',
                    border: 'rgba(220,38,38,0.2)',
                    label: locale === 'en' ? 'Out of Stock' : 'Stok Habis',
                    desc: locale === 'en'
                      ? 'Product is currently unavailable. Check back soon or contact us via WhatsApp.'
                      : 'Produk sedang tidak tersedia. Pantau terus atau hubungi kami via WhatsApp.',
                  },
                ]}
              />

              {/* Badge labels */}
              <StatusGroup
                title={locale === 'en' ? 'Product Badges' : 'Badge Produk'}
                desc={locale === 'en'
                  ? 'Some products have a special badge in the top corner of the card.'
                  : 'Beberapa produk memiliki badge khusus di sudut atas kartu produk.'}
                items={[
                  {
                    icon: Flame,
                    color: '#EA580C',
                    bg: 'rgba(234,88,12,0.1)',
                    border: 'rgba(234,88,12,0.25)',
                    label: locale === 'en' ? 'Best Seller' : 'Best Seller',
                    desc: locale === 'en'
                      ? 'The most purchased product — a top favourite among our customers.'
                      : 'Produk paling banyak dibeli — favorit utama pelanggan kami.',
                  },
                  {
                    icon: Star,
                    color: '#9333EA',
                    bg: 'rgba(147,51,234,0.08)',
                    border: 'rgba(147,51,234,0.2)',
                    label: locale === 'en' ? 'Popular' : 'Populer',
                    desc: locale === 'en'
                      ? 'Highly sought-after product that many customers love.'
                      : 'Produk yang banyak diminati dan disukai banyak pelanggan.',
                  },
                  {
                    icon: Sparkles,
                    color: '#0891B2',
                    bg: 'rgba(8,145,178,0.08)',
                    border: 'rgba(8,145,178,0.2)',
                    label: locale === 'en' ? 'New' : 'Baru',
                    desc: locale === 'en'
                      ? 'Newly launched product — be one of the first to try it!'
                      : 'Produk baru yang baru diluncurkan — jadilah yang pertama mencobanya!',
                  },
                ]}
              />

              {/* Info note */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4"
              >
                <Tag size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700/80 text-xs leading-relaxed">
                  {locale === 'en'
                    ? 'Still have questions about a product? Chat directly with us via WhatsApp — we respond quickly!'
                    : 'Masih bingung dengan status produk? Chat langsung ke WhatsApp kami — kami balas dengan cepat!'}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

type StatusItem = {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  label: string;
  desc: string;
};

function StatusGroup({ title, desc, items }: { title: string; desc: string; items: StatusItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm"
    >
      <div className="px-4 pt-4 pb-2 border-b border-amber-50">
        <p className="font-bold text-amber-900 text-sm">{title}</p>
        <p className="text-amber-600/60 text-xs mt-0.5">{desc}</p>
      </div>
      <div className="divide-y divide-amber-50">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3.5 px-4 py-3.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: item.bg, border: `1.5px solid ${item.border}` }}
              >
                <Icon size={17} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-1"
                  style={{ background: item.bg, color: item.color, border: `1px solid ${item.border}` }}
                >
                  {item.label}
                </span>
                <p className="text-amber-700/65 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StepList({ steps, color }: { steps: typeof orderSteps.id; color: string }) {
  return (
    <ol>
      <div className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex gap-4 bg-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
            >
              {/* Number + Icon */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: `${color}15`, border: `1.5px solid ${color}30` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <span
                  className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ background: color, color: 'white' }}
                >
                  {i + 1}
                </span>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-bold text-amber-900 text-sm mb-1">{step.title}</p>
                <p className="text-amber-700/65 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </motion.li>
          );
        })}
      </div>
    </ol>
  );
}


'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, Instagram, MessageCircle,
  ExternalLink, ShoppingBag,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import BottomNav from '@/components/BottomNav';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import logo from '@/assets/images/logo-tehrisma.jpeg';

const contacts = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '0812-1213-2014',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.2)',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@keripiktehrisma',
    href: 'https://www.instagram.com/keripiktehrisma',
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.08)',
    border: 'rgba(225,48,108,0.2)',
  },
  {
    icon: ShoppingBag,
    label: 'Shopee',
    value: 'tehrisma.id',
    href: 'https://shopee.co.id/tehrisma.id',
    color: '#EE4D2D',
    bg: 'rgba(238,77,45,0.08)',
    border: 'rgba(238,77,45,0.2)',
  },
];

export default function KontakPage() {
  return (
    <main className="min-h-screen pb-28" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />

      <div className="max-w-lg mx-auto px-4 pt-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg mb-4">
            <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold text-amber-950 mb-1">Cemilan Teh Risma</h1>
          <p className="text-amber-700/60 text-sm">Keripik Kimpul & Mie Kremes Khas Bogor</p>
        </motion.div>

        {/* Maps embed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm mb-4"
        >
          <iframe
            src="https://maps.google.com/maps?q=Jl.+Batara+Kp.+Bubulak+No.+54+RT01+RW03+Kel.+Ciluar+Kec.+Bogor+Utara+16156&output=embed&z=16"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Warung Teh Risma"
          />
        </motion.div>

        {/* Address card */}
        <motion.a
          href="https://maps.app.goo.gl/h1AyYBaTH2tAqS588"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-start gap-3 p-4 rounded-2xl border mb-4 w-full text-left"
          style={{ background: 'rgba(217,119,6,0.07)', border: '1.5px solid rgba(217,119,6,0.2)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(217,119,6,0.15)' }}>
            <MapPin size={18} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-0.5">Alamat</p>
            <p className="text-amber-950 text-sm font-medium leading-snug">
              Jl. Batara Kp. Bubulak No. 54 RT01/RW03<br />
              Kel. Ciluar, Kec. Bogor Utara 16156
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-amber-600">
              Buka di Google Maps <ExternalLink size={11} />
            </span>
          </div>
        </motion.a>

        {/* Jam buka */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="flex items-center gap-3 p-4 rounded-2xl border mb-6"
          style={{ background: 'rgba(217,119,6,0.05)', border: '1.5px solid rgba(217,119,6,0.15)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(217,119,6,0.12)' }}>
            <Clock size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-0.5">Jam Buka</p>
            <p className="text-amber-950 text-sm font-medium">Setiap Hari, 08.00 – 21.00 WIB</p>
          </div>
        </motion.div>

        {/* Contact buttons */}
        <p className="text-xs font-semibold text-amber-700/50 uppercase tracking-widest mb-3">Hubungi Kami</p>
        <div className="space-y-3 mb-6">
          {contacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 p-4 rounded-2xl border w-full"
                style={{ background: c.bg, border: `1.5px solid ${c.border}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c.color}20` }}
                >
                  <Icon size={20} style={{ color: c.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: c.color }}>{c.label}</p>
                  <p className="text-amber-950 text-sm font-medium">{c.value}</p>
                </div>
                <ExternalLink size={14} className="text-amber-400 flex-shrink-0" />
              </motion.a>
            );
          })}
        </div>

        {/* WA order shortcut */}
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Teh Risma, saya mau pesan cemilan 😊')}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)', boxShadow: '0 6px 24px rgba(22,163,74,0.3)' }}
        >
          <MessageCircle size={18} />
          Pesan Sekarang via WhatsApp
        </motion.a>
      </div>

      <BottomNav />
    </main>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle2, Star, MapPin, Phone, Store,
  ArrowRight, Send, ChevronDown, ChevronUp, BadgeCheck,
  TrendingUp, Package, AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { openResellerWhatsApp, ResellerInfo, formatCurrency } from '@/lib/whatsapp';
import { useLanguage } from '@/contexts/LanguageContext';

const pakets = [
  {
    id: 'Paket Krenyes Pemula (10 pcs) - Rp 90.000',
    nama: 'Krenyes Pemula', emoji: '🌱',
    pcs: 10, modal: 90000, hargaJual: 10000,
    color: 'from-amber-500 to-yellow-400', border: 'border-amber-300', bg: 'bg-amber-50',
    highlight: false,
  },
  {
    id: 'Paket Kremes Nagih (20 pcs) - Rp 170.000',
    nama: 'Kremes Nagih', emoji: '🔥',
    pcs: 20, modal: 170000, hargaJual: 10000,
    color: 'from-orange-500 to-amber-400', border: 'border-orange-300', bg: 'bg-orange-50',
    highlight: true,
  },
  {
    id: 'Paket Kriuk Maksimal (30 pcs) - Rp 240.000',
    nama: 'Kriuk Maksimal', emoji: '💎',
    pcs: 30, modal: 240000, hargaJual: 10000,
    color: 'from-rose-500 to-orange-400', border: 'border-rose-300', bg: 'bg-rose-50',
    highlight: false,
  },
];

const resellers = [
  { id: 1, nama: 'Ibu Sari', kota: 'Bogor Barat', platform: ['WhatsApp', 'Instagram'], bergabung: 'Jan 2025' },
  { id: 2, nama: 'Kak Dina', kota: 'Bogor Tengah', platform: ['Shopee', 'Tokopedia'], bergabung: 'Mar 2025' },
  { id: 3, nama: 'Pak Rudi', kota: 'Bogor Timur', platform: ['Offline', 'WhatsApp'], bergabung: 'Apr 2025' },
];

const platformOptions = ['WhatsApp', 'Instagram', 'Shopee', 'Tokopedia', 'TikTok Shop', 'Offline / Warung'];

const defaultForm: ResellerInfo = {
  nama: '', whatsapp: '', kota: '', alamat: '', platform: [], paket: '', pengalaman: '',
};

export default function ResellerPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<ResellerInfo>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ResellerInfo, string>>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const benefits = [
    { icon: '💰', title: t.reseller.benefit1Title, desc: t.reseller.benefit1Desc },
    { icon: '📦', title: t.reseller.benefit2Title, desc: t.reseller.benefit2Desc },
    { icon: '🎨', title: t.reseller.benefit3Title, desc: t.reseller.benefit3Desc },
    { icon: '🤝', title: t.reseller.benefit4Title, desc: t.reseller.benefit4Desc },
    { icon: '🏆', title: t.reseller.benefit5Title, desc: t.reseller.benefit5Desc },
    { icon: '📈', title: t.reseller.benefit6Title, desc: t.reseller.benefit6Desc },
  ];

  const faqs = [
    { q: t.reseller.faq1Q, a: t.reseller.faq1A },
    { q: t.reseller.faq2Q, a: t.reseller.faq2A },
    { q: t.reseller.faq3Q, a: t.reseller.faq3A },
    { q: t.reseller.faq4Q, a: t.reseller.faq4A },
  ];

  const togglePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platform: f.platform.includes(p) ? f.platform.filter(x => x !== p) : [...f.platform, p],
    }));
  };

  const validate = () => {
    const e: Partial<Record<keyof ResellerInfo, string>> = {};
    if (!form.nama.trim()) e.nama = t.reseller.errNama;
    if (!form.whatsapp.trim()) e.whatsapp = t.reseller.errWA;
    if (!form.kota.trim()) e.kota = t.reseller.errKota;
    if (!form.alamat.trim()) e.alamat = t.reseller.errAlamat;
    if (!form.paket) e.paket = t.reseller.errPaket;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    openResellerWhatsApp(form);
  };

  const inputClass = (field: keyof ResellerInfo) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-amber-300 ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-white focus:border-amber-400'
    }`;

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />

      {/* HERO */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(251,191,36,0.13) 0%, transparent 60%), #FFFBF5',
        }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 text-amber-700 text-sm font-semibold mb-5"
          >
            <Users size={14} /> {t.reseller.heroBadge}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            <span className="text-amber-950">{t.reseller.heroTitle1} </span>
            <span className="gradient-text">Mie Kremes</span>
            <br />
            <span className="text-amber-800">{t.reseller.heroTitle2}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-amber-800/60 text-base sm:text-lg max-w-2xl mx-auto mb-6"
          >
            {t.reseller.heroDesc}
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold mb-8"
          >
            <AlertCircle size={15} />
            {t.reseller.slotAlert}
          </motion.div>

          <div className="flex justify-center">
            <motion.a initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              href="#daftar"
              className="inline-flex items-center gap-2 btn-primary px-7 py-3.5 text-sm font-bold shadow-lg"
            >
              {t.reseller.secureSlot} <ArrowRight size={15} />
            </motion.a>
          </div>
        </div>
      </section>

      {/* PAKET KEMITRAAN */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-2">{t.reseller.pakBadge}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="text-amber-950">{t.reseller.pakTitle1} </span>
            <span className="gradient-text">{t.reseller.pakTitle2}</span>
          </h2>
          <p className="text-amber-800/50 text-sm mt-2">{t.reseller.pakDesc}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {pakets.map((p, i) => {
            const omset = p.pcs * p.hargaJual;
            const profit = omset - p.modal;
            const modalPerPcs = p.modal / p.pcs;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className={`relative bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all ${
                  p.highlight ? 'border-orange-400 shadow-orange-100 shadow-lg' : 'border-amber-100'
                }`}
              >
                {p.highlight && (
                  <div className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(90deg, #f97316, #D97706)' }}
                  >
                    {t.reseller.pakPopular}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${p.color} p-6 ${p.highlight ? 'pt-9' : 'pt-6'} text-white text-center`}>
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <h3 className="font-display text-xl font-bold mb-1">{t.reseller.pakPrefix} {p.nama}</h3>
                  <p className="text-white/80 text-sm">{p.pcs} pcs Mie Kremes</p>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-center">
                    <p className="text-amber-700/50 text-xs mb-0.5">{t.reseller.pakInitial}</p>
                    <p className="font-display text-2xl font-bold gradient-text">{formatCurrency(p.modal)}</p>
                    <p className="text-amber-600/50 text-xs">= Rp {modalPerPcs.toLocaleString('id-ID')}/pcs</p>
                  </div>

                  <div className="h-px bg-amber-100" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700/60">{t.reseller.pakRevenue}</span>
                      <span className="font-semibold text-amber-900">{formatCurrency(omset)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700/60 flex items-center gap-1">
                        <TrendingUp size={12} /> {t.reseller.pakProfit}
                      </span>
                      <span className="font-bold text-green-600">{formatCurrency(profit)}</span>
                    </div>
                  </div>

                  <a href="#daftar" onClick={() => setForm(f => ({ ...f, paket: p.id }))}
                    className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                      p.highlight
                        ? 'btn-primary shadow-md'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {t.reseller.pakChoose}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-amber-700/50 text-xs mt-5"
        >
          {t.reseller.pakNote}
        </motion.p>
      </section>

      {/* KEUNTUNGAN */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-2">{t.reseller.benefitsBadge}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="text-amber-950">{t.reseller.benefitsTitle1} </span>
            <span className="gradient-text">{t.reseller.benefitsTitle2}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map((b, i) => (
            <motion.div key={b.title}
              initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md hover:shadow-amber-100 transition-all"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-display font-bold text-amber-950 mb-1.5">{b.title}</h3>
              <p className="text-amber-700/55 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESELLER AKTIF */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-2">{t.reseller.activeBadge}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="text-amber-950">{t.reseller.activeTitle1} </span>
            <span className="gradient-text">{t.reseller.activeTitle2}</span>
          </h2>
          <p className="text-amber-800/50 text-sm mt-2">{t.reseller.activeSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resellers.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                >
                  {r.nama.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display font-bold text-amber-950">{r.nama}</p>
                    <BadgeCheck size={14} className="text-amber-500" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-600/60 text-xs">
                    <MapPin size={10} /> {r.kota}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {r.platform.map(p => (
                  <span key={p} className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{p}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-amber-600/50 pt-3 border-t border-amber-100">
                <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> {t.reseller.activeJoined} {r.bergabung}</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 size={10} /> {t.reseller.activeStatus}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="text-amber-950">{t.reseller.faqTitle1} </span>
            <span className="gradient-text">{t.reseller.faqTitle2}</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-amber-100 overflow-hidden"
            >
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-semibold text-amber-950 text-sm">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp size={16} className="text-amber-500 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-amber-400 flex-shrink-0" />
                }
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-amber-700/65 text-sm leading-relaxed border-t border-amber-50 pt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORM PENDAFTARAN */}
      <section id="daftar" className="py-14 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-2">{t.reseller.formBadge}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="text-amber-950">{t.reseller.formTitle1} </span>
            <span className="gradient-text">{t.reseller.formTitle2}</span>
          </h2>
          <p className="text-amber-800/50 text-sm mt-2">{t.reseller.formSubtitle}</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-amber-100 shadow-lg p-6 sm:p-8 space-y-5"
        >
          {/* Pilih Paket */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              {t.reseller.fieldPaket} <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {pakets.map(p => (
                <label key={p.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    form.paket === p.id ? 'border-amber-400 bg-amber-50' : 'border-amber-100 hover:border-amber-200'
                  }`}
                >
                  <input type="radio" name="paket" value={p.id} checked={form.paket === p.id}
                    onChange={() => { setForm(f => ({ ...f, paket: p.id })); setErrors(er => ({ ...er, paket: '' })); }}
                    className="accent-amber-500"
                  />
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-950 text-sm">{t.reseller.pakPrefix} {p.nama}</p>
                    <p className="text-amber-600/60 text-xs">{p.pcs} pcs · {formatCurrency(p.modal)} · {t.reseller.profitUpTo} {formatCurrency(p.pcs * p.hargaJual - p.modal)}</p>
                  </div>
                  {p.highlight && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{t.reseller.pakBestSeller}</span>}
                </label>
              ))}
            </div>
            {errors.paket && <p className="text-red-500 text-xs mt-1">{errors.paket}</p>}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1.5">
              {t.reseller.fieldNama} <span className="text-red-400">*</span>
            </label>
            <input type="text" placeholder={t.reseller.phNama} value={form.nama}
              onChange={e => { setForm(f => ({ ...f, nama: e.target.value })); setErrors(er => ({ ...er, nama: '' })); }}
              className={inputClass('nama')}
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1.5">
              {t.reseller.fieldWA} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input type="tel" placeholder={t.reseller.phWA} value={form.whatsapp}
                onChange={e => { setForm(f => ({ ...f, whatsapp: e.target.value })); setErrors(er => ({ ...er, whatsapp: '' })); }}
                className={`${inputClass('whatsapp')} pl-9`}
              />
            </div>
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
          </div>

          {/* Kota */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1.5">
              {t.reseller.fieldKota} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input type="text" placeholder={t.reseller.phKota} value={form.kota}
                onChange={e => { setForm(f => ({ ...f, kota: e.target.value })); setErrors(er => ({ ...er, kota: '' })); }}
                className={`${inputClass('kota')} pl-9`}
              />
            </div>
            {errors.kota && <p className="text-red-500 text-xs mt-1">{errors.kota}</p>}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1.5">
              {t.reseller.fieldAlamat} <span className="text-red-400">*</span>
            </label>
            <textarea rows={3} placeholder={t.reseller.phAlamat} value={form.alamat}
              onChange={e => { setForm(f => ({ ...f, alamat: e.target.value })); setErrors(er => ({ ...er, alamat: '' })); }}
              className={`${inputClass('alamat')} resize-none`}
            />
            {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              {t.reseller.fieldPlatform}{' '}
              <span className="text-amber-500/60 font-normal text-xs">{t.reseller.fieldPlatformHint}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map(p => {
                const active = form.platform.includes(p);
                return (
                  <button key={p} type="button" onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      active ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    {active && <CheckCircle2 size={11} />}
                    <Store size={11} />
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pengalaman */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1.5">
              {t.reseller.fieldPengalaman}{' '}
              <span className="text-amber-500/60 font-normal text-xs">{t.reseller.fieldPengalamanHint}</span>
            </label>
            <textarea rows={3} placeholder={t.reseller.phPengalaman} value={form.pengalaman}
              onChange={e => setForm(f => ({ ...f, pengalaman: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm transition-all outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 resize-none"
            />
          </div>

          <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary py-4 font-bold text-base flex items-center justify-center gap-2 shadow-lg"
          >
            <Send size={17} />
            {t.reseller.submit}
          </motion.button>

          <div className="flex items-center gap-2 justify-center text-amber-700/40 text-xs">
            <Package size={11} />
            {t.reseller.privacy}
          </div>
        </motion.form>
      </section>

      <Footer />
      <BottomNav />
    </main>
  );
}

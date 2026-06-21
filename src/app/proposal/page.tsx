import type { Metadata } from 'next';
import Image from 'next/image';
import logo          from '@/assets/images/logo-tehrisma.jpeg';
import bannerMie      from '@/assets/images/Banner Mie Kremes 1.png';
import bannerKeripik  from '@/assets/images/Banner 1 Keripik Kimpul.png';

export const metadata: Metadata = {
  title: 'Proposal Kerjasama — Cemilan Teh Risma',
  description: 'Proposal kerjasama penitipan produk Cemilan Teh Risma.',
  robots: { index: false, follow: false },
};

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF2] font-[Inter,sans-serif] text-[#1C0A00]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap');
        @media print { .no-print { display: none !important; } body { background: white !important; } }
        .proposal-font { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(-2deg); filter: drop-shadow(0 20px 30px rgba(180,83,9,0.25)); }
          50%       { transform: translateY(-14px) rotate(2deg); filter: drop-shadow(0 35px 45px rgba(180,83,9,0.15)); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50%       { transform: scale(1.15); opacity: 0.55; }
        }
        .logo-float { animation: logoFloat 5s ease-in-out infinite; }
        .orb-pulse  { animation: orbPulse  4s ease-in-out infinite; }
        .banner-zoom { transition: transform 0.5s ease; }
        .group:hover .banner-zoom { transform: scale(1.04); }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-200 blur-3xl translate-x-1/3 -translate-y-1/3 orb-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange-200 blur-3xl -translate-x-1/4 translate-y-1/4 orb-pulse" style={{animationDelay:'2s'}} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-16">
          {/* Nav */}
          <div className="flex justify-between items-center mb-10 no-print">
            <a href="/" className="inline-flex items-center gap-2 bg-white border border-amber-200 hover:border-amber-400 text-amber-800 text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Toko
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Text side */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-1.5 text-amber-700 text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Proposal Kerjasama Resmi · 2026
              </div>
              <h1 className="proposal-font text-4xl md:text-5xl font-bold leading-tight mb-3 text-[#1C0A00]">
                Pilih Produk<br />
                <span className="text-amber-600">untuk Proposal</span>
              </h1>
              <p className="text-[#3D1A00]/60 text-base md:text-lg max-w-lg">
                Cemilan Teh Risma menyediakan dua lini produk unggulan. Pilih salah satu di bawah untuk membuka proposal lengkapnya.
              </p>
            </div>

            {/* Logo 3D floating */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="logo-float">
                <Image
                  src={logo}
                  alt="Logo Cemilan Teh Risma"
                  width={180}
                  height={180}
                  className="rounded-full object-cover border-4 border-white shadow-2xl"
                  priority
                />
              </div>
              <div className="proposal-font text-sm font-semibold text-amber-700 tracking-wide text-center">Cemilan Teh Risma</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L60 33C120 27 240 13 360 10C480 7 600 13 720 17C840 20 960 20 1080 17C1200 13 1320 7 1380 3L1440 0V40H0Z" fill="#FFFBF2" /></svg>
        </div>
      </section>

      {/* ── PRODUCT CARDS ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Mie Kremes */}
          <a href="/proposal/mie-kremes" className="group relative overflow-hidden rounded-2xl border-2 border-orange-200 hover:border-orange-400 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <Image
                src={bannerMie}
                alt="Banner Mie Kremes"
                fill
                className="object-cover banner-zoom"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                Best Seller
              </span>
            </div>
            <div className="p-6">
              <h2 className="proposal-font text-2xl font-bold text-[#1C0A00] mb-2">Mie Kremes</h2>
              <p className="text-sm text-[#3D1A00]/60 leading-relaxed mb-5">
                Mie crispy khas Bogor dengan bumbu rempah alami. Tersedia rasa Original dan Pedas dalam kemasan 150g.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Original', 'Pedas', '150g', 'Rp 10.000'].map(t => (
                  <span key={t} className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2.5 py-1 rounded-lg font-medium">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Lihat Proposal Lengkap
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </a>

          {/* Keripik Kimpul */}
          <a href="/proposal/keripik-kimpul" className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <Image
                src={bannerKeripik}
                alt="Banner Keripik Kimpul"
                fill
                className="object-cover banner-zoom"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                3 Varian Rasa
              </span>
            </div>
            <div className="p-6">
              <h2 className="proposal-font text-2xl font-bold text-[#1C0A00] mb-2">Keripik Kimpul</h2>
              <p className="text-sm text-[#3D1A00]/60 leading-relaxed mb-5">
                Keripik talas balitung renyah khas Bogor. Tersedia 3 rasa dalam 2 ukuran kemasan: 100g dan 250g.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Original', 'BBQ Pedas', 'Jagung', '100g / 250g'].map(t => (
                  <span key={t} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2.5 py-1 rounded-lg font-medium">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Lihat Proposal Lengkap
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </a>
        </div>

        {/* Brand info */}
        <div className="bg-white rounded-2xl border border-amber-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-amber-100">
            <Image src={logo} alt="Logo Teh Risma" width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-1">Tentang Kami</p>
            <p className="font-semibold text-[#1C0A00] mb-1">Cemilan Teh Risma — Bogor, Jawa Barat</p>
            <p className="text-sm text-[#3D1A00]/60">NIB: 0403260068412 · Bersertifikat HALAL Indonesia · Tanpa Pengawet</p>
          </div>
          <a href="https://wa.me/6281212132014" className="no-print inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

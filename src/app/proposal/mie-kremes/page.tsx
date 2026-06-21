import type { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import imgMieOri from '@/assets/images/Mie Kremes 150g Original.png';
import imgMiePdas from '@/assets/images/Mie Kremes 150g Pedas.png';

export const metadata: Metadata = {
  title: 'Proposal Mie Kremes — Cemilan Teh Risma',
  description: 'Proposal kerjasama titip jual Mie Kremes Cemilan Teh Risma.',
  robots: { index: false, follow: false },
};

// ── Warna tema: sesuai stiker produk Mie Kremes (orange-700 → amber-600 → yellow-400)
const C = {
  hero:       'from-orange-50 via-amber-50 to-yellow-50',
  heroBorder: 'border-orange-100',
  blob1:      'bg-orange-200',
  blob2:      'bg-yellow-200',
  wave:       '#FFFBF2',
  badge:      'bg-orange-100 border-orange-300 text-orange-700',
  badgeDot:   'bg-orange-500',
  heading:    'text-orange-600',
  stat:       'text-orange-600',
  statBorder: 'border-orange-100',
  sectionIcon:'bg-orange-100 border-orange-200 text-orange-600',
  sectionLine:'from-orange-200',
  cardBorder: 'border-orange-100',
  cardAccent: 'bg-orange-50',
  highlight:  'text-orange-500',
  stepNum:    'bg-orange-100 border-orange-300 text-orange-700',
  schemeBg:   'from-orange-50 to-amber-50 border-orange-200',
  schemeStrong:'text-orange-700',
  targetBg:   'bg-orange-50 border-orange-100',
  ctaBg:      'from-orange-50 to-amber-50 border-orange-200',
  ctaBtn:     'bg-orange-600 hover:bg-orange-700',
  tagBg:      'bg-orange-50 border-orange-200 text-orange-700',
  navBtn:     'bg-white border-orange-200 hover:border-orange-400 text-orange-800',
  backBtn:    'bg-orange-500 hover:bg-orange-600',
  productBar: 'from-orange-700 via-amber-500 to-yellow-400',
};

export default function MieKremesProposalPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF2] font-[Inter,sans-serif] text-[#1C0A00]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap');
        @media print { .no-print { display: none !important; } body { background: white !important; } }
        .pf { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes float3d {
          0%, 100% {
            transform: perspective(900px) rotateY(-10deg) rotateX(5deg) translateY(0px);
            filter: drop-shadow(0 25px 35px rgba(194,65,12,0.30));
          }
          50% {
            transform: perspective(900px) rotateY(10deg) rotateX(-5deg) translateY(-20px);
            filter: drop-shadow(0 42px 55px rgba(194,65,12,0.15));
          }
        }
        @keyframes float3dSec {
          0%, 100% {
            transform: perspective(900px) rotateY(8deg) rotateX(-4deg) translateY(0px) scale(0.88);
            filter: drop-shadow(0 20px 28px rgba(190,18,60,0.25));
          }
          50% {
            transform: perspective(900px) rotateY(-8deg) rotateX(4deg) translateY(-14px) scale(0.88);
            filter: drop-shadow(0 35px 48px rgba(190,18,60,0.12));
          }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); filter: drop-shadow(0 12px 20px rgba(180,83,9,0.2)); }
          50%       { transform: translateY(-10px) rotate(1deg); filter: drop-shadow(0 22px 32px rgba(180,83,9,0.1)); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50%       { transform: scale(1.2); opacity: 0.5; }
        }
        .img-3d-main { animation: float3d 6s ease-in-out infinite; }
        .img-3d-sec  { animation: float3dSec 6s ease-in-out infinite 1.2s; }
        .logo-float  { animation: logoFloat 5s ease-in-out infinite; }
        .orb-pulse   { animation: orbPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${C.hero} border-b ${C.heroBorder}`}>
        <div className="absolute inset-0 opacity-25">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full ${C.blob1} blur-3xl translate-x-1/3 -translate-y-1/3`} />
          <div className={`absolute bottom-0 left-0 w-72 h-72 rounded-full ${C.blob2} blur-3xl -translate-x-1/4 translate-y-1/4`} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-16 md:pb-20">

          {/* Nav */}
          <div className="flex justify-between items-center mb-10 no-print">
            <a href="/proposal" className={`inline-flex items-center gap-2 ${C.navBtn} border font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Semua Proposal
            </a>
            <a href="/" className="inline-flex items-center gap-2 bg-white border border-orange-200 hover:border-orange-400 text-orange-700 font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md">
              🏠 Ke Toko
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Text + stats */}
            <div className="flex-1">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 ${C.badge} border rounded-full px-4 py-1.5 text-sm font-medium mb-6`}>
                <span className={`w-1.5 h-1.5 rounded-full ${C.badgeDot} animate-pulse`} />
                Proposal Kerjasama Resmi · 2026
              </div>

              {/* Logo kecil + judul */}
              <div className="flex items-center gap-3 mb-4">
                <div className="logo-float flex-shrink-0">
                  <Image src={logo} alt="Logo Teh Risma" width={56} height={56} className="rounded-full border-2 border-white shadow-lg object-cover" />
                </div>
                <p className="text-xs text-orange-700 font-semibold tracking-wide">Cemilan Teh Risma</p>
              </div>

              <h1 className="pf text-4xl md:text-5xl font-bold leading-tight mb-2 text-[#1C0A00]">
                Proposal Titip Jual<br />
                <span className={C.heading}>Mie Kremes</span>
              </h1>
              <p className="text-[#3D1A00]/60 text-sm md:text-base max-w-md">
                Camilan mie crispy renyah khas Bogor — bumbu rempah alami, bersertifikat Halal, tanpa pengawet.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mt-7">
                {[
                  { v: '2', l: 'Varian Rasa' },
                  { v: '150g', l: 'Per Kemasan' },
                  { v: 'Rp 10rb', l: 'Harga Jual' },
                  { v: 'Halal', l: 'Bersertifikat' },
                ].map(s => (
                  <div key={s.l} className={`text-center bg-white/70 border ${C.statBorder} rounded-xl px-4 py-2.5 shadow-sm`}>
                    <div className={`pf text-xl font-bold ${C.stat}`}>{s.v}</div>
                    <div className="text-xs text-[#3D1A00]/60 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Product images */}
            <div className="flex-shrink-0 relative w-52 h-64 md:w-60 md:h-72">
              {/* Produk Pedas (belakang) */}
              <div className="absolute right-0 bottom-0 img-3d-sec">
                <Image
                  src={imgMiePdas}
                  alt="Mie Kremes Pedas"
                  width={140}
                  height={175}
                  className="rounded-2xl object-cover"
                />
              </div>
              {/* Produk Original (depan) */}
              <div className="absolute left-0 top-0 img-3d-main">
                <Image
                  src={imgMieOri}
                  alt="Mie Kremes Original"
                  width={155}
                  height={194}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L60 33C120 27 240 13 360 10C480 7 600 13 720 17C840 20 960 20 1080 17C1200 13 1320 7 1380 3L1440 0V40H0Z" fill={C.wave} /></svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* ── SURAT PENGANTAR ── */}
        <section className="py-12">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl flex-shrink-0">📋</div>
              <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-1">Surat Pengantar</p>
                <h2 className="pf text-2xl font-bold text-[#1C0A00]">Kepada Yth.<br />Pimpinan / Pengelola Toko</h2>
              </div>
            </div>
            <div className="text-[#3D1A00]/80 leading-relaxed space-y-4 text-[15px]">
              <p>Assalamu&apos;alaikum Wr. Wb.</p>
              <p>
                Saya dari <strong className="text-orange-700">Cemilan Teh Risma</strong>, usaha camilan rumahan khas Bogor. Bersama surat ini, kami mengajukan penawaran kerjasama <strong>titip jual (konsinyasi)</strong> produk <strong>Mie Kremes</strong> kami di tempat yang Anda kelola.
              </p>
              <p>
                Mie Kremes adalah camilan mie crispy dengan bumbu rempah alami — hadir dalam dua rasa: <strong>Original</strong> (gurih alami) dan <strong>Pedas</strong> (cabai asli). Produk ini memiliki daya tarik tinggi sebagai camilan harian maupun oleh-oleh khas Bogor, dengan harga yang sangat terjangkau dan kemasan higienis.
              </p>
              <p>Kami berharap kerjasama ini membawa manfaat bagi kedua belah pihak dan memuaskan pelanggan Anda.</p>
              <p>Wassalamu&apos;alaikum Wr. Wb.</p>
              <div className="mt-6 pt-6 border-t border-orange-100">
                <p className="font-semibold text-[#1C0A00]">Hormat kami,</p>
                <p className="pf text-xl font-bold text-orange-700 mt-1">Cemilan Teh Risma</p>
                <p className="text-sm text-[#3D1A00]/60">Bogor, Jawa Barat</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUK ── */}
        <section className="mb-12">
          <ST icon="🍝" label="Katalog Produk" title="Detail Produk Mie Kremes" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <div className="grid md:grid-cols-2 gap-5 mt-6">

            {/* Original */}
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
              <div className="relative h-40 overflow-hidden">
                <Image src={imgMieOri} alt="Mie Kremes Original" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Best Seller</span>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="pf text-xl font-bold text-[#1C0A00]">Mie Kremes Original</h3>
                </div>
                <p className="text-sm text-[#3D1A00]/60 leading-relaxed mb-4">
                  Mie kering crispy dengan bumbu gurih alami dari kencur, bawang putih, dan daun jeruk. Rasa yang sederhana tapi nagih di setiap gigitan.
                </p>
                <div className="space-y-2 mb-5">
                  {[
                    ['Bahan Utama', 'Mie Kering, Minyak Nabati, Kencur, Bawang Putih, Daun Jeruk'],
                    ['Rasa', 'Gurih original alami'],
                    ['Berat', '150g per kemasan'],
                    ['Tekstur', 'Super crispy, renyah tahan lama'],
                    ['Keunggulan', 'Tanpa pengawet, HALAL, cocok semua usia'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-sm">
                      <span className="text-orange-500 font-semibold w-28 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/70">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-2 pt-4 border-t border-orange-50">
                  <span className="pf text-2xl font-bold text-orange-700">Rp 10.000</span>
                  <span className="text-xs text-[#3D1A00]/40">/ kemasan 150g</span>
                </div>
              </div>
            </div>

            {/* Pedas */}
            <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
              <div className="relative h-40 overflow-hidden">
                <Image src={imgMiePdas} alt="Mie Kremes Pedas" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Popular</span>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="pf text-xl font-bold text-[#1C0A00]">Mie Kremes Pedas</h3>
                </div>
                <p className="text-sm text-[#3D1A00]/60 leading-relaxed mb-4">
                  Mie kering crispy dengan bubuk cabai asli dan bumbu pedas khas. Untuk pencinta pedas yang suka tekstur renyah — pedas yang nendang!
                </p>
                <div className="space-y-2 mb-5">
                  {[
                    ['Bahan Utama', 'Mie Kering, Bubuk Cabai Asli, Bumbu Pedas, Daun Jeruk, Kencur'],
                    ['Rasa', 'Pedas nendang, kriuk menggoda'],
                    ['Berat', '150g per kemasan'],
                    ['Tekstur', 'Super crispy, pedas meresap'],
                    ['Keunggulan', 'Tanpa pengawet, HALAL, level pedas pas'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-sm">
                      <span className="text-red-500 font-semibold w-28 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/70">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-2 pt-4 border-t border-red-50">
                  <span className="pf text-2xl font-bold text-red-600">Rp 10.000</span>
                  <span className="text-xs text-[#3D1A00]/40">/ kemasan 150g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ringkasan harga */}
          <div className="mt-5 bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <p className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-3">Ringkasan Harga Jual</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Mie Kremes Original', price: 'Rp 10.000', weight: '150g' },
                { name: 'Mie Kremes Pedas', price: 'Rp 10.000', weight: '150g' },
              ].map(p => (
                <div key={p.name} className="bg-white rounded-xl border border-orange-100 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm text-[#1C0A00]">{p.name}</p>
                    <p className="text-xs text-[#3D1A00]/50">{p.weight}</p>
                  </div>
                  <p className="pf font-bold text-orange-700">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KEUNGGULAN ── */}
        <section className="mb-12">
          <ST icon="⭐" label="Keunggulan" title="Mengapa Mie Kremes?" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { icon: '🔥', title: 'Tekstur Super Crispy', desc: 'Renyah tahan lama bahkan setelah kemasan dibuka. Tidak melempem karena proses produksi dan pengemasan yang tepat.' },
              { icon: '🌿', title: 'Bumbu Rempah Alami', desc: 'Menggunakan kencur, bawang putih, dan daun jeruk asli — bukan perisa artifisial. Rasa autentik khas dapur Indonesia.' },
              { icon: '✅', title: 'HALAL & Aman', desc: 'Bersertifikat Halal Indonesia, tanpa MSG berlebih, tanpa pengawet kimia. Aman untuk semua kalangan termasuk anak-anak.' },
              { icon: '💰', title: 'Harga Sangat Terjangkau', desc: 'Harga jual Rp 10.000 sangat kompetitif untuk pasar camilan. Margin menarik untuk mitra dengan omset yang stabil.' },
              { icon: '📦', title: 'Kemasan Higienis', desc: 'Dikemas kedap udara dengan label informatif. Bersih, rapi, dan photogenic untuk display toko maupun konten media sosial.' },
              { icon: '🎯', title: 'Potensi Pasar Luas', desc: 'Cocok untuk semua segmen: anak-anak, remaja, dewasa. Ideal sebagai camilan harian, bekal, maupun oleh-oleh khas Bogor.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-orange-100 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-[#1C0A00] mb-1">{item.title}</h4>
                  <p className="text-sm text-[#3D1A00]/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SKEMA KERJASAMA ── */}
        <section className="mb-12">
          <ST icon="🤝" label="Skema Kerjasama" title="Mekanisme Titip Jual" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <div className={`mt-6 bg-gradient-to-br ${C.schemeBg} border rounded-2xl p-8`}>
            <p className="text-[#3D1A00]/70 text-sm mb-6">
              Kami menawarkan skema <strong className={C.schemeStrong}>menguntungkan dan tidak memberatkan</strong> mitra. Berikut mekanismenya:
            </p>
            <div className="space-y-5">
              {[
                { s: '01', t: 'Penitipan Produk', d: 'Produk dititipkan di toko mitra tanpa biaya di muka. Kami antar langsung ke lokasi dalam kondisi layak jual.' },
                { s: '02', t: 'Margin Keuntungan Mitra', d: 'Mitra mendapat margin kompetitif setiap produk terjual. Detail margin dibahas dan disepakati bersama sebelum kerjasama dimulai.' },
                { s: '03', t: 'Perhitungan Berkala', d: 'Pembayaran dilakukan mingguan atau bulanan sesuai kesepakatan, berdasarkan jumlah produk yang terjual.' },
                { s: '04', t: 'Rotasi Produk', d: 'Produk mendekati batas kadaluarsa atau tidak terjual akan diganti produk baru — mitra tidak rugi.' },
                { s: '05', t: 'Fleksibel & Bisa Negosiasi', d: 'Jumlah produk, jadwal pengiriman, dan detail lain dapat disesuaikan sepenuhnya dengan kebutuhan toko mitra.' },
              ].map(item => (
                <div key={item.s} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${C.stepNum} border flex items-center justify-center font-bold text-sm flex-shrink-0`}>{item.s}</div>
                  <div>
                    <h4 className="font-semibold text-[#1C0A00] mb-0.5">{item.t}</h4>
                    <p className="text-sm text-[#3D1A00]/70 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARGET PASAR ── */}
        <section className="mb-12">
          <ST icon="🎯" label="Target Pasar" title="Cocok Dijual Di Mana?" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: '🏪', label: 'Toko Oleh-Oleh' },
              { icon: '☕', label: 'Kafe & Warung' },
              { icon: '🏔️', label: 'Wisata & Rest Area' },
              { icon: '🏫', label: 'Kantin Sekolah' },
              { icon: '🏬', label: 'Minimarket Lokal' },
              { icon: '🎪', label: 'Pameran & Bazaar' },
              { icon: '🏨', label: 'Hotel & Penginapan' },
              { icon: '🛒', label: 'Online Shop' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-orange-100 p-4 text-center hover:border-orange-300 transition-colors">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-xs font-medium text-[#1C0A00]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LEGALITAS ── */}
        <section className="mb-12">
          <ST icon="📜" label="Legalitas" title="Legalitas &amp; Kepercayaan" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: '🔰', t: 'NIB Resmi', sub: '0403260068412', d: 'Terdaftar resmi di OSS — Kementerian Investasi RI.' },
              { icon: '☪️', t: 'Halal Certified', sub: 'Sertifikat Halal Indonesia', d: 'Aman dikonsumsi seluruh kalangan, termasuk anak-anak.' },
              { icon: '🏭', t: 'Produksi Higienis', sub: 'Standar Keamanan Pangan', d: 'Diproduksi di fasilitas bersih dengan standar higienitas tinggi.' },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-orange-100 p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-[#1C0A00] mb-1">{item.t}</h4>
                <p className="text-xs text-orange-700 font-semibold mb-2">{item.sub}</p>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className={`bg-gradient-to-br ${C.ctaBg} border rounded-2xl p-8 text-center`}>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="pf text-2xl md:text-3xl font-bold text-[#1C0A00] mb-3">Mari Berkolaborasi!</h3>
            <p className="text-[#3D1A00]/70 leading-relaxed max-w-lg mx-auto mb-7 text-[15px]">
              Tertarik menitipkan Mie Kremes di toko Anda? Hubungi kami untuk mendiskusikan detail kerjasama, margin keuntungan, dan jadwal pengiriman perdana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 no-print">
              <a href="https://wa.me/6281212132014" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                💬 Hubungi via WhatsApp
              </a>
              <a href="/" className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                🌐 Lihat Katalog Online
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                { icon: '📱', l: 'WhatsApp', v: '+62 812-1213-2014' },
                { icon: '🌐', l: 'Website', v: 'cemilantehrisma.vercel.app' },
                { icon: '📍', l: 'Lokasi', v: 'Bogor, Jawa Barat' },
              ].map(c => (
                <div key={c.l} className="bg-white rounded-xl border border-orange-100 p-3">
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className="text-xs text-orange-700 font-semibold">{c.l}</div>
                  <div className="text-[#1C0A00] font-medium text-xs mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-[#3D1A00]/30 mt-6">Dokumen ini diterbitkan oleh <strong>Cemilan Teh Risma</strong> — Bogor · Bersifat rahasia untuk keperluan kerjasama bisnis.</p>
        </section>
      </div>
    </div>
  );
}

function ST({ icon, label, title, accent, iconBg, line }: { icon: string; label: string; title: string; accent: string; iconBg: string; line: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} border flex items-center justify-center text-2xl flex-shrink-0`}>{icon}</div>
      <div>
        <p className={`text-xs font-bold tracking-widest ${accent} uppercase`}>{label}</p>
        <h2 className="pf text-2xl font-bold text-[#1C0A00]" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <div className={`flex-1 h-px bg-gradient-to-r ${line} to-transparent ml-2`} />
    </div>
  );
}

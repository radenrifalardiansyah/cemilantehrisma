import type { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import imgMieOri from '@/assets/images/Mie Kremes 150g Original.png';
import imgMiePdas from '@/assets/images/Mie Kremes 150g Pedas.png';
import HalalBadge from '@/components/HalalBadge';
import MieStack3D from '@/components/MieStack3D';

export const metadata: Metadata = {
  title: 'Proposal Mie Kremes — Cemilan Teh Risma',
  description: 'Proposal kerjasama titip jual Mie Kremes Cemilan Teh Risma.',
  robots: { index: false, follow: false },
};

// ── Warna tema: sesuai stiker produk Mie Kremes (orange-700 → amber-600 → yellow-400)
const C = {
  hero:       'from-orange-100 via-amber-100 to-yellow-100',
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

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); filter: drop-shadow(0 12px 20px rgba(180,83,9,0.2)); }
          50%       { transform: translateY(-10px) rotate(1deg); filter: drop-shadow(0 22px 32px rgba(180,83,9,0.1)); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50%       { transform: scale(1.2); opacity: 0.5; }
        }
        .logo-float  { animation: logoFloat 5s ease-in-out infinite; }
        .orb-pulse   { animation: orbPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${C.hero}`}>
        <div className="absolute inset-0 opacity-50">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full ${C.blob1} blur-3xl translate-x-1/3 -translate-y-1/3`} />
          <div className={`absolute bottom-0 left-0 w-72 h-72 rounded-full ${C.blob2} blur-3xl -translate-x-1/4 translate-y-1/4`} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-16 md:pb-20">


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
                Proposal<br />
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
                ].map(s => (
                  <div key={s.l} className={`text-center bg-white/70 border ${C.statBorder} rounded-xl px-4 py-2.5 shadow-sm`}>
                    <div className={`pf text-xl font-bold ${C.stat}`}>{s.v}</div>
                    <div className="text-xs text-[#3D1A00]/60 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D interactive product stack */}
            <MieStack3D imgOri={imgMieOri} imgPdas={imgMiePdas} />
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

            {/* Header surat */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl flex-shrink-0">📋</div>
              <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-1">Surat Penawaran Kerjasama</p>
                <h2 className="pf text-2xl font-bold text-[#1C0A00]">Kepada Yth.<br />Pimpinan / Pengelola Toko</h2>
                <p className="text-xs text-[#3D1A00]/40 mt-1">di Tempat</p>
              </div>
            </div>

            <div className="text-[#3D1A00]/80 leading-relaxed space-y-5 text-[15px]">
              <p>Assalamu&apos;alaikum Wr. Wb.</p>

              <p>
                Dengan hormat, perkenalkan kami dari <strong className="text-orange-700">Cemilan Teh Risma</strong> — usaha camilan rumahan yang berbasis di <strong>Bogor, Jawa Barat</strong>, terdaftar resmi dengan <strong>NIB: 0403260068412</strong> dan produk bersertifikat <strong>Halal Indonesia</strong>. Melalui surat ini, kami mengajukan penawaran kerjasama pemasaran produk unggulan kami, <strong className="text-orange-700">Mie Kremes</strong>, untuk dapat dipasarkan di tempat yang Bapak/Ibu kelola.
              </p>

              <p>
                <strong>Mie Kremes</strong> adalah camilan mie crispy khas Bogor yang dibuat dari bahan-bahan pilihan dengan bumbu rempah alami — tanpa pengawet, tanpa MSG berlebih, dan aman untuk semua kalangan. Produk kami hadir dalam dua pilihan rasa: <strong>Original</strong> (gurih alami dari kencur, bawang putih &amp; daun jeruk) dan <strong>Pedas</strong> (cabai asli yang nendang), masing-masing dalam kemasan higienis 150g. Dengan harga yang sangat terjangkau, Mie Kremes cocok sebagai camilan harian, bekal, maupun oleh-oleh khas Bogor yang bernilai jual tinggi.
              </p>

              {/* Ringkasan produk */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 my-6">
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-3">Ringkasan Produk</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  {[
                    { label: 'Produk', value: 'Mie Kremes' },
                    { label: 'Varian', value: 'Original & Pedas' },
                    { label: 'Kemasan', value: '150g / pcs' },
                    { label: 'Harga Jual', value: 'Rp 10.000/pcs' },
                  ].map(i => (
                    <div key={i.label}>
                      <p className="text-[#3D1A00]/50 text-xs">{i.label}</p>
                      <p className="font-semibold text-[#1C0A00]">{i.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Kami menawarkan <strong>dua skema kerjasama</strong> yang dapat disesuaikan dengan kebutuhan dan kemampuan toko Bapak/Ibu:
              </p>

              {/* Dua mekanisme dalam surat */}
              <div className="space-y-4 pl-1">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-300 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-semibold text-[#1C0A00] mb-1">Titip Jual (Konsinyasi)</p>
                    <p className="text-sm text-[#3D1A00]/70 leading-relaxed">
                      Produk kami titipkan di toko Bapak/Ibu <strong>tanpa biaya awal</strong>. Harga pengambilan ditetapkan <strong className="text-orange-700">Rp 9.000/pcs</strong>, dan Bapak/Ibu bebas menentukan harga jual ke konsumen (kami sarankan minimal Rp 10.000). Pembayaran dilakukan berdasarkan jumlah produk yang <em>terjual</em> saja, dengan periode mingguan atau bulanan sesuai kesepakatan. Produk yang tidak terjual atau mendekati kedaluarsa akan kami ganti — <strong>risiko stok sepenuhnya kami tanggung</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-300 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-semibold text-[#1C0A00] mb-1">Beli Putus (Reseller)</p>
                    <p className="text-sm text-[#3D1A00]/70 leading-relaxed">
                      Bapak/Ibu membeli produk secara langsung (<strong>cash</strong>) dengan pilihan paket mulai dari <strong>10 pcs (Rp 90.000)</strong> hingga <strong>30 pcs (Rp 240.000)</strong>. Semakin banyak yang dibeli, semakin murah harga per satuannya. Bapak/Ibu bebas menentukan harga jual sendiri dan mendapatkan potensi untung hingga <strong className="text-green-600">Rp 60.000 per paket</strong>. Detail paket lengkap tersedia di halaman ini.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                Kami meyakini bahwa <strong>Mie Kremes</strong> memiliki potensi pasar yang besar — khususnya sebagai camilan harian yang terjangkau dengan cita rasa khas yang sulit ditolak. Produk ini juga sangat cocok sebagai <strong>oleh-oleh khas Bogor</strong> yang autentik dengan identitas lokal yang kuat.
              </p>

              <p>
                Besar harapan kami untuk dapat berdiskusi lebih lanjut mengenai kerjasama ini. Kami terbuka untuk bernegosiasi terkait jumlah produk, jadwal pengiriman, dan detail teknis lainnya demi kenyamanan dan keuntungan kedua belah pihak. Untuk informasi lebih lanjut, Bapak/Ibu dapat menghubungi kami melalui WhatsApp di nomor <strong className="text-orange-700">0812-1213-2014</strong>.
              </p>

              <p>Atas perhatian dan kepercayaan Bapak/Ibu, kami ucapkan terima kasih yang sebesar-besarnya.</p>
              <p>Wassalamu&apos;alaikum Wr. Wb.</p>

              <div className="mt-6 pt-6 border-t border-orange-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[#3D1A00]/60 mb-1">Bogor, 2026</p>
                  <p className="font-semibold text-[#1C0A00]">Hormat kami,</p>
                  <p className="pf text-xl font-bold text-orange-700 mt-1">Cemilan Teh Risma</p>
                  <p className="text-sm text-[#3D1A00]/60">Bogor, Jawa Barat</p>
                </div>
                <a href="https://wa.me/6281212132014" target="_blank" rel="noopener noreferrer"
                  className="no-print inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto">
                  💬 Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2 MEKANISME KERJASAMA ── */}
        <section className="mb-12">
          <ST icon="🤝" label="Mekanisme Kerjasama" title="2 Pilihan Cara Kerjasama" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <p className="text-sm text-[#3D1A00]/50 mt-4 mb-6">
            Kami menyediakan dua mekanisme yang fleksibel — pilih yang paling sesuai dengan kebutuhan toko Anda.
          </p>
          <div className="grid md:grid-cols-2 gap-5">

            {/* Titip Jual */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-5 border-b border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🤝</span>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase">Mekanisme 1</p>
                    <h3 className="pf text-xl font-bold text-[#1C0A00]">Titip Jual</h3>
                  </div>
                </div>
                <span className="inline-block bg-green-100 border border-green-300 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Tanpa Modal Awal</span>
              </div>
              <div className="p-6">
                <div className="space-y-2.5 mb-5 text-sm">
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Harga Pengambilan</span>
                    <span className="font-bold text-orange-700">Rp 9.000 / pcs</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Harga Jual ke Konsumen</span>
                    <span className="font-semibold text-[#1C0A00]">Bebas (saran Rp 10.000+)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Estimasi Margin Toko</span>
                    <span className="font-bold text-green-600">min. Rp 1.000 / pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3D1A00]/60">Sistem Pembayaran</span>
                    <span className="font-semibold text-[#1C0A00]">Mingguan / Bulanan</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'Produk dititipkan tanpa biaya di muka',
                    'Bayar hanya dari produk yang terjual',
                    'Stok tidak laku / mendekati kedaluarsa diganti',
                    'Cocok untuk toko yang baru mencoba produk kami',
                  ].map(p => (
                    <div key={p} className="flex gap-2 text-sm text-[#3D1A00]/70">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Beli Putus / Reseller */}
            <div className="relative bg-white rounded-2xl border-2 border-orange-400 overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold text-white" style={{background:'linear-gradient(90deg,#f97316,#D97706)'}}>
                Margin Lebih Besar
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 px-6 pt-9 pb-5 border-b border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💼</span>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Mekanisme 2</p>
                    <h3 className="pf text-xl font-bold text-[#1C0A00]">Beli Putus / Reseller</h3>
                  </div>
                </div>
                <span className="inline-block bg-orange-200 border border-orange-300 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">Bayar Langsung / Cash</span>
              </div>
              <div className="p-6">
                <div className="space-y-2.5 mb-5 text-sm">
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Harga Per Pcs</span>
                    <span className="font-bold text-orange-700">Rp 8.000 – 9.000</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Harga Jual ke Konsumen</span>
                    <span className="font-semibold text-[#1C0A00]">Bebas (saran Rp 10.000)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-orange-50">
                    <span className="text-[#3D1A00]/60">Potensi Margin</span>
                    <span className="font-bold text-green-600">Rp 1.000 – 2.000 / pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3D1A00]/60">Sistem Pembayaran</span>
                    <span className="font-semibold text-[#1C0A00]">Cash / Bayar Langsung</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'Pilih dari 3 paket sesuai kemampuan modal',
                    'Harga makin murah semakin banyak order',
                    'Bebas tentukan harga jual sendiri',
                    'Cocok untuk toko yang sudah yakin & ingin margin lebih besar',
                  ].map(p => (
                    <div key={p} className="flex gap-2 text-sm text-[#3D1A00]/70">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#3D1A00]/40 mt-4 text-center">
            Detail pilihan paket Beli Putus tersedia di seksi <strong>Paket Reseller</strong> di bawah.
          </p>
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

        {/* ── PAKET RESELLER ── */}
        <section className="mb-12">
          <ST icon="💼" label="Paket Reseller" title="Harga &amp; Paket Reseller" accent="text-orange-600" iconBg="bg-orange-100 border-orange-200" line="from-orange-200" />
          <p className="text-sm text-[#3D1A00]/50 mt-4 mb-5">
            Harga jual ke konsumen: <strong className="text-orange-700">Rp 10.000/pcs</strong>. Semakin banyak order, semakin besar keuntungan Anda.
          </p>
          <div className="grid md:grid-cols-3 gap-5">

            {/* Krenyes Pemula */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-400 px-6 py-5 text-white text-center">
                <div className="text-4xl mb-2">🌱</div>
                <p className="pf text-lg font-bold">Paket Krenyes Pemula</p>
                <p className="text-white/80 text-sm">10 pcs Mie Kremes</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-[#3D1A00]/50 mb-0.5">Modal Awal</p>
                  <p className="pf text-2xl font-bold gradient-text">Rp 90.000</p>
                  <p className="text-xs text-[#3D1A00]/40">= Rp 9.000/pcs</p>
                </div>
                <div className="h-px bg-amber-50" />
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Harga Jual</span><span className="font-semibold text-[#1C0A00]">Rp 10.000/pcs</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Omset</span><span className="font-semibold text-[#1C0A00]">Rp 100.000</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Untung</span><span className="font-bold text-green-600">Rp 10.000</span></div>
              </div>
            </div>

            {/* Kremes Nagih */}
            <div className="relative bg-white rounded-2xl border-2 border-orange-400 overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold text-white" style={{background:'linear-gradient(90deg,#f97316,#D97706)'}}>
                Best Seller
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-400 px-6 pt-9 pb-5 text-white text-center">
                <div className="text-4xl mb-2">🔥</div>
                <p className="pf text-lg font-bold">Paket Kremes Nagih</p>
                <p className="text-white/80 text-sm">20 pcs Mie Kremes</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-[#3D1A00]/50 mb-0.5">Modal Awal</p>
                  <p className="pf text-2xl font-bold gradient-text">Rp 170.000</p>
                  <p className="text-xs text-[#3D1A00]/40">= Rp 8.500/pcs</p>
                </div>
                <div className="h-px bg-orange-50" />
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Harga Jual</span><span className="font-semibold text-[#1C0A00]">Rp 10.000/pcs</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Omset</span><span className="font-semibold text-[#1C0A00]">Rp 200.000</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Untung</span><span className="font-bold text-green-600">Rp 30.000</span></div>
              </div>
            </div>

            {/* Kriuk Maksimal */}
            <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-rose-500 to-orange-400 px-6 py-5 text-white text-center">
                <div className="text-4xl mb-2">💎</div>
                <p className="pf text-lg font-bold">Paket Kriuk Maksimal</p>
                <p className="text-white/80 text-sm">30 pcs Mie Kremes</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-[#3D1A00]/50 mb-0.5">Modal Awal</p>
                  <p className="pf text-2xl font-bold gradient-text">Rp 240.000</p>
                  <p className="text-xs text-[#3D1A00]/40">= Rp 8.000/pcs</p>
                </div>
                <div className="h-px bg-rose-50" />
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Harga Jual</span><span className="font-semibold text-[#1C0A00]">Rp 10.000/pcs</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Omset</span><span className="font-semibold text-[#1C0A00]">Rp 300.000</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#3D1A00]/60">Potensi Untung</span><span className="font-bold text-green-600">Rp 60.000</span></div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
            <p className="text-xs text-[#3D1A00]/50 text-center sm:text-left">* Bebas mix rasa Original &amp; Pedas. Harga belum termasuk ongkos kirim.</p>
            <a href="/reseller" target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
              Daftar Reseller →
            </a>
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
              { icon: 'halal', t: 'Halal Certified', sub: 'Sertifikat Halal Indonesia', d: 'Aman dikonsumsi seluruh kalangan, termasuk anak-anak.' },
              { icon: '🏭', t: 'Produksi Higienis', sub: 'Standar Keamanan Pangan', d: 'Diproduksi di fasilitas bersih dengan standar higienitas tinggi.' },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-orange-100 p-6 text-center">
                <div className="flex justify-center mb-3">
                  {item.icon === 'halal' ? <HalalBadge size={48} /> : <span className="text-4xl">{item.icon}</span>}
                </div>
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
              <a href="https://wa.me/6281212132014" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                💬 Hubungi via WhatsApp
              </a>
              <a href="/" className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                🛒 Toko Saya
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <a href="https://wa.me/6281212132014" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-orange-100 p-3 hover:border-orange-300 transition-colors">
                <div className="text-xl mb-1">📱</div>
                <div className="text-xs text-orange-700 font-semibold">WhatsApp</div>
                <div className="text-[#1C0A00] font-medium text-xs mt-0.5">+62 812-1213-2014</div>
              </a>
              <a href="/" className="bg-white rounded-xl border border-orange-100 p-3 hover:border-orange-300 transition-colors">
                <div className="text-xl mb-1">🛒</div>
                <div className="text-xs text-orange-700 font-semibold">Toko Online</div>
                <div className="text-orange-600 font-medium text-xs mt-0.5 underline underline-offset-2">Kunjungi Toko Kami</div>
              </a>
              <div className="bg-white rounded-xl border border-orange-100 p-3">
                <div className="text-xl mb-1">📍</div>
                <div className="text-xs text-orange-700 font-semibold">Lokasi</div>
                <div className="text-[#1C0A00] font-medium text-xs mt-0.5">Bogor, Jawa Barat</div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#3D1A00]/30 mt-6">Dokumen ini diterbitkan oleh <strong>Cemilan Teh Risma</strong> — Bogor · Bersifat rahasia untuk keperluan kerjasama bisnis.</p>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-orange-100 bg-white mt-4">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center space-y-1.5">
          <p className="text-xs text-[#3D1A00]/50">© 2026 <strong className="text-[#3D1A00]/70">Cemilan Teh Risma</strong>. Semua hak dilindungi.</p>
          <p className="text-xs text-[#3D1A00]/35">Dikembangkan oleh <a href="https://eleven-digital.id/" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-700/60 hover:text-amber-700 underline underline-offset-2 transition-colors">PT. Eleven Digital Indonesia</a> · didukung oleh <strong className="text-[#3D1A00]/45">PT. RMedia Production</strong></p>
        </div>
      </footer>
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

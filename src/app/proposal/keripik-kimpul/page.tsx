import type { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import imgOri from '@/assets/images/Keripik Kimpul 100g Original.png';
import imgBBQ from '@/assets/images/Keripik Kimpul 100g BBQ Pedas.png';
import imgJgn from '@/assets/images/Keripik Kimpul 100g Jagung.png';

export const metadata: Metadata = {
  title: 'Proposal Keripik Kimpul — Cemilan Teh Risma',
  description: 'Proposal kerjasama titip jual Keripik Kimpul Cemilan Teh Risma.',
  robots: { index: false, follow: false },
};

// ── Warna tema: sesuai stiker produk Keripik Kimpul (amber-700 → yellow-500 → amber-400)
export default function KeripikKimpulProposalPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF2] font-[Inter,sans-serif] text-[#1C0A00]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap');
        @media print { .no-print { display: none !important; } body { background: white !important; } }
        .pf { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes float3dA {
          0%, 100% {
            transform: perspective(900px) rotateY(-10deg) rotateX(5deg) translateY(0px);
            filter: drop-shadow(0 22px 32px rgba(180,83,9,0.30));
          }
          50% {
            transform: perspective(900px) rotateY(10deg) rotateX(-5deg) translateY(-18px);
            filter: drop-shadow(0 38px 50px rgba(180,83,9,0.14));
          }
        }
        @keyframes float3dB {
          0%, 100% {
            transform: perspective(900px) rotateY(9deg) rotateX(-4deg) translateY(0px) scale(0.87);
            filter: drop-shadow(0 18px 26px rgba(202,138,4,0.28));
          }
          50% {
            transform: perspective(900px) rotateY(-9deg) rotateX(4deg) translateY(-12px) scale(0.87);
            filter: drop-shadow(0 32px 44px rgba(202,138,4,0.12));
          }
        }
        @keyframes float3dC {
          0%, 100% {
            transform: perspective(900px) rotateY(-7deg) rotateX(3deg) translateY(0px) scale(0.76);
            filter: drop-shadow(0 15px 22px rgba(185,28,28,0.22));
          }
          50% {
            transform: perspective(900px) rotateY(7deg) rotateX(-3deg) translateY(-10px) scale(0.76);
            filter: drop-shadow(0 26px 38px rgba(185,28,28,0.10));
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
        .img-3d-a  { animation: float3dA 6s ease-in-out infinite; }
        .img-3d-b  { animation: float3dB 6s ease-in-out infinite 1.0s; }
        .img-3d-c  { animation: float3dC 6s ease-in-out infinite 2.0s; }
        .logo-float { animation: logoFloat 5s ease-in-out infinite; }
        .orb-pulse  { animation: orbPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 border-b border-amber-100">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-300 blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-yellow-200 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-16 md:pb-20">

          {/* Nav */}
          <div className="flex justify-between items-center mb-10 no-print">
            <a href="/proposal" className="inline-flex items-center gap-2 bg-white border border-amber-200 hover:border-amber-400 text-amber-800 font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Semua Proposal
            </a>
            <a href="/" className="inline-flex items-center gap-2 bg-white border border-amber-200 hover:border-amber-400 text-amber-700 font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md">
              🏠 Ke Toko
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Text + stats */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-1.5 text-amber-700 text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Proposal Kerjasama Resmi · 2026
              </div>

              {/* Logo kecil + brand */}
              <div className="flex items-center gap-3 mb-4">
                <div className="logo-float flex-shrink-0">
                  <Image src={logo} alt="Logo Teh Risma" width={56} height={56} className="rounded-full border-2 border-white shadow-lg object-cover" />
                </div>
                <p className="text-xs text-amber-700 font-semibold tracking-wide">Cemilan Teh Risma</p>
              </div>

              <h1 className="pf text-4xl md:text-5xl font-bold leading-tight mb-2 text-[#1C0A00]">
                Proposal Titip Jual<br />
                <span className="text-amber-600">Keripik Kimpul</span>
              </h1>
              <p className="text-[#3D1A00]/60 text-sm md:text-base max-w-md">
                Keripik talas balitung renyah khas Bogor — 3 varian rasa, 2 ukuran kemasan, bersertifikat Halal & tanpa pengawet.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mt-7">
                {[
                  { v: '3', l: 'Varian Rasa' },
                  { v: '2 Ukuran', l: '100g & 250g' },
                  { v: 'Rp 15rb', l: 'Mulai Dari' },
                  { v: '3 bln', l: 'Masa Simpan' },
                ].map(s => (
                  <div key={s.l} className="text-center bg-white/70 border border-amber-100 rounded-xl px-4 py-2.5 shadow-sm">
                    <div className="pf text-xl font-bold text-amber-700">{s.v}</div>
                    <div className="text-xs text-[#3D1A00]/60 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D product stack — 3 varian */}
            <div className="flex-shrink-0 relative w-56 h-72 md:w-64 md:h-80">
              {/* Jagung (paling belakang-kanan) */}
              <div className="absolute right-0 bottom-0 img-3d-c">
                <Image src={imgJgn} alt="Keripik Kimpul Jagung" width={120} height={150} className="rounded-2xl object-cover" />
              </div>
              {/* BBQ Pedas (tengah) */}
              <div className="absolute right-6 top-8 img-3d-b">
                <Image src={imgBBQ} alt="Keripik Kimpul BBQ Pedas" width={138} height={173} className="rounded-2xl object-cover" />
              </div>
              {/* Original (paling depan-kiri) */}
              <div className="absolute left-0 top-0 img-3d-a">
                <Image src={imgOri} alt="Keripik Kimpul Original" width={155} height={194} className="rounded-2xl object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L60 33C120 27 240 13 360 10C480 7 600 13 720 17C840 20 960 20 1080 17C1200 13 1320 7 1380 3L1440 0V40H0Z" fill="#FFFBF2" /></svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* ── SURAT PENGANTAR ── */}
        <section className="py-12">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl flex-shrink-0">📋</div>
              <div>
                <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-1">Surat Pengantar</p>
                <h2 className="pf text-2xl font-bold text-[#1C0A00]">Kepada Yth.<br />Pimpinan / Pengelola Toko</h2>
              </div>
            </div>
            <div className="text-[#3D1A00]/80 leading-relaxed space-y-4 text-[15px]">
              <p>Assalamu&apos;alaikum Wr. Wb.</p>
              <p>
                Saya dari <strong className="text-amber-700">Cemilan Teh Risma</strong>, usaha camilan rumahan khas Bogor. Bersama surat ini, kami mengajukan penawaran kerjasama <strong>titip jual (konsinyasi)</strong> produk <strong>Keripik Kimpul Talas Balitung</strong> kami di tempat yang Anda kelola.
              </p>
              <p>
                Keripik Kimpul dibuat dari talas balitung pilihan asli Bogor, digoreng renyah, dan tersedia dalam <strong>3 varian rasa</strong> (Original, BBQ Pedas, Jagung Manis) serta <strong>2 ukuran kemasan</strong> (100g dan 250g jumbo). Produk ini sangat cocok sebagai oleh-oleh khas daerah dengan kemasan menarik dan harga yang kompetitif.
              </p>
              <p>Kami berharap kerjasama ini membawa manfaat bagi kedua belah pihak dan memuaskan pelanggan Anda.</p>
              <p>Wassalamu&apos;alaikum Wr. Wb.</p>
              <div className="mt-6 pt-6 border-t border-amber-100">
                <p className="font-semibold text-[#1C0A00]">Hormat kami,</p>
                <p className="pf text-xl font-bold text-amber-700 mt-1">Cemilan Teh Risma</p>
                <p className="text-sm text-[#3D1A00]/60">Bogor, Jawa Barat</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUK ── */}
        <section className="mb-12">
          <ST icon="🥔" label="Katalog Produk" title="Detail Produk Keripik Kimpul" />

          {/* 3 Varian */}
          <p className="text-sm text-[#3D1A00]/50 mt-6 mb-4">Tersedia dalam kemasan <strong className="text-amber-700">100g</strong> dan <strong className="text-amber-700">250g (Jumbo)</strong></p>
          <div className="grid md:grid-cols-3 gap-5">

            {/* Original */}
            <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
              <div className="relative h-36 overflow-hidden">
                <Image src={imgOri} alt="Keripik Kimpul Original" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Best Seller</span>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="pf text-lg font-bold text-[#1C0A00]">Original</h3>
                </div>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed mb-4">
                  Rasa gurih alami talas kimpul pilihan. Cocok untuk semua usia dan momen makan camilan.
                </p>
                <div className="space-y-1.5 mb-4 text-xs">
                  {[
                    ['Bahan', 'Talas Kimpul, Minyak Goreng, Garam'],
                    ['Rasa', 'Gurih alami'],
                    ['Tahan', '3 bulan'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-amber-600 font-semibold w-12 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/60">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-amber-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">100g</span>
                    <span className="pf font-bold text-amber-700">Rp 15.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">250g (Jumbo)</span>
                    <span className="pf font-bold text-amber-700">Rp 26.500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BBQ Pedas */}
            <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
              <div className="relative h-36 overflow-hidden">
                <Image src={imgBBQ} alt="Keripik Kimpul BBQ Pedas" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Popular</span>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="pf text-lg font-bold text-[#1C0A00]">BBQ Pedas</h3>
                </div>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed mb-4">
                  Perpaduan smoky BBQ dengan sensasi pedas yang nagih. Favorit para pecinta pedas!
                </p>
                <div className="space-y-1.5 mb-4 text-xs">
                  {[
                    ['Bahan', 'Talas Kimpul, Minyak Goreng, Bubuk BBQ, Garam'],
                    ['Rasa', 'BBQ smoky + pedas'],
                    ['Tahan', '3 bulan'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-red-500 font-semibold w-12 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/60">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-red-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">100g</span>
                    <span className="pf font-bold text-red-600">Rp 15.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">250g (Jumbo)</span>
                    <span className="pf font-bold text-red-600">Rp 26.500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jagung */}
            <div className="bg-white rounded-2xl border border-yellow-100 overflow-hidden shadow-sm">
              <div className="relative h-36 overflow-hidden">
                <Image src={imgJgn} alt="Keripik Kimpul Jagung Manis" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-2 right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="pf text-lg font-bold text-[#1C0A00]">Jagung Manis</h3>
                </div>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed mb-4">
                  Rasa jagung manis yang lembut dan menyenangkan. Favorit anak-anak, cocok untuk bekal sekolah.
                </p>
                <div className="space-y-1.5 mb-4 text-xs">
                  {[
                    ['Bahan', 'Talas Kimpul, Minyak Goreng, Bubuk Jagung, Garam'],
                    ['Rasa', 'Manis jagung natural'],
                    ['Tahan', '3 bulan'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-yellow-600 font-semibold w-12 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/60">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-yellow-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">100g</span>
                    <span className="pf font-bold text-yellow-600">Rp 15.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">250g (Jumbo)</span>
                    <span className="pf font-bold text-yellow-600">Rp 26.500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel harga ringkas */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-bold tracking-widest text-amber-700 uppercase mb-4">Ringkasan Harga Jual</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200">
                    <th className="text-left text-xs text-amber-700 font-semibold pb-2">Produk</th>
                    <th className="text-center text-xs text-amber-700 font-semibold pb-2">100g</th>
                    <th className="text-center text-xs text-amber-700 font-semibold pb-2">250g (Jumbo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {[
                    { name: '🥔 Original', p100: 'Rp 15.000', p250: 'Rp 26.500' },
                    { name: '🌶️ BBQ Pedas', p100: 'Rp 15.000', p250: 'Rp 26.500' },
                    { name: '🌽 Jagung Manis', p100: 'Rp 15.000', p250: 'Rp 26.500' },
                  ].map(r => (
                    <tr key={r.name}>
                      <td className="py-2.5 font-medium text-[#1C0A00]">{r.name}</td>
                      <td className="py-2.5 text-center pf font-bold text-amber-700">{r.p100}</td>
                      <td className="py-2.5 text-center pf font-bold text-amber-700">{r.p250}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paket hemat note */}
          <div className="mt-4 bg-violet-50 border border-violet-200 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-semibold text-violet-800 text-sm">Tersedia juga dalam Paket Hemat</p>
              <p className="text-xs text-violet-700/70 mt-0.5">Mix 3 rasa (Rp 40.000) · Mix 5 pcs (Rp 65.000) · Paket Campur dengan Mie Kremes (Rp 44.000). Sangat menarik untuk dijual sebagai hampers atau oleh-oleh.</p>
            </div>
          </div>
        </section>

        {/* ── KEUNGGULAN ── */}
        <section className="mb-12">
          <ST icon="⭐" label="Keunggulan" title="Mengapa Keripik Kimpul?" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { icon: '🌱', title: 'Bahan Baku Lokal Bogor', desc: 'Menggunakan talas kimpul / balitung pilihan dari petani lokal Bogor. Mendukung ekonomi lokal sekaligus menjaga kualitas bahan.' },
              { icon: '🔊', title: 'Super Renyah & Tahan Lama', desc: 'Tekstur crispy yang tahan lama bahkan setelah kemasan dibuka. Proses penggorengan dan pengemasan yang tepat mempertahankan kerenyahan.' },
              { icon: '✅', title: 'HALAL & Tanpa Pengawet', desc: 'Bersertifikat Halal Indonesia. Tidak ada bahan pengawet kimia — aman untuk seluruh keluarga, termasuk anak-anak.' },
              { icon: '📅', title: 'Masa Simpan 3 Bulan', desc: 'Dikemas kedap udara sehingga tahan hingga 3 bulan. Stok toko aman tanpa khawatir cepat kadaluarsa.' },
              { icon: '🎨', title: '3 Rasa, 2 Ukuran', desc: 'Variasi rasa (Original, BBQ Pedas, Jagung) dan ukuran (100g, 250g) memungkinkan segmentasi harga yang fleksibel untuk toko Anda.' },
              { icon: '🏆', title: 'Potensi Oleh-Oleh Khas', desc: 'Talas kimpul adalah bahan khas Bogor yang ikonik. Produk ini memiliki identitas lokal yang kuat — nilai jual sebagai oleh-oleh autentik.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-amber-100 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
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
          <ST icon="🤝" label="Skema Kerjasama" title="Mekanisme Titip Jual" />
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-8">
            <p className="text-[#3D1A00]/70 text-sm mb-6">
              Kami menawarkan skema <strong className="text-amber-700">menguntungkan dan tidak memberatkan</strong> mitra. Berikut mekanismenya:
            </p>
            <div className="space-y-5">
              {[
                { s: '01', t: 'Penitipan Produk', d: 'Produk dititipkan di toko mitra tanpa biaya di muka. Kami antar langsung ke lokasi dalam kondisi layak jual dan siap display.' },
                { s: '02', t: 'Margin Keuntungan Mitra', d: 'Mitra mendapat margin kompetitif setiap produk terjual. Detail margin dibahas dan disepakati bersama sebelum kerjasama dimulai.' },
                { s: '03', t: 'Perhitungan Berkala', d: 'Pembayaran mingguan atau bulanan sesuai kesepakatan, berdasarkan jumlah produk terjual.' },
                { s: '04', t: 'Rotasi Produk', d: 'Produk mendekati batas kadaluarsa atau tidak terjual akan diganti produk baru — mitra tidak menanggung kerugian.' },
                { s: '05', t: 'Fleksibel & Bisa Negosiasi', d: 'Jumlah produk per varian, ukuran kemasan, jadwal pengiriman, dan detail lain dapat disesuaikan penuh dengan kebutuhan toko.' },
              ].map(item => (
                <div key={item.s} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">{item.s}</div>
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
          <ST icon="🎯" label="Target Pasar" title="Cocok Dijual Di Mana?" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: '🏪', label: 'Toko Oleh-Oleh' },
              { icon: '🏔️', label: 'Wisata & Rest Area' },
              { icon: '☕', label: 'Kafe & Warung' },
              { icon: '🏫', label: 'Kantin Sekolah' },
              { icon: '🏬', label: 'Minimarket Lokal' },
              { icon: '🎪', label: 'Pameran & Bazaar' },
              { icon: '🏨', label: 'Hotel & Penginapan' },
              { icon: '🛒', label: 'Online Shop' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-amber-100 p-4 text-center hover:border-amber-300 transition-colors">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-xs font-medium text-[#1C0A00]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LEGALITAS ── */}
        <section className="mb-12">
          <ST icon="📜" label="Legalitas" title="Legalitas &amp; Kepercayaan" />
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: '🔰', t: 'NIB Resmi', sub: '0403260068412', d: 'Terdaftar resmi di OSS — Kementerian Investasi RI.' },
              { icon: '☪️', t: 'Halal Certified', sub: 'Sertifikat Halal Indonesia', d: 'Aman dikonsumsi seluruh kalangan, termasuk anak-anak.' },
              { icon: '🏭', t: 'Produksi Higienis', sub: 'Standar Keamanan Pangan', d: 'Diproduksi di fasilitas bersih dengan standar higienitas tinggi.' },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-amber-100 p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-[#1C0A00] mb-1">{item.t}</h4>
                <p className="text-xs text-amber-700 font-semibold mb-2">{item.sub}</p>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="pf text-2xl md:text-3xl font-bold text-[#1C0A00] mb-3">Mari Berkolaborasi!</h3>
            <p className="text-[#3D1A00]/70 leading-relaxed max-w-lg mx-auto mb-7 text-[15px]">
              Tertarik menitipkan Keripik Kimpul di toko Anda? Hubungi kami untuk mendiskusikan detail kerjasama, varian yang diinginkan, dan jadwal pengiriman perdana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 no-print">
              <a href="https://wa.me/6281212132014" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                💬 Hubungi via WhatsApp
              </a>
              <a href="/" className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                🌐 Lihat Katalog Online
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              {[
                { icon: '📱', l: 'WhatsApp', v: '+62 812-1213-2014' },
                { icon: '🌐', l: 'Website', v: 'cemilantehrisma.vercel.app' },
                { icon: '📍', l: 'Lokasi', v: 'Bogor, Jawa Barat' },
              ].map(c => (
                <div key={c.l} className="bg-white rounded-xl border border-amber-100 p-3">
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className="text-xs text-amber-700 font-semibold">{c.l}</div>
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

function ST({ icon, label, title }: { icon: string; label: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold tracking-widest text-amber-600 uppercase">{label}</p>
        <h2 className="pf text-2xl font-bold text-[#1C0A00]" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent ml-2" />
    </div>
  );
}

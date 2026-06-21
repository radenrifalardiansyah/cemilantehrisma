import type { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/assets/images/logo-tehrisma.jpeg';
import imgOri    from '@/assets/images/Keripik Kimpul 100g Original.png';
import imgBBQ    from '@/assets/images/Keripik Kimpul 100g BBQ.png';
import imgBBQPdas from '@/assets/images/Keripik Kimpul 100g BBQ Pedas.png';
import imgJgn    from '@/assets/images/Keripik Kimpul 100g Jagung.png';
import HalalBadge from '@/components/HalalBadge';
import KimpulCardStack from '@/components/KimpulCardStack';

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
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); filter: drop-shadow(0 12px 20px rgba(180,83,9,0.2)); }
          50%       { transform: translateY(-10px) rotate(1deg); filter: drop-shadow(0 22px 32px rgba(180,83,9,0.1)); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50%       { transform: scale(1.2); opacity: 0.5; }
        }
        .logo-float { animation: logoFloat 5s ease-in-out infinite; }
        .orb-pulse  { animation: orbPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-300 blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-yellow-300 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-16 md:pb-20">


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
                Proposal<br />
                <span className="text-amber-600">Keripik Kimpul</span>
              </h1>
              <p className="text-[#3D1A00]/60 text-sm md:text-base max-w-md">
                Keripik talas balitung renyah khas Bogor — 4 varian rasa, 2 ukuran kemasan, bersertifikat Halal & tanpa pengawet.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mt-7">
                {[
                  { v: '4', l: 'Varian Rasa' },
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

            {/* Interactive card stack */}
            <KimpulCardStack imgOri={imgOri} imgBBQ={imgBBQ} imgBBQPdas={imgBBQPdas} imgJgn={imgJgn} />
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
                Dengan hormat, saya dari <strong className="text-amber-700">Cemilan Teh Risma</strong> — usaha camilan rumahan khas Bogor yang telah bersertifikat <strong>Halal Indonesia</strong> dan memiliki NIB resmi. Melalui surat ini, kami mengajukan penawaran kerjasama pemasaran produk <strong>Keripik Kimpul Talas Balitung</strong> di tempat yang Bapak/Ibu kelola.
              </p>

              {/* Product summary box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-2">
                <p className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-3">Ringkasan Produk</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ['Produk', 'Keripik Kimpul Talas Balitung'],
                    ['Varian Rasa', 'Original, BBQ, BBQ Pedas, Jagung Manis'],
                    ['Ukuran', '100g · 250g (Jumbo)'],
                    ['Harga Eceran', 'Rp 15.000 (100g) · Rp 26.500 (250g)'],
                    ['Masa Simpan', '3 bulan (kemasan kedap udara)'],
                    ['Legalitas', 'Halal Indonesia · NIB 0403260068412'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-amber-700 font-semibold flex-shrink-0 w-28">{k}</span>
                      <span className="text-[#3D1A00]/70">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                Kami menawarkan <strong>2 mekanisme kerjasama</strong> yang dapat disesuaikan dengan kebutuhan toko Anda:
              </p>

              <div className="space-y-3 pl-1">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-semibold text-[#1C0A00]">Titip Jual (Konsinyasi)</p>
                    <p className="text-sm text-[#3D1A00]/70 mt-0.5">
                      Produk dititipkan tanpa biaya di muka. Harga pengambilan <strong className="text-amber-700">Rp 14.000/pcs</strong> untuk 100g dan <strong className="text-amber-700">Rp 25.500/pcs</strong> untuk 250g — dibayar mingguan atau bulanan sesuai hasil penjualan. Harga jual ke konsumen sepenuhnya bebas (saran min. Rp 15.000 / Rp 26.500). Produk yang tidak terjual atau mendekati kadaluarsa akan kami ganti, sehingga toko <strong>tidak menanggung risiko kerugian</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 border border-violet-300 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-semibold text-[#1C0A00]">Beli Putus / Reseller</p>
                    <p className="text-sm text-[#3D1A00]/70 mt-0.5">
                      Toko membeli stok langsung secara tunai. Harga per pcs lebih hemat dibanding titip jual — semakin banyak pemesanan, semakin besar selisih harga yang menjadi keuntungan toko. Stok sepenuhnya menjadi milik toko, bebas dijual kapan saja dan dengan harga berapa pun.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                Kami percaya Keripik Kimpul memiliki daya tarik kuat sebagai <strong>oleh-oleh khas Bogor</strong> yang autentik — bahan baku lokal, rasa yang unik, dan kemasan yang menarik. Kami siap berdiskusi lebih lanjut mengenai mekanisme, jumlah, maupun jadwal pengiriman yang paling sesuai untuk toko Anda.
              </p>
              <p>Wassalamu&apos;alaikum Wr. Wb.</p>
              <div className="mt-6 pt-6 border-t border-amber-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#1C0A00]">Hormat kami,</p>
                  <p className="pf text-xl font-bold text-amber-700 mt-1">Cemilan Teh Risma</p>
                  <p className="text-sm text-[#3D1A00]/60">Bogor, Jawa Barat</p>
                </div>
                <a
                  href="https://wa.me/6281212132014?text=Halo%20Teh%20Risma%2C%20saya%20tertarik%20dengan%20proposal%20Keripik%20Kimpul.%20Bisa%20kita%20diskusi%20lebih%20lanjut%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
                >
                  💬 Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUK ── */}
        <section className="mb-12">
          <ST icon="🥔" label="Katalog Produk" title="Detail Produk Keripik Kimpul" />

          {/* 4 Varian */}
          <p className="text-sm text-[#3D1A00]/50 mt-6 mb-4">Tersedia dalam kemasan <strong className="text-amber-700">100g</strong> dan <strong className="text-amber-700">250g (Jumbo)</strong></p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

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

            {/* BBQ */}
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
              <div className="relative h-36 overflow-hidden">
                <Image src={imgBBQ} alt="Keripik Kimpul BBQ" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Favorit</span>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="pf text-lg font-bold text-[#1C0A00]">BBQ</h3>
                </div>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed mb-4">
                  Rasa BBQ smoky original tanpa pedas. Cocok untuk semua usia, termasuk anak-anak.
                </p>
                <div className="space-y-1.5 mb-4 text-xs">
                  {[
                    ['Bahan', 'Talas Kimpul, Minyak Goreng, Bubuk BBQ, Garam'],
                    ['Rasa', 'BBQ smoky original'],
                    ['Tahan', '3 bulan'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-orange-500 font-semibold w-12 flex-shrink-0">{k}</span>
                      <span className="text-[#3D1A00]/60">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-orange-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">100g</span>
                    <span className="pf font-bold text-orange-600">Rp 15.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#3D1A00]/50">250g (Jumbo)</span>
                    <span className="pf font-bold text-orange-600">Rp 26.500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BBQ Pedas */}
            <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
              <div className="relative h-36 overflow-hidden">
                <Image src={imgBBQPdas} alt="Keripik Kimpul BBQ Pedas" fill className="object-cover" />
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
                    { name: '🍖 BBQ', p100: 'Rp 15.000', p250: 'Rp 26.500' },
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
              { icon: '🎨', title: '4 Rasa, 2 Ukuran', desc: 'Variasi rasa (Original, BBQ, BBQ Pedas, Jagung) dan ukuran (100g, 250g) memungkinkan segmentasi harga yang fleksibel untuk toko Anda.' },
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

        {/* ── 2 MEKANISME KERJASAMA ── */}
        <section className="mb-12">
          <ST icon="🤝" label="Skema Kerjasama" title="2 Pilihan Cara Kerjasama" />
          <p className="mt-3 text-sm text-[#3D1A00]/60">Pilih mekanisme yang paling sesuai dengan kebutuhan dan kondisi toko Anda.</p>

          <div className="mt-6 grid md:grid-cols-2 gap-6">

            {/* CARD 1 — Titip Jual */}
            <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
              <div className="bg-amber-500 px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">Titip Jual</h3>
                  <p className="text-amber-100 text-xs">Tidak perlu modal — bayar setelah terjual</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-2">Harga Pengambilan (per pcs terjual)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-xl border border-amber-200 p-3 text-center">
                      <p className="text-xs text-amber-700/60 mb-1">100g</p>
                      <p className="font-bold text-amber-800 text-lg">Rp 14.000</p>
                      <p className="text-xs text-amber-600/70">per pcs</p>
                    </div>
                    <div className="bg-white rounded-xl border border-amber-200 p-3 text-center">
                      <p className="text-xs text-amber-700/60 mb-1">250g</p>
                      <p className="font-bold text-amber-800 text-lg">Rp 25.500</p>
                      <p className="text-xs text-amber-600/70">per pcs</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-2">Harga Jual ke Konsumen</p>
                  <div className="bg-white rounded-xl border border-amber-200 p-3">
                    <p className="font-semibold text-amber-800 text-sm">Bebas — Toko menentukan sendiri</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-amber-700/70">💡 Saran minimum: <strong>Rp 15.000</strong> untuk 100g</p>
                      <p className="text-xs text-amber-700/70">💡 Saran minimum: <strong>Rp 26.500</strong> untuk 250g</p>
                      <p className="text-xs text-amber-600/60 mt-1.5 italic">Harga lebih tinggi = margin toko lebih besar</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1.5">Estimasi Margin</p>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="font-bold text-green-700 text-base">Min. Rp 1.000</p>
                      <p className="text-xs text-green-600/70">per pcs terjual</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1.5">Sistem Bayar</p>
                    <div className="bg-white border border-amber-200 rounded-xl p-3 text-center">
                      <p className="font-semibold text-amber-800 text-sm">Mingguan</p>
                      <p className="text-xs text-amber-600/70">atau bulanan</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { s: '01', t: 'Produk diantar ke toko', d: 'Tanpa modal di muka. Kami antar langsung, siap display.' },
                    { s: '02', t: 'Toko jual ke konsumen', d: 'Harga jual bebas — semakin tinggi, margin toko semakin besar.' },
                    { s: '03', t: 'Bayar hasil terjual', d: 'Pembayaran mingguan / bulanan sesuai jumlah produk yang habis terjual.' },
                    { s: '04', t: 'Produk tidak laku diganti', d: 'Mendekati kadaluarsa atau tidak habis? Kami ganti produk baru — toko tidak rugi.' },
                  ].map(item => (
                    <div key={item.s} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-800 font-bold text-xs flex-shrink-0">{item.s}</div>
                      <div>
                        <p className="font-semibold text-[#1C0A00] text-sm">{item.t}</p>
                        <p className="text-xs text-[#3D1A00]/65 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2 — Beli Putus */}
            <div className="rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden">
              <div className="bg-violet-600 px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">Beli Putus / Reseller</h3>
                  <p className="text-violet-200 text-xs">Stok sendiri — makin banyak makin hemat</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-violet-700 uppercase mb-2">Harga Reseller (per pcs)</p>
                  <div className="bg-white rounded-xl border border-violet-200 p-4">
                    <p className="font-semibold text-violet-800 text-sm">Lebih murah dari harga titip jual</p>
                    <p className="text-xs text-violet-700/70 mt-1.5 leading-relaxed">Harga bervariasi sesuai jumlah pemesanan — semakin banyak, harga per pcs semakin hemat. Detail harga dibahas langsung via WhatsApp.</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-wider text-violet-700 uppercase mb-2">Harga Jual ke Konsumen</p>
                  <div className="bg-white rounded-xl border border-violet-200 p-3">
                    <p className="font-semibold text-violet-800 text-sm">Bebas — Sepenuhnya hak reseller</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-violet-700/70">💡 Acuan: Harga eceran Rp 15.000 (100g)</p>
                      <p className="text-xs text-violet-700/70">💡 Acuan: Harga eceran Rp 26.500 (250g)</p>
                      <p className="text-xs text-violet-600/60 mt-1.5 italic">Stok milik toko — jual kapan saja, harga bebas</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-violet-700 uppercase mb-1.5">Sistem Bayar</p>
                    <div className="bg-white border border-violet-200 rounded-xl p-3 text-center">
                      <p className="font-semibold text-violet-800 text-sm">Cash / Transfer</p>
                      <p className="text-xs text-violet-600/70">lunas di muka</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-violet-700 uppercase mb-1.5">Cocok Untuk</p>
                    <div className="bg-white border border-violet-200 rounded-xl p-3 text-center">
                      <p className="font-semibold text-violet-800 text-sm">Toko / Reseller</p>
                      <p className="text-xs text-violet-600/70">stok mandiri</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { s: '01', t: 'Tentukan jumlah & varian', d: 'Pilih berapa pcs dan rasa apa saja. 4 rasa tersedia: Original, BBQ, BBQ Pedas, Jagung.' },
                    { s: '02', t: 'Sepakati harga & bayar', d: 'Harga per pcs disepakati sesuai volume pesanan. Pembayaran lunas di muka.' },
                    { s: '03', t: 'Produk dikirim ke toko', d: 'Kami siapkan dan antar. Toko bebas jual kapan saja sesuai kebutuhan.' },
                    { s: '04', t: 'Margin penuh milik toko', d: 'Tidak ada perhitungan dari kami — untung toko 100% dari selisih beli dan jual.' },
                  ].map(item => (
                    <div key={item.s} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-violet-200 border border-violet-300 flex items-center justify-center text-violet-800 font-bold text-xs flex-shrink-0">{item.s}</div>
                      <div>
                        <p className="font-semibold text-[#1C0A00] text-sm">{item.t}</p>
                        <p className="text-xs text-[#3D1A00]/65 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/6281212132014?text=Halo%20Teh%20Risma%2C%20saya%20tertarik%20beli%20putus%20Keripik%20Kimpul.%20Bisa%20minta%20info%20harga%20reseller%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors"
                  >
                    💬 Tanya Harga Reseller via WA
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Tidak yakin pilih yang mana?</p>
              <p className="text-xs text-amber-700/70 mt-0.5 leading-relaxed">Titip Jual cocok jika ingin coba dulu tanpa modal. Beli Putus cocok jika toko sudah yakin dan ingin stok lebih banyak dengan harga lebih hemat. Bisa mulai dari Titip Jual dulu, lanjut Beli Putus setelah melihat respons pasar.</p>
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
              { icon: 'halal', t: 'Halal Certified', sub: 'Sertifikat Halal Indonesia', d: 'Aman dikonsumsi seluruh kalangan, termasuk anak-anak.' },
              { icon: '🏭', t: 'Produksi Higienis', sub: 'Standar Keamanan Pangan', d: 'Diproduksi di fasilitas bersih dengan standar higienitas tinggi.' },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-amber-100 p-6 text-center">
                <div className="flex justify-center mb-3">
                  {item.icon === 'halal' ? <HalalBadge size={48} /> : <span className="text-4xl">{item.icon}</span>}
                </div>
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
              <a href="https://wa.me/6281212132014" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                💬 Hubungi via WhatsApp
              </a>
              <a href="/api/proposal/keripik-kimpul/pdf" download="Proposal Keripik Kimpul - Cemilan Teh Risma.pdf" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                📄 Download Proposal PDF
              </a>
              <a href="/" className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
                🛒 Toko Saya
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <a href="https://wa.me/6281212132014" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-amber-100 p-3 hover:border-amber-300 transition-colors">
                <div className="text-xl mb-1">📱</div>
                <div className="text-xs text-amber-700 font-semibold">WhatsApp</div>
                <div className="text-[#1C0A00] font-medium text-xs mt-0.5">+62 812-1213-2014</div>
              </a>
              <a href="/" className="bg-white rounded-xl border border-amber-100 p-3 hover:border-amber-300 transition-colors">
                <div className="text-xl mb-1">🛒</div>
                <div className="text-xs text-amber-700 font-semibold">Toko Online</div>
                <div className="text-amber-600 font-medium text-xs mt-0.5 underline underline-offset-2">Kunjungi Toko Kami</div>
              </a>
              <div className="bg-white rounded-xl border border-amber-100 p-3">
                <div className="text-xl mb-1">📍</div>
                <div className="text-xs text-amber-700 font-semibold">Lokasi</div>
                <div className="text-[#1C0A00] font-medium text-xs mt-0.5">Bogor, Jawa Barat</div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#3D1A00]/30 mt-6">Dokumen ini diterbitkan oleh <strong>Cemilan Teh Risma</strong> — Bogor · Bersifat rahasia untuk keperluan kerjasama bisnis.</p>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-amber-100 bg-white mt-4">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center space-y-1.5">
          <p className="text-xs text-[#3D1A00]/50">© 2026 <strong className="text-[#3D1A00]/70">Cemilan Teh Risma</strong>. Semua hak dilindungi.</p>
          <p className="text-xs text-[#3D1A00]/35">Dikembangkan oleh <a href="https://eleven-digital.id/" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-700/60 hover:text-amber-700 underline underline-offset-2 transition-colors">PT. Eleven Digital Indonesia</a> · didukung oleh <strong className="text-[#3D1A00]/45">PT. RMedia Production</strong></p>
        </div>
      </footer>
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

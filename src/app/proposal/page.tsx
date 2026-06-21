import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Kerjasama Titip Jual — Cemilan Teh Risma',
  description: 'Proposal kerjasama penitipan produk Cemilan Teh Risma.',
  robots: { index: false, follow: false },
};

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF2] font-[Inter,sans-serif] text-[#1C0A00]">
      {/* ── PRINT STYLE ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-break { page-break-before: always; }
        }
        .proposal-font { font-family: 'Playfair Display', Georgia, serif; }
        .body-font { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* ── HERO / COVER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#B45309] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-300 blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 rounded-full px-4 py-1.5 text-amber-200 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Proposal Kerjasama Resmi · 2025
          </div>

          <h1 className="proposal-font text-4xl md:text-6xl font-bold leading-tight mb-4">
            Proposal<br />
            <span className="text-amber-300">Kerjasama Titip Jual</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 font-medium mb-2">
            Cemilan Teh Risma
          </p>
          <p className="text-amber-200/80 text-base md:text-lg max-w-xl">
            Keripik Kimpul &amp; Mie Kremes — Camilan Khas Bogor Bersertifikat Halal, Tanpa Pengawet
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { value: '100%', label: 'Bersertifikat Halal' },
              { value: '0', label: 'Bahan Pengawet' },
              { value: '3 bln', label: 'Masa Kadaluarsa' },
              { value: 'Bogor', label: 'Produksi Lokal' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="proposal-font text-2xl md:text-3xl font-bold text-amber-300">{s.value}</div>
                <div className="text-xs text-amber-200/80 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#FFFBF2" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* ── SALAM PEMBUKA ── */}
        <section className="py-12">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl flex-shrink-0">
                📋
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase mb-1">Surat Pengantar</p>
                <h2 className="proposal-font text-2xl font-bold text-[#1C0A00]">Kepada Yth.<br />Pimpinan / Pengelola Toko</h2>
              </div>
            </div>
            <div className="body-font text-[#3D1A00]/80 leading-relaxed space-y-4 text-[15px]">
              <p>
                Assalamu&apos;alaikum Wr. Wb.
              </p>
              <p>
                Saya dari <strong className="text-[#92400E]">Cemilan Teh Risma</strong>, sebuah usaha rumahan yang memproduksi camilan khas Bogor berkualitas. Bersama surat ini, kami mengajukan penawaran kerjasama <strong>titip jual (konsinyasi)</strong> produk kami di tempat yang Anda kelola.
              </p>
              <p>
                Kami percaya produk kami — <strong>Keripik Kimpul Talas Balitung</strong> dan <strong>Mie Kremes Crispy</strong> — memiliki potensi yang kuat sebagai camilan oleh-oleh khas, mengingat cita rasa autentik, kemasan bersih, dan harga yang sangat terjangkau untuk semua kalangan.
              </p>
              <p>
                Kami berharap kerjasama ini dapat memberikan manfaat bagi kedua pihak dan memuaskan pelanggan Anda.
              </p>
              <p>Wassalamu&apos;alaikum Wr. Wb.</p>
              <div className="mt-6 pt-6 border-t border-amber-100">
                <p className="font-semibold text-[#1C0A00]">Hormat kami,</p>
                <p className="proposal-font text-xl font-bold text-amber-700 mt-1">Cemilan Teh Risma</p>
                <p className="text-sm text-[#3D1A00]/60">Bogor, Jawa Barat</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROFIL USAHA ── */}
        <section className="mb-12">
          <SectionTitle icon="🏠" label="Profil Usaha" title="Tentang Kami" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { icon: '🏷️', title: 'Nama Usaha', value: 'Cemilan Teh Risma' },
              { icon: '📍', title: 'Lokasi Produksi', value: 'Bogor, Jawa Barat' },
              { icon: '📦', title: 'Jenis Produk', value: 'Camilan / Snack' },
              { icon: '🔖', title: 'NIB', value: '0403260068412' },
              { icon: '✅', title: 'Sertifikasi', value: 'HALAL Indonesia' },
              { icon: '🌐', title: 'Website Resmi', value: 'warungtehrisma-one.vercel.app' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-amber-100 p-4 flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-[#92400E] font-semibold uppercase tracking-wide">{item.title}</p>
                  <p className="text-[#1C0A00] font-medium mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <p className="body-font text-[#3D1A00]/80 leading-relaxed text-[15px]">
              Cemilan Teh Risma adalah usaha camilan rumahan yang berdiri dari semangat menghadirkan jajanan khas yang <strong>autentik, sehat, dan terjangkau</strong>. Produk kami dibuat tanpa bahan pengawet, menggunakan bahan baku lokal pilihan dari Bogor, dan telah mendapatkan sertifikasi Halal. Setiap produk dibuat dengan standar kebersihan tinggi dan dikemas secara higienis.
            </p>
          </div>
        </section>

        {/* ── PRODUK ── */}
        <section className="mb-12">
          <SectionTitle icon="🛍️" label="Katalog Produk" title="Daftar Produk Kami" />

          {/* Mie Kremes */}
          <div className="mt-6 mb-4">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm font-semibold">
              🍝 Mie Kremes
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <ProductCard
              emoji="🍝"
              name="Mie Kremes Original"
              weight="150g"
              price="Rp 10.000"
              badge="Best Seller"
              badgeColor="bg-amber-500"
              highlights={[
                'Bahan: Mie Kering, Kencur, Bawang Putih, Daun Jeruk',
                'Rasa: Gurih original alami',
                'Tekstur: Super crispy',
                'Tanpa pengawet',
              ]}
              color="from-orange-700 to-amber-500"
            />
            <ProductCard
              emoji="🍝"
              name="Mie Kremes Pedas"
              weight="150g"
              price="Rp 10.000"
              badge="Popular"
              badgeColor="bg-red-500"
              highlights={[
                'Bahan: Mie Kering, Bubuk Cabai Asli, Kencur, Bawang Putih',
                'Rasa: Pedas nendang',
                'Tekstur: Super crispy',
                'Tanpa pengawet',
              ]}
              color="from-red-700 to-orange-500"
            />
          </div>

          {/* Keripik Kimpul */}
          <div className="mt-8 mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-sm font-semibold">
              🥔 Keripik Kimpul Talas Balitung
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <ProductCard
              emoji="🥔"
              name="Original"
              weight="100g / 250g"
              price="Rp 15.000 / Rp 26.500"
              badge="Best Seller"
              badgeColor="bg-amber-500"
              highlights={[
                'Talas Kimpul pilihan',
                'Gurih alami',
                'Tahan 3 bulan',
              ]}
              color="from-amber-700 to-yellow-500"
              compact
            />
            <ProductCard
              emoji="🌶️"
              name="BBQ Pedas"
              weight="100g / 250g"
              price="Rp 15.000 / Rp 26.500"
              badge="Popular"
              badgeColor="bg-red-500"
              highlights={[
                'Bumbu BBQ smoky',
                'Sensasi pedas nagih',
                'Tahan 3 bulan',
              ]}
              color="from-red-700 to-orange-500"
              compact
            />
            <ProductCard
              emoji="🌽"
              name="Jagung Manis"
              weight="100g / 250g"
              price="Rp 15.000 / Rp 26.500"
              badge="New"
              badgeColor="bg-yellow-500"
              highlights={[
                'Rasa jagung manis',
                'Favorit anak-anak',
                'Tahan 3 bulan',
              ]}
              color="from-yellow-700 to-amber-400"
              compact
            />
          </div>

          {/* Paket */}
          <div className="mt-8 mb-4">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 rounded-full px-3 py-1 text-sm font-semibold">
              🎁 Paket Hemat
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <ProductCard
              emoji="🎁"
              name="Paket Mix 3 Rasa"
              weight="3 × 100g"
              price="Rp 40.000"
              originalPrice="Rp 45.000"
              badge="Best Seller"
              badgeColor="bg-violet-500"
              highlights={[
                '3 rasa sekaligus',
                'Hemat Rp 5.000',
                'Cocok untuk oleh-oleh',
              ]}
              color="from-violet-700 to-purple-500"
              compact
            />
            <ProductCard
              emoji="🛍️"
              name="Paket Mix 5 Pcs"
              weight="5 × 100g"
              price="Rp 65.000"
              originalPrice="Rp 75.000"
              badge="Popular"
              badgeColor="bg-pink-500"
              highlights={[
                'Bebas pilih rasa',
                'Hemat Rp 10.000',
                'Cocok untuk kado',
              ]}
              color="from-rose-700 to-pink-500"
              compact
            />
            <ProductCard
              emoji="📦"
              name="Paket Campur"
              weight="2 Keripik + 2 Mie"
              price="Rp 44.000"
              originalPrice="Rp 50.000"
              badge="New"
              badgeColor="bg-teal-500"
              highlights={[
                'Coba dua produk',
                'Hemat Rp 6.000',
                'Dikemas rapi',
              ]}
              color="from-teal-700 to-cyan-500"
              compact
            />
          </div>
        </section>

        {/* ── KEUNGGULAN PRODUK ── */}
        <section className="mb-12">
          <SectionTitle icon="⭐" label="Keunggulan" title="Mengapa Produk Kami?" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              {
                icon: '✅',
                title: 'Bersertifikat HALAL',
                desc: 'Produk kami telah mendapat sertifikasi Halal resmi Indonesia, memberikan ketenangan bagi semua kalangan konsumen.',
              },
              {
                icon: '🌿',
                title: 'Tanpa Bahan Pengawet',
                desc: 'Kami tidak menggunakan bahan pengawet kimia. Cita rasa alami dengan bahan baku segar pilihan petani lokal Bogor.',
              },
              {
                icon: '📅',
                title: 'Masa Simpan 3 Bulan',
                desc: 'Dengan kemasan kedap udara, produk tahan hingga 3 bulan sehingga aman untuk stok toko Anda.',
              },
              {
                icon: '💰',
                title: 'Harga Terjangkau',
                desc: 'Harga mulai Rp 10.000 — cocok untuk semua segmen pembeli, dari anak-anak hingga dewasa.',
              },
              {
                icon: '🎯',
                title: 'Potensi Oleh-Oleh',
                desc: 'Sebagai produk khas Bogor, sangat cocok dijual di toko oleh-oleh, minimarket, kafe, dan tempat wisata.',
              },
              {
                icon: '📦',
                title: 'Kemasan Menarik',
                desc: 'Kemasan bersih, informatif, dan photogenic — menarik perhatian pembeli baik secara langsung maupun di media sosial.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-amber-100 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
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
          <SectionTitle icon="🤝" label="Skema Kerjasama" title="Mekanisme Titip Jual" />
          <div className="mt-6 bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#B45309] rounded-2xl p-8 text-white">
            <p className="text-amber-200/90 text-sm mb-6">
              Kami menawarkan skema kerjasama yang <strong className="text-amber-300">menguntungkan dan tidak memberatkan</strong> pihak mitra. Berikut mekanisme titip jual yang kami tawarkan:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Penitipan Produk',
                  desc: 'Produk dititipkan di toko mitra tanpa biaya di muka. Kami menyediakan produk dalam kondisi layak jual.',
                },
                {
                  step: '02',
                  title: 'Margin Keuntungan Mitra',
                  desc: 'Mitra mendapatkan margin keuntungan yang kompetitif dari setiap produk terjual. Detail margin dapat didiskusikan.',
                },
                {
                  step: '03',
                  title: 'Perhitungan Berkala',
                  desc: 'Pembayaran dilakukan secara berkala (mingguan/bulanan) sesuai kesepakatan bersama berdasarkan produk yang terjual.',
                },
                {
                  step: '04',
                  title: 'Penggantian Produk',
                  desc: 'Produk yang mendekati masa kadaluarsa atau tidak terjual akan diganti dengan produk baru sesuai perjanjian.',
                },
                {
                  step: '05',
                  title: 'Fleksibilitas Jumlah',
                  desc: 'Jumlah produk yang dititipkan dapat disesuaikan dengan kebutuhan dan kapasitas toko mitra.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-200 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-amber-100/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARGET MARKET ── */}
        <section className="mb-12">
          <SectionTitle icon="🎯" label="Target Pasar" title="Cocok Dijual Di Mana?" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: '🏪', label: 'Toko Oleh-Oleh' },
              { icon: '☕', label: 'Kafe & Warung' },
              { icon: '🏨', label: 'Hotel & Penginapan' },
              { icon: '🏫', label: 'Kantin Sekolah' },
              { icon: '🏬', label: 'Minimarket Lokal' },
              { icon: '🏔️', label: 'Wisata & Rest Area' },
              { icon: '🎪', label: 'Pameran & Bazaar' },
              { icon: '🛒', label: 'Online Shop' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-amber-100 p-4 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-[#1C0A00]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LEGALITAS ── */}
        <section className="mb-12">
          <SectionTitle icon="📜" label="Legalitas" title="Legalitas &amp; Kepercayaan" />
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: '🔰',
                title: 'NIB Resmi',
                subtitle: '0403260068412',
                desc: 'Nomor Induk Berusaha terdaftar resmi di OSS — Kementerian Investasi RI.',
              },
              {
                icon: '☪️',
                title: 'Halal Certified',
                subtitle: 'Sertifikat Halal Indonesia',
                desc: 'Seluruh produk bersertifikat Halal, aman dikonsumsi seluruh kalangan masyarakat.',
              },
              {
                icon: '🏭',
                title: 'Produksi Higienis',
                subtitle: 'Standar Produksi Rumahan',
                desc: 'Diproduksi di fasilitas bersih dengan standar higienitas tinggi sesuai prosedur keamanan pangan.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-amber-100 p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-[#1C0A00] mb-1">{item.title}</h4>
                <p className="text-xs text-amber-700 font-semibold mb-2">{item.subtitle}</p>
                <p className="text-xs text-[#3D1A00]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PENUTUP & CTA ── */}
        <section>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="proposal-font text-2xl md:text-3xl font-bold text-[#1C0A00] mb-3">
              Mari Berkolaborasi!
            </h3>
            <p className="text-[#3D1A00]/70 leading-relaxed max-w-xl mx-auto mb-6 text-[15px]">
              Kami sangat terbuka untuk berdiskusi lebih lanjut mengenai detail kerjasama, jumlah produk, margin keuntungan, dan hal-hal teknis lainnya. Hubungi kami melalui:
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://wa.me/6281212132014"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors no-print"
              >
                <span>💬</span>
                Hubungi via WhatsApp
              </a>
              <a
                href="https://warungtehrisma-one.vercel.app"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors no-print"
              >
                <span>🌐</span>
                Lihat Katalog Online
              </a>
            </div>

            {/* Print contact info */}
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { icon: '📱', label: 'WhatsApp', value: '+62 812-1213-2014' },
                { icon: '🌐', label: 'Website', value: 'warungtehrisma-one.vercel.app' },
                { icon: '📍', label: 'Lokasi', value: 'Bogor, Jawa Barat' },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-xl border border-amber-100 p-3">
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className="text-xs text-amber-700 font-semibold">{c.label}</div>
                  <div className="text-[#1C0A00] font-medium text-xs mt-0.5">{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-8 text-xs text-[#3D1A00]/40">
            <p>Dokumen ini diterbitkan oleh <strong>Cemilan Teh Risma</strong> — Bogor, Jawa Barat</p>
            <p className="mt-1">Bersifat rahasia dan hanya untuk keperluan kerjasama bisnis.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── HELPER COMPONENTS ── */

function SectionTitle({ icon, label, title }: { icon: string; label: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase">{label}</p>
        <h2
          className="proposal-font text-2xl font-bold text-[#1C0A00]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent ml-2" />
    </div>
  );
}

function ProductCard({
  emoji, name, weight, price, originalPrice, badge, badgeColor, highlights, color, compact,
}: {
  emoji: string;
  name: string;
  weight: string;
  price: string;
  originalPrice?: string;
  badge: string;
  badgeColor: string;
  highlights: string[];
  color: string;
  compact?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-amber-100 overflow-hidden shadow-sm">
      {/* Color bar */}
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <h4 className="font-semibold text-[#1C0A00] leading-tight">{name}</h4>
          </div>
          <span className={`${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
            {badge}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-amber-700">{price}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-xs text-[#3D1A00]/50">{weight}</p>
        </div>

        {!compact && (
          <ul className="space-y-1.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5 text-xs text-[#3D1A00]/70">
                <span className="text-amber-500 flex-shrink-0 mt-0.5">✓</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {compact && (
          <ul className="space-y-1">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-1.5 text-xs text-[#3D1A00]/70">
                <span className="text-amber-500 flex-shrink-0">✓</span>
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

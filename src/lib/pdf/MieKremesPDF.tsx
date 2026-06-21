import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface Props {
  logo: string;
  imgOri: string;
  imgPdas: string;
  halalLogo: string;
}

const C = {
  primary:      '#C2410C',
  primaryDark:  '#9A3412',
  accent:       '#D97706',
  accentLight:  '#FEF3C7',
  accentMid:    '#FDE68A',
  lightBg:      '#FFFBF2',
  white:        '#FFFFFF',
  dark:         '#1C0A00',
  body:         '#3D1A00',
  muted:        '#78350F',
  border:       '#FCD34D',
  green:        '#15803D',
  greenLight:   '#DCFCE7',
  violet:       '#7C3AED',
  violetLight:  '#EDE9FE',
  gray:         '#6B7280',
};

const s = StyleSheet.create({
  page: { backgroundColor: C.lightBg, fontFamily: 'Helvetica', color: C.dark, paddingBottom: 40 },

  // Cover
  coverPage:        { backgroundColor: C.primary, padding: 0 },
  coverTop:         { backgroundColor: C.primary, padding: 50, alignItems: 'center', flex: 1, justifyContent: 'center' },
  coverBottom:      { backgroundColor: C.primaryDark, paddingHorizontal: 50, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverLogoWrap:    { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: C.white, overflow: 'hidden', marginBottom: 24, backgroundColor: C.white },
  coverLogo:        { width: 110, height: 110, objectFit: 'cover' },
  coverBadge:       { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 20 },
  coverBadgeText:   { color: 'rgba(255,255,255,0.9)', fontSize: 9, fontFamily: 'Helvetica', letterSpacing: 1.5, textTransform: 'uppercase' },
  coverTitle:       { color: C.white, fontSize: 48, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8, letterSpacing: 1 },
  coverSub:         { color: 'rgba(255,255,255,0.85)', fontSize: 20, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 6 },
  coverTagline:     { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 32 },
  coverStats:       { flexDirection: 'row', gap: 16, marginTop: 8 },
  coverStat:        { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  coverStatVal:     { color: C.white, fontSize: 18, fontFamily: 'Helvetica-Bold' },
  coverStatLbl:     { color: 'rgba(255,255,255,0.65)', fontSize: 9, marginTop: 2 },
  coverBottomText:  { color: 'rgba(255,255,255,0.55)', fontSize: 9 },
  coverConfidential:{ color: 'rgba(255,255,255,0.8)', fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },

  // Header/letterhead
  letterhead:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 50, paddingTop: 36, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: C.border },
  letterLogo:       { width: 50, height: 50, borderRadius: 25, objectFit: 'cover' },
  letterBrand:      { alignItems: 'flex-end' },
  letterBrandName:  { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },
  letterBrandSub:   { fontSize: 9, color: C.muted, marginTop: 2 },

  // Section header bar
  sectionBar:       { backgroundColor: C.primary, paddingHorizontal: 50, paddingVertical: 14, marginBottom: 24 },
  sectionBarText:   { color: C.white, fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  sectionBarSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 3 },

  // Body content
  body:             { paddingHorizontal: 50 },
  bodyText:         { fontSize: 10.5, color: C.body, lineHeight: 1.7, marginBottom: 10 },
  bold:             { fontFamily: 'Helvetica-Bold' },

  // Info box
  infoBox:          { backgroundColor: C.accentLight, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: C.accent, padding: 14, marginBottom: 14 },
  infoBoxTitle:     { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  infoRow:          { flexDirection: 'row', marginBottom: 4 },
  infoKey:          { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.muted, width: 90 },
  infoVal:          { fontSize: 9.5, color: C.body, flex: 1 },

  // Numbered steps
  stepRow:          { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  stepNum:          { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  stepNumText:      { color: C.white, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  stepContent:      { flex: 1 },
  stepTitle:        { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 2 },
  stepDesc:         { fontSize: 9.5, color: C.body, lineHeight: 1.5 },

  // Product card
  productCard:      { borderWidth: 1, borderColor: C.border, borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  productHeader:    { backgroundColor: C.primary, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  productImg:       { width: 60, height: 75, borderRadius: 6, objectFit: 'cover' },
  productHeaderText:{ flex: 1 },
  productName:      { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.white },
  productDesc:      { fontSize: 9, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 1.5 },
  productBody:      { padding: 14, backgroundColor: C.white },
  productGrid:      { flexDirection: 'row', gap: 12, marginBottom: 12 },
  productInfoItem:  { flex: 1, backgroundColor: C.accentLight, borderRadius: 6, padding: 10, alignItems: 'center' },
  productInfoVal:   { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },
  productInfoLbl:   { fontSize: 8, color: C.muted, marginTop: 2, textAlign: 'center' },
  productDetail:    { fontSize: 9, color: C.body, lineHeight: 1.6 },

  // Mechanism cards
  mechRow:          { flexDirection: 'row', gap: 14, marginBottom: 16 },
  mechCard:         { flex: 1, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  mechHeaderOrange: { backgroundColor: '#EA580C', padding: 12 },
  mechHeaderViolet: { backgroundColor: '#7C3AED', padding: 12 },
  mechHeaderTitle:  { color: C.white, fontSize: 12, fontFamily: 'Helvetica-Bold' },
  mechHeaderSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 8, marginTop: 2 },
  mechBody:         { padding: 12, backgroundColor: C.white },
  mechLabel:        { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  mechPriceBox:     { backgroundColor: C.accentLight, borderRadius: 6, padding: 8, marginBottom: 8 },
  mechPriceRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  mechPriceVal:     { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.primary },
  mechPriceSub:     { fontSize: 8, color: C.muted },
  mechInfoBox:      { borderRadius: 6, padding: 8, marginBottom: 8 },
  mechInfoText:     { fontSize: 9, color: C.body, lineHeight: 1.5 },
  mechGreenBox:     { backgroundColor: C.greenLight, borderRadius: 6, padding: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mechGreenVal:     { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.green },
  mechGreenLbl:     { fontSize: 8, color: C.green },
  mechStep:         { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
  mechStepNum:      { width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 },
  mechStepNumViolet:{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 },
  mechStepNumText:  { color: C.white, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  mechStepTitle:    { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.dark },
  mechStepDesc:     { fontSize: 8, color: C.body, lineHeight: 1.4 },

  // Reseller packages
  paketRow:         { flexDirection: 'row', gap: 12, marginBottom: 12 },
  paketCard:        { flex: 1, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  paketHeaderGreen: { backgroundColor: '#15803D', padding: 10, alignItems: 'center' },
  paketHeaderOrange:{ backgroundColor: '#C2410C', padding: 10, alignItems: 'center' },
  paketHeaderPurple:{ backgroundColor: '#6D28D9', padding: 10, alignItems: 'center' },
  paketHeaderEmoji: { fontSize: 18, marginBottom: 4 },
  paketHeaderTitle: { color: C.white, fontSize: 10, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  paketHeaderBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
  paketHeaderBadgeText: { color: C.white, fontSize: 7 },
  paketBody:        { padding: 10, backgroundColor: C.white },
  paketRow2:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  paketLabel:       { fontSize: 8, color: C.muted },
  paketValue:       { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.dark },
  paketDivider:     { borderTopWidth: 1, borderTopColor: C.border, marginVertical: 6 },
  paketUntung:      { backgroundColor: C.greenLight, borderRadius: 4, padding: 6, alignItems: 'center', marginTop: 4 },
  paketUntungVal:   { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.green },
  paketUntungLbl:   { fontSize: 7, color: C.green, marginTop: 1 },

  // Keunggulan
  keunggulanGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  keunggulanItem:   { width: '47%', borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 10, backgroundColor: C.white },
  keunggulanTitle:  { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 3 },
  keunggulanDesc:   { fontSize: 8.5, color: C.body, lineHeight: 1.5 },

  // Target pasar
  targetGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  targetChip:       { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.white },
  targetText:       { fontSize: 9, color: C.body },

  // Legalitas
  legalBox:         { borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 16, backgroundColor: C.white, marginBottom: 14 },
  legalRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legalHalalImg:    { width: 36, height: 36, marginRight: 12 },
  legalText:        { fontSize: 10, color: C.body, lineHeight: 1.5, flex: 1 },

  // Contact
  contactRow:       { flexDirection: 'row', gap: 12, marginBottom: 14 },
  contactCard:      { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12, backgroundColor: C.white },
  contactLabel:     { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  contactValue:     { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark },
  contactSub:       { fontSize: 8.5, color: C.primary, marginTop: 2 },

  // Page number
  pageNum:          { position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: C.gray },
  pageFooter:       { position: 'absolute', bottom: 20, left: 50, right: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageFooterText:   { fontSize: 8, color: C.gray },
});

// ── Shared components ─────────────────────────────────────────────────────────

function Letterhead({ logo }: { logo: string }) {
  return (
    <View style={s.letterhead}>
      <Image src={logo} style={s.letterLogo} />
      <View style={s.letterBrand}>
        <Text style={s.letterBrandName}>Cemilan Teh Risma</Text>
        <Text style={s.letterBrandSub}>Bogor, Jawa Barat · NIB: 0403260068412</Text>
        <Text style={s.letterBrandSub}>WA: 0812-1213-2014</Text>
      </View>
    </View>
  );
}

function SectionBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={s.sectionBar}>
      <Text style={s.sectionBarText}>{title}</Text>
      {sub && <Text style={s.sectionBarSub}>{sub}</Text>}
    </View>
  );
}

function PageFooter({ page, total }: { page: number; total: number }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.pageFooterText}>Cemilan Teh Risma · Proposal Mie Kremes 2026</Text>
      <Text style={s.pageFooterText}>Halaman {page} / {total}</Text>
    </View>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────

export default function MieKremesPDF({ logo, imgOri, imgPdas, halalLogo }: Props) {
  return (
    <Document
      title="Proposal Kerjasama Mie Kremes - Cemilan Teh Risma"
      author="Cemilan Teh Risma"
      subject="Proposal Kerjasama Titip Jual / Reseller Mie Kremes"
      keywords="proposal, mie kremes, kerjasama, titip jual, reseller, cemilan teh risma"
    >

      {/* ══ PAGE 1 – COVER ══════════════════════════════════════════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTop}>
          <View style={s.coverLogoWrap}>
            <Image src={logo} style={s.coverLogo} />
          </View>
          <View style={s.coverBadge}>
            <Text style={s.coverBadgeText}>Proposal Kerjasama Resmi · 2026</Text>
          </View>
          <Text style={s.coverTitle}>MIE KREMES</Text>
          <Text style={s.coverSub}>Cemilan Teh Risma</Text>
          <Text style={s.coverTagline}>Camilan mie crispy renyah khas Bogor — bumbu rempah alami, tanpa pengawet</Text>
          <View style={s.coverStats}>
            {[
              { v: '2 Varian', l: 'Original & Pedas' },
              { v: '150g', l: 'Per Kemasan' },
              { v: 'Rp 10.000', l: 'Harga Eceran' },
              { v: 'Halal', l: 'Bersertifikat' },
            ].map(i => (
              <View key={i.l} style={s.coverStat}>
                <Text style={s.coverStatVal}>{i.v}</Text>
                <Text style={s.coverStatLbl}>{i.l}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.coverBottom}>
          <Text style={s.coverBottomText}>Bogor, Jawa Barat · Indonesia</Text>
          <Text style={s.coverConfidential}>DOKUMEN RAHASIA — UNTUK KEPERLUAN KERJASAMA BISNIS</Text>
        </View>
      </Page>

      {/* ══ PAGE 2 – SURAT PENGANTAR ════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />

        <View style={[s.body, { paddingTop: 28 }]}>
          {/* Recipient */}
          <Text style={[s.bodyText, { marginBottom: 4 }]}>Bogor, 2026</Text>
          <Text style={[s.bodyText, { fontFamily: 'Helvetica-Bold', marginBottom: 16, fontSize: 12 }]}>
            Kepada Yth.{'\n'}Pimpinan / Pengelola Toko
          </Text>

          <Text style={s.bodyText}>Assalamualaikum Wr. Wb.</Text>
          <Text style={s.bodyText}>
            Dengan hormat, saya dari{' '}
            <Text style={s.bold}>Cemilan Teh Risma</Text>
            {' '}— usaha camilan rumahan khas Bogor yang telah bersertifikat{' '}
            <Text style={s.bold}>Halal Indonesia</Text>
            {' '}dan memiliki NIB resmi. Melalui surat ini, kami mengajukan penawaran kerjasama pemasaran produk{' '}
            <Text style={s.bold}>Mie Kremes</Text>
            {' '}di tempat yang Bapak/Ibu kelola.
          </Text>

          {/* Product summary box */}
          <View style={s.infoBox}>
            <Text style={s.infoBoxTitle}>Ringkasan Produk</Text>
            {[
              ['Produk',        'Mie Kremes Cemilan Teh Risma'],
              ['Varian Rasa',   'Original (Gurih) & Pedas'],
              ['Berat Kemasan', '150g per pcs'],
              ['Harga Eceran',  'Rp 10.000 per pcs'],
              ['Masa Simpan',   '3 bulan (kemasan kedap udara)'],
              ['Legalitas',     'Halal Indonesia · NIB 0403260068412'],
            ].map(([k, v]) => (
              <View key={k} style={s.infoRow}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={[s.infoVal]}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={s.bodyText}>
            Kami menawarkan <Text style={s.bold}>2 mekanisme kerjasama</Text> yang dapat disesuaikan dengan kebutuhan toko:
          </Text>

          {/* Mechanism list */}
          {[
            {
              n: '1',
              t: 'Titip Jual (Konsinyasi)',
              d: 'Produk dititipkan tanpa biaya di muka. Harga pengambilan Rp 9.000/pcs — dibayar mingguan atau bulanan sesuai hasil penjualan. Harga jual ke konsumen bebas (saran min. Rp 10.000). Produk yang tidak terjual akan kami ganti.',
            },
            {
              n: '2',
              t: 'Beli Putus / Reseller',
              d: 'Toko membeli stok langsung secara tunai. Harga lebih hemat sesuai volume: Rp 8.000–9.000/pcs. Tersedia 3 paket reseller (10 pcs, 20 pcs, 30 pcs) dengan estimasi keuntungan Rp 10.000–60.000 per paket.',
            },
          ].map(item => (
            <View key={item.n} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{item.n}</Text>
              </View>
              <View style={s.stepContent}>
                <Text style={s.stepTitle}>{item.t}</Text>
                <Text style={s.stepDesc}>{item.d}</Text>
              </View>
            </View>
          ))}

          <Text style={s.bodyText}>
            Kami percaya Mie Kremes memiliki daya tarik kuat sebagai camilan unik dan berbeda. Kami siap berdiskusi lebih lanjut mengenai mekanisme, jumlah, maupun jadwal pengiriman yang paling sesuai untuk toko Anda.
          </Text>
          <Text style={s.bodyText}>Wassalamualaikum Wr. Wb.</Text>

          {/* Signature */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 }}>
            <View>
              <Text style={[s.bodyText, { marginBottom: 2 }]}>Hormat kami,</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.primary }}>Cemilan Teh Risma</Text>
              <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Bogor, Jawa Barat</Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12, backgroundColor: C.white }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hubungi Kami</Text>
              <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginTop: 4 }}>0812-1213-2014</Text>
              <Text style={{ fontSize: 8.5, color: C.primary, marginTop: 2 }}>WhatsApp (Chat / Telepon)</Text>
            </View>
          </View>
        </View>
        <PageFooter page={2} total={6} />
      </Page>

      {/* ══ PAGE 3 – PROFIL PRODUK ══════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="Profil & Detail Produk" sub="Mie Kremes tersedia dalam 2 varian rasa · Berat 150g per kemasan" />

        <View style={s.body}>
          {/* Product cards */}
          {[
            {
              img: imgOri, name: 'Mie Kremes Original',
              desc: 'Mie crispy dengan bumbu original gurih — perpaduan mie kering & rempah alami yang bikin nagih.',
              bahan: 'Mie Kering, Minyak Nabati, Kencur, Bawang Putih, Daun Jeruk',
              badge: 'Best Seller',
            },
            {
              img: imgPdas, name: 'Mie Kremes Pedas',
              desc: 'Mie crispy dengan bubuk cabai asli dan bumbu pedas khas. Pedas yang nendang, renyah yang maksimal!',
              bahan: 'Mie Kering, Bubuk Cabai Asli, Bumbu Pedas, Daun Jeruk, Kencur, Bawang Putih',
              badge: 'Popular',
            },
          ].map(p => (
            <View key={p.name} style={s.productCard}>
              <View style={s.productHeader}>
                <Image src={p.img} style={s.productImg} />
                <View style={s.productHeaderText}>
                  <Text style={s.productName}>{p.name}</Text>
                  <Text style={s.productDesc}>{p.desc}</Text>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6, alignSelf: 'flex-start' }}>
                    <Text style={{ color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold' }}>{p.badge}</Text>
                  </View>
                </View>
              </View>
              <View style={s.productBody}>
                <View style={s.productGrid}>
                  {[
                    { v: '150g', l: 'Berat Bersih' },
                    { v: 'Rp 10.000', l: 'Harga Eceran' },
                    { v: '3 Bulan', l: 'Masa Simpan' },
                    { v: 'HALAL', l: 'Bersertifikat' },
                  ].map(i => (
                    <View key={i.l} style={s.productInfoItem}>
                      <Text style={s.productInfoVal}>{i.v}</Text>
                      <Text style={s.productInfoLbl}>{i.l}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.infoRow}>
                  <Text style={[s.infoKey, { fontSize: 9 }]}>Komposisi</Text>
                  <Text style={[s.infoVal, { fontSize: 9 }]}>{p.bahan}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={[s.infoKey, { fontSize: 9 }]}>Diproduksi oleh</Text>
                  <Text style={[s.infoVal, { fontSize: 9 }]}>Cemilan Teh Risma · Bogor, Jawa Barat · NIB: 0403260068412</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <PageFooter page={3} total={6} />
      </Page>

      {/* ══ PAGE 4 – MEKANISME KERJASAMA ════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="2 Pilihan Mekanisme Kerjasama" sub="Pilih yang paling sesuai kondisi toko Anda" />

        <View style={s.body}>
          <View style={s.mechRow}>

            {/* Titip Jual */}
            <View style={[s.mechCard, { borderColor: '#FCD34D' }]}>
              <View style={s.mechHeaderOrange}>
                <Text style={s.mechHeaderTitle}>Titip Jual (Konsinyasi)</Text>
                <Text style={s.mechHeaderSub}>Tidak perlu modal — bayar setelah terjual</Text>
              </View>
              <View style={s.mechBody}>
                <Text style={s.mechLabel}>Harga Pengambilan</Text>
                <View style={s.mechPriceBox}>
                  <View style={s.mechPriceRow}>
                    <Text style={s.mechPriceVal}>Rp 9.000</Text>
                    <Text style={s.mechPriceSub}>per pcs terjual</Text>
                  </View>
                </View>

                <Text style={s.mechLabel}>Harga Jual ke Konsumen</Text>
                <View style={[s.mechInfoBox, { backgroundColor: C.accentLight, marginBottom: 8 }]}>
                  <Text style={[s.mechInfoText, { fontFamily: 'Helvetica-Bold' }]}>Bebas — Toko menentukan sendiri</Text>
                  <Text style={[s.mechInfoText, { color: C.muted, marginTop: 3 }]}>Saran min. Rp 10.000/pcs{'\n'}Harga lebih tinggi = margin lebih besar</Text>
                </View>

                <View style={[s.mechRow, { gap: 8, marginBottom: 8 }]}>
                  <View style={s.mechGreenBox}>
                    <Text style={s.mechGreenVal}>Min. Rp 1.000</Text>
                    <Text style={s.mechGreenLbl}>per pcs</Text>
                  </View>
                  <View style={[s.mechGreenBox, { backgroundColor: C.accentLight }]}>
                    <Text style={[s.mechGreenVal, { color: C.accent }]}>Mingguan</Text>
                    <Text style={[s.mechGreenLbl, { color: C.accent }]}>/ Bulanan</Text>
                  </View>
                </View>

                <Text style={[s.mechLabel, { marginTop: 4 }]}>Cara Kerja</Text>
                {[
                  ['01', 'Produk diantar ke toko', 'Tanpa modal di muka, siap display'],
                  ['02', 'Toko jual ke konsumen', 'Harga bebas, semakin tinggi margin makin besar'],
                  ['03', 'Bayar hasil terjual', 'Mingguan / bulanan sesuai produk habis'],
                  ['04', 'Produk tak laku diganti', 'Mendekati kadaluarsa? Kami ganti baru'],
                ].map(([n, t, d]) => (
                  <View key={n} style={s.mechStep}>
                    <View style={s.mechStepNum}><Text style={s.mechStepNumText}>{n}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.mechStepTitle}>{t}</Text>
                      <Text style={s.mechStepDesc}>{d}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Beli Putus */}
            <View style={[s.mechCard, { borderColor: '#DDD6FE' }]}>
              <View style={s.mechHeaderViolet}>
                <Text style={s.mechHeaderTitle}>Beli Putus / Reseller</Text>
                <Text style={s.mechHeaderSub}>Stok sendiri — makin banyak makin hemat</Text>
              </View>
              <View style={s.mechBody}>
                <Text style={s.mechLabel}>Harga Reseller</Text>
                <View style={[s.mechPriceBox, { backgroundColor: C.violetLight }]}>
                  <View style={s.mechPriceRow}>
                    <Text style={[s.mechPriceVal, { color: C.violet }]}>Rp 8.000 – 9.000</Text>
                    <Text style={s.mechPriceSub}>per pcs</Text>
                  </View>
                  <Text style={[s.mechInfoText, { color: '#6D28D9', marginTop: 3 }]}>Semakin banyak, semakin hemat</Text>
                </View>

                <Text style={s.mechLabel}>Harga Jual ke Konsumen</Text>
                <View style={[s.mechInfoBox, { backgroundColor: C.violetLight, marginBottom: 8 }]}>
                  <Text style={[s.mechInfoText, { fontFamily: 'Helvetica-Bold', color: '#4C1D95' }]}>Bebas — Hak penuh reseller</Text>
                  <Text style={[s.mechInfoText, { color: '#6D28D9', marginTop: 3 }]}>Acuan harga eceran: Rp 10.000/pcs{'\n'}Stok milik toko, jual kapan saja</Text>
                </View>

                <View style={[s.mechRow, { gap: 8, marginBottom: 8 }]}>
                  <View style={[s.mechGreenBox, { backgroundColor: C.violetLight }]}>
                    <Text style={[s.mechGreenVal, { color: C.violet }]}>Cash</Text>
                    <Text style={[s.mechGreenLbl, { color: C.violet }]}>Transfer</Text>
                  </View>
                  <View style={[s.mechGreenBox, { backgroundColor: C.violetLight }]}>
                    <Text style={[s.mechGreenVal, { color: C.violet, fontSize: 10 }]}>Lunas</Text>
                    <Text style={[s.mechGreenLbl, { color: C.violet }]}>di muka</Text>
                  </View>
                </View>

                <Text style={[s.mechLabel, { marginTop: 4 }]}>Cara Kerja</Text>
                {[
                  ['01', 'Tentukan jumlah & varian', 'Original atau Pedas, pilih kombinasi bebas'],
                  ['02', 'Sepakati harga & bayar', 'Harga disepakati sesuai volume, bayar lunas'],
                  ['03', 'Produk dikirim ke toko', 'Kami siapkan dan antar ke lokasi toko'],
                  ['04', 'Margin penuh milik toko', 'Untung 100% dari selisih beli dan jual'],
                ].map(([n, t, d]) => (
                  <View key={n} style={s.mechStep}>
                    <View style={s.mechStepNumViolet}><Text style={s.mechStepNumText}>{n}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.mechStepTitle}>{t}</Text>
                      <Text style={s.mechStepDesc}>{d}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </View>

          {/* Tip box */}
          <View style={[s.infoBox, { borderLeftColor: C.green, backgroundColor: C.greenLight }]}>
            <Text style={[s.infoBoxTitle, { color: C.green }]}>Tips Memilih Mekanisme</Text>
            <Text style={[s.bodyText, { marginBottom: 0, fontSize: 9.5 }]}>
              <Text style={s.bold}>Titip Jual</Text>
              {' cocok untuk toko yang baru ingin mencoba tanpa risiko. '}
              <Text style={s.bold}>Beli Putus</Text>
              {' cocok untuk toko yang sudah yakin dan ingin margin lebih besar. Bisa mulai dari Titip Jual, lanjut Beli Putus setelah melihat respons pasar.'}
            </Text>
          </View>
        </View>
        <PageFooter page={4} total={6} />
      </Page>

      {/* ══ PAGE 5 – PAKET RESELLER ═════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="Paket Reseller (Beli Putus)" sub="Harga per pcs lebih hemat sesuai volume pembelian" />

        <View style={s.body}>
          <View style={s.paketRow}>
            {/* Pemula */}
            <View style={s.paketCard}>
              <View style={s.paketHeaderGreen}>
                <Text style={s.paketHeaderEmoji}>🌱</Text>
                <Text style={s.paketHeaderTitle}>Krenyes Pemula</Text>
                <View style={s.paketHeaderBadge}><Text style={s.paketHeaderBadgeText}>Untuk Pemula</Text></View>
              </View>
              <View style={s.paketBody}>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Jumlah</Text><Text style={s.paketValue}>10 pcs</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Modal</Text><Text style={s.paketValue}>Rp 90.000</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Harga/pcs</Text><Text style={s.paketValue}>Rp 9.000</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Omset Est.</Text><Text style={s.paketValue}>Rp 100.000</Text></View>
                <View style={s.paketDivider} />
                <View style={s.paketUntung}>
                  <Text style={s.paketUntungVal}>Rp 10.000</Text>
                  <Text style={s.paketUntungLbl}>Estimasi Untung</Text>
                </View>
              </View>
            </View>

            {/* Best Seller */}
            <View style={s.paketCard}>
              <View style={s.paketHeaderOrange}>
                <Text style={s.paketHeaderEmoji}>🔥</Text>
                <Text style={s.paketHeaderTitle}>Kremes Nagih</Text>
                <View style={[s.paketHeaderBadge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}><Text style={[s.paketHeaderBadgeText, { fontFamily: 'Helvetica-Bold' }]}>Best Seller</Text></View>
              </View>
              <View style={s.paketBody}>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Jumlah</Text><Text style={s.paketValue}>20 pcs</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Modal</Text><Text style={s.paketValue}>Rp 170.000</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Harga/pcs</Text><Text style={s.paketValue}>Rp 8.500</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Omset Est.</Text><Text style={s.paketValue}>Rp 200.000</Text></View>
                <View style={s.paketDivider} />
                <View style={s.paketUntung}>
                  <Text style={s.paketUntungVal}>Rp 30.000</Text>
                  <Text style={s.paketUntungLbl}>Estimasi Untung</Text>
                </View>
              </View>
            </View>

            {/* Maksimal */}
            <View style={s.paketCard}>
              <View style={s.paketHeaderPurple}>
                <Text style={s.paketHeaderEmoji}>💎</Text>
                <Text style={s.paketHeaderTitle}>Kriuk Maksimal</Text>
                <View style={s.paketHeaderBadge}><Text style={s.paketHeaderBadgeText}>Untung Terbesar</Text></View>
              </View>
              <View style={s.paketBody}>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Jumlah</Text><Text style={s.paketValue}>30 pcs</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Modal</Text><Text style={s.paketValue}>Rp 240.000</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Harga/pcs</Text><Text style={s.paketValue}>Rp 8.000</Text></View>
                <View style={s.paketRow2}><Text style={s.paketLabel}>Omset Est.</Text><Text style={s.paketValue}>Rp 300.000</Text></View>
                <View style={s.paketDivider} />
                <View style={s.paketUntung}>
                  <Text style={s.paketUntungVal}>Rp 60.000</Text>
                  <Text style={s.paketUntungLbl}>Estimasi Untung</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comparison table */}
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
            <View style={{ backgroundColor: C.primary, flexDirection: 'row', padding: 10 }}>
              {['Paket', 'Jumlah', 'Modal', 'Harga/pcs', 'Omset Est.', 'Untung Est.'].map(h => (
                <Text key={h} style={{ flex: 1, color: C.white, fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>{h}</Text>
              ))}
            </View>
            {[
              ['Krenyes Pemula', '10 pcs', 'Rp 90.000', 'Rp 9.000', 'Rp 100.000', 'Rp 10.000'],
              ['Kremes Nagih', '20 pcs', 'Rp 170.000', 'Rp 8.500', 'Rp 200.000', 'Rp 30.000'],
              ['Kriuk Maksimal', '30 pcs', 'Rp 240.000', 'Rp 8.000', 'Rp 300.000', 'Rp 60.000'],
            ].map((row, i) => (
              <View key={row[0]} style={{ flexDirection: 'row', padding: 8, backgroundColor: i % 2 === 0 ? C.white : C.accentLight }}>
                {row.map((cell, j) => (
                  <Text key={j} style={{ flex: 1, fontSize: 9, color: j === 5 ? C.green : C.body, fontFamily: j === 5 ? 'Helvetica-Bold' : 'Helvetica', textAlign: 'center' }}>{cell}</Text>
                ))}
              </View>
            ))}
          </View>

          <Text style={[s.bodyText, { fontSize: 9, color: C.muted, marginTop: 8 }]}>
            * Omset dan untung bersifat estimasi berdasarkan harga eceran Rp 10.000/pcs. Actual bisa lebih tinggi jika toko menetapkan harga jual lebih dari harga acuan.
          </Text>
        </View>
        <PageFooter page={5} total={6} />
      </Page>

      {/* ══ PAGE 6 – KEUNGGULAN, TARGET PASAR, LEGALITAS & KONTAK ══════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="Keunggulan Produk, Legalitas & Kontak" />

        <View style={s.body}>
          {/* Keunggulan */}
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 10 }}>Mengapa Memilih Mie Kremes?</Text>
          <View style={s.keunggulanGrid}>
            {[
              { t: 'Rasa Unik & Khas',          d: 'Mie kering crispy dengan bumbu rempah alami khas Bogor yang berbeda dari snack pada umumnya.' },
              { t: 'Super Renyah & Gurih',       d: 'Tekstur crispy yang tahan lama. Digoreng sempurna untuk kerenyahan maksimal di setiap gigitan.' },
              { t: 'HALAL & Tanpa Pengawet',     d: 'Bersertifikat Halal Indonesia. Tidak ada bahan pengawet — aman untuk seluruh keluarga.' },
              { t: 'Masa Simpan 3 Bulan',        d: 'Dikemas kedap udara sehingga tahan 3 bulan. Stok toko aman tanpa khawatir cepat kadaluarsa.' },
              { t: '2 Varian Pilihan',           d: 'Original (gurih) dan Pedas memungkinkan segmentasi pelanggan yang lebih luas di toko.' },
              { t: 'Produk Lokal Bogor',         d: 'Nilai lokal yang kuat — cocok dijual sebagai oleh-oleh atau snack khas daerah Bogor.' },
            ].map(k => (
              <View key={k.t} style={s.keunggulanItem}>
                <Text style={s.keunggulanTitle}>{k.t}</Text>
                <Text style={s.keunggulanDesc}>{k.d}</Text>
              </View>
            ))}
          </View>

          {/* Target Pasar */}
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginTop: 12, marginBottom: 8 }}>Target & Cocok Dijual Di</Text>
          <View style={s.targetGrid}>
            {['Warung & Toko Oleh-Oleh', 'Minimarket Lokal', 'Kafe & Warung Kopi', 'Kantin Sekolah', 'Rest Area & Wisata', 'Hotel & Penginapan', 'Pameran & Bazaar', 'Online Shop'].map(t => (
              <View key={t} style={s.targetChip}><Text style={s.targetText}>{t}</Text></View>
            ))}
          </View>

          {/* Legalitas */}
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginTop: 12, marginBottom: 8 }}>Legalitas & Sertifikasi</Text>
          <View style={s.legalBox}>
            <View style={s.legalRow}>
              <Image src={halalLogo} style={s.legalHalalImg} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark }}>Bersertifikat Halal Indonesia</Text>
                <Text style={{ fontSize: 9, color: C.body, marginTop: 2 }}>Produk Mie Kremes Cemilan Teh Risma telah mendapatkan sertifikasi Halal resmi dari Badan Penyelenggara Jaminan Produk Halal (BPJPH) Indonesia.</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
              {[
                ['Nomor Induk Berusaha (NIB)', '0403260068412'],
                ['Domisili Usaha',             'Bogor, Jawa Barat, Indonesia'],
                ['Jenis Usaha',                'Industri Camilan / Makanan Ringan Rumahan'],
              ].map(([k, v]) => (
                <View key={k} style={[s.infoRow, { marginBottom: 5 }]}>
                  <Text style={[s.infoKey, { width: 140 }]}>{k}</Text>
                  <Text style={[s.infoVal, { fontFamily: 'Helvetica-Bold' }]}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kontak */}
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 8 }}>Informasi Kontak</Text>
          <View style={s.contactRow}>
            {[
              { l: 'WhatsApp', v: '+62 812-1213-2014', s: 'Chat / Telepon — Senin-Sabtu 08.00-20.00' },
              { l: 'Website', v: 'cemilantehrisma.vercel.app', s: 'Lihat katalog & pesan online' },
              { l: 'Lokasi', v: 'Bogor, Jawa Barat', s: 'Pengiriman area Bogor & sekitarnya' },
            ].map(c => (
              <View key={c.l} style={s.contactCard}>
                <Text style={s.contactLabel}>{c.l}</Text>
                <Text style={s.contactValue}>{c.v}</Text>
                <Text style={s.contactSub}>{c.s}</Text>
              </View>
            ))}
          </View>

          <View style={[s.infoBox, { marginTop: 4 }]}>
            <Text style={[s.bodyText, { marginBottom: 0, fontSize: 9.5, fontStyle: 'italic' }]}>
              Dokumen ini diterbitkan oleh Cemilan Teh Risma — Bogor · 2026. Bersifat rahasia dan hanya untuk keperluan kerjasama bisnis. Untuk diskusi lebih lanjut, hubungi kami via WhatsApp di nomor 0812-1213-2014.
            </Text>
          </View>
        </View>
        <PageFooter page={6} total={6} />
      </Page>

    </Document>
  );
}

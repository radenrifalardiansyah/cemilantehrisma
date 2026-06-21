import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface Props {
  logo: string;
  imgOri: string;
  imgBBQ: string;
  imgBBQPdas: string;
  imgJgn: string;
  imgOri250: string;
  halalLogo: string;
}

const C = {
  primary:      '#B45309',
  primaryDark:  '#92400E',
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
  page:         { backgroundColor: C.lightBg, fontFamily: 'Helvetica', color: C.dark, paddingBottom: 40 },
  coverPage:    { backgroundColor: C.primary, padding: 0 },
  coverTop:     { backgroundColor: C.primary, padding: 50, alignItems: 'center', flex: 1, justifyContent: 'center' },
  coverBottom:  { backgroundColor: C.primaryDark, paddingHorizontal: 50, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  coverLogoWrap:{ width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: C.white, overflow: 'hidden', marginBottom: 24, backgroundColor: C.white },
  coverLogo:    { width: 110, height: 110, objectFit: 'cover' },
  coverBadge:   { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 20 },
  coverBadgeText:{ color: 'rgba(255,255,255,0.9)', fontSize: 9, letterSpacing: 1.5 },
  coverTitle:   { color: C.white, fontSize: 42, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8, letterSpacing: 1 },
  coverSub:     { color: 'rgba(255,255,255,0.85)', fontSize: 20, textAlign: 'center', marginBottom: 6 },
  coverTagline: { color: 'rgba(255,255,255,0.65)', fontSize: 12, textAlign: 'center', marginBottom: 32 },
  coverStats:   { flexDirection: 'row', gap: 12, marginTop: 8 },
  coverStat:    { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  coverStatVal: { color: C.white, fontSize: 16, fontFamily: 'Helvetica-Bold' },
  coverStatLbl: { color: 'rgba(255,255,255,0.65)', fontSize: 8, marginTop: 2 },
  coverBottomText:   { color: 'rgba(255,255,255,0.55)', fontSize: 9 },
  coverConfidential: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },

  letterhead:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 50, paddingTop: 36, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: C.border },
  letterLogo:   { width: 50, height: 50, borderRadius: 25, objectFit: 'cover' },
  letterBrand:  { alignItems: 'flex-end' },
  letterBrandName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },
  letterBrandSub:  { fontSize: 9, color: C.muted, marginTop: 2 },

  sectionBar:   { backgroundColor: C.primary, paddingHorizontal: 50, paddingVertical: 14, marginBottom: 24 },
  sectionBarText: { color: C.white, fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  sectionBarSub:  { color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 3 },

  body:         { paddingHorizontal: 50 },
  bodyText:     { fontSize: 10.5, color: C.body, lineHeight: 1.7, marginBottom: 10 },
  bold:         { fontFamily: 'Helvetica-Bold' },

  infoBox:      { backgroundColor: C.accentLight, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: C.accent, padding: 14, marginBottom: 14 },
  infoBoxTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  infoRow:      { flexDirection: 'row', marginBottom: 4 },
  infoKey:      { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.muted, width: 100 },
  infoVal:      { fontSize: 9.5, color: C.body, flex: 1 },

  stepRow:      { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  stepNum:      { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  stepNumText:  { color: C.white, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  stepContent:  { flex: 1 },
  stepTitle:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 2 },
  stepDesc:     { fontSize: 9.5, color: C.body, lineHeight: 1.5 },

  // Pricing table
  priceTable:   { borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  priceHeader:  { backgroundColor: C.primary, flexDirection: 'row', padding: 7 },
  priceHeaderCell: { flex: 1, color: C.white, fontSize: 8.5, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  priceRow:     { flexDirection: 'row', padding: 7 },
  priceCell:    { flex: 1, fontSize: 9, color: C.body, textAlign: 'center' },
  priceCellBold:{ flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'center' },

  // Variant cards
  variantGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  variantCard:  { width: '47%', borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  variantImg:   { width: '100%', height: 72, objectFit: 'cover' },
  variantBody:  { padding: 8, backgroundColor: C.white },
  variantName:  { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 2 },
  variantDesc:  { fontSize: 8, color: C.body, lineHeight: 1.4, marginBottom: 5 },
  variantPrices:{ flexDirection: 'row', gap: 5 },
  variantPrice: { flex: 1, backgroundColor: C.accentLight, borderRadius: 4, padding: 5, alignItems: 'center' },
  variantPriceVal: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.primary },
  variantPriceLbl: { fontSize: 7, color: C.muted, marginTop: 1 },

  // Mechanisms
  mechRow:      { flexDirection: 'row', gap: 14, marginBottom: 16 },
  mechCard:     { flex: 1, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
  mechHeaderOrange: { backgroundColor: '#EA580C', padding: 12 },
  mechHeaderViolet: { backgroundColor: '#7C3AED', padding: 12 },
  mechHeaderTitle:  { color: C.white, fontSize: 12, fontFamily: 'Helvetica-Bold' },
  mechHeaderSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 8, marginTop: 2 },
  mechBody:         { padding: 12, backgroundColor: C.white },
  mechLabel:        { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  mechPriceGrid:    { flexDirection: 'row', gap: 6, marginBottom: 8 },
  mechPriceBox2:    { flex: 1, backgroundColor: C.accentLight, borderRadius: 6, padding: 8, alignItems: 'center' },
  mechPriceVal:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.primary },
  mechPriceSub:     { fontSize: 7.5, color: C.muted, marginTop: 2 },
  mechInfoBox:      { borderRadius: 6, padding: 8, marginBottom: 8 },
  mechInfoText:     { fontSize: 9, color: C.body, lineHeight: 1.5 },
  mechGreenBox:     { backgroundColor: C.greenLight, borderRadius: 6, padding: 7, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mechGreenVal:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.green },
  mechGreenLbl:     { fontSize: 8, color: C.green },
  mechStep:         { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
  mechStepNum:      { width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 },
  mechStepNumViolet:{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0 },
  mechStepNumText:  { color: C.white, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  mechStepTitle:    { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.dark },
  mechStepDesc:     { fontSize: 8, color: C.body, lineHeight: 1.4 },

  keunggulanGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  keunggulanItem:   { width: '47%', borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 10, backgroundColor: C.white },
  keunggulanTitle:  { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 3 },
  keunggulanDesc:   { fontSize: 8.5, color: C.body, lineHeight: 1.5 },

  targetGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  targetChip:   { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.white },
  targetText:   { fontSize: 9, color: C.body },

  legalBox:     { borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 16, backgroundColor: C.white, marginBottom: 14 },
  legalRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legalHalalImg:{ width: 36, height: 36, marginRight: 12 },

  contactRow:   { flexDirection: 'row', gap: 12, marginBottom: 14 },
  contactCard:  { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12, backgroundColor: C.white },
  contactLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  contactValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark },
  contactSub:   { fontSize: 8.5, color: C.primary, marginTop: 2 },

  pageFooter:   { position: 'absolute', bottom: 20, left: 50, right: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageFooterText: { fontSize: 8, color: C.gray },
});

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
      <Text style={s.pageFooterText}>Cemilan Teh Risma · Proposal Keripik Kimpul 2026</Text>
      <Text style={s.pageFooterText}>Halaman {page} / {total}</Text>
    </View>
  );
}

export default function KeripikKimpulPDF({ logo, imgOri, imgBBQ, imgBBQPdas, imgJgn, imgOri250, halalLogo }: Props) {
  return (
    <Document
      title="Proposal Kerjasama Keripik Kimpul - Cemilan Teh Risma"
      author="Cemilan Teh Risma"
      subject="Proposal Kerjasama Titip Jual / Reseller Keripik Kimpul Talas Balitung"
      keywords="proposal, keripik kimpul, talas, kerjasama, titip jual, reseller, cemilan teh risma, bogor"
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
          <Text style={s.coverTitle}>KERIPIK KIMPUL</Text>
          <Text style={s.coverSub}>Cemilan Teh Risma</Text>
          <Text style={s.coverTagline}>Keripik talas balitung super renyah khas Bogor — 4 rasa, 2 ukuran, tanpa pengawet</Text>
          <View style={s.coverStats}>
            {[
              { v: '4 Varian', l: 'Original, BBQ, BBQ Pedas, Jagung' },
              { v: '2 Ukuran', l: '100g & 250g (Jumbo)' },
              { v: 'Rp 15rb+', l: 'Harga Mulai Dari' },
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
            <Text style={s.bold}>Keripik Kimpul Talas Balitung</Text>
            {' '}di tempat yang Bapak/Ibu kelola.
          </Text>

          <View style={s.infoBox}>
            <Text style={s.infoBoxTitle}>Ringkasan Produk</Text>
            {[
              ['Produk',        'Keripik Kimpul Talas Balitung'],
              ['Varian Rasa',   'Original, BBQ, BBQ Pedas, Jagung Manis (4 rasa)'],
              ['Ukuran',        '100g (Rp 15.000) · 250g Jumbo (Rp 26.500)'],
              ['Masa Simpan',   '3 bulan (kemasan kedap udara)'],
              ['Bahan Baku',    'Talas Kimpul Pilihan dari Petani Lokal Bogor'],
              ['Legalitas',     'Halal Indonesia · NIB 0403260068412'],
            ].map(([k, v]) => (
              <View key={k} style={s.infoRow}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={s.bodyText}>
            Kami menawarkan <Text style={s.bold}>2 mekanisme kerjasama</Text> yang dapat disesuaikan dengan kebutuhan toko:
          </Text>

          {[
            {
              n: '1', t: 'Titip Jual (Konsinyasi)',
              d: 'Produk dititipkan tanpa biaya di muka. Harga pengambilan Rp 14.000/pcs (100g) dan Rp 25.500/pcs (250g) — dibayar mingguan atau bulanan. Harga jual bebas (saran min. Rp 15.000 / Rp 26.500). Produk tidak terjual akan kami ganti.',
            },
            {
              n: '2', t: 'Beli Putus / Reseller',
              d: 'Toko membeli stok langsung secara tunai. Harga per pcs lebih hemat sesuai volume. Stok milik toko — bebas dijual kapan saja dengan harga berapa pun. Untung penuh menjadi hak toko.',
            },
          ].map(item => (
            <View key={item.n} style={s.stepRow}>
              <View style={s.stepNum}><Text style={s.stepNumText}>{item.n}</Text></View>
              <View style={s.stepContent}>
                <Text style={s.stepTitle}>{item.t}</Text>
                <Text style={s.stepDesc}>{item.d}</Text>
              </View>
            </View>
          ))}

          <Text style={s.bodyText}>
            Keripik Kimpul merupakan produk dengan identitas lokal yang kuat sebagai{' '}
            <Text style={s.bold}>oleh-oleh autentik khas Bogor</Text>
            {' '}— bahan baku lokal, rasa unik, dan kemasan menarik. Kami siap berdiskusi lebih lanjut mengenai detail kerjasama yang paling sesuai.
          </Text>
          <Text style={s.bodyText}>Wassalamualaikum Wr. Wb.</Text>

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
        <SectionBar title="Profil & Detail Produk" sub="4 varian rasa · 2 ukuran kemasan (100g & 250g Jumbo)" />

        <View style={s.body}>
          <View style={s.variantGrid}>
            {[
              { img: imgOri,    name: 'Original',  desc: 'Gurih alami talas kimpul pilihan. Cocok untuk semua usia.', color: C.primary },
              { img: imgBBQ,    name: 'BBQ',        desc: 'Rasa BBQ smoky original tanpa pedas. Favorit anak-anak.', color: '#C2410C' },
              { img: imgBBQPdas,name: 'BBQ Pedas',  desc: 'BBQ smoky dengan sensasi pedas yang nagih dan renyah.', color: '#B91C1C' },
              { img: imgJgn,    name: 'Jagung Manis', desc: 'Rasa jagung manis lezat. Sempurna untuk cemilan santai.', color: '#CA8A04' },
            ].map(v => (
              <View key={v.name} style={[s.variantCard, { borderColor: C.border }]}>
                <Image src={v.img} style={s.variantImg} />
                <View style={s.variantBody}>
                  <Text style={[s.variantName, { color: v.color }]}>{v.name}</Text>
                  <Text style={s.variantDesc}>{v.desc}</Text>
                  <View style={s.variantPrices}>
                    <View style={s.variantPrice}>
                      <Text style={s.variantPriceVal}>Rp 15.000</Text>
                      <Text style={s.variantPriceLbl}>100g</Text>
                    </View>
                    <View style={s.variantPrice}>
                      <Text style={s.variantPriceVal}>Rp 26.500</Text>
                      <Text style={s.variantPriceLbl}>250g</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing table */}
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 6 }}>Tabel Harga Lengkap</Text>
          <View style={s.priceTable}>
            <View style={s.priceHeader}>
              {['Varian Rasa', 'Kemasan 100g', 'Kemasan 250g (Jumbo)', 'Bahan Utama'].map(h => (
                <Text key={h} style={s.priceHeaderCell}>{h}</Text>
              ))}
            </View>
            {[
              ['Original',    'Rp 15.000', 'Rp 26.500', 'Talas Kimpul, Minyak, Garam'],
              ['BBQ',         'Rp 15.000', 'Rp 26.500', 'Talas Kimpul, Bumbu BBQ'],
              ['BBQ Pedas',   'Rp 15.000', 'Rp 26.500', 'Talas Kimpul, Bubuk Cabai BBQ'],
              ['Jagung Manis','Rp 15.000', 'Rp 26.500', 'Talas Kimpul, Bubuk Jagung'],
            ].map((row, i) => (
              <View key={row[0]} style={[s.priceRow, { backgroundColor: i % 2 === 0 ? C.white : C.accentLight }]}>
                <Text style={[s.priceCell, { fontFamily: 'Helvetica-Bold', color: C.dark }]}>{row[0]}</Text>
                <Text style={s.priceCellBold}>{row[1]}</Text>
                <Text style={s.priceCellBold}>{row[2]}</Text>
                <Text style={[s.priceCell, { fontSize: 8 }]}>{row[3]}</Text>
              </View>
            ))}
          </View>

          <View style={[s.infoBox, { padding: 10, marginBottom: 0 }]} wrap={false}>
            <Text style={[s.infoBoxTitle, { marginBottom: 6 }]}>Informasi Umum Produk</Text>
            {[
              ['Masa Simpan',   '3 bulan sejak tanggal produksi (kemasan kedap udara)'],
              ['Komposisi',     'Talas Kimpul Pilihan, Minyak Goreng, Garam, Bumbu Perasa (sesuai varian)'],
              ['Halal',         'Bersertifikat Halal Indonesia dari BPJPH'],
              ['Diproduksi',    'Cemilan Teh Risma · Bogor, Jawa Barat · NIB: 0403260068412'],
              ['Tersedia juga', 'Paket Hemat Mix 3 Rasa (Rp 40.000) & Mix 5 Pcs (Rp 65.000)'],
            ].map(([k, v]) => (
              <View key={k} style={[s.infoRow, { marginBottom: 3 }]}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>
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
                <Text style={s.mechLabel}>Harga Pengambilan (per pcs terjual)</Text>
                <View style={s.mechPriceGrid}>
                  <View style={s.mechPriceBox2}>
                    <Text style={s.mechPriceVal}>Rp 14.000</Text>
                    <Text style={s.mechPriceSub}>Kemasan 100g</Text>
                  </View>
                  <View style={s.mechPriceBox2}>
                    <Text style={s.mechPriceVal}>Rp 25.500</Text>
                    <Text style={s.mechPriceSub}>Kemasan 250g</Text>
                  </View>
                </View>

                <Text style={s.mechLabel}>Harga Jual ke Konsumen</Text>
                <View style={[s.mechInfoBox, { backgroundColor: C.accentLight, marginBottom: 8 }]}>
                  <Text style={[s.mechInfoText, { fontFamily: 'Helvetica-Bold' }]}>Bebas — Toko menentukan sendiri</Text>
                  <Text style={[s.mechInfoText, { color: C.muted, marginTop: 3 }]}>
                    Saran min. Rp 15.000 (100g){'\n'}
                    Saran min. Rp 26.500 (250g){'\n'}
                    Harga lebih tinggi = margin lebih besar
                  </Text>
                </View>

                <View style={[s.mechGreenBox, { marginBottom: 4 }]}>
                  <Text style={s.mechGreenVal}>Min. Rp 1.000/pcs</Text>
                  <Text style={s.mechGreenLbl}>Est. Margin</Text>
                </View>
                <View style={[s.mechGreenBox, { backgroundColor: C.accentLight, marginBottom: 8 }]}>
                  <Text style={[s.mechGreenVal, { color: C.accent }]}>Mingguan / Bulanan</Text>
                  <Text style={[s.mechGreenLbl, { color: C.accent }]}>Sistem Bayar</Text>
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
                <View style={[s.mechPriceGrid, { marginBottom: 8 }]}>
                  <View style={[s.mechPriceBox2, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[s.mechPriceVal, { color: C.violet, fontSize: 9.5 }]}>Lebih hemat</Text>
                    <Text style={s.mechPriceSub}>sesuai volume</Text>
                  </View>
                </View>

                <Text style={s.mechLabel}>Harga Jual ke Konsumen</Text>
                <View style={[s.mechInfoBox, { backgroundColor: '#EDE9FE', marginBottom: 8 }]}>
                  <Text style={[s.mechInfoText, { fontFamily: 'Helvetica-Bold', color: '#4C1D95' }]}>Bebas — Hak penuh reseller</Text>
                  <Text style={[s.mechInfoText, { color: '#6D28D9', marginTop: 3 }]}>
                    Acuan 100g: Rp 15.000{'\n'}
                    Acuan 250g: Rp 26.500{'\n'}
                    Stok milik toko, jual kapan saja
                  </Text>
                </View>

                <View style={[s.mechGreenBox, { backgroundColor: '#EDE9FE', marginBottom: 4 }]}>
                  <Text style={[s.mechGreenVal, { color: C.violet }]}>Cash / Transfer</Text>
                  <Text style={[s.mechGreenLbl, { color: C.violet }]}>Lunas di muka</Text>
                </View>
                <View style={[s.mechGreenBox, { backgroundColor: '#EDE9FE', marginBottom: 8 }]}>
                  <Text style={[s.mechGreenVal, { color: C.violet, fontSize: 9.5 }]}>Untung 100%</Text>
                  <Text style={[s.mechGreenLbl, { color: C.violet }]}>Selisih beli-jual</Text>
                </View>

                <Text style={[s.mechLabel, { marginTop: 4 }]}>Cara Kerja</Text>
                {[
                  ['01', 'Tentukan jumlah & varian', '4 rasa tersedia: Ori, BBQ, BBQ Pdas, Jagung'],
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

                {/* WA CTA */}
                <View style={{ backgroundColor: '#EDE9FE', borderRadius: 6, padding: 8, marginTop: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 8.5, color: '#4C1D95', fontFamily: 'Helvetica-Bold' }}>Tanya harga reseller via WhatsApp</Text>
                  <Text style={{ fontSize: 9, color: C.violet, marginTop: 2 }}>0812-1213-2014</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[s.infoBox, { borderLeftColor: C.green, backgroundColor: C.greenLight }]}>
            <Text style={[s.infoBoxTitle, { color: C.green }]}>Tips Memilih Mekanisme</Text>
            <Text style={[s.bodyText, { marginBottom: 0, fontSize: 9.5 }]}>
              <Text style={s.bold}>Titip Jual</Text> cocok untuk toko yang baru ingin mencoba tanpa risiko.{' '}
              <Text style={s.bold}>Beli Putus</Text> cocok untuk toko yang sudah yakin dan ingin margin lebih besar. Bisa mulai Titip Jual dulu, lanjut Beli Putus setelah melihat respons pasar.
            </Text>
          </View>
        </View>
        <PageFooter page={4} total={6} />
      </Page>

      {/* ══ PAGE 5 – KEUNGGULAN & TARGET PASAR ═════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="Keunggulan Produk & Target Pasar" />

        <View style={s.body}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 10 }}>Mengapa Memilih Keripik Kimpul?</Text>
          <View style={s.keunggulanGrid}>
            {[
              { t: 'Bahan Baku Lokal Bogor',    d: 'Talas kimpul/balitung pilihan dari petani lokal Bogor. Mendukung ekonomi lokal dan menjamin kualitas.' },
              { t: 'Super Renyah & Tahan Lama', d: 'Tekstur crispy yang tahan lama bahkan setelah kemasan dibuka. Proses penggorengan optimal.' },
              { t: 'HALAL & Tanpa Pengawet',    d: 'Bersertifikat Halal Indonesia. Bebas pengawet kimia — aman untuk seluruh keluarga.' },
              { t: 'Masa Simpan 3 Bulan',       d: 'Dikemas kedap udara tahan 3 bulan. Stok toko aman tanpa khawatir cepat kadaluarsa.' },
              { t: '4 Rasa, 2 Ukuran',          d: 'Variasi rasa dan ukuran memungkinkan segmentasi harga yang fleksibel untuk toko Anda.' },
              { t: 'Oleh-Oleh Khas Bogor',      d: 'Talas kimpul adalah bahan khas Bogor yang ikonik. Nilai jual sebagai oleh-oleh autentik sangat kuat.' },
            ].map(k => (
              <View key={k.t} style={s.keunggulanItem}>
                <Text style={s.keunggulanTitle}>{k.t}</Text>
                <Text style={s.keunggulanDesc}>{k.d}</Text>
              </View>
            ))}
          </View>

          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginTop: 14, marginBottom: 8 }}>Cocok Dijual Di</Text>
          <View style={s.targetGrid}>
            {['Toko Oleh-Oleh', 'Wisata & Rest Area', 'Kafe & Warung', 'Kantin Sekolah', 'Minimarket Lokal', 'Pameran & Bazaar', 'Hotel & Penginapan', 'Online Shop'].map(t => (
              <View key={t} style={s.targetChip}><Text style={s.targetText}>{t}</Text></View>
            ))}
          </View>

          {/* Paket Hemat note */}
          <View style={[s.infoBox, { marginTop: 14 }]}>
            <Text style={s.infoBoxTitle}>Tersedia Juga: Paket Hemat</Text>
            {[
              ['Paket Mix 3 Rasa', 'Rp 40.000 (hemat Rp 5.000) — 3 pcs Keripik Kimpul 100g mix rasa'],
              ['Paket Mix 5 Pcs',  'Rp 65.000 (hemat Rp 10.000) — 5 pcs Keripik Kimpul 100g bebas rasa'],
              ['Paket Campur',     'Rp 44.000 — 2 Keripik Kimpul + 2 Mie Kremes (cocok hampers/oleh-oleh)'],
            ].map(([k, v]) => (
              <View key={k} style={s.infoRow}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter page={5} total={6} />
      </Page>

      {/* ══ PAGE 6 – LEGALITAS & KONTAK ════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Letterhead logo={logo} />
        <SectionBar title="Legalitas, Sertifikasi & Informasi Kontak" />

        <View style={s.body}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 10 }}>Legalitas & Sertifikasi</Text>
          <View style={s.legalBox}>
            <View style={s.legalRow}>
              <Image src={halalLogo} style={s.legalHalalImg} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark }}>Bersertifikat Halal Indonesia</Text>
                <Text style={{ fontSize: 9, color: C.body, marginTop: 2 }}>Keripik Kimpul Cemilan Teh Risma telah mendapatkan sertifikasi Halal resmi dari Badan Penyelenggara Jaminan Produk Halal (BPJPH) Indonesia.</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
              {[
                ['Nomor Induk Berusaha (NIB)', '0403260068412'],
                ['Domisili Usaha',             'Bogor, Jawa Barat, Indonesia'],
                ['Jenis Usaha',                'Industri Camilan / Makanan Ringan Rumahan'],
                ['Bahan Baku',                 'Talas Kimpul dari Petani Lokal Bogor, Minyak Goreng, Bumbu Alami'],
              ].map(([k, v]) => (
                <View key={k} style={[s.infoRow, { marginBottom: 5 }]}>
                  <Text style={[s.infoKey, { width: 140 }]}>{k}</Text>
                  <Text style={[s.infoVal, { fontFamily: 'Helvetica-Bold' }]}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

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

          {/* Closing */}
          <View style={[s.infoBox, { marginTop: 8 }]}>
            <Text style={s.infoBoxTitle}>Penutup</Text>
            <Text style={[s.bodyText, { marginBottom: 0, fontSize: 9.5 }]}>
              Demikian proposal kerjasama ini kami sampaikan. Besar harapan kami untuk dapat berdiskusi lebih lanjut dan menjalin kerjasama yang saling menguntungkan. Kami terbuka untuk bernegosiasi terkait jumlah produk, jadwal pengiriman, dan detail teknis lainnya.
            </Text>
          </View>

          <View style={[s.infoBox, { borderLeftColor: C.gray, backgroundColor: '#F9FAFB', marginTop: 8 }]}>
            <Text style={[s.bodyText, { marginBottom: 0, fontSize: 9, color: C.gray, fontStyle: 'italic' }]}>
              Dokumen ini diterbitkan oleh Cemilan Teh Risma — Bogor, 2026. Bersifat rahasia dan hanya untuk keperluan kerjasama bisnis. Penggandaan atau penyebaran tanpa izin tidak diperkenankan.
            </Text>
          </View>
        </View>
        <PageFooter page={6} total={6} />
      </Page>

    </Document>
  );
}

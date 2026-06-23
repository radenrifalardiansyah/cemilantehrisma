import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

export interface InvoiceItem {
  name:     string;
  weight:   string;
  qty:      number;
  price:    number;
  subtotal: number;
}

export interface InvoiceData {
  invoiceNo:    string;
  date:         string;
  customerName: string;
  customerPhone:string;
  items:        InvoiceItem[];
  subtotal:     number;
  discount?:    { amount: number; label: string };
  total:        number;
  logo:         string;
  halalLogo:    string;
}

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  primary:     '#B45309',
  primaryDark: '#92400E',
  accent:      '#D97706',
  accentLight: '#FEF3C7',
  accentMid:   '#FDE68A',
  lightBg:     '#FFFBF2',
  white:       '#FFFFFF',
  dark:        '#1C0A00',
  body:        '#3D1A00',
  muted:       '#78350F',
  border:      '#FCD34D',
  borderLight: '#FEF3C7',
  green:       '#15803D',
  greenLight:  '#DCFCE7',
  gray:        '#6B7280',
  grayLight:   '#F3F4F6',
};

const rp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const s = StyleSheet.create({
  page: { backgroundColor: C.lightBg, fontFamily: 'Helvetica', color: C.dark, paddingBottom: 56 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingVertical: 28,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoWrap: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden', backgroundColor: C.white,
  },
  logo: { width: 60, height: 60, objectFit: 'cover' },
  brandName: { color: C.white, fontSize: 18, fontFamily: 'Helvetica-Bold' },
  brandSub:  { color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 3 },
  brandSub2: { color: 'rgba(255,255,255,0.6)',  fontSize: 8, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  invoiceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  invoiceTitle: { color: C.white, fontSize: 32, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },

  // ── Meta bar ──────────────────────────────────────────────────────────────
  metaBar: {
    backgroundColor: C.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingVertical: 10,
  },
  metaItem: { alignItems: 'center' },
  metaLabel:{ color: 'rgba(255,255,255,0.55)', fontSize: 7.5, letterSpacing: 0.8, fontFamily: 'Helvetica-Bold' },
  metaValue:{ color: C.white, fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 2 },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 44, paddingTop: 28 },

  // ── Bill-to + Summary cards ───────────────────────────────────────────────
  topCards: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  card: {
    flex: 1, backgroundColor: C.white,
    borderRadius: 8, borderWidth: 1, borderColor: C.borderLight,
    padding: 14,
  },
  cardLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  cardName:  { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 3 },
  cardSub:   { fontSize: 9.5, color: C.body },
  summaryRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryKey:{ fontSize: 9.5, color: C.muted },
  summaryVal:{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.dark },

  // ── Table ─────────────────────────────────────────────────────────────────
  tableHead: {
    flexDirection: 'row',
    backgroundColor: C.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  thNo:    { width: 24,  color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  thName:  { flex: 1,    color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  thQty:   { width: 36,  color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  thPrice: { width: 80,  color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  thSub:   { width: 85,  color: C.white, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  tdNo:    { width: 24,  fontSize: 9, color: C.gray, textAlign: 'center' },
  tdName:  { flex: 1 },
  tdNameText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark },
  tdNameSub:  { fontSize: 8,  color: C.muted, marginTop: 1 },
  tdQty:   { width: 36,  fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.body, textAlign: 'center' },
  tdPrice: { width: 80,  fontSize: 9.5, color: C.body, textAlign: 'right' },
  tdSub:   { width: 85,  fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'right' },

  tableOdd:  { backgroundColor: C.white },
  tableEven: { backgroundColor: C.grayLight },

  // ── Total section ─────────────────────────────────────────────────────────
  totalSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  totalBox: {
    width: 220,
    borderWidth: 1, borderColor: C.border, borderRadius: 8,
    overflow: 'hidden',
  },
  totalRowGray: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.grayLight },
  totalRowMain: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, backgroundColor: C.primary },
  totalGrayKey: { fontSize: 9, color: C.gray },
  totalGrayVal: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.dark },
  totalMainKey: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.white },
  totalMainVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.accentMid },

  // ── Payment info ──────────────────────────────────────────────────────────
  paymentBox: {
    marginTop: 20,
    backgroundColor: C.white,
    borderRadius: 8, borderWidth: 1, borderColor: C.borderLight,
    padding: 14,
  },
  paymentTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.accent, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  paymentRow:   { flexDirection: 'row', marginBottom: 5 },
  paymentKey:   { width: 90, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.muted },
  paymentVal:   { flex: 1, fontSize: 9, color: C.body },

  // ── Halal badge ───────────────────────────────────────────────────────────
  halalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  halalImg: { width: 28, height: 28 },
  halalText:{ fontSize: 8, color: C.green, fontFamily: 'Helvetica-Bold' },
  halalSub: { fontSize: 7.5, color: C.muted, marginTop: 1 },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 44,
    paddingVertical: 12,
  },
  footerLeft:  { flex: 1 },
  footerText:  { color: 'rgba(255,255,255,0.7)', fontSize: 8 },
  footerBold:  { color: C.white, fontSize: 8.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  footerRight: { alignItems: 'flex-end' },
  footerThank: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontFamily: 'Helvetica-BoldOblique' },
  footerSub:   { color: 'rgba(255,255,255,0.55)', fontSize: 7.5, marginTop: 2 },
});

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const itemCount    = data.items.reduce((s, i) => s + i.qty, 0);
  const hasDiscount  = data.discount && data.discount.amount > 0;

  return (
    <Document
      title={`Invoice ${data.invoiceNo} — ${data.customerName}`}
      author="Cemilan Teh Risma"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.logoWrap}>
              <Image src={data.logo} style={s.logo} />
            </View>
            <View>
              <Text style={s.brandName}>Cemilan Teh Risma</Text>
              <Text style={s.brandSub}>Bogor, Jawa Barat · Indonesia</Text>
              <Text style={s.brandSub2}>NIB: 0403260068412 · WA: 0812-1213-2014</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={s.invoiceLabel}>DOKUMEN</Text>
            <Text style={s.invoiceTitle}>INVOICE</Text>
          </View>
        </View>

        {/* ── Meta bar ─────────────────────────────────────────────────────── */}
        <View style={s.metaBar}>
          {[
            { l: 'NO. INVOICE', v: data.invoiceNo },
            { l: 'TANGGAL',    v: data.date },
            { l: 'STATUS',     v: 'MENUNGGU PEMBAYARAN' },
          ].map(m => (
            <View key={m.l} style={s.metaItem}>
              <Text style={s.metaLabel}>{m.l}</Text>
              <Text style={s.metaValue}>{m.v}</Text>
            </View>
          ))}
        </View>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <View style={s.body}>

          {/* Bill-to + Summary */}
          <View style={s.topCards}>
            <View style={s.card}>
              <Text style={s.cardLabel}>Tagihan Kepada</Text>
              <Text style={s.cardName}>{data.customerName}</Text>
              <Text style={s.cardSub}>WhatsApp: {data.customerPhone}</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>Ringkasan</Text>
              {[
                ['Jumlah Produk', `${data.items.length} item`],
                ['Total Qty',     `${itemCount} pcs`],
                ...(hasDiscount ? [
                  ['Subtotal',  rp(data.subtotal)],
                  ['Diskon',    `- ${rp(data.discount!.amount)} (${data.discount!.label})`],
                ] : []),
                ['Total Tagihan', rp(data.total)],
              ].map(([k, v]) => (
                <View key={k} style={s.summaryRow}>
                  <Text style={s.summaryKey}>{k}</Text>
                  <Text style={[s.summaryVal, k === 'Diskon' ? { color: C.green } : {}]}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Order table ──────────────────────────────────────────────── */}
          <View style={s.tableHead}>
            <Text style={s.thNo}>#</Text>
            <Text style={s.thName}>Nama Produk</Text>
            <Text style={s.thQty}>Qty</Text>
            <Text style={s.thPrice}>Harga Satuan</Text>
            <Text style={s.thSub}>Subtotal</Text>
          </View>

          {data.items.map((item, i) => (
            <View key={i} style={[s.tableRow, i % 2 === 0 ? s.tableOdd : s.tableEven]}>
              <Text style={s.tdNo}>{i + 1}</Text>
              <View style={s.tdName}>
                <Text style={s.tdNameText}>{item.name}</Text>
                {item.weight ? <Text style={s.tdNameSub}>{item.weight}</Text> : null}
              </View>
              <Text style={s.tdQty}>{item.qty}</Text>
              <Text style={s.tdPrice}>{rp(item.price)}</Text>
              <Text style={s.tdSub}>{rp(item.subtotal)}</Text>
            </View>
          ))}

          {/* ── Total ────────────────────────────────────────────────────── */}
          <View style={s.totalSection}>
            <View style={s.totalBox}>
              <View style={s.totalRowGray}>
                <Text style={s.totalGrayKey}>Subtotal ({itemCount} pcs)</Text>
                <Text style={s.totalGrayVal}>{rp(data.subtotal)}</Text>
              </View>
              {hasDiscount && (
                <View style={s.totalRowGray}>
                  <Text style={[s.totalGrayKey, { color: C.green }]}>
                    Diskon ({data.discount!.label})
                  </Text>
                  <Text style={[s.totalGrayVal, { color: C.green }]}>
                    - {rp(data.discount!.amount)}
                  </Text>
                </View>
              )}
              <View style={s.totalRowGray}>
                <Text style={s.totalGrayKey}>Ongkos Kirim</Text>
                <Text style={s.totalGrayVal}>Sesuai kesepakatan</Text>
              </View>
              <View style={s.totalRowMain}>
                <Text style={s.totalMainKey}>TOTAL</Text>
                <Text style={s.totalMainVal}>{rp(data.total)}</Text>
              </View>
            </View>
          </View>

          {/* ── Payment info + Halal ────────────────────────────────────── */}
          <View style={s.paymentBox}>
            <Text style={s.paymentTitle}>Informasi Pembayaran</Text>
            {[
              ['Transfer ke',   'Bank / e-wallet sesuai kesepakatan dengan Teh Risma'],
              ['Konfirmasi',    'Via WhatsApp: 0812-1213-2014 setelah transfer'],
              ['Pengiriman',    'Dikirim setelah pembayaran dikonfirmasi'],
              ['Pertanyaan',    'WhatsApp: 0812-1213-2014 (Senin–Sabtu, 08.00–20.00)'],
            ].map(([k, v]) => (
              <View key={k} style={s.paymentRow}>
                <Text style={s.paymentKey}>{k}</Text>
                <Text style={s.paymentVal}>{v}</Text>
              </View>
            ))}

            <View style={s.halalRow}>
              <Image src={data.halalLogo} style={s.halalImg} />
              <View>
                <Text style={s.halalText}>Produk Bersertifikat Halal Indonesia</Text>
                <Text style={s.halalSub}>Tanpa pengawet · Bahan alami pilihan · Produksi Bogor</Text>
              </View>
            </View>
          </View>

        </View>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <View style={s.footerLeft}>
            <Text style={s.footerBold}>Cemilan Teh Risma</Text>
            <Text style={s.footerText}>Bogor, Jawa Barat · WA: 0812-1213-2014 · NIB: 0403260068412</Text>
          </View>
          <View style={s.footerRight}>
            <Text style={s.footerThank}>Terima kasih sudah berbelanja!</Text>
            <Text style={s.footerSub}>Invoice {data.invoiceNo}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}

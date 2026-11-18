export default function CheckoutSkeleton() {
  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Memuat...</span>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 animate-pulse" aria-hidden="true">
        <div className="h-9 w-48 rounded-lg bg-amber-100 mb-2" />
        <div className="h-4 w-64 max-w-full rounded bg-amber-100/70 mb-8" />
        <div className="h-8 w-56 max-w-full rounded-full bg-amber-100/70 mx-auto mb-8" />
        <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
          <div className="h-5 w-40 rounded bg-amber-100" />
          <div className="h-11 rounded-xl bg-amber-50" />
          <div className="h-11 rounded-xl bg-amber-50" />
          <div className="h-11 rounded-xl bg-amber-50" />
        </div>
      </div>
    </main>
  );
}

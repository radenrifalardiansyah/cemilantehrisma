interface Props {
  count?: number;
  label?: string;
  gridClassName?: string;
}

// Skeleton grid untuk state loading daftar produk/lapak. Grid default sama dengan ProductCard di /products.
export default function ProductGridSkeleton({
  count = 8,
  label = 'Memuat...',
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5',
}: Props) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={gridClassName}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true" className="rounded-2xl border border-amber-100 bg-white overflow-hidden">
          <div className="animate-pulse bg-amber-100 w-full" style={{ aspectRatio: '1 / 1' }} />
          <div className="p-3 sm:p-4 space-y-2.5">
            <div className="animate-pulse bg-amber-100 h-4 rounded w-3/4" />
            <div className="animate-pulse bg-amber-100 h-3 rounded w-1/2" />
            <div className="animate-pulse bg-amber-100 h-5 rounded w-1/3 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

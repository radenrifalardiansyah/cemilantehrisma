export type ClickType = 'menu' | 'category' | 'product' | 'addcart';

export function trackClick(type: ClickType, key: string) {
  if (typeof window === 'undefined') return;
  fetch('/api/analytics/click', {
    method:   'POST',
    headers:  { 'Content-Type': 'application/json' },
    body:     JSON.stringify({ type, key }),
    keepalive: true,
  }).catch(() => {});
}

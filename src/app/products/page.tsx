'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductBanner from '@/components/ProductBanner';
import BottomNav from '@/components/BottomNav';
import { products, categoryData } from '@/lib/products';
import { Category } from '@/types';

const allTab = { id: 'semua' as Category, name: 'Semua', emoji: '🛒', count: products.length };
const tabs = [allTab, ...categoryData.map(c => ({ ...c, id: c.id as Category }))];

function ProductsPage() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'semua') list = list.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const sortLabels: Record<string, string> = {
    default: 'Urutan Default',
    'price-asc': 'Harga Terendah',
    'price-desc': 'Harga Tertinggi',
  };

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 md:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-3">
            Menu Lengkap
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
            <span className="text-amber-950">Semua </span>
            <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-amber-800/55 text-sm sm:text-base max-w-md mx-auto">
            {products.length} pilihan menu siap menemani harimu
          </p>
        </motion.div>

        {/* Banner Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <ProductBanner />
        </motion.div>

        {/* Search + Sort */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl input-field text-sm placeholder:text-amber-700/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showSort
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-white border-amber-200 text-amber-700/70 hover:border-amber-300 hover:text-amber-800'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-amber-100 shadow-xl z-20 overflow-hidden"
                >
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key as typeof sortBy); setShowSort(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        sortBy === key
                          ? 'bg-amber-50 text-amber-700 font-semibold'
                          : 'text-amber-900/60 hover:bg-amber-50 hover:text-amber-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8"
          style={{ scrollbarWidth: 'none' }}
        >
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-white border border-amber-200 text-amber-700/70 hover:border-amber-300 hover:text-amber-800'
              }`}
              style={
                activeCategory === tab.id
                  ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' }
                  : {}
              }
            >
              <span>{tab.emoji}</span>
              <span>{tab.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === tab.id
                    ? 'bg-white/25 text-white'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Count */}
        <div className="flex items-center mb-5">
          <p className="text-amber-800/50 text-sm">
            <span className="text-amber-700 font-semibold">{filtered.length}</span> menu ditemukan
            {searchQuery && (
              <span> untuk <span className="text-amber-600 font-semibold">&quot;{searchQuery}&quot;</span></span>
            )}
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🔍
              </motion.div>
              <h3 className="font-display text-xl font-bold text-amber-900/50 mb-2">
                Menu tidak ditemukan
              </h3>
              <p className="text-amber-700/45 text-sm mb-5">
                Coba kata kunci lain atau pilih kategori berbeda
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('semua'); }}
                className="btn-primary px-5 py-2.5 text-sm font-bold"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF5' }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          🍵
        </motion.div>
      </div>
    }>
      <ProductsPage />
    </Suspense>
  );
}

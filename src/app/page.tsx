import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import FeaturedSection from '@/components/FeaturedSection';
import CategoriesSection from '@/components/CategoriesSection';
import BottomNav from '@/components/BottomNav';

export default function HomePage() {
  return (
    <main style={{ background: '#FFFBF5' }}>
      <Navbar />
      <Cart />
      <Hero />
      <CategoriesSection />
      {/* Extra bottom padding on mobile for BottomNav */}
      <div className="pb-24 md:pb-0">
        <FeaturedSection />
      </div>
      <Footer />
      <BottomNav />
    </main>
  );
}

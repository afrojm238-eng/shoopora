/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  Menu, 
  ShoppingCart, 
  User, 
  ChevronRight, 
  Clock, 
  Star, 
  Home, 
  MessageCircle, 
  LayoutGrid, 
  Globe, 
  ChevronDown,
  X,
  Plus,
  Minus,
  CreditCard,
  Package,
  Truck,
  MessageSquare,
  Ticket,
  Heart,
  Store,
  History,
  Settings,
  HelpCircle,
  Info,
  Bell,
  Settings2,
  Facebook,
  Apple,
  BarChart3,
  PlusCircle,
  Trash2,
  Edit3,
  Layout,
  LogOut,
  Eye,
  Package2,
  Mail,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { Product, Category, Order } from './types';
import { supabaseService } from './lib/supabaseService';
import { supabase } from './lib/supabase';

declare global {
  interface Window {
  }
}

// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: '1', name: "Women's Fashion", icon: '👗' },
  { id: '2', name: "Men's Fashion", icon: '👔' },
  { id: '3', name: "Phones & Telecommunications", icon: '📱' },
  { id: '4', name: "Computer, Office & Security", icon: '💻' },
  { id: '5', name: "Consumer Electronics", icon: '🎧' },
  { id: '6', name: "Jewelry & Watches", icon: '⌚' },
  { id: '7', name: "Home, Pet & Appliances", icon: '🏠' },
  { id: '8', name: "Bags & Shoes", icon: '👠' },
  { id: '9', name: "Toys, Kids & Babies", icon: '🧸' },
  { id: '10', name: "Outdoor Fun & Sports", icon: '⚽' },
  { id: '11', name: "Beauty, Health & Hair", icon: '💄' },
  { id: '12', name: "Automobiles & Motorcycles", icon: '🚗' },
];

// --- Components ---

const TopBar = () => (
  <div className="hidden md:flex bg-[#f5f5f5] text-[12px] py-1.5 border-bottom border-black/5">
    <div className="w-full px-6 flex justify-between items-center text-[#666]">
      <div className="flex gap-6">
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#FF4747]">
          <Globe size={14} />
          <span>Language</span>
          <ChevronDown size={12} />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#FF4747]">
          <span className="font-medium">USD</span>
          <ChevronDown size={12} />
        </div>
      </div>
      <div className="flex gap-6">
        <span className="cursor-pointer hover:text-[#FF4747]">Help</span>
        <span className="cursor-pointer hover:text-[#FF4747]">Buyer Protection</span>
        <span className="cursor-pointer hover:text-[#FF4747]">App</span>
      </div>
    </div>
  </div>
);

const Header = ({ 
  onMenuClick, 
  onAccountClick, 
  onHomeClick, 
  onCartClick,
  cartCount,
  onSearch
}: { 
  onMenuClick: () => void, 
  onAccountClick: () => void, 
  onHomeClick: () => void, 
  onCartClick: () => void,
  cartCount: number,
  onSearch: (query: string) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
    )}>
      <div className="w-full px-6 flex items-center gap-4 md:gap-8">
        {/* Logo & All Categories */}
        <div className="flex flex-col items-start shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <div className="text-black font-bold text-2xl tracking-tighter flex items-center">
              Shopoora
            </div>
          </div>
          {/* All Categories Button (Desktop Only) */}
          <button 
            onClick={onMenuClick}
            className="hidden md:flex items-center gap-2 text-[13px] font-medium text-gray-700 hover:text-[#FF4747] mt-1 transition-colors group"
          >
            <span>All Categories</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
          <div className="flex items-center bg-[#f2f2f2] rounded-full px-4 py-2 border-2 border-transparent focus-within:border-[#FF4747] focus-within:bg-white transition-all">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search for items..." 
              className="w-full bg-transparent outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-3 text-gray-500 ml-2">
              <Camera size={20} className="cursor-pointer hover:text-[#FF4747]" />
              <Mic size={20} className="hidden sm:block cursor-pointer hover:text-[#FF4747]" />
              <button type="submit" className="hidden md:block bg-[#FF4747] text-white px-6 py-1.5 rounded-full font-medium text-sm -mr-3 hover:bg-[#e63e3e] transition-colors">
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-center cursor-pointer group" onClick={onAccountClick}>
            <User size={24} className="group-hover:text-[#FF4747]" />
            <span className="text-[11px] mt-0.5">Account</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group relative" onClick={onCartClick}>
            <ShoppingCart size={24} className="group-hover:text-[#FF4747]" />
            <span className="text-[11px] mt-0.5">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#FF4747] text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroSlider = ({ onShopNow, slides }: { onShopNow: () => void, slides: { color: string, title: string, sub: string }[] }) => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => setCurrent(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative h-[180px] md:h-[400px] rounded-xl overflow-hidden group touch-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              setCurrent(s => (s - 1 + slides.length) % slides.length);
            } else if (info.offset.x < -100) {
              setCurrent(s => (s + 1) % slides.length);
            }
          }}
          className={cn("absolute inset-0 flex items-center px-8 md:px-20 cursor-grab active:cursor-grabbing", slides[current].color)}
        >
          <div className="text-white max-w-md">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-5xl font-bold mb-2 md:mb-4"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-xl opacity-90 mb-4 md:mb-8"
            >
              {slides[current].sub}
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopNow}
              className="bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              current === i ? "bg-white w-6" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const FlashDeals = ({ products, onAddToCart, onProductClick }: { products: Product[], onAddToCart: (p: Product) => void, onProductClick: (p: Product) => void }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');
  const flashProducts = products.filter(p => p.isFlashDeal).slice(0, 6);

  if (flashProducts.length === 0) return null;

  return (
    <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Clock className="text-[#FF4747]" />
            Flash Deals
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="bg-black text-white px-1.5 py-0.5 rounded text-sm font-bold">{format(timeLeft.h)}</span>
            <span className="font-bold">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded text-sm font-bold">{format(timeLeft.m)}</span>
            <span className="font-bold">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded text-sm font-bold">{format(timeLeft.s)}</span>
          </div>
        </div>
        <button className="text-[#FF4747] font-medium flex items-center hover:underline">
          View all <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {flashProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onClick={onProductClick} />
        ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product, onAddToCart, onClick }: { product: Product, onAddToCart: (p: Product) => void, onClick: (p: Product) => void, key?: React.Key }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onClick(product)}
      className="bg-white rounded-lg overflow-hidden border border-black/5 hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.isChoice && (
          <div className="absolute top-2 left-2 bg-[#FF4747] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            Choice
          </div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-[#FF4747] hover:text-white"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm line-clamp-2 mb-2 text-gray-800 group-hover:text-[#FF4747] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-[#FF4747]">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">{product.rating}</span>
          </div>
        </div>
        {product.isSuperValue && (
          <div className="mt-2 inline-block bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">
            Super Value
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Sidebar = ({ isOpen, onClose, onCategorySelect }: { isOpen: boolean, onClose: () => void, onCategorySelect: (id: string) => void }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[60]"
          />
        )}
      </AnimatePresence>
      <motion.aside 
        initial={{ x: '-100%', opacity: 0 }}
        animate={isOpen ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl shrink-0",
          !isOpen && "pointer-events-none"
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-bold text-lg">Categories</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="py-4 overflow-y-auto h-[calc(100vh-80px)]">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => {
                onCategorySelect(cat.id);
                onClose();
              }}
              className="px-6 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[13px] text-gray-700 group-hover:text-[#FF4747]">{cat.name}</span>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-[#FF4747]" />
            </div>
          ))}
        </div>
      </motion.aside>
    </>
  );
};

const BottomNav = ({ onCategoryClick, onHomeClick, onAccountClick, onCartClick, activePage }: { onCategoryClick: () => void, onHomeClick: () => void, onAccountClick: () => void, onCartClick: () => void, activePage: string }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-center z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
    <div 
      onClick={onHomeClick}
      className={cn("flex flex-col items-center gap-1 flex-1 cursor-pointer", activePage === 'home' ? "text-[#FF4747]" : "text-gray-500")}
    >
      <Home size={20} />
      <span className="text-[10px] font-medium">Home</span>
    </div>
    <div 
      onClick={(e) => {
        e.preventDefault();
        onCategoryClick();
      }}
      className="flex flex-col items-center gap-1 text-gray-500 flex-1 cursor-pointer"
    >
      <LayoutGrid size={20} />
      <span className="text-[10px] font-medium">Category</span>
    </div>
    <div 
      onClick={onCartClick}
      className={cn("flex flex-col items-center gap-1 flex-1 cursor-pointer", activePage === 'cart' ? "text-[#FF4747]" : "text-gray-500")}
    >
      <div className="relative">
        <ShoppingCart size={20} />
        <span className="absolute -top-1.5 -right-2 bg-[#FF4747] text-white text-[9px] font-bold px-1 rounded-full border border-white">
          3
        </span>
      </div>
      <span className="text-[10px] font-medium">Cart</span>
    </div>
    <div 
      onClick={onAccountClick}
      className={cn("flex flex-col items-center gap-1 flex-1 cursor-pointer", activePage === 'account' ? "text-[#FF4747]" : "text-gray-500")}
    >
      <User size={20} />
      <span className="text-[10px] font-medium">Account</span>
    </div>
  </nav>
);

const CartPage = ({ cart, onRemove, onUpdateQuantity, onCheckout }: { cart: (Product & { quantity: number })[], onRemove: (id: number, image: string) => void, onUpdateQuantity: (id: number, image: string, q: number) => void, onCheckout: () => void }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <ShoppingCart size={64} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-sm">Add some items to start shopping!</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-24"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart ({cart.length})</h2>
        <button className="text-sm text-gray-500 hover:text-[#FF4747]">Select all</button>
      </div>

      <div className="space-y-4">
        {cart.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="bg-white rounded-xl p-4 shadow-sm border border-black/5 flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h3>
                </div>
                <button onClick={() => onRemove(item.id, item.image)} className="text-gray-400 hover:text-[#FF4747]">
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[#FF4747] font-bold text-lg">${item.price.toFixed(2)}</div>
                <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 gap-4">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.image, item.quantity - 1)}
                    className="text-gray-400 hover:text-black"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.image, item.quantity + 1)}
                    className="text-gray-400 hover:text-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="fixed bottom-[70px] md:bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 md:relative md:mt-8 md:rounded-xl md:shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border border-gray-300 rounded-full" />
            <span className="text-sm text-gray-600">All</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-[#FF4747] font-bold text-xl">${total.toFixed(2)}</div>
            </div>
            <button 
              onClick={onCheckout}
              className="bg-[#FF4747] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#e63e3e] transition-colors"
            >
              Checkout ({cart.length})
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AuthPage = ({ onLogin, onBack }: { onLogin: (user: any) => void, onBack: () => void }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 15000);

    try {
      if (!supabaseService.isConfigured()) {
        throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables in Settings.');
      }

      console.log(`AuthPage: Starting direct ${mode} for ${email}`);
      
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          console.error('AuthPage: Login error:', error.message);
          throw error;
        }
        
        if (data.session) {
          onLogin(data.user);
        } else {
          throw new Error('Login successful but no session returned. Please check if your email is confirmed.');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            data: { full_name: email.split('@')[0] },
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) {
          console.error('AuthPage: Signup error:', error.message);
          throw error;
        }
        
        if (data.user) {
          if (data.session) {
            // Auto login if confirmation is disabled
            onLogin(data.user);
          } else {
            alert('Registration successful! Please check your email for a confirmation link. If you want to skip this, disable "Confirm email" in your Supabase Auth settings.');
            setMode('login');
          }
        }
      }
    } catch (error: any) {
      console.error('AuthPage: Auth error:', error);
      let msg = error.message || 'Authentication failed';
      
      if (msg === 'Failed to fetch') {
        msg = 'Network error: Could not connect to Supabase. Please check if your VITE_SUPABASE_URL is correct and your Supabase project is active.';
      }

      if (msg.includes('Email not confirmed')) {
        alert('Please check your email and confirm your account. Or disable "Confirm email" in Supabase settings.');
      } else if (msg.includes('Invalid login credentials')) {
        alert('Invalid email or password. Please try again. If you haven\'t registered yet, please use the Register tab.');
      } else {
        alert(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-black/5 mt-10"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{mode === 'login' ? 'Sign In' : 'Register'}</h2>
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex mb-8 bg-gray-100 p-1 rounded-xl">
        <button 
          onClick={() => setMode('login')}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setMode('register')}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Register
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-black/5 focus:border-black transition-all" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-black/5 focus:border-black transition-all" 
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-4 font-bold hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          )}
        </button>

        {loading && (
          <button 
            onClick={() => setLoading(false)}
            className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Taking too long? Click to cancel
          </button>
        )}
        
        {!supabaseService.isConfigured() && (
          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-xs text-red-600 font-medium">
              Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables in Settings.
            </p>
          </div>
        )}

        {window.self !== window.top && (
          <p className="mt-2 text-[10px] text-gray-400 text-center">
            Running in preview mode. If login hangs, please use the "Open in new tab" icon.
          </p>
        )}
        
        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => setMode('register')} className="text-black font-semibold hover:underline">Register now</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode('login')} className="text-black font-semibold hover:underline">Sign in</button></>
          )}
        </p>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Demo Mode Button Removed */}

        <div className="grid grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">G</div>
          </button>
          <button className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <Facebook size={20} className="text-blue-600" />
          </button>
          <button className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <Apple size={20} className="text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }: { order: Order, onClose: () => void, onUpdateStatus: (id: string, status: Order['status']) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Order Details #{order.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-8">
          {/* Customer Info */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{order.customerAddress}, {order.customerCity}, {order.customerCountry} - {order.customerZip}</p>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-bold text-[#FF4747]">${order.total.toFixed(2)}</span>
            </div>
          </section>

          {/* Actions */}
          <section className="flex gap-3 pt-4">
            <button 
              onClick={() => { onUpdateStatus(order.id, 'Approved'); onClose(); }}
              className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all"
            >
              Approve Order
            </button>
            <button 
              onClick={() => { onUpdateStatus(order.id, 'Cancelled'); onClose(); }}
              className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all"
            >
              Cancel Order
            </button>
            <button 
              onClick={() => { onUpdateStatus(order.id, 'Delivered'); onClose(); }}
              className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-black transition-all"
            >
              Mark Delivered
            </button>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPage = ({ products, setProducts, banners, setBanners, orders, setOrders, onBack, isLoadingProducts }: { 
  products: Product[], 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  banners: { color: string, title: string, sub: string }[],
  setBanners: React.Dispatch<React.SetStateAction<{ color: string, title: string, sub: string }[]>>,
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  onBack: () => void,
  isLoadingProducts: boolean
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'content' | 'orders'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isStatsTableMissing, setIsStatsTableMissing] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab === 'overview') {
        try {
          const count = await supabaseService.getVisitorCount();
          setVisitorCount(count);
          // Check if it's a fallback count (this is a bit heuristic)
          // but we can just rely on the error message in console for now.
        } catch (error: any) {
          if (error.message?.includes('42P01') || error.code === '42P01') {
            setIsStatsTableMissing(true);
          }
          console.error('Error fetching visitor count:', error);
        }
      }
    };
    fetchStats();
  }, [activeTab]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setImagePreviews(editingProduct.images || [editingProduct.image]);
    } else {
      setImagePreviews([]);
    }
  }, [editingProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const savedVisitors = localStorage.getItem('visitor_count');
    setVisitorCount(savedVisitors ? parseInt(savedVisitors) : 1250);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'arju') {
      setIsLoggedIn(true);
      // Fetch all orders for admin
      const fetchAllOrders = async () => {
        try {
          const data = await supabaseService.getOrders();
          setOrders(data);
        } catch (error) {
          console.error('Error fetching all orders:', error);
        }
      };
      fetchAllOrders();
    } else {
      alert('Invalid password');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    console.log('Directly deleting product with ID:', productId);
    
    try {
      await supabaseService.deleteProduct(productId);
      
      // Instant UI Removal: Update state immediately
      setProducts(currentProducts => {
        // Use String comparison for robustness with BigInt/Number IDs
        const updated = currentProducts.filter(p => String(p.id) !== String(productId));
        console.log('UI updated. Remaining products:', updated.length);
        return updated;
      });
      
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error('CRITICAL ERROR during delete:', error);
      alert(`Failed to delete product: ${error.message || 'Unknown error'}. Check Supabase RLS policies.`);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('WARNING: Delete ALL products? This cannot be undone.')) return;
    try {
      await supabaseService.clearAllProducts();
      setProducts([]);
      alert('All products deleted successfully');
    } catch (error: any) {
      console.error('Error deleting all products:', error);
      alert('Failed to delete all products: ' + error.message);
    }
  };

  const handleDeleteAllOrders = async () => {
    if (!window.confirm('WARNING: Delete ALL orders? This cannot be undone.')) return;
    try {
      // We can add a clearAllOrders to supabaseService if needed, 
      // but for now we'll just clear the state or add the endpoint
      // Let's add the endpoint to server.ts first
      const response = await fetch('/api/orders', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear orders');
      setOrders([]);
      alert('All orders deleted successfully');
    } catch (error: any) {
      console.error('Error deleting all orders:', error);
      alert('Failed to delete all orders: ' + error.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const priceStr = formData.get('price') as string;
    const image = imagePreviews[0] || formData.get('image') as string;
    const categoryId = formData.get('categoryId') as string;
    const discount = parseInt(formData.get('discount') as string) || 0;
    const description = formData.get('description') as string;
    const isFlashDeal = formData.get('isFlashDeal') === 'on';

    // Error Handling: Check if fields are empty
    if (!title || !priceStr || !image) {
      alert('Please fill in all required fields (Title, Price, and Image)');
      return;
    }

    const price = parseFloat(priceStr);
    setIsSaving(true);

    const productData: Partial<Product> = {
      title,
      price,
      image: imagePreviews[0] || formData.get('image') as string || 'https://picsum.photos/400/400',
      images: imagePreviews.length > 0 ? imagePreviews : [formData.get('image') as string || 'https://picsum.photos/400/400'],
      categoryId,
      discount,
      description,
      isFlashDeal,
    };

    try {
      if (editingProduct) {
        const updatedProduct = { ...editingProduct, ...productData };
        await supabaseService.saveProduct(updatedProduct);
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct as Product : p));
        alert('Product updated successfully!');
      } else {
        const newProductData: Omit<Product, 'id'> = {
          ...productData,
          originalPrice: price * 1.5,
          rating: 4.5,
          soldCount: 0,
          isChoice: false,
          isSuperValue: false,
        } as Omit<Product, 'id'>;
        const savedProduct = await supabaseService.saveProduct(newProductData);
        setProducts(prev => [savedProduct, ...prev]);
        alert('Product added successfully!');
      }
      
      // Clear Form
      form.reset();
      setImagePreviews([]);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await supabaseService.updateOrderStatus(id, status);
      const updated = orders.map(o => String(o.id) === String(id) ? { ...o, status } : o);
      setOrders(updated);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    console.log('Directly deleting order:', id);
    // Removing confirm for testing to see if it's the blocker
    try {
      await supabaseService.deleteOrder(id);
      setOrders(currentOrders => currentOrders.filter(o => String(o.id) !== String(id)));
      alert('Order deleted');
    } catch (error: any) {
      console.error('Error deleting order:', error);
      alert('Error: ' + error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (hint: admin123)" 
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#FF4747]" 
              />
            </div>
            <button className="w-full bg-[#FF4747] text-white font-bold py-4 rounded-full shadow-lg shadow-[#FF4747]/30">
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="text-[#FF4747] font-bold text-xl tracking-tighter">Shopoora Admin</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'products', icon: Package2, label: 'Products' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'content', icon: Layout, label: 'Content' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id ? "bg-[#FF4747] text-white shadow-lg shadow-[#FF4747]/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} />
            Exit Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Eye size={24} /></div>
                  <span className="text-xs font-bold text-green-500">+12%</span>
                </div>
                <div className="text-2xl font-bold">{visitorCount}</div>
                <div className="text-sm text-gray-400">Total Visitors</div>
                {isStatsTableMissing && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg text-[10px] text-red-600 leading-tight">
                    <b>Table Missing:</b> Visitor count will reset on refresh. Create 'site_stats' table in Supabase.
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Package2 size={24} /></div>
                </div>
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-sm text-gray-400">Total Products</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <div className="flex gap-4">
                <button 
                  onClick={handleDeleteAllProducts}
                  className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-100 transition-all"
                >
                  Delete All Products
                </button>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="bg-[#FF4747] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                >
                  <PlusCircle size={18} /> Add New Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-0">
                  <h3 className="font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input name="title" defaultValue={editingProduct?.title} required className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Price ($)</label>
                        <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Discount (%)</label>
                        <input name="discount" type="number" defaultValue={editingProduct?.discount} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Product Images (Multiple)</label>
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                              <img src={preview} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeImagePreview(idx)}
                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 shadow-sm"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Camera size={18} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">Upload Pics</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                          </label>
                          <input 
                            name="image" 
                            placeholder="Or paste URL" 
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-xs" 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                  setImagePreviews(prev => [...prev, val]);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                      <select name="categoryId" defaultValue={editingProduct?.categoryId} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm">
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input type="checkbox" name="isFlashDeal" id="isFlashDeal" defaultChecked={editingProduct?.isFlashDeal} className="w-4 h-4 text-[#FF4747] focus:ring-[#FF4747] border-gray-300 rounded" />
                      <label htmlFor="isFlashDeal" className="text-sm font-medium text-gray-700">Mark as Flash Deal</label>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                      <textarea name="description" defaultValue={editingProduct?.description} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm h-24 resize-none" />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="flex-1 bg-[#FF4747] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingProduct ? 'Update Product' : 'Save Product'
                        )}
                      </button>
                      {editingProduct && (
                        <button type="button" onClick={() => setEditingProduct(null)} className="px-4 bg-gray-100 text-gray-500 font-bold rounded-xl text-sm">Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {isLoadingProducts ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                              Loading products...
                            </div>
                          </td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-gray-400">No products found. Add your first product!</td>
                        </tr>
                      ) : products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-medium line-clamp-1">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#FF4747]">${p.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingProduct(p);
                                }} 
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(p.id);
                                }} 
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                                id={`delete-btn-${p.id}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <button 
                onClick={handleDeleteAllOrders}
                className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-100 transition-all"
              >
                Delete All Orders
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact & Location</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right min-w-[250px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customerName}</span>
                          <span className="text-[10px] text-gray-400">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-medium">{order.customerPhone}</span>
                          <span className="text-gray-400">{order.customerCity}, {order.customerCountry}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                          order.status === 'Processing' ? "bg-blue-100 text-blue-600" :
                          order.status === 'Approved' ? "bg-green-100 text-green-600" :
                          order.status === 'Delivered' ? "bg-gray-100 text-gray-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all whitespace-nowrap"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'Approved')}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                              order.status === 'Approved' ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"
                            )}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                              order.status === 'Cancelled' ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600"
                            )}
                          >
                            Cancel
                          </button>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer flex items-center justify-center"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Homepage Banners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {banners.map((banner, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className={cn("h-32 rounded-xl mb-6 flex items-center justify-center text-white font-bold", banner.color)}>
                    Preview
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Banner Title</label>
                      <input 
                        value={banner.title}
                        onChange={async (e) => {
                          const newBanners = [...banners];
                          newBanners[i].title = e.target.value;
                          setBanners(newBanners);
                        }}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Subtitle</label>
                      <input 
                        value={banner.sub}
                        onChange={async (e) => {
                          const newBanners = [...banners];
                          newBanners[i].sub = e.target.value;
                          setBanners(newBanners);
                        }}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedOrderDetails && (
          <OrderDetailsModal 
            order={selectedOrderDetails} 
            onClose={() => setSelectedOrderDetails(null)} 
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </div>
    </div>
  );
};

const ServicesGrid = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5 mb-6">
    <h3 className="font-bold text-sm mb-4">More Services</h3>
    <div className="grid grid-cols-4 gap-y-6">
      {[
        { icon: History, label: 'History' },
        { icon: MessageCircle, label: 'Help' },
        { icon: Info, label: 'About' },
        { icon: Settings, label: 'Settings' },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors">
            <item.icon size={20} className="text-gray-500 group-hover:text-orange-500" />
          </div>
          <span className="text-[10px] text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const AccountPage = ({ orders, onLogout, user }: { orders: Order[], onLogout: () => void, user: any }) => {
  // Filter orders to only show those belonging to the logged-in user
  // We ensure both UIDs exist and match exactly to prevent seeing other's orders
  // This is the most critical security check for the UI
  const userOrders = orders.filter(o => 
    user?.id && o.userId && o.userId === user.id
  ); 

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-12"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#FF4747] to-[#FF8C47] p-6 md:rounded-2xl text-white mb-6 shadow-lg shadow-orange-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/50 overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold truncate max-w-[200px]">{user?.email || 'User'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full border border-white/30">Verified Member</span>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Simplified Orders List */}
      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">My Orders ({userOrders.length})</h3>
        </div>
        
        {userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-300" size={32} />
            </div>
            <h4 className="text-gray-900 font-bold mb-1">No orders yet</h4>
            <p className="text-gray-500 text-sm">Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-black/5 hover:border-orange-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono mb-1">ORDER #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'Approved' ? 'bg-green-50 text-green-600' :
                    order.status === 'Delivered' ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img 
                        key={idx}
                        src={item.image} 
                        alt="" 
                        className="w-8 h-8 rounded-lg border-2 border-white object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {order.items.map(i => i.title).join(', ')}
                    </p>
                    <p className="text-[10px] text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <p className="text-sm font-bold text-[#FF4747]">৳{order.total.toLocaleString()}</p>
                  <button className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-gray-600">
                    Details <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ServicesGrid />

      {/* Settings & Help List (Desktop Style) */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-black/5">
        {[
          { icon: Settings, label: 'Settings', extra: 'Account, Security' },
          { icon: HelpCircle, label: 'Help Center', extra: 'FAQs, Contact' },
          { icon: MessageSquare, label: 'Suggest', extra: 'Feedback' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-black/5 last:border-0 group">
            <div className="flex items-center gap-4">
              <item.icon size={20} className="text-gray-500 group-hover:text-[#FF4747]" />
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[11px] text-gray-400">{item.extra}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }: { product: Product, onClose: () => void, onAddToCart: (p: Product) => void, onBuyNow: (p: Product) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white w-full h-full md:h-[90vh] md:max-w-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full transition-all"
        >
          <X size={24} className="text-gray-800" />
        </button>

        {/* Unified Scrollable Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col min-h-full">
            {/* Image Section - Slider */}
            <div className="w-full bg-white flex items-center justify-center relative shrink-0 border-b border-gray-100 group">
              <div className="relative w-full aspect-square md:aspect-auto md:h-[60vh] overflow-hidden touch-none">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={`${product.title} - ${currentImageIndex + 1}`} 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 50) {
                        prevImage();
                      } else if (info.offset.x < -50) {
                        nextImage();
                      }
                    }}
                    className="w-full h-full object-contain p-4 md:p-8 cursor-grab active:cursor-grabbing"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    {/* Thumbnails moved outside the absolute container to be below the image */}
                  </>
                )}
              </div>
              
              {product.isChoice && (
                <div className="absolute top-6 left-6 bg-[#FF4747] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Choice
                </div>
              )}
            </div>

            {/* Dynamic Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar bg-white border-b border-gray-50">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200",
                      currentImageIndex === idx 
                        ? "border-[#FF4747] shadow-md scale-105" 
                        : "border-transparent hover:border-gray-200 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {currentImageIndex === idx && (
                      <div className="absolute inset-0 bg-[#FF4747]/5" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Content Section - Now below the image for all screens */}
            <div className="flex-1 p-6 md:p-10 md:max-w-4xl md:mx-auto w-full space-y-8 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#FF4747] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Choice</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={cn("fill-current", i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-400">(1.2k Reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-[#FF4747]">${product.price.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-[#FF4747]/10 text-[#FF4747] text-sm font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-1 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Truck className="text-[#FF4747] mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">To Bangladesh via Shopoora Standard Shipping</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-[#FF4747] mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Delivery: Within 7 Days</p>
                    <p className="text-xs text-gray-500">Tracking available</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Description</h4>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description || `Experience the ultimate in quality and design with our latest ${product.title}. Crafted with precision and built to last, this product combines style with functionality. Perfect for everyday use or as a special gift.`}
                </div>
                {!product.description && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>High-quality materials for durability</li>
                    <li>Ergonomic design for maximum comfort</li>
                    <li>Advanced technology integration</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t bg-white flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0">
          <button 
            onClick={() => {
              onAddToCart({ ...product, image: images[currentImageIndex] });
              onClose();
            }}
            className="flex-1 py-4 border-2 border-[#FF4747] text-[#FF4747] font-bold rounded-full hover:bg-[#FF4747]/5 transition-all active:scale-95"
          >
            Add to Cart
          </button>
          <button 
            onClick={() => {
              onBuyNow({ ...product, image: images[currentImageIndex] });
              onClose();
            }}
            className="flex-1 py-4 bg-[#FF4747] text-white font-bold rounded-full hover:bg-[#e63e3e] transition-all shadow-lg shadow-[#FF4747]/30 active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CheckoutPage = ({ items, onBack, onOrderComplete, onUpdateQuantity, user }: { items: (Product & { quantity: number })[], onBack: () => void, onOrderComplete: (order: any) => void, onUpdateQuantity: (id: number, image: string, q: number) => void, user: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = [
    "Bangladesh", "India", "Pakistan", "United States", "United Kingdom", 
    "Canada", "Australia", "United Arab Emirates", "Saudi Arabia", "Germany", 
    "France", "Italy", "Japan", "China", "Brazil", "South Africa", 
    "Singapore", "Malaysia", "Thailand", "Turkey"
  ];

  const filteredCountries = countries.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping as per mock
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const newOrder = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...items],
      total,
      status: 'Processing',
      date: new Date().toISOString(),
      customerEmail: formData.get('email') as string || user?.email || '',
      customerName: formData.get('fullName') as string || user?.user_metadata?.full_name || 'Customer',
      customerPhone: formData.get('phone') as string || '',
      customerAddress: formData.get('address') as string || '',
      customerCity: formData.get('city') as string || '',
      customerCountry: selectedCountry,
      customerZip: formData.get('zip') as string || '',
      userId: user?.id,
    };
    onOrderComplete(newOrder);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto pb-20 px-4"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Shipping Form */}
        <div className="flex-1 space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Truck size={20} className="text-[#FF4747]" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input name="fullName" required type="text" placeholder="Enter your full name" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input name="phone" required type="tel" placeholder="Enter phone number" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input name="email" required type="email" defaultValue={user?.email || ''} placeholder="example@gmail.com" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Shipping Address</label>
                <input name="address" required type="text" placeholder="Street address" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all mb-2" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                <input name="city" required type="text" placeholder="City" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Zip/Postal Code</label>
                <input name="zip" required type="text" placeholder="Zip code" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all" />
              </div>
              <div className="space-y-1 md:col-span-2 relative">
                <label className="text-xs font-bold text-gray-500 uppercase">Country/Region</label>
                <div 
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF4747] transition-all cursor-pointer flex justify-between items-center"
                >
                  <span className="text-gray-800">{selectedCountry}</span>
                  <ChevronDown size={18} className={cn("text-gray-400 transition-transform", isCountryDropdownOpen && "rotate-180")} />
                </div>

                {isCountryDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-50">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Search country..." 
                          className="w-full bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#FF4747]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-2">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map(country => (
                          <div 
                            key={country}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCountry(country);
                              setIsCountryDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            className={cn(
                              "px-4 py-2 text-sm cursor-pointer transition-colors",
                              selectedCountry === country ? "bg-red-50 text-[#FF4747] font-bold" : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {country}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-sm text-gray-400 text-center">No results found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-[400px] space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 sticky top-24">
            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#FF4747]">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-black/5">
                        <button 
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.image, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-[#FF4747] transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.image, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-[#FF4747] transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3">
                <span>Total</span>
                <span className="text-[#FF4747]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#FF4747] text-white font-bold py-4 rounded-full mt-8 hover:bg-[#e63e3e] transition-all shadow-lg shadow-[#FF4747]/30 active:scale-95"
            >
              Place Order
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-4 px-4">
              By placing your order, you agree to Shopoora's Conditions of Use and Privacy Notice.
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'account' | 'cart' | 'checkout' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cached_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(products.length === 0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [banners, setBanners] = useState<{ color: string, title: string, sub: string }[]>(() => {
    const saved = localStorage.getItem('local_banners');
    return saved ? JSON.parse(saved) : [
      { color: 'bg-orange-500', title: 'Free Shipping', sub: 'Shop Now' },
      { color: 'bg-red-500', title: 'New Tech Arrivals', sub: 'Explore the future' },
      { color: 'bg-indigo-600', title: 'Home Essentials', sub: 'Comfort for your space' },
    ];
  });

  // Persist banners to localStorage
  useEffect(() => {
    localStorage.setItem('local_banners', JSON.stringify(banners));
  }, [banners]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<(Product & { quantity: number })[]>([]);
  
  const productsRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  // Fetch products from Supabase
  useEffect(() => {
    const trackVisit = async () => {
      if (hasTracked.current) return;
      hasTracked.current = true;
      try {
        await supabaseService.incrementVisitorCount();
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };
    trackVisit();

    const fetchProducts = async (isInitial = true) => {
      if (isInitial) {
        if (products.length === 0) setIsLoadingProducts(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const limit = 10;
        const offset = isInitial ? 0 : products.length;
        const data = await supabaseService.getProducts(limit, offset);
        
        if (isInitial) {
          setProducts(data);
          localStorage.setItem('cached_products', JSON.stringify(data));
          setHasMore(data.length === limit);
        } else {
          setProducts(prev => {
            const newProducts = [...prev, ...data];
            // Update cache with all products for now, or just the first page
            localStorage.setItem('cached_products', JSON.stringify(newProducts.slice(0, 10)));
            return newProducts;
          });
          setHasMore(data.length === limit);
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
        setIsFetchingMore(false);
      }
    };
    fetchProducts(true);
  }, []);

  const handleViewMore = async () => {
    if (isFetchingMore || !hasMore) return;
    
    setIsFetchingMore(true);
    try {
      const limit = 20; // Load more in larger chunks
      const offset = products.length;
      const data = await supabaseService.getProducts(limit, offset);
      setProducts(prev => [...prev, ...data]);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error fetching more products:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Centralized reactive order fetching
  useEffect(() => {
    const fetchOrders = async () => {
      if (isLoggedIn && user) {
        try {
          const data = await supabaseService.getOrders(user.id);
          setOrders(data);
        } catch (error: any) {
          console.error('Error fetching orders:', error);
          if (error.message === 'Failed to fetch') {
            console.warn('Network error: Supabase connection failed.');
          }
        }
      } else {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [isLoggedIn, user]);

  // Initialize data
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Update visitor count
    const savedVisitors = localStorage.getItem('visitor_count');
    const count = savedVisitors ? parseInt(savedVisitors) + 1 : 1251;
    localStorage.setItem('visitor_count', count.toString());

    // Check for admin hash
    if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.image === product.image);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.image === product.image) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number, image: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.image === image)));
  };

  const handleUpdateQuantity = (id: number, image: string, q: number) => {
    if (q < 1) return;
    setCart(prev => prev.map(item => (item.id === id && item.image === image) ? { ...item, quantity: q } : item));
  };

  const handleUpdateCheckoutQuantity = (id: number, image: string, q: number) => {
    if (q < 1) return;
    setCheckoutItems(prev => prev.map(item => (item.id === id && item.image === image) ? { ...item, quantity: q } : item));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setCurrentPage('home');
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setSearchQuery('');
    setCurrentPage('home');
  };

  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn) {
      setCurrentPage('account');
      return;
    }
    setCheckoutItems([{ ...product, quantity: 1 }]);
    setCurrentPage('checkout');
  };

  const handleOrderComplete = async (order: Order) => {
    try {
      const savedOrder = await supabaseService.createOrder(order);
      const updatedOrders = [savedOrder, ...orders];
      setOrders(updatedOrders);
      setCart([]);
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        setCurrentPage('account');
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      setCurrentPage('account');
      return;
    }
    setCheckoutItems([...cart]);
    setCurrentPage('checkout');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginSuccess = async (user: any) => {
    setIsLoggedIn(true);
    setUser(user);
    
    // If we have items ready for checkout, go there
    if (checkoutItems.length > 0) {
      setCurrentPage('checkout');
    } else {
      setCurrentPage('home');
    }
    
    // Clear other transient UI states
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear session-specific states
    setCart([]);
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedProduct(null);
    setCheckoutItems([]);
    
    // Clear session storage
    sessionStorage.clear();

    console.log('User logged out and all states cleared');
    window.location.replace('/');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f2f2f2] font-sans overflow-hidden">
      {!supabaseService.isConfigured() && (
        <div className="bg-amber-500 text-white text-[10px] py-1 px-4 text-center font-medium z-[300] flex items-center justify-center gap-2">
          <Info size={12} />
          <span>Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.</span>
        </div>
      )}
      <AnimatePresence>
        {showThankYou && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-200"
            >
              <Package size={48} />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Thank You for Your Order!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 max-w-xs"
            >
              Your order has been placed successfully. You can track its status in your account.
            </motion.p>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 2.5 }}
              className="w-48 h-1 bg-green-500 rounded-full mt-8 origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header Area */}
      <div className="shrink-0 z-50">
        <TopBar />
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onAccountClick={() => setCurrentPage('account')}
          onHomeClick={() => {
            setCurrentPage('home');
            setSearchQuery('');
            setSelectedCategory(null);
          }}
          onCartClick={() => setCurrentPage('cart')}
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onSearch={handleSearch}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <main key={user?.id || 'guest'} className="w-full px-4 md:px-6 py-4 md:py-8">
          <div className="flex flex-col">
            {/* Sidebar / Mega Menu (Mobile only) */}
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
              onCategorySelect={handleCategorySelect}
            />

            {/* Main Content */}
            <div className="space-y-8">
              {currentPage === 'home' ? (
                <>
                  {!searchQuery && !selectedCategory && <HeroSlider onShopNow={scrollToProducts} slides={banners} />}
                  
                  <div ref={productsRef}>
                    {isLoadingProducts ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#FF4747] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 animate-pulse">Loading products...</p>
                      </div>
                    ) : (searchQuery || selectedCategory) ? (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold">
                          {searchQuery ? `Search results for "${searchQuery}"` : 
                           `Category: ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
                        </h2>
                        <button 
                          onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                          className="text-sm text-[#FF4747] hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <FlashDeals products={products} onAddToCart={handleAddToCart} onProductClick={setSelectedProduct} />
                    )}
                  </div>

                  <section>
                    <h2 className="text-xl md:text-2xl font-bold mb-6">
                      {searchQuery || selectedCategory ? 'Found Items' : 'More to Love'}
                    </h2>
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredProducts.map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            onClick={setSelectedProduct}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 text-gray-500">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No products found matching your criteria.</p>
                      </div>
                    )}
                    {/* View More Button */}
                    {!searchQuery && !selectedCategory && hasMore && (
                      <div className="py-12 flex flex-col items-center gap-4">
                        {isFetchingMore ? (
                          <div className="w-8 h-8 border-4 border-[#FF4747] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <button 
                            onClick={handleViewMore}
                            className="group flex flex-col items-center gap-2 transition-all active:scale-95"
                          >
                            <span className="text-sm font-bold text-gray-500 group-hover:text-[#FF4747]">View More</span>
                            <div className="w-10 h-10 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#FF4747] group-hover:border-[#FF4747]/20 transition-all">
                              <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </section>
                </>
              ) : currentPage === 'account' ? (
                isLoggedIn ? (
                  <div key={user?.id || 'account'}>
                    <AccountPage orders={orders} onLogout={handleLogout} user={user} />
                  </div>
                ) : (
                  <div key="auth">
                    <AuthPage onLogin={handleLoginSuccess} onBack={() => setCurrentPage('home')} />
                  </div>
                )
              ) : currentPage === 'admin' ? (
                <div key="admin">
                  <AdminPage 
                    products={products} 
                    setProducts={setProducts} 
                    banners={banners} 
                    setBanners={setBanners} 
                    orders={orders}
                    setOrders={setOrders}
                    onBack={() => setCurrentPage('home')}
                    isLoadingProducts={isLoadingProducts}
                  />
                </div>
              ) : currentPage === 'cart' ? (
                <CartPage 
                  cart={cart} 
                  onRemove={handleRemoveFromCart} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onCheckout={handleCartCheckout}
                />
              ) : (
                isLoggedIn ? (
                  <CheckoutPage 
                    items={checkoutItems} 
                    onBack={() => setCurrentPage('cart')} 
                    onOrderComplete={handleOrderComplete}
                    onUpdateQuantity={handleUpdateCheckoutQuantity}
                    user={user}
                  />
                ) : (
                  <AuthPage onLogin={handleLoginSuccess} onBack={() => setCurrentPage('home')} />
                )
              )
              }
            </div>
          </div>
        </main>
        
        {/* Footer (Desktop) */}
        {currentPage === 'home' && (
          <footer className="hidden md:block bg-white border-t border-black/5 mt-12 py-12">
            <div className="w-full px-6">
              <div className="flex flex-col items-center mb-12">
                <div className="text-center">
                  <h4 className="font-bold mb-4">Customer Service</h4>
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li>Help Center</li>
                    <li>Transaction Services Agreement</li>
                    <li>Take our feedback survey</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-8 text-center text-xs text-gray-400">
                <p>© 2026 Shopoora. All rights reserved.</p>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className="mt-2 text-[10px] text-gray-200 hover:text-gray-400 transition-colors"
                >
                  Admin Access
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Fixed Bottom Nav Area */}
      <div className="shrink-0 md:hidden z-50">
        <BottomNav 
          onCategoryClick={() => setIsSidebarOpen(true)} 
          onHomeClick={() => {
            setCurrentPage('home');
            setSearchQuery('');
            setSelectedCategory(null);
          }}
          onAccountClick={() => setCurrentPage('account')}
          onCartClick={() => setCurrentPage('cart')}
          activePage={currentPage}
        />
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

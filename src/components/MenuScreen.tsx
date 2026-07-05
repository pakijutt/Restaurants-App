import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data';
import { Search, Flame, Timer, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MenuScreen: React.FC = () => {
  const { addToCart, products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('burgers');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [timerCount, setTimerCount] = useState(899); // 14 mins 59 secs
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount((prev) => (prev > 0 ? prev - 1 : 899));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddWithFeedback = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    addToCart(prod, 1);
    setAddedItems((prev) => ({ ...prev, [productId]: true }));
    setToastMessage(`${prod.name} added to your cart!`);

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [productId]: false }));
    }, 2000);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div className="pt-2 pb-24 px-4 space-y-6 max-w-xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-zinc-100 text-zinc-950 py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 justify-center font-bold border border-zinc-200"
          >
            <Check className="w-5 h-5 shrink-0 text-zinc-950" />
            <span className="font-sans text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your cravings..."
          className="w-full h-14 bg-[#121214] border border-zinc-800/50 rounded-xl pl-12 pr-4 focus:ring-1 focus:ring-zinc-700/50 focus:outline-none text-zinc-100 font-sans text-sm placeholder:text-zinc-500 transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-6 py-2.5 rounded-full font-sans font-bold text-xs flex items-center gap-2 transition-all border ${
            selectedCategory === 'all'
              ? 'bg-zinc-100 text-zinc-950 border-zinc-200 shadow-md'
              : 'bg-[#121214] text-zinc-400 border-zinc-800/50 hover:bg-zinc-800/50'
          }`}
        >
          <span>🍽️</span> All Menu
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-6 py-2.5 rounded-full font-sans font-bold text-xs flex items-center gap-2 transition-all border ${
              selectedCategory === cat.id
                ? 'bg-zinc-100 text-zinc-950 border-zinc-200 shadow-md'
                : 'bg-[#121214] text-zinc-400 border-zinc-800/50 hover:bg-zinc-800/50'
            }`}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-light italic text-zinc-100">
          {selectedCategory === 'all' ? 'All Cravings' : `${selectedCategory} menu`}
        </h2>
        <div className="flex items-center gap-1.5 text-zinc-400 font-sans font-bold text-[11px] uppercase tracking-wider">
          <Timer className="w-4 h-4" />
          <span>FASTEST DELIVERY</span>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const isAdded = addedItems[p.id];
            return (
              <motion.div
                key={p.id}
                layout
                className="relative bg-[#121214] rounded-2xl overflow-hidden border border-zinc-800/50 shadow-xl flex flex-col group hover:border-zinc-700/50 transition-colors"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative bg-zinc-900">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  {p.badgeText && (
                    <div className="absolute top-3 left-3 bg-zinc-800/90 text-zinc-100 border border-zinc-700/30 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-md">
                      {p.badgeText}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-sans font-bold text-sm text-zinc-100 leading-tight">
                        {p.name}
                      </h3>
                      <p className="font-sans text-[11px] text-zinc-400 leading-normal mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <span className="font-sans font-black text-sm text-zinc-100 shrink-0">
                      Rs. {p.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddWithFeedback(p.id)}
                    className={`w-full py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider active:scale-[0.97] transition-all flex items-center justify-center gap-2 border ${
                      isAdded
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-700/30'
                        : 'bg-zinc-100 hover:bg-white text-zinc-950 border-transparent shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-zinc-100" />
                        ADDED
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-zinc-950" />
                        ADD TO CART
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-500 font-medium text-sm">
            No cravings match your criteria. Let's search for something else!
          </div>
        )}
      </div>

      {/* Flash Deal Section */}
      <section className="pt-4">
        <div className="bg-[#121214] rounded-2xl p-6 border border-zinc-800/50 relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <span className="text-zinc-400 font-sans font-bold text-[11px] uppercase tracking-widest block mb-1">
                Flash Combo
              </span>
              <h3 className="font-serif text-xl text-zinc-100 italic">
                Midnight Combo
              </h3>
              <p className="text-zinc-400 font-sans text-xs mt-0.5">
                2 Burgers + 1 Drink + Fries
              </p>
            </div>
            <div className="text-right">
              <div className="font-sans text-lg text-zinc-100 font-bold tabular-nums tracking-wide">
                {formatTimer(timerCount)}
              </div>
              <span className="text-zinc-500 text-[10px] uppercase font-extrabold tracking-widest block">
                Hurry Up!
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-end relative z-10">
            <div>
              <span className="text-zinc-500 line-through text-xs font-medium">
                Rs. 1200
              </span>
              <div className="text-zinc-100 font-sans font-black text-xl">
                Rs. 799
              </div>
            </div>
            <button
              onClick={() => {
                const zinger = products.find((p) => p.id === 'classic-zinger') || products[0];
                addToCart({
                  ...zinger,
                  name: 'Midnight Combo',
                  description: '2 Burgers + 1 Drink + Fries',
                  price: 799,
                }, 1, 'Midnight Special');
                setToastMessage('Midnight Combo claimed and added to cart!');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg"
            >
              Claim Now
            </button>
          </div>

          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-zinc-800/10 opacity-10 blur-3xl rounded-full" />
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, FLASH_DEALS } from '../data';
import { Timer, Heart, Plus, PhoneCall, Check, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { addToCart, setActiveTab, cart, products } = useApp();
  const [countdown, setCountdown] = useState(599); // 9 mins 59 secs
  const [favorites, setFavorites] = useState<string[]>(['classic-zinger']);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const triggerToast = (text: string) => {
    setShowToast(text);
    setTimeout(() => setShowToast(null), 2500);
  };

  const popularProducts = products.filter((p) => p.isBestSeller || p.isSizzling).slice(0, 2);

  return (
    <div className="pt-2 pb-24 px-4 space-y-8 max-w-xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-zinc-100 text-zinc-950 py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 justify-center font-bold border border-zinc-200"
          >
            <Check className="w-5 h-5 shrink-0 text-zinc-950" />
            <span className="font-sans text-sm">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setActiveTab('menu')}
        className="relative h-64 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group active:scale-[0.99] transition-transform border border-zinc-800/50"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3lvpO7VA2Px24Ypr-xSbOHMPm9fYZwatW7TJisZhnkPBj2fDuU7YttzToMeER-8YBiUKoCQDauMLVxhUGGzJwgCelkkZvD35REefWpWu1IZ7n80elAte7Z_q5lFEQPPN3_bGfW6zIr7JzXy-QF2z8Osc6pSYGK5i7MiILIbW9UXaTWcIdo8SpxH-hGnvcAgWdssijy09tQt29scV5a3LeUHf-QfIs-b1fiaVlyDKEi98MdjtoSO_y"
          alt="Fresh taste. Crispy chicken. Delicious pizza."
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mb-2.5 block">Featured Culinary Series</span>
          <h1 className="font-serif text-3.5xl md:text-4xl text-zinc-100 leading-none italic font-light mb-1">
            Fresh Taste.<br />Crispy Chicken.<br />Delicious Pizza.
          </h1>
          <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-3.5 inline-block border-b border-zinc-700/50 pb-0.5 hover:text-zinc-100 transition-colors">
            Tap to Explore Menu →
          </span>
        </div>
      </motion.section>

      {/* Category Horizontal Scroll */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-[0.25em]">
            Categories
          </h2>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab('menu')}
              className="flex flex-col items-center gap-2 flex-shrink-0 snap-start active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-[#121214] hover:bg-zinc-800/80 border border-zinc-800/50 rounded-2xl flex items-center justify-center shadow-lg transition-colors">
                <span className="text-3xl select-none" role="img" aria-label={cat.label}>
                  {cat.emoji}
                </span>
              </div>
              <span className="font-sans font-bold text-[11px] text-zinc-400">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Active Deals Carousel / Flash Deals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-light italic text-zinc-100">
            Flash Drops
          </h2>
          <div className="bg-[#121214] text-zinc-300 border border-zinc-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
            <Timer className="w-4 h-4 text-zinc-400" />
            <span className="font-sans text-xs font-bold tracking-wider tabular-nums">
              {formatTime(countdown)}
            </span>
          </div>
        </div>

        {FLASH_DEALS.map((deal) => (
          <div
            key={deal.id}
            onClick={() => {
              const product = products.find((p) => p.id === 'classic-zinger') || products[0];
              addToCart({
                ...product,
                name: 'Mega Saver Bundle',
                description: '2 Large Pizzas + 4 Burgers + 1.5L Coke',
                price: deal.price,
              }, 1, 'Standard Family Combo');
              triggerToast('Mega Saver Bundle added to cart!');
            }}
            className="relative h-52 rounded-2xl overflow-hidden group shadow-xl border border-zinc-800/50 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/30 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="bg-zinc-100 text-zinc-950 w-fit px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                {deal.badge}
              </span>
              <h3 className="font-serif text-xl text-zinc-100 leading-none mb-1">
                {deal.title}
              </h3>
              <p className="font-sans text-[11px] text-zinc-400 font-medium mb-3">
                {deal.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-sans font-extrabold text-lg text-zinc-100">
                  Rs. {deal.price}
                </span>
                <span className="font-sans text-xs text-zinc-500 line-through">
                  Rs. {deal.oldPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Popular Items Section */}
      <section className="space-y-4">
        <h2 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-[0.25em]">
          Popular Deliveries
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {popularProducts.map((p) => {
            const isFav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                className="bg-[#121214] rounded-2xl overflow-hidden border border-zinc-800/50 flex flex-col group hover:border-zinc-700/50 transition-all shadow-lg active:scale-[0.99]"
              >
                {/* Image Wrap */}
                <div className="relative h-32 overflow-hidden bg-zinc-900">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <button
                    onClick={(e) => handleFavorite(p.id, e)}
                    className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full p-1.5 hover:bg-black/60 text-zinc-200 active:scale-90 transition-transform"
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-zinc-100 text-zinc-100' : 'text-zinc-400'}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="bg-zinc-800/90 text-zinc-200 border border-zinc-700/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      {p.isBestSeller ? 'Best Seller' : 'Sizzling'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-sm text-zinc-100 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="font-sans text-[11px] text-zinc-400 font-normal line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-sans font-extrabold text-zinc-100 text-sm">
                      Rs. {p.price}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        triggerToast(`${p.name} added to cart!`);
                      }}
                      className="w-8 h-8 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"
                      aria-label="Add to cart"
                    >
                      <Plus className="w-4 h-4 text-zinc-950" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Support Button */}
      <button
        onClick={() => setShowPhoneModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 hover:scale-105 transition-all border border-zinc-200"
        aria-label="Call Zinger Plus Support"
      >
        <PhoneCall className="w-5 h-5 animate-pulse text-zinc-950" />
      </button>

      {/* Phone Callback Dialog Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhoneModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-6 shadow-2xl z-10 max-w-sm w-full text-center space-y-4 relative"
            >
              <div className="w-16 h-16 bg-zinc-800/40 border border-zinc-700/50 text-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-zinc-100 italic">
                Catering support
              </h3>
              <p className="text-zinc-400 text-xs">
                Need customized group dining packages or instant catering assistance? Call our central Pir Mahal customer service line now.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:+1234567890"
                  onClick={() => setShowPhoneModal(false)}
                  className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold font-sans text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <PhoneCall className="w-4 h-4 text-zinc-950" />
                  +1 (234) 567-890
                </a>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl font-semibold font-sans text-xs active:scale-95 transition-all border border-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { Flame, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DealsScreen: React.FC = () => {
  const { addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Weekend Countdown State: 8 Hours, 42 Minutes, 15 Seconds starting point
  const [h, setH] = useState(8);
  const [m, setM] = useState(42);
  const [s, setS] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setS((prev) => {
        if (prev > 0) return prev - 1;
        setM((prevM) => {
          if (prevM > 0) return prevM - 1;
          setH((prevH) => {
            if (prevH > 0) return prevH - 1;
            return 8; // Reset
          });
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (text: string) => {
    setShowToast(text);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleClaim = (dealName: string, price: number, details: string) => {
    const defaultProduct = PRODUCTS[0];
    addToCart({
      ...defaultProduct,
      id: `${dealName.toLowerCase().replace(/\s+/g, '-')}`,
      name: dealName,
      price: price,
      description: details,
    }, 1, 'Hot Deal Bundle');
    triggerToast(`Congratulations! ${dealName} claimed successfully!`);
  };

  return (
    <div className="pt-2 pb-24 px-4 space-y-6 max-w-xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-zinc-100 text-zinc-950 py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 justify-center font-bold border border-zinc-200"
          >
            <Check className="w-5 h-5 shrink-0 text-zinc-950" />
            <span className="font-sans text-sm">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hot Deals Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light italic text-zinc-100">
          Hot Deals
        </h1>
        <div className="flex items-center gap-1.5 bg-[#121214] px-3.5 py-1.5 rounded-full border border-zinc-800/50">
          <Flame className="w-4 h-4 text-zinc-400" />
          <span className="font-sans font-bold text-[10px] text-zinc-400 uppercase tracking-widest">
            SIZZLING
          </span>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {[
          { id: 'all', emoji: '🔥', label: 'All Deals' },
          { id: 'combos', emoji: '🍔', label: 'Combos' },
          { id: 'sides', emoji: '🍟', label: 'Sides' },
          { id: 'drinks', emoji: '🥤', label: 'Drinks' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveCategory(chip.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-sans font-bold text-xs flex items-center gap-2 transition-all border ${
              activeCategory === chip.id
                ? 'bg-zinc-100 text-zinc-950 border-zinc-200 shadow-md'
                : 'bg-[#121214] text-zinc-400 border-zinc-800/50 hover:bg-[#1f1f23]'
            }`}
          >
            <span>{chip.emoji}</span> {chip.label}
          </button>
        ))}
      </div>

      {/* Deals Stack */}
      <div className="space-y-6">
        {/* Deal 1: Family Deal */}
        {['all', 'combos'].includes(activeCategory) && (
          <div className="group bg-[#121214] rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all shadow-xl">
            <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbLb3aBoyP-x3ERfuajQ_UQrhFJhoyW_9vqNxbBjRBZ9JB9RfZJWYITSmrQw2AseqE18f03RP85DLrYbLp8M4NTAcFL0_Sd_1CVNXyVkmy5u4QHUFn_rJ1OaNyB42yDemZX5Pfn-V5STeDEoCtbLm0H77sGS0kHnljLq3iNI9dpqbaUJ8IrfxD475oQYbQttccDfhCS1rWBImRFPB3JZuzvY3S7Dbm7A7I5H4gGo1nN6ZUXhyHGtlI"
                alt="Family Deal Feast"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 brightness-90"
              />
              <span className="absolute top-4 left-4 z-20 bg-zinc-800/95 text-zinc-100 border border-zinc-700/30 font-sans font-bold text-xs px-3 py-1.5 rounded-lg shadow-md">
                30% OFF
              </span>
            </div>
            <div className="p-5 relative z-20 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="font-serif text-lg text-zinc-100 italic">
                  Family Deal
                </h2>
                <span className="font-sans font-extrabold text-sm text-zinc-100">
                  Rs. 1,200
                </span>
              </div>
              <p className="font-sans text-xs text-zinc-400 leading-normal font-medium">
                4 Classic Zingers + 2 Large Fries + 10 Nuggets + 1.5L Beverage. Perfect for the whole squad.
              </p>
              <button
                onClick={() => handleClaim('Family Deal Feast', 1200, '4 Classic Zingers + 2 Large Fries + 10 Nuggets + 1.5L Beverage')}
                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-sans font-bold text-xs py-3 rounded-xl uppercase tracking-wider active:scale-[0.98] transition-all shadow-md"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        )}

        {/* Deal 2: Student Deal */}
        {['all', 'combos'].includes(activeCategory) && (
          <div className="group bg-[#121214] rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all shadow-xl">
            <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq02VOGI5ZINHbTopZWgK1jh7pkeju6tDNBGHakuOVTOdNcN-_vleYGvOf21fa59hclrTq-Pq_pUs2xpvKPC3_b0m8j1uOZeNM3DOFTaGZGcvOLEzo2xqUviqklE_vpq7k3c8iXnhc4rgnIbCG9LzdZ4e0GhSLQfh5L52T6_x216JuXQTMkbLNlbuHfh_EBt9QEvVH5NLHxq_MqOaURN0U4u1kFLPs29mL4NI2cuxaA12Enmi_Yun7"
                alt="Student Deal"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 brightness-90"
              />
              <span className="absolute top-4 left-4 z-20 bg-zinc-800/95 text-zinc-100 border border-zinc-700/30 font-sans font-bold text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            </div>
            <div className="p-5 relative z-20 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="font-serif text-lg text-zinc-100 italic">
                  Student Deal
                </h2>
                <span className="font-sans font-extrabold text-sm text-zinc-100">
                  Rs. 350
                </span>
              </div>
              <p className="font-sans text-xs text-zinc-400 leading-normal font-medium">
                The ultimate study fuel: 1 Zinger Burger + Regular Fries. Show ID for extra sauce!
              </p>
              <button
                onClick={() => handleClaim('Student Zinger Combo', 350, '1 Zinger + Regular Fries')}
                className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 font-sans font-bold text-xs py-3 rounded-xl uppercase tracking-wider active:scale-[0.98] transition-all"
              >
                QUICK ADD
              </button>
            </div>
          </div>
        )}

        {/* Deal 3: Weekend Deal with Clock Countdown */}
        {['all', 'combos'].includes(activeCategory) && (
          <div className="group bg-[#121214] rounded-xl overflow-hidden border border-zinc-800/50 shadow-2xl">
            <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-black/40 to-transparent z-10" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlmmDFl-osSg-nO-nmwe8HzU1AT5HfLBDl7MJEkGI0TtKOhVTFQ29qrobQTTcYGakeWD8xx-lB53hYmXdSf_yhoYbCaGGo46RVlLI6VJdP13vHlFEneavx5G7KUedte2tJk4UzIvrBfAaoe3H6_mWO2ULIiimSgrYXaSDJwwJ3WFxG1R_ktWgnxjtMW8d54Z7Kv7Tu_KADEuXCDlQDzkt6PhF6y7HGL9XOXzxZQGhLaBNMRm70B8ez"
                alt="BOGO Zinger Special"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-95"
              />

              {/* Countdown Board */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
                <div className="bg-black/90 backdrop-blur-md border border-zinc-800 p-2 rounded-xl flex gap-3 text-zinc-300 shadow-xl">
                  <div className="text-center min-w-[28px]">
                    <span className="font-sans text-lg block font-extrabold leading-none text-zinc-100">
                      {h.toString().padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[8px] font-bold uppercase tracking-wider block mt-1 text-zinc-500">
                      Hrs
                    </span>
                  </div>
                  <span className="font-bold self-center text-zinc-700">:</span>
                  <div className="text-center min-w-[28px]">
                    <span className="font-sans text-lg block font-extrabold leading-none text-zinc-100">
                      {m.toString().padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[8px] font-bold uppercase tracking-wider block mt-1 text-zinc-500">
                      Min
                    </span>
                  </div>
                  <span className="font-bold self-center text-zinc-700">:</span>
                  <div className="text-center min-w-[28px]">
                    <span className="font-sans text-lg block font-extrabold leading-none text-zinc-100">
                      {s.toString().padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[8px] font-bold uppercase tracking-wider block mt-1 text-zinc-500">
                      Sec
                    </span>
                  </div>
                </div>
                <div className="bg-zinc-800 border-x border-b border-zinc-750 text-zinc-300 px-3 py-1 rounded-b-lg font-sans font-bold text-[9px] uppercase tracking-wider shadow-md">
                  ENDING SOON
                </div>
              </div>

              <div className="absolute bottom-4 left-4 z-20">
                <span className="bg-zinc-100 text-zinc-950 font-sans font-black text-xs px-4 py-1.5 rounded-full uppercase italic tracking-wider flex items-center gap-1 shadow-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  WEEKEND DEAL
                </span>
              </div>
            </div>

            <div className="p-6 relative z-20 bg-gradient-to-b from-[#121214] to-[#161619] space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl text-zinc-100 italic">
                    Bogo Zinger
                  </h2>
                  <p className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    BUY ONE GET ONE FREE • SATURDAY &amp; SUNDAY ONLY
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 line-through text-xs block font-medium">
                    Rs 900
                  </span>
                  <span className="font-sans font-extrabold text-lg text-zinc-100 block">
                    Rs 450
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClaim('BOGO Zinger Weekend Combo', 450, '2x Zinger Burgers for the price of one!')}
                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-sans font-bold text-sm py-3.5 rounded-xl uppercase tracking-wider active:scale-[0.98] transition-all shadow-xl"
              >
                GRAB NOW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

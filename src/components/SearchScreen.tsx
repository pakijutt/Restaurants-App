import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data';
import { Search, History, Star, Plus, Check, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchScreen: React.FC = () => {
  const { addToCart, recentSearches, addRecentSearch, clearRecentSearches, products } = useApp();
  const [query, setQuery] = useState('');
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 2500);
  };

  const filteredResults = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleChipClick = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  const handleAdd = (prodId: string) => {
    const p = products.find((item) => item.id === prodId);
    if (!p) return;
    addToCart(p, 1);
    triggerToast(`${p.name} added to cart!`);
  };

  return (
    <div className="pt-2 pb-24 px-4 space-y-6 max-w-xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-zinc-100 text-zinc-950 py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 justify-center font-bold border border-zinc-200"
          >
            <Check className="w-5 h-5 shrink-0 text-zinc-950" />
            <span className="font-sans text-sm">{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Zinger, Chapli, or Fries..."
          className="w-full h-14 pl-12 pr-10 bg-[#121214] rounded-xl border border-zinc-800/50 focus:ring-1 focus:ring-zinc-700/50 focus:outline-none text-sm font-sans text-zinc-100 placeholder:text-zinc-500 transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Conditional Search Results Display */}
      {query.trim() ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-widest">
              Search Results ({filteredResults.length})
            </h3>
            <button onClick={() => setQuery('')} className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:underline">
              Clear Search
            </button>
          </div>

          <div className="space-y-3">
            {filteredResults.length > 0 ? (
              filteredResults.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#121214] rounded-xl overflow-hidden p-3 flex items-center gap-4 border border-zinc-800/50"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-sm text-zinc-100 truncate">
                      {p.name}
                    </h4>
                    <p className="text-zinc-400 text-[11px] line-clamp-1 mt-0.5">
                      {p.description}
                    </p>
                    <span className="text-zinc-100 font-sans font-extrabold text-xs mt-1 block">
                      Rs. {p.price}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                      triggerToast(`${p.name} added to cart!`);
                      addRecentSearch(query);
                    }}
                    className="p-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full active:scale-90 transition-all shadow-md"
                    aria-label="Add item"
                  >
                    <Plus className="w-4 h-4 text-zinc-950" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No matching cravings found. Try checking spelling or using broader keywords.
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Default Recommendation State (Bento Grid / Discovery view) */
        <>
          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-widest">
                  Recent Searches
                </h2>
                <button
                  onClick={clearRecentSearches}
                  className="font-sans font-bold text-[10px] text-zinc-400 hover:text-zinc-100 hover:underline uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={`${term}-${idx}`}
                    onClick={() => handleChipClick(term)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121214] hover:bg-zinc-800 border border-zinc-800/50 rounded-full cursor-pointer transition-all active:scale-95 text-xs text-zinc-300"
                  >
                    <History className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Popular Categories */}
          <section className="space-y-3">
            <h2 className="font-sans font-bold text-xs text-zinc-400 uppercase tracking-widest">
              Popular Categories
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-1 scrollbar-none select-none">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleChipClick(cat.label)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#121214] hover:bg-zinc-800/50 border border-zinc-800/50 flex items-center justify-center hover:scale-105 transition-transform">
                    <span className="text-3xl select-none">{cat.emoji}</span>
                  </div>
                  <span className="font-sans font-bold text-[11px] text-zinc-400">
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended For You Bento Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-light italic text-zinc-100">
                Recommended For You
              </h2>
              <span className="bg-zinc-850 text-zinc-300 border border-zinc-700/30 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                HOT DEAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Bento Row 1: Triple Stack Zinger (Featured, span-2) */}
              <div className="col-span-2 relative h-56 rounded-xl overflow-hidden group border border-zinc-800/50 bg-zinc-900">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-sTYQUiwpS27VZINCcPO5wch5-Q3Rm2IbDByScDbebuR2h5votTFWvzXxFd2Bh9_CdK0OoKBTend3nyY-19A99EI_Ufjd8J24dMUf3Af1sr6V_A06mKPDeupX9XG8Oilefda7lOvCfSHpP99b7-2PXmbrv2oU9xT2SYDNgXZ-YymfKoZmfomEk-Itsxds0h1RHQQOHMxPRBNG0S2uTaZO9gogR7y0aSlOFv0g597ITEUDRM3gtPF4"
                  alt="Triple Stack Zinger"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="bg-zinc-850/90 text-zinc-100 border border-zinc-700/30 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Best Seller
                    </span>
                    <h3 className="font-serif text-lg text-zinc-100 italic leading-none">
                      Triple Stack Zinger
                    </h3>
                    <p className="font-sans font-extrabold text-sm text-zinc-100 mt-1">
                      Rs. 1,250
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd('triple-stack-zinger')}
                    className="p-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full active:scale-90 transition-all shadow-lg"
                    aria-label="Add item"
                  >
                    <Plus className="w-5 h-5 text-zinc-950" />
                  </button>
                </div>
              </div>

              {/* Bento Row 2 Col 1: Fiery Wings */}
              <div className="bg-[#121214] rounded-xl overflow-hidden flex flex-col border border-zinc-800/50 group">
                <div className="h-32 relative bg-zinc-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcr0_kpvfKerB17YmEckDm80PX_cMLNBf14JNY4MPq1xoCBWc0voTmVIRslaBFngBqu4Jsx4U-9rhxuUXAnY82rLoLTWnacDAL94N4T6cwZ2W5cYlK-T8bz4UGtVV_K7p275tYp-NWaxn_vwRpytbjAMMKJlxWKaPKPtFV6Hj9qejThfNC6bd3AEt-tkSye59UzbF7FiiT9ZsOzxOBnTWM7k13giFp47izN5Nch34u21hP0RQqZGna"
                    alt="Fiery Wings"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-zinc-100 fill-zinc-100" />
                    <span className="font-sans font-bold text-[10px] text-white">
                      4.8
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-sans font-bold text-xs text-zinc-100 truncate">
                      Fiery Wings (6pcs)
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                      Crispy, spicy, and saucy
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-sans font-bold text-xs text-zinc-100">
                      Rs. 799
                    </span>
                    <button
                      onClick={() => handleAdd('fiery-wings')}
                      className="text-zinc-400 hover:text-zinc-100 active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4 text-zinc-100" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bento Row 2 Col 2: Authentic Chapli */}
              <div className="bg-[#121214] rounded-xl overflow-hidden flex flex-col border border-zinc-800/50 group">
                <div className="h-32 relative bg-zinc-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARE4nbu44nST5sEvdTxAcGvipXpDiGEthwOK89g98HmqUT2advxgKFKcuYKxOoALvHB1Hc6lk0DR081ftf7JgyZ5l916umC3jf0RRZeKxsWg42Uc8rJh1jmczfVvMd_OQIv8XzycIN3zMX_qY9wvV22FENpk-vgAB0HEeHotiYjkv0xmuw46W_LZr-_AlCdcLVgBqkkyhSj-PFwgS09LS7RSKHUcmeV6oZpNK-R7rVTBN-uSTEj6ql"
                    alt="Authentic Beef Chapli"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-zinc-100 fill-zinc-100" />
                    <span className="font-sans font-bold text-[10px] text-white">
                      4.5
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-sans font-bold text-xs text-zinc-100 truncate">
                      Authentic Chapli
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                      Hand-crafted artisan beef
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-sans font-bold text-xs text-zinc-100">
                      Rs. 950
                    </span>
                    <button
                      onClick={() => handleAdd('authentic-chapli')}
                      className="text-zinc-400 hover:text-zinc-100 active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4 text-zinc-100" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bento Row 3: Zinger Loaded Fries (Horizontal full span) */}
              <div className="col-span-2 bg-[#121214] rounded-xl overflow-hidden flex items-center border border-zinc-800/50 p-2 pr-4">
                <div className="w-1/3 h-24 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9vwWSrw3K6c-YiS1zA-je-90Eq075LJo653A9k3OUyLNo8j5KjZsU22WzZZNruYP69XcBIPhmvGVWC4lZcBMpkrQgdxAkYuz6Y_bk7V9WqgVg1mevQwOZpcVDDRlYNNJFxGDC4mmgBkbcs6cu7xgolYGfqlNHClKGv6X1CJorJzgq77shcyOpAcEKCLgIIN6ZFcSAPdwVyde7Aw01iG7_hgMb_Jgmwnnpkp54kKM4r_lgaKPHGTuH"
                    alt="Zinger Loaded Fries"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pl-4 flex-grow flex items-center justify-between min-w-0">
                  <div className="min-w-0">
                    <h4 className="font-sans font-bold text-sm text-zinc-100 truncate">
                      Zinger Loaded Fries
                    </h4>
                    <p className="font-sans font-extrabold text-xs text-zinc-100 mt-1">
                      Rs. 625
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd('zinger-loaded-fries')}
                    className="w-10 h-10 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md shrink-0"
                    aria-label="Add item"
                  >
                    <ShoppingBag className="w-4 h-4 text-zinc-950" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

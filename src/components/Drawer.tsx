import React from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE_NAV_ITEMS } from '../data';
import { X, Star, ChevronRight, LogOut, User, History, CreditCard, Ticket, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Drawer: React.FC = () => {
  const { user, drawerOpen, setDrawerOpen, setActiveTab } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'account_circle': return <User className="w-5 h-5 text-zinc-400" />;
      case 'history': return <History className="w-5 h-5 text-zinc-400" />;
      case 'payments': return <CreditCard className="w-5 h-5 text-zinc-400" />;
      case 'confirmation_number': return <Ticket className="w-5 h-5 text-zinc-400" />;
      case 'settings': return <Settings className="w-5 h-5 text-zinc-400" />;
      case 'help_outline': return <HelpCircle className="w-5 h-5 text-zinc-400" />;
      default: return <User className="w-5 h-5 text-zinc-400" />;
    }
  };

  const handleNav = (tabId: string) => {
    setDrawerOpen(false);
    if (tabId === 'profile') {
      setActiveTab('profile');
    } else if (tabId === 'history') {
      setActiveTab('profile'); // Order history lives in profile
    } else if (tabId === 'payments') {
      setActiveTab('profile');
    } else if (tabId === 'promo') {
      setActiveTab('deals');
    } else if (tabId === 'settings') {
      setActiveTab('profile');
    } else if (tabId === 'help') {
      setActiveTab('profile');
    }
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0d0d0f] border-r border-zinc-800/50 z-50 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
              <span className="font-serif text-xl tracking-tight font-light italic text-zinc-100">
                Zinger Plus
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 active:scale-95 transition-transform"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Brief */}
            <div className="p-6 bg-[#121214] border-b border-zinc-800/50 flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-700/50">
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-zinc-100 text-zinc-950 px-1.5 py-0.5 rounded-full text-[9px] font-black flex items-center gap-0.5 shadow-md">
                  ★ GOLD
                </div>
              </div>

              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-100 leading-tight">
                  {user.name}
                </h3>
                <p className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                  {user.tier} MEMBER • {user.points} PTS
                </p>
              </div>
            </div>

            {/* Nav List */}
            <nav className="p-4 flex-1 space-y-1">
              {PROFILE_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-850/40 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(item.icon)}
                    </div>
                    <div className="text-left">
                      <span className="font-sans font-bold text-sm block">
                        {item.label}
                      </span>
                      {'badge' in item && (
                        <span className="text-zinc-400 text-[10px] font-bold block">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}

              {/* Special Admin Entry */}
              {user.isAdmin && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setActiveTab('admin');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-850/40 active:scale-[0.98] transition-all group border border-dashed border-zinc-800/80 mt-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Settings className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="text-left">
                      <span className="font-sans font-bold text-sm block flex items-center gap-1.5">
                        Admin Panel
                        <span className="text-[8px] bg-zinc-100 text-zinc-950 font-black px-1.5 py-0.5 rounded-full">
                          HUB
                        </span>
                      </span>
                      <span className="text-zinc-400 text-[10px] font-bold block">
                        Operations, Menu & Promos
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </nav>

            {/* Logout Footer */}
            <div className="p-6 border-t border-zinc-800/50">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setActiveTab('profile');
                }}
                className="w-full py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 hover:border-zinc-700/50 font-sans font-bold text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                LOG OUT
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

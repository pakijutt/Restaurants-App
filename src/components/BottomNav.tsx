import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Utensils, Tag, ShoppingCart, User } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart } = useApp();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  interface TabItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'deals', label: 'Deals', icon: Tag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0d0d0f]/95 backdrop-blur-md border-t border-zinc-800/50 rounded-t-2xl z-40 flex justify-around items-center px-4 pb-safe shadow-lg select-none">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'cart' && activeTab === 'track');

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700/50 transition-all active:scale-90"
          >
            {/* Active Pill Glow */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-zinc-800/60 border border-zinc-700/30 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon Content */}
            <div className={`relative z-10 flex flex-col items-center ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`}>
              <IconComponent className="w-5 h-5" />
              <span className="font-sans font-semibold text-[11px] mt-1">
                {tab.label}
              </span>

              {/* Badge */}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2.5 bg-zinc-100 text-zinc-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                  {tab.badge}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

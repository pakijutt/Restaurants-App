import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Search, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, setActiveTab, setDrawerOpen } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0d0d0f]/95 backdrop-blur-md border-b border-zinc-800/50 z-40 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-95 select-none"
        >
          <span className="font-serif text-xl tracking-tight font-light italic text-zinc-100">
            Zinger Plus
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('search')}
          className="p-2 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-transform"
          aria-label="Search cravings"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700/50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500"
          aria-label="View Profile"
        >
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

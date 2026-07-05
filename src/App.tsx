/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Drawer } from './components/Drawer';
import { HomeScreen } from './components/HomeScreen';
import { MenuScreen } from './components/MenuScreen';
import { DealsScreen } from './components/DealsScreen';
import { SearchScreen } from './components/SearchScreen';
import { CartScreen } from './components/CartScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TrackScreen } from './components/TrackScreen';
import { AdminScreen } from './components/AdminScreen';
import { LoginScreen } from './components/LoginScreen';
import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const { activeTab, currentUser, loading } = useApp();

  // Loading / Bootstrapping screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
          <span className="font-serif text-2xl font-light italic text-zinc-100">Z+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  // Auth Gate
  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'deals':
        return <DealsScreen />;
      case 'search':
        return <SearchScreen />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'track':
        return <TrackScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-white pb-24">
      {/* Shared Header (hidden on track & admin screens for custom layout experiences) */}
      {activeTab !== 'track' && activeTab !== 'admin' && <Header />}

      {/* Drawer Menu */}
      <Drawer />

      {/* Animated Screen Content Area */}
      <main className={(activeTab === 'track' || activeTab === 'admin') ? 'pt-0' : 'pt-16'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

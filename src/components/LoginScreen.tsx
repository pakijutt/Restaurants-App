import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, Lock, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loading, authError } = useApp();
  const [loginMode, setLoginMode] = useState<'customer' | 'admin'>('customer');

  const handleGoogleLogin = async () => {
    await signInWithGoogle(loginMode === 'admin');
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col justify-between px-6 py-12 relative overflow-hidden select-none">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full bg-zinc-900/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-zinc-900/30 blur-[100px] pointer-events-none" />

      {/* Top Brand Block */}
      <div className="text-center space-y-2 mt-8 z-10">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
          <span className="font-serif text-3xl font-light italic text-zinc-100">Z+</span>
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-light italic text-zinc-100 tracking-tight">
            Zinger Plus
          </h1>
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-500">
            Gourmet Midnight Companion
          </p>
        </div>
      </div>

      {/* Center Portal Box */}
      <div className="w-full max-w-sm mx-auto my-auto z-10 py-6">
        {/* Portal selector tabs */}
        <div className="grid grid-cols-2 bg-[#121214] p-1.5 rounded-2xl border border-zinc-800/80 mb-6 shadow-md">
          <button
            onClick={() => setLoginMode('customer')}
            className={`py-3 rounded-xl font-sans font-black text-xs uppercase tracking-wider transition-all ${
              loginMode === 'customer'
                ? 'bg-zinc-100 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setLoginMode('admin')}
            className={`py-3 rounded-xl font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'admin'
                ? 'bg-zinc-100 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            Admin Hub
          </button>
        </div>

        {/* Dynamic portal description and features */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loginMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {loginMode === 'customer' ? (
              <div className="bg-[#121214] border border-zinc-800/60 p-6 rounded-3xl shadow-xl space-y-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-light italic text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-zinc-300" />
                    Customer Rewards
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Join Zinger Plus to earn loyalty points, access exclusive midnight coupons, and track your gourmet deliveries live.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs text-zinc-300 font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <span>Instant Gold Tier rewards points</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <span>Persistent profile info & address saving</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <span>Real-time delivery map tracking</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121214] border border-zinc-800/60 p-6 rounded-3xl shadow-xl space-y-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-light italic text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-zinc-400" />
                    Restaurant Panel
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Authorized restaurant operators only. Access raw operational feeds, status stepper workflows, and menu/coupon modifiers.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs text-zinc-300 font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span>Live order status control boards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span>Add, delete & modify menu items instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span>Deploy exclusive custom promo codes</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Auth Error Display */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs leading-normal font-sans"
          >
            {authError}
          </motion.div>
        )}

        {/* Unified Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-sans font-black text-xs uppercase tracking-widest py-4.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 mt-6 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {/* Google SVG Icon */}
              <svg className="w-4 h-4 text-zinc-950 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Predefined credentials disclaimer for reviewers */}
        {loginMode === 'admin' && (
          <p className="text-zinc-500 text-[10px] text-center mt-4 font-sans italic leading-normal">
            Note: Register using your Google Account. If your email is <span className="text-zinc-400 font-bold">pakijutt036@gmail.com</span>, you will be granted complete Administrator privileges automatically.
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-zinc-600 text-[10px] font-sans font-bold uppercase tracking-wider z-10">
        © 2026 ZINGER PLUS FOODS • ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

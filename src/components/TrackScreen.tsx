import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Bike, Home, MessageSquare, Phone, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TrackScreen: React.FC = () => {
  const { activeOrder, setActiveTab } = useApp();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [eta, setEta] = useState(12);
  const [wiggleOffset, setWiggleOffset] = useState({ x: 0, y: 0 });

  // Simulate rider wiggle motion over time
  useEffect(() => {
    const interval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 4;
      const offsetY = (Math.random() - 0.5) * 4;
      setWiggleOffset({ x: offsetX, y: offsetY });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Simulate ETA reduction slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 12));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!activeOrder) {
    return (
      <div className="pt-12 pb-24 px-4 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto min-h-[60vh]">
        <div className="w-20 h-20 bg-[#121214] border border-zinc-800/50 text-zinc-400 rounded-full flex items-center justify-center">
          <MapPin className="w-10 h-10 text-zinc-400" />
        </div>
        <h3 className="font-serif text-xl font-light italic text-zinc-100">
          No Active Deliveries
        </h3>
        <p className="text-zinc-400 text-sm leading-normal">
          You don't have any orders currently out for delivery. Let's go place a fresh order!
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold font-sans text-sm active:scale-95 transition-all shadow-lg"
        >
          Check out the Menu
        </button>
      </div>
    );
  }

  const itemsCount = activeOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-[calc(100vh-5rem)] w-full flex flex-col relative select-none">
      {/* Map Canvas Background */}
      <div className="absolute inset-0 w-full h-full bg-[#09090b] z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center grayscale opacity-60 contrast-[1.1] brightness-[0.4]"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBsZ8JiD8x3_55M20ZQR3MR5qumDORRNs4T9ZpQQifOmPLJp80c4gs4SoBomkMj_N4TXcN4_fGMeCCiVCikZkiWE3RwkHp4j3xaeLl-8JG1uaflbzVxSnvwpqaDk56aqmTJRWKzOnAFeJwc6DHrqSXRTWk6G3CmaKTOez8BHvM_oCsmxX0meTN3hhWu2BthqiJyQGVepSd3nbBQU-0Y2O6JG7yxZaZLBOpCWcS4WsHRr-6Yuvy3VOE')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />

        {/* Animated Rider Marker */}
        <div
          className="absolute top-[48%] left-[38%] z-10 transition-transform duration-300"
          style={{
            transform: `translate(-50%, -50%) translate(${wiggleOffset.x}px, ${wiggleOffset.y}px)`,
          }}
        >
          <div className="relative">
            {/* Ping animation rings */}
            <div className="absolute inset-0 bg-zinc-100 rounded-full animate-ping opacity-30 scale-150" />
            <div className="relative bg-zinc-100 text-zinc-950 p-3.5 rounded-full shadow-2xl border border-zinc-200">
              <Bike className="w-6 h-6 text-zinc-950" />
            </div>
          </div>
        </div>

        {/* Destination Home Marker */}
        <div className="absolute top-[32%] right-[28%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-zinc-900 text-zinc-100 p-2.5 rounded-xl shadow-2xl border border-zinc-800">
            <Home className="w-5 h-5 text-zinc-100" />
          </div>
        </div>

        {/* Dynamic Floating ETA Tag */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2 shadow-lg">
            <span className="text-zinc-500 font-sans font-bold text-[10px] uppercase tracking-widest">
              Arriving In
            </span>
            <span className="font-sans font-extrabold text-sm text-zinc-100 leading-none">
              {eta} MINS
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status Card Sheet */}
      <section className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4">
        <div className="bg-[#121214] rounded-3xl p-5 shadow-2xl border border-zinc-800/50 max-w-lg mx-auto space-y-5">
          {/* Progress Tracker Stepper */}
          <div className="flex justify-between items-center px-1">
            {/* Step 1: Received */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700/30 flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <span className="font-sans font-bold text-[9px] text-zinc-500 uppercase tracking-wider">
                Received
              </span>
            </div>
            <div className="flex-grow h-0.5 mx-1 bg-zinc-800" />

            {/* Step 2: Preparing */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700/30 flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <span className="font-sans font-bold text-[9px] text-zinc-500 uppercase tracking-wider">
                Preparing
              </span>
            </div>
            <div className="flex-grow h-0.5 mx-1 bg-zinc-800" />

            {/* Step 3: Shipping (Active) */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center border border-zinc-200 ring-4 ring-zinc-100/10 shadow-lg">
                <Bike className="w-4.5 h-4.5 text-zinc-950" />
              </div>
              <span className="font-sans font-bold text-[9px] text-zinc-100 uppercase tracking-wider">
                Shipping
              </span>
            </div>
            <div className="flex-grow h-0.5 mx-1 bg-zinc-900" />

            {/* Step 4: Arrived */}
            <div className="flex flex-col items-center gap-1.5 opacity-40">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-zinc-500 flex items-center justify-center border border-zinc-850">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans font-bold text-[9px] text-zinc-500 uppercase tracking-wider">
                Arrived
              </span>
            </div>
          </div>

          {/* Status Text Header */}
          <div className="text-center pt-2">
            <h2 className="font-serif text-2xl font-light italic text-zinc-100 leading-none">
              Out for Delivery
            </h2>
            <p className="font-sans text-xs text-zinc-400 font-medium italic mt-1.5">
              Sizzling hot and on its way to you!
            </p>
          </div>

          {/* Rider Profile Card */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-900 rounded-2xl border border-zinc-800/80 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={activeOrder.riderPic}
                  alt={activeOrder.riderName}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-700/50 shadow-sm brightness-90"
                />
                <div className="absolute -bottom-1 -right-1 bg-zinc-800 border border-zinc-700/30 text-zinc-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm text-[8px] font-bold">
                  ★ {activeOrder.riderRating}
                </div>
              </div>

              <div>
                <h3 className="font-sans font-bold text-sm text-zinc-100 leading-none">
                  {activeOrder.riderName}
                </h3>
                <p className="font-sans font-bold text-[10px] text-zinc-400 uppercase tracking-wider mt-1">
                  Your Zinger Pilot
                </p>
              </div>
            </div>

            {/* Micro Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Simulated Chat with ${activeOrder.riderName}: "I have just picked up your fresh Zinger burgers and I am turning onto Main Street!"`)}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 flex items-center justify-center active:scale-90 transition-transform shadow-md"
                aria-label="Chat with pilot"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => alert(`Dialing ${activeOrder.riderName} at +1 234 567 890...`)}
                className="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center active:scale-90 transition-transform shadow-md"
                aria-label="Call pilot"
              >
                <Phone className="w-4.5 h-4.5 text-zinc-950" />
              </button>
            </div>
          </div>

          {/* Interactive Order Details Expandable */}
          <div className="border-t border-zinc-800/50 pt-2">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-100 py-1.5 transition-colors"
            >
              <span>{detailsExpanded ? 'Hide' : 'View'} Order Details ({itemsCount} items)</span>
              {detailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {detailsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-zinc-900 p-4 rounded-xl space-y-3.5 border border-zinc-800 mt-2">
                    <div className="flex justify-between items-center text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold uppercase tracking-widest">
                      <span>Item</span>
                      <span>Total</span>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-300 font-medium">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-zinc-100 font-bold">
                            Rs. {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-800 pt-2.5 space-y-1.5 text-xs font-semibold text-zinc-500">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-zinc-300">Rs. {activeOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%):</span>
                        <span className="text-zinc-300">Rs. {activeOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className="text-zinc-100 font-bold bg-zinc-800 border border-zinc-700/30 px-2.5 py-0.5 rounded text-[10px]">FREE</span>
                      </div>
                      <div className="flex justify-between text-zinc-100 font-bold text-sm pt-1.5 border-t border-zinc-800">
                        <span>Order Total:</span>
                        <span className="text-zinc-100">Rs. {activeOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

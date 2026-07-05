import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Minus, Plus, Truck, Edit, CreditCard, ArrowRight, ArrowLeft, ShoppingCart, Percent } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { cart, updateQuantity, user, placeOrder, setActiveTab } = useApp();

  // Local state for delivery inputs
  const [fullName, setFullName] = useState(user.name || 'Zinger Fan');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+1 234 567 890');
  const [address, setAddress] = useState(user.address || 'Goal Tanki Chowk, Main Street, Area 51');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isDollarMode = subtotal < 100; // Check if using Dollar pricing of seed items or Rupee menu items
  const taxRate = 0.08;
  const tax = Number((subtotal * taxRate).toFixed(2));

  // Free delivery criteria: Subtotal > $15 or any Rupee order
  const isFreeDelivery = subtotal > 15 || !isDollarMode;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 2.50;
  const totalAmount = Number((subtotal + tax + deliveryFee).toFixed(2));

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add some items to your order first!');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required for delivery coordination.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Valid phone number is required to contact you on arrival.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Exact delivery address is required for our delivery pilot.');
      return;
    }

    setErrorMsg(null);
    placeOrder({
      name: fullName,
      phone: phoneNumber,
      address: address,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="pt-12 pb-24 px-4 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto min-h-[60vh]">
        <div className="w-20 h-20 bg-[#121214] border border-zinc-800/50 text-zinc-400 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-zinc-400" />
        </div>
        <h3 className="font-serif text-xl font-light italic text-zinc-100">
          Your Order is Empty
        </h3>
        <p className="text-zinc-400 text-sm leading-normal">
          You haven't added any sizzling zinger burgers, deep pan pizzas, or spicy peri bites yet. Let's go grab some!
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold font-sans text-sm active:scale-95 transition-all shadow-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-950" />
          Browse Dynamic Menu
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-40 px-4 max-w-xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex items-end justify-between border-b border-zinc-850 pb-4">
        <h2 className="font-serif text-2xl font-light italic text-zinc-100">
          Your Order
        </h2>
        <span className="text-zinc-400 font-sans font-bold text-xs tracking-wider uppercase">
          {cart.reduce((total, item) => total + item.quantity, 0)} ITEMS
        </span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-[#121214] rounded-2xl p-4 flex gap-4 border border-zinc-800/50 shadow-lg"
          >
            {/* Image container */}
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-full object-cover brightness-90"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-sans font-bold text-sm text-zinc-100 truncate">
                    {item.quantity}x {item.product.name}
                  </h3>
                  <span className="font-sans font-extrabold text-sm text-zinc-100 shrink-0">
                    {isDollarMode ? '$' : 'Rs. '}{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                {item.customization && (
                  <p className="text-zinc-400 text-[11px] font-medium leading-normal mt-0.5">
                    {item.customization}
                  </p>
                )}
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center gap-4 mt-2 select-none">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-zinc-300" />
                </button>
                <span className="font-sans font-extrabold text-sm text-zinc-100">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-white active:scale-90 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 text-zinc-950" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Details Section */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-light italic text-zinc-100 flex items-center gap-2">
          <Truck className="w-5 h-5 text-zinc-400" />
          Delivery Details
        </h2>

        <div className="bg-[#121214] p-5 rounded-2xl border border-zinc-800/50 space-y-4 shadow-xl">
          {/* Full Name */}
          <div className="relative">
            <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium text-sm transition-colors"
              placeholder="e.g. Zinger Fan"
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium text-sm transition-colors"
              placeholder="e.g. +1 234 567 890"
            />
          </div>

          {/* Delivery Address */}
          <div className="relative">
            <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500 mb-1">
              Delivery Address
            </label>
            <div className="relative">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-3 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium text-sm resize-none transition-colors font-sans"
                placeholder="Exact delivery address details..."
              />
              <Edit className="absolute right-3.5 bottom-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Financial Breakdown Summary */}
      <section className="bg-[#121214] rounded-2xl border border-zinc-800/50 overflow-hidden shadow-xl">
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-zinc-100">{isDollarMode ? '$' : 'Rs. '}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-zinc-400">Tax (8%)</span>
            <span className="text-zinc-100">{isDollarMode ? '$' : 'Rs. '}{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-zinc-400">Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-zinc-100 bg-zinc-800 border border-zinc-700/30 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">FREE</span>
            ) : (
              <span className="text-zinc-100">{isDollarMode ? '$' : 'Rs. '}{deliveryFee.toFixed(2)}</span>
            )}
          </div>
          <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
            <span className="font-serif text-lg font-light italic text-zinc-100">
              Total Amount
            </span>
            <span className="font-sans font-extrabold text-xl text-zinc-100">
              {isDollarMode ? '$' : 'Rs. '}{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Dynamic free delivery tag banner */}
        {isFreeDelivery && (
          <div className="bg-zinc-800/20 px-5 py-2.5 flex items-center justify-center gap-2 border-t border-zinc-800/50 select-none">
            <Percent className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-sans font-bold text-[10px] text-zinc-400 uppercase tracking-wider">
              You're saving {isDollarMode ? '$2.50' : 'Rs. 150'} with Free Delivery!
            </span>
          </div>
        )}
      </section>

      {/* Bottom Sticky Action Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 rounded-t-2xl px-4 py-4 z-40 shadow-2xl">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          {errorMsg && (
            <p className="text-zinc-400 text-xs text-center font-bold">
              {errorMsg}
            </p>
          )}

          {/* Payment method selector */}
          <div className="flex items-center justify-between px-2 select-none">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              <span className="font-sans font-bold text-sm text-zinc-300">
                Cash on Delivery
              </span>
            </div>
            <button
              onClick={() => {
                setErrorMsg('Note: Cash on Delivery is currently the exclusive active payment channel in your location.');
                setTimeout(() => setErrorMsg(null), 4000);
              }}
              className="text-zinc-400 font-sans font-bold text-xs uppercase hover:text-zinc-100 hover:underline"
            >
              CHANGE
            </button>
          </div>

          {/* Place Order CTA Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-950 py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>PLACE ORDER</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>
        </div>
      </div>
    </div>
  );
};

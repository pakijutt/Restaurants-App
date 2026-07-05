import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE_NAV_ITEMS } from '../data';
import { Star, Shield, ChevronRight, Check, History, Sparkles, MapPin, Phone, LogOut, CreditCard, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileScreen: React.FC = () => {
  const { user, coupons, logout, saveUserProfile } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAddress, setEditAddress] = useState(user.address);

  // Mock past orders in case they haven't placed any in the session
  const [mockOrders] = useState([
    { id: '#ZP-9481', items: '2x Zinger Burger, 1x Large Fries', total: 'Rs. 1,450', status: 'Delivered', date: 'Yesterday, 9:24 PM' },
    { id: '#ZP-8812', items: '1x Deep Pan Pizza, 1x Coke 1.5L', total: 'Rs. 980', status: 'Delivered', date: '29 Jun 2026, 1:12 PM' },
  ]);

  const handleItemClick = (label: string) => {
    setActiveSection(activeSection === label ? null : label);
  };

  const handleSave = async () => {
    await saveUserProfile(editName, editPhone, editAddress);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="pt-2 pb-24 px-4 max-w-xl mx-auto space-y-6">
      {/* Profile Hero Card */}
      <section className="relative overflow-hidden bg-[#121214] rounded-2xl p-5 border border-zinc-800/50 shadow-2xl">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-700/50">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-full h-full object-cover brightness-95"
              />
            </div>
            <div className="absolute -bottom-2.5 -right-2.5 bg-zinc-800 text-zinc-100 border border-zinc-700/30 px-2.5 py-0.5 rounded-full text-[9px] font-black flex items-center gap-0.5 shadow-md">
              <Star className="w-2.5 h-2.5 fill-current text-zinc-300" />
              GOLD
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-light italic text-zinc-100 leading-none truncate">
              {user.name}
            </h2>
            <p className="text-zinc-400 font-sans font-bold text-xs uppercase tracking-wider mt-1.5">
              Gold Tier Member
            </p>
            <div className="flex items-center gap-1.5 mt-2.5 bg-zinc-900 rounded-full px-3 py-1 w-fit border border-zinc-800">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-100 font-sans font-extrabold text-xs">
                {user.points}
              </span>
              <span className="text-zinc-500 font-sans font-bold text-[9px] tracking-wider">
                POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty progress tracker bar */}
        <div className="mt-6 pt-2">
          <div className="flex justify-between items-center mb-1.5 select-none">
            <span className="font-sans font-bold text-[10px] text-zinc-500 uppercase tracking-wider">
              Next Reward: Free Zinger
            </span>
            <span className="font-sans font-extrabold text-xs text-zinc-400">
              76%
            </span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-zinc-100 rounded-full"
              style={{ width: '76%' }}
            />
          </div>
        </div>
      </section>

      {/* Accordion Panels for Profile Navigation */}
      <section className="space-y-2">
        {PROFILE_NAV_ITEMS.map((item) => {
          const isExpanded = activeSection === item.label;
          return (
            <div
              key={item.id}
              className="bg-[#121214] border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => handleItemClick(item.label)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1e] active:scale-[0.99] transition-all text-zinc-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 font-bold">
                    {item.label === 'My Profile' && <Shield className="w-5 h-5" />}
                    {item.label === 'Order History' && <History className="w-5 h-5" />}
                    {item.label === 'Payment Methods' && <CreditCard className="w-5 h-5" />}
                    {item.label === 'Promo Codes' && <Sparkles className="w-5 h-5" />}
                    {item.label === 'Settings' && <Star className="w-5 h-5" />}
                    {item.label === 'Help Center' && <HelpCircle className="w-5 h-5" />}
                  </span>
                  <div className="text-left">
                    <span className="font-sans font-bold text-sm block text-zinc-200">
                      {item.label}
                    </span>
                    {item.label === 'Promo Codes' && !isExpanded && (
                      <span className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase block">
                        3 Active Coupons
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Accordion Expansion Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-[#161619] border-t border-zinc-800/30"
                  >
                    <div className="p-4 space-y-4 text-xs font-semibold text-zinc-400">
                      {/* Expansion 1: My Profile */}
                      {item.label === 'My Profile' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
                            <div className="flex items-center gap-2.5">
                              <Star className="w-4 h-4 text-zinc-400" />
                              <span className="text-zinc-100 text-sm font-serif italic font-light">Account Information</span>
                            </div>
                            {!isEditing && (
                              <button 
                                onClick={() => setIsEditing(true)}
                                className="text-zinc-400 hover:text-white hover:underline text-[11px]"
                              >
                                Edit Profile
                              </button>
                            )}
                          </div>
                          
                          {isEditing ? (
                            <div className="space-y-3.5">
                              <div className="space-y-1">
                                <label className="text-zinc-500 text-[10px] uppercase font-bold">Preferred Name</label>
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2.5 rounded-lg text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-zinc-500 text-[10px] uppercase font-bold">Primary Phone</label>
                                <input
                                  type="text"
                                  value={editPhone}
                                  onChange={(e) => setEditPhone(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2.5 rounded-lg text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-zinc-500 text-[10px] uppercase font-bold">Saved Address</label>
                                <textarea
                                  value={editAddress}
                                  onChange={(e) => setEditAddress(e.target.value)}
                                  rows={2}
                                  className="w-full bg-zinc-900 border border-zinc-850 p-2.5 rounded-lg text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none resize-none font-sans font-medium"
                                />
                              </div>

                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={handleSave}
                                  className="flex-1 bg-zinc-100 text-zinc-950 hover:bg-white p-2 rounded-lg font-bold text-center"
                                >
                                  Save Profile Info
                                </button>
                                <button
                                  onClick={() => setIsEditing(false)}
                                  className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white p-2 rounded-lg font-bold px-4"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="flex justify-between">
                                <span className="text-zinc-500">Preferred Name:</span>
                                <span className="text-zinc-200">{user.name}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-zinc-500">Member Level:</span>
                                <span className="text-zinc-300 font-bold">GOLD ELITE</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-zinc-500">Loyalty Points:</span>
                                <span className="text-zinc-200">{user.points} pts</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-zinc-500">Primary Phone:</span>
                                <span className="text-zinc-200">{user.phone || 'No phone saved'}</span>
                              </p>
                              <div className="pt-2">
                                <p className="text-zinc-500 mb-1">Saved Address:</p>
                                <p className="text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                                  <span>{user.address || 'No address saved yet'}</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expansion 2: Order History */}
                      {item.label === 'Order History' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/50">
                            <History className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-100 text-sm font-serif italic font-light">Past Orders</span>
                          </div>
                          {mockOrders.map((o) => (
                            <div
                              key={o.id}
                              className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 space-y-2"
                            >
                              <div className="flex justify-between items-center text-zinc-200">
                                <span className="font-extrabold text-sm text-zinc-300">{o.id}</span>
                                <span className="text-[11px] text-zinc-500">{o.date}</span>
                              </div>
                              <p className="text-zinc-400 text-xs font-medium">{o.items}</p>
                              <div className="flex justify-between items-center text-xs">
                                <span>Total Paid: <strong className="text-zinc-200">{o.total}</strong></span>
                                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expansion 3: Payment Methods */}
                      {item.label === 'Payment Methods' && (
                        <div className="space-y-3">
                          <p className="text-zinc-200 font-bold">Primary Payment channel</p>
                          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-zinc-400" />
                              </div>
                              <div>
                                <p className="text-zinc-200 font-bold text-sm">Cash on Delivery</p>
                                <p className="text-[10px] text-zinc-500">Always default for Pir Mahal</p>
                              </div>
                            </div>
                            <span className="bg-zinc-100 text-zinc-950 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">
                              Active
                            </span>
                          </div>
                          <p className="text-zinc-500 text-[11px] leading-normal pt-1">
                            Digital payments (Stripe/Debit) are temporarily offline in this region for maintenance. Cash-on-delivery is active.
                          </p>
                        </div>
                      )}

                      {/* Expansion 4: Promo Codes */}
                      {item.label === 'Promo Codes' && (
                        <div className="space-y-3">
                          {coupons.map((c) => (
                            <div
                              key={c.code}
                              className="bg-zinc-900 p-3 rounded-lg border border-dashed border-zinc-800 flex justify-between items-center"
                            >
                              <div>
                                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                                  {c.discount}
                                </span>
                                <p className="text-zinc-200 font-bold text-xs mt-1.5">{c.code}</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{c.desc}</p>
                              </div>
                              <button
                                onClick={() => {
                                  alert(`Coupon code ${c.code} applied successfully to your active session!`);
                                }}
                                className="text-xs font-bold text-zinc-400 hover:text-zinc-100 hover:underline"
                              >
                                Apply
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expansion 5: Settings */}
                      {item.label === 'Settings' && (
                        <div className="space-y-3">
                          <p className="text-zinc-200 font-bold">Preferences</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800" />
                              <span className="text-zinc-300 text-xs">Enable Push Notifications for ETAs</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800" />
                              <span className="text-zinc-300 text-xs">Opt in for Weekend Promo SMS alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800" />
                              <span className="text-zinc-300 text-xs">High-Contrast Power Saver mode</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Expansion 6: Help Center */}
                      {item.label === 'Help Center' && (
                        <div className="space-y-3 text-xs leading-normal">
                          <p className="text-zinc-200 font-bold font-serif italic">Frequently Asked Questions</p>
                          <div className="space-y-2">
                            <p className="text-zinc-300 font-bold">Q: What is the delivery radius for Zinger Plus?</p>
                            <p className="text-zinc-500 font-sans font-medium">A: We cover all areas in and around Pir Mahal within a 15km radius. Delivery is ultra-fast using our dedicated bike pilots.</p>
                            
                            <p className="text-zinc-300 font-bold">Q: How can I redeem my loyalty points?</p>
                            <p className="text-zinc-500 font-sans font-medium">A: Accumulate points with each order. Points are automatically redeemed for premium items like a Free Zinger Burger on reaching 1500 points!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full p-4 bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 font-sans font-bold text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>

      {/* Promotion Card Banner */}
      <div className="relative group overflow-hidden rounded-2xl aspect-[21/9] shadow-xl border border-zinc-800/50">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9eNAVk-cRcrfyxtaipUJx1IrHkhEw8hwUdGFxEucN36V62N9ViDb6tT-gIKMNJAFzw2iUp63_EsyFBFpcF-n-oJ0B9xtj1_Ngs7EGNM04QYYfe3pNfZbwhSprypslr1IX1gzTGLm0FnubuxIdahTRK3ZHG_XAjnfvcE88mQaqZjNLJ6yiKHSdCx7px-Xhdbu_30nhbm93rkRh6d_gKuuOS4lgtq3tIQhaFsciKY8hx2NE5N_r7dGV"
          alt="Exclusive Deal"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-center">
          <span className="bg-zinc-800 border border-zinc-750 text-zinc-200 text-[9px] font-black uppercase w-fit px-2 py-0.5 rounded-full mb-1.5 shadow-sm">
            Exclusive Deal
          </span>
          <h3 className="font-serif text-xl font-light italic text-white tracking-wider">
            Up to 50% Off
          </h3>
          <p className="text-zinc-300 text-[11px] font-medium mt-0.5">
            On your next late-night order
          </p>
        </div>
      </div>
    </div>
  );
};

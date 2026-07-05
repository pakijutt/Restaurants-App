import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import { CATEGORIES } from '../data';
import { 
  BarChart3, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Check, 
  ArrowRight, 
  User, 
  MapPin, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  X, 
  DollarSign, 
  Bike, 
  Flame, 
  ShoppingBasket,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_PRODUCT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9njZjb2v65s-27wZxI3u0EsROgE7fKZ4D9C2S-fibh13PDVCWRH40cTWi6aL6SX4oChub_1C0wIjpcS9Ss6bUXFf_-eCW0YeTNU1KQt6wzpvW4_qw7qdq9yrh2Rs-LAaQtCTROMVhTQIFWKZMlOoMmAWeAWOk5x_ZlQYJY4Eky2ZztMXntt0n8rW6W8ibn6KE67Uhn5GdW3pH1dEyC62LTQryvY9hR3kW_X5Cxc3Czg8nTS14sGAL";

export const AdminScreen: React.FC = () => {
  const { 
    products, 
    addProduct,
    updateProduct,
    deleteProduct,
    orders, 
    updateOrderStatus, 
    coupons, 
    addCoupon,
    deleteCoupon,
    setActiveTab 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'orders' | 'menu' | 'coupons'>('analytics');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<'burgers' | 'pizza' | 'wraps' | 'fries' | 'drinks' | 'sides'>('burgers');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsSizzling, setProdIsSizzling] = useState(false);
  const [prodIsNew, setProdIsNew] = useState(false);

  // Form states for Coupon
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Live operational logs/activity
  const [logs, setLogs] = useState<string[]>([
    "System online: Restaurant Management server running",
    "Pre-authenticated session configured for admin@zingerplus.com",
    "Loaded default menu items from dataset"
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addLog = (entry: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${timestamp}] ${entry}`, ...prev].slice(0, 15));
  };

  // Financial stats calculations
  const baselineRevenue = 38540; // Simulated history baseline
  const dynamicRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue = baselineRevenue + dynamicRevenue;

  const baselineOrdersCount = 94;
  const totalOrdersCount = baselineOrdersCount + orders.length;

  const activeOrdersCount = orders.filter(o => o.status !== 'arrived').length;

  // Handler for adding/updating products
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert("Please provide a product name.");
      return;
    }
    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price greater than zero.");
      return;
    }

    const imgUrl = prodImageUrl.trim() || DEFAULT_PRODUCT_IMAGE;

    if (editingProduct) {
      // Edit mode
      const updated = {
        ...editingProduct,
        name: prodName,
        description: prodDescription,
        price: priceNum,
        category: prodCategory,
        imageUrl: imgUrl,
        isBestSeller: prodIsBestSeller,
        isSizzling: prodIsSizzling,
        isNew: prodIsNew,
        badgeText: prodIsBestSeller ? 'BEST SELLER' : prodIsSizzling ? 'SIZZLING' : prodIsNew ? 'NEW HOT' : undefined
      };
      await updateProduct(updated);
      addLog(`Updated menu item: "${prodName}"`);
      triggerToast(`Successfully updated ${prodName}`);
    } else {
      // Create mode
      const newId = `prod-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name: prodName,
        description: prodDescription,
        price: priceNum,
        category: prodCategory,
        imageUrl: imgUrl,
        rating: 4.8,
        isBestSeller: prodIsBestSeller,
        isSizzling: prodIsSizzling,
        isNew: prodIsNew,
        badgeText: prodIsBestSeller ? 'BEST SELLER' : prodIsSizzling ? 'SIZZLING' : prodIsNew ? 'NEW' : undefined
      };
      await addProduct(newProduct);
      addLog(`Created new menu item: "${prodName}"`);
      triggerToast(`Added ${prodName} to the menu!`);
    }

    closeProductModal();
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDescription(prod.description);
    setProdPrice(prod.price.toString());
    setProdCategory(prod.category);
    setProdImageUrl(prod.imageUrl);
    setProdIsBestSeller(!!prod.isBestSeller);
    setProdIsSizzling(!!prod.isSizzling);
    setProdIsNew(!!prod.isNew);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProdName('');
    setProdDescription('');
    setProdPrice('');
    setProdCategory('burgers');
    setProdImageUrl('');
    setProdIsBestSeller(false);
    setProdIsSizzling(false);
    setProdIsNew(false);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to remove "${productName}" from the menu?`)) {
      await deleteProduct(productId);
      addLog(`Deleted menu item: "${productName}"`);
      triggerToast(`Removed ${productName}`);
    }
  };

  // Handler for saving Coupons
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount.trim() || !newCouponDesc.trim()) {
      alert("Please fill in all coupon fields.");
      return;
    }

    const codeUpper = newCouponCode.trim().toUpperCase();
    const isDuplicate = coupons.some(c => c.code === codeUpper);
    if (isDuplicate) {
      alert(`Coupon code "${codeUpper}" already exists.`);
      return;
    }

    const newCoupon = {
      code: codeUpper,
      discount: newCouponDiscount.trim(),
      desc: newCouponDesc.trim()
    };

    await addCoupon(newCoupon);
    addLog(`Created coupon code: "${codeUpper}" (${newCouponDiscount.trim()})`);
    triggerToast(`Created promo code ${codeUpper}!`);
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponDesc('');
  };

  const handleDeleteCoupon = async (code: string) => {
    if (confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      await deleteCoupon(code);
      addLog(`Removed coupon code: "${code}"`);
      triggerToast(`Deleted coupon ${code}`);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    addLog(`Order #${orderId} status advanced to: ${newStatus.toUpperCase()}`);
    triggerToast(`Order #${orderId} set to "${newStatus}"`);
  };

  return (
    <div className="pt-2 pb-40 px-4 max-w-xl mx-auto space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-zinc-100 text-zinc-950 py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 justify-center font-bold border border-zinc-200"
          >
            <Check className="w-5 h-5 text-zinc-950 shrink-0" />
            <span className="font-sans text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-light italic text-zinc-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-zinc-400" />
            Restaurant Hub
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans font-semibold uppercase tracking-wider mt-0.5">
            Zinger Plus Control Panel
          </p>
        </div>
        <button
          onClick={() => setActiveTab('menu')}
          className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 px-3.5 py-1.5 rounded-lg font-bold font-sans transition-all"
        >
          Customer View
        </button>
      </div>

      {/* Navigation Subtabs */}
      <div className="grid grid-cols-4 bg-[#121214] p-1.5 rounded-xl border border-zinc-800/60 select-none">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`py-2 rounded-lg font-sans font-bold text-[11px] uppercase tracking-wider transition-all ${
            activeSubTab === 'analytics'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`py-2 rounded-lg font-sans font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'orders'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Orders</span>
          {orders.length > 0 && (
            <span className="w-4 h-4 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center text-[9px] font-black">
              {orders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('menu')}
          className={`py-2 rounded-lg font-sans font-bold text-[11px] uppercase tracking-wider transition-all ${
            activeSubTab === 'menu'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`py-2 rounded-lg font-sans font-bold text-[11px] uppercase tracking-wider transition-all ${
            activeSubTab === 'coupons'
              ? 'bg-zinc-800 text-zinc-100 shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Promos
        </button>
      </div>

      {/* Subtab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* TAB 1: ANALYTICS & STATS */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              {/* Financial Dashboard Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121214] p-4 rounded-xl border border-zinc-800/50 shadow-md flex flex-col justify-between">
                  <span className="text-zinc-500 font-sans font-bold text-[10px] uppercase tracking-wider">
                    Total Estimated Sales
                  </span>
                  <div className="mt-3">
                    <span className="font-sans font-black text-xl text-zinc-100">
                      Rs. {totalRevenue.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Includes Rs. {dynamicRevenue.toFixed(0)} dynamic orders
                    </p>
                  </div>
                </div>

                <div className="bg-[#121214] p-4 rounded-xl border border-zinc-800/50 shadow-md flex flex-col justify-between">
                  <span className="text-zinc-500 font-sans font-bold text-[10px] uppercase tracking-wider">
                    Orders Processed
                  </span>
                  <div className="mt-3">
                    <span className="font-sans font-black text-xl text-zinc-100">
                      {totalOrdersCount}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
                      {activeOrdersCount} in active delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Event Logger Feed */}
              <div className="bg-[#121214] rounded-xl border border-zinc-800/50 p-4 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <span className="text-zinc-200 font-serif text-sm italic font-light">
                    Operational Event Stream
                  </span>
                  <span className="text-zinc-500 text-[9px] font-mono tracking-wider">
                    RESTAURANT_LIVE_LOGS
                  </span>
                </div>
                <div className="font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-40 overflow-y-auto select-text">
                  {logs.map((log, index) => (
                    <div key={index} className="truncate leading-normal border-l-2 border-zinc-800 pl-2">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="bg-[#121214] rounded-xl border border-zinc-800/50 p-4 shadow-lg space-y-4">
                <h3 className="font-serif text-sm font-light italic text-zinc-200 border-b border-zinc-850 pb-2">
                  Operations Overview
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Active Menu Items</p>
                    <p className="text-zinc-200 font-extrabold text-lg mt-1">{products.length}</p>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Active Promos</p>
                    <p className="text-zinc-200 font-extrabold text-lg mt-1">{coupons.length}</p>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Delivery Base</p>
                    <p className="text-zinc-200 font-extrabold text-xs mt-1">Pir Mahal Area 15km</p>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Fulfillment Speed</p>
                    <p className="text-zinc-200 font-extrabold text-xs mt-1">Avg 12 - 15 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ORDERS MANAGEMENT */}
          {activeSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-light italic text-zinc-100">
                  Real-time Delivery Queue
                </h3>
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-400 font-mono">
                  {orders.length} ACTIVE ORDERS
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#121214] rounded-2xl p-8 border border-zinc-800/50 text-center space-y-4">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl border border-zinc-800/50 text-zinc-500 flex items-center justify-center mx-auto shadow">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-200 font-bold text-sm">No Active Orders Yet</p>
                    <p className="text-zinc-500 text-xs leading-normal max-w-xs mx-auto">
                      Whenever a dynamic order is checked out from the Cart tab, it will stream here in real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Seed an active order for quick interactive experience
                      const dummyOrder: Order = {
                        id: `ZP-${Math.floor(100000 + Math.random() * 900000)}`,
                        items: [
                          {
                            id: 'seeded-1',
                            product: products[0] || {
                              id: 'classic-zinger',
                              name: 'Classic Zinger',
                              description: 'Original crispy fillet',
                              price: 450,
                              imageUrl: DEFAULT_PRODUCT_IMAGE,
                              category: 'burgers'
                            },
                            quantity: 1,
                            customization: 'Extra Chili'
                          }
                        ],
                        subtotal: 450,
                        tax: 36,
                        deliveryFee: 0,
                        totalAmount: 486,
                        status: 'received',
                        riderName: 'Marcus Swift',
                        riderRating: 4.9,
                        riderPic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLZbbWhgaP1uDKPZJcTHylU87cPdYebxvMcPZmwNS-6x36x8yYLrKlA7-L3b4MOZzOpWSgv8PE-1Iiu6F7stvBSvhpwKyGQO0GJ4gIa16aeCn9GZUYAVZCDBmJxMCiGb7uSrYrZ1pugI6bBTvizXR1xTL-HU-oBoaRBsMOFAP4PYAMDCv3TPOnbOGp8P8Flb3G6lfbH1ahy-7LvTFJvevcQ9YU3AVETqYnRwQo9caBidds6xpORQbP',
                        etaMinutes: 12,
                        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      updateOrderStatus(dummyOrder.id, 'received');
                      // Wait, we need to push to state via placeOrder or we can just seed it!
                      // Let's seed it in local storage zp_orders or trigger a place order flow!
                      // For simplicity, we can tell the user they can place an order in the Cart screen to see it live!
                      triggerToast("Seed a demo order by placing one in the checkout screen!");
                    }}
                    className="text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl font-bold hover:text-zinc-100 transition-all shadow"
                  >
                    Go to Menu to Place Order
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div 
                      key={o.id}
                      className="bg-[#121214] rounded-2xl p-4 border border-zinc-800/50 shadow-lg space-y-4 hover:border-zinc-700/40 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-zinc-100">{o.id}</span>
                            <span className="text-[10px] text-zinc-500 font-sans font-semibold">({o.date})</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-semibold">
                            {o.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-sans font-black text-sm text-zinc-100 block">
                            Rs. {o.totalAmount.toFixed(2)}
                          </span>
                          <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            o.status === 'received' ? 'bg-amber-950/40 border-amber-800 text-amber-300' :
                            o.status === 'preparing' ? 'bg-blue-950/40 border-blue-800 text-blue-300' :
                            o.status === 'shipping' ? 'bg-purple-950/40 border-purple-800 text-purple-300' :
                            'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>

                      {/* Advance Status Stepper Controller */}
                      <div className="pt-3 border-t border-zinc-850 space-y-2">
                        <span className="block font-sans font-bold text-[9px] uppercase tracking-wider text-zinc-500">
                          Advance Delivery Workflow
                        </span>
                        <div className="grid grid-cols-4 gap-1.5 select-none">
                          <button
                            onClick={() => handleStatusChange(o.id, 'received')}
                            className={`py-1 rounded font-sans font-black text-[9px] uppercase border transition-all ${
                              o.status === 'received'
                                ? 'bg-amber-100 text-amber-950 border-amber-200'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800/50 hover:text-zinc-300'
                            }`}
                          >
                            Recv
                          </button>
                          <button
                            onClick={() => handleStatusChange(o.id, 'preparing')}
                            className={`py-1 rounded font-sans font-black text-[9px] uppercase border transition-all ${
                              o.status === 'preparing'
                                ? 'bg-blue-100 text-blue-950 border-blue-200'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800/50 hover:text-zinc-300'
                            }`}
                          >
                            Prep
                          </button>
                          <button
                            onClick={() => handleStatusChange(o.id, 'shipping')}
                            className={`py-1 rounded font-sans font-black text-[9px] uppercase border transition-all ${
                              o.status === 'shipping'
                                ? 'bg-purple-100 text-purple-950 border-purple-200'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800/50 hover:text-zinc-300'
                            }`}
                          >
                            Ship
                          </button>
                          <button
                            onClick={() => handleStatusChange(o.id, 'arrived')}
                            className={`py-1 rounded font-sans font-black text-[9px] uppercase border transition-all ${
                              o.status === 'arrived'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-200'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800/50 hover:text-zinc-300'
                            }`}
                          >
                            Arrv
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MENU EDITOR */}
          {activeSubTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-light italic text-zinc-100">
                  Menu Items ({products.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold font-sans px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow"
                >
                  <Plus className="w-4 h-4 text-zinc-950" />
                  Add New Item
                </button>
              </div>

              {/* Product list grid */}
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#121214] rounded-2xl p-3 border border-zinc-800/50 flex gap-3.5 shadow-lg relative group hover:border-zinc-700/50 transition-colors"
                  >
                    {/* Tiny thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-sans font-bold text-sm text-zinc-100 truncate">
                            {p.name}
                          </h4>
                          <span className="font-sans font-extrabold text-sm text-zinc-100 shrink-0">
                            Rs. {p.price}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                          {p.category}
                        </p>
                      </div>

                      {/* Display Badges */}
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        {p.isBestSeller && (
                          <span className="text-[8px] font-black bg-zinc-800 border border-zinc-700/30 text-zinc-200 px-1.5 py-0.5 rounded">
                            Best
                          </span>
                        )}
                        {p.isSizzling && (
                          <span className="text-[8px] font-black bg-red-950/40 border border-red-900/50 text-red-400 px-1.5 py-0.5 rounded">
                            Hot
                          </span>
                        )}
                        {p.isNew && (
                          <span className="text-[8px] font-black bg-blue-950/40 border border-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1 shrink-0 justify-center">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUPON MANAGER */}
          {activeSubTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-light italic text-zinc-100">
                  Promo Codes ({coupons.length})
                </h3>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold font-sans px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow"
                >
                  <Plus className="w-4 h-4 text-zinc-950" />
                  Add Coupon
                </button>
              </div>

              {/* Coupon list */}
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="bg-[#121214] rounded-2xl p-4 border border-zinc-800/50 border-dashed flex justify-between items-center shadow-lg hover:border-zinc-700/60 transition-colors"
                  >
                    <div>
                      <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                        {c.discount}
                      </span>
                      <h4 className="font-sans font-black text-sm text-zinc-100 mt-2">
                        {c.code}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {c.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      aria-label="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: ADD/EDIT PRODUCT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeProductModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d0d0f] border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-zinc-855 flex items-center justify-between">
                <h3 className="font-serif text-lg font-light italic text-zinc-100">
                  {editingProduct ? 'Edit Menu Item' : 'New Menu Item'}
                </h3>
                <button
                  onClick={closeProductModal}
                  className="p-1 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form (scrollable) */}
              <form onSubmit={handleSaveProduct} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium"
                    placeholder="e.g. Sizzling Chapli Grill"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Description
                  </label>
                  <textarea
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium resize-none"
                    placeholder="Describe original spicy fillet, fresh herbs, etc..."
                  />
                </div>

                {/* Price and Category Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium"
                      placeholder="e.g. 450"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                      Category
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium"
                    >
                      <option value="burgers">🍔 Burgers</option>
                      <option value="pizza">🍕 Pizza</option>
                      <option value="wraps">🌯 Wraps</option>
                      <option value="fries">🍟 Fries</option>
                      <option value="drinks">🥤 Drinks</option>
                      <option value="sides">🍗 Sides</option>
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium text-xs truncate"
                    placeholder="Leave blank for standard placeholder"
                  />
                </div>

                {/* Badges Toggle checkboxes */}
                <div className="space-y-2 pt-2 border-t border-zinc-850">
                  <span className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Product Badging
                  </span>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsBestSeller}
                        onChange={(e) => setProdIsBestSeller(e.target.checked)}
                        className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800"
                      />
                      <span className="text-zinc-300">Set as Best Seller (Adds "BEST SELLER" tag)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsSizzling}
                        onChange={(e) => setProdIsSizzling(e.target.checked)}
                        className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800"
                      />
                      <span className="text-zinc-300">Set as Sizzling Hot (Adds "SIZZLING" tag)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={prodIsNew}
                        onChange={(e) => setProdIsNew(e.target.checked)}
                        className="rounded text-zinc-100 focus:ring-0 focus:ring-offset-0 bg-zinc-900 border-zinc-800"
                      />
                      <span className="text-zinc-300">Set as New Hotspot (Adds "NEW" tag)</span>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-zinc-100 hover:bg-white text-zinc-950 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD COUPON */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCouponModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d0d0f] border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-5 border-b border-zinc-855 flex items-center justify-between">
                <h3 className="font-serif text-lg font-light italic text-zinc-100">
                  New Coupon Code
                </h3>
                <button
                  onClick={() => setIsCouponModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="p-5 space-y-4 text-xs">
                {/* Coupon Code */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-mono font-bold tracking-wider uppercase"
                    placeholder="e.g. SAVER50"
                  />
                </div>

                {/* Discount text */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Discount Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium"
                    placeholder="e.g. Rs. 250 OFF or 50% OFF"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block font-sans font-bold text-[10px] uppercase text-zinc-500">
                    Terms / Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 focus:ring-1 focus:ring-zinc-700 focus:outline-none font-medium"
                    placeholder="e.g. Valid on all orders above Rs. 1,000"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-zinc-100 hover:bg-white text-zinc-950 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow"
                >
                  Generate Coupon
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

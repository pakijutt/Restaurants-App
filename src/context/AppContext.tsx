import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, UserProfile, Order, NavigationTab } from '../types';
import { INITIAL_USER, PRODUCTS } from '../data';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  deleteDoc,
  FirebaseUser
} from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  orders: Order[];
  placeOrder: (deliveryDetails: { name: string; phone: string; address: string }) => Order;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  recentSearches: string[];
  addRecentSearch: (text: string) => void;
  clearRecentSearches: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  coupons: { code: string; discount: string; desc: string }[];
  setCoupons: React.Dispatch<React.SetStateAction<{ code: string; discount: string; desc: string }[]>>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCoupon: (coupon: { code: string; discount: string; desc: string }) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  
  // Firebase Auth additions
  currentUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: (asAdmin?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (name: string, phone: string, address: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zp_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zp_cart');
    if (saved) return JSON.parse(saved);

    // Seed default items shown in Cart/Checkout
    const seedZinger = PRODUCTS.find((p) => p.id === 'zinger-burger');
    const seedFries = PRODUCTS.find((p) => p.id === 'large-fries');

    const defaultCart: CartItem[] = [];
    if (seedZinger) {
      defaultCart.push({
        id: 'seed-zinger',
        product: {
          ...seedZinger,
          price: 7.99,
        },
        quantity: 2,
        customization: 'Extra Cheese, No Onions',
      });
    }
    if (seedFries) {
      defaultCart.push({
        id: 'seed-fries',
        product: {
          ...seedFries,
          price: 4.50,
        },
        quantity: 1,
        customization: 'Peri-Peri Seasoning',
      });
    }
    return defaultCart;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<{ code: string; discount: string; desc: string }[]>([]);

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('zp_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('zp_searches');
    return saved ? JSON.parse(saved) : ['Zinger Combo', 'Chapli Burger', 'Peri Bites'];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync state to local storage for local offline redundancy
  useEffect(() => {
    localStorage.setItem('zp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zp_active_order', JSON.stringify(activeOrder));
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('zp_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Auth Status listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthError(null);
      if (!firebaseUser) {
        setCurrentUser(null);
        setUser(INITIAL_USER);
        setLoading(false);
        return;
      }

      try {
        // Check user document in firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDocSnap;
        try {
          userDocSnap = await getDoc(userDocRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          return;
        }

        const isAdminEmail = firebaseUser.email === 'pakijutt036@gmail.com';

        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as UserProfile;
          // Ensure admin status is synced correctly
          if (isAdminEmail && !data.isAdmin) {
            try {
              await updateDoc(userDocRef, { isAdmin: true });
            } catch (err) {
              handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
            }
            data.isAdmin = true;
          }
          setUser(data);
          setCurrentUser(firebaseUser);
        } else {
          // Create new user profile document
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Zinger Fan',
            profilePic: firebaseUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAJuarxz2r-663VctaZHxS0XvlXAhoGW3F4GrrizGQ3Zcr9R0yNOLwMJdJyQImOGu0TqBUPEwF16wOcbBslZWN91bojOStNO0jD2m92pTyQaj3SOq3gpevU-lEB0ezMBwVl3OmHNNPGNjSsBO1z3ZQrnDbai4lsT0tN6HmolGjyIuIt8dP9KWHIL1KOQ4_z-shQAcWWHyk_h_OKcypU9WYkSzbpgGyG-dvWwZg3W6rz5XISm3TqVsT',
            phone: '',
            address: '',
            tier: 'GOLD', // Premium greeting
            points: 100, // starting gift points
            isAdmin: isAdminEmail
          };
          try {
            await setDoc(userDocRef, newProfile);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
          }
          setUser(newProfile);
          setCurrentUser(firebaseUser);
        }
      } catch (err: any) {
        console.error("Auth sync error:", err);
        setAuthError("Failed to sync profile. Running in offline redundancy mode.");
        // Fallback profile
        setCurrentUser(firebaseUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Products in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        // Seed default products to Firestore
        PRODUCTS.forEach((p) => {
          setDoc(doc(db, 'products', p.id), p)
            .catch((err) => {
              try {
                handleFirestoreError(err, OperationType.WRITE, `products/${p.id}`);
              } catch (e) {
                console.error(e);
              }
            });
        });
        setProducts(PRODUCTS);
      } else {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Product);
        });
        setProducts(list);
      }
    }, (error) => {
      console.error("Products subscription error:", error);
      // fallback
      setProducts(PRODUCTS);
      try {
        handleFirestoreError(error, OperationType.LIST, 'products');
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Coupons in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      if (snapshot.empty) {
        const defaultCoupons = [
          { code: 'ZINGER50', discount: '50% OFF', desc: 'On your next late-night order' },
          { code: 'FREEFRIES', discount: 'FREE LARGE FRIES', desc: 'With any order above Rs. 1,500' },
          { code: 'MIDNIGHT799', discount: 'Rs. 400 OFF', desc: 'Special Midnight Combo deal' },
        ];
        defaultCoupons.forEach((c) => {
          setDoc(doc(db, 'coupons', c.code), c)
            .catch((err) => {
              try {
                handleFirestoreError(err, OperationType.WRITE, `coupons/${c.code}`);
              } catch (e) {
                console.error(e);
              }
            });
        });
        setCoupons(defaultCoupons);
      } else {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setCoupons(list);
      }
    }, (error) => {
      console.error("Coupons subscription error:", error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'coupons');
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Orders in real-time
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    let q;
    const isUserAdmin = user.isAdmin || currentUser.email === 'pakijutt036@gmail.com';

    if (isUserAdmin) {
      // Admin sees all orders
      q = collection(db, 'orders');
    } else {
      // Customer sees only their own orders
      q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Order);
      });

      // Sort descending by date or createdAt
      list.sort((a, b) => {
        const tA = new Date(a.date).getTime() || 0;
        const tB = new Date(b.date).getTime() || 0;
        return tB - tA;
      });

      setOrders(list);

      // Sync active order status changes in real-time
      if (activeOrder) {
        const matched = list.find((o) => o.id === activeOrder.id);
        if (matched) {
          setActiveOrder(matched);
        }
      }
    }, (error) => {
      console.error("Orders subscription error:", error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, [currentUser, user.isAdmin]);

  // Auth Operations
  const signInWithGoogle = async (asAdmin = false) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      
      const isAdminEmail = email === 'pakijutt036@gmail.com';

      if (asAdmin && !isAdminEmail) {
        // Revoke sign in
        await signOut(auth);
        setAuthError("Access Denied: Only designated administrators are permitted.");
        return;
      }

      if (isAdminEmail) {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setAuthError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setActiveTab('home');
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (name: string, phone: string, address: string) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updated = { ...user, name, phone, address };
      await updateDoc(userRef, { name, phone, address });
      setUser(updated);
    } catch (err) {
      console.error("Error updating user profile:", err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const addToCart = (product: Product, quantity = 1, customization?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.customization === customization
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          customization,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (deliveryDetails: { name: string; phone: string; address: string }) => {
    // Optimistic user update
    setUser((prev) => ({
      ...prev,
      name: deliveryDetails.name,
      phone: deliveryDetails.phone,
      address: deliveryDetails.address,
    }));

    // Calculate prices
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const isDollarMode = subtotal < 100;
    const taxRate = 0.08;
    const tax = Number((subtotal * taxRate).toFixed(2));
    const deliveryFee = subtotal > 15 || !isDollarMode ? 0 : 2.50;
    const totalAmount = Number((subtotal + tax + deliveryFee).toFixed(2));

    const newOrder: Order = {
      id: `ZP-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      status: 'received',
      riderName: 'Marcus Swift',
      riderRating: 4.9,
      riderPic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLZbbWhgaP1uDKPZJcTHylU87cPdYebxvMcPZmwNS-6x36x8yYLrKlA7-L3b4MOZzOpWSgv8PE-1Iiu6F7stvBSvhpwKyGQO0GJ4gIa16aeCn9GZUYAVZCDBmJxMCiGb7uSrYrZ1pugI6bBTvizXR1xTL-HU-oBoaRBsMOFAP4PYAMDCv3TPOnbOGp8P8Flb3G6lfbH1ahy-7LvTFJvevcQ9YU3AVETqYnRwQo9caBidds6xpORQbP',
      etaMinutes: 12,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Save to local storage for offline redundancy
    const savedOrders = JSON.parse(localStorage.getItem('zp_orders') || '[]');
    localStorage.setItem('zp_orders', JSON.stringify([newOrder, ...savedOrders]));

    // Async Firestore write
    if (currentUser) {
      setDoc(doc(db, 'orders', newOrder.id), {
        ...newOrder,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      }).catch(err => {
        try {
          handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
        } catch (e) {
          console.error(e);
        }
      });

      // Sync updated user details back to Firestore profile
      updateDoc(doc(db, 'users', currentUser.uid), {
        name: deliveryDetails.name,
        phone: deliveryDetails.phone,
        address: deliveryDetails.address
      }).catch(err => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
        } catch (e) {
          console.error(e);
        }
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setActiveTab('track');

    return newOrder;
  };

  const addRecentSearch = (text: string) => {
    if (!text.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== text.toLowerCase());
      return [text, ...filtered].slice(0, 5);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setActiveOrder((prev) => {
      if (prev && prev.id === orderId) {
        return { ...prev, status };
      }
      return prev;
    });

    // Async write to Firestore
    updateDoc(doc(db, 'orders', orderId), { status })
      .catch((err) => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
        } catch (e) {
          console.error(e);
        }
      });
  };

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      console.error("Error adding product:", err);
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      console.error("Error updating product:", err);
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error("Error deleting product:", err);
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const addCoupon = async (coupon: { code: string; discount: string; desc: string }) => {
    try {
      await setDoc(doc(db, 'coupons', coupon.code), coupon);
    } catch (err) {
      console.error("Error adding coupon:", err);
      handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.code}`);
    }
  };

  const deleteCoupon = async (code: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', code));
    } catch (err) {
      console.error("Error deleting coupon:", err);
      handleFirestoreError(err, OperationType.DELETE, `coupons/${code}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        activeTab,
        setActiveTab,
        orders,
        placeOrder,
        activeOrder,
        setActiveOrder,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        drawerOpen,
        setDrawerOpen,
        products,
        setProducts,
        coupons,
        setCoupons,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        deleteCoupon,
        
        // Firebase Auth exports
        currentUser,
        loading,
        authError,
        signInWithGoogle,
        saveUserProfile,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

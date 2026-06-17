'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Search, Heart, ShoppingBag, Eye, X, Check, ArrowRight, ShieldCheck, HeartOff } from 'lucide-react';
import { getProducts, createOrder } from '@/app/actions';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string | null;
  benefits?: string | null;
  nutrition?: string | null;
  keyHighlights?: string | null;
  keyFeatures?: string | null;
  price: number;
  image: string;
  rating: number;
  stock: number;
  isOrganic: boolean;
}

const PRODUCTS: ProductData[] = [
  {
    id: 'prod_honey_01',
    name: 'Raw Wildflower Honey',
    slug: 'raw-wildflower-honey',
    category: 'Honey',
    price: 450,
    image: '/honey.png',
    description: '100% pure, unpasteurized honey collected directly from wildflower meadows in Himachal Pradesh. Extracted cold to preserve enzymes and active bioflavonoids.',
    benefits: 'Boosts energy naturally, acts as a natural cough suppressant, rich in healing enzymes and antioxidants.',
    nutrition: 'Energy: 304 kcal, Carbohydrates: 82g, Natural Sugars: 80g, Sodium: 4mg (per 100g)',
    rating: 4.9,
    stock: 120,
    isOrganic: true
  },
  {
    id: 'prod_dairy_01',
    name: 'A2 Gir Cow Milk',
    slug: 'a2-gir-cow-milk',
    category: 'Dairy',
    price: 95,
    image: '/dairy.png',
    description: 'Fresh raw A2 milk obtained from grass-fed native Gir cows. Free from chemical growth hormones, antibiotics, or preservation additives.',
    benefits: 'Easily digestible A2 beta-casein protein, rich in calcium and essential amino acids, enhances bone density.',
    nutrition: 'Protein: 3.3g, Fats: 3.8g, Calcium: 120mg, Vitamin D: 40 IU (per 100ml)',
    rating: 4.8,
    stock: 200,
    isOrganic: true
  },
  {
    id: 'prod_oil_01',
    name: 'Cold Pressed Yellow Mustard Oil',
    slug: 'cold-pressed-mustard-oil',
    category: 'Cold Pressed Oils',
    price: 260,
    image: '/oils.png',
    description: 'Wood-pressed (Kachi Ghani) oil extracted from premium organic yellow mustard seeds. Rich in natural aroma and pungent taste.',
    benefits: 'High in Omega-3 and monounsaturated fatty acids, improves digestion, supports cardiovascular health.',
    nutrition: 'Monounsaturated Fats: 60g, Polyunsaturated Fats: 21g, Saturated Fats: 12g (per 100ml)',
    rating: 4.9,
    stock: 90,
    isOrganic: true
  },
  {
    id: 'prod_juice_01',
    name: 'Cold-Pressed Pomegranate Juice',
    slug: 'cold-pressed-pomegranate-juice',
    category: 'Organic Juices',
    price: 180,
    image: '/juices.png',
    description: 'Fresh pomegranate juice extracted using hydraulic cold press. Contains zero added sugars, concentrates, or water.',
    benefits: 'Improves blood circulation, loaded with Vitamin C and potassium, reduces cellular inflammation.',
    nutrition: 'Vitamin C: 45% DV, Potassium: 290mg, Natural Sugars: 12g, Calories: 54 kcal (per 100ml)',
    rating: 4.7,
    stock: 75,
    isOrganic: true
  },
  {
    id: 'prod_fruit_01',
    name: 'Premium Mahabaleshwar Strawberries',
    slug: 'mahabaleshwar-strawberries',
    category: 'Fresh Fruits',
    price: 140,
    image: '/produce.png',
    description: 'Fresh, juicy organic strawberries hand-harvested in the early morning from partner farm clusters in Mahabaleshwar.',
    benefits: 'High fiber content, rich source of vitamin C, helps control glycemic load and supports skin glowing.',
    nutrition: 'Vitamin C: 98% DV, Dietary Fiber: 2.2g, Calories: 32 kcal (per 100g)',
    rating: 4.6,
    stock: 40,
    isOrganic: true
  },
  {
    id: 'prod_veg_01',
    name: 'Sun-Ripened Cherry Tomatoes',
    slug: 'organic-cherry-tomatoes',
    category: 'Fresh Vegetables',
    price: 85,
    image: '/produce.png',
    description: 'Sweet and tangy heirloom cherry tomatoes grown naturally in greenhouse setups. Packed with flavor and juices.',
    benefits: 'Abundant in Lycopene and Vitamin A, supports visual acuity and strengthens arterial walls.',
    nutrition: 'Lycopene: 4.2mg, Vitamin A: 15% DV, Calories: 18 kcal, Sodium: 5mg (per 100g)',
    rating: 4.8,
    stock: 55,
    isOrganic: true
  },
  {
    id: 'prod_dairy_02',
    name: 'Cow Ghee (Bilona Method)',
    slug: 'bilona-cow-ghee',
    category: 'Dairy',
    price: 850,
    image: '/dairy.png',
    description: 'Traditional Vedic Bilona ghee prepared from cultured curd of native cow breeds. Slowly boiled in clay pots.',
    benefits: 'Stimulates digestive fires, rich in fat-soluble vitamins (A, D, E, K), boosts gut health.',
    nutrition: 'Butyric Acid: 4.5g, Healthy Saturated Fats: 99.8g (per 100g)',
    rating: 5.0,
    stock: 140,
    isOrganic: true
  },
  {
    id: 'prod_pickle_01',
    name: 'Organic Spiced Mango Pickle',
    slug: 'organic-mango-pickle',
    category: 'Pickles',
    price: 210,
    image: '/produce.png',
    description: 'Handmade, sun-dried green mango slices pickled in wood-pressed mustard oil, fenugreek, and home-ground spices.',
    benefits: 'Contains natural gut-friendly probiotic bacteria, aids digestion, contains zero chemical colors.',
    nutrition: 'Sodium: 240mg, Vitamin C: 12% DV, Carbohydrates: 3g (per 15g serving)',
    rating: 4.9,
    stock: 110,
    isOrganic: true
  },
  {
    id: 'prod_ghee_01',
    name: 'Vedic Gir Cow A2 Ghee',
    slug: 'vedic-gir-cow-a2-ghee',
    category: 'Vedic Ghee',
    price: 1450,
    image: '/dairy.png',
    description: 'Premium A2 ghee prepared strictly via the traditional Vedic Bilona curd-churning method. Handcrafted in Rajasthan from native Gir cows.',
    benefits: 'Enhances cognitive health, lubricates joints, aids fat-soluble vitamin absorption, high smoke point.',
    nutrition: 'Butyric Acid: 4.8g, Cultured Milk Fats: 99.8g, Saturated Fats: 68g (per 100g)',
    rating: 5.0,
    stock: 80,
    isOrganic: true
  },
  {
    id: 'prod_ghee_02',
    name: 'Vedic Cultured Buffalo Ghee',
    slug: 'vedic-cultured-buffalo-ghee',
    category: 'Vedic Ghee',
    price: 950,
    image: '/dairy.png',
    description: 'Aromatic Vedic Bilona ghee handcrafted from the cultured curd of grass-fed Murrah buffaloes in Behror.',
    benefits: 'Excellent source of healthy fats, promotes robust immunity, nourishes skin tissues.',
    nutrition: 'Murrah Buffalo Curd Fats: 99.7g, Conjugated Linoleic Acid: 1.2g (per 100g)',
    rating: 4.9,
    stock: 95,
    isOrganic: true
  },
  {
    id: 'prod_spice_01',
    name: 'Stone-Ground Organic Turmeric',
    slug: 'stone-ground-organic-turmeric',
    category: 'Organic Spices',
    price: 125,
    image: '/produce.png',
    description: 'Dry turmeric rhizomes slowly stone-ground (Chakki method) at low temperatures to retain high curcumin levels.',
    benefits: 'Powerful anti-inflammatory agent, active cell antioxidant, enhances natural skin glow.',
    nutrition: 'Curcumin Active: 4.8%, Dietary Fiber: 21g, Iron: 41mg (per 100g)',
    rating: 4.9,
    stock: 180,
    isOrganic: true
  },
  {
    id: 'prod_spice_02',
    name: 'Stone-Ground Kashmiri Chilli',
    slug: 'stone-ground-kashmiri-chilli',
    category: 'Organic Spices',
    price: 180,
    image: '/produce.png',
    description: 'Premium Kashmiri red chillies stone-ground slowly. Imparts rich deep red color with a mild, smoky heat.',
    benefits: 'Boosts metabolic rate, aids respiratory pathways, rich in Beta-Carotene and Vitamin A.',
    nutrition: 'Capsaicin Level: Mild, Vitamin A: 85% DV, Potassium: 340mg (per 100g)',
    rating: 4.8,
    stock: 150,
  }
];

const CATEGORY_INFOS = [
  { name: 'All', title: 'All Products', desc: 'Full Catalog', image: '/produce.png' },
  { name: 'Dairy', title: 'Farm Dairy', desc: 'Grass-fed Fresh Milk', image: '/dairy.png' },
  { name: 'Vedic Ghee', title: 'Traditional Vedic Ghee', desc: 'Bilona Churned Ghee', image: '/dairy.png' },
  { name: 'Honey', title: 'Raw Wild Honey', desc: 'Himachal Hives', image: '/honey.png' },
  { name: 'Cold Pressed Oils', title: 'Kachi Ghani Oils', desc: 'Wood-pressed seeds', image: '/oils.png' },
  { name: 'Organic Juices', title: 'Hydraulic Juices', desc: 'Fresh fruits, zero sugar', image: '/juices.png' },
  { name: 'Fresh Fruits', title: 'Seasonal Fruits', desc: 'Orchard fresh harvest', image: '/produce.png' },
  { name: 'Fresh Vegetables', title: 'Greenhouse Veggies', desc: 'Greenhouse pesticide-free', image: '/produce.png' },
  { name: 'Organic Spices', title: 'Stone-Ground Spices', desc: 'Aromatic chakki spices', image: '/produce.png' },
  { name: 'Pickles', title: 'Handcrafted Pickles', desc: 'Fermented naturally', image: '/produce.png' }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const { addToCart, wishlist, toggleWishlist, cart, clearCart } = useCartStore();

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [activeStore, setActiveStore] = useState<'normal' | 'organic'>('normal');

  // Wishlist and Checkout view states
  const showWishlistOnly = searchParams.get('wishlist') === 'true';
  const showCheckout = searchParams.get('checkout') === 'true';

  // Checkout Form states
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    payment: 'COD'
  });
  const [orderTrackCode, setOrderTrackCode] = useState('');

  const categories = ['All', 'Fresh Fruits', 'Fresh Vegetables', 'Dairy', 'Vedic Ghee', 'Honey', 'Organic Juices', 'Cold Pressed Oils', 'Organic Spices', 'Pickles'];

  // Load products from DB
  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      setErrorMsg('');
      try {
        const data = await getProducts();
        setProducts(data as any);
      } catch (err: any) {
        console.error('Failed to load products:', err);
        setErrorMsg(err.message || 'Database connection error. Please ensure the database is running.');
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  // Pre-populate shipping info from session profile
  useEffect(() => {
    if (showCheckout && session?.user) {
      const fetchProfile = async () => {
        try {
          const userId = (session.user as any).id;
          const res = await fetch(`/api/user?id=${userId}`);
          if (res.ok) {
            const dbUser = await res.json();
            if (dbUser) {
              setShippingInfo((prev) => ({
                ...prev,
                name: dbUser.name || session.user?.name || prev.name,
                phone: dbUser.phone || prev.phone,
                address: dbUser.address || prev.address,
                city: dbUser.city || prev.city,
                state: dbUser.state || prev.state,
                zip: dbUser.zip || prev.zip,
              }));
            }
          }
        } catch (err) {
          console.error('Failed to pre-populate shipping info:', err);
        }
      };
      fetchProfile();
    }
  }, [showCheckout, session]);


  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesStore = activeStore === 'organic' ? p.isOrganic === true : p.isOrganic === false;
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (p.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesWishlist = !showWishlistOnly || wishlist.includes(p.id);
    return matchesStore && matchesCat && matchesSearch && matchesWishlist;
  });

  const handleProductClick = (product: ProductData) => {
    setSelectedProduct(product);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty. Please add items to proceed.');
      return;
    }

    setIsCheckoutSubmitting(true);
    setCheckoutError('');

    const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zip}. Receiver: ${shippingInfo.name}, Phone: ${shippingInfo.phone}`;

    const res = await createOrder({
      userId: (session?.user as any)?.id,
      userEmail: session?.user?.email || undefined,
      shippingAddress: fullAddress,
      discountApplied: 0, // In a future step, can integrate coupon state in store
      couponCode: undefined,
      paymentMethod: shippingInfo.payment,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    });

    setIsCheckoutSubmitting(false);
    if (res.success) {
      setOrderTrackCode(res.orderId || '');
      setCheckoutStep(3); // success view
      clearCart();
    } else {
      setCheckoutError(res.error || 'Failed to place your order.');
    }
  };

  // Reset category on wishlist toggle
  useEffect(() => {
    if (showWishlistOnly) {
      setActiveCategory('All');
    }
  }, [showWishlistOnly]);

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIEW 1: CHECKOUT SCREEN */}
        {showCheckout ? (
          !session ? (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6 my-12 animate-zoom-in">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-league font-black text-spruce tracking-wide">Login Required</h2>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  For security, tracking, and personalized delivery, checkout is restricted to registered customers. Please sign in or create a new account to proceed with your order.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => router.push('/login?callbackUrl=/products?checkout=true')}
                  className="w-full py-3.5 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-primary-light transition-all shadow-sm cursor-pointer"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full py-3.5 border border-gray-200 text-spruce font-league font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-league font-black text-spruce">Secure Agri-Checkout</h2>
              <button 
                onClick={() => router.push('/products')} 
                className="text-gray-400 hover:text-spruce"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper indicators */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span className={checkoutStep >= 1 ? 'text-primary' : ''}>1. SHIPPING</span>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <span className={checkoutStep >= 2 ? 'text-primary' : ''}>2. PAYMENT</span>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <span className={checkoutStep === 3 ? 'text-primary' : ''}>3. TRACKING</span>
            </div>

            {checkoutError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl text-center font-semibold">
                {checkoutError}
              </div>
            )}

            {checkoutStep === 1 && (
              <form onSubmit={() => setCheckoutStep(2)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Receiver Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Mahesh Rao"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 96606 86394"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Shipping Address</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Behror Hub, Industrial Area"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Behror"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                    <input
                      type="text"
                      required
                      placeholder="Rajasthan"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pin Code</label>
                    <input
                      type="text"
                      required
                      placeholder="122001"
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {checkoutStep === 2 && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6 pt-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase">Select Payment Method</label>
                  
                  <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-offwhite cursor-pointer hover:border-primary/20 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      checked={shippingInfo.payment === 'COD'}
                      onChange={() => setShippingInfo({...shippingInfo, payment: 'COD'})}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-spruce block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-gray-500">Pay cash/UPI directly at your doorstep on delivery.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-offwhite cursor-pointer hover:border-primary/20 transition-all opacity-60">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-spruce block">Online Payment (UPI/Cards) [Maintenance]</span>
                      <span className="text-xs text-gray-500">Temporarily offline for integration. Please use COD.</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="flex-1 py-3 border border-gray-200 text-spruce font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckoutSubmitting}
                    className="flex-1 py-3 bg-accent text-spruce font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-accent-light transition-all shadow-md disabled:opacity-50"
                  >
                    {isCheckoutSubmitting ? 'Placing Order...' : 'Place Secure Order'}
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 3 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-league font-black text-spruce">Order Placed Successfully!</h3>
                  <p className="text-sm text-gray-500">Your fresh harvest organic items are now being packaged.</p>
                </div>

                <div className="p-6 bg-offwhite border border-gray-100 rounded-2xl max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>TRACKING CODE:</span>
                    <span className="font-bold text-spruce">{orderTrackCode}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ESTIMATED DELIVERY:</span>
                    <span className="font-bold text-primary">Tomorrow morning</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>DELIVERY METHOD:</span>
                    <span className="font-bold text-spruce">Fresh Cold Chain</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      router.push('/products');
                    }}
                    className="px-6 py-2.5 bg-primary text-white font-league font-bold tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all text-xs"
                  >
                    Return to Store
                  </button>
                </div>
              </div>
            )}

          </div>
          )
        ) : (
          
          /* VIEW 2: NORMAL CATALOG SCREEN */
          <>
            {/* Header */}
            <section className="text-center py-10 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-league font-black text-spruce tracking-tight">
                {showWishlistOnly 
                  ? 'Your Saved Products' 
                  : (activeStore === 'organic' ? 'Organic Store' : 'Prithvora Agri-Store')}
              </h1>
              <p className="text-sm text-gray-500 max-w-xl mx-auto">
                {showWishlistOnly 
                  ? 'Your handpicked selections ready to be ordered.'
                  : (activeStore === 'organic' 
                      ? 'Preview our certified 100% pesticide-free, single-origin organic crops. Fresh from Rajasthan farms.' 
                      : 'Pure and premium selected agricultural products direct from farmers. Cold-chain fresh.')}
              </p>
            </section>

            {/* Store Type Switcher */}
            {!showWishlistOnly && (
              <div className="flex justify-center mb-8">
                <div className="bg-spruce/5 p-1 rounded-full border border-spruce/10 flex gap-1.5 w-full max-w-xs sm:max-w-md shadow-inner">
                  <button
                    onClick={() => {
                      setActiveStore('normal');
                      setActiveCategory('All');
                    }}
                    className={`flex-1 px-5 py-2.5 rounded-full text-xs font-bold font-league tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                      activeStore === 'normal'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-spruce hover:bg-spruce/5'
                    }`}
                  >
                    Normal Products
                  </button>
                  <button
                    onClick={() => {
                      setActiveStore('organic');
                      setActiveCategory('All');
                    }}
                    className={`flex-1 px-5 py-2.5 rounded-full text-xs font-bold font-league tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeStore === 'organic'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-spruce hover:bg-spruce/5'
                    }`}
                  >
                    Organic Store
                    <span className="bg-accent/20 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-normal">
                      Soon
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Organic Store Coming Soon Banner */}
            {activeStore === 'organic' && !showWishlistOnly && (
              <div className="relative overflow-hidden bg-gradient-to-br from-spruce to-[#070e09] border border-accent/20 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl animate-fade-in">
                {/* Decorative glowing blobs */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-2xl space-y-6 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-accent/20">
                    🌾 Harvesting Soon
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-league font-black text-white leading-none tracking-tight">
                    The Prithvora Organic Store
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
                    We are building a direct supply chain of 100% certified pesticide-free organic grains, pulses, cold-pressed oils, and raw honey. Our partner clusters in Alwar and Udaipur are completing their organic compliance certifications.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center sm:justify-start">
                    <div className="flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                      <span>Expected Launch: July 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm">
                      <span>Previewing upcoming range below. Add to wishlist!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar / Category Grid Banners */}
            <div className="space-y-6 mb-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {CATEGORY_INFOS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setActiveCategory(c.name);
                      router.push('/products');
                    }}
                    className={`p-4 rounded-3xl border transition-all text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-xs cursor-pointer ${
                      activeCategory === c.name && !showWishlistOnly
                        ? 'border-primary bg-primary text-white shadow-md font-bold'
                        : 'border-gray-100 bg-white hover:border-primary/20 text-spruce'
                    }`}
                  >
                    <div className="z-10">
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                        activeCategory === c.name && !showWishlistOnly ? 'text-accent-light' : 'text-primary'
                      }`}>{c.desc}</span>
                      <span className="font-league font-black text-base tracking-wide block mt-1 leading-tight">{c.title}</span>
                    </div>
                    {/* Background Image floating on the bottom right */}
                    <img 
                      src={c.image} 
                      alt={c.title} 
                      className={`absolute -bottom-2 -right-2 w-16 h-16 object-contain z-0 transition-all duration-300 group-hover:scale-110 ${
                        activeCategory === c.name && !showWishlistOnly ? 'opacity-30' : 'opacity-15'
                      }`} 
                    />
                  </button>
                ))}
              </div>

              {/* Search Box / Filter Summary */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <div className="text-xs font-bold text-spruce/60 flex items-center gap-1.5">
                  Showing: <span className="text-primary font-black uppercase tracking-wider">{showWishlistOnly ? 'Wishlist' : activeCategory} Products</span>
                  <span className="text-gray-300">|</span>
                  <span>{filteredProducts.length} Items Found</span>
                </div>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-offwhite/50"
                  />
                </div>
              </div>
            </div>

            {/* Grid display */}
            {errorMsg ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-red-100 max-w-xl mx-auto space-y-4 my-8 p-8 animate-zoom-in">
                <div className="w-12 h-12 bg-red-50 rounded-full flex justify-center items-center text-red-500 mx-auto">
                  <X className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-league font-bold text-spruce">Database Connection Issue</h3>
                  <p className="text-xs text-red-600 leading-relaxed font-semibold">{errorMsg}</p>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                    We could not retrieve products from the database server. Please verify your connection status and ensure the database is running.
                  </p>
                </div>
              </div>
            ) : loadingProducts ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-offwhite rounded-full flex justify-center items-center text-primary mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-league font-bold text-spruce">No products found</h3>
                  <p className="text-sm text-gray-400 mt-1">Try tweaking your search terms or category selections.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {/* Loop categories to draw sections */}
                {(showWishlistOnly || activeCategory !== 'All' 
                  ? [activeCategory === 'All' ? 'All' : activeCategory] 
                  : categories.filter(c => c !== 'All')
                ).map((catName) => {
                  const sectionProducts = showWishlistOnly || activeCategory !== 'All' 
                    ? filteredProducts 
                    : filteredProducts.filter(p => p.category === catName);

                  if (sectionProducts.length === 0) return null;

                  const sectionInfo = CATEGORY_INFOS.find(ci => ci.name === catName) || { title: catName, desc: 'Fresh farm products' };

                  return (
                    <div key={catName} className="space-y-6">
                      {/* Section header (only when showing all) */}
                      {activeCategory === 'All' && !showWishlistOnly && (
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <div className="space-y-1">
                            <h2 className="font-league font-black text-2xl tracking-wide text-spruce uppercase">{sectionInfo.title}</h2>
                            <p className="text-xs text-gray-400 font-medium">{sectionInfo.desc}</p>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {sectionProducts.length} Items
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sectionProducts.map((p) => {
                          const isWished = wishlist.includes(p.id);
                          return (
                            <div 
                              key={p.id}
                              className="bg-white rounded-3xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                            >
                              {/* Image container */}
                              <div className="relative aspect-square bg-offwhite flex items-center justify-center p-6 border-b border-gray-50/50">
                                <Link href={`/products/${p.slug}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                                  <img 
                                    src={p.image} 
                                    alt={p.name} 
                                    className="object-contain w-36 h-36 group-hover:scale-105 transition-transform duration-300"
                                  />
                                </Link>
                                
                                {/* Organic Badge */}
                                {p.isOrganic && (
                                  <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Organic
                                  </span>
                                )}

                                {/* Wishlist action button */}
                                <button
                                  onClick={() => toggleWishlist(p.id)}
                                  className="absolute top-4 right-4 p-2 bg-white rounded-full border border-gray-100 hover:text-red-500 text-gray-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
                                >
                                  <Heart className={`w-4.5 h-4.5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Link 
                                    href={`/products/${p.slug}`}
                                    className="p-3 bg-white text-spruce rounded-full shadow-lg hover:text-primary transition-colors cursor-pointer"
                                    title="View Full Details"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </Link>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-5 space-y-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">{p.category}</span>
                                  <Link href={`/products/${p.slug}`} className="cursor-pointer block">
                                    <h3 className="font-bold text-spruce leading-snug text-sm tracking-wide group-hover:text-primary transition-colors line-clamp-1">
                                      {p.name}
                                    </h3>
                                  </Link>
                                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mt-1">
                                    {p.description}
                                  </p>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                  <span className="text-lg font-black text-spruce">₹{p.price}</span>
                                  {p.isOrganic ? (
                                    <button
                                      disabled
                                      className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl border border-gray-200 cursor-not-allowed flex items-center gap-1.5"
                                    >
                                      Coming Soon
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(p, 1)}
                                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <ShoppingBag className="w-3.5 h-3.5" />
                                      Add to Cart
                                    </button>
                                  )}
                                </div>

                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedProduct(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 shadow-2xl z-10 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto animate-zoom-in">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Image and price */}
            <div className="md:w-1/2 space-y-4 flex flex-col justify-center items-center">
              <div className="w-full aspect-square bg-offwhite rounded-2xl flex items-center justify-center p-8 border border-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="object-contain w-44 h-44" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-2xl font-black text-spruce">₹{selectedProduct.price}</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Packaging Price</p>
              </div>
            </div>

            {/* Right side: Detailed properties */}
            <div className="md:w-1/2 space-y-5 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{selectedProduct.category}</span>
                  <h3 className="text-xl font-league font-black text-spruce tracking-wide leading-tight mt-0.5">
                    {selectedProduct.name}
                  </h3>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Benefits box */}
                <div className="p-3 bg-green-50/50 border border-green-100/50 rounded-xl space-y-1">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">Health Benefits</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{selectedProduct.benefits}</p>
                </div>

                {/* Nutrition table */}
                <div className="p-3 bg-offwhite border border-gray-100 rounded-xl space-y-1">
                  <h4 className="text-[10px] font-bold text-spruce uppercase tracking-wider">Nutritional Breakdown</h4>
                  <p className="text-[11px] text-gray-500 italic">{selectedProduct.nutrition}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {selectedProduct.isOrganic ? (
                  <button
                    disabled
                    className="flex-1 py-3 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200 flex items-center justify-center gap-2"
                  >
                    Coming Soon (Harvesting)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add To Basket
                  </button>
                )}
                <button
                  onClick={() => {
                    toggleWishlist(selectedProduct.id);
                  }}
                  className="p-3 border border-gray-200 hover:text-red-500 text-gray-500 rounded-xl hover:bg-gray-50 transition-all"
                  title="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

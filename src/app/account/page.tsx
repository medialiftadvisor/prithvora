'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Search, 
  Loader, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Save, 
  LogOut, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Phone
} from 'lucide-react';
import { getUserOrders, updateUserProfile, getOrderById } from '@/app/actions';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface OrderData {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date | string;
  items: OrderItem[];
}

function AccountContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Profile fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Orders list
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Active tracking order
  const [activeTrackOrder, setActiveTrackOrder] = useState<OrderData | null>(null);

  // Public Search Tracker
  const [searchTrackId, setSearchTrackId] = useState('');
  const [searchTrackLoading, setSearchTrackLoading] = useState(false);
  const [searchTrackError, setSearchTrackError] = useState('');

  // Fetch orders and profile details
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const email = session.user.email;
      
      // Load user profile details from the database
      const loadProfileAndOrders = async () => {
        setOrdersLoading(true);
        try {
          const userOrders = await getUserOrders((session.user as any).id);
          setOrders(userOrders as any);

          // Get profile details directly from session if present
          setName(session.user.name || '');
          
          // Fetch user details from database to populate profile inputs
          const res = await fetch(`/api/user?id=${(session.user as any).id}`);
          if (res.ok) {
            const dbUser = await res.json();
            if (dbUser) {
              setPhone(dbUser.phone || '');
              setAddress(dbUser.address || '');
              setCity(dbUser.city || '');
              setState(dbUser.state || '');
              setZip(dbUser.zip || '');
            }
          }
        } catch (err) {
          console.error('Failed to load profile details:', err);
        } finally {
          setOrdersLoading(false);
        }
      };

      loadProfileAndOrders();
    }
  }, [status, session]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await updateUserProfile((session?.user as any).id, {
        name,
        phone,
        address,
        city,
        state,
        zip
      });

      if (res.success) {
        setProfileSuccess('Profile details successfully updated!');
        setIsEditing(false);
        // Force refresh session credentials client-side
        await update();
      } else {
        setProfileError(res.error || 'Failed to update profile details.');
      }
    } catch (err) {
      setProfileError('An unexpected error occurred.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTrackSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackId.trim()) return;

    setSearchTrackLoading(true);
    setSearchTrackError('');
    setActiveTrackOrder(null);

    try {
      const order = await getOrderById(searchTrackId.trim());
      if (order) {
        setActiveTrackOrder(order as any);
      } else {
        setSearchTrackError('No order found with the provided tracking code.');
      }
    } catch (err) {
      setSearchTrackError('Failed to fetch order details. Check network connection.');
    } finally {
      setSearchTrackLoading(false);
    }
  };

  const getStatusStep = (orderStatus: string) => {
    switch (orderStatus) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-offwhite">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Account Dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated view
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-offwhite px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce">Sign In to Continue</h2>
            <p className="text-sm text-gray-400">
              Access your personal account, saved shipping addresses, order histories, and real-time cold-chain tracking.
            </p>
          </div>

          <button
            onClick={() => router.push('/login?callbackUrl=/account')}
            className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-primary-light transition-all cursor-pointer shadow-md"
          >
            Log In to Agriverse
          </button>

          {/* Quick guest tracking tool */}
          <div className="border-t border-gray-100 pt-6 space-y-4 text-left">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Or track guest order</span>
            
            {searchTrackError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 text-center font-semibold">
                {searchTrackError}
              </div>
            )}

            <form onSubmit={handleTrackSearchSubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Tracking Order ID"
                value={searchTrackId}
                onChange={(e) => setSearchTrackId(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
              />
              <button
                type="submit"
                disabled={searchTrackLoading}
                className="px-4 py-2 bg-accent text-spruce rounded-xl font-bold text-xs hover:bg-accent-light cursor-pointer transition-all flex items-center gap-1.5"
              >
                {searchTrackLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Track
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite min-h-screen py-8 sm:py-12 text-spruce font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page title / Session Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
              Agriverse Customer
            </span>
            <h1 className="text-3xl font-league font-black text-spruce leading-tight">
              Sauda, {session?.user?.name || 'Customer'}
            </h1>
            <p className="text-xs text-gray-400">
              Manage your profile, shipping coordinates, and monitor fresh harvest orders.
            </p>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 border border-gray-200 hover:text-red-500 hover:border-red-100 hover:bg-red-50/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </section>

        {/* Dynamic Order tracking highlight */}
        {activeTrackOrder && (
          <div className="bg-spruce text-white p-6 sm:p-8 rounded-3xl border border-white/5 shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">Live Tracking Board</span>
                <h3 className="font-league font-black text-xl tracking-wide mt-0.5">Order ID: #{activeTrackOrder.id}</h3>
              </div>
              <button 
                onClick={() => {
                  setActiveTrackOrder(null);
                  setSearchTrackId('');
                }}
                className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
              >
                Close Tracking
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-4 gap-2 relative z-10">
              {[
                { label: 'Placed', icon: Clock, desc: 'Awaiting harvest packaging' },
                { label: 'Behror Sourcing', icon: Package, desc: 'Aggregated & chilled' },
                { label: 'In Transit', icon: Truck, desc: 'Cold-chain dispatch' },
                { label: 'Delivered', icon: CheckCircle2, desc: 'At your doorstep' }
              ].map((step, idx) => {
                const isActive = idx <= getStatusStep(activeTrackOrder.status) && activeTrackOrder.status !== 'CANCELLED';
                const StepIcon = step.icon;

                return (
                  <div key={idx} className="text-center space-y-2 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isActive 
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105' 
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`block text-xs font-bold uppercase tracking-wider ${isActive ? 'text-accent' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="hidden md:block text-[9px] text-gray-400 leading-normal max-w-[120px] mx-auto mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address & Items summary inside tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 relative z-10 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-accent uppercase tracking-wider block">Delivery Destination</span>
                <p className="text-gray-300 leading-relaxed max-w-sm bg-white/5 p-3.5 rounded-xl border border-white/5">
                  {activeTrackOrder.shippingAddress}
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-bold text-accent uppercase tracking-wider block font-league">Items In This Package</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                  {activeTrackOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2">
                        <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-contain bg-white rounded-md p-1" />
                        <span className="font-bold line-clamp-1">{item.product.name}</span>
                      </div>
                      <span className="font-mono text-gray-400 font-bold">Qty {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping Address & Profile details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-primary font-league">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-wider">Default Coordinates</h3>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
              </div>

              {profileSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  {profileError}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+91 96606 86394"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Address</label>
                    <textarea
                      rows={3}
                      placeholder="Street address, house number"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">City</label>
                      <input
                        type="text"
                        placeholder="Behror"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">State</label>
                      <input
                        type="text"
                        placeholder="Rajasthan"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pin Code</label>
                    <input
                      type="text"
                      placeholder="122001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-lg font-bold text-center text-xs uppercase tracking-wider hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="flex-1 py-2.5 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary-light flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {profileLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs font-semibold leading-relaxed">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400 uppercase tracking-wider">Contact Email:</span>
                    <span className="text-spruce font-mono font-bold">{session.user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400 uppercase tracking-wider">Linked Phone:</span>
                    <span className="text-spruce">{phone || <span className="italic text-gray-400">Not provided</span>}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase tracking-wider block">Shipping Coordinate Location:</span>
                    <p className="p-3.5 bg-offwhite border border-gray-100 rounded-2xl text-gray-600 leading-relaxed font-normal">
                      {address ? (
                        <>
                          {address}<br />
                          {city}, {state} - {zip}
                        </>
                      ) : (
                        <span className="italic text-gray-400">No default shipping coordinates configured yet. Click edit to save details.</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Guest tracker search inside account */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block font-league">Track Any Order Code</span>
              <form onSubmit={handleTrackSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter Tracking Order ID"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  className="flex-grow px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                />
                <button
                  type="submit"
                  disabled={searchTrackLoading}
                  className="px-4 py-2.5 bg-accent text-spruce rounded-xl font-bold text-xs hover:bg-accent-light cursor-pointer transition-all flex items-center gap-1.5"
                >
                  {searchTrackLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Right: Order history */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-primary font-league">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-black text-lg uppercase tracking-wider">Purchase History</h3>
            </div>

            {ordersLoading ? (
              <div className="py-12 flex justify-center">
                <Loader className="w-7 h-7 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-offwhite rounded-full flex justify-center items-center text-primary mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-spruce">No orders placed yet</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Your shopping cart is empty. Sourced dairy, cold-pressed oils, and raw honey will appear here once purchased.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {orders.map((o) => (
                  <div 
                    key={o.id}
                    className="p-4 bg-offwhite hover:bg-offwhite/70 border border-gray-100 hover:border-primary/20 rounded-2xl flex flex-wrap justify-between items-center gap-4 transition-all"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest block">
                        Order #{o.id}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Placed: {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex gap-2 text-xs font-bold pt-1">
                        <span className="text-spruce">₹{o.totalAmount}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-primary">{o.items.length} Products</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Badge status */}
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                        o.status === 'DELIVERED' 
                          ? 'bg-green-50 border-green-100 text-green-700' 
                          : o.status === 'CANCELLED' 
                          ? 'bg-red-50 border-red-100 text-red-700'
                          : 'bg-yellow-50 border-yellow-100 text-yellow-700'
                      }`}>
                        {o.status}
                      </span>

                      <button
                        onClick={() => {
                          setActiveTrackOrder(o);
                          // Scroll to track component
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-light cursor-pointer transition-all flex items-center gap-1 uppercase tracking-wider shadow-xs"
                      >
                        Track
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}

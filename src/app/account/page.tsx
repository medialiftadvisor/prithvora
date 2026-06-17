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
  Phone,
  Sprout,
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
  Award,
  Layers,
  Star,
  Users,
  Settings,
  ShieldCheck,
  Building,
  Activity,
  Briefcase
} from 'lucide-react';
import { 
  getUserOrders, 
  updateUserProfile, 
  getOrderById, 
  getUserDashboardRoles,
  requestFarmerRole,
  requestPartnerRole,
  requestInvestorRole,
  updateFarmerProductInventory,
  submitDashboardFeedback
} from '@/app/actions';

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'farmer' | 'partner' | 'investor' | 'requests'>('profile');

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

  // Multi-Role Dashboard States
  const [dashboardRoles, setDashboardRoles] = useState<{
    farmer: any;
    partner: any;
    investorLead: any;
  } | null>(null);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Role Request states
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  // 1. Farmer Request Form
  const [farmerFullName, setFarmerFullName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerState, setFarmerState] = useState('Rajasthan');
  const [farmerDistrict, setFarmerDistrict] = useState('');
  const [farmerSizeAcres, setFarmerSizeAcres] = useState('');
  const [farmerPrimaryCrops, setFarmerPrimaryCrops] = useState('');
  const [farmerProcurementModel, setFarmerProcurementModel] = useState('Contract Farming');

  // 2. Partner Request Form
  const [partnerFullName, setPartnerFullName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCompanyName, setPartnerCompanyName] = useState('');
  const [partnerTier, setPartnerTier] = useState<'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'>('SILVER');
  const [partnerExperienceYears, setPartnerExperienceYears] = useState('');
  const [partnerInvestmentBudget, setPartnerInvestmentBudget] = useState('');

  // 3. Investor Request Form
  const [investorFullName, setInvestorFullName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorPhone, setInvestorPhone] = useState('');
  const [investorRange, setInvestorRange] = useState('$10k-$50k');
  const [investorAccredited, setInvestorAccredited] = useState(false);
  const [investorMessage, setInvestorMessage] = useState('');

  // Feedback states
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // Farmer inventory editing states
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventorySuccess, setInventorySuccess] = useState('');

  // Load user profile details, roles, and orders from database
  const loadProfileAndData = async () => {
    if (status !== 'authenticated' || !session?.user) return;
    setOrdersLoading(true);
    setRolesLoading(true);
    try {
      const userEmail = session.user.email;
      if (!userEmail) return;

      const userOrders = await getUserOrders(userEmail);
      setOrders(userOrders as any);

      // Get profile details directly from session if present
      setName(session.user.name || '');

      // Try fetching by ID first, fallback to email if ID is missing or mock
      const userId = (session.user as any).id;
      const queryParam = (userId && !userId.startsWith('mock-')) ? `id=${userId}` : `email=${encodeURIComponent(userEmail)}`;
      const res = await fetch(`/api/user?${queryParam}`);
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

      // Load linked roles
      const rolesRes = await getUserDashboardRoles(userEmail);
      if (rolesRes.success && rolesRes.roles) {
        setDashboardRoles(rolesRes.roles);
      }
    } catch (err) {
      console.error('Failed to load profile details & roles:', err);
    } finally {
      setOrdersLoading(false);
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndData();
  }, [status, session]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error("Not logged in");

      const res = await updateUserProfile(userEmail, {
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

  // Farmer application submit
  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestSuccess('');
    setRequestError('');
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error("You must be logged in.");

      const res = await requestFarmerRole(userEmail, {
        fullName: farmerFullName,
        phone: farmerPhone,
        state: farmerState,
        district: farmerDistrict,
        farmSizeAcres: Number(farmerSizeAcres),
        primaryCrops: farmerPrimaryCrops,
        procurementModel: farmerProcurementModel,
      });

      if (res.success) {
        setRequestSuccess('Your Farmer Application has been submitted successfully! Status: PENDING.');
        // reset form
        setFarmerFullName('');
        setFarmerPhone('');
        setFarmerDistrict('');
        setFarmerSizeAcres('');
        setFarmerPrimaryCrops('');
        // reload roles
        await loadProfileAndData();
      } else {
        setRequestError(res.error || 'Failed to submit farmer request.');
      }
    } catch (err: any) {
      setRequestError(err.message || 'An error occurred during submission.');
    } finally {
      setRequestLoading(false);
    }
  };

  // Partner application submit
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestSuccess('');
    setRequestError('');
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error("You must be logged in.");

      const res = await requestPartnerRole(userEmail, {
        fullName: partnerFullName,
        email: partnerEmail,
        phone: partnerPhone,
        companyName: partnerCompanyName,
        tier: partnerTier,
        experienceYears: Number(partnerExperienceYears),
        investmentBudget: Number(partnerInvestmentBudget),
      });

      if (res.success) {
        setRequestSuccess('Your Franchise Partner Application has been submitted successfully! Status: PENDING.');
        setPartnerFullName('');
        setPartnerEmail('');
        setPartnerPhone('');
        setPartnerCompanyName('');
        setPartnerExperienceYears('');
        setPartnerInvestmentBudget('');
        await loadProfileAndData();
      } else {
        setRequestError(res.error || 'Failed to submit partner request.');
      }
    } catch (err: any) {
      setRequestError(err.message || 'An error occurred.');
    } finally {
      setRequestLoading(false);
    }
  };

  // Investor application submit
  const handleInvestorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestSuccess('');
    setRequestError('');
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error("You must be logged in.");

      const res = await requestInvestorRole(userEmail, {
        fullName: investorFullName,
        email: investorEmail,
        phone: investorPhone,
        investmentRange: investorRange,
        accreditedStatus: investorAccredited,
        message: investorMessage,
      });

      if (res.success) {
        setRequestSuccess('Your Investor Profile has been submitted successfully! Under Review.');
        setInvestorFullName('');
        setInvestorEmail('');
        setInvestorPhone('');
        setInvestorMessage('');
        setInvestorAccredited(false);
        await loadProfileAndData();
      } else {
        setRequestError(res.error || 'Failed to submit investor request.');
      }
    } catch (err: any) {
      setRequestError(err.message || 'An error occurred.');
    } finally {
      setRequestLoading(false);
    }
  };

  // Submit Feedback/Support
  const handleFeedbackSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setFeedbackLoading(true);
    setFeedbackSuccess('');
    try {
      const res = await submitDashboardFeedback({
        name: session?.user?.name || 'Authorized User',
        email: session?.user?.email || 'user@prithvora.com',
        message: feedbackMsg,
        type: type,
      });
      if (res.success) {
        setFeedbackSuccess('Your ticket has been recorded. Our administrators will contact you shortly.');
        setFeedbackMsg('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Update farmer inventory
  const handleSaveInventory = async (productId: string) => {
    setInventoryLoading(true);
    setInventorySuccess('');
    try {
      const res = await updateFarmerProductInventory(productId, Number(editPrice), Number(editStock));
      if (res.success) {
        setInventorySuccess('Inventory updated successfully!');
        setEditingInventoryId(null);
        await loadProfileAndData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInventoryLoading(false);
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
              Access your personal account, saved shipping coordinates, order histories, and real-time cold-chain tracking.
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

  // Check if roles are approved
  const isFarmerApproved = dashboardRoles?.farmer?.status === 'APPROVED';
  const isPartnerApproved = dashboardRoles?.partner?.status === 'APPROVED';
  const isInvestorApproved = dashboardRoles?.investorLead?.status === 'QUALIFIED' || dashboardRoles?.investorLead?.status === 'APPROVED';

  return (
    <div className="bg-offwhite min-h-screen py-8 sm:py-12 text-spruce font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page title / Session Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md inline-block">
              {isFarmerApproved ? 'Grower (Farmer)' : isPartnerApproved ? 'Franchise Partner' : isInvestorApproved ? 'Investor' : 'Agriverse Customer'}
            </span>
            <h1 className="text-3xl font-league font-black text-spruce leading-tight">
              Sauda, {session?.user?.name || 'Customer'}
            </h1>
            <p className="text-xs text-gray-400">
              Manage your coordinates, orders, and navigate specialized Agritech business terminals.
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

        {/* Tab selection menu */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-400 hover:text-spruce bg-white border border-gray-100'
            }`}
          >
            <User className="w-4 h-4" />
            Account & Orders
          </button>

          {isFarmerApproved && (
            <button
              onClick={() => setActiveTab('farmer')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'farmer'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-400 hover:text-spruce bg-white border border-gray-100'
              }`}
            >
              <Sprout className="w-4 h-4" />
              Farmer Portal
            </button>
          )}

          {isPartnerApproved && (
            <button
              onClick={() => setActiveTab('partner')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'partner'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-400 hover:text-spruce bg-white border border-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Partner Franchise
            </button>
          )}

          {isInvestorApproved && (
            <button
              onClick={() => setActiveTab('investor')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'investor'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-400 hover:text-spruce bg-white border border-gray-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Investor Terminal
            </button>
          )}

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-400 hover:text-spruce bg-white border border-gray-100'
            }`}
          >
            <Award className="w-4 h-4" />
            Applications Center
          </button>
        </div>

        {/* Dynamic Order tracking highlight */}
        {activeTrackOrder && activeTab === 'profile' && (
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

        {/* 1. Account Profile Tab */}
        {activeTab === 'profile' && (
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
        )}

        {/* 2. Farmer Dashboard Portal */}
        {activeTab === 'farmer' && isFarmerApproved && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Farm Size</span>
                  <span className="text-lg font-bold text-spruce leading-normal">{dashboardRoles.farmer.farmSizeAcres} Acres</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">My Products</span>
                  <span className="text-lg font-bold text-spruce leading-normal">{dashboardRoles.farmer.products?.length || 0} Items</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Quality Rating</span>
                  <span className="text-lg font-bold text-spruce leading-normal">{dashboardRoles.farmer.rating} / 5.0</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Sourcing Model</span>
                  <span className="text-sm font-bold text-spruce leading-normal">{dashboardRoles.farmer.procurementModel}</span>
                </div>
              </div>
            </div>

            {/* Main content split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Inventory and Pricing */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      Manage Crop Inventory & Pricing
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Live sync with store front
                    </span>
                  </div>

                  {inventorySuccess && (
                    <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {inventorySuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    {!dashboardRoles.farmer.products || dashboardRoles.farmer.products.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 italic text-sm">
                        You do not have any crop products currently listed in our storefront. Contact support to bind products.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-semibold">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                              <th className="pb-3 font-bold">Crop Product</th>
                              <th className="pb-3 font-bold">Category</th>
                              <th className="pb-3 font-bold text-center">Unit Price (₹)</th>
                              <th className="pb-3 font-bold text-center">Stock Level</th>
                              <th className="pb-3 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardRoles.farmer.products.map((p: any) => {
                              const isEditingThis = editingInventoryId === p.id;
                              return (
                                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-offwhite/30 transition-all">
                                  <td className="py-4">
                                    <div className="flex items-center gap-3">
                                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-offwhite rounded-lg p-1 border border-gray-100" />
                                      <span className="font-bold text-spruce">{p.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 text-gray-400">{p.category}</td>
                                  <td className="py-4 text-center font-mono font-bold">
                                    {isEditingThis ? (
                                      <input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-16 px-1.5 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:border-primary text-spruce font-mono bg-offwhite/50"
                                      />
                                    ) : (
                                      `₹${p.price}`
                                    )}
                                  </td>
                                  <td className="py-4 text-center font-mono font-bold">
                                    {isEditingThis ? (
                                      <input
                                        type="number"
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        className="w-16 px-1.5 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:border-primary text-spruce font-mono bg-offwhite/50"
                                      />
                                    ) : (
                                      <span className={p.stock < 15 ? 'text-red-500 font-black' : 'text-spruce'}>
                                        {p.stock}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 text-right">
                                    {isEditingThis ? (
                                      <div className="flex justify-end gap-1.5">
                                        <button
                                          onClick={() => setEditingInventoryId(null)}
                                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-[10px] uppercase font-bold cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleSaveInventory(p.id)}
                                          disabled={inventoryLoading}
                                          className="px-2.5 py-1.5 bg-primary hover:bg-primary-light text-white rounded-md text-[10px] uppercase font-bold cursor-pointer flex items-center gap-1"
                                        >
                                          {inventoryLoading && <Loader className="w-3 h-3 animate-spin" />}
                                          Save
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setEditingInventoryId(p.id);
                                          setEditPrice(p.price.toString());
                                          setEditStock(p.stock.toString());
                                          setInventorySuccess('');
                                        }}
                                        className="px-3 py-1.5 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-md text-[10px] uppercase font-bold transition-all cursor-pointer"
                                      >
                                        Update
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crop Reviews List */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-primary">
                    <Star className="w-5 h-5 text-primary" />
                    <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">
                      Customer Reviews & Feedback
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { reviewer: 'Aarav Sharma', rating: 5, comment: 'The product is incredibly fresh and organic! Highly recommended.', crop: 'Raw Wildflower Honey', date: 'June 10, 2026' },
                      { reviewer: 'Meera Nair', rating: 4, comment: 'Very pure yellow mustard oil. Highly authentic taste. Packaging could be slightly better.', crop: 'Cold Pressed Yellow Mustard Oil', date: 'June 05, 2026' },
                      { reviewer: 'Amit Patel', rating: 5, comment: 'Amazing A2 Gir Cow Ghee, slowly churned using traditional methods. Tastes like home.', crop: 'A2 Gir Cow Milk', date: 'May 28, 2026' }
                    ].map((rev, index) => (
                      <div key={index} className="p-4 bg-offwhite rounded-2xl border border-gray-50 space-y-2 text-xs font-semibold">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-spruce block">{rev.reviewer}</span>
                            <span className="text-[10px] text-primary">{rev.crop}</span>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                            <span className="text-[10px] text-gray-400 font-bold ml-1">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 font-normal leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Subsidies, Govt Schemes & Support */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Government Schemes */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Govt Schemes</h4>
                  </div>
                  <div className="space-y-2.5 text-xs font-semibold">
                    {[
                      { name: 'PM-KISAN Scheme', desc: '₹6,000 annual direct income support to farmers.', url: 'https://pmkisan.gov.in/' },
                      { name: 'Pradhan Mantri Fasal Bima', desc: 'Crop insurance cover with minimal premiums.', url: 'https://pmfby.gov.in/' },
                      { name: 'Soil Health Card Scheme', desc: 'Crop-wise nutrient reports & cards.', url: 'https://soilhealth.dac.gov.in/' },
                      { name: 'Kisan Credit Card (KCC)', desc: 'Low-interest institutional credit lines.', url: 'https://www.myscheme.gov.in/' }
                    ].map((scheme, idx) => (
                      <div key={idx} className="p-3 bg-offwhite border border-gray-50 rounded-xl space-y-1">
                        <span className="font-bold text-spruce block">{scheme.name}</span>
                        <p className="text-[10px] text-gray-500 font-normal leading-relaxed">{scheme.desc}</p>
                        <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent hover:text-accent-dark hover:underline flex items-center gap-0.5 mt-1 font-bold">
                          Official Site <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prithvora Corporate Subsidies */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <Award className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Prithvora Benefits</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                      <span className="font-bold text-primary block">Organic Fertilizer Subsidy</span>
                      <p className="text-[10px] text-gray-600 leading-normal">50% discount on organic vermicompost & compost blocks sourced from Behror cluster.</p>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                      <span className="font-bold text-primary block">Seed Purchase Advance</span>
                      <p className="text-[10px] text-gray-600 leading-normal">Zero-interest crop season advances up to ₹1,00,000 for verified high-yield organic seeds.</p>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                      <span className="font-bold text-primary block">15% Price Guarantee</span>
                      <p className="text-[10px] text-gray-600 leading-normal">Guaranteed buyback pricing premium of 15% above MSP local Mandi benchmarks.</p>
                    </div>
                  </div>
                </div>

                {/* Downloads section */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <Download className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Downloads Section</h4>
                  </div>
                  <div className="space-y-2 text-xs font-semibold">
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Organic SOP Guidelines.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Soil Chemistry Guide.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Crop Rotation Tool.xlsx</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>

                {/* Support Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Grower Suggestion & Support</h4>
                  </div>
                  {feedbackSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold border border-green-100">
                      {feedbackSuccess}
                    </div>
                  )}
                  <form onSubmit={(e) => handleFeedbackSubmit(e, 'Farmer Portal')} className="space-y-3">
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter feedback or describe technical issues..."
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-spruce bg-offwhite/50 font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="w-full py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {feedbackLoading && <Loader className="w-3 h-3 animate-spin" />}
                      Send Feedback
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 3. Partner Franchise Dashboard Portal */}
        {activeTab === 'partner' && isPartnerApproved && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Franchise Tier</span>
                  <span className="text-lg font-bold text-spruce leading-normal">{dashboardRoles.partner.tier}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Monthly Sales</span>
                  <span className="text-lg font-bold text-spruce leading-normal">₹4,85,200</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Operating Profit</span>
                  <span className="text-lg font-bold text-spruce leading-normal">₹89,760 (18.5%)</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-offwhite border border-gray-100 flex items-center justify-center text-gray-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Remaining Credit</span>
                  <span className="text-lg font-bold text-spruce leading-normal">₹3,24,000</span>
                </div>
              </div>
            </div>

            {/* Procurement / Transaction logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    Store Procurement Ledger
                  </h3>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    Franchise Account: #{dashboardRoles.partner.id.substring(0, 10)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-bold">Log Date</th>
                        <th className="pb-3 font-bold">Item Description</th>
                        <th className="pb-3 font-bold text-center">Procured Qty</th>
                        <th className="pb-3 font-bold text-center">Total Value (₹)</th>
                        <th className="pb-3 font-bold text-right">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '14 Jun 2026', desc: 'Vedic Cow Curd A2 Ghee Batch D1', qty: '60 Units', amount: 87000, status: 'DELIVERED' },
                        { date: '08 Jun 2026', desc: 'Raw Honey Himachal Sourced', qty: '120 Jars', amount: 54000, status: 'DELIVERED' },
                        { date: '01 Jun 2026', desc: 'Cold Pressed Yellow Mustard Oil 5L', qty: '40 Cans', amount: 52000, status: 'DELIVERED' },
                        { date: '25 May 2026', desc: 'Fresh Fruits (Strawberries & Pomegranate Juice)', qty: '200 Packs', amount: 38000, status: 'DELIVERED' }
                      ].map((log, index) => (
                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-offwhite/30 transition-all">
                          <td className="py-4 font-mono text-gray-400">{log.date}</td>
                          <td className="py-4 text-spruce font-bold">{log.desc}</td>
                          <td className="py-4 text-center text-gray-600">{log.qty}</td>
                          <td className="py-4 text-center font-mono font-bold">₹{log.amount.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-right">
                            <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-wide">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Partner files, attachments, support */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <Download className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Franchise Manuals</h4>
                  </div>
                  <div className="space-y-2 text-xs font-semibold">
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Franchise Operating Playbook.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Store Brand Assets & Logo.zip</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Store Launch Marketing Pack.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>

                {/* Franchise Support Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Partner Helpdesk</h4>
                  </div>
                  {feedbackSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold border border-green-100">
                      {feedbackSuccess}
                    </div>
                  )}
                  <form onSubmit={(e) => handleFeedbackSubmit(e, 'Franchise Partner')} className="space-y-3">
                    <textarea
                      required
                      rows={3}
                      placeholder="Submit logistics claims or request marketing collateral..."
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-spruce bg-offwhite/50 font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="w-full py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {feedbackLoading && <Loader className="w-3 h-3 animate-spin" />}
                      Send Ticket
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 4. Investor Dashboard Portal */}
        {activeTab === 'investor' && isInvestorApproved && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Invested Capital</span>
                  <span className="text-lg font-bold text-spruce leading-normal">₹25,00,000</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Current Valuation</span>
                  <span className="text-lg font-bold text-spruce leading-normal">₹34,25,000 (1.37x ROI)</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Equity Holding</span>
                  <span className="text-lg font-bold text-spruce leading-normal">0.85% (Series Seed)</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-offwhite border border-gray-100 flex items-center justify-center text-gray-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Dividend payout</span>
                  <span className="text-sm font-bold text-spruce leading-normal">15 Oct 2026 (Est: ₹85k)</span>
                </div>
              </div>
            </div>

            {/* Share account / financial statement ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    Share Capital Ledger
                  </h3>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    Valuation Factor: GRCh38 Seed Standard
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-bold">Valuation Date</th>
                        <th className="pb-3 font-bold">Transaction Type</th>
                        <th className="pb-3 font-bold text-center">Amount Contribution (₹)</th>
                        <th className="pb-3 font-bold text-center">Implied Share Price (₹)</th>
                        <th className="pb-3 font-bold text-right">Cumulative Shares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '12 Jan 2026', type: 'Series Seed Equity Purchase', amount: 1500000, price: 100, shares: '15,000 Shares' },
                        { date: '04 Aug 2025', type: 'Initial Angel Convertible Note', amount: 1000000, price: 80, shares: '12,500 Shares' },
                        { date: '15 Jan 2025', type: 'Dividend Distribution Paid Out', amount: 75000, price: 'N/A', shares: 'Cash Pay' }
                      ].map((log, index) => (
                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-offwhite/30 transition-all">
                          <td className="py-4 font-mono text-gray-400">{log.date}</td>
                          <td className="py-4 text-spruce font-bold">{log.type}</td>
                          <td className="py-4 text-center font-mono font-bold text-primary">₹{log.amount.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-center font-mono text-gray-600">{log.price}</td>
                          <td className="py-4 text-right text-gray-700 font-bold">{log.shares}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: investor files, certificates, founder connection */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <Download className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Investor Downloads</h4>
                  </div>
                  <div className="space-y-2 text-xs font-semibold">
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Share Allocation Certificate.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Audited Financial Report FY25.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-offwhite border border-gray-50 hover:bg-gray-100 rounded-xl text-left cursor-pointer transition-all">
                      <span className="truncate">Agritech Expansion Roadmap.pdf</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>

                {/* Founder Direct support Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5 text-primary font-league">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h4 className="font-black text-sm uppercase tracking-wider">Founder Relations Direct</h4>
                  </div>
                  {feedbackSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl font-bold border border-green-100">
                      {feedbackSuccess}
                    </div>
                  )}
                  <form onSubmit={(e) => handleFeedbackSubmit(e, 'Investor Relations')} className="space-y-3">
                    <textarea
                      required
                      rows={3}
                      placeholder="Inquire about expansion plans or schedule direct calls with founders..."
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary text-spruce bg-offwhite/50 font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="w-full py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {feedbackLoading && <Loader className="w-3 h-3 animate-spin" />}
                      Submit Message
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 5. Application Center (Request / Pending Roles) */}
        {activeTab === 'requests' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <h2 className="text-2xl font-league font-black text-spruce uppercase tracking-wider">
                Become a Grower, Partner, or Investor
              </h2>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                Prithvora runs Rajasthan's premium network of organic farmers, cold-chain distribution franchises, and growth investors. Select a program below to apply or check status.
              </p>
            </div>

            {requestSuccess && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-xs rounded-2xl flex items-center gap-2 font-bold max-w-4xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                {requestSuccess}
              </div>
            )}

            {requestError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl flex items-center gap-2 font-bold max-w-4xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                {requestError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Farmer request */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-primary font-league">
                    <Sprout className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-lg uppercase tracking-wider">1. Organic Grower</h3>
                  </div>
                  {dashboardRoles?.farmer ? (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      dashboardRoles.farmer.status === 'APPROVED'
                        ? 'bg-green-50 border-green-100 text-green-700'
                        : 'bg-yellow-50 border-yellow-100 text-yellow-700'
                    }`}>
                      {dashboardRoles.farmer.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">FREE REGISTRATION</span>
                  )}
                </div>

                {dashboardRoles?.farmer ? (
                  <div className="p-4 bg-offwhite border border-gray-100 rounded-2xl space-y-3 text-xs leading-relaxed text-gray-500 font-semibold">
                    <p>
                      {dashboardRoles.farmer.status === 'APPROVED' 
                        ? 'Your Grower application has been fully approved! You can now use the Farmer Portal tab to manage inventory, check product reviews, and check support.' 
                        : 'Your Farmer application has been received and is under review. Rajasthan procurement managers will audit your coordinates and call you shortly.'}
                    </p>
                    {dashboardRoles.farmer.status === 'APPROVED' && (
                      <button onClick={() => setActiveTab('farmer')} className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer">
                        Go to Farmer Portal
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleFarmerSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={farmerFullName}
                        onChange={(e) => setFarmerFullName(e.target.value)}
                        placeholder="Farmer Full Name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        placeholder="+91 96606 86394"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">State</label>
                        <input
                          type="text"
                          readOnly
                          value={farmerState}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">District</label>
                        <input
                          type="text"
                          required
                          value={farmerDistrict}
                          onChange={(e) => setFarmerDistrict(e.target.value)}
                          placeholder="e.g. Alwar"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Farm Size (Acres)</label>
                      <input
                        type="number"
                        required
                        step="0.1"
                        value={farmerSizeAcres}
                        onChange={(e) => setFarmerSizeAcres(e.target.value)}
                        placeholder="e.g. 5.5"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Primary Crops</label>
                      <input
                        type="text"
                        required
                        value={farmerPrimaryCrops}
                        onChange={(e) => setFarmerPrimaryCrops(e.target.value)}
                        placeholder="Mustard, Honey, Garlic..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Procurement Model</label>
                      <select
                        value={farmerProcurementModel}
                        onChange={(e) => setFarmerProcurementModel(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      >
                        <option value="Contract Farming">Contract Farming (Secure buyback)</option>
                        <option value="Co-operative Pooling">Co-operative Pooling</option>
                        <option value="Daily Spot Market">Daily Spot Market</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {requestLoading && <Loader className="w-3.5 h-3.5 animate-spin" />}
                      Register as Grower
                    </button>
                  </form>
                )}
              </div>

              {/* Partner request */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-primary font-league">
                    <Layers className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-lg uppercase tracking-wider">2. Store Franchise</h3>
                  </div>
                  {dashboardRoles?.partner ? (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      dashboardRoles.partner.status === 'APPROVED'
                        ? 'bg-green-50 border-green-100 text-green-700'
                        : 'bg-yellow-50 border-yellow-100 text-yellow-700'
                    }`}>
                      {dashboardRoles.partner.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-league">FRANCHISE PARTNER</span>
                  )}
                </div>

                {dashboardRoles?.partner ? (
                  <div className="p-4 bg-offwhite border border-gray-100 rounded-2xl space-y-3 text-xs leading-relaxed text-gray-500 font-semibold">
                    <p>
                      {dashboardRoles.partner.status === 'APPROVED' 
                        ? 'Your Franchise Partnership has been authorized! Check the Franchise Console tab to view sales analytics, ledger balance, and procure products.' 
                        : 'Your Franchise Partner application is pending admin approval. Our business expansion managers will contact you for a physical store verification.'}
                    </p>
                    {dashboardRoles.partner.status === 'APPROVED' && (
                      <button onClick={() => setActiveTab('partner')} className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer">
                        Go to Franchise tab
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={partnerFullName}
                        onChange={(e) => setPartnerFullName(e.target.value)}
                        placeholder="Owner Full Name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="franchise@yourmail.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        placeholder="+91 94140 12345"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Company Name (Optional)</label>
                      <input
                        type="text"
                        value={partnerCompanyName}
                        onChange={(e) => setPartnerCompanyName(e.target.value)}
                        placeholder="e.g. Gupta Cold Logistics"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Investment Tier Tier</label>
                      <select
                        value={partnerTier}
                        onChange={(e) => setPartnerTier(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      >
                        <option value="SILVER">Silver Tier (₹5 - ₹15 Lakhs)</option>
                        <option value="GOLD">Gold Tier (₹15 - ₹30 Lakhs)</option>
                        <option value="PLATINUM">Platinum Tier (₹30 - ₹50 Lakhs)</option>
                        <option value="DIAMOND">Diamond Corporate (₹50 Lakhs+)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">Experience (Yrs)</label>
                        <input
                          type="number"
                          required
                          value={partnerExperienceYears}
                          onChange={(e) => setPartnerExperienceYears(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">Budget Available (₹)</label>
                        <input
                          type="number"
                          required
                          value={partnerInvestmentBudget}
                          onChange={(e) => setPartnerInvestmentBudget(e.target.value)}
                          placeholder="e.g. 1500000"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {requestLoading && <Loader className="w-3.5 h-3.5 animate-spin" />}
                      Request Franchise Partner
                    </button>
                  </form>
                )}
              </div>

              {/* Investor request */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-primary font-league">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-lg uppercase tracking-wider">3. Growth Investor</h3>
                  </div>
                  {dashboardRoles?.investorLead ? (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      dashboardRoles.investorLead.status === 'QUALIFIED'
                        ? 'bg-green-50 border-green-100 text-green-700'
                        : 'bg-yellow-50 border-yellow-100 text-yellow-700'
                    }`}>
                      {dashboardRoles.investorLead.status === 'QUALIFIED' ? 'APPROVED' : dashboardRoles.investorLead.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">INVESTOR ROUND</span>
                  )}
                </div>

                {dashboardRoles?.investorLead ? (
                  <div className="p-4 bg-offwhite border border-gray-100 rounded-2xl space-y-3 text-xs leading-relaxed text-gray-500 font-semibold">
                    <p>
                      {dashboardRoles.investorLead.status === 'QUALIFIED' 
                        ? 'Your Investor Profile is fully verified! Navigate to the Investor Terminal tab to audit valuation stats and capital statements.' 
                        : 'Your growth investment profile is under review. Our Investor Relations desk will schedule a briefing on our expansion capital structure.'}
                    </p>
                    {dashboardRoles.investorLead.status === 'QUALIFIED' && (
                      <button onClick={() => setActiveTab('investor')} className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer">
                        Go to Investor Room
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={investorFullName}
                        onChange={(e) => setInvestorFullName(e.target.value)}
                        placeholder="Investor Full Name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={investorEmail}
                        onChange={(e) => setInvestorEmail(e.target.value)}
                        placeholder="investor@corporation.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={investorPhone}
                        onChange={(e) => setInvestorPhone(e.target.value)}
                        placeholder="+91 99887 76655"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Expected Capital Allocation</label>
                      <select
                        value={investorRange}
                        onChange={(e) => setInvestorRange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      >
                        <option value="$10k-$50k">₹10 Lakhs - ₹50 Lakhs</option>
                        <option value="$50k-$200k">₹50 Lakhs - ₹2 Crores</option>
                        <option value="$200k+">₹2 Crores+</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="accreditedCheckbox"
                        checked={investorAccredited}
                        onChange={(e) => setInvestorAccredited(e.target.checked)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="accreditedCheckbox" className="text-[10px] text-gray-500 select-none">
                        I certify that I am a qualified/accredited investor.
                      </label>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Message & Intent (Optional)</label>
                      <textarea
                        rows={2}
                        value={investorMessage}
                        onChange={(e) => setInvestorMessage(e.target.value)}
                        placeholder="Inquire about seed rounds..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-spruce bg-offwhite/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {requestLoading && <Loader className="w-3.5 h-3.5 animate-spin" />}
                      Submit Investor Profile
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

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

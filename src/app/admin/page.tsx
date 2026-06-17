'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ShieldAlert, LayoutDashboard, ShoppingBag, Truck, Users, Handshake, 
  LineChart, Mail, Briefcase, Plus, Check, X, ShieldCheck, Edit, Trash2, Eye 
} from 'lucide-react';
import { 
  getProducts, addProduct, deleteProduct, updateProduct,
  getOrders, updateOrderStatus, 
  getFarmers, approveFarmer, updateFarmer, deleteFarmer, addFarmer,
  getPartners, approvePartner, deletePartner, addPartner, updatePartner,
  getInvestors, contactInvestor, deleteInvestor, addInvestor, updateInvestor,
  getCareersApplications,
  getCustomers, updateCustomer, deleteCustomer,
  getContactMessages, deleteContactMessage, updateContactMessageStatus
} from '@/app/actions';
import { OrderStatus } from '@prisma/client';

export default function AdminPanel() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamic state managers connected to Prisma database
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Dairy',
    price: 0,
    stock: 100,
    farmerId: '',
    description: '',
    shortDescription: '',
    benefits: '',
    nutrition: '',
    keyHighlights: '',
    keyFeatures: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editingFarmer, setEditingFarmer] = useState<any>(null);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [editingInvestor, setEditingInvestor] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isEditFarmerModalOpen, setIsEditFarmerModalOpen] = useState(false);
  const [isEditPartnerModalOpen, setIsEditPartnerModalOpen] = useState(false);
  const [isEditInvestorModalOpen, setIsEditInvestorModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);

  const [newFarmer, setNewFarmer] = useState({
    name: '',
    phone: '',
    state: 'Rajasthan',
    district: '',
    farmSize: 1.0,
    crops: '',
    procurement: 'Contract Farming',
    status: 'PENDING',
    rating: 5.0,
    userEmail: ''
  });

  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tier: 'SILVER',
    experience: 1,
    budget: 100000,
    status: 'PENDING',
    userEmail: ''
  });

  const [newInvestor, setNewInvestor] = useState({
    name: '',
    email: '',
    phone: '',
    range: '$10k-$50k',
    accredited: true,
    message: '',
    status: 'NEW',
    userEmail: ''
  });

  // Route protection
  // In our NextAuth setup, users with "admin" in their email are automatically marked as role = ADMIN.
  // We check that role here to secure our backend.
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, farms, parts, invs, apps, custs, tix] = await Promise.all([
        getProducts(),
        getOrders(),
        getFarmers(),
        getPartners(),
        getInvestors(),
        getCareersApplications(),
        getCustomers(),
        getContactMessages()
      ]);
      setProducts(prods);
      setCustomers(custs);
      setTickets(tix || []);
      
      // Map database orders back to the flat format the table expects
      const mappedOrders = ords.map((o: any) => {
        // Retrieve customer name from database relation or parse from shipping address
        const receiverMatch = o.shippingAddress.match(/Receiver:\s*([^,]+)/);
        const customerName = o.user?.name || (receiverMatch ? receiverMatch[1] : 'Guest Customer');
        
        return {
          id: o.id,
          customer: customerName,
          email: o.user?.email || 'N/A',
          phone: o.user?.phone || 'N/A',
          date: new Date(o.createdAt).toISOString().split('T')[0],
          amount: o.totalAmount,
          status: o.status,
          shippingAddress: o.shippingAddress,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          items: o.items || []
        };
      });
      setOrders(mappedOrders);

      // Map database farmers back to format the table expects
      const mappedFarmers = farms.map((f: any) => ({
        id: f.id,
        name: f.fullName,
        phone: f.phone,
        state: f.state,
        district: f.district,
        farmSize: f.farmSizeAcres,
        crops: f.primaryCrops,
        procurement: f.procurementModel,
        rating: f.rating,
        status: f.status,
        userEmail: f.user?.email || ''
      }));
      setFarmers(mappedFarmers);

      // Map database partners back to format the table expects
      const mappedPartners = parts.map((p: any) => ({
        id: p.id,
        name: p.fullName,
        email: p.email,
        phone: p.phone,
        company: p.companyName || 'N/A',
        tier: p.tier,
        experience: p.experienceYears,
        budget: p.investmentBudget,
        status: p.status,
        date: new Date(p.createdAt).toLocaleDateString(),
        userEmail: p.user?.email || ''
      }));
      setPartners(mappedPartners);

      // Map database investors back to format the table expects
      const mappedInvestors = invs.map((i: any) => ({
        id: i.id,
        name: i.fullName,
        email: i.email,
        phone: i.phone,
        range: i.investmentRange,
        accredited: i.accreditedStatus,
        message: i.message || 'N/A',
        status: i.status,
        date: new Date(i.createdAt).toLocaleDateString(),
        userEmail: i.user?.email || ''
      }));
      setInvestors(mappedInvestors);

      // Map database applications back to format the table expects
      const mappedApplications = apps.map((a: any) => ({
        id: a.id,
        name: a.fullName,
        position: a.position,
        date: new Date(a.createdAt).toISOString().split('T')[0],
        status: a.status
      }));
      setApplications(mappedApplications);

    } catch (err) {
      console.error('Error refreshing admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="bg-offwhite min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce">Access Denied</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This administrative dashboard is restricted to certified PRITHVORA credentials. If you are an administrator, sign in with an admin email account (e.g. admin@prithvora.com).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Action methods
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name) {
      const res = await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        description: newProduct.description || undefined,
        shortDescription: newProduct.shortDescription || undefined,
        benefits: newProduct.benefits || undefined,
        nutrition: newProduct.nutrition || undefined,
        keyHighlights: newProduct.keyHighlights || undefined,
        keyFeatures: newProduct.keyFeatures || undefined,
        image: newProduct.image || undefined,
        farmerId: newProduct.farmerId || undefined
      });
      if (res.success) {
        setNewProduct({
          name: '',
          category: 'Dairy',
          price: 0,
          stock: 100,
          farmerId: '',
          description: '',
          shortDescription: '',
          benefits: '',
          nutrition: '',
          keyHighlights: '',
          keyFeatures: '',
          image: ''
        });
        refreshData();
      } else {
        alert(res.error || 'Failed to add product');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    const res = await updateOrderStatus(id, newStatus as OrderStatus);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to update order status');
    }
  };

  const handleApproveFarmer = async (id: string) => {
    const res = await approveFarmer(id);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to approve farmer');
    }
  };

  const handleDeleteFarmer = async (id: string) => {
    if (confirm('Are you sure you want to delete this grower?')) {
      const res = await deleteFarmer(id);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete grower');
      }
    }
  };

  const handleApprovePartner = async (id: string) => {
    const res = await approvePartner(id);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to approve partner');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm('Are you sure you want to delete this partner application?')) {
      const res = await deletePartner(id);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete partner');
      }
    }
  };

  const handleContactInvestor = async (id: string) => {
    const res = await contactInvestor(id);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to mark investor as contacted');
    }
  };

  const handleDeleteInvestor = async (id: string) => {
    if (confirm('Are you sure you want to delete this investor lead?')) {
      const res = await deleteInvestor(id);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete investor');
      }
    }
  };

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addFarmer({
      fullName: newFarmer.name,
      phone: newFarmer.phone,
      state: newFarmer.state,
      district: newFarmer.district,
      farmSizeAcres: Number(newFarmer.farmSize),
      primaryCrops: newFarmer.crops,
      procurementModel: newFarmer.procurement,
      status: newFarmer.status,
      rating: Number(newFarmer.rating),
      userEmail: newFarmer.userEmail || undefined
    });
    if (res.success) {
      setIsAddFarmerModalOpen(false);
      setNewFarmer({
        name: '',
        phone: '',
        state: 'Rajasthan',
        district: '',
        farmSize: 1.0,
        crops: '',
        procurement: 'Contract Farming',
        status: 'PENDING',
        rating: 5.0,
        userEmail: ''
      });
      refreshData();
    } else {
      alert(res.error || 'Failed to add grower');
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addPartner({
      fullName: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone,
      companyName: newPartner.company || undefined,
      tier: newPartner.tier as any,
      experienceYears: Number(newPartner.experience),
      investmentBudget: Number(newPartner.budget),
      status: newPartner.status,
      userEmail: newPartner.userEmail || undefined
    });
    if (res.success) {
      setIsAddPartnerModalOpen(false);
      setNewPartner({
        name: '',
        email: '',
        phone: '',
        company: '',
        tier: 'SILVER',
        experience: 1,
        budget: 100000,
        status: 'PENDING',
        userEmail: ''
      });
      refreshData();
    } else {
      alert(res.error || 'Failed to add partner');
    }
  };

  const handleAddInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addInvestor({
      fullName: newInvestor.name,
      email: newInvestor.email,
      phone: newInvestor.phone,
      investmentRange: newInvestor.range,
      accreditedStatus: newInvestor.accredited,
      message: newInvestor.message || undefined,
      status: newInvestor.status,
      userEmail: newInvestor.userEmail || undefined
    });
    if (res.success) {
      setIsAddInvestorModalOpen(false);
      setNewInvestor({
        name: '',
        email: '',
        phone: '',
        range: '$10k-$50k',
        accredited: true,
        message: '',
        status: 'NEW',
        userEmail: ''
      });
      refreshData();
    } else {
      alert(res.error || 'Failed to add investor');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm('Are you sure you want to delete this support message?')) {
      const res = await deleteContactMessage(id);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete support ticket');
      }
    }
  };

  const handleUpdateTicketStatus = async (id: string, newStatus: string) => {
    const res = await updateContactMessageStatus(id, newStatus);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to update ticket status');
    }
  };

  const sidebarLinks = [
    { key: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'orders', label: 'Orders', icon: Truck },
    { key: 'farmers', label: 'Farmers', icon: Users },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'investors', label: 'Investors', icon: LineChart },
    { key: 'careers', label: 'Careers', icon: Briefcase },
    { key: 'tickets', label: 'Tickets', icon: Mail },
  ];

  return (
    <div className="bg-offwhite min-h-screen flex flex-col md:flex-row">
      
      {/* Side Bar panel */}
      <aside className="w-full md:w-64 bg-spruce text-white md:min-h-screen p-6 space-y-8 flex-shrink-0">
        <div>
          <h2 className="font-league font-black text-xl tracking-wider text-white">Agri-Console</h2>
          <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-0.5">Control Center</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.key}
                onClick={() => setActiveTab(link.key)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all flex-shrink-0 w-auto md:w-full ${
                  activeTab === link.key
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main console content */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-x-hidden">
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Tab 1: Dashboard / Analytics */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-league font-black text-spruce">Dashboard Analytics</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Sales Volume</span>
                    <h3 className="text-3xl font-league font-black text-primary">₹{orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString('en-IN')}</h3>
                    <span className="text-xs text-primary-light font-bold">↑ from database logs</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Shipments</span>
                    <h3 className="text-3xl font-league font-black text-spruce">{orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length} Orders</h3>
                    <span className="text-xs text-gray-500 font-medium">{orders.filter(o => o.status === 'PENDING').length} pending validation</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Intake Procurement (Est.)</span>
                    <h3 className="text-3xl font-league font-black text-accent">{((farmers.filter(f => f.status === 'APPROVED').length || 1) * 12500).toLocaleString('en-IN')} Litres</h3>
                    <span className="text-xs text-primary-light font-bold">{farmers.filter(f => f.status === 'APPROVED').length || 2} state collection hubs active</span>
                  </div>
                </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-lg font-league font-bold text-spruce">System Action Queue</h3>
              <p className="text-xs text-gray-500">Overview of pending registrations and leads waiting for review.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-500">
                <div className="p-4 bg-offwhite rounded-xl text-center space-y-1">
                  <span className="text-spruce font-bold text-lg block">{farmers.filter(f=>f.status==='PENDING').length}</span>
                  <span>Farmer Leads</span>
                </div>
                <div className="p-4 bg-offwhite rounded-xl text-center space-y-1">
                  <span className="text-spruce font-bold text-lg block">{partners.filter(p=>p.status==='PENDING').length}</span>
                  <span>Partner Leads</span>
                </div>
                <div className="p-4 bg-offwhite rounded-xl text-center space-y-1">
                  <span className="text-spruce font-bold text-lg block">{investors.filter(i=>i.status==='NEW').length}</span>
                  <span>Investor Inquiries</span>
                </div>
                <div className="p-4 bg-offwhite rounded-xl text-center space-y-1">
                  <span className="text-spruce font-bold text-lg block">{applications.filter(a=>a.status==='APPLIED').length}</span>
                  <span>Job Applications</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-league font-black text-spruce">Product Catalog Management</h2>
            </div>

            {/* Add product form */}
            <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4 text-xs font-semibold text-gray-500">
              <h3 className="font-league font-black text-sm text-spruce uppercase tracking-wider mb-2">Add New Product</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Wild Honey"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Dairy</option>
                    <option>Vedic Ghee</option>
                    <option>Honey</option>
                    <option>Cold Pressed Oils</option>
                    <option>Organic Juices</option>
                    <option>Fresh Fruits</option>
                    <option>Fresh Vegetables</option>
                    <option>Organic Spices</option>
                    <option>Pickles</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Link Grower</label>
                  <select
                    value={newProduct.farmerId}
                    onChange={(e) => setNewProduct({ ...newProduct, farmerId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="">No linked grower</option>
                    {farmers.filter((f: any) => f.status === 'APPROVED').map((f: any) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.state})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Stock (Units)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Image Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /honey.png"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief 1-line summary for product card & buybox"
                    value={newProduct.shortDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Full Description</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed description of the product and its origin..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Key Features (comma separated)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 100% Pure & Raw, Unfiltered, Lab Tested, Zero Additives"
                    value={newProduct.keyFeatures}
                    onChange={(e) => setNewProduct({ ...newProduct, keyFeatures: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Key Highlights (comma separated)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Direct Farmer Sourced, NMR Tested, Sustained Energy Boost"
                    value={newProduct.keyHighlights}
                    onChange={(e) => setNewProduct({ ...newProduct, keyHighlights: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Health Benefits (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rich in antioxidants, Enhances digestion"
                    value={newProduct.benefits}
                    onChange={(e) => setNewProduct({ ...newProduct, benefits: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Nutrition Facts (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Energy: 304 kcal, Carbs: 82g"
                    value={newProduct.nutrition}
                    onChange={(e) => setNewProduct({ ...newProduct, nutrition: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-league text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Product to Catalog
                </button>
              </div>
            </form>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{p.name}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4">₹{p.price}</td>
                      <td className="py-3 px-4">{p.stock} units</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditProductModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-primary transition-colors mr-2 cursor-pointer inline-flex items-center"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Order Logistics Desk</h2>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{o.id}</td>
                      <td className="py-3 px-4">{o.customer}</td>
                      <td className="py-3 px-4">{o.date}</td>
                      <td className="py-3 px-4">₹{o.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setIsOrderModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-primary transition-colors mr-2 cursor-pointer inline-flex items-center"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'PROCESSING')}
                            className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-md"
                          >
                            Accept
                          </button>
                        )}
                        {o.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                            className="px-2 py-1 bg-accent text-spruce text-[10px] font-bold rounded-md"
                          >
                            Ship
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Farmer leads */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-league font-black text-spruce">Grower Management</h2>
              <button
                onClick={() => setIsAddFarmerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-league font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-primary-light transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Grower
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Grower Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Farm Size / Crops</th>
                    <th className="py-3 px-4">Procurement</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {farmers.map((f) => (
                    <tr key={f.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{f.name}</td>
                      <td className="py-3 px-4">{f.phone}</td>
                      <td className="py-3 px-4">{f.district}, {f.state}</td>
                      <td className="py-3 px-4">
                        <span className="block font-semibold">{f.farmSize} Acres</span>
                        <span className="block text-[10px] text-gray-400">{f.crops}</span>
                      </td>
                      <td className="py-3 px-4">{f.procurement}</td>
                      <td className="py-3 px-4">
                        <span className="bg-accent/20 text-spruce px-2 py-0.5 rounded-md font-bold">
                          {(f.rating ?? 5.0).toFixed(1)}★
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                          f.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {f.status === 'PENDING' && (
                          <button
                            onClick={() => handleApproveFarmer(f.id)}
                            className="p-1 text-primary hover:text-primary-light inline-flex items-center cursor-pointer"
                            title="Approve Farmer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingFarmer(f);
                            setIsEditFarmerModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-primary inline-flex items-center cursor-pointer"
                          title="Edit Farmer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFarmer(f.id)}
                          className="p-1 text-gray-400 hover:text-red-500 inline-flex items-center cursor-pointer"
                          title="Delete Farmer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Partners */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-league font-black text-spruce">Partnership Applications</h2>
              <button
                onClick={() => setIsAddPartnerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-league font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-primary-light transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Partner
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Applicant / Contact</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Experience / Budget</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4">
                        <span className="block font-semibold text-spruce">{p.name}</span>
                        <span className="block text-[10px] text-gray-400">{p.email} | {p.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-spruce">{p.company}</td>
                      <td className="py-3 px-4">
                        <span className="block font-semibold">{p.experience} Years</span>
                        <span className="block text-[10px] text-primary">₹{p.budget?.toLocaleString('en-IN')} Budget</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-spruce/5 border border-spruce/10 rounded-md text-[10px] font-bold text-spruce">
                          {p.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {p.status === 'PENDING' && (
                          <button
                            onClick={() => handleApprovePartner(p.id)}
                            className="p-1 text-primary hover:text-primary-light inline-flex items-center cursor-pointer"
                            title="Approve Partner"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingPartner(p);
                            setIsEditPartnerModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-primary inline-flex items-center cursor-pointer"
                          title="Edit Partner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(p.id)}
                          className="p-1 text-gray-400 hover:text-red-500 inline-flex items-center cursor-pointer"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Investor leads */}
        {activeTab === 'investors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-league font-black text-spruce">Investor Leads Inquiries</h2>
              <button
                onClick={() => setIsAddInvestorModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-league font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-primary-light transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Investor
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Investor / Contact</th>
                    <th className="py-3 px-4">Accreditation</th>
                    <th className="py-3 px-4">Investment Range</th>
                    <th className="py-3 px-4">Inquiry Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {investors.map((i) => (
                    <tr key={i.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4">
                        <span className="block font-semibold text-spruce">{i.name}</span>
                        <span className="block text-[10px] text-gray-400">{i.email} | {i.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          i.accredited ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {i.accredited ? 'Accredited' : 'Not Accredited'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">{i.range}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={i.message}>
                        {i.message}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          i.status === 'CONTACTED' ? 'bg-green-100 text-green-700' :
                          i.status === 'QUALIFIED' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {i.status === 'NEW' && (
                          <button
                            onClick={() => handleContactInvestor(i.id)}
                            className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-light"
                          >
                            Contact
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingInvestor(i);
                            setIsEditInvestorModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-primary inline-flex items-center cursor-pointer"
                          title="Edit Investor"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvestor(i.id)}
                          className="p-1 text-gray-400 hover:text-red-500 inline-flex items-center cursor-pointer"
                          title="Delete Investor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Careers applications */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Job Applications Portal</h2>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Target Position</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{app.name}</td>
                      <td className="py-3 px-4">{app.position}</td>
                      <td className="py-3 px-4">{app.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Customers */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Customer Directory</h2>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{c.name || 'N/A'}</td>
                      <td className="py-3 px-4 font-medium">{c.email}</td>
                      <td className="py-3 px-4">{c.phone || 'N/A'}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={c.address || ''}>
                        {c.address ? `${c.address}, ${c.city || ''}, ${c.state || ''} - ${c.zip || ''}` : 'No saved address'}
                      </td>
                      <td className="py-3 px-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setIsEditCustomerModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-primary transition-colors mr-2 cursor-pointer inline-flex items-center"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete customer ${c.name || c.email}?`)) {
                              const res = await deleteCustomer(c.id);
                              if (res.success) {
                                refreshData();
                              } else {
                                alert(res.error || 'Failed to delete customer.');
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 9: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Support Inquiries & Feedback</h2>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Sender / Contact</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="block font-semibold text-spruce">{t.name}</span>
                        <span className="block text-[10px] text-gray-400">{t.email} {t.phone ? `| ${t.phone}` : ''}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-spruce">{t.subject}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={t.message}>
                        {t.message}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                          t.status === 'READ' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTicket(t);
                            setIsTicketModalOpen(true);
                            if (t.status === 'UNREAD') {
                              handleUpdateTicketStatus(t.id, 'READ');
                            }
                          }}
                          className="text-gray-400 hover:text-primary transition-colors mr-2 cursor-pointer inline-flex items-center"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {t.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id, 'RESOLVED')}
                            className="p-1 text-primary hover:text-primary-light inline-flex items-center cursor-pointer"
                            title="Mark as Resolved"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTicket(t.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

          </>
        )}
      </main>

      {/* Edit Product Modal */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsEditProductModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Edit Product</h3>
              <button onClick={() => setIsEditProductModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateProduct(editingProduct.id, {
                  name: editingProduct.name,
                  category: editingProduct.category,
                  price: Number(editingProduct.price),
                  stock: Number(editingProduct.stock),
                  description: editingProduct.description,
                  shortDescription: editingProduct.shortDescription,
                  benefits: editingProduct.benefits,
                  nutrition: editingProduct.nutrition,
                  keyHighlights: editingProduct.keyHighlights,
                  keyFeatures: editingProduct.keyFeatures,
                  image: editingProduct.image,
                  farmerId: editingProduct.farmerId || undefined
                });
                if (res.success) {
                  setIsEditProductModalOpen(false);
                  refreshData();
                } else {
                  alert(res.error || 'Failed to update product');
                }
              }}
              className="space-y-4 text-xs font-semibold text-gray-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Dairy</option>
                    <option>Vedic Ghee</option>
                    <option>Honey</option>
                    <option>Cold Pressed Oils</option>
                    <option>Organic Juices</option>
                    <option>Fresh Fruits</option>
                    <option>Fresh Vegetables</option>
                    <option>Organic Spices</option>
                    <option>Pickles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Link Grower</label>
                  <select
                    value={editingProduct.farmerId || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, farmerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="">No linked grower</option>
                    {farmers.filter((f: any) => f.status === 'APPROVED').map((f: any) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.state})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Image Link</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Stock (Units)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="uppercase text-[10px] text-gray-400">Short Description</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="uppercase text-[10px] text-gray-400">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Key Features (comma separated)</label>
                  <textarea
                    rows={2}
                    value={editingProduct.keyFeatures || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, keyFeatures: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Key Highlights (comma separated)</label>
                  <textarea
                    rows={2}
                    value={editingProduct.keyHighlights || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, keyHighlights: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Health Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.benefits || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, benefits: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-[10px] text-gray-400">Nutrition Facts (comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.nutrition || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer font-league text-base"
              >
                Save Product Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditCustomerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsEditCustomerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Edit Customer Profile</h3>
              <button onClick={() => setIsEditCustomerModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateCustomer(editingCustomer.id, {
                  name: editingCustomer.name,
                  phone: editingCustomer.phone,
                  address: editingCustomer.address,
                  city: editingCustomer.city,
                  state: editingCustomer.state,
                  zip: editingCustomer.zip,
                });
                if (res.success) {
                  setIsEditCustomerModalOpen(false);
                  refreshData();
                } else {
                  alert(res.error || 'Failed to update customer');
                }
              }}
              className="space-y-4 text-xs font-semibold text-gray-500"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.name || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="uppercase">Street Address</label>
                <textarea
                  rows={2}
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">State</label>
                  <input
                    type="text"
                    value={editingCustomer.state || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Zip Code</label>
                  <input
                    type="text"
                    value={editingCustomer.zip || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, zip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Save Customer Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Farmer Modal */}
      {isEditFarmerModalOpen && editingFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsEditFarmerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Edit Grower Profile</h3>
              <button onClick={() => setIsEditFarmerModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateFarmer(editingFarmer.id, {
                  fullName: editingFarmer.name,
                  phone: editingFarmer.phone,
                  state: editingFarmer.state,
                  district: editingFarmer.district,
                  farmSizeAcres: Number(editingFarmer.farmSize),
                  primaryCrops: editingFarmer.crops,
                  procurementModel: editingFarmer.procurement,
                  rating: Number(editingFarmer.rating),
                  status: editingFarmer.status,
                });
                if (res.success) {
                  setIsEditFarmerModalOpen(false);
                  refreshData();
                } else {
                  alert(res.error || 'Failed to update farmer');
                }
              }}
              className="space-y-4 text-xs font-semibold text-gray-500"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Grower Name</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.name || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.phone || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">District</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.district || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">State</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.state || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">Farm Size (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingFarmer.farmSize || 0}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, farmSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={editingFarmer.rating || 5.0}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={editingFarmer.status || 'PENDING'}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Procurement Model</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.procurement || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, procurement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Primary Crops</label>
                  <input
                    type="text"
                    required
                    value={editingFarmer.crops || ''}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, crops: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Save Grower Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsOrderModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-6 animate-zoom-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Order Logistics Details</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Code: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-semibold">
              <div className="space-y-3 p-4 bg-offwhite rounded-2xl border border-gray-100/50">
                <h4 className="text-spruce font-bold uppercase tracking-wider border-b border-gray-200 pb-1.5">Customer details</h4>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Name</span>
                  <span className="text-spruce font-bold text-sm">{selectedOrder.customer}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Email</span>
                  <span className="text-spruce">{selectedOrder.email}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Phone</span>
                  <span className="text-spruce">{selectedOrder.phone}</span>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-offwhite rounded-2xl border border-gray-100/50">
                <h4 className="text-spruce font-bold uppercase tracking-wider border-b border-gray-200 pb-1.5">Shipping & Payment</h4>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Address coordinates</span>
                  <span className="text-spruce leading-relaxed block whitespace-pre-wrap">{selectedOrder.shippingAddress}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Payment Method</span>
                    <span className="text-spruce">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Payment Status</span>
                    <span className={`font-bold ${selectedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>{selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-spruce font-league font-bold text-base uppercase tracking-wider border-b border-gray-100 pb-2">Purchased Items</h4>
              <div className="overflow-hidden border border-gray-100 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-4">Product</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Price</th>
                      <th className="py-2.5 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                    {selectedOrder.items && selectedOrder.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-offwhite/50">
                        <td className="py-2.5 px-4 flex items-center gap-3">
                          {item.product?.image && (
                            <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-contain rounded-md bg-offwhite p-1" />
                          )}
                          <span className="font-semibold text-spruce">{item.product?.name || 'Unknown Product'}</span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-4 text-right">₹{item.price}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-spruce">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-offwhite/60 p-4 rounded-2xl border border-gray-100/50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-bold uppercase">Logistics Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={async (e) => {
                    const nextStatus = e.target.value;
                    const res = await updateOrderStatus(selectedOrder.id, nextStatus as OrderStatus);
                    if (res.success) {
                      setSelectedOrder({ ...selectedOrder, status: nextStatus });
                      refreshData();
                    } else {
                      alert(res.error || 'Failed to update order status');
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-spruce bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Grand Total Paid</span>
                <span className="text-2xl font-league font-black text-primary">₹{selectedOrder.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="w-full py-3 bg-spruce text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-spruce/90 transition-all cursor-pointer"
            >
              Close Details Desk
            </button>
          </div>
        </div>
      )}

      {/* Add Farmer Modal */}
      {isAddFarmerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsAddFarmerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Add New Grower</h3>
              <button onClick={() => setIsAddFarmerModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFarmer} className="space-y-4 text-xs font-semibold text-gray-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Grower Name</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.name}
                    onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.phone}
                    onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">District</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.district}
                    onChange={(e) => setNewFarmer({ ...newFarmer, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">State</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.state}
                    onChange={(e) => setNewFarmer({ ...newFarmer, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">Farm Size (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newFarmer.farmSize}
                    onChange={(e) => setNewFarmer({ ...newFarmer, farmSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={newFarmer.rating}
                    onChange={(e) => setNewFarmer({ ...newFarmer, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={newFarmer.status}
                    onChange={(e) => setNewFarmer({ ...newFarmer, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Procurement Model</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.procurement}
                    onChange={(e) => setNewFarmer({ ...newFarmer, procurement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Primary Crops</label>
                  <input
                    type="text"
                    required
                    value={newFarmer.crops}
                    onChange={(e) => setNewFarmer({ ...newFarmer, crops: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="uppercase">Linked User Email (Optional)</label>
                <input
                  type="email"
                  value={newFarmer.userEmail}
                  onChange={(e) => setNewFarmer({ ...newFarmer, userEmail: e.target.value })}
                  placeholder="e.g. user@prithvora.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Create Grower Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {isAddPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsAddPartnerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Add Franchise Partner</h3>
              <button onClick={() => setIsAddPartnerModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPartner} className="space-y-4 text-xs font-semibold text-gray-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Partner Name</label>
                  <input
                    type="text"
                    required
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Company Name</label>
                  <input
                    type="text"
                    value={newPartner.company}
                    onChange={(e) => setNewPartner({ ...newPartner, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">Experience (Yrs)</label>
                  <input
                    type="number"
                    required
                    value={newPartner.experience}
                    onChange={(e) => setNewPartner({ ...newPartner, experience: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPartner.budget}
                    onChange={(e) => setNewPartner({ ...newPartner, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Tier</label>
                  <select
                    value={newPartner.tier}
                    onChange={(e) => setNewPartner({ ...newPartner, tier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                    <option value="PLATINUM">PLATINUM</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={newPartner.status}
                    onChange={(e) => setNewPartner({ ...newPartner, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Linked User Email (Optional)</label>
                  <input
                    type="email"
                    value={newPartner.userEmail}
                    onChange={(e) => setNewPartner({ ...newPartner, userEmail: e.target.value })}
                    placeholder="e.g. user@prithvora.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Create Partner Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {isEditPartnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsEditPartnerModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Edit Partner Profile</h3>
              <button onClick={() => setIsEditPartnerModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updatePartner(editingPartner.id, {
                  fullName: editingPartner.name,
                  email: editingPartner.email,
                  phone: editingPartner.phone,
                  companyName: editingPartner.company || undefined,
                  tier: editingPartner.tier as any,
                  experienceYears: Number(editingPartner.experience),
                  investmentBudget: Number(editingPartner.budget),
                  status: editingPartner.status,
                  userEmail: editingPartner.userEmail || undefined
                });
                if (res.success) {
                  setIsEditPartnerModalOpen(false);
                  refreshData();
                } else {
                  alert(res.error || 'Failed to update partner');
                }
              }}
              className="space-y-4 text-xs font-semibold text-gray-500"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Partner Name</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.name || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.phone || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={editingPartner.email || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Company Name</label>
                  <input
                    type="text"
                    value={editingPartner.company || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="uppercase">Experience (Yrs)</label>
                  <input
                    type="number"
                    required
                    value={editingPartner.experience || 0}
                    onChange={(e) => setEditingPartner({ ...editingPartner, experience: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingPartner.budget || 0}
                    onChange={(e) => setEditingPartner({ ...editingPartner, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Tier</label>
                  <select
                    value={editingPartner.tier || 'SILVER'}
                    onChange={(e) => setEditingPartner({ ...editingPartner, tier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                    <option value="PLATINUM">PLATINUM</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={editingPartner.status || 'PENDING'}
                    onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Linked User Email (Optional)</label>
                  <input
                    type="email"
                    value={editingPartner.userEmail || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, userEmail: e.target.value })}
                    placeholder="e.g. user@prithvora.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Save Partner Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Investor Modal */}
      {isAddInvestorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsAddInvestorModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Add Investor Lead</h3>
              <button onClick={() => setIsAddInvestorModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddInvestor} className="space-y-4 text-xs font-semibold text-gray-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Investor Name</label>
                  <input
                    type="text"
                    required
                    value={newInvestor.name}
                    onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={newInvestor.phone}
                    onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={newInvestor.email}
                    onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Accredited Status</label>
                  <select
                    value={newInvestor.accredited ? 'true' : 'false'}
                    onChange={(e) => setNewInvestor({ ...newInvestor, accredited: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="true">Accredited</option>
                    <option value="false">Not Accredited</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Investment Range</label>
                  <select
                    value={newInvestor.range}
                    onChange={(e) => setNewInvestor({ ...newInvestor, range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="$10k-$50k">$10k-$50k</option>
                    <option value="$50k-$200k">$50k-$200k</option>
                    <option value="$200k+">$200k+</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={newInvestor.status}
                    onChange={(e) => setNewInvestor({ ...newInvestor, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="uppercase">Linked User Email (Optional)</label>
                <input
                  type="email"
                  value={newInvestor.userEmail}
                  onChange={(e) => setNewInvestor({ ...newInvestor, userEmail: e.target.value })}
                  placeholder="e.g. user@prithvora.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="uppercase">Inquiry Message</label>
                <textarea
                  value={newInvestor.message}
                  onChange={(e) => setNewInvestor({ ...newInvestor, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Create Investor Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investor Modal */}
      {isEditInvestorModalOpen && editingInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsEditInvestorModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Edit Investor Lead</h3>
              <button onClick={() => setIsEditInvestorModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateInvestor(editingInvestor.id, {
                  fullName: editingInvestor.name,
                  email: editingInvestor.email,
                  phone: editingInvestor.phone,
                  investmentRange: editingInvestor.range,
                  accreditedStatus: editingInvestor.accredited,
                  message: editingInvestor.message || undefined,
                  status: editingInvestor.status,
                  userEmail: editingInvestor.userEmail || undefined
                });
                if (res.success) {
                  setIsEditInvestorModalOpen(false);
                  refreshData();
                } else {
                  alert(res.error || 'Failed to update investor');
                }
              }}
              className="space-y-4 text-xs font-semibold text-gray-500"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Investor Name</label>
                  <input
                    type="text"
                    required
                    value={editingInvestor.name || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingInvestor.phone || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={editingInvestor.email || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Accredited Status</label>
                  <select
                    value={editingInvestor.accredited ? 'true' : 'false'}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, accredited: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="true">Accredited</option>
                    <option value="false">Not Accredited</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Investment Range</label>
                  <select
                    value={editingInvestor.range || '$10k-$50k'}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="$10k-$50k">$10k-$50k</option>
                    <option value="$50k-$200k">$50k-$200k</option>
                    <option value="$200k+">$200k+</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="uppercase">Status</label>
                  <select
                    value={editingInvestor.status || 'NEW'}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="uppercase">Linked User Email (Optional)</label>
                  <input
                    type="email"
                    value={editingInvestor.userEmail || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, userEmail: e.target.value })}
                    placeholder="e.g. user@prithvora.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="uppercase">Inquiry Message</label>
                <textarea
                  value={editingInvestor.message || ''}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-spruce font-medium focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all cursor-pointer"
              >
                Save Investor Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Details Modal */}
      {isTicketModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={() => setIsTicketModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl z-10 space-y-4 animate-zoom-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-league font-black text-xl text-spruce uppercase tracking-wider">Support Inquiry Ticket</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Date Received: {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-gray-400 hover:text-spruce cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs font-semibold text-gray-500">
              <div className="grid grid-cols-2 gap-4 bg-offwhite p-3 rounded-xl border border-gray-100/50">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Sender Name</span>
                  <span className="text-spruce font-bold text-sm">{selectedTicket.name}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Email Address</span>
                  <span className="text-spruce font-bold text-sm"><a href={`mailto:${selectedTicket.email}`} className="text-primary hover:underline">{selectedTicket.email}</a></span>
                </div>
                {selectedTicket.phone && (
                  <div className="col-span-2 pt-1 border-t border-gray-200/50">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Phone</span>
                    <span className="text-spruce">{selectedTicket.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Subject</span>
                <span className="text-spruce font-bold text-sm">{selectedTicket.subject}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Inquiry Content</span>
                <div className="w-full bg-offwhite p-4 rounded-xl border border-gray-100/50 text-sm text-spruce font-medium leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedTicket.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 block">Ticket Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={async (e) => {
                      const nextStatus = e.target.value;
                      const res = await updateContactMessageStatus(selectedTicket.id, nextStatus);
                      if (res.success) {
                        setSelectedTicket({ ...selectedTicket, status: nextStatus });
                        refreshData();
                      } else {
                        alert(res.error || 'Failed to update ticket status');
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-spruce bg-white focus:outline-none focus:border-primary cursor-pointer w-full"
                  >
                    <option value="UNREAD">UNREAD</option>
                    <option value="READ">READ</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this ticket?')) {
                        const res = await deleteContactMessage(selectedTicket.id);
                        if (res.success) {
                          setIsTicketModalOpen(false);
                          refreshData();
                        } else {
                          alert(res.error || 'Failed to delete ticket');
                        }
                      }
                    }}
                    className="w-full py-2 bg-red-50 border border-red-200 text-red-600 font-league font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

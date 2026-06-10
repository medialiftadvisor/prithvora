'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ShieldAlert, LayoutDashboard, ShoppingBag, Truck, Users, Handshake, 
  LineChart, Mail, Briefcase, Plus, Check, X, ShieldCheck, Edit, Trash2 
} from 'lucide-react';

// Mock DB states for Admin panel interactive management
const MOCK_PRODUCTS = [
  { id: 'prod_honey_01', name: 'Raw Wildflower Honey', category: 'Honey', price: 450, stock: 120 },
  { id: 'prod_dairy_01', name: 'A2 Gir Cow Milk', category: 'Dairy', price: 95, stock: 200 },
  { id: 'prod_oil_01', name: 'Cold Pressed Yellow Mustard Oil', category: 'Cold Pressed Oils', price: 260, stock: 90 },
  { id: 'prod_juice_01', name: 'Cold-Pressed Pomegranate Juice', category: 'Organic Juices', price: 180, stock: 75 },
];

const MOCK_ORDERS = [
  { id: 'ORD-827192', customer: 'Anil Kumar', date: '2026-06-09', amount: 890, status: 'DELIVERED' },
  { id: 'ORD-917263', customer: 'Sita Sharma', date: '2026-06-10', amount: 375, status: 'PROCESSING' },
  { id: 'ORD-127382', customer: 'Kabir Dev', date: '2026-06-10', amount: 1250, status: 'PENDING' },
];

const MOCK_FARMERS = [
  { id: 'FARM-827', name: 'Ramesh Kumar', state: 'Haryana', crops: 'A2 Milk, Vegetables', status: 'APPROVED' },
  { id: 'FARM-912', name: 'Harpreet Singh', state: 'Punjab', crops: 'Basmati Rice', status: 'PENDING' },
];

const MOCK_PARTNERS = [
  { id: 'PART-02', name: 'Sunil Gupta', company: 'Gupta Cold Logistics', tier: 'Gold Partner', status: 'APPROVED' },
  { id: 'PART-03', name: 'Aman Deep', company: 'Deep Organic Clusters', tier: 'Platinum Partner', status: 'PENDING' },
];

const MOCK_INVESTORS = [
  { id: 'INV-401', name: 'Rajiv Malhotra', firm: 'Malhotra Capital', range: '$250k - $1M', status: 'NEW' },
  { id: 'INV-402', name: 'Sanjay Shah', firm: 'Individual Angel', range: '$50k - $250k', status: 'CONTACTED' },
];

const MOCK_APPLICATIONS = [
  { id: 'APP-92', name: 'Rahul Sharma', position: 'Lead E-Commerce Developer', date: '2026-06-08', status: 'REVIEWING' },
  { id: 'APP-93', name: 'Priya Verma', position: 'Agronomy Cluster Specialist', date: '2026-06-09', status: 'APPLIED' },
];

export default function AdminPanel() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Local state managers for mock actions
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [investors, setInvestors] = useState(MOCK_INVESTORS);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);

  const [newProduct, setNewProduct] = useState({ name: '', category: 'Dairy', price: 0, stock: 100 });

  // Route protection
  // In our NextAuth setup, users with "admin" in their email are automatically marked as role = ADMIN.
  // We check that role here to secure our backend.
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

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
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name) {
      const prod = {
        id: 'prod_' + Math.floor(100 + Math.random() * 900),
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      };
      setProducts([...products, prod]);
      setNewProduct({ name: '', category: 'Dairy', price: 0, stock: 100 });
    }
  };

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleApproveFarmer = (id: string) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, status: 'APPROVED' } : f));
  };

  const handleApprovePartner = (id: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
  };

  const handleContactInvestor = (id: string) => {
    setInvestors(investors.map(i => i.id === id ? { ...i, status: 'CONTACTED' } : i));
  };

  const sidebarLinks = [
    { key: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'orders', label: 'Orders', icon: Truck },
    { key: 'farmers', label: 'Farmers', icon: Users },
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'investors', label: 'Investors', icon: LineChart },
    { key: 'careers', label: 'Careers', icon: Briefcase },
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
        
        {/* Tab 1: Dashboard / Analytics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Dashboard Analytics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Today&apos;s Sales Volume</span>
                <h3 className="text-3xl font-league font-black text-primary">₹1,84,500</h3>
                <span className="text-xs text-primary-light font-bold">↑ 12.4% vs Yesterday</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Shipments</span>
                <h3 className="text-3xl font-league font-black text-spruce">85 Orders</h3>
                <span className="text-xs text-gray-500 font-medium">12 pending validation</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Intake Procurement</span>
                <h3 className="text-3xl font-league font-black text-accent">98,200 Litres</h3>
                <span className="text-xs text-primary-light font-bold">5 state collection hubs active</span>
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
            <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic ghee"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                >
                  <option>Dairy</option>
                  <option>Honey</option>
                  <option>Fresh Fruits</option>
                  <option>Fresh Vegetables</option>
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
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Stock (Units)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
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
                          onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors"
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
            <h2 className="text-2xl font-league font-black text-spruce">Grower Management</h2>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Grower Name</th>
                    <th className="py-3 px-4">State Location</th>
                    <th className="py-3 px-4">Crops</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {farmers.map((f) => (
                    <tr key={f.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{f.name}</td>
                      <td className="py-3 px-4">{f.state}</td>
                      <td className="py-3 px-4">{f.crops}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {f.status === 'PENDING' && (
                          <button
                            onClick={() => handleApproveFarmer(f.id)}
                            className="p-1 text-primary hover:text-primary-light"
                            title="Approve Farmer"
                          >
                            <Check className="w-4.5 h-4.5" />
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

        {/* Tab 5: Partners */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Partnership Applications</h2>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{p.name}</td>
                      <td className="py-3 px-4">{p.company}</td>
                      <td className="py-3 px-4">{p.tier}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.status === 'PENDING' && (
                          <button
                            onClick={() => handleApprovePartner(p.id)}
                            className="p-1 text-primary hover:text-primary-light"
                            title="Approve Partner"
                          >
                            <Check className="w-4.5 h-4.5" />
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

        {/* Tab 6: Investor leads */}
        {activeTab === 'investors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-league font-black text-spruce">Investor Leads Inquiries</h2>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Investor</th>
                    <th className="py-3 px-4">Firm</th>
                    <th className="py-3 px-4">Budget Range</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {investors.map((i) => (
                    <tr key={i.id} className="hover:bg-offwhite/50">
                      <td className="py-3 px-4 font-semibold text-spruce">{i.name}</td>
                      <td className="py-3 px-4">{i.firm}</td>
                      <td className="py-3 px-4">{i.range}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          i.status === 'CONTACTED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {i.status === 'NEW' && (
                          <button
                            onClick={() => handleContactInvestor(i.id)}
                            className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-light"
                          >
                            Mark Contacted
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

      </main>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { DollarSign, Percent, TrendingUp, ShieldCheck, Mail, Phone, User, Award, Check } from 'lucide-react';

const REVENUE_DATA = [
  { year: 'Year 1', revenue: 120, cost: 95 },
  { year: 'Year 2', revenue: 280, cost: 210 },
  { year: 'Year 3', revenue: 590, cost: 420 },
  { year: 'Year 4', revenue: 1120, cost: 780 },
  { year: 'Year 5', revenue: 2150, cost: 1350 },
];

const TAM_DATA = [
  { name: 'Organic Dairy', value: 45, color: '#185f39' },
  { name: 'Cold Pressed Oils', value: 25, color: '#91afa4' },
  { name: 'Wild Honey', value: 15, color: '#bda157' },
  { name: 'Fresh Produce', value: 15, color: '#0d2216' },
];

const BREAKEVEN_DATA = [
  { month: 'M1', revenue: 10, cost: 45 },
  { month: 'M3', revenue: 25, cost: 48 },
  { month: 'M6', revenue: 52, cost: 50 },
  { month: 'M9', revenue: 85, cost: 52 },
  { month: 'M12', revenue: 140, cost: 55 },
];

export default function InvestorPage() {
  const [mounted, setMounted] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '$50,000 - $250,000',
    accredited: true,
    message: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadSubmitted(false);
      setForm({ name: '', email: '', phone: '', amount: '$50,000 - $250,000', accredited: true, message: '' });
    }, 5000);
  };

  const kpis = [
    { label: 'Projected IRR', value: '28.4%', desc: 'Internal Rate of Return (5-Yr)', icon: Percent },
    { label: 'Expected ROI Multiple', value: '3.6x', desc: 'Return Multiple on Seed Cap', icon: DollarSign },
    { label: 'Breakeven Timeline', value: '7 Months', desc: 'Average Unit Breakeven', icon: TrendingUp },
    { label: 'CAGR Growth Rate', value: '62%', desc: 'Compound Annual Growth Rate', icon: TrendingUp },
  ];

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Investor Relations</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            PRITHVORA Investor Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Support rural farms, secure premium supply lines, and participate in India’s leading organic agritech scale-up. Explore our growth roadmap and financial KPIs.
          </p>
        </section>

        {/* Financial KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-primary/20 transition-all duration-300 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    {kpi.label}
                  </span>
                  <h3 className="text-3xl font-league font-black text-spruce mt-0.5">
                    {kpi.value}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{kpi.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        {mounted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Revenue & Cost Projections */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-league font-bold text-spruce">5-Year Revenue vs Cost Projection</h3>
                <p className="text-xs text-gray-400">Figures depicted in INR Lakhs (Annualized)</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#185f39" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#185f39" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bda157" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#bda157" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" fontSize={11} tickLine={false} />
                    <YAxis fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" name="Total Revenues" stroke="#185f39" fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="cost" name="Operating Costs" stroke="#bda157" fillOpacity={0.6} fill="url(#colorCost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Breakeven Intersect */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-league font-bold text-spruce">Breakeven Analysis (Unit Scale)</h3>
                <p className="text-xs text-gray-400">Monthly Cost vs Revenue Intersection (INR Thousands)</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={BREAKEVEN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} />
                    <YAxis fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="revenue" name="Revenue Stream" stroke="#185f39" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="cost" name="Fixed+Variable Costs" stroke="#bda157" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Market Size distribution (TAM) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/2 space-y-3">
                <h3 className="text-lg font-league font-bold text-spruce">TAM Segmentation</h3>
                <p className="text-xs text-gray-400">Total Addressable Market Segment Share (India Organic Foods Outlook 2026)</p>
                <div className="space-y-2 pt-2">
                  {TAM_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-spruce">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 h-56 w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TAM_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {TAM_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Investment Opportunity & Business Pillars */}
            <div className="bg-glass border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-lg font-league font-bold text-spruce">Why Partner with PRITHVORA?</h3>
              <ul className="space-y-3.5 text-xs text-gray-600">
                <li className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Strong Farmer Retention:</strong> Direct 24hr payments ensure 96% grower retention, locking down continuous supply pipelines.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Premium Margins:</strong> Vertical integration removes middleman cuts, resulting in a gross margin of 32% across dairy and honey.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Scalable Logistics:</strong> Smart collection hubs can be quickly cloned across agricultural districts with low capital overheads.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* Lead Capture form for accredited investors */}
        <section className="bg-spruce text-white rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-league font-black text-white">Join the Agriverse Expansion</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                We are raising our Series A funding round to scale collection center networks across central India and deploy decentralized chilling plants. If you are an accredited investor interested in sustainable yield values, submit an inquiry.
              </p>
              <div className="space-y-3 text-xs text-accent">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accredited investor registration compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct founder consultation within 48 hours</span>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="bg-white text-spruce p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xl space-y-4">
              <h3 className="text-lg font-league font-bold text-spruce">Request Investor Deck</h3>
              
              {leadSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-league font-bold text-lg text-spruce">Inquiry Received</h4>
                  <p className="text-xs text-gray-500">Our Founder &amp; CEO Mahesh Rao will reach out directly to your registered email.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="name@firm.com"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99999 99999"
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Intended Investment Budget</label>
                    <select
                      value={form.amount}
                      onChange={(e) => setForm({...form, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>$50,000 - $250,000</option>
                      <option>$250,000 - $1,000,000</option>
                      <option>$1,000,000+</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all"
                  >
                    Submit Investor Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

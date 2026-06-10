'use client';

import React, { useState } from 'react';
import { Award, Check, ShieldCheck, HelpCircle, ArrowRight, DollarSign } from 'lucide-react';
import { registerPartner } from '@/app/actions';
import { PartnerTier } from '@prisma/client';

export default function PartnerPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tier: 'Gold Partner',
    experience: '3-5 Years',
    capital: '₹15 Lakhs - ₹40 Lakhs',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [partnerCode, setPartnerCode] = useState('');

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const tierMap: Record<string, PartnerTier> = {
      'Silver Partner': 'SILVER',
      'Gold Partner': 'GOLD',
      'Platinum Partner': 'PLATINUM',
      'Diamond Partner': 'DIAMOND'
    };

    const expMap: Record<string, number> = {
      '0-2 Years': 1,
      '3-5 Years': 4,
      '5+ Years': 7
    };

    const capMap: Record<string, number> = {
      '₹5 Lakhs - ₹15 Lakhs': 1000000,
      '₹15 Lakhs - ₹40 Lakhs': 2500000,
      '₹40 Lakhs+': 5000000
    };

    const res = await registerPartner({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      companyName: form.company,
      tier: tierMap[form.tier] || 'SILVER',
      experienceYears: expMap[form.experience] || 2,
      investmentBudget: capMap[form.capital] || 1500000
    });

    setIsSubmitting(false);
    if (res.success) {
      setPartnerCode(res.partnerId || '');
      setFormSubmitted(true);
      setForm({ name: '', email: '', phone: '', company: '', tier: 'Gold Partner', experience: '3-5 Years', capital: '₹15 Lakhs - ₹40 Lakhs', message: '' });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 10000);
    } else {
      setErrorMsg(res.error || 'Failed to submit partnership intent.');
    }
  };

  const partnerTiers = [
    {
      name: 'Silver Partner',
      investment: '₹5 Lakhs',
      commission: '8% - 10%',
      profit: 'N/A',
      features: ['Local Distribution Node', 'Standard Digital Marketing Support', 'Weekly Logistics Replenishment', 'Prithvora Partner App Access'],
      color: 'border-gray-200 bg-white hover:border-gray-300'
    },
    {
      name: 'Gold Partner',
      investment: '₹15 Lakhs',
      commission: '12% - 15%',
      profit: 'N/A',
      features: ['City Franchise Hub exclusivity', 'Local Cold Storage Equipment support', 'Bi-weekly Agronomy training clusters', 'Priority Order Fulfillment', 'Shared Hub CRM Dashboard'],
      color: 'border-primary/20 bg-primary/[0.01] hover:border-primary/40 shadow-xs'
    },
    {
      name: 'Platinum Partner',
      investment: '₹40 Lakhs',
      commission: '16% - 18%',
      profit: '2% Pool',
      features: ['Regional Cluster Management', 'Full Sorting/Chilling Plant subsidy', 'Dedicated agronomy executive support', '2% annual state revenue pool share', 'Shared logistics branding support'],
      color: 'border-accent/30 bg-accent/[0.01] hover:border-accent/50 shadow-sm'
    },
    {
      name: 'Diamond Partner',
      investment: '₹1 Crore+',
      commission: '20% - 22%',
      profit: '5% Pool',
      features: ['State Procurement Partnership', 'Territorial logistics exclusivity', 'Board advisory consultation seat', '5% annual state profit pool share', 'Direct co-branding integration rights'],
      color: 'border-spruce bg-spruce text-white'
    }
  ];

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Grow with Us</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            PRITHVORA Partner Network
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Acquire local franchise exclusivity or establish regional sorting centers. Leverage our high-efficiency supply chains and earn premium commission structures.
          </p>
        </section>

        {/* Partner Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnerTiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${tier.color} space-y-6 group`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-league font-bold tracking-wide">{tier.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">Minimum Investment Capital</p>
                  <span className={`text-2xl font-black block mt-0.5 ${tier.name === 'Diamond Partner' ? 'text-accent' : 'text-primary'}`}>
                    {tier.investment}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100/10 text-xs">
                  <div>
                    <span className="text-gray-400 block">Commission</span>
                    <span className="font-bold text-sm block mt-0.5">{tier.commission}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Profit Pool</span>
                    <span className="font-bold text-sm block mt-0.5">{tier.profit}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-[11px] leading-relaxed">
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex gap-2 items-start">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${tier.name === 'Diamond Partner' ? 'text-accent' : 'text-primary'}`} />
                      <span className={tier.name === 'Diamond Partner' ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => {
                    setForm({...form, tier: tier.name});
                    document.getElementById('apply-form-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-league font-bold tracking-widest uppercase transition-all ${
                    tier.name === 'Diamond Partner'
                      ? 'bg-accent text-spruce hover:bg-accent-light'
                      : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  Select Tier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Matrix (Table style) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-league font-bold text-spruce">Partnership Matrix Overview</h3>
            <p className="text-xs text-gray-400">Comparison of support models, logistics integrations, and marketing rights.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Support Parameters</th>
                  <th className="py-3 px-4">Silver</th>
                  <th className="py-3 px-4">Gold</th>
                  <th className="py-3 px-4">Platinum</th>
                  <th className="py-3 px-4">Diamond</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-spruce">Territory Rights</td>
                  <td className="py-3 px-4">Shared</td>
                  <td className="py-3 px-4">City Exclusivity</td>
                  <td className="py-3 px-4">Regional Exclusivity</td>
                  <td className="py-3 px-4">State Exclusivity</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-spruce">Agronomist Visits</td>
                  <td className="py-3 px-4">Monthly webinar</td>
                  <td className="py-3 px-4">Bi-weekly visits</td>
                  <td className="py-3 px-4">Dedicated resource</td>
                  <td className="py-3 px-4">Consultation council</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-spruce">Chilling Hub Subsidy</td>
                  <td className="py-3 px-4">None</td>
                  <td className="py-3 px-4">15% Equipment cut</td>
                  <td className="py-3 px-4">35% Facility cut</td>
                  <td className="py-3 px-4">Full Capital subsidy</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-spruce">Marketing Budgets</td>
                  <td className="py-3 px-4">Shared templates</td>
                  <td className="py-3 px-4">₹20k/Mo Co-pay</td>
                  <td className="py-3 px-4">₹50k/Mo Dedicated</td>
                  <td className="py-3 px-4">Custom State Budget</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form-section" className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce">Register Partner Intent</h2>
            <p className="text-xs text-gray-400">Our regional development managers will coordinate validation checks within 3 business days.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl text-center font-semibold">
              {errorMsg}
            </div>
          )}

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-league font-bold text-lg text-spruce">Application Submitted</h4>
              <p className="text-xs text-gray-500">Your tracking number is <strong className="text-primary">{partnerCode}</strong>. We will call you shortly.</p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="text-xs text-primary underline font-bold mt-2"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Applicant Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@company.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 96606 86394"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Company Name (If applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. Agri-Logistics Ltd."
                    value={form.company}
                    onChange={(e) => setForm({...form, company: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Target Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm({...form, tier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Silver Partner</option>
                    <option>Gold Partner</option>
                    <option>Platinum Partner</option>
                    <option>Diamond Partner</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Logistics Experience</label>
                  <select
                    value={form.experience}
                    onChange={(e) => setForm({...form, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>0-2 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Available Capital</label>
                  <select
                    value={form.capital}
                    onChange={(e) => setForm({...form, capital: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>₹5 Lakhs - ₹15 Lakhs</option>
                    <option>₹15 Lakhs - ₹40 Lakhs</option>
                    <option>₹40 Lakhs+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Message &amp; Territory Request</label>
                <textarea
                  rows={4}
                  placeholder="Detail your preferred territory districts or operating background..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Intent...' : 'Submit Partnership Intent'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}

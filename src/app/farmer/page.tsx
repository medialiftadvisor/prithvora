'use client';

import React, { useState } from 'react';
import { Sprout, ShieldCheck, DollarSign, Award, Users, Check, MapPin, ArrowRight } from 'lucide-react';

interface CenterData {
  id: string;
  state: string;
  growers: string;
  capacity: string;
  crops: string;
  chillingCapacity: string;
}

const CENTER_DETAILS: Record<string, CenterData> = {
  haryana: {
    id: 'cnt_01',
    state: 'Haryana (Karnal Cluster)',
    growers: '2,400+ Farmers',
    capacity: '30,000 Litres/Day',
    crops: 'Gir A2 Milk, Wheat, Green Vegetables',
    chillingCapacity: 'Fully Deployed (BMS Monitors)'
  },
  punjab: {
    id: 'cnt_02',
    state: 'Punjab (Ludhiana Cluster)',
    growers: '3,100+ Farmers',
    capacity: '42,000 Litres/Day',
    crops: 'Raw A2 Milk, Organic Basmati Rice, Vegetables',
    chillingCapacity: 'Fully Deployed (Solar Chilling)'
  },
  rajasthan: {
    id: 'cnt_03',
    state: 'Rajasthan (Alwar Cluster)',
    growers: '1,850+ Farmers',
    capacity: '12,000 Litres/Day',
    crops: 'Wildflower Honey, Mustard Seeds, Sesame Seeds',
    chillingCapacity: 'Procurement Chutes Only'
  },
  up: {
    id: 'cnt_04',
    state: 'Uttar Pradesh (Mathura Cluster)',
    growers: '4,200+ Farmers',
    capacity: '55,000 Litres/Day',
    crops: 'A2 Cow Milk, Mangoes, Sugarcane, Pickles',
    chillingCapacity: 'Fully Deployed (Dual Generators)'
  },
  gujarat: {
    id: 'cnt_05',
    state: 'Gujarat (Anand Cluster)',
    growers: '3,500+ Farmers',
    capacity: '48,000 Litres/Day',
    crops: 'Raw A2 Milk, Organic Cotton, Groundnuts',
    chillingCapacity: 'Fully Deployed (Industrial Chillers)'
  }
};

export default function FarmerPage() {
  const [selectedState, setSelectedState] = useState<string>('rajasthan');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    state: 'Rajasthan',
    district: '',
    farmSize: '',
    crop: 'A2 Milk',
    model: 'Contract Farming'
  });

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setForm({ name: '', phone: '', state: 'Rajasthan', district: '', farmSize: '', crop: 'A2 Milk', model: 'Contract Farming' });
    }, 5000);
  };

  const activeCenter = CENTER_DETAILS[selectedState];

  const benefits = [
    { title: '24-Hour Direct Payments', desc: 'Eliminate middlemen and receive secure money transfers directly to your bank account within 24 hours of procurement logging.', icon: DollarSign },
    { title: 'Agronomy & Soil Support', desc: 'Free agricultural soil tests, crop rotation consultations, and organic farming guides from Prithvora agronomists.', icon: Sprout },
    { title: 'Organic Inputs Subsidy', desc: 'Up to 35% subsidies on bio-fertilizers, organic seeds, and solar farm inputs through our partner network.', icon: Award },
    { title: 'Fair Price Assured', desc: 'Secure minimum support price agreements before planting, safeguarding your household from market price crashes.', icon: ShieldCheck },
  ];

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Farmer Empowerment</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            PRITHVORA Farmer Program
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Connecting rural growers directly with urban households. Receive fair payouts, organic input subsidies, and complete agronomic training clusters.
          </p>
        </section>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs hover:border-primary/20 transition-all duration-300 flex gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-league font-bold text-spruce tracking-wide">{b.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive India Map / Collection Centers Dashboard */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Map Info Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-league font-black text-spruce leading-tight">Interactive Collection Center Map</h2>
              <p className="text-xs text-gray-400">Click on the buttons to explore our active regional clusters and chilling capacities.</p>
            </div>

            {/* Selector list */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(CENTER_DETAILS).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedState(key)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    selectedState === key
                      ? 'bg-primary text-white'
                      : 'bg-offwhite text-spruce hover:bg-gray-200'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Display Cluster Stats */}
            <div className="p-6 bg-offwhite border border-gray-100 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-sm tracking-wide text-spruce">{activeCenter.state}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Active Growers</span>
                  <span className="font-bold text-spruce block mt-0.5">{activeCenter.growers}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Daily Intake Volume</span>
                  <span className="font-bold text-spruce block mt-0.5">{activeCenter.capacity}</span>
                </div>
              </div>

              <div className="text-xs border-t border-gray-200/50 pt-3">
                <span className="text-gray-400 block">Primary Crops Procured</span>
                <span className="font-bold text-primary block mt-0.5">{activeCenter.crops}</span>
              </div>

              <div className="text-xs">
                <span className="text-gray-400 block">Chilling Infrastructure</span>
                <span className="font-bold text-accent block mt-0.5">{activeCenter.chillingCapacity}</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Representation of India Map / Clusters */}
          <div className="lg:col-span-7 flex justify-center items-center bg-offwhite/50 border border-gray-100 rounded-2xl p-6 min-h-[350px]">
            <svg viewBox="0 0 400 450" className="w-full max-w-sm drop-shadow-md">
              {/* Dummy outlines representing India shape */}
              <path 
                d="M190,50 L200,60 L210,50 L220,70 L210,100 L230,120 L280,130 L320,150 L310,180 L290,190 L260,200 L230,220 L240,260 L270,280 L250,320 L220,380 L200,420 L195,430 L190,420 L180,380 L185,340 L170,300 L160,280 L145,260 L120,260 L100,240 L90,200 L60,190 L50,180 L80,165 L100,165 L120,120 L140,110 L160,85 L180,75 Z"
                fill="#f0f5f2" 
                stroke="#185f39" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />

              {/* Haryana Center */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('haryana')}
              >
                <circle cx="160" cy="120" r={selectedState === 'haryana' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="160" cy="120" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'haryana' ? 'block' : 'none' }} />
                <text x="160" y="105" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">HARYANA</text>
              </g>

              {/* Punjab Center */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('punjab')}
              >
                <circle cx="145" cy="95" r={selectedState === 'punjab' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="145" cy="95" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'punjab' ? 'block' : 'none' }} />
                <text x="145" y="80" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">PUNJAB</text>
              </g>

              {/* Rajasthan Center */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('rajasthan')}
              >
                <circle cx="125" cy="150" r={selectedState === 'rajasthan' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="125" cy="150" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'rajasthan' ? 'block' : 'none' }} />
                <text x="125" y="135" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">RAJASTHAN</text>
              </g>

              {/* UP Center */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('up')}
              >
                <circle cx="185" cy="140" r={selectedState === 'up' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="185" cy="140" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'up' ? 'block' : 'none' }} />
                <text x="185" y="125" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">UTTAR PRADESH</text>
              </g>

              {/* Gujarat Center */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('gujarat')}
              >
                <circle cx="95" cy="210" r={selectedState === 'gujarat' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="95" cy="210" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'gujarat' ? 'block' : 'none' }} />
                <text x="95" y="195" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">GUJARAT</text>
              </g>

            </svg>
          </div>

        </section>

        {/* Farmer Registration Form */}
        <section className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce">Farmer Registration Form</h2>
            <p className="text-xs text-gray-400">Join our network. Our regional field assistants will visit your farm to verify within 48 hours.</p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-league font-bold text-lg text-spruce">Registration Request Received</h4>
              <p className="text-xs text-gray-500">Your registration code is PRV-FARM-{Math.floor(1000 + Math.random() * 9000)}. We will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Farmer Full Name (नाम)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile Number (मोबाइल नंबर)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 96606 86394"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">State (राज्य)</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({...form, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Haryana</option>
                    <option>Punjab</option>
                    <option>Rajasthan</option>
                    <option>Uttar Pradesh</option>
                    <option>Gujarat</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">District (जिला)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karnal"
                    value={form.district}
                    onChange={(e) => setForm({...form, district: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Land Size (एकड़ में)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5"
                    value={form.farmSize}
                    onChange={(e) => setForm({...form, farmSize: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Primary Harvest Crop</label>
                  <select
                    value={form.crop}
                    onChange={(e) => setForm({...form, crop: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>A2 Milk</option>
                    <option>Wild Honey</option>
                    <option>Mustard Seeds</option>
                    <option>Green Vegetables</option>
                    <option>Fruits</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Preferred Procurement Model</label>
                  <select
                    value={form.model}
                    onChange={(e) => setForm({...form, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Contract Farming</option>
                    <option>Co-operative Pooling</option>
                    <option>Daily Spot Market</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2"
              >
                Submit Farmer Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}

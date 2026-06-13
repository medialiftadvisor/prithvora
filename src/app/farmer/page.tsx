'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, ShieldCheck, DollarSign, Award, Users, Check, MapPin, ArrowRight, Star } from 'lucide-react';
import { registerFarmer, getFarmers } from '@/app/actions';

interface CenterData {
  id: string;
  state: string;
  growers: string;
  capacity: string;
  crops: string;
  chillingCapacity: string;
}

const CENTER_DETAILS: Record<string, CenterData> = {
  alwar: {
    id: 'cnt_raj_01',
    state: 'Alwar Hub (East Rajasthan)',
    growers: '1,850+ Farmers',
    capacity: '12,000 Litres/Day',
    crops: 'Wildflower Honey, Mustard Seeds, Cold Pressed Oils',
    chillingCapacity: 'Fully Functional (Solar Cooling)'
  },
  jaipur: {
    id: 'cnt_raj_02',
    state: 'Jaipur Hub (Central Rajasthan)',
    growers: '2,100+ Farmers',
    capacity: '24,000 Litres/Day',
    crops: 'Vedic Ghee, Fresh A2 Cow Milk, Dairy Products',
    chillingCapacity: 'Fully Functional (BMS Monitored)'
  },
  bikaner: {
    id: 'cnt_raj_03',
    state: 'Bikaner Hub (North Rajasthan)',
    growers: '1,450+ Farmers',
    capacity: '8,500 Units/Day',
    crops: 'Organic Spices, Fenugreek, Cumin, Mustard Oils',
    chillingCapacity: 'Procurement Chutes Only'
  },
  jodhpur: {
    id: 'cnt_raj_04',
    state: 'Jodhpur Hub (West Rajasthan)',
    growers: '1,200+ Farmers',
    capacity: '10,500 Litres/Day',
    crops: 'Organic Aloe Juices, Pomegranates, Dates',
    chillingCapacity: 'Procurement Chutes & Cold Room'
  },
  udaipur: {
    id: 'cnt_raj_05',
    state: 'Udaipur Hub (South Rajasthan)',
    growers: '1,650+ Farmers',
    capacity: '15,000 Kg/Day',
    crops: 'Fresh Organic Fruits, Green Vegetables, Pickles',
    chillingCapacity: 'Fully Functional (Solar Cooling)'
  }
};

export default function FarmerPage() {
  const [selectedState, setSelectedState] = useState<string>('alwar');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [farmerCode, setFarmerCode] = useState('');
  const [farmersList, setFarmersList] = useState<any[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    state: 'Rajasthan',
    district: '',
    farmSize: '',
    crop: 'A2 Milk',
    model: 'Contract Farming'
  });

  const fetchFarms = async () => {
    try {
      const data = await getFarmers();
      setFarmersList(data || []);
    } catch (err) {
      console.error('Failed to load farmers:', err);
    } finally {
      setLoadingFarmers(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    const res = await registerFarmer({
      fullName: form.name,
      phone: form.phone,
      state: form.state,
      district: form.district,
      farmSizeAcres: Number(form.farmSize) || 0,
      primaryCrops: form.crop,
      procurementModel: form.model
    });

    setIsSubmitting(false);
    if (res.success) {
      setFarmerCode(res.farmerId || '');
      setFormSubmitted(true);
      fetchFarms();
      // Automatically dismiss success message after 10s
      setTimeout(() => {
        setFormSubmitted(false);
      }, 10000);
    } else {
      setErrorMsg(res.error || 'Failed to submit registration.');
    }
  };

  const getGrowersCountForHub = (hubKey: string) => {
    const matched = farmersList.filter(f => f.district.toLowerCase() === hubKey.toLowerCase());
    return `${matched.length} Registered Farmer${matched.length !== 1 ? 's' : ''}`;
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
                  <span className="font-bold text-spruce block mt-0.5">{getGrowersCountForHub(selectedState)}</span>
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

          {/* Interactive SVG Representation of Rajasthan Map / Clusters */}
          <div className="lg:col-span-7 flex justify-center items-center bg-offwhite/50 border border-gray-100 rounded-2xl p-6 min-h-[350px]">
            <svg viewBox="0 0 400 450" className="w-full max-w-sm drop-shadow-md">
              {/* Stylized Rajasthan map outline */}
              <polygon 
                points="200,40 290,140 330,170 310,240 260,330 220,380 170,350 150,330 130,290 80,240 60,200 70,160 120,90"
                fill="#f0f5f2" 
                stroke="#185f39" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />

              {/* Alwar Hub */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('alwar')}
              >
                <circle cx="270" cy="160" r={selectedState === 'alwar' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="270" cy="160" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'alwar' ? 'block' : 'none' }} />
                <text x="270" y="145" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">ALWAR</text>
              </g>

              {/* Jaipur Hub */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('jaipur')}
              >
                <circle cx="210" cy="200" r={selectedState === 'jaipur' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="210" cy="200" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'jaipur' ? 'block' : 'none' }} />
                <text x="210" y="185" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">JAIPUR</text>
              </g>

              {/* Bikaner Hub */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('bikaner')}
              >
                <circle cx="140" cy="110" r={selectedState === 'bikaner' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="140" cy="110" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'bikaner' ? 'block' : 'none' }} />
                <text x="140" y="95" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">BIKANER</text>
              </g>

              {/* Jodhpur Hub */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('jodhpur')}
              >
                <circle cx="110" cy="210" r={selectedState === 'jodhpur' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="110" cy="210" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'jodhpur' ? 'block' : 'none' }} />
                <text x="110" y="195" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">JODHPUR</text>
              </g>

              {/* Udaipur Hub */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedState('udaipur')}
              >
                <circle cx="160" cy="310" r={selectedState === 'udaipur' ? 12 : 8} fill="#185f39" className="transition-all fill-primary hover:fill-accent" />
                <circle cx="160" cy="310" r="20" fill="none" stroke="#185f39" strokeWidth="1" className="animate-ping" style={{ display: selectedState === 'udaipur' ? 'block' : 'none' }} />
                <text x="160" y="295" textAnchor="middle" className="text-[10px] font-bold fill-spruce font-league tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">UDAIPUR</text>
              </g>

            </svg>
          </div>

        </section>

        {/* Registered Farmers Registry */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-league font-black text-spruce tracking-wide">Our Registered Growers Registry</h2>
            <p className="text-xs text-gray-500 font-inter">
              Direct verification, premium single-origin farming, and transparent payouts. Explore our active verified farmer partners in Rajasthan.
            </p>
          </div>

          {loadingFarmers ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : farmersList.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 text-gray-400 text-xs font-semibold">
              No registered growers found. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmersList.map((farmer) => (
                <div 
                  key={farmer.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-league font-bold text-base text-spruce tracking-wide">{farmer.fullName}</h3>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" />
                          {farmer.district}, {farmer.state}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 bg-accent/10 text-accent font-bold text-[10px] px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        {farmer.rating?.toFixed(1) || '5.0'}
                      </span>
                    </div>

                    <div className="border-t border-gray-50 pt-3 space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Crops:</span>
                        <span className="font-semibold text-spruce">{farmer.primaryCrops}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Farm Size:</span>
                        <span className="font-semibold text-spruce">{farmer.farmSizeAcres} Acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Procurement Model:</span>
                        <span className="font-semibold text-primary">{farmer.procurementModel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      farmer.status === 'APPROVED' 
                        ? 'bg-primary/10 text-primary' 
                        : farmer.status === 'REJECTED' 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {farmer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Farmer Registration Form */}
        <section className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              🆓 Registration: 100% Free / निःशुल्क पंजीकरण
            </div>
            <h2 className="text-2xl font-league font-black text-spruce">Farmer Registration Form</h2>
            <p className="text-xs text-gray-400">Join our network for free. Our regional field assistants will visit your farm to verify within 48 hours.</p>
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
              <h4 className="font-league font-bold text-lg text-spruce">Registration Request Received</h4>
              <p className="text-xs text-gray-500">Your registration ID is <strong className="text-primary">{farmerCode}</strong>. Our field assistant will contact you shortly.</p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="text-xs text-primary underline font-bold mt-2"
              >
                Submit another application
              </button>
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
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <option value="Rajasthan">Rajasthan (केवल राजस्थान)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">District (जिला)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alwar, Jaipur, Jodhpur"
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
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Free Farmer Application (निःशुल्क आवेदन)'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}

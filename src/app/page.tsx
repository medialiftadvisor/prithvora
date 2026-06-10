'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  ArrowRight, Sprout, ShieldCheck, DollarSign, Award, Users, MapPin, 
  ChevronLeft, ChevronRight, Check, Send, Phone, Mail, FileText, Briefcase, 
  TrendingUp, Globe, Sun, Droplets, Heart, Sparkles, Building, ShoppingBag
} from 'lucide-react';
import EarthFarmlandCanvas from '@/components/3d/EarthFarmlandCanvas';
import { useCartStore } from '@/store/useCartStore';

// Mock products for the product carousel section
const CAROUSEL_PRODUCTS = [
  { id: 'prod_honey_01', name: 'Raw Wildflower Honey', category: 'Honey', price: 450, image: '/honey.png', desc: 'Cold extracted pure wildflower honey.' },
  { id: 'prod_dairy_01', name: 'A2 Gir Cow Milk', category: 'Dairy', price: 95, image: '/dairy.png', desc: 'Grass-fed native Gir cow A2 milk.' },
  { id: 'prod_oil_01', name: 'Cold Pressed Yellow Mustard Oil', category: 'Cold Pressed Oils', price: 260, image: '/oils.png', desc: 'Traditional wood-pressed seed oil.' },
  { id: 'prod_juice_01', name: 'Cold-Pressed Pomegranate Juice', category: 'Organic Juices', desc: '100% natural, hydraulic cold pressed.', price: 180, image: '/juices.png' },
];

const FINANCIAL_PROJECTS = [
  { year: 'Year 1', revenue: 120, profits: 8, capex: 60 },
  { year: 'Year 2', revenue: 280, profits: 32, capex: 80 },
  { year: 'Year 3', revenue: 590, profits: 98, capex: 120 },
  { year: 'Year 4', revenue: 1120, profits: 220, capex: 190 },
  { year: 'Year 5', revenue: 2150, profits: 490, capex: 310 },
];

export default function HomePage() {
  const { addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Carousel controls
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Testimonial index
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Contact tab state (general, investor, partner, farmer, career)
  const [leadTab, setLeadTab] = useState('contact');
  const [formState, setFormState] = useState({
    name: '', email: '', phone: '', topic: 'General Inquiry', message: '',
    firm: '', capital: '$50,000 - $250,000', crops: 'A2 Milk', experience: '0-2 Years'
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNextProduct = () => {
    setCarouselIndex((prev) => (prev + 1) % CAROUSEL_PRODUCTS.length);
  };

  const handlePrevProduct = () => {
    setCarouselIndex((prev) => (prev - 1 + CAROUSEL_PRODUCTS.length) % CAROUSEL_PRODUCTS.length);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % 4);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + 4) % 4);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('✓ Request submitted! Our team will follow up within 24 hours.');
    setTimeout(() => {
      setSuccessMsg('');
      setFormState({
        name: '', email: '', phone: '', topic: 'General Inquiry', message: '',
        firm: '', capital: '$50,000 - $250,000', crops: 'A2 Milk', experience: '0-2 Years'
      });
    }, 4000);
  };

  // Testimonials database
  const testimonials = [
    { type: 'Farmer Partner', name: 'Harpreet Singh', location: 'Punjab', quote: 'Prithvora changed my life. I get daily milk measurements on my phone and direct payments within 24 hours. The organic seed kits increased my yield by 20%.' },
    { type: 'Valued Consumer', name: 'Dr. Renu Malhotra', location: 'Gurugram', quote: 'Finding pure, unadulterated milk and raw honey used to be a challenge. With Prithvora, the cold-chain logistics deliver natural quality to my kids every morning.' },
    { type: 'Franchise Partner', name: 'Anil Gupta', location: 'Haryana', quote: 'Operating a Gold franchise hub is highly profitable. The cold storage support and agronomy webinars provide absolute operational clarity.' },
    { type: 'Seed Investor', name: 'Sanjay Shah', location: 'Mumbai', quote: 'PRITHVORAs focus on removing value-chain waste creates massive margin opportunities. The Unit economics and IRR projection make this a top agritech bet.' }
  ];

  return (
    <div className="relative w-full min-h-screen bg-spruce text-white overflow-hidden">
      
      {/* 3D background canvas */}
      <EarthFarmlandCanvas />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CINEMATIC HERO */}
      {/* ------------------------------------------------------------- */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-xs sm:text-sm font-bold text-accent tracking-[0.25em] uppercase">
              The Essence of Earth
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-league font-black text-white tracking-wider leading-none">
              PRITHVORA
            </h1>
            <p className="text-sm sm:text-lg text-secondary-light tracking-wide max-w-2xl mx-auto font-inter">
              Building India&apos;s most trusted Farm-to-Home and Food Processing Ecosystem.
            </p>
            <p className="text-xs sm:text-sm italic font-light text-gray-400">
              &quot;From Farmers&apos; Dreams to Every Family&apos;s Table&quot;
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link href="/products" className="px-6 py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all shadow-lg">
                Explore Store
              </Link>
              <Link href="#apply-tabs" onClick={() => setLeadTab('partner')} className="px-6 py-3 bg-accent text-spruce font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-accent-light transition-all shadow-lg">
                Become a Partner
              </Link>
              <Link href="#apply-tabs" onClick={() => setLeadTab('farmer')} className="px-6 py-3 bg-white/5 backdrop-blur-md text-white border border-white/10 font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-white/10 transition-all">
                Join as Farmer
              </Link>
              <Link href="#apply-tabs" onClick={() => setLeadTab('investor')} className="px-6 py-3 bg-primary-dark border border-primary/20 text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary transition-all">
                Invest Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: WHO WE ARE */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Overview</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Who We Are</p>
            <p className="text-xs text-gray-400 leading-relaxed font-inter">
              PRITHVORA is building a complete agricultural ecosystem that connects farmers directly with families through technology, processing, transparency and trust.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Agriculture', icon: Sprout, desc: 'Organic farming methods' },
              { title: 'Dairy Range', icon: Award, desc: 'Pure A2 milk and ghee' },
              { title: 'Wild Honey', icon: Sparkles, desc: 'Apiary harvested cold honey' },
              { title: 'Organic Juices', icon: Droplets, desc: 'Cold pressed enzymes' },
              { title: 'Cold pressed Oils', icon: Sun, desc: 'Wood pressed mustard oil' },
              { title: 'Pickles range', icon: Heart, desc: 'Handmade traditional recipes' },
              { title: 'Food Processing', icon: Building, desc: 'Decentralized processing centers' },
              { title: 'Supply Chain', icon: Globe, desc: '100% cold-chain traceability' },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.03] transition-all duration-300 space-y-3 group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light group-hover:text-accent transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-league font-bold text-sm text-white tracking-wide">{card.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: OUR PURPOSE */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Our Purpose</h2>
            <h3 className="text-3xl sm:text-5xl font-league font-black text-white leading-tight">
              Solving Inefficiencies, Creating Shared Value.
            </h3>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="p-4 border-l-2 border-red-500 bg-red-500/5 rounded-r-xl">
                <strong className="text-white block mb-1">The Critical Problem</strong>
                Farmers work the hardest yet receive the lowest payouts due to complex broker structures. Consumers pay premium prices yet receive chemical-adulterated foods that lose nutritional integrity in standard warehouses.
              </div>
              <div className="p-4 border-l-2 border-primary bg-primary/5 rounded-r-xl">
                <strong className="text-white block mb-1">Our Agri-Solution</strong>
                PRITHVORA removes these inefficiencies. We source directly from village chilling units, execute immediate lab tests, and deliver direct payments within 24 hours. Our cold chain brings pesticide-free food straight to your table.
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6 text-center">
            <h4 className="font-league font-bold text-lg text-accent">Value Flow Pipeline</h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
              <div className="p-4 bg-white/5 rounded-xl w-28">🌾 Farmer</div>
              <div className="text-accent">→</div>
              <div className="p-4 bg-white/5 rounded-xl w-28">🏭 Processing</div>
              <div className="text-accent">→</div>
              <div className="p-4 bg-white/5 rounded-xl w-28">🚚 Delivery</div>
              <div className="text-accent">→</div>
              <div className="p-4 bg-white/5 rounded-xl w-28">🍽️ Family</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: OUR ECOSYSTEM FLOW */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Traceability</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Interactive Ecosystem Flow</p>
            <p className="text-xs text-gray-400 max-w-xl mx-auto">From seed plantation to home doorstep delivery. Trace our cold-chain process flow below.</p>
          </div>

          {/* Flow cards */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center text-xs">
            {[
              { step: '1', title: 'Farmers', desc: 'Harvest & Log' },
              { step: '2', title: 'Collection Centers', desc: 'Direct Chilling' },
              { step: '3', title: 'Quality Testing', desc: 'Purity Check' },
              { step: '4', title: 'Processing Units', desc: 'Zero Chemicals' },
              { step: '5', title: 'Packaging', desc: 'Nutrient Seal' },
              { step: '6', title: 'Distribution', desc: 'Cold Logistics' },
              { step: '7', title: 'Consumers', desc: 'Home Table' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 hover:border-primary/30 transition-all duration-300">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto text-[10px]">{item.step}</span>
                <h4 className="font-bold text-white tracking-wide">{item.title}</h4>
                <p className="text-[9px] text-gray-400 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: PRODUCT ECOSYSTEM CAROUSEL */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Pure Selection</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Organic Product Ecosystem</p>
          </div>

          {/* Carousel container */}
          <div className="max-w-lg mx-auto bg-white text-spruce rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <div className="flex gap-6 items-center">
              <div className="w-1/2 aspect-square bg-offwhite rounded-2xl flex items-center justify-center p-6">
                <img 
                  src={CAROUSEL_PRODUCTS[carouselIndex].image} 
                  alt={CAROUSEL_PRODUCTS[carouselIndex].name}
                  className="object-contain w-36 h-36"
                />
              </div>
              <div className="w-1/2 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{CAROUSEL_PRODUCTS[carouselIndex].category}</span>
                  <h3 className="font-league font-bold text-lg text-spruce leading-tight mt-0.5">{CAROUSEL_PRODUCTS[carouselIndex].name}</h3>
                  <p className="text-[11px] text-gray-400 italic mt-1">{CAROUSEL_PRODUCTS[carouselIndex].desc}</p>
                </div>
                <div className="space-y-3">
                  <span className="text-xl font-black text-spruce">₹{CAROUSEL_PRODUCTS[carouselIndex].price}</span>
                  <button
                    onClick={() => {
                      addToCart(CAROUSEL_PRODUCTS[carouselIndex], 1);
                    }}
                    className="w-full py-2 bg-primary text-white font-league font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Slider triggers */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button onClick={handlePrevProduct} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-gray-400 font-bold">{carouselIndex + 1} / {CAROUSEL_PRODUCTS.length}</span>
              <button onClick={handleNextProduct} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 6: WHY PRITHVORA STATS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Traceability stats</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Why PRITHVORA?</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 text-center">
            {[
              { val: '15k+', label: 'Farmer First' },
              { val: '100%', label: 'Traceability' },
              { val: '24hr', label: 'Farm to Home' },
              { val: 'A2 Grade', label: 'Premium Quality' },
              { val: 'Zero Chem', label: 'Food Safety' },
              { val: 'Solar', label: 'Sustainability' },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                <h4 className="text-2xl sm:text-3xl font-league font-black text-accent">{stat.val}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 7: FOR FARMERS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Grower Program</h2>
            <h3 className="text-3xl sm:text-5xl font-league font-black text-white">Empowering Farmers</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-inter">
              We provide village chilling infrastructure, direct payments in 24 hours, organic training clusters, and guaranteed minimum procurement prices.
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-accent" /> Better Pricing</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-accent" /> Guaranteed Procurement</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-accent" /> Modern Agronomy Training</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-accent" /> Faster 24hr Payouts</li>
            </ul>
            <div>
              <Link href="#apply-tabs" onClick={() => setLeadTab('farmer')} className="px-6 py-2.5 bg-primary text-white text-xs font-league font-bold tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all inline-flex items-center gap-1.5">
                Become a Farmer Partner
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5">
            <img src="/produce.png" alt="Organic farming harvest" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 8: FOR INVESTORS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 lg:order-2">
            <img src="/dairy.png" alt="Investor opportunities" className="object-cover w-full h-full" />
          </div>

          <div className="space-y-6 lg:order-1">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Investor Relations</h2>
            <h3 className="text-3xl sm:text-5xl font-league font-black text-white">Join the Agri-Scaleup</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-inter">
              India&apos;s organic and food processing markets are scaling rapidly. With a robust unit economics model, 62% CAGR roadmap, and 28.4% projected IRR, Prithvora is seed-cap ready.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-primary font-bold text-lg block">62%</span>
                <span>Market Growth</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-primary font-bold text-lg block">28.4%</span>
                <span>Projected IRR</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-primary font-bold text-lg block">3.6x</span>
                <span>ROI Potential</span>
              </div>
            </div>
            <div>
              <Link href="#apply-tabs" onClick={() => setLeadTab('investor')} className="px-6 py-2.5 bg-accent text-spruce text-xs font-league font-bold tracking-widest uppercase rounded-lg hover:bg-accent-light transition-all inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Download Investor Deck
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 9: FOR PARTNERS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Distribution</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Partnership Levels &amp; Commissions</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {[
              { level: 'Silver Partner', comm: '8% - 10%', req: '₹5L Cap', desc: 'Local distribution nodes' },
              { level: 'Gold Partner', comm: '12% - 15%', req: '₹15L Cap', desc: 'City Franchise hubs' },
              { level: 'Platinum Partner', comm: '16% - 18%', req: '₹40L Cap', desc: 'Regional Sorting centers' },
              { level: 'Diamond Partner', comm: '20% - 22%', req: '₹1Cr+ Cap', desc: 'State logistics network' },
            ].map((p, idx) => (
              <div key={idx} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300 space-y-2">
                <h4 className="font-league font-bold text-sm text-white">{p.level}</h4>
                <div className="flex justify-between font-bold text-accent">
                  <span>Comm: {p.comm}</span>
                  <span>{p.req}</span>
                </div>
                <p className="text-[10px] text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="#apply-tabs" onClick={() => setLeadTab('partner')} className="px-6 py-2.5 bg-primary text-white text-xs font-league font-bold tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all inline-flex items-center gap-1.5">
              Become a Franchise Partner
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 10: FOR EMPLOYEES */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Join Our Team</h2>
            <h3 className="text-3xl sm:text-5xl font-league font-black text-white">Purpose-Driven Careers</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-inter">
              We are building the future of sustainable food value chain. Join us to build, scale, and innovate agritech solutions.
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Career Growth &amp; ESOPs</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Multi-disciplinary Innovation</li>
              <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Hybrid Work flexibility</li>
            </ul>
            <div>
              <Link href="#apply-tabs" onClick={() => setLeadTab('career')} className="px-6 py-2.5 bg-primary text-white text-xs font-league font-bold tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Join Our Team
              </Link>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5">
            <img src="/oils.png" alt="Corporate culture" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 11: FINANCIAL HIGHLIGHTS */}
      {/* ------------------------------------------------------------- */}
      {mounted && (
        <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Metrics</h2>
              <p className="text-3xl sm:text-4xl font-league font-black">Financial Projections Dashboard</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1 */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="font-league font-bold text-sm text-white">5-Year Revenue &amp; Profit Outlook</h4>
                <div className="h-64 text-spruce">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FINANCIAL_PROJECTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" fontSize={11} stroke="rgba(255,255,255,0.4)" tickLine={false} />
                      <YAxis fontSize={11} stroke="rgba(255,255,255,0.4)" tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="revenue" name="Revenue" fill="#185f39" />
                      <Bar dataKey="profits" name="Net Profits" fill="#bda157" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2 */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="font-league font-bold text-sm text-white">CAPEX Investment Allocations</h4>
                <div className="h-64 text-spruce">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FINANCIAL_PROJECTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#185f39" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#185f39" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" fontSize={11} stroke="rgba(255,255,255,0.4)" tickLine={false} />
                      <YAxis fontSize={11} stroke="rgba(255,255,255,0.4)" tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="capex" name="CAPEX" stroke="#185f39" fillOpacity={1} fill="url(#colorCap)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 12: 5-YEAR ROADMAP */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Pillars</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Strategic 5-Year Roadmap</p>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-12">
            {[
              { year: 'Year 1', title: 'Agriverse Launch', desc: 'Initialize Haryana collection clusters, set up cold-chain logistics in Delhi NCR, and activate products catalog.' },
              { year: 'Year 2', title: 'Rajasthan Expansion', desc: 'Deploy apiary honey collection units and wood-pressed seed crushing plants in Alwar clusters.' },
              { year: 'Year 3', title: 'North India Coverage', desc: 'Scale cold-chain operations to Punjab and Uttar Pradesh districts, supporting 10,000+ farmers.' },
              { year: 'Year 5', title: 'Pan-India Operations', desc: 'Clone chilling plant infrastructure across Western and Southern clusters, serving 1,00,000+ families.' },
              { year: 'Year 10', title: 'Global Organic Exports', desc: 'Establish shipping nodes to distribute wild wildflower honey and wood-pressed oils to Middle East and EU markets.' }
            ].map((m, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                <div className="absolute left-[-110px] top-1 text-right w-20 hidden md:block">
                  <span className="text-lg font-league font-black text-accent tracking-wide">{m.year}</span>
                </div>
                <div className="absolute left-[-6px] top-2.5 w-3 h-3 rounded-full bg-spruce border border-accent group-hover:bg-primary transition-colors"></div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-accent md:hidden">{m.year} — </span>
                  <h3 className="text-lg font-league font-bold text-white group-hover:text-accent transition-colors">{m.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 13: SUSTAINABILITY */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Purity</h2>
            <h3 className="text-3xl sm:text-5xl font-league font-black text-white">Sustainability &amp; Carbon Offsets</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-inter">
              We design our collection infrastructure around local ecosystems, utilizing clean solar energy to chill milk and organic composting to preserve topsoils.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-accent" />
                <span>Solar Chilling Plants</span>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-accent" />
                <span>Water Conservation advice</span>
              </div>
              <div className="flex items-center gap-3">
                <Sprout className="w-5 h-5 text-accent" />
                <span>Bio-composting support</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span>Farmer Welfare payouts</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5">
            <img src="/juices.png" alt="Sustainability measures" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 14: TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 py-24 bg-spruce px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Testimonials</h2>
            <p className="text-3xl sm:text-4xl font-league font-black">Trusted by our Stakeholders</p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 relative">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-md">
                {testimonials[testimonialIndex].type}
              </span>
              <p className="text-sm italic text-gray-200 leading-relaxed">
                &quot;{testimonials[testimonialIndex].quote}&quot;
              </p>
              <div>
                <h4 className="font-league font-bold text-white text-base">{testimonials[testimonialIndex].name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{testimonials[testimonialIndex].location}</p>
              </div>
            </div>

            {/* Triggers */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <button onClick={handlePrevTestimonial} className="p-1.5 rounded-full hover:bg-white/5 text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-gray-400 font-bold">{testimonialIndex + 1} / 4</span>
              <button onClick={handleNextTestimonial} className="p-1.5 rounded-full hover:bg-white/5 text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 15: CONTACT & LEAD CAPTURE SYSTEM */}
      {/* ------------------------------------------------------------- */}
      <section id="apply-tabs" className="relative z-10 py-24 bg-glass-dark px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto bg-white text-spruce rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce leading-none">Agri-Inquiry Hub</h2>
            <p className="text-xs text-gray-400">Select your tab to register interest or apply to join our networks.</p>
          </div>

          {/* Form tab selectors */}
          <div className="flex flex-wrap justify-center gap-1.5 bg-offwhite p-1 rounded-xl">
            {[
              { key: 'contact', label: 'General' },
              { key: 'investor', label: 'Investors' },
              { key: 'partner', label: 'Partners' },
              { key: 'farmer', label: 'Farmers' },
              { key: 'career', label: 'Careers' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setLeadTab(tab.key);
                  setSuccessMsg('');
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  leadTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-spruce hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Unified Form */}
          {successMsg ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 text-primary mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-league font-bold text-lg text-spruce">{successMsg}</h4>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99999 99999"
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Conditional Fields */}
                {leadTab === 'contact' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Topic Subject</label>
                    <select
                      value={formState.topic}
                      onChange={(e) => setFormState({...formState, topic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>General Inquiry</option>
                      <option>Product Wholesale</option>
                      <option>Corporate Advisory</option>
                    </select>
                  </div>
                )}

                {leadTab === 'investor' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Investment Capital Intended</label>
                    <select
                      value={formState.capital}
                      onChange={(e) => setFormState({...formState, capital: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>$50,000 - $250,000</option>
                      <option>$250,000 - $1,000,000</option>
                      <option>$1,000,000+</option>
                    </select>
                  </div>
                )}

                {leadTab === 'partner' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Franchise Experience</label>
                    <select
                      value={formState.experience}
                      onChange={(e) => setFormState({...formState, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>0-2 Years</option>
                      <option>3-5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
                )}

                {leadTab === 'farmer' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Primary Harvest Crop</label>
                    <select
                      value={formState.crops}
                      onChange={(e) => setFormState({...formState, crops: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>A2 Milk</option>
                      <option>Wild Honey</option>
                      <option>Mustard Seeds</option>
                      <option>Green Vegetables</option>
                    </select>
                  </div>
                )}

                {leadTab === 'career' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Target Role Position</label>
                    <select
                      value={formState.topic}
                      onChange={(e) => setFormState({...formState, topic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>Agronomy Specialist</option>
                      <option>Supply Chain operations</option>
                      <option>Lead Web Engineer</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Company field for Investor/Partner */}
              {(leadTab === 'investor' || leadTab === 'partner') && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Firm or Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Malhotra Capital"
                    value={formState.firm}
                    onChange={(e) => setFormState({...formState, firm: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Message &amp; Scope Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your request or operating background here..."
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2"
              >
                Submit Secure Request
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

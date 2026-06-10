'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EarthFarmlandCanvas from '@/components/3d/EarthFarmlandCanvas';
import { ArrowRight, Sprout, ShieldCheck, DollarSign, Award, Users, MapPin } from 'lucide-react';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  const stats = [
    { value: '15,000+', label: 'Farmers Empowered', icon: Users },
    { value: '25,000+', label: 'Acres of Farmland', icon: Sprout },
    { value: '120+', label: 'Collection Centers', icon: MapPin },
    { value: '100%', label: 'Organic Assured', icon: ShieldCheck },
  ];

  const valuePillars = [
    {
      title: 'Our Vision',
      desc: 'To establish India’s most trusted sustainable agricultural value chain, where farmers achieve maximum yield value, and urban homes receive pure nutrition.',
      icon: Award
    },
    {
      title: 'Direct Procurement',
      desc: 'By eliminating middle-agents, we deliver direct payouts to rural farmers within 24 hours, enhancing livelihoods and securing agricultural futures.',
      icon: DollarSign
    },
    {
      title: 'Cold-Chain Delivery',
      desc: 'State-of-the-art cold supply logistics ensure raw milk, organic juices, and fresh produce reach your doorstep in peak nutritional condition.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-spruce overflow-hidden">
      
      {/* 3D Canvas Scene */}
      <EarthFarmlandCanvas />

      {/* Cinematic Hero Content */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.p 
              variants={itemVariants}
              className="text-xs sm:text-sm font-bold text-accent tracking-[0.25em] uppercase"
            >
              The Essence of Earth
            </motion.p>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-7xl md:text-8xl font-league font-black text-white tracking-wider leading-none"
            >
              PRITHVORA
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-2xl font-light text-secondary-light max-w-3xl mx-auto italic font-inter"
            >
              &quot;From Farmers&apos; Dreams to Every Family&apos;s Table&quot;
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 pt-6"
            >
              <Link
                href="/partner"
                className="px-6 py-3 bg-primary text-white font-league font-bold text-sm tracking-widest uppercase rounded-lg shadow-lg hover:bg-primary-light transition-all duration-300 border border-primary-light/25"
              >
                Become a Partner
              </Link>
              
              <Link
                href="/farmer"
                className="px-6 py-3 bg-white/5 backdrop-blur-md text-white border border-white/10 font-league font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Join as Farmer
              </Link>

              <Link
                href="/investor"
                className="px-6 py-3 bg-accent text-spruce font-league font-bold text-sm tracking-widest uppercase rounded-lg shadow-lg hover:bg-accent-light transition-all duration-300"
              >
                Invest in PRITHVORA
              </Link>

              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 text-white text-sm font-bold hover:text-accent transition-all duration-300 group"
              >
                Explore Store
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-white/40 hover:text-white transition-colors"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[10px] tracking-widest uppercase font-bold">Scroll to Explore</span>
            <div className="w-1.5 h-10 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-accent rounded-full animate-bounce"></div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Counter Section (Glassmorphic) */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-glass-dark">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase">Growing Strong</h2>
            <p className="text-3xl sm:text-4xl font-league font-black text-white">Our Agriverse in Numbers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-4 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500 group"
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex justify-center items-center text-primary-light group-hover:bg-primary/20 group-hover:text-accent transition-all">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-league font-black text-white">{stat.value}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Strategic Pillars Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-spruce">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Lead text block */}
            <div className="space-y-6 lg:col-span-1">
              <p className="text-xs font-bold text-accent tracking-widest uppercase">Direct-to-Home Model</p>
              <h2 className="text-4xl sm:text-5xl font-league font-black text-white leading-tight">
                Empowering Rural Farms, Nourishing Urban Families.
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                PRITHVORA stands at the intersection of traditional wisdom and digital agritech. We procure pure, high-grade dairy, raw wildflower honey, cold-pressed oils, and pickles directly from farming groups under strict quality tests.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all"
                >
                  Our Corporate Mission
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pillar grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {valuePillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/25 transition-all duration-300 space-y-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-league font-bold text-white tracking-wide">{p.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

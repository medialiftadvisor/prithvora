'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Heart, Leaf, Shield, User, Users } from 'lucide-react';

export default function AboutPage() {
  const coreValues = [
    {
      title: 'Farmer Registration & Ratings',
      desc: 'We register local growers, record their product batches, and maintain verified ratings directly in our registry.',
      icon: Users,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Scientific Lab Testing',
      desc: 'Every batch of ghee, honey, and oil undergoes rigorous chemical and purity lab tests before being premium branded.',
      icon: Leaf,
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Transparent Processing Unit',
      desc: 'We process all harvests directly at our Behror facility under strict quality control and full chain traceability.',
      icon: Shield,
      color: 'bg-accent/10 text-accent'
    },
    {
      title: 'Direct Supply & Sell',
      desc: 'We act as a direct service provider between farmers and consumers, eliminating middlemen to ensure direct supply.',
      icon: Compass,
      color: 'bg-blue-100 text-blue-700'
    }
  ];

  const milestones = [
    { year: '2022', title: 'The Co-Operative Seed', desc: 'Started with a localized group of 150 dairy farmers in Behror, Rajasthan, setting up our first smart chilling center.' },
    { year: '2023', title: 'Organic Diversification', desc: 'Introduced natural wild forest honey and wood-pressed oils. Secured organic farming certifications.' },
    { year: '2024', title: 'Cold-Chain Technology', desc: 'Deployed real-time GPS tracking and chilling monitors across our transport fleets to guarantee freshness.' },
    { year: '2025', title: 'Primary Processing Facility', desc: 'Opened our flagship processing hub in Behror, Rajasthan, scaling our supply chain to serve over 50,000 households.' },
    { year: '2026', title: 'Agriverse Integration', desc: 'Launched the integrated Agriverse portal, establishing collection hubs and targeting Pan-India delivery.' },
  ];

  return (
    <div className="bg-offwhite min-h-screen py-12">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold text-accent tracking-widest uppercase"
        >
          Rooted in Sustainable Growth
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight"
        >
          Company Story &amp; Vision
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base text-gray-500 max-w-2xl mx-auto font-inter leading-relaxed"
        >
          PRITHVORA AGRIVERSE is an investor-grade agritech ecosystem dedicated to bridging the divide between rural harvests and urban nourishment.
        </motion.p>
      </section>

      {/* Story & Infographic Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-league font-bold text-spruce">
              Nurturing the Soil that Feeds Us
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              PRITHVORA is a dedicated service provider connecting registered farmers directly with consumers for transparent direct supply. We record each product detail along with grower ratings to build absolute consumer trust.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              All harvested organic products are processed transparently at our own central unit. Before shipping, each batch undergoes strict laboratory testing to ensure zero chemical adulteration. Under the PRITHVORA brand, we sell directly to households, ensuring premium quality, fair farm compensation, and absolute consumer health.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <h4 className="text-2xl font-league font-black text-primary">100%</h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Traceability</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-league font-black text-accent">Zero</h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Adulteration</p>
              </div>
            </div>
          </div>

          {/* Interactive Infographic */}
          <div className="p-8 bg-glass border border-gray-100 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-league font-bold text-spruce">
              The Traceability Pipeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-spruce text-sm">Farmer Registration &amp; Ratings</h4>
                  <p className="text-xs text-gray-500 mt-0.5">We register local growers, record their product details, and log verified grower ratings in our database.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-spruce text-sm">Transparent Processing Unit</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Harvests are brought directly to our Behror processing facility where we process them with complete transparency.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-spruce text-sm">Scientific Lab Testing &amp; Branding</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Every batch undergoes rigorous quality and adulterant lab tests before being packaged under our premium PRITHVORA brand.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-spruce text-sm">Direct Supply &amp; Sell</h4>
                  <p className="text-xs text-gray-500 mt-0.5">We sell directly to consumers, managing our cold chain delivery system to transport items straight to your doorstep.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CEO Message Section */}
      <section className="bg-spruce text-white py-20 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* CEO Photo */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative w-72 h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="/mahesh.png"
                  alt="Mahesh Rao, Founder &amp; CEO"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spruce/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 space-y-1">
                  <h4 className="font-league font-black text-lg text-white">Mahesh Rao</h4>
                  <p className="text-xs text-accent font-bold uppercase tracking-wider">Founder &amp; CEO</p>
                </div>
              </div>
            </div>

            {/* CEO Quote */}
            <div className="lg:col-span-2 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-league font-black text-white leading-tight">
                &quot;True agriculture honors the soil, compensates the grower, and feeds the family with organic purity.&quot;
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                &quot;When we founded Prithvora Agriverse, our mission was clear: to build an ecosystem where agricultural success doesn&apos;t come at the cost of the farmer&apos;s dignity or the consumer&apos;s health. Our agritech model replaces opaque middle-channels with direct payouts, enabling farmers to invest in high-grade crop methods while ensuring our products are processed without standard preservation chemicals. We welcome you to join our network—whether as an investor, a partner, or a conscious household.&quot;
              </p>
              <div className="space-y-0.5 border-t border-white/10 pt-4 max-w-xs">
                <h4 className="font-league font-bold text-white tracking-wide">MAHESH RAO</h4>
                <p className="text-xs text-accent font-bold uppercase tracking-wider">CEO, Prithvora Agriverse</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Our Pillars</h2>
          <p className="text-3xl sm:text-4xl font-league font-black text-spruce">Corporate Core Values</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary/20 shadow-xs hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${val.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-league font-bold text-spruce tracking-wide">{val.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Milestones Vertical Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-accent tracking-widest uppercase">Our Journey</h2>
          <p className="text-3xl sm:text-4xl font-league font-black text-spruce">Company Timeline</p>
        </div>

        <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 group">
              
              {/* Year label left side (Desktop) */}
              <div className="absolute left-[-110px] top-1 text-right w-20 hidden md:block">
                <span className="text-lg font-league font-black text-primary tracking-wide">
                  {m.year}
                </span>
              </div>

              {/* Point on timeline */}
              <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-white border border-primary group-hover:bg-accent group-hover:border-accent transition-colors"></div>
              
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary md:hidden">{m.year} — </span>
                <h3 className="text-lg font-league font-bold text-spruce group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

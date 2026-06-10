'use client';

import React, { useState } from 'react';
import { Award, Briefcase, Check, ShieldCheck, ArrowRight, UserPlus, Star } from 'lucide-react';

export default function CareersPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Agronomy Specialist',
    resume: '',
    coverLetter: ''
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setForm({ name: '', email: '', phone: '', position: 'Agronomy Specialist', resume: '', coverLetter: '' });
    }, 5000);
  };

  const benefits = [
    { title: 'Premium Healthcare', desc: 'Comprehensive medical insurance covering employee and dependents.' },
    { title: 'Equity Options', desc: 'Participate in our agritech growth with early-employee stock options (ESOPs).' },
    { title: 'Hybrid Work flexibility', desc: 'Flexible operating structures between Gurugram HQs and field clusters.' },
    { title: 'Annual Growth Budget', desc: 'Dedicated professional allowance for books, certifications, and conferences.' }
  ];

  const jobs = [
    {
      title: 'Agronomy Cluster Specialist',
      department: 'Farm Operations',
      location: 'Karnal, Haryana (On-field)',
      type: 'Full-Time',
      desc: 'Work directly with farming groups, managing soil testing diagnostics, organic certification audits, and bio-fertilizer pooling.'
    },
    {
      title: 'Supply Chain Operations Manager',
      department: 'Logistics',
      location: 'Gurugram HQs (Hybrid)',
      type: 'Full-Time',
      desc: 'Optimize cold-chain logistics, routing insulated truck fleets from rural collection plants to urban micro-hubs.'
    },
    {
      title: 'Lead E-Commerce Developer',
      department: 'Engineering',
      location: 'Gurugram HQs (Hybrid)',
      type: 'Full-Time',
      desc: 'Maintain and scale our Next.js web application, cart caching, user dashboards, and order tracking integrations.'
    }
  ];

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Careers at Prithvora</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            Cultivate Your Career Future
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Build sustainable supply chains and empower farming communities. Explore our open roles and become part of the organic revolution.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-bold text-spruce">Employee Benefits</h2>
            <p className="text-xs text-gray-400">Our culture values personal growth, financial health, and work-life balance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-primary/20 transition-all duration-300 space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Star className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-spruce text-sm tracking-wide">{b.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-bold text-spruce">Open Opportunities</h2>
            <p className="text-xs text-gray-400">Join our team of agritech professionals, engineers, and supply-chain logistics masters.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {jobs.map((job, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-md">
                    {job.department}
                  </span>
                  <h3 className="font-league font-bold text-lg text-spruce mt-2">{job.title}</h3>
                  <div className="flex justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pt-2">{job.desc}</p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setForm({...form, position: job.title});
                      document.getElementById('apply-job-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Careers Form */}
        <section id="apply-job-section" className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-league font-black text-spruce">Submit Job Application</h2>
            <p className="text-xs text-gray-400">Submit your details and CV. Our hiring managers will review and respond within 5 working days.</p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-league font-bold text-lg text-spruce">Application Submitted Successfully</h4>
              <p className="text-xs text-gray-500">Your candidate reference code is PRV-HR-{Math.floor(1000 + Math.random() * 9000)}. We look forward to speaking soon.</p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Your Full Name</label>
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
                    placeholder="name@email.com"
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
                    placeholder="+91 99999 99999"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Target Role Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({...form, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option>Agronomy Cluster Specialist</option>
                    <option>Supply Chain Operations Manager</option>
                    <option>Lead E-Commerce Developer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Resume URL or LinkedIn Profile</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://linkedin.com/in/username or link to resume PDF"
                  value={form.resume}
                  onChange={(e) => setForm({...form, resume: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Cover Letter / Pitch (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Tell us why you are a great fit for the sustainable agritech revolution..."
                  value={form.coverLetter}
                  onChange={(e) => setForm({...form, coverLetter: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2"
              >
                Submit Career Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Award, Briefcase, Check, ShieldCheck, ArrowRight, UserPlus, Star } from 'lucide-react';
import { submitCareersApplication } from '@/app/actions';

export default function CareersPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [candidateCode, setCandidateCode] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Agronomy & Soil Health Advisor',
    resume: '',
    coverLetter: ''
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await submitCareersApplication({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      position: form.position,
      resumeUrl: form.resume,
      coverLetter: form.coverLetter
    });

    setIsSubmitting(false);
    if (res.success) {
      setCandidateCode(res.applicationId || '');
      setFormSubmitted(true);
      setForm({ name: '', email: '', phone: '', position: 'Agronomy & Soil Health Advisor', resume: '', coverLetter: '' });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 10000);
    } else {
      setErrorMsg(res.error || 'Failed to submit careers application.');
    }
  };

  const benefits = [
    { title: 'Premium Healthcare', desc: 'Comprehensive medical insurance covering employee and dependents.' },
    { title: 'Equity Options', desc: 'Participate in our agritech growth with early-employee stock options (ESOPs).' },
    { title: 'Hybrid Work flexibility', desc: 'Flexible operating structures between Gurugram HQs and field clusters.' },
    { title: 'Annual Growth Budget', desc: 'Dedicated professional allowance for books, certifications, and conferences.' }
  ];

  const jobs = [
    {
      title: 'Agronomy & Soil Health Advisor',
      department: 'Farm Operations',
      location: 'Behror Hub, Rajasthan (On-field)',
      type: 'Full-Time',
      desc: 'Design organic farming protocols, execute soil chemistry diagnostics, and train regional Rajasthan farmer clusters on bio-composting and water conservation. Perform regular audits for organic compliance.',
      experience: '3+ Years in Organic Farming Support or Agronomy Research',
      qualifications: 'B.Sc. or M.Sc. in Agriculture, Agronomy, or Soil Science'
    },
    {
      title: 'Cold Chain Supply Logistics Manager',
      department: 'Logistics',
      location: 'Behror Hub, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Optimize insulated fleet routing, manage cold-chain temperature-controlled transport of dairy, honey, and juices from Behror facilities to Pan-India micro-distribution hubs. Monitor real-time GPS sensors.',
      experience: '4+ Years in Cold Chain Management or FMCG/Dairy Logistics',
      qualifications: 'MBA or Bachelor\'s Degree in Supply Chain Management or Operations'
    },
    {
      title: 'Food Processing Plant Supervisor',
      department: 'Manufacturing & Quality',
      location: 'Behror Facility, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Supervise daily operations of wood-pressing oil mills, A2 pasteurizers, and raw honey filtration systems. Enforce strict HACCP food safety standards and laboratory purity checklists.',
      experience: '2+ Years in Food Processing or Beverage Manufacturing',
      qualifications: 'B.Tech or Diploma in Food Technology, Dairy Engineering, or Biotechnology'
    },
    {
      title: 'Lead Full-Stack Web Engineer',
      department: 'Engineering',
      location: 'Remote / Jaipur / NCR (Hybrid)',
      type: 'Full-Time',
      desc: 'Maintain and scale our Next.js web platform, database integrations, farmer SMS notifications, and e-commerce checkout. Collaborate with product design to build luxury web UI/UX solutions.',
      experience: '5+ Years in React, Next.js, TypeScript, PostgreSQL, and Node.js',
      qualifications: 'B.Tech / B.E. / MCA in Computer Science or related engineering field'
    },
    {
      title: 'Accredited Investor Relations Director',
      department: 'Finance & Strategy',
      location: 'Jaipur / Gurugram (Hybrid)',
      type: 'Full-Time',
      desc: 'Act as the primary point of contact for accredited venture funds, corporate backers, and seed angels. Manage capital allocation modeling, financial reporting, and series-A preparation.',
      experience: '6+ Years in Venture Capital Relations, Investment Banking, or Finance Strategy',
      qualifications: 'MBA in Finance, CFA Charterholder, or equivalent professional degree'
    },
    {
      title: 'Organic Compliance & Audit Specialist',
      department: 'Farm Operations',
      location: 'Udaipur Cluster, Rajasthan (On-field)',
      type: 'Full-Time',
      desc: 'Perform on-farm audits for pesticide residues, chemical fertilizer exclusions, and natural soil condition adherence. Review certification logs and maintain farm compliance profiles.',
      experience: '2+ Years in Agriculture Auditing or Organic Compliance Testing',
      qualifications: 'B.Sc. in Agriculture or Environmental Science'
    },
    {
      title: 'B2B Institutional Sales Manager',
      department: 'Sales & Marketing',
      location: 'Gurugram HQs (Hybrid)',
      type: 'Full-Time',
      desc: 'Establish bulk supply contracts with luxury hotels, organic restaurants, and premium supermarket chains for raw honey, Vedic ghee, and wood-pressed oils. Exceed volume targets.',
      experience: '4+ Years in FMCG B2B Sales, Corporate Gifting or Institutional Accounts',
      qualifications: 'MBA or Bachelor\'s Degree in Business Administration, Marketing or related field'
    },
    {
      title: 'IoT Sensor & Telemetry Engineer',
      department: 'Engineering',
      location: 'Jaipur Hub / Behror (Hybrid)',
      type: 'Full-Time',
      desc: 'Design and deploy temperature-monitoring IoT arrays across our fleet of cold-vans and collection centers. Integrate GPS and thermal data feeds directly into our logistics database.',
      experience: '3+ Years in Embedded Systems, IoT Telemetry, or Sensors Engineering',
      qualifications: 'B.Tech / B.E. in Electronics, Electrical or Instrumentational Engineering'
    },
    {
      title: 'QA/QC Lab Analyst',
      department: 'Manufacturing & Quality',
      location: 'Behror Facility, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Perform daily biochemical testing on incoming raw A2 milk (casein assays), wildflower honey (enzymes, moisture), and yellow mustard oils. Manage laboratory safety documentation.',
      experience: '2+ Years in Food Labs, Dairy Chemistry or Agri-produce Testing',
      qualifications: 'M.Sc. or B.Tech in Biotechnology, Food Science, Chemistry or Microbiology'
    },
    {
      title: 'Franchise Store Operations Director',
      department: 'Retail & Operations',
      location: 'Jaipur / Gurugram (Travel required)',
      type: 'Full-Time',
      desc: 'Manage operational audits, inventory pipelines, franchise owner relations, and store compliance standards for Prithvora physical retail outlets. Train store staff on branding.',
      experience: '6+ Years in Retail Franchise Management, FMCG Store Operations',
      qualifications: 'MBA or Postgraduate in Retail Management or Operations'
    },
    {
      title: 'Creative Brand Storyteller & Designer',
      department: 'Sales & Marketing',
      location: 'Gurugram HQs (Hybrid)',
      type: 'Full-Time',
      desc: 'Document the journey of our Rajasthan farmers, capture rich visual assets, write premium package copies, and design aesthetic campaign creatives for digital channels.',
      experience: '3+ Years in Brand Marketing, Advertising copywriting, or Graphic Design',
      qualifications: 'Bachelor\'s Degree in Fine Arts, Communications, Design or Journalism'
    },
    {
      title: 'Behror Milk Collection Coordinator',
      department: 'Farm Operations',
      location: 'Behror Chilling Point (On-site)',
      type: 'Full-Time',
      desc: 'Supervise daily milk collection logs, perform lactometer density audits at procurement gates, and ensure prompt payments logging for dairy farmer partners.',
      experience: '1+ Years in Dairy Collection Centers or Rural Procurement Operations',
      qualifications: 'Diploma in Agriculture, Dairy Tech, or high school with relevant experience'
    },
    {
      title: 'Warehouse & Inventory Manager',
      department: 'Logistics',
      location: 'Behror Facility, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Manage storage layouts, dispatch schedules, and shelf-life tracking for packaged oils, spices, and honey. Implement strict FIFO rotation and logistics security checks.',
      experience: '3+ Years in FMCG Warehousing, Inventory Control, or Depot Management',
      qualifications: 'Degree in Logistics, Business Operations, or Material Management'
    },
    {
      title: 'Corporate HR & Culture Lead',
      department: 'Human Resources',
      location: 'Gurugram HQs (Hybrid)',
      type: 'Full-Time',
      desc: 'Manage end-to-end recruitment for corporate, technical, and field-level roles. Build training modules for field assistants, and spearhead workplace diversity initiatives.',
      experience: '5+ Years in Talent Acquisition, HR Generalist Operations in FMCG/Agritech',
      qualifications: 'MBA or Master\'s in Human Resource Management or Psychology'
    },
    {
      title: 'Solar Chilling Plant Engineer',
      department: 'Engineering',
      location: 'Alwar Hub, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Maintain off-grid solar panels and solar thermal chilling setups at regional procurement nodes. Troubleshoot grid failures and optimize power storage systems.',
      experience: '3+ Years in Solar Energy Systems, Industrial Plant Maintenance',
      qualifications: 'B.Tech / Diploma in Mechanical, Electrical or Renewable Energy Engineering'
    },
    {
      title: 'Organic Fertilizers & Inputs Advisor',
      department: 'Farm Operations',
      location: 'Jodhpur Hub, Rajasthan (On-field)',
      type: 'Full-Time',
      desc: 'Conduct training workshops on bio-composting, vermiculture, liquid bio-fertilizers (Jeevamrut), and natural pesticide prep. Support farmers in organic transition.',
      experience: '2+ Years in Organic inputs formulation or Sustainable Farming Consultancy',
      qualifications: 'B.Sc. in Agriculture, Soil Chemistry, or organic farming certifications'
    },
    {
      title: 'E-commerce Operations Specialist',
      department: 'Retail & Operations',
      location: 'Jaipur Hub (Hybrid)',
      type: 'Full-Time',
      desc: 'Manage online sales channels, customer order flows, coordinates with cold-chain dispatcher for timely last-mile delivery. Resolve e-commerce shipping complaints.',
      experience: '2+ Years in E-commerce Store Management, Shopify or custom web portals',
      qualifications: 'Bachelor\'s Degree in Business, Marketing or IT'
    },
    {
      title: 'Procurement Executive (Dry Seeds)',
      department: 'Finance & Operations',
      location: 'Bikaner Hub, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Negotiate buyback rates for raw yellow mustard seeds, black sesame seeds, cumin, and pulses from farmer cooperatives. Maintain quality logs and contract terms.',
      experience: '2+ Years in Agricultural commodity buying, Grain trade or FMCG purchasing',
      qualifications: 'Bachelor\'s in Commerce, Agri-business Management or Economics'
    },
    {
      title: 'Packaging Operations Lead',
      department: 'Manufacturing & Quality',
      location: 'Behror Facility, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Manage automated glass packaging and biodegradable pouch-sealing assembly lines. Minimize packaging materials waste and ensure airtight sealing protocols.',
      experience: '3+ Years in FMCG Packing Line Management or Food Packaging Systems',
      qualifications: 'B.Tech or Diploma in Packaging Technology or Mechanical Engineering'
    },
    {
      title: 'Area Marketing Executive',
      department: 'Sales & Marketing',
      location: 'Jaipur / NCR (On-field)',
      type: 'Full-Time',
      desc: 'Execute society tasting booths, organic food awareness seminars, and local store launching campaigns. Coordinate micro-influencer outreach.',
      experience: '2+ Years in Direct Marketing, Event Management or B2C Sales promotion',
      qualifications: 'Bachelor\'s Degree in Marketing, Public Relations, or Business'
    },
    {
      title: 'Franchise Partner Support Executive',
      department: 'Retail & Operations',
      location: 'Jaipur Hub (Hybrid)',
      type: 'Full-Time',
      desc: 'Act as the single window of contact for franchise store owners. Resolve daily stock orders, return logs, promotional material dispatches, and POS software issues.',
      experience: '2+ Years in Client Relations, Franchise support, or Retail operations coordination',
      qualifications: 'Bachelor\'s Degree in Commerce, Communications, or Management'
    },
    {
      title: 'Logistics Fleet Dispatcher',
      department: 'Logistics',
      location: 'Behror Hub, Rajasthan (On-site)',
      type: 'Full-Time',
      desc: 'Coordinate morning route scheduling for insulated cold-chain vans, track real-time transit logs, manage driver shifts, and verify delivery signatures.',
      experience: '2+ Years in Fleet Dispatching, Truck Logistics or Transport routing',
      qualifications: 'Diploma or Degree in Supply Chain, Logistics, or Business Admin'
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
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-league font-bold text-lg text-spruce leading-tight">{job.title}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{job.location}</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 leading-relaxed">{job.desc}</p>
                  
                  <div className="border-t border-gray-100 pt-3 space-y-2 text-[11px] text-gray-600">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Required Experience</span>
                      <p className="font-semibold text-spruce">{job.experience}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Qualifications</span>
                      <p className="font-semibold text-spruce">{job.qualifications}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setForm({...form, position: job.title});
                      document.getElementById('apply-job-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all"
                  >
                    Apply for Role
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
              <h4 className="font-league font-bold text-lg text-spruce">Application Submitted Successfully</h4>
              <p className="text-xs text-gray-500">Your candidate reference code is <strong className="text-primary">{candidateCode}</strong>. We look forward to speaking soon.</p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="text-xs text-primary underline font-bold mt-2"
              >
                Submit another application
              </button>
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
                    placeholder="+91 96606 86394"
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
                    <option>Agronomy &amp; Soil Health Advisor</option>
                    <option>Cold Chain Supply Logistics Manager</option>
                    <option>Food Processing Plant Supervisor</option>
                    <option>Lead Full-Stack Web Engineer</option>
                    <option>Accredited Investor Relations Director</option>
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
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Career Application'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}

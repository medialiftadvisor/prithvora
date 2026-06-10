'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { submitContactMessage } from '@/app/actions';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [messageCode, setMessageCode] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await submitContactMessage({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message
    });

    setIsSubmitting(false);
    if (res.success) {
      setMessageCode(res.messageId || '');
      setFormSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 10000);
    } else {
      setErrorMsg(res.error || 'Failed to send message.');
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919660686394';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Prithvora%20Agriverse!%20I%20am%20interested%20in%20your%20organic%20offerings.`;

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Contact Us</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            Get in Touch
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Have questions about our procurement models, investor dashboards, or organic products? Reach out via our secure form or chat with us on WhatsApp.
          </p>
        </section>

        {/* Contact Info and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Columns */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Info */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <h3 className="text-xl font-league font-bold text-spruce">Corporate Contact Hub</h3>
              
              <ul className="space-y-5 text-sm text-gray-600">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Primary Hub &amp; Processing Facility</span>
                    <span className="font-semibold text-spruce block mt-1">
                      Prithvora Agriverse Hub, Behror, Rajasthan - 301701
                    </span>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Direct Phone Lines</span>
                    <span className="font-semibold text-spruce block mt-1">+91 96606 86394</span>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Channels</span>
                    <span className="font-semibold text-spruce block mt-1">info@prithvora.com</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-50 border border-green-100 p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <MessageCircle className="w-6 h-6 fill-green-700" />
                <h3 className="font-league font-bold text-lg">Instant WhatsApp Chat</h3>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                Connect directly with our corporate support managers to resolve product shipping requests, investor decks, or wholesale vendor agreements in real-time.
              </p>
              <div>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-green-700 transition-all shadow-md"
                >
                  Start WhatsApp Chat
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-xs space-y-6">
            <h3 className="text-xl font-league font-bold text-spruce">Send a Secure Message</h3>
            
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
                <h4 className="font-league font-bold text-lg text-spruce">Message Sent Successfully</h4>
                <p className="text-xs text-gray-500">We have received your request (ID: <strong className="text-primary">{messageCode}</strong>) and will follow up at the registered email address.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs text-primary underline font-bold mt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Mahesh Rao"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
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
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 96606 86394"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subject Topic</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary bg-white"
                    >
                      <option>General Inquiry</option>
                      <option>Product Shipment Issue</option>
                      <option>Investor Relations Request</option>
                      <option>Farmer Procurement clusters</option>
                      <option>Vendor Partnerships</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Message Details</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Enter your message details here..."
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Inquiry Message'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Embedded Map Section */}
        <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14197.801662908272!2d76.28014524458008!3d27.887373500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972c219660c0429%3A0xc3fcd7645167b5b5!2sBehror%2C%20Rajasthan%20301701!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

      </div>
    </div>
  );
}

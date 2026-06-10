'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-spruce text-white border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Col 1: Brand Pitch & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center border border-white/10">
                <img src="/logo.png" alt="PRITHVORA Logo" className="object-contain w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-league font-bold text-xl tracking-wider text-white">
                  PRITHVORA
                </span>
                <span className="text-[9px] font-bold text-accent tracking-widest uppercase mt-0.5">
                  AGRIVERSE
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              &quot;From Farmers&apos; Dreams to Every Family&apos;s Table&quot;
              <br />
              We are revolutionizing the agritech value chain by empowering farmers, supporting partners, and delivering organic farm-fresh goods directly to conscious consumers.
            </p>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md">
              <h4 className="text-sm font-league font-bold tracking-wider text-accent uppercase">
                Subscribe to Agriverse Updates
              </h4>
              <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-primary transition-all">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-primary text-white hover:bg-primary-light transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-primary-light font-bold animate-pulse">
                  ✓ Successfully subscribed to our network newsletter!
                </p>
              )}
            </form>
          </div>

          {/* Col 2: Consumer Hub */}
          <div>
            <h3 className="text-base font-league font-bold tracking-wider text-accent uppercase mb-4">
              Consumer Hub
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Organic Store
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dairy" className="hover:text-primary transition-colors">
                  A2 Dairy Range
                </Link>
              </li>
              <li>
                <Link href="/products?category=Honey" className="hover:text-primary transition-colors">
                  Wild Flower Honey
                </Link>
              </li>
              <li>
                <Link href="/products?category=Juices" className="hover:text-primary transition-colors">
                  Cold Pressed Juices
                </Link>
              </li>
              <li>
                <Link href="/products?category=Oils" className="hover:text-primary transition-colors">
                  Wood Pressed Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Stakeholders */}
          <div>
            <h3 className="text-base font-league font-bold tracking-wider text-accent uppercase mb-4">
              Agriverse Network
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/farmer" className="hover:text-primary transition-colors">
                  Farmers Program
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-primary transition-colors">
                  Partnership Tiers
                </Link>
              </li>
              <li>
                <Link href="/investor" className="hover:text-primary transition-colors">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Career Openings
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Agriverse Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Office */}
          <div>
            <h3 className="text-base font-league font-bold tracking-wider text-accent uppercase mb-4">
              Corporate Office
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-primary-light flex-shrink-0 mt-0.5" />
                <span>
                  Prithvora Agriverse HQs,
                  <br />
                  Farm-Tech Park, Sector 62,
                  <br />
                  Gurugram, HR, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-primary-light flex-shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-primary-light flex-shrink-0" />
                <span>info@prithvora.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Socials and Copy */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <span>&copy; {currentYear} PRITHVORA AGRIVERSE. All rights reserved.</span>
            <span className="mx-2">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
          
          {/* Socials */}
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-all" title="LinkedIn">
              <Linkedin className="w-4 h-4 text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-all" title="Twitter">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-all" title="Facebook">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-all" title="Instagram">
              <Instagram className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

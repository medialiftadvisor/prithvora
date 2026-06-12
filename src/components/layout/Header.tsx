'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useSession, signOut, signIn } from 'next-auth/react';
import { ShoppingBag, Heart, Menu, X, ChevronRight, User, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, wishlist, setCartOpen } = useCartStore();
  const { data: session } = useSession();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { name: 'About Story', href: '/about' },
    { name: 'Organic Shop', href: '/products' },
    { name: 'Investor Hub', href: '/investor' },
    { name: 'Partners', href: '/partner' },
    { name: 'Farmers', href: '/farmer' },
    { name: 'Careers', href: '/careers' },
    { name: 'Insights Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 w-full bg-glass transition-all duration-300 border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-primary flex items-center justify-center border border-primary/20">
            <img src="/logo.png" alt="PRITHVORA Logo" className="object-contain w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-league font-bold text-lg sm:text-xl text-spruce leading-none tracking-wider group-hover:text-primary transition-colors">
              PRITHVORA
            </span>
            <span className="text-[9px] font-bold text-accent tracking-widest uppercase mt-0.5 leading-none">
              AGRIVERSE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive(link.href)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-spruce/80 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Wishlist Icon */}
          <Link
            href="/products?wishlist=true"
            className="relative p-2 text-spruce/80 hover:text-red-500 rounded-lg hover:bg-gray-100/50 transition-all"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-spruce/80 hover:text-primary rounded-lg hover:bg-gray-100/50 transition-all"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Auth Button */}
          <div className="hidden sm:flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="p-2 text-accent hover:text-accent-dark rounded-lg hover:bg-accent/5 transition-all"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                {/* Account Dashboard Link */}
                <Link
                  href="/account"
                  className="p-2 text-spruce hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
                  title="My Account"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Link href="/account" className="flex flex-col text-right hidden md:block hover:text-primary transition-colors text-left">
                  <span className="text-xs font-bold text-spruce/90 block leading-tight">
                    {session.user?.name || 'User'}
                  </span>
                  <span className="text-[9px] font-semibold text-gray-400 capitalize block mt-0.5 leading-none">
                    {session.user?.role?.toLowerCase() || 'Consumer'}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/account' })}
                className="px-4 py-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-spruce hover:text-primary rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-lg z-30 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex justify-between items-center px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'bg-primary text-white'
                    : 'text-spruce hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}

            {/* Mobile Auth Options */}
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3 px-4">
              {session ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-spruce">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 border border-primary/20 text-primary font-bold rounded-xl text-sm hover:bg-primary/5"
                  >
                    <User className="w-4 h-4" />
                    My Account Dashboard
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-accent text-spruce font-bold rounded-xl text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 font-bold rounded-xl text-sm hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signIn();
                  }}
                  className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-light text-center"
                >
                  Sign In to Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

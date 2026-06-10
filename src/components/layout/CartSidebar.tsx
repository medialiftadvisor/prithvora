'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  if (!cartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const tax = (subtotal - discountAmount) * 0.05; // 5% GST/Tax
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50; // free shipping above Rs. 500
  const total = subtotal - discountAmount + tax + shipping;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'ORGANIC10') {
      setAppliedDiscount(10);
      setCouponError('');
    } else if (coupon.toUpperCase() === 'AGRI20') {
      setAppliedDiscount(20);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedDiscount(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-league font-bold tracking-wide">Your Harvest Cart</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-offwhite flex justify-center items-center text-primary">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-league font-bold text-spruce">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Start adding fresh, organic products from our farm to your home.</p>
              </div>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors text-sm"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-offwhite border border-gray-100 hover:border-primary/20 transition-all duration-300">
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                  <img src={item.image} alt={item.name} className="object-contain w-16 h-16" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-spruce text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-spruce">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-spruce text-sm">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-offwhite space-y-4">
            {/* Coupon input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (ORGANIC10 / AGRI20)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary uppercase placeholder:lowercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-light transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
              {appliedDiscount > 0 && (
                <p className="text-xs text-primary font-bold">✓ {appliedDiscount}% discount applied!</p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-spruce">₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (5% GST)</span>
                <span className="font-medium text-spruce">₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-spruce">
                  {shipping === 0 ? <span className="text-primary font-semibold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-spruce border-t border-gray-200 pt-2">
                <span>Grand Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <Link
              href="/products?checkout=true"
              onClick={() => setCartOpen(false)}
              className="block w-full py-3 bg-accent text-spruce text-center font-league font-bold tracking-wider rounded-lg shadow-md hover:bg-accent-light transition-all duration-300"
            >
              PROCEED TO SECURE CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

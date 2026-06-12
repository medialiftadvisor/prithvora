'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { 
  ShoppingBag, 
  Heart, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  Minus, 
  Plus, 
  ArrowLeft,
  ChevronRight,
  Leaf,
  Award,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  benefits: string;
  nutrition: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  isOrganic: boolean;
  farmer?: {
    id: string;
    fullName: string;
    phone: string;
    state: string;
    district: string;
    farmSizeAcres: number;
    primaryCrops: string;
    procurementModel: string;
    rating: number;
  } | null;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'origin'>('benefits');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const isWished = wishlist.includes(product.id);

  // Parse benefits
  const benefitsList = product.benefits
    ? product.benefits.split(',').map((b) => b.trim()).filter(Boolean)
    : [];

  // Parse nutrition
  const nutritionItems = product.nutrition
    ? product.nutrition.split(',').map((item) => {
        const parts = item.split(':');
        const label = parts[0]?.trim() || '';
        const value = parts[1]?.trim() || '';
        
        // Dynamic estimation of Daily Value % for the visual progress bars
        let pct = 45;
        if (value) {
          const match = value.match(/(\d+(?:\.\d+)?)\s*%/);
          if (match) {
            pct = parseFloat(match[1]);
          } else {
            const numMatch = value.match(/(\d+(?:\.\d+)?)/);
            if (numMatch) {
              const num = parseFloat(numMatch[1]);
              const labelLower = label.toLowerCase();
              if (labelLower.includes('energy') || labelLower.includes('calories')) {
                pct = Math.min(Math.max((num / 2000) * 100, 10), 100);
              } else if (labelLower.includes('protein') || labelLower.includes('fats') || labelLower.includes('carbohydrates')) {
                pct = Math.min(Math.max((num / 70) * 100, 10), 100);
              } else if (labelLower.includes('calcium') || labelLower.includes('potassium')) {
                pct = Math.min(Math.max((num / 1000) * 100, 10), 100);
              } else {
                pct = Math.min(Math.max(num, 15), 95);
              }
            }
          }
        }
        return { label, value, pct: Math.round(pct) };
      })
    : [];

  // Image zoom effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      },
      quantity
    );
  };

  // Sourcing Hub storytelling text base
  const getSourcingDetails = (category: string) => {
    switch ((category || '').toLowerCase()) {
      case 'dairy':
      case 'vedic ghee':
        return 'Crafted at our dedicated Behror Sourcing Hub in Alwar, Rajasthan. Our A2 products come exclusively from grass-fed indigenous Gir cows, milked by hand in accordance with traditional Vedic principles. The ghee is slow-churned using the Bilona method in earthen pots to retain essential butyric acid and premium fats.';
      case 'honey':
        return 'Sourced from the pristine high-altitude meadows of Himachal Pradesh. Our wildflower and raw honey varieties are cold-extracted using natural gravity filters directly at the apiaries, bypassing thermal heating to keep the vital enzymes, pollen grains, and antioxidant properties alive and unadulterated.';
      case 'cold pressed oils':
        return 'Our yellow mustard and sesame seeds are dried in natural sunlight and crushed at low temperatures in wood-pressed (Kachi Ghani) wooden extractors at the Behror Hub. This prevents friction-induced heat, locking in the natural pungent aroma, essential nutrients, and rich Omega-3 fatty acids.';
      case 'organic juices':
        return 'Fresh organic fruits are cold-pressed using hydraulic presses at the Behror Hub to yield pure, fiber-rich juices. We flash-chill the juices immediately and dispatch them via our dedicated cold-chain grid, ensuring zero dilution, zero added sugar, and absolute raw freshness.';
      default:
        return 'Harvested by hand in the early hours from certified pesticide-free greenhouse clusters and partner family farms in Rajasthan and Maharashtra. Each batch is aggregated at the Behror processing hub, sorted using advanced optics, and packaged in eco-friendly breathable materials.';
    }
  };

  return (
    <div className="bg-offwhite min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400 uppercase tracking-wider text-[11px] font-bold">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-spruce font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to browsing
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Premium Interactive Showcase */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image container with lens zoom */}
            <div 
              className="relative aspect-square bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-8 sm:p-12 cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                style={zoomStyle}
                className="object-contain w-64 h-64 sm:w-80 sm:h-80 transition-transform duration-150 ease-out"
              />
              
              {/* Organic/Premium badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {product.isOrganic && (
                  <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Leaf className="w-3 h-3 fill-white" />
                    100% Organic
                  </span>
                )}
                {product.price > 800 && (
                  <span className="bg-accent text-spruce text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-spruce" />
                    Premium Vedic
                  </span>
                )}
              </div>

              {/* Sourcing Hub badge */}
              <div className="absolute bottom-6 left-6 bg-spruce/80 backdrop-blur-xs text-white text-[9px] font-bold px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">
                Behror Hub Certified
              </div>
            </div>

            {/* Quick Sourcing Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-100 p-3 rounded-2xl text-center space-y-1 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-primary mx-auto" />
                <span className="block text-[10px] font-black text-spruce uppercase tracking-wider">Zero Chemicals</span>
                <span className="block text-[8px] text-gray-400">Pesticide Free</span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl text-center space-y-1 shadow-xs">
                <Truck className="w-5 h-5 text-primary mx-auto" />
                <span className="block text-[10px] font-black text-spruce uppercase tracking-wider">Cold-Chain</span>
                <span className="block text-[8px] text-gray-400">Farm To Family</span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl text-center space-y-1 shadow-xs">
                <Award className="w-5 h-5 text-primary mx-auto" />
                <span className="block text-[10px] font-black text-spruce uppercase tracking-wider">Pure Origin</span>
                <span className="block text-[8px] text-gray-400">Directly Sourced</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Checkout Buybox & Meta */}
          <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
            
            {/* Category and Title */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-league font-black text-spruce leading-tight tracking-wide">
                {product.name}
              </h1>
              
              {/* Ratings and Reviews */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-xs font-bold text-spruce">{(product.rating ?? 5.0).toFixed(1)} Rating</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-primary font-bold">100% Pure Guarantee</span>
              </div>

              {product.farmer && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-offwhite/50 p-2.5 rounded-xl border border-gray-100/50 w-fit">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">Grower</span>
                  <span>Sourced directly from <span className="text-primary font-black">{product.farmer.fullName}</span> ({(product.farmer.rating ?? 5.0).toFixed(1)}★ Rating)</span>
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 pb-4 border-b border-gray-100">
              <span className="text-3xl sm:text-4xl font-black text-spruce">₹{product.price}</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimated Market Value</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-wider">Stock Status:</span>
              {product.stock > 0 ? (
                <span className="text-primary flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  In Stock ({product.stock} units left)
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* Checkout & Quantity Selector Box */}
            <div className="bg-offwhite p-5 rounded-2xl border border-gray-100/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Quantity adjustments */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quantity</label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl px-1 py-1 shadow-xs">
                    <button 
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-1.5 hover:bg-gray-100 text-spruce rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-spruce">{quantity}</span>
                    <button 
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="p-1.5 hover:bg-gray-100 text-spruce rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal preview */}
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subtotal</span>
                  <span className="text-xl font-black text-spruce">₹{product.price * quantity}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 bg-primary text-white font-league font-bold tracking-widest text-sm uppercase rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Basket
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="py-3.5 px-4 border border-gray-200 hover:text-red-500 text-gray-500 rounded-xl hover:bg-white hover:border-red-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Heart className={`w-5 h-5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-xs font-bold uppercase tracking-wider sm:hidden">Wishlist</span>
                </button>
              </div>
            </div>

            {/* Micro assurance bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="w-3 h-3" />
                </div>
                <span>Premium Quality Assured (FSSAI standard)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="w-3 h-3" />
                </div>
                <span>Dispatched next-morning cold chain</span>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Tabs/Accordions for Specifications, Nutrition, Origin */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100 bg-offwhite/50">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`flex-1 py-4 px-6 text-xs sm:text-sm font-league font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'benefits'
                  ? 'border-primary text-primary bg-white font-black'
                  : 'border-transparent text-gray-400 hover:text-spruce hover:bg-gray-50'
              }`}
            >
              Health & Purity Benefits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 py-4 px-6 text-xs sm:text-sm font-league font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'nutrition'
                  ? 'border-primary text-primary bg-white font-black'
                  : 'border-transparent text-gray-400 hover:text-spruce hover:bg-gray-50'
              }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('origin')}
              className={`flex-1 py-4 px-6 text-xs sm:text-sm font-league font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'origin'
                  ? 'border-primary text-primary bg-white font-black'
                  : 'border-transparent text-gray-400 hover:text-spruce hover:bg-gray-50'
              }`}
            >
              Direct Farming Origin Story
            </button>
          </div>

          {/* Tab content panels */}
          <div className="p-6 sm:p-8 min-h-[200px]">
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-league font-black text-spruce uppercase tracking-wider">Sustainably Cultivated Wellness</h3>
                  <p className="text-xs text-gray-400 mt-1">Direct pharmacological advantages verified by native traditional and organic practices.</p>
                </div>
                
                {benefitsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {benefitsList.map((benefit, idx) => (
                      <div key={idx} className="p-4 bg-green-50/20 border border-green-100/50 rounded-2xl flex items-start gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary mt-0.5">
                          <Leaf className="w-4 h-4 fill-primary/25" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-spruce block mb-1">Key Health Benefit</span>
                          <p className="text-xs text-gray-600 leading-relaxed">{benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Traditional health advantages include raw nutrition, anti-inflammatory compounds, and premium organic minerals.</p>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-league font-black text-spruce uppercase tracking-wider">Nutritional Breakdown</h3>
                  <p className="text-xs text-gray-400 mt-1">Lab-certified chemical-free nutrient profile values per standard consumer portions.</p>
                </div>

                {nutritionItems.length > 0 ? (
                  <div className="max-w-2xl space-y-4">
                    {nutritionItems.map((n, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-spruce">
                          <span className="uppercase tracking-wider">{n.label}</span>
                          <span className="text-primary">{n.value}</span>
                        </div>
                        {/* Styled Progress Bar */}
                        <div className="h-2.5 bg-offwhite rounded-full overflow-hidden border border-gray-100/50">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                            style={{ width: `${n.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">100% natural compounds with standard biological components.</p>
                )}
              </div>
            )}

            {activeTab === 'origin' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-lg font-league font-black text-spruce uppercase tracking-wider">The Behror Hub Sourcing Route</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getSourcingDetails(product.category)}
                  </p>

                  {product.farmer && (
                    <div className="p-5 bg-offwhite border border-gray-200/50 rounded-2xl space-y-3.5 my-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Meet the Grower</span>
                          <h4 className="font-league font-black text-lg text-spruce">{product.farmer.fullName}</h4>
                          <span className="text-xs text-gray-400 block">{product.farmer.district}, {product.farmer.state}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Farmer Rating</span>
                          <div className="flex items-center gap-1.5 pt-0.5 justify-end">
                            <div className="flex text-accent">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-spruce">{(product.farmer.rating ?? 5.0).toFixed(1)}★</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold border-t border-gray-200/55 pt-3 text-gray-500">
                        <div>
                          <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Farm Size</span>
                          <span className="text-spruce block mt-0.5">{product.farmer.farmSizeAcres} Acres</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Procurement Model</span>
                          <span className="text-spruce block mt-0.5">{product.farmer.procurementModel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed">
                    PRITHVORA Agriverse guarantees that every batch has been tested for adulterants, pesticide residues, and preservative agents at local laboratories before shipping. By selecting this product, you directly support small farming families, providing fair wages and sustainable village development.
                  </p>
                </div>
                <div className="md:col-span-5 relative bg-spruce rounded-3xl overflow-hidden p-8 text-white space-y-4 shadow-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                  <div className="relative z-10 space-y-3">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest block">Rajasthan Processing Centre</span>
                    <h4 className="font-league font-black text-xl text-white tracking-wide">Behror Central Hub</h4>
                    <p className="text-xs text-secondary-light leading-relaxed">
                      Strategically located in Behror, Alwar, this facility is equipped with automated temperature controls and dedicated cold storage units to maintain complete nutritional integrity.
                    </p>
                    <div className="flex gap-4 text-xs font-bold pt-2 border-t border-white/10 text-accent">
                      <div>
                        <span className="block text-white text-base">4.9★</span>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400">Quality Index</span>
                      </div>
                      <div>
                        <span className="block text-white text-base">100%</span>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400">Direct Sourced</span>
                      </div>
                      <div>
                        <span className="block text-white text-base">Traceable</span>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400">Farm Clusters</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Deck */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-league font-black text-2xl tracking-wide text-spruce uppercase">Related Agri-Products</h2>
              <p className="text-xs text-gray-400 font-medium">Specially selected organic options from the same sustainable categories.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white rounded-3xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-square bg-offwhite flex items-center justify-center p-6 border-b border-gray-50/50">
                    <Link href={`/products/${p.slug}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="object-contain w-28 h-28 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {p.isOrganic && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Organic
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">{p.category}</span>
                      <Link href={`/products/${p.slug}`} className="cursor-pointer block">
                        <h3 className="font-bold text-spruce leading-snug text-xs tracking-wide group-hover:text-primary transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-black text-spruce">₹{p.price}</span>
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="px-3 py-1.5 bg-primary hover:bg-primary-light text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

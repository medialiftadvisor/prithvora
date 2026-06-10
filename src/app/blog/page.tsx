'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Clock, User, ArrowRight, X } from 'lucide-react';

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
}

const ARTICLES: ArticleData[] = [
  {
    id: 'art_01',
    title: 'Understanding Soil Micro-Microbiome in Organic Farming',
    slug: 'understanding-soil-health-organic',
    category: 'Agriculture',
    image: '/produce.png',
    author: 'Dr. Anita Desai, Lead Agronomist',
    readTime: '6 Mins Read',
    date: 'June 05, 2026',
    summary: 'Why chemical fertilizers ruin soil microbial activity and how natural crop rotation preserves nutrient densities across crop cycles.',
    content: 'Chemical nitrogen fertilizers provide quick boosts but strip the soil of essential bacteria and mycorrhizal fungi. Without these microbes, plants cannot absorb organic minerals naturally. In this article, we map the biological mechanisms of green manures, crop rotation, and bio-fertilizer inoculation, proving how sustainable soil management improves crop quality and organic yield value over decades.'
  },
  {
    id: 'art_02',
    title: 'A2 Beta-Casein: The Science of Pure Gir Cow Milk',
    slug: 'a2-beta-casein-gir-milk-science',
    category: 'Dairy',
    image: '/dairy.png',
    author: 'Mahesh Rao, CEO',
    readTime: '5 Mins Read',
    date: 'May 28, 2026',
    summary: 'An analytical comparison between A1 and A2 beta-casein proteins and their digestive profiles in modern households.',
    content: 'Most commercial dairy cows yield A1 milk, which releases a peptide called BCM-7 during digestion, frequently causing bloating and dairy sensitivities. Native Indian cow breeds (like Gir and Sahiwal) produce pure A2 milk, which has a distinct amino acid chain that is easily absorbed. We examine the molecular differences and explain why cold-chain raw A2 milk is the ultimate nutritional choice for growing children.'
  },
  {
    id: 'art_03',
    title: 'Purity Checklist: Identifying Genuine Wild Honey',
    slug: 'purity-checklist-genuine-wild-honey',
    category: 'Honey',
    image: '/honey.png',
    author: 'Rajesh G., Apiary Specialist',
    readTime: '4 Mins Read',
    date: 'May 12, 2026',
    summary: 'Learn how apiary harvesting processes affect active enzymes and how to spot adulterated sugar syrups.',
    content: 'Commercial honey is often micro-filtered and heated to high temperatures, destroying active pollen grains and beneficial enzymes. Cheap honey is also frequently diluted with C4 cane sugar or corn syrups. Our checklist details simple diagnostic tests (like the water solubility test and paper absorption test) to help you verify raw, cold-extracted wildflower honey at home.'
  },
  {
    id: 'art_04',
    title: 'Transitioning to Organic Living: A 3-Step Guide',
    slug: 'transitioning-organic-living-guide',
    category: 'Organic Living',
    image: '/produce.png',
    author: 'Sunita Mehra, Wellness Coach',
    readTime: '5 Mins Read',
    date: 'April 20, 2026',
    summary: 'Simple kitchen modifications to exclude pesticide-laden produce and trans-fats from your daily diet.',
    content: 'You do not need to rewrite your entire diet overnight. Start by switching your high-use cooking oils to cold-pressed mustard or coconut oils, which are free from solvent-extraction chemicals. Secondly, transition your daily dairy to chemical-free A2 milk. Finally, source your vegetables from certified organic growers. These three changes eliminate 80% of dietary pesticide exposure.'
  },
  {
    id: 'art_05',
    title: 'Decentralized Cold-Chilling: The Future of Food Processing',
    slug: 'decentralized-cold-chilling-food-processing',
    category: 'Food Processing',
    image: '/juices.png',
    author: 'Vikram Sen, Operations Head',
    readTime: '7 Mins Read',
    date: 'April 02, 2026',
    summary: 'How real-time solar chilling units prevent bacterial growth in raw milk without chemical boiling.',
    content: 'Milk spoilages begin within 2 hours of milking if not chilled below 4°C. Standard supply chains rely on boiling and pasteurization, which kills pathogens but degrades natural nutrients. Prithvora uses smart, solar-powered bulk milk coolers in rural villages, chilling milk immediately upon harvest. This keeps the bacterial load low, delivering fresh milk without chemical processing.'
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  const categories = ['All', 'Agriculture', 'Dairy', 'Honey', 'Organic Living', 'Food Processing'];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCat = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">Agriverse Insights</p>
          <h1 className="text-4xl sm:text-6xl font-league font-black text-spruce tracking-tight leading-none">
            The PRITHVORA Blog
          </h1>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Scientific breakdowns, agronomy guides, organic recipe ideas, and supply chain updates straight from our agritech experts.
          </p>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          
          {/* Categories list */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-offwhite text-spruce hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>

        </div>

        {/* Blog Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 bg-offwhite rounded-full flex justify-center items-center text-primary mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-league font-bold text-spruce">No articles found</h3>
              <p className="text-sm text-gray-400 mt-1">Try broadening your search criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <div 
                key={art.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Image wrapper */}
                  <div className="relative aspect-video bg-offwhite flex items-center justify-center p-6 border-b border-gray-50 overflow-hidden">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="object-contain w-32 h-32 group-hover:scale-105 transition-transform duration-350"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {art.category}
                    </span>
                  </div>

                  {/* Card details */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{art.readTime}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>

                    <h3 className="font-league font-bold text-lg text-spruce group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate max-w-[150px]">{art.author.split(',')[0]}</span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ARTICLE FULL MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 animate-zoom-in">
            
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-league font-black text-spruce leading-tight tracking-wide">
                {selectedArticle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider pt-2 border-b border-gray-100 pb-4">
                <span className="flex items-center gap-1 text-primary"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
              </div>
            </div>

            {/* Content body */}
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-inter">
              <p className="font-semibold text-spruce border-l-2 border-accent pl-4 italic">
                {selectedArticle.summary}
              </p>
              <p className="pt-2">
                {selectedArticle.content}
              </p>
              <p>
                Sustainable farming requires building deep local infrastructure, which is why Prithvora works closely with grower co-operatives. This allows us to ensure that our customers receive organic ingredients of the highest biological order. Stay tuned to our insights feed for more updates from our field agronomists.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-primary-light transition-all"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

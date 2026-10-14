import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    title: 'Find Your Special Tour Today',
    subtitle: 'With Wayfare Travel & Expeditions',
    desc: 'Explore world-class destinations, handpicked luxury hotels, and unforgettable guided tours across Sri Lanka and beyond.',
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80',
    title: 'Discover Tropical Lagoons & Reefs',
    subtitle: 'Luxury Oceanfront Living',
    desc: 'Immerse yourself in crystal clear waters, private infinity pools, and serene coastal hideaways.',
  },
  {
    url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1920&q=80',
    title: 'Highland Odyssey & Tea Valleys',
    subtitle: 'Mountain Trekking & Colonial Charm',
    desc: 'Journey through mist-shrouded mountain peaks, iconic railways, and emerald tea estates.',
  },
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_IMAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === HERO_IMAGES.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = HERO_IMAGES[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
      {/* Background Image Carousel */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
        style={{ backgroundImage: `url('${currentSlide.url}')` }}
      >
        {/* Dark / Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20"></div>
      </div>

      {/* Hero Body Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-2xl text-left space-y-4 animate-fade-in">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            Premium Travel Platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {currentSlide.title} <br />
            <span className="italic font-serif font-light text-cyan-300">
              {currentSlide.subtitle}
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
            {currentSlide.desc}
          </p>
        </div>

        {/* Search Bar Component Positioned in Hero */}
        <div className="mt-10 w-full z-20">
          <SearchBar />
        </div>
      </div>

      {/* Hero Carousel Navigation Controls on Bottom Left */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

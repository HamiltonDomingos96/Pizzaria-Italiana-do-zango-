import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/menu';

interface HeroBannerProps {
  onCtaClick: () => void;
  onOpenPromo: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCtaClick, onOpenPromo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="relative bg-stone-950 text-white overflow-hidden border-b border-stone-800">
      {/* Background Image with Dark Vignette & Charcoal Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out opacity-40 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-xl">
          {/* Tag Pill-Free Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>{slide.tag}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">ZANGO 2 - LUANDA</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif-italian leading-tight text-white mb-2 text-balance">
            {slide.title}
            <span className="block text-red-500 text-lg sm:text-2xl font-sans font-bold mt-1">
              {slide.highlight}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg">
            {slide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCtaClick}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-all cursor-pointer"
            >
              <span>{slide.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPromo}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cupão de Boas-Vindas</span>
            </button>
          </div>
        </div>

        {/* Slider Controls & Micro Indicators */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-stone-800/60 text-stone-400 text-xs">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all rounded-full ${
                  currentSlide === idx ? 'w-8 bg-red-500' : 'w-2 bg-stone-700 hover:bg-stone-600'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="w-8 h-8 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Slide seguinte"
              className="w-8 h-8 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

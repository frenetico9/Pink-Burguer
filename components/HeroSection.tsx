import React from 'react';
import { RestaurantInfo } from '../types';

interface HeroSectionProps {
    info: RestaurantInfo;
}

const HeroSection: React.FC<HeroSectionProps> = ({ info }) => {
  return (
    <section className="relative pt-12 pb-12 sm:pt-16 sm:pb-16 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
        
        <div className="relative mb-6">
            {info.logoUrl && (
                <img 
                  src={info.logoUrl} 
                  alt={`Logo de ${info.name}`}
                  className="h-24 sm:h-32 w-auto drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                />
            )}
        </div>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-textPrimary tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          CARDÁPIO
        </h1>
        <div className="mt-4">
          <span className="inline-block bg-primary text-textPrimary font-sans font-semibold py-1.5 px-8 text-lg tracking-widest shadow-lg shadow-primary/30 rounded-sm transform transition-transform hover:scale-105">
            {info.tagline}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
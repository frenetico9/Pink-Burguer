
import React from 'react';

interface WelcomeSectionProps {
  name: string;
  tagline1?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ name, tagline1 }) => {
  return (
    <section className="bg-cardBg text-slate-800 py-6 sm:py-8 text-center mb-6 sm:mb-8 shadow-subtle rounded-lg border border-slate-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-medium mb-2">
          Bem-vindo ao <span className="text-2xl sm:text-3xl font-semibold text-vibrantOrange">{name} {tagline1}!</span>
        </h2>
        <p className="text-base sm:text-lg text-itemDescriptionText opacity-90">
          O maior e mais saboroso pastel de 26cm da região. Explore nosso cardápio!
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;
import React from 'react';
import { Review } from '../types';
import { StarIcon } from '../constants';

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-primary tracking-wider mb-8">
          O que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className="bg-background p-6 rounded-lg border border-gray-800 flex flex-col gap-4 animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <i className="fas fa-quote-left absolute -top-2 -left-2 text-6xl text-surface opacity-50 z-0"></i>
              <div className="flex items-center justify-between z-10">
                <h3 className="font-bold text-textPrimary text-lg">{review.name}</h3>
                <div className="flex text-accent">
                  {[...Array(review.rating)].map((_, i) => <StarIcon key={i} />)}
                </div>
              </div>
              <p className="text-textSecondary italic z-10">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
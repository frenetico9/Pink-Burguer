
import React from 'react';
import { Category } from '../types';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="bg-primary h-12"> {/* Height to match fixed setup, bg-primary for seamless look with Header */}
      <div className="container mx-auto px-2 sm:px-4 flex items-center space-x-1 sm:space-x-2 overflow-x-auto h-full"> {/* Removed justify-center */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-2 sm:px-4 h-full flex items-center text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap focus:outline-none
              ${activeCategory === cat.id 
                ? 'text-brandText border-b-2 border-brandText' // Active: uses brandText for text and border on primary bg
                : 'text-brandText opacity-70 hover:opacity-100 hover:border-b-2 hover:border-brandText hover:border-opacity-50'}`}
            aria-pressed={activeCategory === cat.id}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavigation;
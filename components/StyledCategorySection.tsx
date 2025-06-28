import React from 'react';
import { Category, MenuItem } from '../types';
import MenuItemCard from './MenuItemCard'; 
import { InfoIcon } from '../constants';

interface StyledCategorySectionProps {
  category: Category;
  items: MenuItem[];
  onSelectPastel: (item: MenuItem) => void;
}

const StyledCategorySection: React.FC<StyledCategorySectionProps> = ({ category, items, onSelectPastel }) => {
  if (items.length === 0 && category.id !== 'all') { // No items passed for this specific category section
    return (
        <section id={category.id} className="mb-8 sm:mb-12">
            <div className="mb-6 p-4 rounded-lg shadow-subtle bg-cardBg border border-slate-200">
                 <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-2 sm:mb-0">
                    {category.name}
                </h2>
            </div>
            <div className="text-center py-6 sm:py-8 bg-cardBg p-4 sm:p-6 rounded-lg shadow-subtle">
                <InfoIcon className="text-3xl sm:text-4xl text-brandText opacity-50 mb-2 sm:mb-3" />
                <p className="text-md sm:text-lg text-brandText font-medium">
                    Nenhum item encontrado nesta categoria no momento.
                </p>
            </div>
        </section>
    );
  }

  const allItemsInSectionUnavailable = items.length > 0 && items.every(item => !item.isAvailable);

  return (
    <section id={category.id} className="mb-8 sm:mb-12"> 
      <div className="mb-6 p-4 rounded-lg shadow-subtle bg-cardBg border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-2 sm:mb-0">
              {category.name}
            </h2>
            {category.price && ( 
              <div className="bg-slate-100 text-slate-700 text-center py-1.5 px-4 rounded-md shadow-sm">
                <p className="text-md sm:text-lg font-medium">{category.price}</p>
              </div>
            )}
        </div>
      </div>
      
      {allItemsInSectionUnavailable ? (
        <div className="text-center py-6 sm:py-8 bg-cardBg p-4 sm:p-6 rounded-lg shadow-subtle">
            <InfoIcon className="text-3xl sm:text-4xl text-brandText opacity-50 mb-2 sm:mb-3" />
            <p className="text-md sm:text-lg text-brandText font-medium">
                Todos os itens em "{category.name}" estão temporariamente indisponíveis.
            </p>
            <p className="text-sm text-itemDescriptionText opacity-75">Por favor, verifique novamente mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onSelectPastel={onSelectPastel}
              categoryPrice={category.price}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StyledCategorySection;
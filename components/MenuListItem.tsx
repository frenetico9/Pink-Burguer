
import React from 'react';
import { MenuItem } from '../types';
import { HERO_IMAGE_URL } from '../constants'; // Import the hamburger image

interface MenuListItemProps {
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  style?: React.CSSProperties;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ item, onSelectItem, style }) => {
  return (
    <div 
      className="bg-surface p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 animate-fade-in transition-all duration-300 group"
      style={style}
    >
      <img 
        src={item.imageUrl}
        alt={item.name}
        className="w-full md:w-32 h-32 md:h-auto object-cover rounded-md flex-shrink-0"
      />

      <div className="flex-grow w-full">
        <div className="flex items-center gap-3">
            <div className="text-primary text-xl transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-400">
                <i className="fas fa-caret-right"></i>
            </div>
            <h3 className="font-display text-3xl text-textPrimary tracking-wider group-hover:text-primary transition-colors duration-300">{item.name}</h3>
        </div>
        
        <p className="text-textSecondary text-sm mt-1 ml-8">
          {item.description}
        </p>
      </div>

      <div className="flex-shrink-0 flex flex-row sm:flex-col items-center gap-3 sm:gap-2 self-end sm:self-center w-full md:w-auto mt-4 md:mt-0">
        <div className="text-center bg-background p-2 rounded w-full sm:w-28 border border-gray-800">
            <span className="text-xs text-textSecondary">Lanche</span>
            <p className="font-bold text-lg text-textPrimary">R$ {item.price.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="text-center bg-background p-2 rounded w-full sm:w-28 border border-yellow-400/50">
            <span className="text-xs font-semibold text-accent">TRIO</span>
            <p className="font-bold text-lg text-accent">R$ {item.trioPrice.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      <div className="w-full md:w-auto flex-shrink-0 md:ml-4 mt-4 md:mt-0">
         <button 
            onClick={() => onSelectItem(item)}
            className="w-full md:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/50"
            aria-label={`Adicionar ${item.name} ao pedido`}
        >
            Adicionar
        </button>
      </div>
    </div>
  );
};

export default MenuListItem;
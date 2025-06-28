import React from 'react';
import { MenuItem, ItemType } from '../types';
import { IMGUR_PLACEHOLDER, BanIcon } from '../constants';

interface MenuItemCardProps {
  item: MenuItem;
  onSelectPastel: (pastel: MenuItem) => void;
  categoryPrice?: string;
}

const tagStyles: Record<ItemType, { bgColor: string; textColor: string; borderColor?: string }> = {
  Tradicional: { bgColor: 'bg-sky-100', textColor: 'text-sky-700', borderColor: 'border-sky-300' },
  Especial: { bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-300' },
  Doce: { bgColor: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
  Borda: { bgColor: 'bg-slate-100', textColor: 'text-slate-700', borderColor: 'border-slate-300' },
  Bebida: { bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelectPastel, categoryPrice }) => {
  const displayPrice = item.price > 0 ? `R$ ${item.price.toFixed(2).replace('.', ',')}` : (categoryPrice || "Preço sob consulta");
  const isPastel = item.itemType === 'Tradicional' || item.itemType === 'Especial' || item.itemType === 'Doce';

  const handleButtonClick = () => {
    if (item.isAvailable) {
      onSelectPastel(item);
    }
  };

  const cardClasses = `bg-cardBg rounded-xl shadow-subtle flex flex-col transition-all duration-300 overflow-hidden group border border-slate-200 ${
    item.isAvailable ? 'hover:shadow-lifted' : 'opacity-60 cursor-not-allowed'
  }`;

  return (
    <div className={cardClasses} aria-disabled={!item.isAvailable}>
      <div className="relative">
        {item.imageUrl && item.imageUrl !== IMGUR_PLACEHOLDER ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className={`w-full h-52 sm:h-60 md:h-64 object-cover transition-transform duration-300 ${item.isAvailable ? 'group-hover:scale-105' : ''}`}
          />
        ) : (
          <div className="w-full h-52 sm:h-60 md:h-64 bg-slate-200 flex items-center justify-center">
            <span className="text-slate-500 text-sm italic">
              {item.itemType === 'Bebida' ? 'Bebida' : 'Imagem Indisponível'}
            </span>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-700 bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
            <BanIcon className="text-white text-4xl mb-2" />
            <span className="text-white font-semibold text-lg">Indisponível</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {item.itemType && tagStyles[item.itemType] && (
          <span 
            className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full mb-2 border ${tagStyles[item.itemType].bgColor} ${tagStyles[item.itemType].textColor} ${tagStyles[item.itemType].borderColor}`}
            aria-label={`Tipo: ${item.itemType}`}
          >
            {item.itemType.toUpperCase()}
          </span>
        )}
        <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate" title={item.name}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-itemDescriptionText mb-2 min-h-[2.5rem] line-clamp-2" title={item.description}>
            ({item.description})
          </p>
        )}
        
        <p className={`text-xl font-bold text-slate-700 mt-auto mb-3`}>
          {displayPrice}
        </p>

        <button
          onClick={handleButtonClick}
          disabled={!item.isAvailable}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${item.isAvailable 
              ? 'bg-vibrantOrange hover:bg-vibrantOrangeHover text-white hover:shadow-lg focus:ring-vibrantOrange transform hover:-translate-y-0.5' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
          aria-label={`${item.isAvailable ? (isPastel ? 'Escolher Opções' : 'Adicionar') : 'Item indisponível:'} ${item.name}`}
        >
          {item.isAvailable ? (isPastel ? 'Escolher Opções' : 'Adicionar') : 'Indisponível'}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
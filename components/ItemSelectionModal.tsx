
import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';
import { CloseIcon } from '../constants';

interface ItemSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (item: CartItem) => void;
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({ isOpen, onClose, item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isTrio, setIsTrio] = useState(false);
  const [selectedSauce, setSelectedSauce] = useState<'Alho' | 'Especial'>('Especial');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsTrio(false);
      setSelectedSauce('Especial');
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    const price = isTrio ? item.trioPrice : item.price;
    const cartItem: CartItem = {
      id: item.id,
      cartItemId: `${item.id}-${isTrio ? 'trio' : 'single'}-${selectedSauce}`,
      name: `${item.name}${isTrio ? ' (Trio)' : ''}`,
      quantity,
      price,
      isTrio,
      sauce: selectedSauce,
    };
    onAddToCart(cartItem);
    onClose();
  };

  const selectedOptionClasses = "ring-2 ring-primary ring-offset-2 ring-offset-background";
  const unselectedOptionClasses = "hover:bg-opacity-80";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg shadow-lg w-full max-w-md flex flex-col overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-background">
          <h2 className="text-2xl font-display text-primary tracking-wider">{item.name}</h2>
          <button onClick={onClose} className="text-textSecondary hover:text-primary"><CloseIcon className="text-2xl" /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-textPrimary mb-3">Escolha sua opção:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsTrio(false)} className={`p-4 rounded-lg bg-background text-center transition-all ${!isTrio ? selectedOptionClasses : unselectedOptionClasses}`}>
                <p className="font-bold text-lg text-textPrimary">Só o Lanche</p>
                <p className="text-xl font-bold text-accent">R$ {item.price.toFixed(2).replace('.', ',')}</p>
              </button>
              <button onClick={() => setIsTrio(true)} className={`p-4 rounded-lg bg-background text-center transition-all ${isTrio ? selectedOptionClasses : unselectedOptionClasses}`}>
                <p className="font-bold text-lg text-textPrimary">Trio</p>
                <p className="text-xs text-textSecondary mb-1">(+ Fritas e Refri)</p>
                <p className="text-xl font-bold text-accent">R$ {item.trioPrice.toFixed(2).replace('.', ',')}</p>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-textPrimary mb-3">Escolha o molho:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedSauce('Especial')} className={`p-3 rounded-lg bg-background text-center transition-all ${selectedSauce === 'Especial' ? selectedOptionClasses : unselectedOptionClasses}`}>
                <p className="font-bold text-lg text-textPrimary">Molho Especial</p>
              </button>
              <button onClick={() => setSelectedSauce('Alho')} className={`p-3 rounded-lg bg-background text-center transition-all ${selectedSauce === 'Alho' ? selectedOptionClasses : unselectedOptionClasses}`}>
                <p className="font-bold text-lg text-textPrimary">Molho de Alho</p>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-textPrimary mb-3">Quantidade:</h3>
            <div className="flex items-center justify-center gap-4 bg-background p-2 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl font-bold text-primary w-10 h-10 rounded-md hover:bg-surface transition-colors">-</button>
              <span className="text-2xl font-bold text-textPrimary w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-2xl font-bold text-primary w-10 h-10 rounded-md hover:bg-surface transition-colors">+</button>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-background">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg shadow-primary/50"
          >
            Adicionar ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionModal;
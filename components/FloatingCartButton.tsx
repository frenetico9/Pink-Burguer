import React from 'react';
import { ShoppingCartIcon } from '../constants';

interface FloatingCartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-primary text-white h-14 px-5 rounded-full shadow-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90 z-40 animate-fade-in"
      aria-label={`Ver carrinho com ${itemCount} itens`}
    >
      <ShoppingCartIcon className="text-2xl" />
      <span className="font-bold text-lg">{itemCount}</span>
    </button>
  );
};

export default FloatingCartButton;
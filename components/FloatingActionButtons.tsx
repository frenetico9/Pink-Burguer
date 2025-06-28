
import React from 'react';
import { WhatsAppIcon } from '../constants';

interface FloatingActionButtonsProps {
  itemCount: number;
  onWhatsAppOrderClick: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({ itemCount, onWhatsAppOrderClick }) => {

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50 font-sans">
      <button
        onClick={onWhatsAppOrderClick}
        title="Revisar e Enviar Pedido via WhatsApp"
        aria-label={`Revisar e Enviar Pedido via WhatsApp, ${itemCount} itens selecionados`}
        className="bg-green-500 hover:bg-green-600 text-white h-14 px-4 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-green-600 relative"
      >
        <WhatsAppIcon className="text-2xl" />
        <span className="font-semibold text-sm uppercase">Enviar Pedido</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-xs text-brandText font-bold rounded-full px-1.5 py-0.5 min-w-[20px] h-[20px] flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingActionButtons;
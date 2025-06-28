import React, { useState } from 'react';
import { MenuItem } from '../types';
import { CloseIcon } from '../constants';

interface SelectBordaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastel: MenuItem;
  bordas: MenuItem[]; // Should be pre-filtered for availability by App.tsx
  onConfirm: (pastel: MenuItem, selectedBorda?: MenuItem) => void;
}

const SelectBordaModal: React.FC<SelectBordaModalProps> = ({
  isOpen,
  onClose,
  pastel,
  bordas, // These are already filtered for isAvailable: true
  onConfirm,
}) => {
  const [selectedBordaId, setSelectedBordaId] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handleConfirmSelection = () => {
    // Bordas prop already contains only available bordas
    const chosenBorda = bordas.find(b => b.id === selectedBordaId);
    onConfirm(pastel, chosenBorda);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-borda-modal-title"
    >
      <div
        className="bg-cardBg rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 id="select-borda-modal-title" className="text-xl font-semibold text-slate-800">
            Escolha a Borda para: <span className="text-vibrantOrange">{pastel.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-vibrantOrange transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-itemDescriptionText">
            Selecione uma opção de borda recheada ou prossiga sem borda. Todas as bordas são sem custo adicional.
          </p>
          
          <button
            onClick={() => setSelectedBordaId(undefined)}
            className={`w-full text-left p-3 border rounded-lg transition-all duration-200 ease-in-out text-sm focus:outline-none focus:ring-2
              ${selectedBordaId === undefined
                ? 'border-vibrantOrange bg-orange-50 ring-vibrantOrange ring-opacity-50 shadow-sm'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
            role="radio"
            aria-checked={selectedBordaId === undefined}
          >
            <span className={`font-medium ${selectedBordaId === undefined ? 'text-vibrantOrange' : 'text-slate-700'}`}>
              Sem Borda Adicional
            </span>
            {selectedBordaId === undefined && (
                <span className="ml-auto float-right text-vibrantOrange"><i className="fas fa-check-circle text-md"></i></span>
            )}
          </button>

          {bordas.length === 0 && selectedBordaId !== undefined && (
            <p className="text-sm text-center text-itemDescriptionText italic">Nenhuma borda recheada disponível no momento.</p>
          )}

          {bordas.map(borda => ( // bordas here are already filtered for isAvailable
            <button
              key={borda.id}
              onClick={() => setSelectedBordaId(borda.id)}
              className={`w-full text-left p-3 border rounded-lg transition-all duration-200 ease-in-out text-sm focus:outline-none focus:ring-2
                ${selectedBordaId === borda.id
                  ? 'border-vibrantOrange bg-orange-50 ring-vibrantOrange ring-opacity-50 shadow-sm'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
              role="radio"
              aria-checked={selectedBordaId === borda.id}
            >
              <span className={`font-medium ${selectedBordaId === borda.id ? 'text-vibrantOrange' : 'text-slate-700'}`}>
                Borda de {borda.name}
              </span>
              <span className="block text-xs text-itemDescriptionText opacity-80">
                ({borda.description})
              </span>
              {selectedBordaId === borda.id && (
                  <span className="ml-auto float-right text-vibrantOrange relative -top-4"><i className="fas fa-check-circle text-md"></i></span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleConfirmSelection}
            className="w-full bg-vibrantOrange hover:bg-vibrantOrangeHover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-md transform hover:-translate-y-0.5"
          >
            Confirmar e Adicionar ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectBordaModal;
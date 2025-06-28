import React from 'react';
import { Coupon } from '../types';
import { GiftIcon, CloseIcon, CalendarIcon } from '../constants';

interface CouponHighlightPopupProps {
  coupon: Coupon | null;
  onClose: () => void;
  isVisible: boolean;
}

const CouponHighlightPopup: React.FC<CouponHighlightPopupProps> = ({ coupon, onClose, isVisible }) => {
  if (!isVisible || !coupon) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Ensure correct parsing as local date
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div 
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[90] animate-pulse-grow-shrink"
      role="alertdialog"
      aria-labelledby="coupon-popup-title"
      aria-describedby="coupon-popup-description"
    >
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lifted w-64 sm:w-72 border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-vibrantOrange transition-colors p-1"
          aria-label="Fechar aviso de cupom"
        >
          <CloseIcon className="text-lg" />
        </button>

        <div className="flex items-center mb-2">
          <GiftIcon className="text-3xl text-vibrantOrange mr-3" />
          <div>
            <h3 id="coupon-popup-title" className="text-sm font-semibold text-vibrantOrange">Cupom Especial!</h3>
            <p className="text-xs text-slate-500">Aproveite esta oferta</p>
          </div>
        </div>

        <div id="coupon-popup-description" className="space-y-1">
            <p className="text-lg font-bold text-brandText text-center bg-primary bg-opacity-20 py-1.5 px-2 rounded-md">
                {coupon.code}
            </p>
            {coupon.description && (
                <p className="text-xs text-center text-itemDescriptionText">{coupon.description}</p>
            )}
            {coupon.discountType === 'percentage' && (
                 <p className="text-sm text-center font-medium text-slate-700">{coupon.value}% DE DESCONTO</p>
            )}
            {coupon.discountType === 'fixed' && (
                 <p className="text-sm text-center font-medium text-slate-700">R$ {coupon.value.toFixed(2).replace('.',',')} DE DESCONTO</p>
            )}

            {coupon.expiryDate && (
            <p className="text-xs text-slate-600 text-center pt-1">
                <CalendarIcon className="inline mr-1 opacity-70" />
                Válido até: <span className="font-medium">{formatDate(coupon.expiryDate)}</span>
            </p>
            )}
        </div>
        <p className="text-[0.65rem] text-slate-400 text-center mt-2">Use no carrinho ao finalizar o pedido.</p>
      </div>
    </div>
  );
};

export default CouponHighlightPopup;

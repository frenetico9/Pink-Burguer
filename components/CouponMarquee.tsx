
import React from 'react';
import { Coupon } from '../types'; // Ajuste o caminho se necessário

interface CouponMarqueeProps {
  coupon: Coupon | null;
}

const CouponMarquee: React.FC<CouponMarqueeProps> = ({ coupon }) => {
  if (!coupon) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    // Adicionar 'T00:00:00' para garantir que a data seja interpretada como local e não UTC
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const couponMessage = `APROVEITE! Cupom ${coupon.code}: ${coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `R$${coupon.value.toFixed(2)} OFF`}${coupon.minOrderValue ? ` em pedidos acima de R$${coupon.minOrderValue.toFixed(2)}` : ''}. ${coupon.expiryDate ? `Válido até ${formatDate(coupon.expiryDate)}.` : ''} Imperdível!`;

  return (
    <div className="bg-brandText text-primary h-8 flex items-center overflow-hidden relative">
      <div className="absolute inset-0 flex items-center">
        <p className="whitespace-nowrap animate-scroll-left px-4 text-sm font-semibold tracking-wider">
          {couponMessage}
        </p>
      </div>
      {/* Overlay Gradiente para efeito de sumiço na direita */}
      <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-brandText to-transparent"></div>
    </div>
  );
};

export default CouponMarquee;

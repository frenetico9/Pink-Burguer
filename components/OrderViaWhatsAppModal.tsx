import React, { useState, useEffect } from 'react';
import { CartItem, PaymentMethod, Coupon } from '../types';
import { CloseIcon, TrashIcon, UserIcon, AddressIcon, WhatsAppIcon, TagIcon } from '../constants';

interface OrderViaWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  subtotalAmount: number; // Renamed from totalAmount
  paymentMethods: PaymentMethod[];
  restaurantWhatsAppNumber: string;
  onOrderSent: () => void;
  availableCoupons: Coupon[];
}

const OrderViaWhatsAppModal: React.FC<OrderViaWhatsAppModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  onRemoveItem,
  onUpdateQuantity,
  subtotalAmount,
  paymentMethods,
  restaurantWhatsAppNumber,
  onOrderSent,
  availableCoupons,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const finalTotalAmount = subtotalAmount - discountAmount;

  // Reset coupon state when modal opens or subtotal changes (e.g. items removed)
  useEffect(() => {
    if (isOpen) {
      setCouponCodeInput('');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage(null);
    }
  }, [isOpen, subtotalAmount]);


  const handleApplyCoupon = () => {
    setCouponMessage(null);
    setAppliedCoupon(null);
    setDiscountAmount(0);

    if (!couponCodeInput.trim()) {
      setCouponMessage("Por favor, insira um código de cupom.");
      return;
    }

    const couponToApply = availableCoupons.find(
      c => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase()
    );

    if (!couponToApply) {
      setCouponMessage("Cupom inválido ou não encontrado.");
      return;
    }

    if (!couponToApply.isActive) {
      setCouponMessage("Este cupom não está ativo no momento.");
      return;
    }

    if (couponToApply.expiryDate) {
      const today = new Date().toISOString().split('T')[0];
      if (couponToApply.expiryDate < today) {
        setCouponMessage("Este cupom expirou.");
        return;
      }
    }

    if (couponToApply.minOrderValue && subtotalAmount < couponToApply.minOrderValue) {
      setCouponMessage(`Este cupom requer um pedido mínimo de R$ ${couponToApply.minOrderValue.toFixed(2).replace('.', ',')}.`);
      return;
    }

    let calculatedDiscount = 0;
    if (couponToApply.discountType === 'percentage') {
      calculatedDiscount = (subtotalAmount * couponToApply.value) / 100;
    } else { // fixed
      calculatedDiscount = couponToApply.value;
    }
    
    // Ensure discount does not exceed subtotal
    calculatedDiscount = Math.min(calculatedDiscount, subtotalAmount);


    setAppliedCoupon(couponToApply);
    setDiscountAmount(calculatedDiscount);
    setCouponMessage(`Cupom "${couponToApply.code}" aplicado com sucesso!`);
  };

  const handleRemoveCoupon = () => {
    setCouponCodeInput('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage("Cupom removido.");
  };


  const handleSendOrder = () => {
    setFormError(null);
    if (selectedItems.length === 0) {
      setFormError("Seu carrinho está vazio. Adicione itens antes de enviar.");
      return;
    }
    if (!customerName.trim()) {
      setFormError("Por favor, informe seu nome.");
      return;
    }
    if (!deliveryAddress.trim()) {
      setFormError("Por favor, informe o endereço de entrega.");
      return;
    }
    if (!selectedPaymentMethodId) {
      setFormError("Por favor, selecione uma forma de pagamento.");
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId);

    let message = `Olá, Big Pastel da Bel! Gostaria de fazer o seguinte pedido:\n\n`;
    message += `*Cliente:* ${customerName.trim()}\n`;
    message += `*Endereço para Entrega:*\n${deliveryAddress.trim()}\n\n`;
    message += "*Itens do Pedido:*\n";
    selectedItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')} cada)\n`;
    });
    
    message += `\n*Subtotal:* R$ ${subtotalAmount.toFixed(2).replace('.', ',')}\n`;
    
    if (appliedCoupon && discountAmount > 0) {
      message += `*Cupom Aplicado:* ${appliedCoupon.code} (-R$ ${discountAmount.toFixed(2).replace('.', ',')})\n`;
    }

    message += `*Total do Pedido:* R$ ${finalTotalAmount.toFixed(2).replace('.', ',')}\n`;
    message += `*Forma de Pagamento:* ${selectedPaymentMethod?.name || 'Não informada'}\n\n`;
    message += `Aguardo a confirmação e o tempo estimado para entrega. Obrigado!`;

    const whatsappUrl = `https://wa.me/${restaurantWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    onOrderSent(); 
    setCustomerName('');
    setDeliveryAddress('');
    setSelectedPaymentMethodId(null);
    // Coupon state is reset by useEffect when modal re-opens
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-2 sm:p-4 transition-opacity duration-300 ease-in-out font-sans"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-order-modal-title"
    >
      <div 
        className="bg-cardBg rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-200">
          <h2 id="whatsapp-order-modal-title" className="text-xl sm:text-2xl font-semibold text-slate-800">Revisar e Enviar Pedido</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-vibrantOrange transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto flex-grow space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Itens Selecionados:</h3>
            {selectedItems.length === 0 ? (
              <p className="text-itemDescriptionText italic">Nenhum item selecionado. Volte ao cardápio!</p>
            ) : (
              <div className="space-y-3 max-h-40 sm:max-h-48 overflow-y-auto pr-2"> {/* Adjusted max-h */}
                {selectedItems.map(item => (
                  <div key={item.cartItemId} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0 text-sm">
                    <div>
                      <h4 className="font-medium text-slate-700">{item.name}</h4>
                      <p className="text-xs text-slate-500">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center border border-slate-300 rounded-md mr-2">
                        <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)} className="px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-l-md" aria-label={`Diminuir ${item.name}`}>-</button>
                        <span className="px-2 py-1.5 text-slate-700 text-xs min-w-[24px] text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-r-md" aria-label={`Aumentar ${item.name}`}>+</button>
                      </div>
                      <button onClick={() => onRemoveItem(item.cartItemId)} className="text-red-500 hover:text-red-700 p-1" aria-label={`Remover ${item.name}`}><TrashIcon className="text-xs"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-slate-600">Subtotal:</p>
                        <p className="text-sm text-slate-600">R$ {subtotalAmount.toFixed(2).replace('.', ',')}</p>
                    </div>
                    {appliedCoupon && discountAmount > 0 && (
                         <div className="flex justify-between items-center text-green-600 mb-1">
                            <p className="text-sm">Desconto ({appliedCoupon.code}):</p>
                            <p className="text-sm">- R$ {discountAmount.toFixed(2).replace('.', ',')}</p>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-md font-semibold text-slate-700">Total do Pedido:</p>
                        <p className="text-lg font-bold text-vibrantOrange">R$ {finalTotalAmount.toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
            )}
          </div>
          
          {/* Coupon Section */}
          {selectedItems.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Cupom de Desconto</h3>
                <div className="flex items-stretch space-x-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <TagIcon className="text-slate-400" />
                        </div>
                        <input 
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="CÓDIGO DO CUPOM"
                            className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700 uppercase"
                            aria-label="Código do Cupom"
                            disabled={!!appliedCoupon}
                        />
                    </div>
                    {!appliedCoupon ? (
                        <button 
                            onClick={handleApplyCoupon}
                            className="bg-primary hover:bg-primaryHover text-brandText font-semibold py-2 px-4 rounded-lg shadow-sm text-sm whitespace-nowrap"
                        >
                            Aplicar
                        </button>
                    ) : (
                        <button 
                            onClick={handleRemoveCoupon}
                            className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-sm whitespace-nowrap"
                        >
                            Remover
                        </button>
                    )}
                </div>
                {couponMessage && (
                    <p className={`text-xs mt-2 ${appliedCoupon && discountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {couponMessage}
                    </p>
                )}
            </div>
          )}


          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Seus Dados:</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-itemDescriptionText mb-1">Nome Completo <span className="text-red-500">*</span></label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        id="customerName" 
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" 
                        placeholder="Seu nome para o pedido"
                        required
                    />
                </div>
              </div>
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-itemDescriptionText mb-1">Endereço Completo para Entrega <span className="text-red-500">*</span></label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 top-0 pt-2.5 flex items-start pointer-events-none">
                        <AddressIcon className="text-slate-400" />
                    </div>
                    <textarea 
                        id="deliveryAddress" 
                        value={deliveryAddress} 
                        onChange={e => setDeliveryAddress(e.target.value)} 
                        rows={3}
                        className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" 
                        placeholder="Ex: Rua das Palmeiras, 123, Bairro Sol Nascente, Apt 4B, Perto do mercado X."
                        required
                    />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Forma de Pagamento: <span className="text-red-500">*</span></h3>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethodId(method.id)}
                  className={`w-full flex items-center p-3 border rounded-lg transition-all duration-200 ease-in-out text-sm focus:outline-none focus:ring-2
                    ${selectedPaymentMethodId === method.id 
                      ? 'border-vibrantOrange bg-orange-50 ring-vibrantOrange ring-opacity-50 shadow-sm' 
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                  role="radio"
                  aria-checked={selectedPaymentMethodId === method.id}
                >
                  {method.icon && <span className={`text-lg ${selectedPaymentMethodId === method.id ? 'text-vibrantOrange' : 'text-slate-600'}`}>{method.icon}</span>}
                  <div className="ml-2 text-left">
                      <span className={`font-medium ${selectedPaymentMethodId === method.id ? 'text-vibrantOrange' : 'text-slate-700'}`}>{method.name}</span>
                      {method.description && <p className={`text-xs ${selectedPaymentMethodId === method.id ? 'text-orange-600 opacity-90' : 'text-slate-500'}`}>{method.description}</p>}
                  </div>
                  {selectedPaymentMethodId === method.id && (
                      <span className="ml-auto text-vibrantOrange"><i className="fas fa-check-circle text-md"></i></span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {formError && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">{formError}</p>
          )}

        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleSendOrder}
            disabled={selectedItems.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-md flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="mr-2 text-lg"/> Enviar Pedido via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViaWhatsAppModal;
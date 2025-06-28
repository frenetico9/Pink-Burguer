
import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '../types';
import { CloseIcon, TrashIcon, UserIcon, AddressIcon, WhatsAppIcon } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  paymentMethods: PaymentMethod[];
  restaurantWhatsAppNumber: string;
  onOrderSent: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  paymentMethods,
  restaurantWhatsAppNumber,
  onOrderSent
}) => {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSendOrder = () => {
    setFormError(null);
    if (cartItems.length === 0) {
      setFormError("Seu carrinho está vazio.");
      return;
    }
    if (!customerName.trim() || !deliveryAddress.trim() || !selectedPaymentMethodId) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId);
    
    const itemsList = cartItems.map(item => {
      const finalItemName = item.sauce ? `${item.name} (Molho: ${item.sauce})` : item.name;
      const itemTotalPrice = (item.price * item.quantity).toFixed(2).replace('.', ',');
      return `- ${item.quantity}x ${finalItemName} - *R$ ${itemTotalPrice}*`;
    }).join('\n');

    const message = `*NOVO PEDIDO - PINK BURGUER*

*Cliente:*
${customerName.trim()}

*Endereço para Entrega:*
${deliveryAddress.trim()}

-----------------------------------

*ITENS DO PEDIDO:*
${itemsList}

-----------------------------------

*VALOR TOTAL:*
*R$ ${totalAmount.toFixed(2).replace('.', ',')}*

*Forma de Pagamento:*
${selectedPaymentMethod?.name || 'Não informada'}

-----------------------------------

_Pedido feito pelo cardápio digital. Aguardando confirmação!_`;

    const whatsappUrl = `https://wa.me/${restaurantWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    onOrderSent();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-background">
          <h2 className="text-2xl font-display text-primary tracking-wider">Seu Pedido</h2>
          <button onClick={onClose} className="text-textSecondary hover:text-primary"><CloseIcon className="text-2xl" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-textSecondary text-center py-8">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex items-center gap-4">
                  <div className="flex-grow">
                    <p className="font-bold text-textPrimary">{item.name}</p>
                    {item.sauce && <p className="text-sm text-textSecondary">Molho: {item.sauce}</p>}
                    <p className="text-accent text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)} className="w-7 h-7 rounded bg-background text-primary">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="w-7 h-7 rounded bg-background text-primary">+</button>
                  </div>
                  <button onClick={() => onRemoveItem(item.cartItemId)} className="text-textSecondary hover:text-red-500"><TrashIcon /></button>
                </div>
              ))}
              <div className="pt-4 border-t border-background flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-accent">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-background">
              <h3 className="text-xl font-bold text-textPrimary">Dados para Entrega</h3>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 text-textSecondary" />
                <input type="text" placeholder="Seu nome" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg p-2.5 pl-10 text-textPrimary focus:ring-primary focus:border-primary" />
              </div>
              <div className="relative">
                <AddressIcon className="absolute left-3 top-3.5 text-textSecondary" />
                <input type="text" placeholder="Seu endereço completo" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg p-2.5 pl-10 text-textPrimary focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-textPrimary mb-2">Pagamento</h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map(method => (
                    <button key={method.id} onClick={() => setSelectedPaymentMethodId(method.id)} className={`p-3 rounded-lg text-left transition-all flex items-center gap-2 ${selectedPaymentMethodId === method.id ? 'bg-primary text-white' : 'bg-background hover:bg-gray-700'}`}>
                      {method.icon} {method.name}
                    </button>
                  ))}
                </div>
              </div>
              {formError && <p className="text-red-400 text-sm text-center">{formError}</p>}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 bg-background mt-auto">
            <button onClick={handleSendOrder} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-all">
              <WhatsAppIcon /> Enviar Pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

import React, { useState } from 'react';
import Footer from './components/Footer';
import MenuList from './components/MenuList';
import FloatingCartButton from './components/FloatingCartButton';
import CartModal from './components/CartModal';
import ItemSelectionModal from './components/ItemSelectionModal';
import HeroSection from './components/HeroSection';
import ReviewsSection from './components/ReviewsSection';
import LocationSection from './components/LocationSection';
import { MENU_ITEMS, RESTAURANT_INFO, PAYMENT_METHODS, REVIEWS } from './constants';
import { MenuItem, CartItem } from './types';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAddedMessage, setShowAddedMessage] = useState<string | null>(null);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
      // We need to check for existing items based on the unique `cartItemId` which includes the trio/single status
      const existingItem = prevItems.find(i => i.cartItemId === itemToAdd.cartItemId);
      if (existingItem) {
        return prevItems.map(i => 
          i.cartItemId === itemToAdd.cartItemId 
          ? { ...i, quantity: i.quantity + itemToAdd.quantity } 
          : i
        );
      }
      return [...prevItems, itemToAdd];
    });
    
    setShowAddedMessage(`${itemToAdd.quantity}x ${itemToAdd.name} adicionado!`);
    setTimeout(() => setShowAddedMessage(null), 2000);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(i => i.cartItemId !== cartItemId));
  };
  
  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(cartItemId);
    } else {
      setCartItems(prevItems => 
        prevItems.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i)
      );
    }
  };
  
  const handleOrderSent = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setShowAddedMessage("Pedido enviado! Finalize no WhatsApp.");
    setTimeout(() => setShowAddedMessage(null), 3000);
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection info={RESTAURANT_INFO} />
        <MenuList items={MENU_ITEMS} onSelectItem={handleSelectItem} />
        <ReviewsSection reviews={REVIEWS} />
        <LocationSection info={RESTAURANT_INFO} />
      </main>
      <Footer info={RESTAURANT_INFO} />

      <FloatingCartButton itemCount={totalCartItems} onClick={() => setIsCartOpen(true)} />

      <ItemSelectionModal
        isOpen={isItemModalOpen}
        onClose={handleCloseItemModal}
        item={selectedItem}
        onAddToCart={handleAddToCart}
      />
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        paymentMethods={PAYMENT_METHODS}
        restaurantWhatsAppNumber={RESTAURANT_INFO.contact.whatsapp}
        onOrderSent={handleOrderSent}
      />

      {showAddedMessage && (
        <div className="fixed bottom-24 right-6 bg-accent text-background px-5 py-2.5 rounded-lg shadow-xl z-[100] text-center font-semibold animate-fade-in">
          {showAddedMessage}
        </div>
      )}
    </div>
  );
};

export default App;
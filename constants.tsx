import React from 'react';
import { RestaurantInfo, MenuItem, PaymentMethod, Coupon, ItemType, Review } from './types';

// --- ÍCONES ---
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fab fa-whatsapp ${className || ''}`}></i>;
export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fab fa-instagram ${className || ''}`}></i>;
export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-credit-card ${className || ''}`}></i>;
export const PixIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fab fa-pix ${className || ''}`}></i>; 
export const MoneyBillIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-money-bill-wave ${className || ''}`}></i>;
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-times ${className || ''}`}></i>;
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-trash-alt ${className || ''}`}></i>;
export const UserIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-user ${className || ''}`}></i>;
export const AddressIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-map-marker-alt ${className || ''}`}></i>;
export const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-shopping-cart ${className || ''}`}></i>;
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-star ${className || ''}`}></i>;


// Added Icons to fix errors
export const TagIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-tag ${className || ''}`}></i>;
export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-info-circle ${className || ''}`}></i>;
export const ToggleOnIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-toggle-on ${className || ''}`}></i>;
export const ToggleOffIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-toggle-off ${className || ''}`}></i>;
export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-plus-circle ${className || ''}`}></i>;
export const EditIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-edit ${className || ''}`}></i>;
export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-calendar-alt ${className || ''}`}></i>;
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-check-circle ${className || ''}`}></i>;
export const BanIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-ban ${className || ''}`}></i>;
export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-save ${className || ''}`}></i>;
export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-envelope ${className || ''}`}></i>;
export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-key ${className || ''}`}></i>;
export const GiftIcon: React.FC<{ className?: string }> = ({ className }) => <i className={`fas fa-gift ${className || ''}`}></i>;


// --- CONSTANTS ---
export const IMGUR_PLACEHOLDER = "https://i.imgur.com/A8CoP9k.png"; // Generic placeholder
export const HERO_IMAGE_URL = "https://i.imgur.com/UOtiGDX.png";


// --- INFORMAÇÕES DO RESTAURANTE ---
export const RESTAURANT_INFO: RestaurantInfo = {
  name: "PINK BURGUER",
  tagline: "Escolha seu burguer",
  logoUrl: "https://i.imgur.com/yHJtRkq.png",
  address: "Quadra 21 Conjunto B, lote 44, Paranoá-DF",
  deliveryLink: "#",
  contact: {
    whatsapp: "5561985153017",
    ifoodLink: "https://www.ifood.com.br/" 
  },
  socialMedia: {
    instagram: "https://www.instagram.com/pinkburguer.kc",
  },
};

// --- ITENS DO MENU ---
const burgersCategory = 'Hambúrgueres';
const itemTypeEspecial: ItemType = 'Especial';
const itemTypeTradicional: ItemType = 'Tradicional';

export const CONST_INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "maestro",
    name: "MAESTRO",
    description: "Pão brioche, blend 120G, queijo prato e molho alho ou especial.",
    price: 14.90,
    trioPrice: 24.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeTradicional,
  },
  {
    id: "vinski",
    name: "VINSKI",
    description: "Pão brioche, blend 120G, queijo cheddar, alface e tomate, molho alho ou especial.",
    price: 18.90,
    trioPrice: 28.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeTradicional,
  },
  {
    id: "premium",
    name: "PREMIUM",
    description: "Pão australiano, blend 120G, fatias de queijo cheddar, cebola caramelizada, molho alho ou especial.",
    price: 19.90,
    trioPrice: 29.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeEspecial,
  },
  {
    id: "prime",
    name: "PRIME",
    description: "Pão prime, filé de frango, queijo prato, alface e tomate, cebola roxa, molho alho ou especial.",
    price: 17.90,
    trioPrice: 27.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeEspecial,
  },
  {
    id: "pink",
    name: "PINK",
    description: "Pão pink, dois blends de 120G, queijo cheddar, cebola caramelizada, picles, bacon, molho alho ou especial.",
    price: 21.90,
    trioPrice: 31.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeEspecial,
  },
  {
    id: "choripan",
    name: "CHORIPAN",
    description: "Pão francês, linguiça de frango apimentada, queijo provolone, vinagrete, molho alho ou especial.",
    price: 23.90,
    trioPrice: 33.90,
    imageUrl: HERO_IMAGE_URL,
    isAvailable: true,
    category: burgersCategory,
    itemType: itemTypeEspecial,
  },
];

export const CONST_AVAILABLE_BORDAS: MenuItem[] = []; // No bordas defined in the menu yet

export const MENU_ITEMS: MenuItem[] = [...CONST_INITIAL_MENU_ITEMS, ...CONST_AVAILABLE_BORDAS];

// --- AVALIAÇÕES FAKES ---
export const REVIEWS: Review[] = [
    { id: '1', name: 'Mariana Silva', rating: 5, comment: 'O hambúrguer "Pink" é simplesmente de outro mundo! A combinação do pão pink com o bacon crocante é perfeita. Virei fã!' },
    { id: '2', name: 'João Oliveira', rating: 5, comment: 'Atendimento rápido e o lanche chegou quentinho. O "Premium" com cebola caramelizada é meu novo vício. Recomendo demais!' },
    { id: '3', name: 'Sofia Costa', rating: 5, comment: 'Melhor hambúrguer que já comi no DF! O "Maestro" é simples, mas o sabor é espetacular. O molho especial faz toda a diferença.' },
    { id: '4', name: 'Rafael Pereira', rating: 5, comment: 'Pedi o trio "Vinski" e valeu cada centavo. Batata frita sequinha e o hambúrguer super suculento. Qualidade nota 1000!' },
    { id: '5', name: 'Laura Rodrigues', rating: 5, comment: 'Que surpresa deliciosa o "Choripan"! Linguiça no ponto certo, queijo derretendo... uma obra de arte. Com certeza pedirei de novo.' },
    { id: '6', name: 'Gustavo Almeida', rating: 5, comment: 'Sou chato com hambúrguer, mas o de vocês me ganhou. Ingredientes frescos e de alta qualidade. O "Prime" de frango é leve e saboroso.' },
    { id: '7', name: 'Gabriela Fernandes', rating: 5, comment: 'Nossa, que delícia! Esse hambúrguer é bom demais! Aprovadíssimo! O pão pink é um charme e o sabor é divino.' },
    { id: '8', name: 'Felipe Martins', rating: 5, comment: 'Finalmente uma hamburgueria que capricha no bacon! O "Pink" é generoso e delicioso. Estão de parabéns pelo capricho.' },
    { id: '9', name: 'Beatriz Lima', rating: 5, comment: 'Amei a proposta e o sabor. O combo trio compensa muito e mata a fome. Já indiquei pra todos os meus amigos.' },
    { id: '10', name: 'Enzo Gomes', rating: 5, comment: 'Excelente! O "Premium" é o meu preferido, sabor incrível!' },
];


// --- CUPONS ---
export const CONST_AVAILABLE_COUPONS: Coupon[] = [
    {
        id: 'cupom-inicial-123',
        code: 'BEMVINDO10',
        description: '10% de desconto no seu primeiro pedido!',
        discountType: 'percentage',
        value: 10,
        isActive: true,
        minOrderValue: 30,
    },
    {
        id: 'cupom-fixo-456',
        code: '5OFF',
        description: 'R$ 5,00 de desconto.',
        discountType: 'fixed',
        value: 5,
        isActive: true,
        expiryDate: '2029-12-31',
        minOrderValue: 25,
    }
];

// --- MÉTODOS DE PAGAMENTO ---
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'credit_card', name: 'Cartão de Crédito', icon: <CreditCardIcon /> },
  { id: 'debit_card', name: 'Cartão de Débito', icon: <CreditCardIcon /> },
  { id: 'pix', name: 'PIX', icon: <PixIcon /> },
  { id: 'cash', name: 'Dinheiro', icon: <MoneyBillIcon />, description: 'Pagamento na entrega' },
];
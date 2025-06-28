
import React, { useState, useEffect } from 'react';
// Corrected import paths from `api/admin/`
import { MenuItem, Coupon } from '../../types';
import { CloseIcon, TagIcon, InfoIcon, ToggleOnIcon, ToggleOffIcon, PlusCircleIcon, EditIcon, TrashIcon, CalendarIcon, CheckCircleIcon, BanIcon, SaveIcon } from '../../constants'; // Adicionado SaveIcon

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  coupons: Coupon[];
  onToggleItemAvailability: (itemId: string) => void;
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<boolean>; // Mantém Promise para feedback local
  onUpdateCoupon: (coupon: Coupon) => Promise<boolean>; // Mantém Promise para feedback local
  onToggleCouponActivity: (couponId: string) => void;
  onSaveChangesToServer: () => Promise<{success: boolean, message: string}>; // Nova prop
}

type AdminPanelView = 'items' | 'coupons';

interface ServerSaveStatus {
  message: string;
  type: 'success' | 'error' | 'info';
}

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  coupons,
  onToggleItemAvailability,
  onAddCoupon,
  onUpdateCoupon,
  onToggleCouponActivity,
  onSaveChangesToServer, // Nova prop
}) => {
  const [activeView, setActiveView] = useState<AdminPanelView>('items');
  
  const [isCouponFormVisible, setIsCouponFormVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number | ''>('');
  const [couponExpiryDate, setCouponExpiryDate] = useState('');
  const [couponMinOrderValue, setCouponMinOrderValue] = useState<number | ''>('');
  const [couponIsActive, setCouponIsActive] = useState(true);
  const [couponFormError, setCouponFormError] = useState<string | null>(null);

  const [isSavingToServer, setIsSavingToServer] = useState(false);
  const [serverSaveStatus, setServerSaveStatus] = useState<ServerSaveStatus | null>(null);


  useEffect(() => {
    if (isOpen) {
      setActiveView('items'); 
      resetCouponForm();
      setServerSaveStatus(null); // Limpa status de save ao abrir
      setIsSavingToServer(false);
    }
  }, [isOpen]);

  const resetCouponForm = () => {
    setIsCouponFormVisible(false);
    setEditingCoupon(null);
    setCouponCode('');
    setCouponDescription('');
    setCouponDiscountType('percentage');
    setCouponValue('');
    setCouponExpiryDate('');
    setCouponMinOrderValue('');
    setCouponIsActive(true);
    setCouponFormError(null);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponDescription(coupon.description || '');
    setCouponDiscountType(coupon.discountType);
    setCouponValue(coupon.value);
    setCouponExpiryDate(coupon.expiryDate || '');
    setCouponMinOrderValue(coupon.minOrderValue || '');
    setCouponIsActive(coupon.isActive);
    setIsCouponFormVisible(true);
    setCouponFormError(null);
    setServerSaveStatus(null); // Limpa status ao editar
  };

  const handleCouponFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFormError(null);
    setServerSaveStatus(null);

    if (!couponCode.trim() || couponValue === '' || couponValue <= 0) {
      setCouponFormError('Código do cupom e valor do desconto (maior que zero) são obrigatórios.');
      return;
    }
    if (couponDiscountType === 'percentage' && (couponValue < 1 || couponValue > 100)) {
      setCouponFormError('Desconto percentual deve ser entre 1 e 100.');
      return;
    }

    const couponDetails: Omit<Coupon, 'id'> & { id?: string } = {
      code: couponCode.trim(),
      description: couponDescription.trim() || undefined,
      discountType: couponDiscountType,
      value: Number(couponValue),
      isActive: couponIsActive,
      expiryDate: couponExpiryDate || undefined,
      minOrderValue: couponMinOrderValue !== '' ? Number(couponMinOrderValue) : undefined,
    };

    let successLocally = false;
    if (editingCoupon) {
        successLocally = await onUpdateCoupon({ ...editingCoupon, ...couponDetails });
    } else {
        successLocally = await onAddCoupon(couponDetails as Omit<Coupon, 'id'>);
    }
    
    if (successLocally) {
      resetCouponForm();
      setServerSaveStatus({ message: `Cupom ${editingCoupon ? 'atualizado' : 'adicionado'} localmente. Salve todas as alterações no servidor.`, type: 'info' });
    } else {
      setCouponFormError(`Falha ao ${editingCoupon ? 'atualizar' : 'adicionar'} o cupom localmente. Verifique se o código já existe.`);
    }
  };

  const handleServerSave = async () => {
    setIsSavingToServer(true);
    setServerSaveStatus(null);
    const result = await onSaveChangesToServer();
    setServerSaveStatus({ message: result.message, type: result.success ? 'success' : 'error' });
    setIsSavingToServer(false);
  };

  if (!isOpen) return null;

  const renderItemManagement = () => (
    <div className="space-y-3">
      {menuItems.length === 0 && <p className="text-itemDescriptionText italic">Nenhum item de menu cadastrado.</p>}
      {menuItems.map(item => (
        <div key={item.id} className={`p-3 border rounded-lg flex items-center justify-between transition-all duration-200 ${item.isAvailable ? 'bg-white border-slate-200' : 'bg-slate-100 border-slate-300 opacity-70'}`}>
          <div>
            <h4 className={`font-medium ${item.isAvailable ? 'text-slate-700' : 'text-slate-500'}`}>{item.name}</h4>
            <p className={`text-xs ${item.isAvailable ? 'text-slate-500' : 'text-slate-400'}`}>R$ {item.price.toFixed(2).replace('.', ',')} - Cat: {item.category}</p>
          </div>
          <button
            onClick={() => { onToggleItemAvailability(item.id); setServerSaveStatus(null); }}
            title={item.isAvailable ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
            className={`p-2 rounded-md transition-colors ${item.isAvailable ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
          >
            {item.isAvailable ? <ToggleOnIcon className="text-2xl" /> : <ToggleOffIcon className="text-2xl" />}
          </button>
        </div>
      ))}
    </div>
  );

  const renderCouponManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
            onClick={() => { resetCouponForm(); setIsCouponFormVisible(true); setServerSaveStatus(null); }}
            className="bg-vibrantOrange hover:bg-vibrantOrangeHover text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all text-sm flex items-center"
        >
          <PlusCircleIcon className="mr-2" /> Criar Novo Cupom
        </button>
      </div>

      {isCouponFormVisible && (
        <form onSubmit={handleCouponFormSubmit} className="p-4 border border-primary rounded-lg space-y-4 bg-orange-50 shadow">
          <h4 className="text-lg font-semibold text-brandText">{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</h4>
          {couponFormError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">{couponFormError}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-itemDescriptionText mb-1">Código <span className="text-red-500">*</span></label>
              <input type="text" id="couponCode" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} required className="w-full p-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div>
                <label htmlFor="couponDiscountType" className="block text-sm font-medium text-itemDescriptionText mb-1">Tipo de Desconto <span className="text-red-500">*</span></label>
                <select id="couponDiscountType" value={couponDiscountType} onChange={e => setCouponDiscountType(e.target.value as 'percentage' | 'fixed')} className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option value="percentage">Percentual (%)</option>
                    <option value="fixed">Fixo (R$)</option>
                </select>
            </div>
            <div>
              <label htmlFor="couponValue" className="block text-sm font-medium text-itemDescriptionText mb-1">Valor do Desconto <span className="text-red-500">*</span></label>
              <input type="number" id="couponValue" value={couponValue} onChange={e => setCouponValue(parseFloat(e.target.value) || '')} required min="0.01" step="0.01" className="w-full p-2 border border-slate-300 rounded-md text-sm" />
            </div>
             <div>
              <label htmlFor="couponDescription" className="block text-sm font-medium text-itemDescriptionText mb-1">Descrição (opcional)</label>
              <input type="text" id="couponDescription" value={couponDescription} onChange={e => setCouponDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="Ex: Especial de Fim de Semana"/>
            </div>
            <div>
              <label htmlFor="couponExpiryDate" className="block text-sm font-medium text-itemDescriptionText mb-1">Data de Validade (opcional)</label>
              <input type="date" id="couponExpiryDate" value={couponExpiryDate} onChange={e => setCouponExpiryDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div>
              <label htmlFor="couponMinOrderValue" className="block text-sm font-medium text-itemDescriptionText mb-1">Pedido Mínimo (R$) (opcional)</label>
              <input type="number" id="couponMinOrderValue" value={couponMinOrderValue} onChange={e => setCouponMinOrderValue(parseFloat(e.target.value) || '')} min="0" step="0.01" className="w-full p-2 border border-slate-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
              <input type="checkbox" id="couponIsActive" checked={couponIsActive} onChange={e => setCouponIsActive(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
              <label htmlFor="couponIsActive" className="text-sm font-medium text-itemDescriptionText">Ativar este cupom?</label>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={resetCouponForm} className="text-sm text-slate-600 hover:text-slate-800 py-2 px-3 rounded-md">Cancelar</button>
            <button type="submit" className="bg-primary hover:bg-primaryHover text-brandText font-semibold py-2 px-4 rounded-lg shadow-sm text-sm">
              {editingCoupon ? 'Atualizar Cupom Localmente' : 'Salvar Cupom Localmente'}
            </button>
          </div>
        </form>
      )}

      {!isCouponFormVisible && coupons.length === 0 && (
        <p className="text-itemDescriptionText italic text-center py-4">Nenhum cupom cadastrado. Clique em "Criar Novo Cupom" para adicionar.</p>
      )}
      {!isCouponFormVisible && coupons.length > 0 && (
        <div className="space-y-2 mt-4">
          {coupons.map(coupon => (
            <div key={coupon.id} className={`p-3 border rounded-lg flex items-start justify-between transition-all duration-200 ${coupon.isActive ? 'bg-white border-slate-200' : 'bg-slate-100 border-slate-300 opacity-70'}`}>
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                    <TagIcon className={`mr-2 ${coupon.isActive ? 'text-primary' : 'text-slate-400'}`} />
                    <h4 className={`font-bold text-md ${coupon.isActive ? 'text-brandText' : 'text-slate-500'}`}>{coupon.code}</h4>
                    {!coupon.isActive && <span className="ml-2 text-xs bg-slate-500 text-white px-1.5 py-0.5 rounded-full">Inativo</span>}
                </div>
                <p className={`text-xs ${coupon.isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                  {coupon.description || 
                  `${coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`}`}
                </p>
                {(coupon.expiryDate || coupon.minOrderValue) && (
                    <p className={`text-xs mt-0.5 ${coupon.isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                        {coupon.minOrderValue && `Pedido mín: R$ ${coupon.minOrderValue.toFixed(2)} `}
                        {coupon.expiryDate && <><CalendarIcon className="inline mr-1 opacity-70"/> Expira: {new Date(coupon.expiryDate + 'T00:00:00').toLocaleDateString('pt-BR')}</>}
                    </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-1.5 ml-2">
                <button
                  onClick={() => { onToggleCouponActivity(coupon.id); setServerSaveStatus(null); }}
                  title={coupon.isActive ? 'Desativar Cupom' : 'Ativar Cupom'}
                  className={`p-1.5 rounded-md transition-colors text-xl ${coupon.isActive ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                >
                  {coupon.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </button>
                 <button
                  onClick={() => handleEditCoupon(coupon)}
                  title="Editar Cupom"
                  className={`p-1.5 rounded-md transition-colors text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-sm`}
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[80] p-2 sm:p-4 transition-opacity duration-300 ease-in-out font-sans"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-modal-title"
    >
      <div
        className="bg-lightBg rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-300 bg-slate-700 text-white">
          <h2 id="admin-panel-modal-title" className="text-xl sm:text-2xl font-semibold">Painel Administrativo</h2>
          <button 
            onClick={onClose} 
            className="text-slate-300 hover:text-white transition-colors"
            aria-label="Fechar Painel Administrativo"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>

        <div className="flex border-b border-slate-300">
          <button 
            onClick={() => { setActiveView('items'); setServerSaveStatus(null); }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeView === 'items' ? 'bg-primary text-brandText border-b-2 border-brandText' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Gerenciar Itens do Cardápio
          </button>
          <button 
            onClick={() => { setActiveView('coupons'); setServerSaveStatus(null); }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeView === 'coupons' ? 'bg-primary text-brandText border-b-2 border-brandText' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Gerenciar Cupons de Desconto
          </button>
        </div>
        
        {serverSaveStatus && (
            <div className={`p-3 text-center text-sm font-medium
                ${serverSaveStatus.type === 'success' ? 'bg-green-100 text-green-700' : ''}
                ${serverSaveStatus.type === 'error' ? 'bg-red-100 text-red-700' : ''}
                ${serverSaveStatus.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}
            `}>
                {serverSaveStatus.message}
            </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {activeView === 'items' && renderItemManagement()}
          {activeView === 'coupons' && renderCouponManagement()}
        </div>

         <div className="p-3 bg-slate-100 border-t border-slate-300 flex justify-between items-center">
            <button
                onClick={handleServerSave}
                disabled={isSavingToServer}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-sm flex items-center disabled:opacity-70"
            >
                <SaveIcon className="mr-2"/> {isSavingToServer ? 'Salvando no Servidor...' : 'Salvar Alterações no Servidor'}
            </button>
            <button
                onClick={onClose}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-sm"
            >
                Fechar Painel
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;

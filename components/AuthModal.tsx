
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthView } from '../types';
import { CloseIcon, EnvelopeIcon, KeyIcon, UserIcon } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const { login, register, sendVerificationEmail, verifyEmailCode, currentUser, isLoading, authError, clearAuthError } = useAuth();

  useEffect(() => {
    if (isOpen) {
      clearAuthError(); // Clear previous errors when modal opens
      setView(initialView); // Reset to initial view
      // Reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setVerificationCode('');
    }
  }, [isOpen, initialView, clearAuthError]);

  useEffect(() => {
    if (currentUser && isOpen) {
      onClose(); // Close modal if user becomes authenticated while it's open
    }
  }, [currentUser, isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (!email || !password) {
        // Basic frontend validation, useAuth hooks will set more specific errors
        return; 
    }
    const success = await login(email, password);
    if (success) {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (password !== confirmPassword) {
      // This should ideally be handled by the auth context, but basic client check is fine
      alert("As senhas não coincidem."); // Replace with better error display
      return;
    }
    if (!email || !password) return;

    const verificationEmailSent = await register(email, password);
    if (verificationEmailSent) {
      setView('verifyEmail'); // Switch to verification view
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (!verificationCode) return;
    // Email is already set from the registration step
    const success = await verifyEmailCode(email, verificationCode);
    if (success) {
      onClose();
    }
  };
  
  const handleResendCode = async () => {
    clearAuthError();
    if (!email) {
        // This shouldn't happen if flow is correct, but good to handle
        alert("E-mail não fornecido para reenviar o código.");
        return;
    }
    const code = await sendVerificationEmail(email);
    if (code) {
        alert("Um novo código de verificação foi 'enviado' para seu e-mail.");
    } else {
        // Error will be shown via authError state
    }
  }

  const renderError = () => {
    if (!authError) return null;
    return <p className="text-sm text-red-600 bg-red-100 p-2.5 rounded-md text-center my-3">{authError}</p>;
  }

  const renderSpinner = () => (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vibrantOrange"></div>
    </div>
  );


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4 transition-opacity duration-300 ease-in-out font-sans"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-cardBg rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out relative"
        onClick={e => e.stopPropagation()}
      >
        {isLoading && renderSpinner()}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 id="auth-modal-title" className="text-xl font-semibold text-slate-800">
            {view === 'login' && 'Entrar na sua Conta'}
            {view === 'register' && 'Criar Nova Conta'}
            {view === 'verifyEmail' && 'Verificar seu E-mail'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-vibrantOrange transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {renderError()}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-itemDescriptionText mb-1">E-mail</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="text-slate-400" />
                    </div>
                    <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" placeholder="seu@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-itemDescriptionText mb-1">Senha</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="text-slate-400" />
                    </div>
                    <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" placeholder="Sua senha" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-vibrantOrange hover:bg-vibrantOrangeHover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-md disabled:opacity-70">
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
              <p className="text-sm text-center text-itemDescriptionText">
                Não tem uma conta?{' '}
                <button type="button" onClick={() => setView('register')} className="font-semibold text-vibrantOrange hover:underline">
                  Registre-se
                </button>
              </p>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-itemDescriptionText mb-1">E-mail</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="text-slate-400" />
                    </div>
                    <input type="email" id="register-email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" placeholder="seu@email.com" />
                </div>
              </div>
              <div>
                {/* Removed _GCM prop from label */}
                <label htmlFor="register-password" className="block text-sm font-medium text-itemDescriptionText mb-1">Senha</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="text-slate-400" />
                    </div>
                    <input type="password" id="register-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" placeholder="Crie uma senha forte" />
                </div>
              </div>
              <div>
                {/* Removed _GCM prop from label */}
                <label htmlFor="confirm-password" className="block text-sm font-medium text-itemDescriptionText mb-1">Confirme a Senha</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="text-slate-400" />
                    </div>
                    <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700" placeholder="Confirme sua senha" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-vibrantOrange hover:bg-vibrantOrangeHover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-md disabled:opacity-70">
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
              <p className="text-sm text-center text-itemDescriptionText">
                Já tem uma conta?{' '}
                <button type="button" onClick={() => setView('login')} className="font-semibold text-vibrantOrange hover:underline">
                  Entrar
                </button>
              </p>
            </form>
          )}

          {view === 'verifyEmail' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-sm text-itemDescriptionText text-center">
                Enviamos um código de verificação para <span className="font-semibold text-slate-700">{email}</span>. Por favor, insira o código abaixo.
              </p>
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-itemDescriptionText mb-1">Código de Verificação</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="text-slate-400" /> {/* Using UserIcon as a generic code icon */}
                    </div>
                    <input type="text" id="verification-code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} required maxLength={6} className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-vibrantOrange focus:border-vibrantOrange text-sm text-slate-700 tracking-widest" placeholder="_ _ _ _ _ _" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-vibrantOrange hover:bg-vibrantOrangeHover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-md disabled:opacity-70">
                {isLoading ? 'Verificando...' : 'Verificar e Entrar'}
              </button>
              <p className="text-sm text-center text-itemDescriptionText">
                Não recebeu o código?{' '}
                <button type="button" onClick={handleResendCode} disabled={isLoading} className="font-semibold text-vibrantOrange hover:underline disabled:opacity-70">
                  Reenviar código
                </button>
              </p>
               <p className="text-sm text-center text-itemDescriptionText">
                Ou{' '}
                <button type="button" onClick={() => setView('login')} className="font-semibold text-vibrantOrange hover:underline">
                  voltar para o Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
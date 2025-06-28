
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in a real app, this would be a backend)
const mockAdminUsers: User[] = [
  {
    id: 'admin001',
    email: 'isabelbrasil77@gmail.com',
    role: 'admin',
    isVerified: true,
  },
  {
    id: 'admin002',
    email: 'hiago182016@gmail.com',
    role: 'admin',
    isVerified: true,
  }
];
// Hardcoded passwords for mock admins (in a real app, use hashed passwords and backend validation)
const mockAdminPasswords: Record<string, string> = {
  'isabelbrasil77@gmail.com': 'maisuncao',
  'hiago182016@gmail.com': '180800',
};


let mockCustomerUsers: User[] = []; // In-memory store for registered customers
let mockVerificationCodes: Record<string, string> = {}; // email: code

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Simulate checking for a persisted session (e.g., from localStorage)
  // For this example, we'll just keep it in memory.
  // useEffect(() => { /* ... logic to load user from localStorage ... */ }, []);


  const clearAuthError = () => setAuthError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const adminUser = mockAdminUsers.find(admin => admin.email === email);
    if (adminUser && mockAdminPasswords[email] === password) {
      setCurrentUser(adminUser);
      setIsLoading(false);
      return true;
    }

    const customer = mockCustomerUsers.find(user => user.email === email);
    // In a real app, password would be hashed and compared on the backend.
    // For mock, we'll just assume a generic password 'password123' for registered users.
    if (customer && password === 'password123') {
      if (!customer.isVerified) {
        setAuthError('Sua conta ainda não foi verificada. Por favor, verifique seu e-mail.');
        setIsLoading(false);
        return false;
      }
      setCurrentUser(customer);
      setIsLoading(false);
      return true;
    }

    setAuthError('E-mail ou senha inválidos.');
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mockCustomerUsers.some(user => user.email === email) || mockAdminUsers.some(admin => admin.email === email)) {
      setAuthError('Este e-mail já está registrado.');
      setIsLoading(false);
      return false;
    }
    
    // Don't add to mockCustomerUsers yet, wait for verification.
    // Instead, we "send" a verification email.
    const verificationCodeSent = await sendVerificationEmail(email);
    setIsLoading(false);
    if (verificationCodeSent) {
        // Password is not stored with the user object in this mock.
        // In a real app, you'd hash it and store it upon successful verification.
        return true; // Indicates verification email "sent"
    } else {
        setAuthError('Não foi possível enviar o e-mail de verificação. Tente novamente.');
        return false;
    }
  };

  const sendVerificationEmail = async (email: string): Promise<string | null> => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Check if user already exists and is verified
    const existingUser = mockCustomerUsers.find(u => u.email === email);
    if (existingUser && existingUser.isVerified) {
      setAuthError("Este e-mail já foi verificado e está em uso.");
      setIsLoading(false);
      return null;
    }


    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
    mockVerificationCodes[email] = code;
    console.log(`Mock verification code for ${email}: ${code}`); // Simulate sending email
    
    // In a real scenario, we'd store the pending user details temporarily.
    // For this mock, we'll add them with isVerified: false once the code is verified.

    setIsLoading(false);
    return code; // In a real app, you wouldn't return the code here.
  };

  const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mockVerificationCodes[email] === code) {
      // Check if user already added (e.g. from a previous failed attempt)
      let user = mockCustomerUsers.find(u => u.email === email);
      if (user) {
        user.isVerified = true;
      } else {
         user = {
            id: `cust_${Date.now()}`,
            email,
            role: 'customer' as UserRole,
            isVerified: true,
          };
        mockCustomerUsers.push(user);
      }
      
      setCurrentUser(user);
      delete mockVerificationCodes[email]; // Clean up code
      setIsLoading(false);
      return true;
    }

    setAuthError('Código de verificação inválido.');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    // In a real app, also clear any persisted session info.
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, authError, login, register, logout, sendVerificationEmail, verifyEmailCode, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

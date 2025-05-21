import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../pages/@types/general';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api.lib';

interface AuthContextData {
  usuario: User | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('@Investimentos:token');
    
    if (storedToken) {
      try {
        const decodedToken: any = jwtDecode(storedToken);
        
        if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
          setUsuario(decodedToken);
          axios.defaults.headers['Authorization'] = `Bearer ${storedToken}`;
        } else {
          throw new Error('Token expirado');
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        localStorage.removeItem('@Investimentos:token');
        setUsuario(null);  
      }
    } else {
      setUsuario(null); 
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
  
      const { success, token } = response.data;
      
      if (success && token) {
        localStorage.setItem('@Investimentos:token', token);
      } else {
        throw new Error('Login inválido');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro no login');
    }
  };
  

  const signOut = () => {
    localStorage.removeItem('@Investimentos:usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, signIn, signOut, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 
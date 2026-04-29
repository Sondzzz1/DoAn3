// Context API - Quản lý state toàn cục với API Backend
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, Artwork } from '../types';
import { artworkService } from '../services/artworkService';

interface AppContextType {
  // User state
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  
  // Cart state
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  
  // Artworks state
  artworks: Artwork[];
  setArtworks: React.Dispatch<React.SetStateAction<Artwork[]>>;
  
  // Loading state
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Refresh artworks
  refreshArtworks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }, []);

  // Load artworks từ API khi app khởi động
  const refreshArtworks = async () => {
    setLoading(true);
    try {
      const data = await artworkService.getAllArtworks();
      setArtworks(data);
      console.log('✅ Đã load', data.length, 'tranh từ API');
    } catch (error) {
      console.error('❌ Lỗi khi load tranh từ API:', error);
      // Fallback: Load từ localStorage nếu API lỗi
      const savedArtworks = localStorage.getItem('admin_artworks');
      if (savedArtworks) {
        try {
          setArtworks(JSON.parse(savedArtworks));
          console.log('⚠️ Đã load tranh từ localStorage (fallback)');
        } catch (err) {
          console.error('Error loading artworks from localStorage:', err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArtworks();
  }, []);

  // Load cart khi user thay đổi
  useEffect(() => {
    if (user && user.email) {
      const cartKey = `cart_${user.email}`;
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  const value = {
    user,
    setUser,
    cart,
    setCart,
    artworks,
    setArtworks,
    loading,
    setLoading,
    refreshArtworks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

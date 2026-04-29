// Custom Hook cho Cart Management - Dùng Context API
import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CartItem } from '../types';

export const useCart = () => {
  const { cart, setCart, user } = useAppContext();

  // Lấy cart key theo user
  const getCartKey = useCallback(() => {
    if (user && user.email) {
      return `cart_${user.email}`;
    }
    return null;
  }, [user]);

  // Lưu cart vào localStorage
  const saveCart = useCallback((newCart: CartItem[]) => {
    const cartKey = getCartKey();
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(newCart));
    }
  }, [getCartKey]);

  // Tính tổng số lượng
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Tính tổng tiền
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((item: CartItem) => {
    if (!user) {
      alert('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return false;
    }

    if (user.role === 'admin') {
      alert('⚠️ Tài khoản Admin không thể mua hàng!');
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      let newCart: CartItem[];

      if (existingItem) {
        newCart = prevCart.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newCart = [...prevCart, item];
      }

      saveCart(newCart);
      return newCart;
    });

    return true;
  }, [user, setCart, saveCart]);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((id: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== id);
      saveCart(newCart);
      return newCart;
    });
  }, [setCart, saveCart]);

  // Cập nhật số lượng
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [setCart, saveCart]);

  // Tăng số lượng
  const increaseQuantity = useCallback((id: string) => {
    setCart((prevCart: CartItem[]) => {
      const newCart = prevCart.map((item: CartItem) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [setCart, saveCart]);

  // Giảm số lượng
  const decreaseQuantity = useCallback((id: string) => {
    setCart((prevCart: CartItem[]) => {
      const newCart = prevCart.map((item: CartItem) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [setCart, saveCart]);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCart([]);
    const cartKey = getCartKey();
    if (cartKey) {
      localStorage.removeItem(cartKey);
    }
  }, [setCart, getCartKey]);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
};

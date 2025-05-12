// src/context/CartContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  viewCart as apiViewCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  CartItem,
  CartData,
  AddToCartPayload,
  UpdateCartItemPayload,
  ApiErrorResponse,
} from '@/services/cartService';
import { useAuth } from './AuthContext'; // To only fetch cart if authenticated
import { toast } from 'sonner';

interface CartContextType {
  cart: CartData | null;
  cartItems: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItemToCart: (payload: AddToCartPayload) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (cartItemId: string) => Promise<void>;
  clearEntireCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initially false, true during API calls

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'consumer') {
      setCart(null); // Clear cart if not authenticated or not a consumer
      setIsLoading(false); // Ensure loading is false if we don't fetch
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiViewCart();
      setCart(response.data);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('CartContext: Failed to fetch cart', apiError);
      // toast.error(apiError.message || 'Could not load your cart.');
      setCart(null); // Clear cart on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null); // Clear cart if user logs out
    }
  }, [isAuthenticated, fetchCart]);

  const addItemToCart = async (payload: AddToCartPayload) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart.');
      return;
    }
    setIsLoading(true);
    try {
      await apiAddToCart(payload);
      toast.success('Item added to cart!');
      await fetchCart(); // Refresh cart from backend
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('CartContext: Failed to add item to cart', apiError);
      toast.error(apiError.message || 'Could not add item to cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      // Basic validation, backend should also validate against min/max
      removeItemFromCart(cartItemId); // Or show error: quantity must be at least 1
      return;
    }
    setIsLoading(true);
    try {
      const payload: UpdateCartItemPayload = { quantity };
      await apiUpdateCartItem(cartItemId, payload);
      // toast.success('Cart updated.'); // Optional: can be noisy
      await fetchCart();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('CartContext: Failed to update item quantity', apiError);
      toast.error(apiError.message || 'Could not update cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItemFromCart = async (cartItemId: string) => {
    setIsLoading(true);
    try {
      await apiRemoveFromCart(cartItemId);
      toast.success('Item removed from cart.');
      await fetchCart();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('CartContext: Failed to remove item from cart', apiError);
      toast.error(apiError.message || 'Could not remove item from cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearEntireCart = async () => {
    setIsLoading(true);
    try {
      await apiClearCart();
      toast.success('Cart cleared.');
      await fetchCart(); // Should result in an empty cart
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('CartContext: Failed to clear cart', apiError);
      toast.error(apiError.message || 'Could not clear cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const cartItems = cart?.cart || [];
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  // const cartTotal = cart?.overall_total_price || 0; // Use backend total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.total_item_price,
    0
  ); // Or calculate locally if backend total is problematic

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        isLoading,
        fetchCart,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearEntireCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart Context — Manages shopping cart state.
 *
 * DUAL-MODE CART:
 * - Guests: cart stored in localStorage (no account needed)
 * - Logged-in users: cart stored in the database (persists forever)
 *
 * WHY two modes?
 * We want visitors to start shopping immediately without creating
 * an account. When they do log in, we merge their guest cart into
 * their database cart seamlessly.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';
import { guestCart } from '../utils/helpers';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], item_count: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  /** Show a temporary success/error message. */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /** Load cart from the appropriate source. */
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const data = await cartApi.getCart();
        setCart(data);
      } catch {
        // Fail silently — cart will appear empty
      } finally {
        setLoading(false);
      }
    } else {
      // Load from localStorage for guests
      const items = guestCart.get();
      setCart({
        items: items.map((item) => ({
          ...item,
          id: item.book_id,
          line_total: item.unit_price * item.quantity,
        })),
        item_count: guestCart.getItemCount(),
        subtotal: guestCart.getSubtotal(),
      });
    }
  }, [isAuthenticated]);

  /** Load cart on mount and when auth state changes. */
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /** Add a book to the cart. */
  const addToCart = useCallback(
    async (book, quantity = 1) => {
      try {
        if (isAuthenticated) {
          const data = await cartApi.addItem(book.id, quantity);
          setCart(data);
        } else {
          const items = guestCart.addItem(book, quantity);
          setCart({
            items: items.map((item) => ({
              ...item,
              id: item.book_id,
              line_total: item.unit_price * item.quantity,
            })),
            item_count: guestCart.getItemCount(),
            subtotal: guestCart.getSubtotal(),
          });
        }
        showToast(`"${book.title}" added to cart!`);
      } catch (error) {
        showToast(error.message || 'Failed to add to cart', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  /** Update quantity of a cart item. */
  const updateQuantity = useCallback(
    async (itemId, bookId, quantity) => {
      try {
        if (isAuthenticated) {
          const data = await cartApi.updateItem(itemId, quantity);
          setCart(data);
        } else {
          const items = guestCart.updateQuantity(bookId, quantity);
          setCart({
            items: items.map((item) => ({
              ...item,
              id: item.book_id,
              line_total: item.unit_price * item.quantity,
            })),
            item_count: guestCart.getItemCount(),
            subtotal: guestCart.getSubtotal(),
          });
        }
      } catch (error) {
        showToast(error.message || 'Failed to update cart', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  /** Remove an item from the cart. */
  const removeFromCart = useCallback(
    async (itemId, bookId) => {
      try {
        if (isAuthenticated) {
          const data = await cartApi.removeItem(itemId);
          setCart(data);
        } else {
          const items = guestCart.removeItem(bookId);
          setCart({
            items: items.map((item) => ({
              ...item,
              id: item.book_id,
              line_total: item.unit_price * item.quantity,
            })),
            item_count: guestCart.getItemCount(),
            subtotal: guestCart.getSubtotal(),
          });
        }
        showToast('Item removed from cart');
      } catch (error) {
        showToast(error.message || 'Failed to remove item', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  /** Clear the entire cart (after successful checkout). */
  const clearCart = useCallback(() => {
    guestCart.clear();
    setCart({ items: [], item_count: 0, subtotal: 0 });
  }, []);

  const value = {
    cart,
    loading,
    toast,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

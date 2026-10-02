/**
 * Auth Context — Manages authentication state across the app.
 *
 * CONTEXT PATTERN (Like You're 5):
 * Imagine a school announcement speaker. When the principal makes
 * an announcement, EVERY classroom hears it. React Context is like
 * that speaker — when the auth state changes (login/logout), every
 * component that cares about it gets updated automatically.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, cartApi } from '../services/api';
import { guestCart } from '../utils/helpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Check if user is already logged in (stored token). */
  useEffect(() => {
    const token = localStorage.getItem('mirabooks_token');
    if (token) {
      authApi
        .getCurrentUser()
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('mirabooks_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /** Handle Google OAuth login. */
  const loginWithGoogle = useCallback(async (credential) => {
    const data = await authApi.googleLogin(credential);
    localStorage.setItem('mirabooks_token', data.token);
    setUser(data.user);

    // Sync guest cart to database after login
    const guestItems = guestCart.get();
    if (guestItems.length > 0) {
      try {
        await cartApi.syncGuestCart(
          guestItems.map((item) => ({
            book_id: item.book_id,
            quantity: item.quantity,
          }))
        );
        guestCart.clear();
      } catch {
        // Non-critical: guest cart sync can fail silently
      }
    }

    return data.user;
  }, []);

  /** Handle logout. */
  const logout = useCallback(() => {
    localStorage.removeItem('mirabooks_token');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

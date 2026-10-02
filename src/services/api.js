/**
 * API Service — Central place for all backend API calls.
 *
 * WHY one file for all API calls? (Like You're 5)
 * Instead of every page making its own phone call to the server,
 * we have ONE phone. If we need to change the phone number (URL)
 * or add a secret password (auth token), we do it in one place.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mirabooks-be.onrender.com';

/**
 * Make an authenticated API request.
 * Automatically attaches the JWT token if available.
 */
import { MOCK_BOOKS, MOCK_CATEGORIES } from './mockData';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('mirabooks_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || 'Something went wrong');
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// --- Auth API ---

export const authApi = {
  googleLogin: (credential) =>
    apiFetch('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  getCurrentUser: () => apiFetch('/api/auth/me'),

  logout: () =>
    apiFetch('/api/auth/logout', { method: 'POST' }),
};

// --- Books API ---

export const booksApi = {
  getBooks: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return apiFetch(`/api/books${query ? `?${query}` : ''}`);
  },

  getBookBySlug: (slug) => apiFetch(`/api/books/${slug}`),

  getFeaturedBooks: () => apiFetch('/api/books/featured'),

  getBestsellers: () => apiFetch('/api/books/bestsellers'),

  getNewArrivals: () => apiFetch('/api/books/new-arrivals'),

  searchBooks: (query, page = 1) =>
    apiFetch(`/api/books/search?q=${encodeURIComponent(query)}&page=${page}`),
};

// --- Categories API ---

export const categoriesApi = {
  getAll: () => apiFetch('/api/categories'),

  getBooksByCategory: (slug, params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiFetch(
      `/api/categories/${slug}/books${query ? `?${query}` : ''}`
    );
  },
};

// --- Cart API ---

export const cartApi = {
  getCart: () => apiFetch('/api/cart'),

  addItem: (bookId, quantity = 1) =>
    apiFetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, quantity }),
    }),

  updateItem: (itemId, quantity) =>
    apiFetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId) =>
    apiFetch(`/api/cart/items/${itemId}`, { method: 'DELETE' }),

  syncGuestCart: (items) =>
    apiFetch('/api/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

// --- Checkout & Orders API ---

export const ordersApi = {
  checkout: (shippingAddress, shippingMethod) =>
    apiFetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        shipping_address: shippingAddress,
        shipping_method: shippingMethod,
      }),
    }),

  verifyPayment: (reference) =>
    apiFetch(`/api/payments/verify?reference=${reference}`),

  getOrders: () => apiFetch('/api/orders'),

  getOrderById: (orderId) => apiFetch(`/api/orders/${orderId}`),
};

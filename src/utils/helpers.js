/**
 * Utility functions used across the app.
 */

/**
 * Format a number as Nigerian Naira currency.
 * Example: formatPrice(4500) → "₦4,500.00"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return '₦0.00';
  return `₦${Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate a URL-friendly slug from a string.
 * Example: slugify("Clean Code") → "clean-code"
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a maximum length with ellipsis.
 * Example: truncate("A very long description...", 50)
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * Get the display price (discount or regular).
 */
export function getDisplayPrice(book) {
  return book.discount_price || book.price;
}

/**
 * Check if a book is on sale (has a discount price).
 */
export function isOnSale(book) {
  return book.discount_price && book.discount_price < book.price;
}

/**
 * Calculate discount percentage.
 * Example: 5000 regular, 4000 discount → "20% OFF"
 */
export function getDiscountPercent(book) {
  if (!isOnSale(book)) return 0;
  const percent = Math.round(
    ((book.price - book.discount_price) / book.price) * 100
  );
  return percent;
}

/**
 * Guest cart helpers — localStorage for non-logged-in users.
 */
const GUEST_CART_KEY = 'mirabooks_guest_cart';

export const guestCart = {
  get() {
    try {
      const data = localStorage.getItem(GUEST_CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  },

  addItem(book, quantity = 1) {
    const items = this.get();
    const existing = items.find((item) => item.book_id === book.id);

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        book.stock_quantity
      );
    } else {
      items.push({
        book_id: book.id,
        title: book.title,
        cover_image_url: book.cover_image_url,
        unit_price: book.discount_price || book.price,
        quantity,
        stock_quantity: book.stock_quantity,
      });
    }

    this.save(items);
    return items;
  },

  updateQuantity(bookId, quantity) {
    const items = this.get();
    const item = items.find((i) => i.book_id === bookId);
    if (item) {
      if (quantity <= 0) {
        return this.removeItem(bookId);
      }
      item.quantity = quantity;
    }
    this.save(items);
    return items;
  },

  removeItem(bookId) {
    const items = this.get().filter((i) => i.book_id !== bookId);
    this.save(items);
    return items;
  },

  clear() {
    localStorage.removeItem(GUEST_CART_KEY);
  },

  getItemCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.get().reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
  },
};

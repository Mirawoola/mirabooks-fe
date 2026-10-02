/**
 * CartPage — Shopping cart with item management.
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (cart.items.length === 0) {
    return (
      <main className="container cart-page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-text">
            Looks like you haven&apos;t added any books yet. Start exploring!
          </p>
          <Link to="/books" className="btn btn-primary btn-lg">
            Browse Books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page" id="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item card" key={item.id || item.book_id}>
              <div className="cart-item-image">
                <img
                  src={item.cover_image_url || '/placeholder-book.png'}
                  alt={item.title}
                />
              </div>
              <div className="cart-item-info">
                <h3 className="cart-item-title">
                  <Link to={`/books/${item.slug || ''}`}>{item.title}</Link>
                </h3>
                <p className="cart-item-price price">
                  {formatPrice(item.unit_price)}
                </p>
              </div>
              <div className="cart-item-quantity">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.book_id, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.book_id, item.quantity + 1)
                    }
                    disabled={item.quantity >= (item.stock_quantity || 99)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                <span className="price price-current">
                  {formatPrice(item.line_total || item.unit_price * item.quantity)}
                </span>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id, item.book_id)}
                aria-label={`Remove ${item.title}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="cart-summary card" id="cart-summary">
          <h3 className="cart-summary-title">Order Summary</h3>
          <div className="cart-summary-row">
            <span>Subtotal ({cart.item_count} items)</span>
            <span className="price">{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span className="cart-shipping-estimate">Calculated at checkout</span>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-row cart-summary-total">
            <span>Estimated Total</span>
            <span className="price price-current">{formatPrice(cart.subtotal)}</span>
          </div>

          {isAuthenticated ? (
            <Link to="/checkout" className="btn btn-accent btn-lg cart-checkout-btn">
              Proceed to Checkout →
            </Link>
          ) : (
            <Link to="/login?redirect=/checkout" className="btn btn-accent btn-lg cart-checkout-btn">
              Sign In to Checkout →
            </Link>
          )}

          <Link to="/books" className="cart-continue-shopping">
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

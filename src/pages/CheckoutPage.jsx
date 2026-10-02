/**
 * CheckoutPage — Collects shipping address and initializes Paystack payment.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import { formatPrice } from '../utils/helpers';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = shippingMethod === 'standard' ? 1500 : shippingMethod === 'express' ? 3500 : 0;
  const total = cart.subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Submit checkout to our backend
      const result = await ordersApi.checkout(
        { ...formData, country: 'Nigeria' },
        shippingMethod
      );

      // 2. Redirect to Paystack payment page
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cartLoading) return <div className="loading-spinner" />;
  if (cart.items.length === 0) {
    return (
      <div className="container empty-state">
        <h2 className="empty-state-title">Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/books')}>
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <main className="container checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      
      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-layout">
        {/* Checkout Form */}
        <form className="checkout-form card" onSubmit={handleSubmit}>
          <h2 className="checkout-section-title">Shipping Information</h2>
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="input"
                required
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              className="input"
              required
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="input"
                required
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                className="input"
                required
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="postal_code">Postal Code (Optional)</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                className="input"
                value={formData.postal_code}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <h2 className="checkout-section-title" style={{ marginTop: 'var(--space-6)' }}>Shipping Method</h2>
          
          <div className="shipping-methods">
            <label className={`shipping-method ${shippingMethod === 'standard' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="shipping_method"
                value="standard"
                checked={shippingMethod === 'standard'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <div className="shipping-method-info">
                <strong>Standard Delivery (5-7 days)</strong>
                <span>{formatPrice(1500)}</span>
              </div>
            </label>

            <label className={`shipping-method ${shippingMethod === 'express' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="shipping_method"
                value="express"
                checked={shippingMethod === 'express'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <div className="shipping-method-info">
                <strong>Express Delivery (1-2 days)</strong>
                <span>{formatPrice(3500)}</span>
              </div>
            </label>

            <label className={`shipping-method ${shippingMethod === 'pickup' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="shipping_method"
                value="pickup"
                checked={shippingMethod === 'pickup'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <div className="shipping-method-info">
                <strong>Store Pickup (Free)</strong>
                <span>{formatPrice(0)}</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg checkout-submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="checkout-summary card">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-summary-items">
            {cart.items.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div className="summary-item-title">
                  <span>{item.quantity}x</span> {item.title}
                </div>
                <div className="summary-item-price">
                  {formatPrice(item.line_total)}
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="price-current">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

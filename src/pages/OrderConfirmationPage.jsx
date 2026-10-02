/**
 * OrderConfirmationPage — Shows the result after Paystack payment.
 */

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // To avoid duplicate verification calls in strict mode
  const verifiedRef = useRef(false);

  useEffect(() => {
    const reference = searchParams.get('reference');
    // For manual navigation testing without payment
    const orderId = searchParams.get('order_id');

    if (!reference && !orderId) {
      navigate('/');
      return;
    }

    async function verifyAndLoad() {
      if (verifiedRef.current) return;
      verifiedRef.current = true;
      
      try {
        setLoading(true);
        if (reference) {
          // Verify payment with backend
          const result = await ordersApi.verifyPayment(reference);
          setOrder(result.order);
          if (result.status === 'success') {
            clearCart();
          }
        } else if (orderId) {
          // Just load order by ID
          const orderData = await ordersApi.getOrderById(orderId);
          setOrder(orderData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [searchParams, navigate, clearCart]);

  if (loading) {
    return (
      <div className="container loading-state">
        <div className="loading-spinner" />
        <p>Verifying your payment...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h2 className="empty-state-title">Verification Failed</h2>
          <p className="empty-state-text">{error || 'Could not find order details.'}</p>
          <Link to="/contact" className="btn btn-outline">Contact Support</Link>
        </div>
      </div>
    );
  }

  const isSuccess = order.status === 'paid' || order.status === 'processing';

  return (
    <main className="container order-confirmation">
      <div className="confirmation-card card">
        <div className="confirmation-header">
          <div className={`status-icon ${isSuccess ? 'success' : 'failed'}`}>
            {isSuccess ? '✅' : '⚠️'}
          </div>
          <h1 className="confirmation-title">
            {isSuccess ? 'Payment Successful!' : 'Payment Pending/Failed'}
          </h1>
          <p className="confirmation-subtitle">
            {isSuccess
              ? 'Thank you for your purchase. We are processing your order.'
              : 'There was an issue with your payment. Please check your email or contact support.'}
          </p>
        </div>

        <div className="order-details-grid">
          <div className="detail-group">
            <span className="detail-label">Order Number</span>
            <span className="detail-value">#{order.id.split('-')[0].toUpperCase()}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Date</span>
            <span className="detail-value">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Payment Status</span>
            <span className={`badge badge-${isSuccess ? 'success' : 'warning'}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Total Amount</span>
            <span className="detail-value price-current">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="order-items-list">
            <h3 className="items-list-title">Items Ordered</h3>
            {order.items.map(item => (
              <div key={item.id} className="order-item-row">
                <div className="item-row-title">
                  {item.quantity}x {item.book?.title || 'Book'}
                </div>
                <div className="item-row-price">
                  {formatPrice(item.unit_price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/books" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-outline">
            View All Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Header Component — Site navigation with logo, search, cart, and login.
 *
 * Appears on every page. Shows:
 * - Mirabooks logo
 * - Search bar
 * - Cart icon with item count badge
 * - Login/avatar button
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header" id="site-header">
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="header-logo" id="header-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Mirabooks</span>
        </Link>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch} id="search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search books, authors, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
            aria-label="Search books"
          />
        </form>

        {/* Actions */}
        <nav className="header-actions">
          {/* Cart */}
          <Link to="/cart" className="header-cart" id="cart-link" aria-label="Shopping cart">
            <span className="cart-icon">🛒</span>
            {cart.item_count > 0 && (
              <span className="cart-badge" id="cart-badge">
                {cart.item_count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="header-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-button"
                aria-label="User menu"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || 'User'}
                    className="avatar-img"
                  />
                ) : (
                  <span className="avatar-placeholder">
                    {(user?.full_name || 'U')[0].toUpperCase()}
                  </span>
                )}
              </button>

              {showUserMenu && (
                <div className="user-dropdown" id="user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user?.full_name || 'User'}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <Link
                    to="/orders"
                    className="user-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    📦 My Orders
                  </Link>
                  <button
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-button">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/**
 * BookDetailPage — Full details for a single book.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksApi } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  formatPrice,
  getDisplayPrice,
  isOnSale,
  getDiscountPercent,
} from '../utils/helpers';
import './BookDetailPage.css';

export default function BookDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      try {
        const data = await booksApi.getBookBySlug(slug);
        setBook(data);
      } catch (error) {
        console.error('Failed to load book:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <h2 className="empty-state-title">Book Not Found</h2>
          <p className="empty-state-text">
            The book you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = book.stock_quantity <= 0;
  const authors = book.authors || [];

  const handleAddToCart = () => {
    if (!outOfStock) {
      const bookSummary = {
        id: book.id,
        title: book.title,
        slug: book.slug,
        price: book.price,
        discount_price: book.discount_price,
        cover_image_url: book.cover_image_url,
        stock_quantity: book.stock_quantity,
      };
      addToCart(bookSummary, quantity);
    }
  };

  return (
    <main className="book-detail container" id="book-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/books">Books</Link>
        {book.category && (
          <>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/books?category=${book.category.slug}`}>
              {book.category.name}
            </Link>
          </>
        )}
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{book.title}</span>
      </nav>

      <div className="book-detail-layout">
        {/* Cover Image */}
        <div className="book-detail-image">
          {isOnSale(book) && (
            <span className="badge badge-accent book-detail-badge">
              {getDiscountPercent(book)}% OFF
            </span>
          )}
          <img
            src={book.cover_image_url || '/placeholder-book.png'}
            alt={`Cover of ${book.title}`}
            className="book-detail-cover"
          />
        </div>

        {/* Book Info */}
        <div className="book-detail-info">
          <h1 className="book-detail-title">{book.title}</h1>

          {authors.length > 0 && (
            <p className="book-detail-author">
              by{' '}
              {authors.map((a) => (typeof a === 'string' ? a : a.name)).join(', ')}
            </p>
          )}

          {/* Price */}
          <div className="book-detail-price-block">
            <span className="price book-detail-current-price">
              {formatPrice(getDisplayPrice(book))}
            </span>
            {isOnSale(book) && (
              <span className="price price-original">
                {formatPrice(book.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="book-detail-stock">
            {outOfStock ? (
              <span className="badge badge-error">Out of Stock</span>
            ) : book.stock_quantity <= 5 ? (
              <span className="badge badge-warning">
                Only {book.stock_quantity} left!
              </span>
            ) : (
              <span className="badge badge-success">In Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {!outOfStock && (
            <div className="book-detail-actions">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() =>
                    setQuantity(Math.min(book.stock_quantity, quantity + 1))
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-accent btn-lg book-detail-add-btn"
                onClick={handleAddToCart}
                id="add-to-cart-button"
              >
                🛒 Add to Cart
              </button>
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="book-detail-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="book-detail-meta">
            <h3>Book Details</h3>
            <table className="meta-table">
              <tbody>
                {book.publisher && (
                  <tr>
                    <td className="meta-label">Publisher</td>
                    <td>{book.publisher}</td>
                  </tr>
                )}
                {book.publication_date && (
                  <tr>
                    <td className="meta-label">Published</td>
                    <td>{new Date(book.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                )}
                {book.isbn && (
                  <tr>
                    <td className="meta-label">ISBN</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{book.isbn}</td>
                  </tr>
                )}
                {book.pages && (
                  <tr>
                    <td className="meta-label">Pages</td>
                    <td>{book.pages}</td>
                  </tr>
                )}
                <tr>
                  <td className="meta-label">Language</td>
                  <td>{book.language || 'English'}</td>
                </tr>
                <tr>
                  <td className="meta-label">Format</td>
                  <td>{book.format || 'Paperback'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

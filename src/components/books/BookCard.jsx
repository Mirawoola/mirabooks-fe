/**
 * BookCard Component — Displays a book in the grid.
 *
 * This is the most reused component in the app. It shows:
 * - Cover image
 * - Title, author(s)
 * - Price (with discount if applicable)
 * - "Add to cart" button
 * - Sale badge if discounted
 *
 * COMPONENT COMPOSITION (Like You're 5):
 * This is one LEGO piece. We snap many of these together to
 * build the book grid on the homepage, category page, and search.
 */

import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  formatPrice,
  getDisplayPrice,
  isOnSale,
  getDiscountPercent,
  truncate,
} from '../../utils/helpers';
import './BookCard.css';

export default function BookCard({ book }) {
  const { addToCart } = useCart();

  const outOfStock = book.stock_quantity <= 0;
  const authorNames = Array.isArray(book.authors)
    ? book.authors.join(', ')
    : '';

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    if (!outOfStock) {
      addToCart(book, 1);
    }
  };

  return (
    <Link
      to={`/books/${book.slug}`}
      className="book-card card"
      id={`book-card-${book.slug}`}
    >
      {/* Sale Badge */}
      {isOnSale(book) && (
        <span className="book-card-badge badge badge-accent">
          {getDiscountPercent(book)}% OFF
        </span>
      )}

      {/* Cover Image */}
      <div className="book-card-image">
        <img
          src={book.cover_image_url || '/placeholder-book.png'}
          alt={`Cover of ${book.title}`}
          loading="lazy"
        />
        {outOfStock && (
          <div className="book-card-overlay">
            <span className="badge badge-error">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="book-card-info">
        <h3 className="book-card-title">{truncate(book.title, 45)}</h3>
        {authorNames && (
          <p className="book-card-author">{truncate(authorNames, 30)}</p>
        )}

        {/* Price */}
        <div className="book-card-price">
          <span className="price price-current">
            {formatPrice(getDisplayPrice(book))}
          </span>
          {isOnSale(book) && (
            <span className="price price-original">
              {formatPrice(book.price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className={`btn btn-primary book-card-btn ${outOfStock ? 'btn-disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={`Add ${book.title} to cart`}
        >
          {outOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </Link>
  );
}

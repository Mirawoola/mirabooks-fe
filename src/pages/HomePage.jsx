/**
 * Homepage — The main landing page of Mirabooks.
 *
 * Shows:
 * 1. Hero banner with call-to-action
 * 2. Category shortcuts
 * 3. Featured books section
 * 4. Bestsellers section
 * 5. New Arrivals section
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksApi, categoriesApi } from '../services/api';
import BookCard from '../components/books/BookCard';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featuredRes, bestsellersRes, newArrivalsRes, categoriesRes] =
          await Promise.all([
            booksApi.getFeaturedBooks(),
            booksApi.getBestsellers(),
            booksApi.getNewArrivals(),
            categoriesApi.getAll(),
          ]);

        setFeatured(featuredRes.items || []);
        setBestsellers(bestsellersRes.items || []);
        setNewArrivals(newArrivalsRes.items || []);
        setCategories(categoriesRes.items || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <main className="homepage" id="homepage">
      {/* Hero Banner */}
      <section className="hero" id="hero-banner">
        <div className="hero-inner container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your Next
              <span className="hero-highlight"> Favorite Book</span>
            </h1>
            <p className="hero-subtitle">
              Browse thousands of books from bestselling authors. From African
              literature to science and technology — find the stories that
              inspire you.
            </p>
            <div className="hero-actions">
              <Link to="/books" className="btn btn-accent btn-lg">
                Browse Collection →
              </Link>
              <Link to="/books?category=african-literature" className="btn btn-outline btn-lg">
                African Literature
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-book-stack">
              <div className="hero-book hero-book-1">📖</div>
              <div className="hero-book hero-book-2">📚</div>
              <div className="hero-book hero-book-3">📕</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      {categories.length > 0 && (
        <section className="section" id="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <div className="category-grid">
              {categories.map((cat) => (
                <Link
                  to={`/books?category=${cat.slug}`}
                  className="category-card"
                  key={cat.id}
                  id={`category-${cat.slug}`}
                >
                  <div className="category-card-img">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      loading="lazy"
                    />
                  </div>
                  <span className="category-card-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books */}
      {featured.length > 0 && (
        <section className="section" id="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">✨ Featured Books</h2>
              <Link to="/books?featured=true" className="section-link">
                View All →
              </Link>
            </div>
            <div className="book-grid">
              {featured.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="section section-alt" id="bestsellers-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Bestsellers</h2>
              <Link to="/books?sort_by=popularity" className="section-link">
                View All →
              </Link>
            </div>
            <div className="book-grid">
              {bestsellers.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section" id="new-arrivals-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🆕 New Arrivals</h2>
              <Link to="/books?sort_by=newest" className="section-link">
                View All →
              </Link>
            </div>
            <div className="book-grid">
              {newArrivals.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="promo-banner" id="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h2 className="promo-title">📧 Stay Updated</h2>
            <p className="promo-text">
              Get notified about new arrivals, special offers, and reading
              recommendations.
            </p>
            <div className="promo-form">
              <input
                type="email"
                className="input promo-input"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
              />
              <button className="btn btn-accent">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

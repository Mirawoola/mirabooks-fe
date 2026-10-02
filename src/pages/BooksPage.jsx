/**
 * BooksPage — Category/listing page with filters and sorting.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { booksApi, categoriesApi } from '../services/api';
import BookCard from '../components/books/BookCard';
import './BooksPage.css';

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort_by') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    categoriesApi.getAll().then((data) => setCategories(data.items || []));
  }, []);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: 12,
          sort_by: currentSort,
        };
        if (currentCategory) params.category = currentCategory;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (searchQuery) params.search = searchQuery;

        const data = await booksApi.getBooks(params);
        setBooks(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [currentCategory, currentSort, currentPage, minPrice, maxPrice, searchQuery]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const selectedCategoryName = categories.find(
    (c) => c.slug === currentCategory
  )?.name;

  return (
    <main className="books-page container" id="books-page">
      {/* Page Header */}
      <div className="books-page-header">
        <h1 className="books-page-title">
          {selectedCategoryName || 'All Books'}
        </h1>
        <p className="books-page-count">{total} books found</p>
      </div>

      <div className="books-page-layout">
        {/* Sidebar Filters */}
        <aside className="books-sidebar" id="books-sidebar">
          {/* Categories */}
          <div className="filter-group">
            <h3 className="filter-title">Categories</h3>
            <ul className="filter-list">
              <li>
                <button
                  className={`filter-btn ${!currentCategory ? 'active' : ''}`}
                  onClick={() => updateFilter('category', '')}
                >
                  All Books
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`filter-btn ${currentCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat.slug)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h3 className="filter-title">Price Range</h3>
            <div className="filter-price-inputs">
              <input
                type="number"
                className="input filter-price-input"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilter('min_price', e.target.value)}
                aria-label="Minimum price"
              />
              <span className="filter-price-sep">—</span>
              <input
                type="number"
                className="input filter-price-input"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilter('max_price', e.target.value)}
                aria-label="Maximum price"
              />
            </div>
          </div>
        </aside>

        {/* Book Grid */}
        <div className="books-content">
          {/* Sort Bar */}
          <div className="books-sort-bar">
            <label htmlFor="sort-select" className="books-sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              className="input books-sort-select"
              value={currentSort}
              onChange={(e) => updateFilter('sort_by', e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : books.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No books found</h3>
              <p className="empty-state-text">
                Try adjusting your filters or search for something else.
              </p>
              <Link to="/books" className="btn btn-primary">
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="book-grid">{books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}</div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" id="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage <= 1}
                    onClick={() => updateFilter('page', String(currentPage - 1))}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => updateFilter('page', String(currentPage + 1))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

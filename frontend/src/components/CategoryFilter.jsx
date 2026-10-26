import React from 'react';

export default function CategoryFilter({
  categories = [],
  activeFilter = 'all',
  onFilterChange,
  needsReviewCount = 0,
  totalCount = 0,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-pills">
        {/* All Transactions Pill */}
        <button
          type="button"
          className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All Transactions
          <span className="filter-badge mono-num">{totalCount}</span>
        </button>

        {/* Needs Review Pill */}
        <button
          type="button"
          className={`filter-pill pill-review ${activeFilter === 'needs_review' ? 'active' : ''}`}
          onClick={() => onFilterChange('needs_review')}
        >
          <span>Needs Review</span>
          <span
            className="filter-badge mono-num"
            style={{
              background: activeFilter === 'needs_review' ? 'rgba(255,255,255,0.3)' : 'var(--accent-review-bg)',
              color: activeFilter === 'needs_review' ? '#fff' : 'var(--accent-review)',
            }}
          >
            {needsReviewCount}
          </span>
        </button>

        {/* Specific Active Categories */}
        {categories.map((catName) => (
          <button
            key={catName}
            type="button"
            className={`filter-pill ${activeFilter === catName ? 'active' : ''}`}
            onClick={() => onFilterChange(catName)}
          >
            {catName}
          </button>
        ))}
      </div>
    </div>
  );
}

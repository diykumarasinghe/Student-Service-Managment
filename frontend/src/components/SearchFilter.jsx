import React, { useState } from 'react';
import InlineFieldError from './InlineFieldError';
import { validateSearch } from '../utils/validation';
import { filterSearchKeyDown, sanitizeSearchInput } from '../utils/inputFilters';

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  placeholder = 'Search by keyword...',
  showFilters = false,
}) => {
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    const sanitized = sanitizeSearchInput(rawVal);
    const err = validateSearch(rawVal);
    setError(err);
    onSearchChange(sanitized);
  };

  return (
    <div className="card shadow-sm mb-4 border-0 rounded-3">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          <div className={showFilters ? 'col-md-6' : 'col-12'}>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className={`form-control border-start-0 bg-light ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                value={searchTerm}
                onKeyDown={filterSearchKeyDown}
                onChange={handleInputChange}
              />
            </div>
            <InlineFieldError message={error} />
          </div>

          {showFilters && (
            <>
              <div className="col-md-3 col-sm-6">
                <select
                  className="form-select bg-light"
                  value={selectedCategory || ''}
                  onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat} value={cat.id || cat}>
                      {cat.name || cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 col-sm-6">
                <select
                  className="form-select bg-light"
                  value={selectedStatus || ''}
                  onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;


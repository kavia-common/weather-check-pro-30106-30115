import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar
 * A debounced search input with submit button. Calls onSearch(query) when
 * user presses Enter or clicks the button. Debounce is used for internal value,
 * but we only trigger search on explicit action.
 */
export function SearchBar({ initialValue = '', placeholder = 'Search city', onSearch }) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const debouncedSet = useCallback((next) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setValue(next), 120);
  }, []);

  const handleChange = (e) => {
    debouncedSet(e.target.value);
  };

  const triggerSearch = useCallback(() => {
    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  }, [onSearch, value]);

  const onKeyDown = useMemo(
    () => (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    },
    [triggerSearch]
  );

  return (
    <div className="searchbar" role="search">
      <span className="icon" aria-hidden>🔎</span>
      <input
        aria-label="Search city"
        type="text"
        defaultValue={initialValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <button className="btn" onClick={triggerSearch} aria-label="Search">
        Search
      </button>
    </div>
  );
}

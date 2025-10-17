import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './styles/theme.css';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastList } from './components/ForecastList';
import { getWeatherBundle, isApiConfigured } from './services/weatherApi';
import { demoBundle } from './utils/demoData';

/**
 * PUBLIC_INTERFACE
 * App
 * A modern weather application UI that allows searching by city,
 * displays current conditions and a 5-day forecast. It automatically
 * falls back to a demo mode if the API key is missing or requests fail.
 */
export default function App() {
  const [query, setQuery] = useState('San Francisco');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bundle, setBundle] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const apiConfigured = useMemo(() => isApiConfigured(), []);

  useEffect(() => {
    // Initial load with default city
    handleSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  async function handleSearch(nextQuery) {
    const q = (nextQuery || '').trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError('');
    try {
      if (!apiConfigured) {
        // No API configured: show demo data
        setBundle(demoBundle(q));
        setDemoMode(true);
      } else {
        const data = await getWeatherBundle(q);
        setBundle(data);
        setDemoMode(false);
      }
    } catch (e) {
      // On failure, gracefully fallback to demo data with notice
      setBundle(demoBundle(q));
      setDemoMode(true);
      setError('We could not fetch live data. Showing demo data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      {/* Demo banner */}
      {demoMode && (
        <div className="banner banner-warning" role="status" aria-live="polite">
          Using demo data. Configure an API key to enable live weather.
          See README or set VITE_OPENWEATHER_API_KEY or REACT_APP_OPENWEATHER_API_KEY.
        </div>
      )}

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <div className="brand">
            <span className="brand-icon">☁️</span>
            <span className="brand-text">Weather Check Pro</span>
          </div>
        </div>
        <div className="nav-center">
          <SearchBar
            initialValue={query}
            placeholder="Search city (e.g., Paris, Tokyo)"
            onSearch={handleSearch}
          />
        </div>
        <div className="nav-right">
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
            title="Powered by OpenWeather"
          >
            OpenWeather
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {loading && (
          <div className="state state-loading">Loading weather...</div>
        )}
        {error && (
          <div className="state state-error" role="alert">
            {error}
          </div>
        )}
        {!loading && bundle && (
          <>
            <WeatherCard current={bundle.current} location={bundle.location} />
            <ForecastList days={bundle.forecast} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} Weather Check Pro</span>
          <span className="dot">•</span>
          <span>
            Data: {demoMode ? 'Demo dataset' : 'OpenWeatherMap (live)'}
          </span>
        </div>
      </footer>
    </div>
  );
}

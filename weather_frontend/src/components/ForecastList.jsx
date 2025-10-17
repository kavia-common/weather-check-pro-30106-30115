import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ForecastList
 * Renders a 5-day forecast grid with day names, icons, and min/max temps.
 */
export function ForecastList({ days = [] }) {
  if (!days?.length) return null;

  return (
    <section className="card" aria-label="5-day forecast">
      <div className="card-header">
        <div className="card-title">5-Day Forecast</div>
        <div className="card-subtitle">Daily outlook</div>
      </div>
      <div className="card-body">
        <div className="forecast">
          {days.map((d) => (
            <div className="forecast-item" key={d.day}>
              <div className="day">{d.day}</div>
              <img className="icon-img" src={d.icon} alt={d.description} />
              <div className="range">
                {Math.round(d.min)}°C / <strong>{Math.round(d.max)}°C</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

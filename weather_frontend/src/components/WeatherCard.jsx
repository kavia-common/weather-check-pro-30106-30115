import React from 'react';
import { InfoStat } from './InfoStat';

/**
 * PUBLIC_INTERFACE
 * WeatherCard
 * Displays the current weather: city, country, temp, feels-like,
 * condition description, icon, humidity, and wind speed.
 */
export function WeatherCard({ current, location }) {
  if (!current || !location) return null;
  const { temp, feels_like, humidity, wind_speed, description, icon } = current;
  const { name, country } = location;

  return (
    <section className="card" aria-label="Current weather">
      <div className="card-header">
        <div>
          <div className="card-title">{name}</div>
          <div className="card-subtitle">{country}</div>
        </div>
        <div className="card-subtitle">Current conditions</div>
      </div>

      <div className="card-body">
        <div className="weather-row">
          <div>
            <div className="temp-display">{Math.round(temp)}°C</div>
            <div className="description">{description}</div>
          </div>

          <div>
            <img
              className="icon-img"
              src={icon}
              alt={description}
              width="56"
              height="56"
            />
          </div>

          <div className="metrics">
            <InfoStat icon="🤝" label="Feels like" value={`${Math.round(feels_like)}°C`} />
            <InfoStat icon="💧" label="Humidity" value={`${Math.round(humidity)}%`} />
            <InfoStat icon="💨" label="Wind" value={`${Math.round(wind_speed)} m/s`} />
          </div>
        </div>
      </div>
    </section>
  );
}

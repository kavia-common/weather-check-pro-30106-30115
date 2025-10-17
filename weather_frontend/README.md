# Weather Check Pro (Frontend)

A modern React UI to check current weather and a 5-day forecast using the Ocean Professional style.

## Features

- Search for a city to view current temperature, conditions, humidity, wind, and feels-like
- 5-day forecast with day names, min/max temperatures, and weather icons
- Graceful demo mode when API key is missing or a request fails
- Responsive design with a modern, clean aesthetic
- Service layer using OpenWeatherMap (metric units)

## Quick Start

1) Install dependencies:
   npm install

2) Configure environment:
   - Copy .env.example to .env and set one of:
     - VITE_OPENWEATHER_API_KEY (for Vite builds)
     - REACT_APP_OPENWEATHER_API_KEY (for Create React App)
   - If no key is set, the app will run in Demo Mode with a banner.

3) Start development server:
   npm start

4) Build for production:
   npm run build

## Environment Variables

Provide at least one of the following:
- VITE_OPENWEATHER_API_KEY
- REACT_APP_OPENWEATHER_API_KEY

If both are set, VITE_OPENWEATHER_API_KEY takes precedence.

See .env.example for details.

## Demo Mode

If an API key is missing or a request fails, the app uses a deterministic demo dataset and shows a top banner explaining how to configure the API key.

## Styling

The app follows the Ocean Professional palette:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

Theme variables and component styles live in:
- src/styles/theme.css

## Project Structure

- src/App.jsx: UI composition and state
- src/components/SearchBar.jsx: Debounced search input
- src/components/WeatherCard.jsx: Current conditions card
- src/components/ForecastList.jsx: 5-day forecast grid
- src/components/InfoStat.jsx: Metric pill
- src/services/weatherApi.js: OpenWeather service and configuration detection
- src/utils/demoData.js: Demo fallback data

## Notes

- API: https://api.openweathermap.org/data/2.5
- Units: metric
- Icons: https://openweathermap.org/img/wn/{icon}@2x.png

## Scripts

- npm start - start dev server
- npm test - run tests
- npm run build - build for production
- npm run eject - CRA eject


/**
 * PUBLIC_INTERFACE
 * getWeatherBundle
 * Fetches current weather and 5-day forecast from OpenWeatherMap (metric units).
 * Falls back to demo data at the caller if errors are thrown.
 *
 * PUBLIC_INTERFACE
 * isApiConfigured
 * Detects whether an API key is configured via environment variables.
 */

const API_BASE = 'https://api.openweathermap.org/data/2.5';

function getEnv(key, fallback = '') {
  // Support both CRA (process.env.REACT_APP_*) and Vite (import.meta.env.VITE_*)
  // Avoid direct reference to `import` identifier to satisfy CRA/ESLint parser.
  let viteEnv;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('try { return (typeof import !== "undefined" && typeof import.meta !== "undefined") ? import.meta.env : undefined; } catch (e) { return undefined; }');
    viteEnv = fn();
  } catch {
    viteEnv = undefined;
  }
  if (viteEnv && Object.prototype.hasOwnProperty.call(viteEnv, key)) {
    return viteEnv[key] ?? fallback;
  }
  if (typeof process !== 'undefined' && process.env && Object.prototype.hasOwnProperty.call(process.env, key)) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

export function isApiConfigured() {
  const k1 = getEnv('VITE_OPENWEATHER_API_KEY', '');
  const k2 = getEnv('REACT_APP_OPENWEATHER_API_KEY', '');
  return Boolean((k1 || k2).trim());
}

function getApiKey() {
  const k1 = getEnv('VITE_OPENWEATHER_API_KEY', '').trim();
  const k2 = getEnv('REACT_APP_OPENWEATHER_API_KEY', '').trim();
  return k1 || k2;
}

function buildIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function dayNameFromTs(ts, timezoneOffsetSeconds = 0) {
  // Convert to local time of the city using timezone offset if present
  const localMs = (ts + timezoneOffsetSeconds) * 1000;
  const d = new Date(localMs);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

function kelvinToCelsius(k) {
  return k - 273.15;
}

function parseCurrent(raw) {
  return {
    temp: raw.main?.temp,
    feels_like: raw.main?.feels_like,
    humidity: raw.main?.humidity,
    wind_speed: raw.wind?.speed,
    description: raw.weather?.[0]?.description ?? 'N/A',
    icon: buildIconUrl(raw.weather?.[0]?.icon ?? '01d'),
  };
}

function summarizeDailyFrom3hList(list, timezoneOffsetSeconds = 0) {
  // Group items by day, then compute min/max and pick a representative icon (midday or first)
  const days = {};
  list.forEach((entry) => {
    const day = dayNameFromTs(entry.dt, timezoneOffsetSeconds);
    const temp = entry.main?.temp;
    if (typeof temp !== 'number') return;
    if (!days[day]) {
      days[day] = {
        min: temp,
        max: temp,
        icon: entry.weather?.[0]?.icon,
        description: entry.weather?.[0]?.description,
      };
    } else {
      days[day].min = Math.min(days[day].min, temp);
      days[day].max = Math.max(days[day].max, temp);
      // Prefer icon at noon (~12:00), fallback to previous
      const hour = new Date((entry.dt + timezoneOffsetSeconds) * 1000).getUTCHours();
      if (hour === 12) {
        days[day].icon = entry.weather?.[0]?.icon;
        days[day].description = entry.weather?.[0]?.description;
      }
    }
  });

  return Object.entries(days)
    .slice(0, 5)
    .map(([day, info]) => ({
      day,
      min: info.min,
      max: info.max,
      icon: buildIconUrl(info.icon ?? '01d'),
      description: info.description ?? 'N/A',
    }));
}

// PUBLIC_INTERFACE
export async function getWeatherBundle(cityQuery) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  // Use metric units directly from API to avoid conversions
  const params = new URLSearchParams({
    q: cityQuery,
    appid: apiKey,
    units: 'metric',
  });

  const currentUrl = `${API_BASE}/weather?${params.toString()}`;

  const currentRes = await fetch(currentUrl);
  if (!currentRes.ok) {
    const text = await currentRes.text().catch(() => '');
    throw new Error(`Current weather fetch failed: ${currentRes.status} ${text}`);
  }
  const currentJson = await currentRes.json();

  // For forecast API, use the same city and units
  const forecastParams = new URLSearchParams({
    q: cityQuery,
    appid: apiKey,
    units: 'metric',
  });
  const forecastUrl = `${API_BASE}/forecast?${forecastParams.toString()}`;
  const forecastRes = await fetch(forecastUrl);
  if (!forecastRes.ok) {
    const text = await forecastRes.text().catch(() => '');
    throw new Error(`Forecast fetch failed: ${forecastRes.status} ${text}`);
  }
  const forecastJson = await forecastRes.json();

  const current = parseCurrent(currentJson);
  const location = {
    name: currentJson.name,
    country: currentJson.sys?.country ?? '',
  };

  const tzOffset = forecastJson.city?.timezone ?? 0;
  const forecast = summarizeDailyFrom3hList(forecastJson.list ?? [], tzOffset);

  return { current, location, forecast };
}

/**
 * PUBLIC_INTERFACE
 * demoBundle
 * Returns a deterministic but friendly demo weather bundle for a given query.
 */
export function demoBundle(query = 'Sample City') {
  const base = seedFrom(query);
  const temp = 16 + (base % 9); // 16..24
  const feels = temp - 1;
  const humidity = 55 + (base % 30);
  const wind = 2 + (base % 5);

  const icons = ['01d', '02d', '03d', '10d', '13d'];
  const descs = ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'snow'];
  const pick = base % icons.length;

  const current = {
    temp,
    feels_like: feels,
    humidity,
    wind_speed: wind,
    description: descs[pick],
    icon: `https://openweathermap.org/img/wn/${icons[pick]}@2x.png`,
  };

  const dayNames = rotateDays(base);
  const forecast = dayNames.slice(0, 5).map((day, i) => {
    const min = Math.max(2, temp - (4 + (i % 3)));
    const max = min + 6 + (i % 4);
    const idx = (pick + i) % icons.length;
    return {
      day,
      min,
      max,
      icon: `https://openweathermap.org/img/wn/${icons[idx]}@2x.png`,
      description: descs[idx],
    };
  });

  return {
    current,
    location: { name: prettifyQuery(query), country: 'Demo' },
    forecast,
  };
}

function seedFrom(str) {
  let s = 0;
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) & 0xffffffff;
  return Math.abs(s);
}

function rotateDays(offset) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const start = offset % 7;
  return [...days.slice(start), ...days.slice(0, start)];
}

function prettifyQuery(q) {
  return (q || 'Sample City')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

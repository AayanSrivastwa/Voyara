const axios = require('axios');

const CURATED_DESTINATIONS = [
  {
    id: 'dest_1',
    name: 'Manali',
    country: 'India',
    category: 'Mountains',
    coordinates: { lat: 32.2432, lon: 77.1892 },
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    description: 'Snow-capped Himalayan valleys, pine forests, Solang adventure slopes, and Old Manali cafés.',
    weatherCondition: 'Clear',
    temp: 14,
    humidity: 48,
    windSpeed: 3.2,
    precipitationProb: 10,
    nearbyPlaces: [
      { id: 'p1', name: 'Solang Valley', category: 'Adventure', address: 'Solang, Himachal Pradesh', distance: '12 km', coordinates: { lat: 32.3167, lon: 77.1578 }, color: '#38BDF8' },
      { id: 'p2', name: 'Hadimba Devi Temple', category: 'Heritage', address: 'Dhungri, Manali', distance: '2.1 km', coordinates: { lat: 32.2483, lon: 77.1705 }, color: '#4ADE80' },
      { id: 'p3', name: 'Cafe 1947', category: 'Food', address: 'Old Manali', distance: '1.8 km', coordinates: { lat: 32.2575, lon: 77.1775 }, color: '#FBBF24' },
      { id: 'p4', name: 'The Himalayan Resort', category: 'Accommodation', address: 'Hadimba Road, Manali', distance: '1.2 km', coordinates: { lat: 32.2490, lon: 77.1780 }, color: '#A78BFA' }
    ]
  },
  {
    id: 'dest_2',
    name: 'Goa',
    country: 'India',
    category: 'Beaches',
    coordinates: { lat: 15.4909, lon: 73.8278 },
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
    description: 'Sun-drenched coastline, Portuguese-era forts, Latin Quarter lanes, and vibrant beach shacks.',
    weatherCondition: 'Clear',
    temp: 30,
    humidity: 72,
    windSpeed: 4.5,
    precipitationProb: 15,
    nearbyPlaces: [
      { id: 'p5', name: 'Fort Aguada', category: 'Heritage', address: 'Sinquerim, North Goa', distance: '8.5 km', coordinates: { lat: 15.4925, lon: 73.7736 }, color: '#4ADE80' },
      { id: 'p6', name: 'Artjuna Garden Cafe', category: 'Food', address: 'Anjuna, Goa', distance: '14 km', coordinates: { lat: 15.5812, lon: 73.7441 }, color: '#FBBF24' },
      { id: 'p7', name: 'Basilica of Bom Jesus', category: 'Heritage', address: 'Old Goa', distance: '9.2 km', coordinates: { lat: 15.5009, lon: 73.9116 }, color: '#4ADE80' },
      { id: 'p8', name: 'Taj Fort Aguada', category: 'Accommodation', address: 'Sinquerim Beach', distance: '8.8 km', coordinates: { lat: 15.4956, lon: 73.7675 }, color: '#A78BFA' }
    ]
  },
  {
    id: 'dest_3',
    name: 'Jaipur',
    country: 'India',
    category: 'Heritage',
    coordinates: { lat: 26.9124, lon: 75.7873 },
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    description: 'The Pink City of royal palaces, Amer Fort, bustling bazaars, and Rajasthani hospitality.',
    weatherCondition: 'Clear',
    temp: 25,
    humidity: 38,
    windSpeed: 2.8,
    precipitationProb: 5,
    nearbyPlaces: [
      { id: 'p9', name: 'Hawa Mahal', category: 'Heritage', address: 'Badi Choupad, Jaipur', distance: '3.2 km', coordinates: { lat: 26.9239, lon: 75.8267 }, color: '#4ADE80' },
      { id: 'p10', name: 'Amer Fort', category: 'Heritage', address: 'Devisinghpura, Amer', distance: '11 km', coordinates: { lat: 26.9855, lon: 75.8513 }, color: '#4ADE80' },
      { id: 'p11', name: 'Tapri Central', category: 'Food', address: 'C-Scheme, Jaipur', distance: '1.5 km', coordinates: { lat: 26.9048, lon: 75.7955 }, color: '#FBBF24' }
    ]
  },
  {
    id: 'dest_4',
    name: 'Leh-Ladakh',
    country: 'India',
    category: 'Adventure',
    coordinates: { lat: 34.1526, lon: 77.5771 },
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
    description: 'High-altitude Himalayan passes, crystal-clear Pangong Lake, and ancient Buddhist monasteries.',
    weatherCondition: 'Clouds',
    temp: 7,
    humidity: 32,
    windSpeed: 5.5,
    precipitationProb: 20,
    nearbyPlaces: [
      { id: 'p12', name: 'Shanti Stupa', category: 'Heritage', address: 'Chanspa, Leh', distance: '2.6 km', coordinates: { lat: 34.1732, lon: 77.5750 }, color: '#4ADE80' },
      { id: 'p13', name: 'Leh Royal Palace', category: 'Heritage', address: 'Old Town, Leh', distance: '1.4 km', coordinates: { lat: 34.1658, lon: 77.5867 }, color: '#4ADE80' }
    ]
  },
  {
    id: 'dest_5',
    name: 'Munnar',
    country: 'India',
    category: 'Nature',
    coordinates: { lat: 10.0889, lon: 77.0595 },
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    description: 'Emerald tea plantations, misty Western Ghats peaks, and serene backwater trails.',
    weatherCondition: 'Rain',
    temp: 18,
    humidity: 84,
    windSpeed: 3.6,
    precipitationProb: 75,
    nearbyPlaces: [
      { id: 'p14', name: 'Eravikulam National Park', category: 'Nature', address: 'Munnar, Kerala', distance: '13 km', coordinates: { lat: 10.1976, lon: 77.0545 }, color: '#38BDF8' },
      { id: 'p15', name: 'Tata Tea Museum', category: 'Heritage', address: 'Nallathanni Estate', distance: '1.9 km', coordinates: { lat: 10.0977, lon: 77.0630 }, color: '#4ADE80' }
    ]
  },
  {
    id: 'dest_6',
    name: 'Kyoto',
    country: 'Japan',
    category: 'Heritage',
    coordinates: { lat: 35.0116, lon: 135.7681 },
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    description: 'International · Ancient imperial capital adorned with wooden temples, bamboo groves, and teahouses.',
    weatherCondition: 'Clear',
    temp: 21,
    humidity: 52,
    windSpeed: 2.2,
    precipitationProb: 10,
    nearbyPlaces: [
      { id: 'p16', name: 'Fushimi Inari Shrine', category: 'Heritage', address: 'Fushimi Ward, Kyoto', distance: '4.5 km', coordinates: { lat: 34.9671, lon: 135.7727 }, color: '#4ADE80' },
      { id: 'p17', name: 'Nishiki Market', category: 'Food', address: 'Nakagyo Ward, Kyoto', distance: '0.8 km', coordinates: { lat: 35.0050, lon: 135.7649 }, color: '#FBBF24' }
    ]
  },
  {
    id: 'dest_7',
    name: 'Dubai',
    country: 'UAE',
    category: 'City escapes',
    coordinates: { lat: 25.2048, lon: 55.2708 },
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    description: 'International · Futuristic skyline, desert safaris, waterfront promenades, and Al Fahidi heritage.',
    weatherCondition: 'Clear',
    temp: 28,
    humidity: 45,
    windSpeed: 3.8,
    precipitationProb: 5,
    nearbyPlaces: [
      { id: 'p18', name: 'Burj Khalifa', category: 'City escapes', address: 'Downtown Dubai', distance: '1.1 km', coordinates: { lat: 25.1972, lon: 55.2744 }, color: '#38BDF8' },
      { id: 'p19', name: 'Arabian Tea House', category: 'Food', address: 'Al Fahidi Historical District', distance: '6.2 km', coordinates: { lat: 25.2634, lon: 55.2974 }, color: '#FBBF24' }
    ]
  }
];

const computeSuitability = ({ temperature, condition, humidity, windSpeed }) => {
  let score = 100;
  const factors = [];
  const condLower = (condition || '').toLowerCase();

  if (temperature > 32) {
    const p = Math.min(25, Math.round((temperature - 32) * 2.5));
    score -= p;
    factors.push({ name: 'High Heat', impact: 'Negative', detail: `${temperature}°C exceeds ideal 32°C comfort threshold (-${p} pts)` });
  } else if (temperature < 12) {
    const p = Math.min(25, Math.round((12 - temperature) * 2));
    score -= p;
    factors.push({ name: 'Cold Temperature', impact: 'Negative', detail: `${temperature}°C requires thermal layering (-${p} pts)` });
  } else {
    factors.push({ name: 'Temperature', impact: 'Positive', detail: `Comfortable ${temperature}°C ambient temperature` });
  }

  if (condLower.includes('thunder') || condLower.includes('storm')) {
    score -= 45;
    factors.push({ name: 'Storm Risk', impact: 'Severe', detail: 'Thunderstorms expected — avoid exposed outdoor trails (-45 pts)' });
  } else if (condLower.includes('rain') || condLower.includes('drizzle')) {
    score -= 30;
    factors.push({ name: 'Rainfall', impact: 'Negative', detail: 'Rainy conditions — pack waterproof gear (-30 pts)' });
  } else if (condLower.includes('snow')) {
    score -= 25;
    factors.push({ name: 'Snowfall', impact: 'Negative', detail: 'Snowy terrain — plan winter transport carefully (-25 pts)' });
  } else if (condLower.includes('cloud')) {
    score -= 10;
    factors.push({ name: 'Cloud Cover', impact: 'Positive', detail: 'Soft overcast lighting great for photography (-10 pts)' });
  } else {
    factors.push({ name: 'Sky Clarity', impact: 'Positive', detail: 'Clear skies ideal for sightseeing and viewpoints' });
  }

  if (windSpeed > 7) {
    const p = Math.min(18, Math.round((windSpeed - 7) * 2));
    score -= p;
    factors.push({ name: 'Wind Velocity', impact: 'Negative', detail: `Gusty winds at ${windSpeed} m/s (-${p} pts)` });
  }

  if (humidity > 80) {
    score -= 8;
    factors.push({ name: 'Humidity', impact: 'Negative', detail: `High humidity at ${humidity}% (-8 pts)` });
  }

  score = Math.max(15, Math.min(100, Math.round(score)));

  let category = 'Ideal';
  let color = '#4ADE80';
  let summary = 'Ideal conditions for outdoor sightseeing, walking tours, and photography.';
  let suggestedActivityTypes = ['Sightseeing', 'Adventure', 'Nature Trails'];
  let tips = ['Stay hydrated and carry sunglasses during midday.'];

  if (score >= 80) {
    category = 'Ideal';
    color = '#4ADE80';
  } else if (score >= 60) {
    category = 'Favorable';
    color = '#38BDF8';
    summary = 'Good overall conditions for exploring landmarks, markets, and local cuisine.';
    suggestedActivityTypes = ['City Walks', 'Heritage', 'Local Food'];
    tips = ['Keep a light jacket handy for evening breezes.'];
  } else if (score >= 40) {
    category = 'Moderate';
    color = '#FBBF24';
    summary = 'Mixed weather conditions. Balance outdoor sightseeing with indoor cafés and museums.';
    suggestedActivityTypes = ['Museums', 'Cafés', 'Shopping'];
    tips = ['Carry a compact umbrella or windproof outer layer.'];
  } else {
    category = 'Poor';
    color = '#F87171';
    summary = 'Inclement weather expected. Focus on indoor cultural spots and cozy dining.';
    suggestedActivityTypes = ['Indoor Museums', 'Food', 'Relaxation'];
    tips = ['Postpone exposed mountain or water excursions until skies clear.'];
  }

  return { score, category, color, summary, factors, suggestedActivityTypes, tips };
};

const buildForecast = (baseTemp, condition) => {
  const slots = [
    { time: '09:00', day: 'Today', offset: -2 },
    { time: '12:00', day: 'Today', offset: 1 },
    { time: '15:00', day: 'Today', offset: 2 },
    { time: '18:00', day: 'Today', offset: 0 },
    { time: '21:00', day: 'Today', offset: -3 },
    { time: '09:00', day: 'Day 2', offset: -1 },
    { time: '15:00', day: 'Day 2', offset: 2 },
    { time: '15:00', day: 'Day 3', offset: 1 }
  ];

  const isRain = (condition || '').toLowerCase().includes('rain');
  return slots.map((s) => ({
    time: s.time,
    day: s.day,
    temp: Math.round(baseTemp + s.offset),
    condition,
    rainProb: isRain ? 70 : 15
  }));
};

const fetchWeatherForCity = async (cityInput = 'Manali') => {
  const cityName = cityInput.trim() || 'Manali';
  const curated = CURATED_DESTINATIONS.find(
    (d) => d.name.toLowerCase() === cityName.toLowerCase()
  );

  let temperature = curated ? curated.temp : 22;
  let condition = curated ? curated.weatherCondition : 'Clear';
  let description = curated ? curated.description : 'Clear skies';
  let humidity = curated ? curated.humidity : 52;
  let windSpeed = curated ? curated.windSpeed : 3.4;
  let precipitationProb = curated ? curated.precipitationProb : 10;
  let country = curated ? curated.country : 'India';
  let destination = curated ? curated.name : cityName;
  let isLive = false;

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const owm = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`,
        { timeout: 3000 }
      );
      const d = owm.data;
      temperature = Math.round(d.main.temp);
      condition = d.weather[0].main;
      description = d.weather[0].description;
      humidity = d.main.humidity;
      windSpeed = Number((d.wind.speed).toFixed(1));
      country = d.sys.country;
      destination = d.name;
      isLive = true;
    } catch {
      // Fallback below
    }
  }

  if (!isLive) {
    try {
      const geo = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
        { timeout: 2500 }
      );
      if (geo.data.results && geo.data.results.length > 0) {
        const loc = geo.data.results[0];
        destination = loc.name;
        country = loc.country || country;
        const wRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`,
          { timeout: 2500 }
        );
        const cw = wRes.data.current_weather;
        temperature = Math.round(cw.temperature);
        windSpeed = Number((cw.windspeed / 3.6).toFixed(1));
        const code = cw.weathercode;
        if (code >= 95) {
          condition = 'Thunderstorm';
          description = 'Thunderstorm activity';
          precipitationProb = 85;
        } else if (code >= 71 && code <= 86) {
          condition = 'Snow';
          description = 'Snowy conditions';
          precipitationProb = 70;
        } else if (code >= 51 && code <= 67) {
          condition = 'Rain';
          description = 'Light to moderate rain';
          precipitationProb = 75;
        } else if (code >= 1 && code <= 3) {
          condition = 'Clouds';
          description = 'Partly cloudy skies';
          precipitationProb = 25;
        } else {
          condition = 'Clear';
          description = 'Clear skies';
          precipitationProb = 10;
        }
        isLive = true;
      }
    } catch {
      // Keep curated/default values
    }
  }

  const suitability = computeSuitability({ temperature, condition, humidity, windSpeed });
  const forecast = buildForecast(temperature, condition);

  return {
    destination,
    country,
    temperature,
    feelsLike: temperature - 1,
    condition,
    description,
    humidity,
    windSpeed,
    precipitationProb,
    isLive,
    lastUpdated: new Date().toISOString(),
    forecast,
    suitability
  };
};

// @route GET /api/weather/current
const getCurrentWeather = async (req, res) => {
  try {
    const city = req.query.city || 'Manali';
    const data = await fetchWeatherForCity(city);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve weather', error: error.message });
  }
};

// @route GET /api/weather/forecast
const getWeatherForecast = async (req, res) => {
  try {
    const city = req.query.city || 'Manali';
    const data = await fetchWeatherForCity(city);
    res.json({ destination: data.destination, data: data.forecast });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve forecast', error: error.message });
  }
};

// @route GET /api/weather/featured
const getFeaturedWeather = async (req, res) => {
  try {
    const featured = CURATED_DESTINATIONS.slice(0, 4).map((d) => ({
      destination: d.name,
      country: d.country,
      temperature: d.temp,
      feelsLike: d.temp - 1,
      condition: d.weatherCondition,
      description: d.description,
      humidity: d.humidity,
      windSpeed: d.windSpeed,
      precipitationProb: d.precipitationProb,
      isLive: false,
      lastUpdated: new Date().toISOString()
    }));
    res.json({ data: featured });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve featured weather', error: error.message });
  }
};

// @route GET /api/destinations/search
const searchDestinations = async (req, res) => {
  try {
    const text = (req.query.text || '').trim().toLowerCase();
    const category = (req.query.category || 'All').trim();

    let results = CURATED_DESTINATIONS.filter((d) => {
      const matchesCat = category === 'All' || !category || d.category.toLowerCase() === category.toLowerCase();
      const matchesText = !text || d.name.toLowerCase().includes(text) || d.country.toLowerCase().includes(text) || d.description.toLowerCase().includes(text);
      return matchesCat && matchesText;
    });

    if (text && results.length === 0) {
      try {
        const geo = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(text)}&count=3&language=en&format=json`,
          { timeout: 2500 }
        );
        if (geo.data.results) {
          results = geo.data.results.map((loc, idx) => ({
            id: `geo_${loc.id || idx}`,
            name: loc.name,
            country: loc.country || 'Global',
            category: 'City escapes',
            coordinates: { lat: loc.latitude, lon: loc.longitude },
            image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=800&auto=format&fit=crop',
            description: `Explore ${loc.name}, ${loc.country || ''} with live weather & trip planning.`,
            weatherCondition: 'Clear',
            temp: 22
          }));
        }
      } catch {
        // Return empty array if offline
      }
    }

    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ message: 'Destination search failed', error: error.message });
  }
};

// @route GET /api/destinations/nearby
const getNearbyPlaces = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      const match = CURATED_DESTINATIONS.find(
        (d) => Math.abs(d.coordinates.lat - lat) < 0.5 && Math.abs(d.coordinates.lon - lon) < 0.5
      );
      if (match && match.nearbyPlaces) {
        return res.json({ data: match.nearbyPlaces });
      }
      return res.json({
        data: [
          { id: 'np_1', name: 'Central Heritage Plaza', category: 'Heritage', address: 'City Center', distance: '1.2 km', coordinates: { lat: lat + 0.008, lon: lon + 0.006 }, color: '#4ADE80' },
          { id: 'np_2', name: 'Local Artisan Cafe', category: 'Food', address: 'Main Promenade', distance: '0.9 km', coordinates: { lat: lat - 0.005, lon: lon + 0.004 }, color: '#FBBF24' },
          { id: 'np_3', name: 'Scenic Viewpoint', category: 'Nature', address: 'Hilltop Overlook', distance: '3.4 km', coordinates: { lat: lat + 0.012, lon: lon - 0.009 }, color: '#38BDF8' }
        ]
      });
    }

    res.json({ data: CURATED_DESTINATIONS[0].nearbyPlaces });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load nearby places', error: error.message });
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  getFeaturedWeather,
  searchDestinations,
  getNearbyPlaces
};

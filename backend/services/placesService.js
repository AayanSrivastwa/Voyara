import axios from 'axios';
import { memoryCache } from './cacheService.js';

// Curated destinations with categories & images
export const CURATED_DESTINATIONS = [
  {
    id: 'dest_1',
    name: 'Central Jakarta',
    country: 'Indonesia',
    category: 'City escapes',
    coordinates: { lat: -6.1805, lon: 106.8284 },
    image: 'https://images.unsplash.com/photo-1555899433-387038f08960?q=80&w=800&auto=format&fit=crop',
    description: 'Dynamic metropolis rich in cultural museums, bustling markets, and iconic monuments.',
    weatherCondition: 'Thunderstorm',
    temp: 28,
  },
  {
    id: 'dest_2',
    name: 'Kyoto',
    country: 'Japan',
    category: 'Heritage',
    coordinates: { lat: 35.0116, lon: 135.7681 },
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    description: 'Serene ancient imperial capital adorned with historic wooden temples, bamboo groves, and teahouses.',
    weatherCondition: 'Clear',
    temp: 21,
  },
  {
    id: 'dest_3',
    name: 'Zermatt',
    country: 'Switzerland',
    category: 'Mountains',
    coordinates: { lat: 45.9765, lon: 7.7491 },
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    description: 'World-renowned car-free alpine village nestled at the foot of the pyramid-shaped Matterhorn.',
    weatherCondition: 'Snow',
    temp: -2,
  },
  {
    id: 'dest_4',
    name: 'Reykjavik',
    country: 'Iceland',
    category: 'Adventure',
    coordinates: { lat: 64.1466, lon: -21.9426 },
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    description: 'Gateway to dramatic geothermal geysers, glaciers, volcanic canyons, and the Northern Lights.',
    weatherCondition: 'Rain',
    temp: 8,
  },
  {
    id: 'dest_5',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beaches',
    coordinates: { lat: -8.4095, lon: 115.1889 },
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    description: 'Tropical paradise of emerald rice terraces, cliffside ocean temples, and sunset beaches.',
    weatherCondition: 'Clouds',
    temp: 29,
  },
  {
    id: 'dest_6',
    name: 'Banff National Park',
    country: 'Canada',
    category: 'Nature',
    coordinates: { lat: 51.4968, lon: -115.9281 },
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop',
    description: 'Glacial turquoise lakes, majestic Canadian Rocky mountain peaks, and abundant wildlife trails.',
    weatherCondition: 'Clear',
    temp: 14,
  },
];

export const searchDestinations = async (query = '', category = '') => {
  const cacheKey = `dest_${query}_${category}`.toLowerCase();
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (apiKey && apiKey.trim() !== '' && query.trim() !== '') {
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}&limit=8`;
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data && res.data.features) {
        const liveResults = res.data.features.map((f, idx) => ({
          id: `geo_${idx}_${f.properties.place_id || idx}`,
          name: f.properties.city || f.properties.name || f.properties.formatted,
          country: f.properties.country || '',
          category: 'City escapes',
          coordinates: { lat: f.properties.lat, lon: f.properties.lon },
          description: f.properties.formatted || '',
          image: CURATED_DESTINATIONS[idx % CURATED_DESTINATIONS.length].image,
        }));
        memoryCache.set(cacheKey, liveResults, 300);
        return liveResults;
      }
    } catch (err) {
      console.warn(`Geoapify autocomplete failed (${err.message}). Using curated destinations.`);
    }
  }

  // Filter curated
  let results = [...CURATED_DESTINATIONS];
  if (category && category !== 'All') {
    results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  }

  memoryCache.set(cacheKey, results, 300);
  return results;
};

export const getNearbyPlaces = async (lat, lon, categories = 'tourism.sights') => {
  const cacheKey = `places_${lat}_${lon}_${categories}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (apiKey && apiKey.trim() !== '' && lat && lon) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},8000&limit=12&apiKey=${apiKey}`;
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data && res.data.features) {
        const places = res.data.features.map((p, idx) => ({
          id: `place_${p.properties.place_id || idx}`,
          name: p.properties.name || p.properties.formatted || 'Local Attraction',
          category: p.properties.categories ? p.properties.categories[0] : 'tourism',
          address: p.properties.formatted,
          coordinates: { lat: p.properties.lat, lon: p.properties.lon },
          distance: p.properties.distance ? `${(p.properties.distance / 1000).toFixed(1)} km` : null,
        }));
        memoryCache.set(cacheKey, places, 600);
        return places;
      }
    } catch (err) {
      console.warn(`Geoapify places API failed (${err.message}).`);
    }
  }

  // Default sample attractions for the coordinates
  const fallbackPlaces = [
    { id: 'p1', name: 'National Monument & Heritage Square', category: 'tourism.sights', address: 'Historic Center', coordinates: { lat: (lat || -6.18) + 0.005, lon: (lon || 106.82) + 0.004 }, distance: '1.2 km' },
    { id: 'p2', name: 'Grand Museum of Cultural History', category: 'museums', address: 'Museum Promenade', coordinates: { lat: (lat || -6.18) - 0.004, lon: (lon || 106.82) + 0.003 }, distance: '0.8 km' },
    { id: 'p3', name: 'Skyline Terrace & Botanical Garden', category: 'parks', address: 'Park Avenue', coordinates: { lat: (lat || -6.18) + 0.007, lon: (lon || 106.82) - 0.005 }, distance: '1.9 km' },
    { id: 'p4', name: 'Artisan Culinary Market', category: 'restaurants', address: 'Market Lane', coordinates: { lat: (lat || -6.18) - 0.002, lon: (lon || 106.82) - 0.003 }, distance: '0.5 km' },
  ];

  memoryCache.set(cacheKey, fallbackPlaces, 600);
  return fallbackPlaces;
};

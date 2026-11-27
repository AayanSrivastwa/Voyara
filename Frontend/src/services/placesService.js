import api from './api';

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

export const placesService = {
  async searchDestinations(query = '', category = '') {
    const res = await api.get('/destinations/search', {
      params: { text: query, category },
    });
    return res.data.data;
  },

  async getNearbyPlaces(lat, lon, categories) {
    const res = await api.get('/destinations/nearby', {
      params: { lat, lon, categories },
    });
    return res.data.data;
  },
};

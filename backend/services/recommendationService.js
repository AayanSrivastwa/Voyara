/**
 * Rule-based Weather Suitability Score & Travel Recommendation Engine
 * Calculates a transparent weather comfort score (0 - 100)
 * Note: Clearly labelled as an informational comfort indicator, not a safety guarantee.
 */

export const calculateWeatherSuitability = (weatherData) => {
  if (!weatherData || typeof weatherData.temperature === 'undefined') {
    return {
      score: null,
      category: 'Insufficient Data',
      color: '#728F89',
      summary: 'Weather data is incomplete for this location.',
      factors: [],
      suggestedActivityTypes: ['General Exploration'],
    };
  }

  const {
    temperature = 22,
    feelsLike = 22,
    condition = 'Clear',
    windSpeed = 3,
    humidity = 50,
    precipitationProb = 0,
  } = weatherData;

  let score = 100;
  const factors = [];

  // 1. Temperature comfort (ideal: 18°C - 26°C)
  if (temperature >= 18 && temperature <= 26) {
    factors.push({ name: 'Temperature', impact: 'Positive', detail: 'Optimal mild temperature for outdoor walking' });
  } else if (temperature > 26 && temperature <= 32) {
    score -= 10;
    factors.push({ name: 'Temperature', impact: 'Moderate', detail: 'Warm conditions; hydration recommended' });
  } else if (temperature > 32) {
    score -= 25;
    factors.push({ name: 'Temperature', impact: 'Negative', detail: 'High heat; seek shade and limit midday exertion' });
  } else if (temperature >= 10 && temperature < 18) {
    score -= 8;
    factors.push({ name: 'Temperature', impact: 'Moderate', detail: 'Crisp and cool; light jacket recommended' });
  } else if (temperature < 10) {
    score -= 22;
    factors.push({ name: 'Temperature', impact: 'Negative', detail: 'Cold weather; warm winter gear needed' });
  }

  // 2. Wind factor
  if (windSpeed > 15) {
    score -= 20;
    factors.push({ name: 'Wind', impact: 'Negative', detail: `Strong winds (${windSpeed} m/s); review open viewpoints or coastal boats` });
  } else if (windSpeed > 8) {
    score -= 8;
    factors.push({ name: 'Wind', impact: 'Moderate', detail: `Moderate breeze (${windSpeed} m/s)` });
  }

  // 3. Precipitation & condition
  const condLower = condition.toLowerCase();
  if (condLower.includes('thunder') || condLower.includes('storm')) {
    score -= 40;
    factors.push({ name: 'Precipitation', impact: 'Severe', detail: 'Thunderstorms detected; postpone outdoor excursions' });
  } else if (condLower.includes('heavy rain')) {
    score -= 30;
    factors.push({ name: 'Precipitation', impact: 'Negative', detail: 'Heavy rainfall; indoor attractions advised' });
  } else if (condLower.includes('rain') || condLower.includes('shower') || condLower.includes('drizzle')) {
    score -= 15;
    factors.push({ name: 'Precipitation', impact: 'Negative', detail: 'Light showers; umbrella required' });
  } else if (condLower.includes('snow')) {
    score -= 18;
    factors.push({ name: 'Condition', impact: 'Moderate', detail: 'Snowfall; scenic but check road traction' });
  } else if (condLower.includes('fog') || condLower.includes('mist')) {
    score -= 12;
    factors.push({ name: 'Visibility', impact: 'Moderate', detail: 'Reduced visibility for scenic vistas' });
  }

  // Clamp score
  score = Math.max(10, Math.min(100, Math.round(score)));

  let category = 'Excellent';
  let color = '#4ADE80';
  if (score < 40) {
    category = 'Challenging';
    color = '#F87171';
  } else if (score < 65) {
    category = 'Moderate';
    color = '#FBBF24';
  } else if (score < 85) {
    category = 'Favorable';
    color = '#38BDF8';
  }

  // Recommendations based on weather
  const recommendations = getRecommendationsForCondition(condition, temperature, windSpeed);

  return {
    score,
    category,
    color,
    summary: `Travel suitability is ${category.toLowerCase()} (${score}/100) based on local forecast metrics.`,
    factors,
    suggestedActivityTypes: recommendations.activityTypes,
    tips: recommendations.tips,
  };
};

export const getRecommendationsForCondition = (condition = 'Clear', temp = 22, wind = 3) => {
  const cond = condition.toLowerCase();

  if (cond.includes('thunder') || cond.includes('storm')) {
    return {
      activityTypes: ['Museums', 'Art Galleries', 'Culinary Dining', 'Indoor Markets'],
      tips: [
        'Postpone outdoor climbs, hiking, and open-boat tours.',
        'Explore famous local indoor heritage sites and museums.',
        'Check local transit schedules as storms may introduce delays.',
      ],
    };
  }

  if (cond.includes('rain') || cond.includes('drizzle')) {
    return {
      activityTypes: ['Indoor Exhibitions', 'Historic Cafés', 'Cooking Classes', 'Shopping Arcades'],
      tips: [
        'Carry a compact umbrella or waterproof shell.',
        'Take advantage of indoor cultural landmarks and boutique coffee houses.',
        'Wear shoes with reliable grip on wet stone streets.',
      ],
    };
  }

  if (cond.includes('snow')) {
    return {
      activityTypes: ['Winter Sports', 'Cozy Bistros', 'Scenic Train Rides', 'Hot Springs / Thermal Baths'],
      tips: [
        'Dress in layered thermal clothing with waterproof outerwear.',
        'Enjoy panoramic snowy peaks or winter markets.',
        'Allow extra travel time for scenic mountain transit.',
      ],
    };
  }

  if (temp > 30) {
    return {
      activityTypes: ['Early Morning Walks', 'Water Activities', 'Air-Conditioned Centers', 'Evening Sunset Spots'],
      tips: [
        'Plan heavy walking in early morning or after sunset.',
        'Stay hydrated and use sun protection.',
        'Spend peak afternoon hours in air-conditioned heritage pavilions or galleries.',
      ],
    };
  }

  // Clear / Mild / Part Cloudy
  return {
    activityTypes: ['Architectural Walking Tours', 'Botanical Gardens', 'Open-air Markets', 'Scenic Viewpoints'],
    tips: [
      'Ideal conditions for long strolls and landscape photography.',
      'Take advantage of golden-hour light around sunrise and sunset.',
      'Pack comfortable walking shoes and camera gear.',
    ],
  };
};

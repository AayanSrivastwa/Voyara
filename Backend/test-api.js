const axios = require('axios');

async function runTests() {
  const baseURL = 'http://127.0.0.1:5000/api';
  console.log('[Test] Running Voyara v2.0 API verification tests...');

  try {
    // 1. Healthcheck
    const health = await axios.get(`${baseURL}/health`);
    console.log('✓ Health check:', health.data.status);

    // 2. Destinations search & nearby
    const dests = await axios.get(`${baseURL}/destinations/search?text=&category=All`);
    console.log(`✓ Destinations search: ${dests.data.data.length} destinations (first: ${dests.data.data[0]?.name})`);

    const nearby = await axios.get(`${baseURL}/destinations/nearby?lat=32.2432&lon=77.1892`);
    console.log(`✓ Nearby places loaded: ${nearby.data.data.length} POIs`);

    // 3. Weather current, forecast & featured
    const weather = await axios.get(`${baseURL}/weather/current?city=Manali`);
    console.log(`✓ Current weather (${weather.data.data.destination}): ${weather.data.data.temperature}°C, suitability ${weather.data.data.suitability.score}/100`);

    const featured = await axios.get(`${baseURL}/weather/featured`);
    console.log(`✓ Featured weather cards: ${featured.data.data.length}`);

    // 4. Demo Login (expects { token, user })
    const demo = await axios.post(`${baseURL}/auth/demo-login`);
    const token = demo.data.token;
    if (!demo.data.user || !token) throw new Error('Missing token or user in auth response');
    console.log(`✓ Demo login: ${demo.data.user.name}`);

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // 5. Trips & Itineraries
    const trips = await axios.get(`${baseURL}/trips`, authHeader);
    console.log(`✓ Trips loaded: ${trips.data.data.length} trips`);
    const firstTrip = trips.data.data[0];

    const itins = await axios.get(`${baseURL}/trips/${firstTrip._id}/itineraries`, authHeader);
    console.log(`✓ Itineraries for "${firstTrip.title}": ${itins.data.data.length} items`);

    // 6. Nested Expenses
    const exp = await axios.get(`${baseURL}/trips/${firstTrip._id}/expenses`, authHeader);
    console.log(`✓ Expenses for trip: ${exp.data.data.length} items, totalSpent=${exp.data.summary.totalSpent} ${exp.data.summary.currency}`);

    // 7. Favourites & Notifications
    const favs = await axios.get(`${baseURL}/favourites`, authHeader);
    console.log(`✓ Favourites loaded: ${favs.data.data.length}`);

    const notifs = await axios.get(`${baseURL}/notifications`, authHeader);
    console.log(`✓ Notifications loaded: ${notifs.data.data.length} (unread: ${notifs.data.unreadCount})`);

    // 8. Date validations
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    try {
      await axios.post(`${baseURL}/trips`, { title: 'Past', destination: 'Manali', startDate: yesterday, endDate: today, budget: 1000 }, authHeader);
      throw new Error('Expected past startDate to fail');
    } catch (e) {
      if (e.response?.status !== 400) throw e;
      console.log(`✓ Past startDate rejected (400): ${e.response.data.message}`);
    }

    try {
      await axios.post(`${baseURL}/trips`, { title: 'BadRange', destination: 'Manali', startDate: tomorrow, endDate: today, budget: 1000 }, authHeader);
      throw new Error('Expected endDate < startDate to fail');
    } catch (e) {
      if (e.response?.status !== 400) throw e;
      console.log(`✓ End date before start date rejected (400): ${e.response.data.message}`);
    }

    console.log('\n>>> ALL END-TO-END CHECKS PASSED PERFECTLY! <<<');
    process.exit(0);
  } catch (err) {
    console.error('✗ Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();

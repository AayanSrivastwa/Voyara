import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../server.js');

let server;
const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (path, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    const url = new URL(fullUrl);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🚀 Starting Voyara Automated Backend API Integration Tests...\n');

  server = app.listen(PORT);
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // 1. Health check
    console.log('Test 1: Health check endpoint');
    const health = await makeRequest('/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'healthy');
    console.log('✅ Health check passed.\n');

    // 2. Weather endpoint (works with demo fallback or live)
    console.log('Test 2: Weather current endpoint');
    const weather = await makeRequest('/weather/current?city=Central%20Jakarta');
    assert.strictEqual(weather.status, 200);
    assert.strictEqual(weather.data.success, true);
    assert.ok(weather.data.data.temperature !== undefined);
    assert.ok(weather.data.data.suitability !== undefined);
    console.log('✅ Weather endpoint passed.\n');

    // 3. Weather forecast endpoint
    console.log('Test 3: Weather forecast endpoint');
    const forecast = await makeRequest('/weather/forecast?city=Paris');
    assert.strictEqual(forecast.status, 200);
    assert.strictEqual(forecast.data.success, true);
    console.log('✅ Weather forecast endpoint passed.\n');

    // 4. Destinations search endpoint
    console.log('Test 4: Destinations search endpoint');
    const search = await makeRequest('/destinations/search?text=Zermatt');
    assert.strictEqual(search.status, 200);
    assert.strictEqual(search.data.success, true);
    assert.ok(Array.isArray(search.data.data));
    console.log('✅ Destinations search passed.\n');

    // 5. Auth protection check on trips without token
    console.log('Test 5: Protected route rejection without token');
    const unauth = await makeRequest('/trips');
    assert.strictEqual(unauth.status, 401);
    assert.strictEqual(unauth.data.success, false);
    console.log('✅ Protected route correctly rejected unauthenticated request.\n');

    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();

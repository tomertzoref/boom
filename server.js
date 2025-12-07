const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// BoomNow API credentials
const CLIENT_ID = 'boom_3a213702291c3df84814';
const CLIENT_SECRET = '76df8d0d9bf2a21b04b4a64504c1107ed9b4078b3a3b1fd722687a9f399e7c76';
// Correct API base URL for Booking API V1
const API_BASE_URL = 'https://app.boomnow.com/open_api/v1';

// Function to create authentication token
async function createAuthToken() {
  try {
    console.log('\n=== Creating Authentication Token ===');
    console.log('Endpoint: https://app.boomnow.com/open_api/v1/auth/token');
    console.log('CLIENT_ID:', CLIENT_ID);
    
    // According to documentation: POST to https://app.boomnow.com/open_api/v1/auth/token
    const tokenEndpoint = `${API_BASE_URL}/auth/token`;
    
    const response = await axios.post(
      tokenEndpoint,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ Token created successfully');
    console.log('Token response:', JSON.stringify(response.data, null, 2));
    
    // Extract token from response
    const token = response.data.token || 
                 response.data.access_token || 
                 response.data.data?.token ||
                 response.data.data?.access_token;
    
    if (!token) {
      throw new Error('Token not found in response');
    }
    
    return token;
  } catch (error) {
    console.error('❌ Failed to create token:', error.response?.data || error.message);
    throw error;
  }
}

// Search hotels endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { location, adults } = req.body;

    if (!location || !adults) {
      return res.status(400).json({ error: 'Location and adults are required' });
    }

    console.log('\n=== API Search Request ===');
    console.log('Location:', location);
    console.log('Adults:', adults);

    // Step 1: Create authentication token
    let authToken;
    try {
      authToken = await createAuthToken();
    } catch (tokenError) {
      console.error('Failed to create authentication token');
      return res.status(500).json({
        error: 'Authentication failed',
        message: tokenError.response?.data?.error || tokenError.message,
      });
    }

    // Step 2: Use token to search for hotels

    const searchLocation = location;

    // Calculate dates - use specific future dates that work (as user tested)
    // User confirmed that 06/01/2026 - 08/01/2026 works on their demo site
    const checkIn = '2026-01-06';
    const checkOut = '2026-01-08';
    
    console.log('\n=== Searching for Hotels ===');
    console.log('Using dates:', checkIn, 'to', checkOut);
    console.log('Search location:', searchLocation);

    // Use the listings endpoint with Bearer token
    // According to documentation: https://boomnow.stoplight.io/docs/boom-booking-api/e9k2w4m3hoj3i-returns-all-listings
    // Use city query parameter to filter results
    const listingsEndpoint = `${API_BASE_URL}/listings`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    // Use city query parameter as specified in documentation
    const queryParams = {
      city: searchLocation,
      adults: adults.toString(),
      check_in: checkIn,
      check_out: checkOut,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${listingsEndpoint}?${queryString}`;
    
    console.log(`\nCalling API: ${url}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Query params:', JSON.stringify(queryParams, null, 2));

    try {
      const response = await axios.get(url, {
        headers: headers,
        timeout: 10000,
      });

      console.log(`\n✅ Response Status: ${response.status}`);
      console.log('Response Data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);

      // Check if response contains an error
      if (response.data && response.data.error) {
        console.log('⚠️ API returned error:', response.data.error);
        return res.status(404).json({
          error: 'API request failed',
          message: response.data.error,
        });
      }

      // Extract results - API returns an object with a data array or array directly
      let results = [];
      if (Array.isArray(response.data)) {
        results = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        results = response.data.data;
      } else if (response.data && Array.isArray(response.data.listings)) {
        results = response.data.listings;
      } else {
        console.log('⚠️ API did not return expected format. Response keys:', 
          response.data ? Object.keys(response.data) : 'null/undefined');
        return res.status(404).json({
          error: 'No results found',
          message: 'API returned unexpected format',
        });
      }

      console.log(`✅ Found ${results.length} results`);
      
      // Log the structure of the first listing to see what fields are available
      if (results.length > 0) {
        console.log('\n📋 First listing structure:');
        console.log('Keys:', Object.keys(results[0]));
        console.log('Sample listing (first 1000 chars):', JSON.stringify(results[0], null, 2).substring(0, 1000));
        return res.json(results);
      } else {
        return res.status(404).json({
          error: 'No results found',
          message: 'No hotels found for the specified city and dates',
        });
      }
    } catch (apiError) {
      const status = apiError.response?.status;
      const errorData = apiError.response?.data;
      
      console.log(`\n❌ API Error:`);
      console.log('Status:', status);
      console.log('Error:', errorData?.error || apiError.message);
      
      return res.status(status || 500).json({
        error: 'API request failed',
        message: errorData?.error || apiError.message,
      });
    }

    // If all attempts failed, return error
    console.log('\n❌ All API attempts failed');
    return res.status(404).json({
      error: 'API request failed',
      message: 'No results found for the specified location and dates',
      suggestion: 'The API returned no results. This might mean:\n' +
        '1. The location name is not recognized by the API\n' +
        '2. There are no hotels available for this location and dates\n\n' +
        'Please check the API documentation at https://boomnow.stoplight.io/',
    });
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    return res.status(500).json({
      error: 'Unexpected server error',
      message: error.message,
    });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


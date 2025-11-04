import axios from 'axios';

// Fake Store API for deals/products
const FAKE_STORE_API = 'https://fakestoreapi.com/products';

// OpenWeatherMap API
// REPLACE WITH YOUR ACTUAL API KEY from openweathermap.org
const WEATHER_API_KEY = 'c085e88474649af8b897fba46ac113b5'; // Get from openweathermap.org
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

// Fetch products from Fake Store API
export const fetchDeals = async () => {
  try {
    const response = await axios.get(FAKE_STORE_API);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Fetch deals error:', error);
    return { success: false, error: error.message };
  }
};

// Fetch weather for a location
export const fetchWeather = async (city) => {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
      // Return mock data if no API key
      return {
        success: true,
        data: {
          main: { temp: 22 },
          weather: [{ description: 'clear sky' }]
        }
      };
    }

    const response = await axios.get(WEATHER_API_BASE, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Fetch weather error:', error);
    // Return mock data on error
    return {
      success: true,
      data: {
        main: { temp: 22 },
        weather: [{ description: 'clear sky' }]
      }
    };
  }
};

// Fetch weather by coordinates
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
      // Return mock data if no API key
      return {
        success: true,
        data: {
          main: { temp: 22 },
          weather: [{ description: 'clear sky' }]
        }
      };
    }

    const response = await axios.get(WEATHER_API_BASE, {
      params: {
        lat: lat,
        lon: lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Fetch weather by coords error:', error);
    // Return mock data on error
    return {
      success: true,
      data: {
        main: { temp: 22 },
        weather: [{ description: 'clear sky' }]
      }
    };
  }
};

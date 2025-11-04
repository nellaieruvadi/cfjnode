const axios = require('axios');
require('dotenv').config();

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

if (!APP_ID || !APP_KEY) {
  console.error('ERROR: ADZUNA_APP_ID and ADZUNA_APP_KEY must be set in environment variables');
  throw new Error('Missing required Adzuna API credentials');
}

async function fetchJobs(keyword = 'it-jobs', location = 'Tamil Nadu') {
  const apiURL = 'https://api.adzuna.com/v1/api/jobs/in/search/1';
  const fullURL = `${apiURL}?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(keyword)}&where=${encodeURIComponent(location)}&results_per_page=10`;

  try {
    const response = await axios.get(fullURL);
    return { jobs: response.data.results, fullURL };
  } catch (err) {
    console.error('Adzuna API error:', err.message);
    return { jobs: [], fullURL };
  }
}

// New: Fetch jobs by keyword and country code (e.g., 'IN', 'US', 'UK')
async function fetchJobsByCountry(keyword = 'it-jobs', country = 'IN') {
  // Whitelist of valid country codes supported by Adzuna API
  const validCountries = ['at', 'au', 'be', 'br', 'ca', 'ch', 'de', 'es', 'fr', 'gb', 'in', 'it', 'mx', 'nl', 'nz', 'pl', 'ru', 'sg', 'us', 'za'];
  const sanitizedCountry = country.toLowerCase();
  
  // Validate country code against whitelist
  const validatedCountry = validCountries.includes(sanitizedCountry) ? sanitizedCountry : 'in';
  
  if (!validCountries.includes(sanitizedCountry)) {
    console.warn(`Invalid country code: ${country}. Using default: in`);
  }
  
  const apiURL = `https://api.adzuna.com/v1/api/jobs/${validatedCountry}/search/1`;
  const fullURL = `${apiURL}?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(keyword)}&results_per_page=10`;

  try {
    const response = await axios.get(fullURL);
    return { jobs: response.data.results, fullURL };
  } catch (err) {
    console.error('Adzuna API country error:', err.message);
    return { jobs: [], fullURL };
  }
}

module.exports = { fetchJobs, fetchJobsByCountry };

// This script tests your API key against the API.Bible endpoint for bibles.
// Run this in Node.js or your browser console (with CORS enabled).

const API_KEY = '147e894f37a0d66d4c406054d874f66a';

fetch('https://api.scripture.api.bible/v1/bibles', {
  headers: {
    'api-key': API_KEY,
  },
})
  .then(res => res.json())
  .then(data => {
    console.log('API.Bible bibles response:', data);
  })
  .catch(err => {
    console.error('API.Bible test error:', err);
  });

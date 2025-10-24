// This script tests the search endpoint for the American Standard Version (Byzantine Text with Apocrypha)
const API_KEY = '11bf5ec92f6b0520c6051043ca477d9d';
const BIBLE_ID = '685d1470fe4d5c3b-01';
const QUERY = 'faith';

fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(QUERY)}`, {
  headers: {
    'api-key': API_KEY,
  },
})
  .then(res => res.json())
  .then(data => {
    console.log('Search response:', data);
  })
  .catch(err => {
    console.error('Search test error:', err);
  });

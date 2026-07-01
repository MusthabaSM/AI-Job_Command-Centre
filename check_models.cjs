const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const keyWithQuotes = env.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY=')).split('=')[1].trim();
const key = keyWithQuotes.replace(/"/g, '');

fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log(data.models.map(m => m.name).join('\n'));
    } else {
      console.log('Error:', data);
    }
  });

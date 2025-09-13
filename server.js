const express = require('express');
const path = require('path');

const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve specific pages
app.get('/committee', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'committee.html'));
});

app.get('/speakers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'speakers.html'));
});

app.get('/program', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'program.html'));
});

app.get('/venue', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'venue.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'registration.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'contact.html'));
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Conference Battery Server is running on port ${PORT}`);
  console.log(`Website: http://localhost:${PORT}`);
});



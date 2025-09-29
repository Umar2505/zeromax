const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/home-relocation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home-relocation.html'));
});

app.get('/office-relocation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'office-relocation.html'));
});

app.get('/furniture-installation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'furniture-installation.html'));
});

app.get('/cleaning', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cleaning.html'));
});

app.get('/packing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'packing.html'));
});

app.get('/special-movings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'special-movings.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

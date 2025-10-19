// server.js
const express = require('express');
const app = express();
const port = 5000;

// Middleware CORS sederhana untuk memungkinkan React mengakses server
// Hanya diperlukan jika Anda tidak menggunakan proxy di package.json React
// Jika menggunakan proxy, middleware ini bisa diabaikan (optional)
app.use((req, res, next) => {
  // Hanya izinkan domain development React Anda (port 3000)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint GET sederhana
// Merespons di root path ('/') dengan objek JSON
app.get('/', (req, res) => {
  // Mengembalikan pesan yang sesuai dengan yang diambil oleh komponen React
  res.json({ message: 'Hello from Node.js Server!' });
});

// Server mulai mendengarkan di port yang ditentukan
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Pastikan server ini berjalan sebelum menjalankan aplikasi React Anda.');
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend in production
app.use(express.static(path.join(__dirname, '../frontend')));

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servicehub';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', require('./routes/auth'));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    environment: process.env.NODE_ENV
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.log('MongoDB connection error:', err.message);
    console.log('Connection string used:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

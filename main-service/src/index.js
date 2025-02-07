// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/config/database');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');

// Initialize Express application
const app = express();

// Connect to MongoDB database
connectDB();

// Configure middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

/**
* Root Route
* GET /
* Provides API documentation with available endpoints
* @returns {Object} - API information and endpoint listing
*/
app.get('/', (req, res) => {
   res.json({ 
       message: 'Main Service API is running',
       endpoints: {
           auth: {
               register: 'POST /api/register',
               login: 'POST /api/login',
               protected: 'POST /api/protected'
           },
           candidate: {
               create: 'POST /api/candidate',
               list: 'GET /api/candidate'
           }
       }
   });
});

// Register route modules
app.use('/api', authRoutes); // Authentication routes
app.use('/api', candidateRoutes); // Candidate management routes

/**
* Global Error Handler
* Catches any unhandled errors in the application
* @param {Error} err - Error object
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
app.use((err, req, res, next) => {
   console.error(err.stack); // Log error stack trace
   res.status(500).json({ message: 'Something went wrong!' });
});

// Set port and start server
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000
app.listen(PORT, () => {
   console.log(`Main service running on port ${PORT}`);
});
// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies 
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/config/database');
const apiAuth = require('./middleware/apiAuth');
const User = require('../../shared/models/user'); 
const Candidate = require('../../shared/models/candidate');

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
* Provides API documentation with available public endpoints
* @returns {Object} - API information and endpoint documentation
*/
app.get('/', (req, res) => {
   res.json({
       message: 'Public API Service is running',
       endpoints: {
           profile: 'GET /api/public/profile',
           candidates: 'GET /api/public/candidate'
       },
       note: 'All endpoints require X-API-Key header'
   });
});

/**
* Get User Profile Route
* GET /api/public/profile
* Protected route - requires API key authentication
* Returns basic profile information of authenticated user
* @returns {Object} - User profile data (first name, last name, email)
*/
app.get('/api/public/profile', apiAuth, async (req, res) => {
   // Extract only necessary user information
   const { first_name, last_name, email } = req.user;
   res.json({ first_name, last_name, email });
});

/**
* Get Candidates Route
* GET /api/public/candidate
* Protected route - requires API key authentication
* Returns all candidates associated with authenticated user
* @returns {Array} - List of candidate documents
*/
app.get('/api/public/candidate', apiAuth, async (req, res) => {
   try {
       // Find all candidates belonging to authenticated user
       const candidates = await Candidate.find({ user_id: req.user._id });
       res.json(candidates);
   } catch (error) {
       // Handle server errors
       res.status(500).json({ message: error.message });
   }
});

// Set port and start server
const PORT = process.env.PORT || 3001; // Use environment port or default to 3001
app.listen(PORT, () => {
   console.log(`Public API service running on port ${PORT}`);
});
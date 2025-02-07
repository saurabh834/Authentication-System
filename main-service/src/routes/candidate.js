// Import required dependencies
const express = require('express');
const Candidate = require('../../../shared/models/candidate');
const auth = require('../middleware/auth');

// Create Express router instance
const router = express.Router();

/**
* Create New Candidate Route
* POST /candidate
* Protected route - requires authentication
* Creates a new candidate record associated with the authenticated user
* @param {Object} req.body - Candidate details from request body
* @returns {Object} - Created candidate document
*/
router.post('/candidate', auth, async (req, res) => {
 try {
   // Create new candidate instance with request body and authenticated user's ID
   const candidate = new Candidate({
     ...req.body,
     user_id: req.user._id // Associate candidate with authenticated user
   });
   
   // Save candidate to database
   await candidate.save();
   
   // Return created candidate object
   res.status(201).json(candidate);
 } catch (error) {
   res.status(400).json({ message: error.message });
 }
});

/**
* Get All Candidates Route
* GET /candidate
* Protected route - requires authentication
* Retrieves all candidates associated with the authenticated user
* @returns {Array} - List of candidate documents
*/
router.get('/candidate', auth, async (req, res) => {
 try {
   // Find all candidates belonging to the authenticated user
   const candidates = await Candidate.find({ user_id: req.user._id });
   
   // Return array of candidates
   res.json(candidates);
 } catch (error) {
   // Return 500 error for server-side issues
   res.status(500).json({ message: error.message });
 }
});

// Export router for use in main application
module.exports = router;
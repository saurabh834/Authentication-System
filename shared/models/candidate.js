// Required external dependencies
const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Mongoose schema definition for Candidate model
 * Represents a candidate in the system with basic personal information
 * and a reference to their associated user account
 */
const candidateSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,    // Field must be provided
    trim: true        // Remove whitespace from both ends
  },
  last_name: {
    type: String,
    required: true,    // Field must be provided
    trim: true        // Remove whitespace from both ends
  },
  email: {
    type: String,
    required: true,    // Field must be provided
    trim: true,        // Remove whitespace from both ends
    lowercase: true,   // Convert email to lowercase
    validate(value) {  // Custom validator for email format
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId type
    required: true,
    ref: 'User'    // Reference to User model for population
  }
});

// Create the model from the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

// Export the model for use in other files
module.exports = Candidate;
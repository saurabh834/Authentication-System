// Required external dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');    // For password hashing
const validator = require('validator'); // For input validation

/**
 * Mongoose schema definition for User model
 * Represents a user in the system with authentication capabilities
 * Includes personal information, secure password storage, and API access
 */
const userSchema = new mongoose.Schema({
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
    unique: true,      // Ensures no duplicate emails in the database
    trim: true,        // Remove whitespace from both ends
    lowercase: true,   // Convert email to lowercase
    validate(value) {  // Custom validator for email format
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  password_hash: {
    type: String,
    required: true     // Field must be provided
  },
  api_key: {
    type: String,
    unique: true      // Ensures no duplicate API keys
  }
});

/**
 * Pre-save middleware to hash the password
 * Runs before saving the user document
 * Only hashes the password if it has been modified
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified
  if (this.isModified('password_hash')) {
    // Hash the password with a salt round of 8
    this.password_hash = await bcrypt.hash(this.password_hash, 8);
  }
  next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other files
module.exports = User;
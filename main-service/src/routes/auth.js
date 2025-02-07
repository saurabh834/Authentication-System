// Import required dependencies
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../../shared/models/user');
const auth = require('../middleware/auth');

// Create Express router instance
const router = express.Router();

/**
 * User Registration Route
 * POST /register
 * @param {string} first_name - User's first name
 * @param {string} last_name - User's last name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} - Contains JWT token and API key
 */
router.post('/register', async (req, res) => {
  try {
    // Extract user details from request body
    const { first_name, last_name, email, password } = req.body;
    
    // Check if user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate a random API key for the user
    const api_key = crypto.randomBytes(32).toString('hex');
    
    // Create new user instance with provided details
    const user = new User({
      first_name,
      last_name,
      email,
      password_hash: password, // Note: password will be hashed by mongoose middleware
      api_key
    });

    // Save user to database
    await user.save();
    
    // Generate JWT token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Return token and API key to client
    res.status(201).json({ token, api_key });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * User Login Route
 * POST /login
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} - Contains JWT token
 */
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Verify user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate new JWT token for successful login
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Protected Route Example
 * POST /protected
 * Requires valid JWT token in Authorization header
 * @returns {Object} - Contains success message and user details
 */
router.post('/protected', auth, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

// Export router for use in main application
module.exports = router;
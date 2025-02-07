// Import required dependencies
const jwt = require('jsonwebtoken');
const User = require('../../../shared/models/user');

/**
 * Authentication middleware to verify JWT tokens and protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Extract JWT token from Authorization header and remove 'Bearer ' prefix
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Return error if no token is provided
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database using decoded user ID from token
    const user = await User.findOne({ _id: decoded.userId });

    // Throw error if user not found
    if (!user) {
      throw new Error();
    }

    // Attach user and token to request object for use in subsequent middleware/routes
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Return authentication error if token is invalid or verification fails
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Export the middleware for use in other files
module.exports = auth;
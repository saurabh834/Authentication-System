// Import User model
const User = require('../../../shared/models/user');

/**
* API Key Authentication Middleware
* Validates requests using X-API-Key header
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
const apiAuth = async (req, res, next) => {
 try {
   // Extract API key from request header
   const apiKey = req.header('X-API-Key');

   // Check if API key is provided
   if (!apiKey) {
     return res.status(401).json({ message: 'API key required' });
   }

   // Find user associated with the API key
   const user = await User.findOne({ api_key: apiKey });

   // Validate if user exists with provided API key
   if (!user) {
     return res.status(401).json({ message: 'Invalid API key' });
   }

   // Attach user object to request for use in subsequent middleware/routes
   req.user = user;
   next();
 } catch (error) {
   // Handle any errors during authentication
   res.status(401).json({ message: 'Authentication failed' });
 }
};

// Export middleware for use in other files
module.exports = apiAuth;
// Import Mongoose library for MongoDB interactions
const mongoose = require('mongoose');

/**
* Database Connection Function
* Establishes connection to MongoDB using environment variables
* Terminates process on connection failure
* @returns {Promise<void>}
*/
const connectDB = async () => {
 try {
   // Attempt to connect to MongoDB using URI from environment variables
   await mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,      // Use new URL parser to avoid deprecation warnings
     useUnifiedTopology: true    // Use new Server Discovery and Monitoring engine
   });

   // Log successful connection
   console.log('MongoDB connected successfully');
 } catch (error) {
   // Log error and terminate process if connection fails
   console.error('MongoDB connection error:', error);
   process.exit(1); // Exit with failure code
 }
};

// Export connection function for use in application
module.exports = connectDB;
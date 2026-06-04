import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classos', {
      serverSelectionTimeoutMS: 5000, // Fail fast if database is unreachable (5 seconds instead of 30 seconds)
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Do not call process.exit(1) so the backend stays online and can return proper CORS error responses.
  }
};

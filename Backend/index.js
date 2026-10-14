import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './Routers/authRoutes.js';
import userRoutes from './Routers/userRouter.js';
import destinationRoutes from './Routers/destinationRoutes.js';
import tourRoutes from './Routers/tourRoutes.js';
import hotelRoutes from './Routers/hotelRoutes.js';
import roomRoutes from './Routers/roomRoutes.js';
import tourBookingRoutes from './Routers/tourBookingRoutes.js';
import hotelBookingRoutes from './Routers/hotelBookingRoutes.js';
import reviewRoutes from './Routers/reviewRoutes.js';
import adminRoutes from './Routers/adminRoutes.js';
import uploadRoutes from './Routers/uploadRoutes.js';
import paymentRoutes from './Routers/paymentRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Serve static uploaded files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tour-bookings', tourBookingRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Wayfare API is running...' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
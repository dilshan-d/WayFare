import mongoose from 'mongoose';

const tourBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    tourDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'online'],
      default: 'card',
    },
    transactionId: {
      type: String,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const TourBooking = mongoose.model('TourBooking', tourBookingSchema);

export default TourBooking;

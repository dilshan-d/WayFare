import mongoose from 'mongoose';

const hotelBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      default: 1,
    },
    numberOfNights: {
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

const HotelBooking = mongoose.model('HotelBooking', hotelBookingSchema);

export default HotelBooking;
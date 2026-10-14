import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Deluxe', 'Suite', 'Family Suite'],
      required: true,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
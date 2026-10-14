import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
    },
    startingPrice: {
      type: Number,
      default: 100,
    },
    amenities: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
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
    destinationName: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in days
    },
    category: {
      type: String,
      default: 'Adventure',
    },
    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        description: { type: String },
      },
    ],
    includedServices: [
      {
        type: String,
      },
    ],
    availableDates: [
      {
        type: Date,
      },
    ],
    maxParticipants: {
      type: Number,
      default: 20,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
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

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;

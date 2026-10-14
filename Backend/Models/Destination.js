import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
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
    attractions: [
      {
        type: String,
      },
    ],
    bestTimeToVisit: {
      type: String,
      default: 'Year-round',
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
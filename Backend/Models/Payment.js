import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userEmail: {
      type: String,
      required: true
    },

    bookingType: {
      type: String,
      enum: ["hotel", "tour"],
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId
    },

    hotelEmail: {
      type: String
    },

    tourPackageTitle: {
      type: String
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash", "online"],
      required: true
    },

    transactionId: {
      type: String,
      unique: true
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },

    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
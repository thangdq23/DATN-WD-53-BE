import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    codePayment: {
      type: Number,
      required: true,
    },
    ticketId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    customerInfo: {
      type: {
        email: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    },
    movieId: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    seats: [
      {
        seatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seat",
          required: true,
        },
        label: { type: String, required: true },
        type: { type: String, required: true },
        span: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "buyed", "used", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

import mongoose from "mongoose";

const seatStatusSchema = new mongoose.Schema(
  {
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },

    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },

    status: {
      type: String,
      enum: ["hold", "booked"],
      required: true,
    },

    expiredHold: {
      type: Date,
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

const SeatStatus = mongoose.model("SeatStatus", seatStatusSchema);
export default SeatStatus;

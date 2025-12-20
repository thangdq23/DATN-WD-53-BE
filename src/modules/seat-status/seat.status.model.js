import mongoose from "mongoose";
import { SEAT_STATUS } from "../../common/constants/seatStatus.js";

const seatStatusSchema = new mongoose.Schema(
  {
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },

    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
    },

    status: {
      type: String,
      enum: Object.values(SEAT_STATUS),
      default: SEAT_STATUS.HOLD,
    },

    expiredHold: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false },
);

const SeatStatus = mongoose.model("SeatStatus", seatStatusSchema);
export default SeatStatus;

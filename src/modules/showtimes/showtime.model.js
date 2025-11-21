import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      default: 80000,
    },

    status: {
      type: Boolean,
      default: true,
    },

    seats: [
      {
        seatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seat",
        },
        label: String,
        type: String,
        status: Boolean,
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;

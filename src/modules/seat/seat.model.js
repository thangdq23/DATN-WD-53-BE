import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    row: {
      type: Number,
      required: true,
    },
    span: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      enum: ["NORMAL", "VIP", "COUPLE"],
      default: "NORMAL",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
seatSchema.index({ id: 1, roomId: 1 }, { unique: true });

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;

import { SEAT_STATUS } from "../../common/constants/seatStatus.js";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";
import { throwError } from "../../common/utils/create-response.js";
import SeatStatus from "../seat-status/seat.status.model.js";
import Seat from "../seat/seat.model.js";
import Showtime from "../showtimes/showtime.model.js";

export const generatePaymentCode = () => {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return Number(`${now}${random}`);
};

export const buildPriceMap = (showtime) => {
  const map = {};
  for (const p of showtime.price || []) {
    map[p.seatType] = p.value;
  }
  return map;
};

export const generateCode = () => {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MPV-${rand}${Date.now().toString().slice(-3)}`;
};

export const checkShowtimeAvaiable = async (showtimeId) => {
  if (!showtimeId) throwError(400, "Showtime ID không được để trống");
  const showtime = await Showtime.findById(showtimeId).lean();
  if (!showtime) throwError(404, "Không tìm thấy showtime");
  if (
    [
      SHOWTIME_STATUS.ENDED,
      SHOWTIME_STATUS.SOLD_OUT,
      SHOWTIME_STATUS.CANCELLED,
    ].includes(showtime.status)
  ) {
    throwError(400, "Lịch chiếu hiện đã ngừng chiếu hoặc hết vé.");
  }
  return showtime;
};

export const checkingHoldSeat = async (userId, showtimeId, seatsPayload) => {
  if (!seatsPayload?.length) throwError(400, "Payload thiếu seat");
  const seats = await SeatStatus.find({
    userId,
    showtimeId,
    seatId: { $in: seatsPayload.map((item) => item._id) },
    status: SEAT_STATUS.HOLD,
  }).populate("seatId");
  const heldSeatIds = new Set(seats.map((s) => s.seatId?._id.toString()));
  const invalidSeatIds = seatsPayload.filter(
    (item) => !heldSeatIds.has(item._id.toString()),
  );
  if (invalidSeatIds.length > 0) {
    throwError(
      400,
      `Các ghế ${invalidSeatIds.map((item) => item.label).join(", ")} hiện không khả dụng hoặc đã hết hạn`,
    );
  }
  return seats;
};

export const updateSeatsToBooked = async (showtimeId, seatId) => {
  const result = await SeatStatus.updateMany(
    {
      seatId: { $in: seatId.map((item) => item._id) },
      showtimeId,
      status: SEAT_STATUS.HOLD,
    },
    { $set: { status: SEAT_STATUS.BOOKED } },
  );
  await Showtime.findByIdAndUpdate(showtimeId, {
    $inc: { bookedCount: seatId.length },
  });
  return {
    modifiedCount: result.modifiedCount,
  };
};

export const checkAvaiableSeat = async (seatIds) => {
  const seats = await Seat.find({
    _id: { $in: seatIds },
  });
  if (!seats.length) throwError(400, "Không có ghế nào khả dụng để đặt vé!");
  const hasSeatDisable = seats.filter((item) => !item.status);
  if (hasSeatDisable.length > 0) {
    throwError(
      400,
      `Những ghế ${hasSeatDisable.map((item) => item.label).join(", ")} không khả dụng!`,
    );
  }
  return seats;
};

export const updateShowtimeStatus = async (showtimeId) => {
  const showtime = await Showtime.findById(showtimeId).populate("roomId");
  if (!showtime) throwError(400, "Showtime không tồn tại");
  const seatBooked = await SeatStatus.find({
    showtimeId,
    status: SEAT_STATUS.BOOKED,
  });
  if (seatBooked.length === showtime.roomId.capacity)
    showtime.status = SHOWTIME_STATUS.SOLD_OUT;
  await showtime.save();
  return showtime;
};

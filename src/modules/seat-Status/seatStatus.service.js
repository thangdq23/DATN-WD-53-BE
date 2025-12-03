import { throwError } from "../../common/utils/create-response.js";
import SeatStatus from "./seatStatus.model.js";

export const getSeatStatusByShowtimeService = async (showtimeId) => {
  const data = await SeatStatus.find({ showtimeId })
    .populate("seatId")
    .populate("userId");
  return data;
};

export const holeSeatService = async ({ seatId, showtimeId, userId }) => {
  const now = new Date();
  const expiredHold = new Date(now.getTime() + 5 * 60 * 1000);
  const exist = await SeatStatus.findOne({ seatId, showtimeId });

  if (exist) {
    if (
      exist.status === "hold" &&
      exist.expiredHold &&
      exist.expiredHold > now &&
      String(exist.userId) !== String(userId)
    ) {
      throwError(400, "Ghế đang được giữ bởi người khác");
    }

    exist.status = "hold";
    exist.userId = userId;
    exist.expiredHold = expiredHold;
    await exist.save();

    return {
      message: "Giữ ghế thành công",
      expiredHold: expiredHold,
      seatStatus: exist,
    };
  }

  const created = await SeatStatus.create({
    seatId,
    showtimeId,
    userId,
    statusL: "hold",
    expiredHold: expiredHold,
  });
  return {
    message: "Giữ ghế thành công",
    expiredHold: expiredHold,
    seatStatus: created,
  };
};

export const releaseSeatService = async ({ seatId, showtimeId, userId }) => {
  const seat = await SeatStatus.findOne({ seatId, showtimeId });

  if (!seat) throwError(400, "Ghế chưa được giữ hoặc đặt");
  if (String(seat.userId) !== String(userId)) {
    throwError(400, "Bạn không phải người giữ ghế này");
  }

  seat.userId = null;
  seat.expiredHold = null;
  seat.status = "hold";
  await seat.save();

  return {
    message: "Hủy giữ ghế thành công",
    seatStatus: seat,
  };
};

export const clearExpiredSeatHoldService = async () => {
  const now = new Date();

  const result = await SeatStatus.updateMany(
    {
      status: "hold",
      expiredHold: { $lt: now },
    },
    {
      $set: {
        userId: null,
        expiredHold: null,
      },
    },
  );

  return result;
};

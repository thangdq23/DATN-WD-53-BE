import { throwError } from "../../common/utils/create-response.js";
import Seat from "../seat/seat.model.js";
import Showtime from "../showtimes/showtime.model.js";
import Order from "./order.model.js";
import { apiQuery } from "../../common/utils/api-query.js";

const buildPriceMap = (showtime) => {
  const map = {};
  for (const p of showtime.price || []) {
    map[p.seatType] = p.value;
  }
  return map;
};

const generateCode = () => {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MPV-${Date.now()}-${rand}`;
};

export const checkoutService = async (payload) => {
  const {
    showtimeId,
    seatIds = [],
    userId = null,
    paymentMethod = "cash",
  } = payload;
  if (!showtimeId) throwError(400, "Thiếu thông tin xuất chiếu!");
  if (!Array.isArray(seatIds) || seatIds.length === 0)
    throwError(400, "Vui lòng chọn ghế!");

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) throwError(404, "Xuất chiếu không tồn tại!");
  if (["cancelled", "ended"].includes(showtime.status))
    throwError(400, "Xuất chiếu không khả dụng để đặt vé!");

  const seats = await Seat.find({ _id: { $in: seatIds } });
  if (seats.length !== seatIds.length)
    throwError(400, "Một số ghế không tồn tại!");
  const invalidSeat = seats.find(
    (s) => `${s.roomId}` !== `${showtime.roomId}` || !s.status,
  );
  if (invalidSeat) throwError(400, `Ghế ${invalidSeat.label} không khả dụng!`);

  const priceMap = buildPriceMap(showtime);
  const seatDetails = seats.map((s) => {
    const base = priceMap[s.type];
    if (base == null)
      throwError(400, `Chưa cấu hình giá cho loại ghế ${s.type}!`);
    const price = Number(base) * Number(s.span || 1);
    return {
      seatId: s._id,
      label: s.label,
      type: s.type,
      span: s.span || 1,
      price,
    };
  });
  const totalAmount = seatDetails.reduce((sum, s) => sum + s.price, 0);

  const reserve = await Showtime.updateOne(
    { _id: showtimeId, reservedSeats: { $nin: seatIds } },
    { $addToSet: { reservedSeats: { $each: seatIds } } },
  );
  if (reserve.matchedCount === 0) {
    throwError(400, "Một số ghế đã được đặt trước! Vui lòng chọn ghế khác.");
  }

  try {
    const order = await Order.create({
      userId,
      showtimeId,
      seats: seatDetails,
      totalAmount,
      paymentMethod,
      status: "paid",
      code: generateCode(),
    });

    return order;
  } catch (err) {
    await Showtime.updateOne(
      { _id: showtimeId },
      { $pull: { reservedSeats: { $in: seatIds } } },
    );
    throw err;
  }
};

export const getMyOrdersService = async (userId, query) => {
  if (!userId) throwError(400, "Thiếu thông tin người dùng!");
  const filters = { ...query, userId };
  const result = await apiQuery(Order, filters, {
    populate: [
      {
        path: "showtimeId",
        select: "startTime endTime roomId movieId",
        populate: [
          { path: "movieId", select: "name poster duration" },
          { path: "roomId", select: "name" },
        ],
      },
    ],
  });
  return result;
};

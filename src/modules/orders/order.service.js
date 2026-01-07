import { PayOS } from "@payos/node";
import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Order from "./order.model.js";
import {
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  PAYOS_CLIENT_ID,
} from "../../common/configs/environment.js";
import {
  checkingHoldSeat,
  checkShowtimeAvaiable,
  generateCode,
  generatePaymentCode,
  updateSeatsToBooked,
  updateShowtimeStatus,
} from "./order.utils.js";
import { checkAvaiableMovie } from "../showtimes/showtime.utils.js";
import { extendHoldSeatTime } from "../seat-status/seat.status.service.js";

const payOS = new PayOS({
  clientId: PAYOS_CLIENT_ID,
  apiKey: PAYOS_API_KEY,
  checksumKey: PAYOS_CHECKSUM_KEY,
});

export const checkoutService = async (payload) => {
  const { seats, showtimeId, userId } = payload;
  if (!seats.length) throwError(400, "Yêu cầu gửi lên ghế");
  const ticketId = generateCode();
  const movie = await checkAvaiableMovie(payload.movieId);
  await checkShowtimeAvaiable(payload.showtimeId);
  await checkingHoldSeat(payload.userId, payload.showtimeId, payload.seats);
  const codePayment = generatePaymentCode();
  const order = await Order.create({
    ...payload,
    moviePoster: movie.poster,
    ticketId,
    codePayment,
  });
  const paymentData = {
    orderCode: codePayment,
    amount: order.totalAmount,
    description: `Thanh toán đơn hàng`,
    returnUrl: "http://localhost:8000/api/order/return",
    cancelUrl: "http://localhost:8000/api/order/return",
  };
  const paymentLink = await payOS.paymentRequests.create(paymentData);
  const seatIds = seats.map((item) => item.seatId);
  await extendHoldSeatTime(userId, showtimeId, seatIds);
  return paymentLink.checkoutUrl;
};

export const getAllOrderService = async (query) => {
  const res = await apiQuery(Order, query);
  return res;
};

export const getMyOrdersService = async (userId, query) => {
  if (!userId) throwError(400, "Thiếu thông tin người dùng!");
  const filters = { ...query, userId };
  const result = await apiQuery(Order, filters);
  return result;
};

export const getDetailOrderService = async (id) => {
  const order = await Order.findById(id);
  if (!order) throwError(400, "Không tìm thấy đơn hàng");
  return order;
};

export const checkoutReturnPayosService = async (params) => {
  const order = await Order.findOne({ codePayment: params.orderCode });
  if (!order) return false;
  const seatIds = order.seats.map((item) => item.seatId);
  await checkingHoldSeat(order.userId, order.showtimeId, seatIds);
  await updateSeatsToBooked(order.showtimeId, seatIds);
  await updateShowtimeStatus(order.showtimeId);
  order.isPaid = true;
  order.status = "buyed";
  await order.save();
  return order;
};

export const verifyOrderService = async (code) => {
  if (!code) return { order: null, scanStatus: "INVALID" };
  const clean = String(code).trim().toUpperCase();

  let order = await Order.findOne({ ticketId: clean });
  if (!order) {
    const prefixed = clean.startsWith("MPV-") ? clean : `MPV-${clean}`;
    order = await Order.findOne({ ticketId: prefixed });
  }
  if (!order) return { order: null, scanStatus: "INVALID" };

  const now = new Date();
  if (order.isPaid === "cancelled") return { order, scanStatus: "CANCELLED" };
  if (order.status === "used") return { order, scanStatus: "USED" };
  if (new Date(order.startTime) < now)
    return { order, scanStatus: "EXPIRED" };

  return { order, scanStatus: "OK" };
};

export const updateOrderStatusService = async (id, status, user) => {
  const order = await Order.findById(id);
  if (!order) throwError(400, "Không tìm thấy đơn hàng");

  const allowed = ["pending", "buyed", "used", "cancelled"];
  if (!allowed.includes(status))
    throwError(400, "Trạng thái không hợp lệ");

  const now = new Date();
  if (status === "used") {
    if (order.isPaid !== "success")
      throwError(400, "Vé chưa được thanh toán");
    if (order.status === "used")
      throwError(400, "Vé đã được quét");
    if (order.status === "cancelled")
      throwError(400, "Vé đã bị huỷ");
    if (new Date(order.startTime) < now)
      throwError(400, "Showtime đã kết thúc");
  }

  order.status = status;
  await order.save();
  return order;
};
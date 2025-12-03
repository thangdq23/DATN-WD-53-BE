import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  getSeatStatusByShowtimeService,
  holeSeatService,
  releaseSeatService,
} from "./seatStatus.service.js";

export const holdSeat = handleAsync(async (req, res) => {
  const { seatId, showtimeId } = req.body;
  const userId = req.user._id;
  const result = await holeSeatService({ seatId, showtimeId, userId });

  return createResponse(res, 200, "Giữ ghế thành công", result);
});

export const releaseSeat = handleAsync(async (req, res) => {
  const { seatId, showtimeId } = req.body;
  const userId = req.user._id;
  const result = await releaseSeatService({ seatId, showtimeId, userId });

  return createResponse(res, 200, "Hủy giữ ghế thành công", result);
});

export const getSeatStatusByShowtime = handleAsync(async (req, res) => {
  const { showtimeId } = req.params;
  const data = await getSeatStatusByShowtimeService(showtimeId);

  return createResponse(res, 200, "Lấy trạng thái ghế thành công", data);
});

import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createMultipleShowtimesService,
  createShowtimeService,
  updateShowtimeService,
} from "./showtime.service.js";

export const createShowtime = handleAsync(async (req, res) => {
  const data = await createShowtimeService(req.body);
  return createResponse(res, 201, "Tạo lịch chiếu thành công!", data);
});

export const createMultipleShowtimes = handleAsync(async (req, res) => {
  const data = await createMultipleShowtimesService(req.body);
  return createResponse(res, 201, "Tạo nhiều lịch chiếu thành công!", data);
});

export const updateShowtimeStatus = handleAsync(async (req, res) => {
  const data = await updateShowtimeService(req.params.id);
  return createResponse(res, 200, data.message, data.data);
});

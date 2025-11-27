import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import dayjs from "dayjs";
import {
  createManyShowtimeService,
  createShowtimeService,
  getAllShowtimeService,
  getDetailShowtimeService,
  updateShowtimeService,
} from "./showtime.service.js";
import { DAY_NAMES } from "../../common/constants/showtime.js";

export const getAllShowtime = handleAsync(async (req, res) => {
  const { query } = req;
  const { data, meta } = await getAllShowtimeService(query);
  return createResponse(res, 200, "OK", data, meta);
});

export const getDetailShowtime = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailShowtimeService(id);
  return createResponse(res, 200, "OK", data);
});

export const createShowtime = handleAsync(async (req, res) => {
  const { body } = req;
  const created = await createShowtimeService(body);
  return createResponse(
    res,
    201,
    `Tạo lịch chiếu ${dayjs(created.startTime).format("HH:mm [Ngày] DD [Tháng] MM [Năm] YYYY")} thành công`,
    created,
  );
});

export const createManyShowtime = handleAsync(async (req, res) => {
  const { body } = req;
  const created = await createManyShowtimeService(body);
  const dayNamesSelected = body.dayOfWeeks
    .map((day) => DAY_NAMES[day])
    .join(", ");
  const message = `Tạo thành công ${created.length} xuất chiếu. Từ ngày ${dayjs(body.startDate).format("[Ngày] DD [Tháng] MM [Năm] YYYY")} đến ${dayjs(body.endDate).format("[Ngày] DD [Tháng] MM [Năm] YYYY")} với các ngày trong tuần: ${dayNamesSelected}`;
  return createResponse(res, 201, message, created);
});

export const updateShowtimeStatus = handleAsync(async (req, res) => {
  const data = await updateShowtimeService(req.params.id);
  return createResponse(res, 200, data.message, data.data);
});

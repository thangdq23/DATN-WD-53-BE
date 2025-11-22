import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { getAllShowtimeService, getDetailShowtimeService } from "./showtime.service.js";

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

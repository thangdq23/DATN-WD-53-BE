import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Showtime from "./showtime.model.js";

export const getAllShowtimeService = async (query) => {
  const result = await apiQuery(Showtime, query, {
    populate: [
      { path: "movieId", select: "name poster status statusRelease duration" },
      { path: "roomId", select: "name status" },
    ],
  });
  return result;
};

export const getDetailShowtimeService = async (id) => {
  const data = await Showtime.findById(id)
    .populate({ path: "movieId", select: "name poster status statusRelease duration" })
    .populate({ path: "roomId", select: "name status" });
  if (!data) throwError(404, "Không tìm thấy lịch chiếu!");
  return data;
};

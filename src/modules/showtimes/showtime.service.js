import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Movie from "../movie/movie.model.js";
import Room from "../rooms/room.model.js";
import Seat from "../seat/seat.model.js";
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
    .populate({
      path: "movieId",
      select: "name poster status statusRelease duration",
    })
    .populate({ path: "roomId", select: "name status" });
  if (!data) throwError(404, "Không tìm thấy lịch chiếu!");
  return data;
};
export const createShowtimeService = async (payload) => {
  const { movieId, roomId, startTime, endTime, price } = payload;

  const movie = await Movie.findById(movieId);
  if (!movie) throwError(404, "Phim không tồn tại!");

  const room = await Room.findById(roomId);
  if (!room) throwError(404, "Phòng chiếu không tồn tại!");

  const conflict = await Showtime.findOne({
    roomId,
    $or: [
      {
        startTime: { $lte: endTime },
        endTime: { $gte: startTime },
      },
    ],
  });
  if (conflict) throwError(400, "Phòng đã có lịch chiếu trùng thời gian!");

  const seats = await Seat.find({ roomId });
  const mappedSeats = seats.map((s) => ({
    seatId: s._id,
    label: s.label,
    type: s.type,
    status: s.status,
    isBooked: false,
  }));

  const created = await Showtime.create({
    movieId,
    roomId,
    startTime,
    endTime,
    price,
    seats: mappedSeats,
  });

  return created;
};

export const createMultipleShowtimesService = async (payload) => {
  const { movieId, roomId, itmes } = payload;

  const movie = await Movie.findById(movieId);
  if (!movie) throwError(404, "Phim không tồn tại!");

  const room = await Room.findById(roomId);
  if (!room) throwError(404, "Phòng chiếu không tồn tại!");

  const seats = await Seat.find({ roomId });

  const seatSnapshot = seats.map((s) => ({
    seatId: s._id,
    label: s.label,
    type: s.type,
    status: s.status,
    isBooked: false,
  }));

  const results = [];

  for (const item of itmes) {
    const { startTime, endTime } = item;
    const conflict = await Showtime.findOne({
      roomId,
      $or: [{ startTime: { $lte: endTime }, endTime: { $gte: startTime } }],
    });

    if (conflict)
      throwError(
        400,
        `Phòng đã có lịch chiếu trùng thời gian từ ${startTime} - ${endTime}!`,
      );

    results.push({
      movieId,
      roomId,
      startTime,
      endTime,
      price: item.price || payload.price,
      seats: seatSnapshot,
    });
  }

  const created = await Showtime.insertMany(results);
  return created;
};

export const updateShowtimeService = async (id) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) throwError(404, "Lịch chiếu không tồn tại!");

  showtime.status = !showtime.status;
  const updated = await showtime.save();
  return {
    data: updated,
    message: updated.status
      ? "Kích hoạt lịch chiếu thành công!"
      : "Đã đóng lịch chiếu!",
  };
};

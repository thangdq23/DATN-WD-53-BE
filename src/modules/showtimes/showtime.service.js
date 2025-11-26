import dayjs from "dayjs";
import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Movie from "../movie/movie.model.js";
import Room from "../rooms/room.model.js";
import Seat from "../seat/seat.model.js";
import Showtime from "./showtime.model.js";
import {
  calculatorEndTime,
  checkAvaiableMovie,
  checkAvaiableRoom,
  checkConflictShowtime,
} from "./showtime.utils.js";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";
import e from "express";

export const getAllShowtimeService = async (query) => {
  const showtimes = await apiQuery(Showtime, query, {
    populate: [{ path: "movieId" }, { path: "roomId" }],
  });
  return showtimes;
};

export const getDetailShowtimeService = async (id) => {
  const showtime = (await Showtime.findById(id))
    .populated("movieId")
    .populate("roomId");
  return showtime;
};

export const getMovieHasShowtimeService = async (query) => {
  const { page = 1, limit = 10, ...otherQuery } = query;
  const { data } = await getAllShowtimeService(otherQuery);

  const moviesMap = new Map();

  for (const showtime of data) {
    const movieId = `${showtime.movieId._id}`;
    const startTime = dayjs(showtime.startTime);
    const dayOfWeek = startTime.day();
    if (moviesMap.has(movieId)) {
      const existing = moviesMap.get(movieId);
      existing.showtimeCount += 1;
      if (startTime.isBefore(existing.firstStartTime)) {
        existing.firstStartTime = startTime;
      }
      if (startTime.isAfter(existing.lastStartTime)) {
        existing.lastStartTime = startTime;
      }
      existing.dayOfWeek.add(dayOfWeek);
    } else {
      moviesMap.set(movieId, {
        ...showtime.movieId.toObject(),
        showtimeCount: 1,
        firstStartTime: startTime,
        lastStartTime: startTime,
        dayOfWeek: new Set([dayOfWeek]),
      });
    }
  }
  const movies = Array.from(moviesMap.values()).map((movie) => ({
    ...movie,
    firstStartTime: movie.firstStartTime.toDate(),
    lastStartTime: movie.lastStartTime.toDate(),
    dayOfWeek: Array.from(movie.dayOfWeek).sort(),
  }));

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const pagedMovies = movies.slice(startIndex, endIndex);

  return {
    data: pagedMovies,
    meta: {
      total: movies.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(movies.length / limit),
    },
  };
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

export const updateShowtimeService = async (payload, id) => {
  const { roomId, startTime, endTime } = payload;
  const showtime = await Showtime.findById(id);
  if (!showtime) throwError(404, "Xuất chiếu không tồn tại!");
  if (showtime.status === SHOWTIME_STATUS.IN_PROGRESS)
    throwError(400, "Không thể cập nhật xuất chiếu đang được chiếu!");
  const conflict = await checkConflictShowtime(roomId, startTime, endTime, id);
  if (conflict)
    throwError(400, `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
  );
  showtime.set(payload);
  await showtime.save();

  return showtime;
};

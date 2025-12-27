import dayjs from "dayjs";
import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Showtime from "./showtime.model.js";
import {
  calculatorEndTime,
  checkAvaiableMovie,
  checkAvaiableRoom,
  checkConflictShowtime,
  generateShowtime,
} from "./showtime.utils.js";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";
import { createPagination } from "../../common/utils/create-pagination.js";

export const getAllShowtimeService = async (query) => {
  const showtimes = await apiQuery(Showtime, query, {
    populate: [{ path: "movieId" }, { path: "roomId" }],
  });
  return showtimes;
};

export const getShowtimesByWeekdayService = async (query) => {
  const { page = 1, limit = 10, pagination = true, ...otherQuery } = query;
  const showtimes = await getAllShowtimeService(otherQuery);
  const map = {};
  showtimes.data.forEach((st) => {
    if (!st.movieId) return;
    const dateKey = dayjs(st.startTime).format("YYYY-MM-DD");
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(st);
  });
  return pagination ? createPagination(map, Number(page), Number(limit)) : map;
};

export const getDetailShowtimeService = async (id) => {
  const showtime = await Showtime.findById(id)
    .populate("movieId")
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
  const { movieId, roomId, startTime } = payload;
  if (dayjs(startTime).isBefore(dayjs()))
    throwError(400, "Thời gian chiếu phải là ngày tương lai!");
  if (dayjs(startTime).isBefore(dayjs().add(30, "minutes")))
    throwError(
      400,
      "Thời gian chiếu phải cách thời gian hiện tại ít nhất 30 phút!",
    );

  const [movie] = await Promise.all([
    checkAvaiableMovie(movieId),
    checkAvaiableRoom(roomId),
  ]);

  const { dayOfWeek, endTime } = calculatorEndTime(movie.duration, startTime);
  const conflict = await checkConflictShowtime(roomId, startTime, endTime);
  console.log(conflict);

  if (conflict) {
    throwError(
      400,
      `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
    );
  }

  const showtime = await Showtime.create({ ...payload, dayOfWeek, endTime });
  return showtime;
};

export const createManyShowtimeService = async (payload) => {
  const { startDate, endDate, dayOfWeeks, fixedHour, ...otherPayload } =
    payload;
  if (!dayjs(startDate).isBefore(dayjs(endDate))) {
    throwError(400, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
  }

  const showtimes = await generateShowtime(
    otherPayload,
    startDate,
    endDate,
    dayOfWeeks,
    fixedHour,
  );

  const createShowtimes = Showtime.insertMany(showtimes);
  return createShowtimes;
};

export const updateShowtimeService = async (payload, id) => {
  const { roomId, startTime, endTime } = payload;
  const showtime = await Showtime.findById(id);
  if (!showtime) throwError(404, "Xuất chiếu không tồn tại!");
  if (showtime.status === SHOWTIME_STATUS.IN_PROGRESS)
    throwError(400, "Không thể cập nhật xuất chiếu đang được chiếu!");
  const conflict = await checkConflictShowtime(roomId, startTime, endTime, id);
  if (conflict)
    throwError(
      400,
      `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
    );
  showtime.set(payload);
  await showtime.save();

  return showtime;
};

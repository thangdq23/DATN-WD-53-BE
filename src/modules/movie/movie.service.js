import dayjs from "dayjs";
import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Movie from "./movie.model.js";

export const getAllMovieService = async (query) => {
  const result = await apiQuery(Movie, query, {
    populate: [
      {
        path: "genreIds",
        select: "name status",
      },
    ],
  });
  const newData = result.data.map((movie) => ({
    ...movie.toObject(),
    genreIds: movie.genreIds?.filter((genre) => genre.status) || [],
  }));
  return {
    ...result,
    data: newData,
  };
};

export const getDetailMovieService = async (id) => {
  const movie = await Movie.findById(id).populate({
    path: "genreIds",
    select: "name status",
  });
  const movieObj = movie.toObject();
  movieObj.genreIds = movieObj.genreIds?.filter((genre) => genre.status) || [];
  return movieObj;
};

export const createMovieService = async (payload) => {
  const existingMovie = await Movie.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (new Date(payload.releaseDate) > new Date(payload.endDate))
    throwError(400, "Thời gian ngừng chiếu phải lớn hơn ngày bắt đầu chiếu!");
  if (existingMovie) throwError(400, "Phim này đã tồn tại trong hệ thống!");
  if (new Date(payload.releaseDate) < new Date()) {
    throwError(400, "Ngày công chiếu phải là ngày trong tương lai!");
  }
  const movie = await Movie.create({ ...payload });
  return movie;
};

export const updateMovieService = async (id, payload) => {
  const movie = await Movie.findById(id);
  if (!movie) throwError(404, "Không tìm thấy phim trong hệ thống!");
  if (payload.name) {
    const existingMovie = await Movie.findOne({
      _id: { $ne: id },
      name: { $regex: `^${payload.name}$`, $options: "i" },
    });
    if (existingMovie)
      throwError(400, "Tên phim này đã tồn tại trong hệ thống!");
  }
  const releaseDate = payload.releaseDate
    ? dayjs(payload.releaseDate)
    : dayjs(movie.releaseDate);
  const endDate = payload.endDate
    ? dayjs(payload.endDate)
    : dayjs(movie.endDate);
  const now = dayjs();
  if (dayjs(movie.releaseDate).isBefore(now) && payload.releaseDate) {
    throwError(
      400,
      "Không thể thay đổi ngày công chiếu khi phim đã bắt đầu chiếu!",
    );
  }
  if (!endDate.isAfter(releaseDate)) {
    throwError(400, "Ngày ngừng chiếu phải sau ngày công chiếu!");
  }
  if (releaseDate.isAfter(now)) {
    const minEndDate = releaseDate.add(7, "day");
    const maxEndDate = releaseDate.add(1, "year");
    if (endDate.isBefore(minEndDate)) {
      throwError(
        400,
        "Ngày ngừng chiếu phải cách ngày công chiếu ít nhất 1 tuần!",
      );
    }
    if (endDate.isAfter(maxEndDate)) {
      throwError(400, "Phim không được chiếu quá 1 năm kể từ ngày công chiếu!");
    }
  }
  if (now.isBefore(releaseDate)) {
    movie.statusRelease = "upcoming";
  } else if (now.isAfter(endDate)) {
    movie.statusRelease = "ngungChieu";
  } else {
    movie.statusRelease = "nowShowing";
  }
  Object.assign(movie, payload);
  await movie.save();

  return movie;
};

export const updateStatusMovieService = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) throwError(400, "Không tìm thấy phim!");
  movie.status = !movie.status;
  await movie.save();
  return {
    data: movie,
    message: movie.status
      ? "Phim đã được kích hoạt trở lại. Các xuất chiếu sẽ hoạt động trở lại!"
      : "Ẩn phim thành công. Các xuất chiếu sẽ bị tạm ngưng!",
  };
};

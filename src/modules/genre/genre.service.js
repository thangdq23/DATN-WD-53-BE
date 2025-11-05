import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Genre from "./genre.model.js";

export const getAllGenreService = async (query) => {
  const data = await apiQuery(Genre, query);
  return data;
};

export const getDetailGenreService = async (id) => {
  const data = await Genre.findById(id);
  return data;
};

export const createGenreService = async (payload) => {
  const { name } = payload;
  const existingGenre = await Genre.findOne({
    name,
  });
  if (existingGenre) {
    throwError(400, "Thể loại này đã tồn tại!");
  }
  const newGenre = await Genre.create({ ...payload });
  return newGenre;
};

export const updateGenreService = async (id, payload) => {
  const { name } = payload;
  const existingGenre = await Genre.findOne({
    _id: { $ne: id },
    name,
  });
  if (existingGenre) throwError(400, "Thể loại này đã tồn tại!");
  const updatedGenre = await Genre.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedGenre) throwError(404, "Không tìm thấy thể loại cần cập nhật!");
  return updatedGenre;
};

export const updateStatusGenreService = async (id) => {
  const findGenre = await Genre.findById(id);
  if (!findGenre) throwError(400, "Không tìm thấy thể loại này!");
  findGenre.status = !findGenre.status;
  const newGenre = await findGenre.save();
  return {
    message: findGenre.status ? "Mở khoá thành công!" : "Khoá thành công!",
    data: newGenre,
  };
};

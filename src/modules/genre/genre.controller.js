import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createGenreService,
  updateGenreService,
  updateStatusGenreService,
} from "./genre.service.js";

export const createGenre = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createGenreService(body);
  return createResponse(res, 201, "Tạo thể loại thành công", data);
});

export const updateGenre = handleAsync(async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  const data = await updateGenreService(id, body);
  return createResponse(res, 200, "Cập nhật thể loại thành công", data);
});

export const updateStatusGenre = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateStatusGenreService(id);
  return createResponse(res, 200, data.message, data.data);
});

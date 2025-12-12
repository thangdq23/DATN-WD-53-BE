import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createUserService,
  getAllUserService,
  updateUserService,
} from "./user.service.js";

export const getAllUser = handleAsync(async (req, res) => {
  const users = await getAllUserService(req.query);
  return createResponse(
    res,
    200,
    "Lấy danh sách thành công!",
    users.data,
    users.meta,
  );
});

export const createUser = handleAsync(async (req, res) => {
  const users = await createUserService(req.body);
  return createResponse(res, 201, "Tạo user thành công!", users);
});

export const updateUser = handleAsync(async (req, res) => {
  const users = await updateUserService(req.params.id, req.body);
  return createResponse(res, 200, "Cập nhật user thành công", users);
});

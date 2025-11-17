import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { createRoomService, updateRoomService } from "./room.service.js";

export const createRoom = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createRoomService(body);
  return createResponse(res, 201, "Tạo phòng chiếu mới thành công", data);
});

export const updateRoom = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const data = await updateRoomService(id, body);
  return createResponse(res, 200, "Cập nhật phòng chiếu thành công", data);
});

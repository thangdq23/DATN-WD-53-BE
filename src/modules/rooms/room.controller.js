import handleAsync from "../../common/utils/async-handler";
import createResponse from "../../common/utils/create-response";
import { createRoomService, updateRoomService } from "./room.service";

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

import { throwError } from "../../common/utils/create-response";
import Room from "./room.model";

export const createRoomService = async (payload) => {
  const existing = await Room.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existing) throwError(400, "Phòng chiếu này đã tồn tại");

  const room = await Room.create(payload);
  return room;
};

export const updateRoomService = async (id, payload) => {
  const existing = await Room.findOne({
    _id: { $ne: id },
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });

  if (existing) throwError(400, "Tên phòng chiếu này đã được sử dụng");

  const updated = await Room.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) throwError(404, "Phòng chiếu này không tồn tại");
  return updated;
};

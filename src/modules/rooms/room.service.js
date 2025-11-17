import { throwError } from "../../common/utils/create-response.js";
import Seat from "../seat/seat.model.js";
import Room from "./room.model.js";

export const createRoomService = async (payload) => {
  const existing = await Room.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existing) throwError(400, "Phòng chiếu này đã tồn tại trong hệ thống!");

  const room = await Room.create({ ...payload });
  const seatWithId = payload.seat.map((item) => ({
    ...item,
    roomId: room._id,
  }));
  const seats = await Seat.insertMany(seatWithId);
  await room.save();
  return { ...room.toObject(), seats };
};

export const updateRoomService = async (id, payload) => {
  const { seats, ...rest } = payload;
  const existed = await Room.findOne({
    _id: { $ne: id },
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existed) throwError(400, "Phòng chiếu này đã tồn tại trong hệ thống!");

  const updatedRoom = await Room.findByIdAndUpdate(id, rest, { new: true });
  if (!updatedRoom)
    throwError(404, "Phòng chiếu không tồn tại trong hệ thống!");
  if (seats && seats.length > 0) {
    const existingSeats = await Seat.find({ roomId: id });
    const bulkops = seats
      .map((seat) => {
        const exist = existingSeats.find((s) => s._id.toString() === seat._id);
        if (!exist) return null;
        if (exist.status !== seat.status || exist.type !== seat.type) {
          return {
            updateOne: {
              filter: { _id: seat._id, roomId: id },
              update: {
                $set: {
                  status: seat.status,
                  type: seat.type,
                },
              },
            },
          };
        }
        return null;
      })
      .filter(Boolean);
    if (bulkops.length > 0) {
      await Seat.bulkWrite(bulkops);
    }
  }
  return updatedRoom;
};

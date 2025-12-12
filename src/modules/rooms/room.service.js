import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import Seat from "../seat/seat.model.js";
import Room from "./room.model.js";

export const getSeatByRoomService = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throwError(404, "Không tìm thấy phòng chiếu!");
  const seats = await Seat.find({ roomId: room._id });
  return { ...room.toObject(), seats };
};

export const getAllRoomService = async (query) => {
  const data = await apiQuery(Room, query);
  return data;
};

export const getDetailRoomService = async (id) => {
  const data = await Room.findById(id);
  return data;
};

export const createRoomService = async (payload) => {
  const existing = await Room.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existing) throwError(400, "Phòng chiếu này đã tồn tại trong hệ thống!");

  const room = await Room.create({ ...payload });
  const seatWithId = payload.seats.map((item) => ({
    ...item,
    roomId: room._id,
  }));
  const seats = await Seat.insertMany(seatWithId);
  await room.save();
  return { ...room.toObject(), seats };
};

export const updateRoomService = async (id, payload) => {
  const { seats, rows, cols, ...rest } = payload;

  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { ...rest, rows, cols },
    { new: true },
  );
  if (!updatedRoom) throwError(404, "Phòng chiếu không tồn tại!");
  const existingSeats = await Seat.find({ roomId: id });
  const seatIdsFromFE = seats.map((s) => s.id);
  await Seat.deleteMany({
    roomId: id,
    id: { $nin: seatIdsFromFE },
  });
  const bulkOps = [];
  seats.forEach((feSeat) => {
    const dbSeat = existingSeats.find((d) => d.id === feSeat.id);
    if (!dbSeat) {
      bulkOps.push({
        insertOne: {
          document: {
            id: feSeat.id,
            roomId: id,
            row: feSeat.row,
            col: feSeat.col,
            label: feSeat.label,
            type: feSeat.type,
            status: feSeat.status,
            span: feSeat.span || 1,
          },
        },
      });
      return;
    }
    const changed =
      dbSeat.row !== feSeat.row ||
      dbSeat.col !== feSeat.col ||
      dbSeat.label !== feSeat.label ||
      dbSeat.type !== feSeat.type ||
      dbSeat.status !== feSeat.status ||
      dbSeat.span !== (feSeat.span || 1);
    if(changed) {
      bulkOps.push({
        deleteOne: {
          filter: { roomId: id, id: feSeat.id },
        },
      });
      bulkOps.push({
        insertOne: {
          document: {
            id: feSeat.id,
            roomId: id,
            row: feSeat.row,
            col: feSeat.col,
            label: feSeat.label,
            type: feSeat.type,
            status: feSeat.status,
            span: feSeat.span || 1,
          },
        },
      });
    }  
  });
  if (bulkOps.length > 0) {
    await Seat.bulkWrite(bulkOps);
  }
return updatedRoom;
};

export const updateRoomStatusService = async (id) => {
  const findRoom = await Room.findById(id);
  if (!findRoom) throwError(404, "Phòng chiếu không tồn tại!");
  findRoom.status = !findRoom.status;
  const updated = await findRoom.save();
  return {
    data: updated,
    message: updated.status
      ? "Kích hoạt phòng chiếu thành công. Các xuất chiếu sẽ hoạt động trở lại"
      : "Khoá phòng thành công. Các xuất chiếu sẽ bị tạm ngưng!",
  };
};

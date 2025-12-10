import dayjs from "dayjs";
import cron from "node-cron";
import SeatStatus from "../modules/seat-status/seat.status.model.js";
import { SEAT_STATUS } from "../common/constants/seatStatus.js";
import { getIO } from "../modules/socket/socket.instance.js";

export const cleanExpiredSeats = async () => {
  try {
    const now = dayjs().toDate();
    console.log(now);

    const expiredSeats = await SeatStatus.find({
      status: SEAT_STATUS.HOLD,
      expiredHold: { $lt: now },
    });
    if (expiredSeats.length > 0) {
      const scheduleIds = expiredSeats.map((seat) =>
        seat.showtimeId.toString(),
      );
      const result = await SeatStatus.deleteMany({
        _id: { $in: expiredSeats.map((seat) => seat._id) },
      });
      console.log(
        `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Deleted ${result.deletedCount} expired hold seats.`,
      );
      const io = getIO();
      scheduleIds.forEach((scheduleId) => {
        io.to(scheduleId).emit("seatUpdated", {
          message: "Một số ghế giữ chỗ đã hết hạn!",
          deletedCount: result.deletedCount,
          timestamp: dayjs().toISOString(),
        });
      });
    }
  } catch (error) {
    console.error("Lỗi khi dọn dẹp các ghế giữ chỗ đã hết hạn:", error);
  }
};

let isCronStarted = false;

export const seatStatusJob = () => {
  if (isCronStarted) return;
  isCronStarted = true;
  console.log("✓ Công việc dọn dẹp ghế đã bắt đầu.");
  cleanExpiredSeats();
  cron.schedule(
    "* * * * *",
    async () => {
      console.log("✓ Runtime dọn dẹp ghế.");
      await cleanExpiredSeats();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};

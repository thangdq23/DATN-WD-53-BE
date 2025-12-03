import cron from "node-cron";
import { clearExpiredSeatHoldService } from "../modules/seat-Status/seatStatus.service.js";
export const seatStatusJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await clearExpiredSeatHoldService();
      console.log(
        `Dọn ghế giữ tạm hết hạn: ${result.modifiedCount || 0} ghế được reset`,
      );
    } catch (error) {
      console.log("Lỗi khi dọn ghế hết hạn:", error);
    }
  });
};

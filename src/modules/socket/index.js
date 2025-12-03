import { Server } from "socket.io";
import { socketConfig } from "../../common/configs/socket";
import { setIO } from "./socket.instance";
import authSocketMiddleware from "./middlewares/auth.socket.middleware";
import seatSocketHandler from "./modules/seat.socket.handler";
import { clearExpiredSeatHoldService } from "../seat-Status/seatStatus.service";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, socketConfig);

  setIO(io);

  io.use(authSocketMiddleware);

  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);
    seatSocketHandler(socket, io);
    socket.on("closeTabCheckout", (data) => {
      console.log("Client đóng tab:", socket.id, data);
      clearExpiredSeatHoldService(data.userId);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
  return io;
};

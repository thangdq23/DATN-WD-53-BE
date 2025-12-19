import { Router } from "express";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";
import {
  extendHoldSeat,
  getSeatShowtime,
  toggleSeat,
  unHoldSeat,
} from "./seat.status.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";

const seatStatusRoute = Router();
seatStatusRoute.get("/seat-map/:roomId/:showtimeId", getSeatShowtime);
seatStatusRoute.use(authenticate(JWT_ACCESS_SECRET));
seatStatusRoute.post("/toggle-seat", toggleSeat);
seatStatusRoute.patch("/un-hold", unHoldSeat);
seatStatusRoute.patch("/extend-hold/:showtimeId", extendHoldSeat);
export default seatStatusRoute;

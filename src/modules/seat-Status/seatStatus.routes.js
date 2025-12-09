import { Router } from "express";
import { getSeatByRoom } from "../rooms/room.controller.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";
import { extendHoldSeat, unHoldSeat } from "./seatStatus.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";

const seatStatusRoute = Router();
seatStatusRoute.get("/seat-map/:rooId/:showtimeId", getSeatByRoom);
seatStatusRoute.use(authenticate(JWT_ACCESS_SECRET));
seatStatusRoute.post("/toggle-seat", unHoldSeat);
seatStatusRoute.patch("/un-hold", unHoldSeat);
seatStatusRoute.patch("/extend-hold/:showtimeId", extendHoldSeat);
export default seatStatusRoute;

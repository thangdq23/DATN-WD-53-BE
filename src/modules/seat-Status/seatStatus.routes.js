import { Router } from "express";
import {
  getSeatStatusByShowtime,
  holdSeat,
  releaseSeat,
} from "./seatStatus.controller.js";

const seatStatus = Router();
seatStatus.post("/hold", holdSeat);
seatStatus.post("/release", releaseSeat);
seatStatus.get("/:showtimeId", getSeatStatusByShowtime);

export default seatStatus;

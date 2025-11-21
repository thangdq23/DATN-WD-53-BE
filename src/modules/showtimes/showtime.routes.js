import { Router } from "express";
import {
  createMultipleShowtimes,
  createShowtime,
  updateShowtimeStatus,
} from "./showtime.controller.js";

const showtimeRoute = Router();

showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/multiple", createMultipleShowtimes);
showtimeRoute.patch("/:id/status", updateShowtimeStatus);
export default showtimeRoute;

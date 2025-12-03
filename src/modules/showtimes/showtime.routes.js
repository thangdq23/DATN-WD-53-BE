import { Router } from "express";
import {
  createManyShowtime,
  createShowtime,
  getAllShowtime,
  getMovieHasShowtime,
  updateShowtime,
  getShowtimesByWeekday,
} from "./showtime.controller.js";

const showtimeRoute = Router();
showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/weekday", getShowtimesByWeekday);
showtimeRoute.get("/movie", getMovieHasShowtime);
showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/many", createManyShowtime);
showtimeRoute.patch("/update/:id", updateShowtime);
export default showtimeRoute;

import { Router } from "express";
import {
  createManyShowtime,
  createShowtime,
  getAllShowtime,
  getMovieHasShowtime,
  updateShowtime,
  getShowtimesByWeekday,
  getDetailShowtime,
} from "./showtime.controller.js";

const showtimeRoute = Router();
showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/detail/:id", getDetailShowtime);
showtimeRoute.get("/weekday", getShowtimesByWeekday);
showtimeRoute.get("/movie", getMovieHasShowtime);
showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/many", createManyShowtime);
showtimeRoute.patch("/update/:id", updateShowtime);
export default showtimeRoute;

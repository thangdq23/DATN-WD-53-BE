import { Router } from "express";
import {
  createManyShowtime,
  createShowtime,
  getAllShowtime,
  getDetailShowtime,
  updateShowtimeStatus,
} from "./showtime.controller.js";

const showtimeRoute = Router();
showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/:id", getDetailShowtime);
showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/multiple", createManyShowtime);
showtimeRoute.patch("/:id/status", updateShowtimeStatus);
export default showtimeRoute;

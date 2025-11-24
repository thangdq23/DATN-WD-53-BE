import { Router } from "express";
import { getAllShowtime, getDetailShowtime } from "./showtime.controller.js";

const showtimeRoute = Router();

showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/detail/:id", getDetailShowtime);

export default showtimeRoute;

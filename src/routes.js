import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import genreRoute from "./modules/genre/genre.routes.js";
import movieRoute from "./modules/movie/movie.routes.js";
import roomRoute from "./modules/rooms/room.routes.js";

import showtimeRoute from "./modules/showtimes/showtime.routes.js";

import seatStatus from "./modules/seat-Status/seatStatus.routes.js";

import checkoutRoute from "./modules/orders/order.routes.js";
const routes = Router();

routes.use("/auth", authRoute);
routes.use("/genre", genreRoute);
routes.use("/movie", movieRoute);
routes.use("/room", roomRoute);
routes.use("/showtime", showtimeRoute);
routes.use("/seatStatus", seatStatus);
routes.use("/checkout", checkoutRoute);

export default routes;
